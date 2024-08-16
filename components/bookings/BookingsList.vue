<template>
  <div class="relative h-full">
    <div v-if="list.length" class="pb-30 lg:pb-55">
      <ul
        class="lg:w-700 max-w-full mb-15 lg:mb-0 lg:mt-30 gap-15 grid lg:block grid-cols-1 md:grid-cols-2"
      >
        <li v-for="reservation in list" :key="reservation.id">
          <BookingsItem :type="type" :reservation="reservation" @canceled="fetchData" />
          <Divider v-if="!isMobile" class="my-30"></Divider>
        </li>
      </ul>
      <Pagination
        v-if="pagination.total > pagination.limit"
        v-model="paymentsPage"
        :page-count="Math.ceil(pagination.total / pagination.limit)"
        :click-handler="updatePagination"
        class="mt-30 lg:justify-start"
      >
      </Pagination>
    </div>

    <ResultEmpty
      v-if="!list.length && !loading"
      class="absolute-center lg:-mt-50"
      :text="`No ${type} bookings`"
      :icon="type === 'cancelled' ? 'cancelled' : 'bookings'"
    ></ResultEmpty>

    <Loading v-if="loading" class="w-50 h-50 fill-black fixed-center"></Loading>
  </div>
</template>

<script>
  export default {
    name: 'BookingsList',
    props: {
      type: {
        type: String,
        default: 'upcoming',
      },
    },
    data() {
      return {
        list: [],
        loading: true,
        currentPage: 1,
        pagination: {},
      }
    },
    computed: {
      isMobile() {
        return this.$store.getters.isMobile
      },
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.loading = true
        this.$axios
          .$get('/user/reservations', {
            params: { limit: 10, type: this.type, page: this.currentPage },
          })
          .then(({ data, pagination }) => {
            this.list = data
            this.pagination = pagination
            this.loading = false
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          })
      },
      updatePagination(page) {
        this.currentPage = page
        this.fetchData()
      },
    },
  }
</script>

<style></style>
