<template>
  <div class="relative shadow-lg rounded-b lg:rounded-none lg:flex lg:shadow-none">
    <div class="lg:w-200">
      <nuxt-link
        :to="`/${reservation.listing.type.name}/${reservation.listing.slug}`"
        aria-hidden="true"
        class="block relative rounded-t lg:rounded overflow-hidden aspect-ratio-3/2 focus:outline-none"
        tabindex="0"
      >
        <img
          :src="reservation.listing.image"
          :alt="reservation.listing.title"
          class="absolute image-full"
        />
      </nuxt-link>
    </div>

    <div class="relative lg:static w-full">
      <div class="p-15 lg:p-0 lg:pl-25">
        <Button
          :to="`/${reservation.listing.type.name}/${reservation.listing.slug}`"
          class="inline-block font-medium text-lg mb-5 lg:mb-0 hover:text-primary"
        >
          <h2>{{ reservation.listing.title }}</h2>
        </Button>
        <!-- <Price v-if="mq == 'mobile'" :price="reservation.price"></Price> -->
        <ul v-if="mq === 'mobile'" class="grid gap-25 pb-15 mt-15">
          <li class="pl-35 relative">
            <svg-icon
              class="w-25 h-25 fill-current text-primary absolute left-0 top-0 -mt-2"
              name="dollar-sign"
            ></svg-icon>
            ${{ reservation.total_price }}
          </li>
          <li class="pl-35 relative">
            <svg-icon
              class="w-25 h-25 fill-current text-primary absolute left-0 top-0 -mt-2"
              name="account"
            ></svg-icon>
            {{ reservation.guests_size }} guests
          </li>

          <li class="pl-35 relative">
            <svg-icon
              class="w-25 h-25 fill-current text-primary absolute left-0 top-0 -mt-2"
              name="date"
            ></svg-icon>
            {{ reservation.date }}
          </li>
          <li class="pl-35 relative">
            <svg-icon
              class="w-25 h-25 fill-current text-primary absolute left-0 top-0 -mt-2"
              name="time"
            ></svg-icon>
            {{ reservation.time }}
          </li>
          <li class="pl-35 relative">
            <svg-icon
              class="w-25 h-25 fill-current text-primary absolute left-0 top-0 -mt-2"
              name="place"
            ></svg-icon>
            {{ reservation.listing.address }}
          </li>
        </ul>
        <ListInline
          v-if="mq !== 'mobile'"
          :list="[
            reservation.listing.type.title,
            `${reservation.listing.guests_size} people`,
            reservation.listing.distance,
          ]"
          class="pt-5 pb-5 text-sm"
        >
          <span class="font-semibold">${{ reservation.total_price }}</span>
        </ListInline>
        <div class="text-gray" v-if="reservation.fees !== null">
          {{ reservationFeesText }}
        </div>
        <div v-if="mq !== 'mobile'" class="text-gray mt-3">
          {{ reservation.listing.address }}
        </div>

        <div v-if="mq !== 'mobile'" class="inline-grid items-center grid-flow-col gap-8 mt-8">
          <span class="inline-flex items-center h-40 rounded-full px-15 bg-black bg-opacity-5">
            {{ reservation.date }}
          </span>
          <span
            class="inline-flex items-center h-40 rounded-full px-15 bg-black bg-opacity-5 lowercase"
          >
            {{ reservation.time }}
          </span>
          <Button
            v-if="!reservation.has_review && !has_review && type === 'previous'"
            :loading="reviewLoading"
            size="sm"
            color="primary"
            class="ml-10 px-20"
            @click="leaveReview()"
          >
            Leave review
          </Button>
        </div>
        <div class="text-right block lg:contents">
          <Button
            v-if="reservation.chat"
            :to="`/messages/${reservation.chat.id}`"
            text
            color="primary"
            size="md"
            bold
            class="px-15"
          >
            Message Host
          </Button>
        </div>
        <div v-if="reservation.status.name == 'pending'" class="mt-20">
          <span class="font-medium">Waiting for payment</span>
          <Button
            :loading="payNowLoading"
            size="sm"
            color="primary"
            class="ml-10 px-20"
            @click="payNow()"
          >
            Pay now
          </Button>
        </div>
      </div>

      <div
        v-if="type == 'upcoming' && this.$auth.user.id === reservation.user.id"
        class="absolute right-0 top-0 mt-7 lg:mt-0"
      >
        <Dropdown :position="mq == 'mobile' ? 'right' : 'center'">
          <Button icon alpha-bg rounded color="gray" size="md">
            <svg-icon name="dots" class="fill-current w-5 h-20"></svg-icon>
          </Button>
          <div slot="dropdown" class="py-10">
            <Button
              text
              block
              start
              tile
              alpha-bg
              color="red"
              size="sm"
              class="whitespace-no-wrap px-25"
              :loading="cancelLoading"
              @click="cancelReservation()"
            >
              Cancel
            </Button>
          </div>
        </Dropdown>
      </div>
    </div>
  </div>
