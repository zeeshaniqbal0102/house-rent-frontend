<template>
  <client-only>
    <div :class="['listing', { 'listing-map-open': mq == 'mobile' && isMapOpen }]">
      <div v-if="mq == 'mobile'" class="shadow bg-white sticky top-0 px-20 pt-15 z-20">
        <SearchForm show-filter :is-map-open="isMapOpen" @toggle-map="toggleMap" />
      </div>
      <div class="listing__inner">
        <div
          v-if="mq !== 'mobile'"
          class="sticky bg-white lg:pb-30 px-20 lg:px-0 pt-20 lg:pt-30 top-0 z-3"
        >
          <SearchForm show-filter :is-map-open="isMapOpen" @toggle-map="toggleMap" />
        </div>

        <ResultEmpty
          v-if="!items.length && !loading"
          text="No search results, please clear all filters and try again"
          icon="search-empty"
          class="absolute-center lg:-mt-25"
        ></ResultEmpty>
        <Loading
          v-if="loading && !items.length"
          class="w-50 h-50 fixed lg:absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        ></Loading>

        <ul
          v-if="(items.length > 0 && mq == 'mobile' && !isMapOpen) || mq !== 'mobile'"
          class="grid grid-cols-1 sm:grid-cols-2 gap-x-20 xl:gap-x-30 px-20 lg:px-0 pt-20 lg:pt-0 lg:pr-20 lg:-mr-20 overflow-y-auto focus:outline-none focus-visible:shadow-outline"
        >
          <li
            v-for="item in items"
            :key="item.id"
            class="mb-30"
            @mouseover="hoveredItemId = item.id"
            @mouseout="hoveredItemId = ''"
          >
            <ObjectPreview :loading="loading" :post="item" />
          </li>
        </ul>
        <Pagination
          v-if="pagination.total > pagination.limit"
          v-model="currentPage"
          :page-count="Math.ceil(pagination.total / pagination.limit)"
          :click-handler="updatePagination"
          class="mb-20"
        >
        </Pagination>
      </div>
      <div v-if="(mq == 'mobile' && isMapOpen) || mq !== 'mobile'" class="listing__map">
        <div class="absolute mt-10 z-3 left-1/2 transform -translate-x-1/2 flex">
          <!-- <Button
          v-if="isMobile || isTablet"
          icon
          color="black"
          class="bg-white rounded shadow mr-10 w-35 h-35 sm:w-45 sm:h-45"
          @click="isMapOpen = false"
        >
          <svg-icon name="close" class="h-12 w-12 fill-current text-black"></svg-icon>
        </Button> -->
          <div
            class="p-5 sm:p-10 h-35 sm:h-45 px-10 sm:px-15 text-sm sm:text-base whitespace-no-wrap bg-white rounded shadow"
          >
            <div v-if="loading" class="w-150">
              <Loading class="w-25 h-25 mx-auto"></Loading>
            </div>
            <Checkbox v-else v-model="searchByMap" value="1" :content-classes="['pl-15 sm:pl-35']">
              Redo search as I move the map
            </Checkbox>
          </div>
        </div>
        <client-only>
          <MapListing
            :items="items"
            :lat="search.location.latitude"
            :lng="search.location.longitude"
            :zoom="search.zoom"
            :hovered-item-id="hoveredItemId"
            :search-by-map="searchByMap"
          />
        </client-only>
      </div>
    </div>
  </client-only>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'SearchPage',
    layout: 'default',
    data() {
      return {
        items: [],
        isMobile: true,
        isTablet: true,
        isMapOpen: false,
        hoveredItemId: '',
        loading: true,
        place_id: null,
        searchByMap: true,
        selectedTypes: [],
        date: [],
        map: [],
        fetchDataTime: null,
        showMapObjects: false,
        pagination: {},
        currentPage: 1,
      }
    },
    computed: mapState({
      mq: 'mq',
      currentLocation: 'currentLocation',
      search: 'search',
      mobLayout: 'mobLayout',
      config: 'config',
    }),
    watch: {
      // call again the method if the route changes
      $route: 'fetchData',
      searchByMap(val) {
        if (val) {
          this.fetchData(true)
        }
      },
      currentPage(val) {
        this.$store.dispatch('search/set', {
          data: {
            page: val,
          },
          push: true,
        })
        // this.$router.push({
        //   path: '/search',
        //   query: { ...this.$route.query, page: val },
        // })
      },
    },
    created() {
      this.$store.dispatch('search/resetState')
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      // setMap(data) {
      //   // this.zoom = data.zoom
      //   // this.map = data.map
      //   // this.location = data.location
      //   // if (this.searchByMap) {
      //   //   this.fetchData()
      //   // }
      // },
      updatePagination(page) {
        // console.log(page)
        // this.currentPage = page
        // this.$router.push({
        //   path: '/search',
        //   query: { ...this.$route.query, page },
        // })
      },
      toggleMap(state = !this.isMapOpen) {
        this.isMapOpen = state
      },
      fetchData(push = false) {
        const query = this.$route.query

        this.currentPage = +query.page || 1

        const types = query.types ? query.types.split(',').map(id => parseInt(id)) : []

        const data = {
          types,
          types_all: types.length ? 1 : 0,
          place_id: query.place_id || null,
          place_title: query.place_title || '',
          // similar_id: query.similar_id,
          location: {
            latitude:
              parseFloat(query.latitude) ||
              this.currentLocation?.latitude ||
              this.config.LOCATION_DEFAULT.latitude,
            longitude:
              parseFloat(query.longitude) ||
              this.currentLocation?.longitude ||
              this.config.LOCATION_DEFAULT.longitude,
          },

          date: query.date || null,
          zoom: parseInt(query.zoom) || null,
          verified: parseInt(query.verified) || false,
          quests_size: parseInt(query.quests_size) || null,
          hours: parseInt(query.hours) || null,
          amenities: query.amenities
            ? String(query.amenities)
                .split(',')
                .map(id => parseInt(id))
            : [],
          rules: query.rules
            ? String(query.rules)
                .split(',')
                .map(id => parseInt(id))
            : [],
          no_deposit: parseInt(query.no_deposit) || false,
          no_cleaning_fee: parseInt(query.no_cleaning_fee) || false,
        }

        if (query.ne_lat) {
          data.ne_lat = parseFloat(query.ne_lat)
          data.ne_lng = parseFloat(query.ne_lng)
          data.sw_lat = parseFloat(query.sw_lat)
          data.sw_lng = parseFloat(query.sw_lng)
        }

        if (query.price_from || query.price_to) {
          data.price = {
            from: query.price_from,
            to: query.price_to,
          }
        }

        this.$store.dispatch('search/set', { data, push })
        if (this.fetchDataTime && new Date() - this.fetchDataTime < 1000) {
          return
        }

        const params = {
          types: this.search.types,
          types_all: this.search.types.length ? 0 : 1,
          place_id: this.search.place_id,
          // 'location[latitude]': this.search.location?.latitude,
          // 'location[longitude]': this.search.location?.longitude,
          date: this.search.date,
          quests_size: this.search.quests_size,
          hours: this.search.hours,
          amenities: this.search.amenities,
          rules: this.search.rules,
        }
        if (this.search.price?.from !== null && this.search.price?.to !== null) {
          params['price[from]'] = this.search.price.from
          params['price[to]'] = this.search.price.to
        }

        if (this.search.verified) {
          params.verified = this.search.verified
        }
        if (this.search.no_deposit) {
          params.no_deposit = this.search.no_deposit
        }
        if (this.search.no_cleaning_fee) {
          params.no_cleaning_fee = this.search.no_cleaning_fee
        }
        if (this.search.similar_id) {
          params.similar_id = this.search.similar_id
        }
        if (this.currentPage !== 1) {
          params.page = this.currentPage
        }
        if (this.searchByMap && this.search.ne_lat) {
          params['map[0][latitude]'] = this.search.ne_lat
          params['map[0][longitude]'] = this.search.ne_lng
          params['map[1][latitude]'] = this.search.sw_lat
          params['map[1][longitude]'] = this.search.sw_lng
        } else {
          params['location[latitude]'] = this.search.location?.latitude
          params['location[longitude]'] = this.search.location?.longitude
        }

        console.log(this.search, params)

        this.fetchDataTime = new Date()
        this.loading = true
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        this.$axios
          .$get('/search', {
            params,
          })
          .then(resp => {
            this.items = resp.data
            this.pagination = resp.pagination
            this.loading = false
          })
      },
    },
  }
</script>
