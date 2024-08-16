<template>
  <div class="text-center flex flex-col h-full">
    <Button
      rounded
      icon
      alpha-bg
      color="black"
      size="sm"
      class="absolute top-0 right-0 mt-20 mr-15 z-3"
      aria-label="Close"
      @click="$emit('close')"
    >
      <svg-icon name="close" class="h-12 w-12 fill-current" />
    </Button>
    <form class="px-20 pt-25 pb-25 overflow-y-auto h-full" novalidate @submit.prevent="submit">
      <Title size="lg" tag="div" class="mb-20">{{ title }}</Title>
      <div class="mb-15">{{ description }}</div>
      <star-rating
        class="justify-center mb-30"
        :show-rating="false"
        active-color="#5D44F6"
        inactive-color="#EBEBEB"
        :star-size="32"
        :padding="12"
        @update:rating="setRating"
      ></star-rating>
      <div v-if="ratingError" class="text-red text-sm -mt-20 mb-10">{{ ratingError }}</div>
      <div class="mb-15">Please leave a review</div>

      <TextField
        v-model="message"
        class="mb-25"
        type="textarea"
        placeholder="Type your review here"
        label="Type your review here"
        rows="5"
        :limit="400"
        required
        :error-message="messageError"
        :has-error="showErrors && !message"
      />

      <Button type="submit" color="primary" :loading="loading" size="md"> Submit </Button>
    </form>
  </div>
</template>

<script>
  const modalParams = {
    width: 430,
    scrollable: true,
    height: 'auto',
    adaptive: true,
    'focus-trap': true,
    classes: ['shadow'],
  }
  export default {
    name: 'LeaveReview',
    props: {
      reservationId: {
        type: [String, Number],
        required: true,
      },
      title: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      onSuccess: {
        type: Function,
        default: Function,
      },
    },
    data() {
      return {
        message: '',
        rating: 0,
        loading: false,
        showErrors: false,
        messageError: '',
        ratingError: '',
      }
    },
    methods: {
      getModalParams(opts) {
        return Object.assign(modalParams, opts)
      },
      setRating(rating) {
        this.rating = rating
        if (this.ratingError) {
          this.ratingError = ''
        }
      },
      submit() {
        this.showErrors = true
        this.messageError = ''
        this.ratingError = ''
        if (!this.message) {
          this.messageError = 'Please leave your review '
        }
        if (!this.rating) {
          this.ratingError =
            'Please rate the' + (this.$auth.user.current_role === 'host' ? 'guest' : 'host')
        }
        if (!this.message || !this.rating) {
          return
        }

        this.loading = true
        this.$axios
          .$post(`/user/reservations/${this.reservationId}/review`, {
            description: this.message,
            rating: this.rating,
          })
          .then(r => {
            this.loading = false
            this.$emit('close')

            this.onSuccess()

            // if (r.success) {
            //   this.$store.dispatch('getFavorites', {
            //     onUpdate: () => {
            //       this.loadingSave = false
            //       this.$emit('close')
            //     },
            //   })
            // } else {
            //   this.loadingSave = false
            // }
          })
          .catch(r => {
            this.loading = false
          })
      },
    },
  }
</script>