</template>

<script>
  import LeaveReview from '~/components/LeaveReview'
  import ConfirmModal from '~/components/ConfirmModal'
  export default {
    name: 'BookingsItem',
    props: {
      type: {
        type: String,
        default: '',
      },
      reservation: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        payNowLoading: false,
        cancelLoading: false,
        reviewLoading: false,

        has_review: false,
      }
    },
    computed: {
      mq() {
        return this.$store.state.mq
      },
      config() {
        return this.$store.state.config
      },
      reservationFeesText() {
        let text = `$${this.reservation.price_per_hour}x${this.reservation.hours} hrs, ${this.reservation.fees.base_fee_percent}% guest fee`
        if (this.reservation.fees.first_fee > 0) {
          text = `${text}, $${this.reservation.fees.first_fee} one-time initial fee`
        }
        return text
      },
    },
    mounted() {
      // const options = {
      //   timeZone: this.config.TIMEZONE_DEFAULT,
      //   year: 'numeric',
      //   month: 'numeric',
      //   day: 'numeric',
      //   hour: 'numeric',
      //   minute: 'numeric',
      //   second: 'numeric',
      // }
      // const formatter = new Intl.DateTimeFormat([], options)
    },
    methods: {
      cancelReservation() {
        const reservationDate = new Date(this.reservation.free_cancellation_at)
        const currentDate = new Date(
          new Date().toLocaleString('en-US', { timeZone: this.config.TIMEZONE_DEFAULT })
        )
        let description2 = this.reservation.free_cancellation_text
        if (reservationDate - currentDate < 0) {
          description2 = `<div class="font-medium">You will be charged $${this.config.RESERVATION_CANCELLATION_CHARGE}<br> for canceling your reservation</div>`
        }

        this.$modal.show(
          ConfirmModal,
          {
            title: 'Cancel booking',
            description: 'Are you sure you want to cancel the&nbsp;booking?',
            description2,
            actionText: 'Yes',
            cancelText: 'No',
            onSuccess: (modal, loading) => {
              loading(true)
              this.$axios.$post(`/user/reservations/${this.reservation.id}/cancel`).then(r => {
                this.$emit('canceled')
                modal.$emit('close')
                loading(false)
              })
            },
          },
          ConfirmModal.methods.getModalParams()
        )
      },

      leaveReview() {
        this.reviewLoading = true
        this.$axios
          .$get(`/user/reservations/${this.reservation.id}/review`)
          .then(r => {
            this.reviewLoading = false
            this.$modal.show(
              LeaveReview,
              {
                reservationId: this.reservation.id,
                title: r.data.title,
                description: r.data.description,
                onSuccess: () => {
                  this.has_review = true
                  // this.$emit('review-added', this.reservation.id)
                },
              }, // { message },
              LeaveReview.methods.getModalParams()
            )
          })
          .catch(e => {
            this.reviewLoading = false
          })
      },

      payNow() {
        this.payNowLoading = true
        this.$axios.$get(`/user/reservations/${this.reservation.id}`).then(({ data }) => {
          const { id, listing, date, time, total_price, hours, guests_size, message } = data
          this.$store.dispatch('reservation/set', {
            id,
            post: listing,
            date,
            time,
            timeLabel: '',
            total_price,
            hours,
            serviceFee: '',
            guests_size,
            message,
          })
          this.$router.push('/booking/payment')
          this.payNowLoading = false
        })
      },
    },
  }
</script>

<style></style>
