<template>
  <div>
    <MobPageHeader
      v-if="isMobile"
      :title="allowEdit ? 'Your profile' : `${userData.first_name} profile`"
      :back="allowEdit ? '/account' : ''"
      :back-history="allowEdit ? false : true"
    >
      <template v-if="allowEdit" v-slot:right>
        <Button text color="primary" size="sm" to="/account/edit"> Edit </Button>
      </template>
    </MobPageHeader>
    <div class="lg:pt-55 pb-50 h-full w-1000 max-w-full mx-auto">
      <div class="lg:grid lg:grid-cols-11 lg:gap-60">
        <AccountSidebar v-if="!isMobile" :user="userData" />
        <div class="lg:col-span-7">
          <Avatar
            v-if="isMobile"
            size="w-50 h-50"
            class="relative text-left mb-25"
            :loading="loading"
            :src="userData.image"
          >
            <div class="font-semibold">{{ userData.first_name }} {{ userData.last_name }}</div>
            <span class="text-gray-900">Joined in {{ userData.registered_at_formatted }}</span>
          </Avatar>

          <div v-if="!isMobile" class="flex items-start justify-between mb-45">
            <div>
              <div class="text-2xl font-medium">HI, I’m {{ userData.first_name }}</div>
              <div class="text-gray">Joined in {{ userData.registered_at_formatted }}</div>
            </div>
            <Button v-if="allowEdit" color="primary" outlined size="md" to="/account/edit">
              Edit profile
            </Button>
          </div>

          <section>
            <Title v-if="userData.description" size="lg" class="mb-15 lg:mb-20"> About </Title>

            <div class="prose mb-20">
              {{ userData.description }}
            </div>
            <IconText v-if="userData.location" icon="house">
              Lives in {{ userData.location.text }}
            </IconText>
          </section>

          <section v-if="listings.length && !isMobile">
            <Divider size="lg" />
            <Title size="lg" class="mb-20 flex items-center">
              {{ userData.first_name }}’s listings
              <Loading v-if="listingsLoading" class="w-20 h-20 ml-10"></Loading>
            </Title>
            <ul
              class="grid grid-cols-1 sm:grid-cols-2 gap-20 xl:gap-30 px-20 lg:px-0 pt-20 lg:pt-0 lg:pr-20 lg:-mr-20"
            >
              <li
                v-for="item in listings"
                :key="item.id"
                @mouseover="hoveredItemId = item.id"
                @mouseout="hoveredItemId = ''"
              >
                <ObjectPreview :loading="loading" :post="item" />
              </li>
            </ul>
            <Pagination
              v-if="listingsPagination.total > listingsPagination.limit"
              v-model="listingsPage"
              :page-count="Math.ceil(listingsPagination.total / listingsPagination.limit)"
              :click-handler="updateListingsPagination"
              class="mt-30 lg:justify-start"
            >
            </Pagination>
          </section>

          <ObjectsSlider
            v-if="listings.length && isMobile"
            title="Places nearby"
            :items="listings"
            class="mt-35"
          >
            <template v-slot:header>
              <h2 class="font-medium text-lg">{{ userData.first_name }}’s listings</h2>
            </template>
          </ObjectsSlider>

          <section v-if="userData.reviews_length">
            <Divider size="lg" />
            <Title size="lg" class="mb-20 flex items-center">
              Reviews ({{ userData.reviews_length }})
              <Loading v-if="reviewsLoading" class="w-20 h-20 ml-10"></Loading>
            </Title>
            <ul v-if="reviews.length" class="grid gap-30 mt-30">
              <li v-for="review in reviews" :key="review.id">
                <ReviewType2 :review="review" />
              </li>
            </ul>
            <Pagination
              v-if="reviewsPagination.total > reviewsPagination.limit"
              v-model="reviewsPage"
              :page-count="Math.ceil(reviewsPagination.total / reviewsPagination.limit)"
              :click-handler="updateReviewsPagination"
              class="mt-30 lg:justify-start"
            >
            </Pagination>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AccountInfo',
    props: {
      type: {
        type: String,
        default: 'current',
      },
      user: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        listings: [],
        listingsPagination: {},
        listingsPage: 1,
        listingsLoading: false,

        loading: false,
        reviews: [],
        reviewsPagination: {},
        reviewsPage: 1,
        reviewsLoading: false,
      }
    },
    computed: {
      // reviews() {
      //   return this.type === 'current' ? this.myReviews : this.user.reviews
      // },
      userData() {
        if (this.type === 'current') {
          return this.$auth?.user
        } else {
          return this.user
        }
      },
      isMobile() {
        return this.$store.getters.isMobile
      },
      allowEdit() {
        return !this.user // || (this.user && this.user.id === this.$auth.user.id)
      },
    },
    mounted() {
      this.fetchReviews()
      this.fetchListings()
    },
    methods: {
      fetchListings() {
        if (
          this.type === 'host' ||
          (this.$auth.loggedIn && this.$auth.user.current_role === 'host')
        ) {
          if (this.userData.listings) {
            this.listings = this.userData.listings
            return
          }

          this.listingsLoading = true
          this.$axios
            .$get('/user/listings', {
              params: {
                limit: this.isMobile ? 99 : 4,
                page: this.listingsPage,
              },
            })
            .then(r => {
              this.listings = r.data
              this.listingsPagination = r.pagination
              this.listingsLoading = false
            })
            .catch(() => {
              this.listingsLoading = false
            })
        }
      },
      fetchReviews() {
        let url = '/user/reviews'
        if (this.type === 'host') {
          url = `/host/${this.userData.id}/reviews`
        }
        if (this.type === 'guest') {
          url = `/guest/${this.userData.id}/reviews`
        }
        this.reviewsLoading = true
        this.$axios
          .$get(url, {
            params: {
              limit: 5,
              page: this.reviewsPage,
            },
          })
          .then(r => {
            this.reviewsLoading = false
            this.reviews = r.data
            this.reviewsPagination = r.pagination
          })
          .catch(() => {
            this.reviewsLoading = false
          })
      },
      updateReviewsPagination(page) {
        this.reviewsPage = page
        this.fetchReviews()
      },
      updateListingsPagination(page) {
        this.listingsPage = page
        this.fetchListings()
      },
    },
  }
</script>
