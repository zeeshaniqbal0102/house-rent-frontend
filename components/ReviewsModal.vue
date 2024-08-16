<template>
  <div class="flex flex-col h-full">
    <div
      class="window-header flex justify-between items-center flex-shrink-0 px-15 md:px-50 py-15 md:py-20 border-b border-black border-opacity-10"
    >
      <div class="text-lg md:text-xl font-semibold">Reviews ({{ post.reviews_length }})</div>
      <Button
        icon
        rounded
        color="black"
        size="sm"
        class="-mr-5 md:-mr-15"
        aria-label="Close"
        @click="$emit('close')"
      >
        <svg-icon name="close" class="h-12 w-12 fill-current" />
      </Button>
    </div>

    <div class="py-15 md:pt-50 px-15 md:px-50 md:pb-40 overflow-x-auto">
      <Loading v-if="loading" class="w-50 h-50 fill-black absolute-center"></Loading>
      <ul v-if="list.length" class="grid grid-cols-1 gap-40">
        <li v-for="review in list" :key="review.id">
          <Review :review="review" />
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
  </div>
</template>

<script>
  const modalParams = {
    width: 700,
    scrollable: false,
    adaptive: true,
    height: '100%',
    focusTrap: true,
    classes: ['shadow', 'h-full'],
  }
  export default {
    name: 'ReviewsModal',
    props: {
      post: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        list: [],
        loading: false,
        currentPage: 1,
        pagination: {},
      }
    },
    mounted() {
      this.fetchReviews()
    },
    methods: {
      getModalParams(opts) {
        return Object.assign(modalParams, opts)
      },
      fetchReviews() {
        this.loading = true
        this.$axios
          .$get(`/listings/${this.post.id}/reviews`, {
            params: {
              limit: 5,
              page: this.currentPage,
            },
          })
          .then(({ data, pagination }) => {
            this.list = data
            this.pagination = pagination
            this.loading = false
          })
      },
      updatePagination(page) {
        this.currentPage = page
        this.fetchReviews()
      },
    },
  }
</script>
