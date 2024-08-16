<template>
  <div>
    <Loading v-if="loading" class="w-50 h-50 fill-current text-black fixed-center"></Loading>
    <div v-if="!loading">
      <div v-if="isMobile" class="mob-page-header">
        <Button
          rounded
          icon
          color="primary"
          size="sm"
          aria-label="Back"
          class="absolute top-1/2 left-0 transform -translate-y-1/2"
          @click="$router.back()"
        >
          <svg-icon name="arrow-left" class="w-20 h-20 fill-current text-primary"></svg-icon>
        </Button>
        <div class="text-lg font-medium truncate">
          {{ post.title }}
        </div>
      </div>

      <div class="pb-40 lg:pb-80 lg:py-30">
        <ul
          v-if="!isMobile"
          class="object-gallery"
          :data-count="post.images.length > 3 ? 3 : post.images.length"
        >
          <!-- v-lazy-container="{ selector: 'img' }" -->
          <li v-for="(image, i) in post.images.slice(0, 3)" :key="image.id" @click="index = i">
            <!-- :data-src="image && image.src"
              :data-loading="post.images_xs[i].src" -->
            <img :src="image && image.src" class="image-full cursor-pointer" alt />
          </li>

          <Button
            v-if="post.images.length > 1"
            size="sm"
            class="absolute top-0 left-0 ml-8 mt-8 pl-10 pr-10 bg-black bg-opacity-75 hover:bg-opacity-100 text-white"
            @click="index = 0"
          >
            View all photos ({{ post.images.length }})
          </Button>
        </ul>
        <div v-if="isMobile" class="relative overflow-hidden aspect-ratio-3/2 -mx-15 sm:-mx-25">
          <ObjectSlider
            :image="post.image"
            :images="post.images"
            :images-xs="post.images_xs"
            class="absolute inset-0"
          ></ObjectSlider>
        </div>

        <Gallery
          :images="post.images"
          :index="index"
          :disable-scroll="true"
          @close="index = null"
        />

        <div
          class="lg:grid lg:grid-rows-1 lg:grid-cols-10 gap-20 mt-15 lg:mt-20 mb-25 lg:mb-100 relative z-3"
        >
          <div class="col-span-7 lg:col-span-7 lg:w-700 max-w-full">
            <MobObjectInfo v-if="isMobile" title-tag="h1" :post="post"></MobObjectInfo>
            <!-- <div v-if="isMobile" class="flex items-center text-sm mb-5">
              <div class="flex items-center mr-10">
                <svg-icon name="star" class="w-15 h-15 fill-current text-primary -mt-3 mr-5"></svg-icon>
                <span class="sr-only">Rating: </span> <span>4.67</span>
              </div>
              <div class="flex items-center mr-10">
                <svg-icon name="people" class="w-14 h-14 fill-current text-primary -mt-3 mr-5"></svg-icon>
                <span>{{ post.guests_size }}</span> <span class="sr-only">people</span>
              </div>
              <div class="text-gray-900">
                {{ post.type.title }}
              </div>
            </div> -->

            <h1 v-if="!isMobile" class="font-medium text-lg sm:text-xl mb-5 sm:mb-10">
              {{ post.title }}
            </h1>

            <!-- <Price v-if="isMobile" :price="post.price"></Price> -->

            <ListInline
              v-if="!isMobile"
              :list="[post.type.title, `${post.guests_size} people`, post.distance]"
              class="pt-8 pb-5"
            />
            <div v-if="!isMobile" class="flex items-center mt-5">
              <svg-icon
                name="star"
                :class="[
                  'inline-block h-15 w-15 fill-current -mt-3 mr-5',
                  post.rating.count ? 'text-primary' : 'text-gray',
                ]"
              />
              <span class="mr-5"> {{ post.rating.value_formatted }} </span>
              <span v-if="post.rating.count" class="text-gray"> ({{ post.rating.count }}) </span>
              <a v-if="post.reviews_length" href="#reviews" class="link ml-10">Read reviews</a>
            </div>
            <div v-if="!isMobile" class="text-gray mt-10">
              {{ post.address }}
            </div>

            <Divider v-if="isMobile" size="sm" class="mt-15" />

            <section class="mt-30">
              <Title size="lg" tag="h2" class="mb-15"> About the place </Title>
              <div class="prose mb-30">
                <p>
                  {{ post.description }}
                </p>
              </div>
            </section>

            <Divider size="lg" />

            <Title size="lg" tag="h2" class="mb-20 md:mb-30"> Location </Title>

            <client-only>
              <Map
                class="rounded overflow-hidden"
                :is-circle="showCircle"
                :lat="showCircle ? post.location.circle.center[0] : post.location.primary_point[0]"
                :lng="showCircle ? post.location.circle.center[1] : post.location.primary_point[1]"
                :radius="post.location.circle.radius"
                :zoom="post.location.zoom"
                :location-id="showCircle ? null : post.location.id"
              />
            </client-only>

            <section v-if="post.reviews_length" id="reviews">
              <Divider size="lg" />

              <div class="sm:mt-50">
                <div class="flex items-center text-lg mb-30 font-medium">
                  <div class="flex items-center">
                    <svg-icon
                      name="star"
                      :class="[
                        'inline-block h-15 w-15 fill-current text-primary -mt-3 mr-5',
                        post.rating.count ? 'text-primary' : 'text-gray',
                      ]"
                    />
                    <span class="mr-5"> {{ post.rating.value_formatted }} </span>
                  </div>
                  <span> ({{ post.reviews_length }} Reviews)</span>
                </div>
                <!-- <ul class="grid grid-cols-2 gap-20">
                  <li class="flex justify-between w-280 max-w-full">
                    <span class="pr-20"> Cleanliness </span>
                    <div class="text-lg font-medium flex items-center">
                      <ProgressBar class="w-80" value="3" max="5" />
                      <span class="pl-20" aria-hidden="true"> 3.0 </span>
                    </div>
                  </li>
                  <li class="flex justify-between w-280 max-w-full">
                    <span class="pr-20"> Accuracy </span>
                    <div class="text-lg font-medium flex items-center">
                      <ProgressBar class="w-80" value="3" max="5" />
                      <span class="pl-20" aria-hidden="true"> 3.0 </span>
                    </div>
                  </li>
                  <li class="flex justify-between w-280 max-w-full">
                    <span class="pr-20"> Communication </span>
                    <div class="text-lg font-medium flex items-center">
                      <ProgressBar class="w-80" value="3" max="5" />
                      <span class="pl-20" aria-hidden="true"> 3.0 </span>
                    </div>
                  </li>
                  <li class="flex justify-between w-280 max-w-full">
                    <span class="pr-20"> Value </span>
                    <div class="text-lg font-medium flex items-center">
                      <ProgressBar class="w-80" value="3" max="5" />
                      <span class="pl-20" aria-hidden="true"> 3.0 </span>
                    </div>
                  </li>
                </ul> -->

                <ul
                  v-if="!isMobile"
                  class="grid sm:grid-cols-2 gap-20 sm:gap-40 lg:gap-80 mt-30 lg:mt-50"
                >
                  <li v-for="review in post.reviews.slice(0, 4)" :key="review.id">
                    <Review :review="review" />
                  </li>
                </ul>
                <Review v-else :review="post.reviews[0]" />
                <Button
                  v-if="
                    (isMobile && post.reviews_length > 1) || (!isMobile && post.reviews_length > 4)
                  "
                  text
                  :color="isMobile ? 'black' : 'primary'"
                  size="md"
                  bold
                  class="md:mt-30 px-0 underline md:no-underline"
                  @click="showReviewsModal"
                >
                  {{ isMobile ? 'Read all reviews' : `Show all ${post.reviews_length} reviews` }}
                </Button>
              </div>
            </section>

            <Divider size="lg" />

            <div>
              <Button
                v-if="isMobile"
                text
                :to="`/host/${post.host.id}`"
                class="font-medium mb-10 hover:text-primary"
              >
                Hosted by {{ post.host.first_name }}
              </Button>
              <Avatar
                :to="`/host/${post.host.id}`"
                :src="post.host.image"
                size="w-50 h-50 sm:w-80 sm:h-80"
              >
                <Button
                  v-if="!isMobile"
                  :to="`/host/${post.host.id}`"
                  text
                  class="font-medium hover:text-primary"
                >
                  Hosted by {{ post.host.first_name }}
                </Button>
                <div class="flex flex-wrap items-center mt-10">
                  <div class="flex items-center pr-10 mb-5 lg:mb-0">
                    <svg-icon
                      name="star"
                      :class="[
                        'inline-block h-15 w-15 fill-current -mt-3 mr-8',
                        post.host.rating.count ? 'text-primary' : 'text-gray',
                      ]"
                    />
                    <span>
                      {{ post.host.rating.value_formatted }} ({{ post.host.reviews_length }}
                      Reviews)
                    </span>
                  </div>
                  <IconText
                    v-if="post.host.is_identity_verified"
                    icon="success"
                    color="green"
                    class="mb-5 lg:mb-0"
                  >
                    Identity verified
                  </IconText>
                </div>
              </Avatar>
              <section v-if="post.host.description" class="pt-20 md:pt-30">
                <Title v-if="!isMobile" size="lg" tag="h2" class="mb-15">
                  Message from {{ post.host.first_name }}
                </Title>
                <div class="prose">
                  {{ post.host.description }}
                </div>
              </section>
              <Button
                v-if="isMobile"
                color="primary"
                size="md"
                outlined
                block
                class="mt-25 w-400 max-w-full"
                :loading="chatLoading"
                @click.prevent="$auth.loggedIn ? createChat() : $router.push('/login')"
              >
                Chat
              </Button>
            </div>

            <section v-if="post.amenities.length">
              <Divider size="lg" />

              <Title size="lg" tag="h2" class="mb-15"> Features </Title>

              <ul class="grid grid-flow-row gap-15">
                <li v-for="item in post.amenities" :key="item.title" class="flex items-center">
                  <div class="w-25 h-25">
                    <img
                      v-if="item.icon"
                      :src="item.icon"
                      class="h-full w-full object-center object-contain"
                      :alt="item.title"
                    />
                  </div>
                  <span class="pl-25" v-text="item.title" />
                </li>
              </ul>
            </section>

            <section v-if="post.amenities_description">
              <Divider size="lg" />

              <Title size="lg" tag="h2" class="mb-15"> Extra amenities </Title>

              <div class="prose">
                {{ post.amenities_description }}
              </div>
            </section>

            <section v-if="post.rules.length">
              <Divider size="lg" />

              <Title size="lg" tag="h2" class="mb-15"> Host Rules </Title>

              <ul class="grid grid-flow-row gap-15">
                <li v-for="item in post.rules" :key="item.title" class="flex items-center">
                  <div class="w-25 h-25">
                    <img
                      v-if="item.icon"
                      :src="item.icon"
                      class="h-full w-full object-center object-contain"
                      :alt="item.title"
                    />
                  </div>
                  <span class="pl-25" v-text="item.title" />
                </li>
              </ul>
            </section>

            <section v-if="post.rules_description">
              <Divider size="lg" />
              <Title size="lg" tag="h2" class="mb-15"> Additional rules </Title>

              <div class="prose">
                {{ post.rules_description }}
              </div>
            </section>
          </div>
          <div v-if="!isMobile" class="col-span-4 lg:col-span-3 w-full">
            <div class="pt-10 pb-25 px-15 lg:px-25 shadow-lg rounded sticky top-20 inset-x-0">
              <div class="flex justify-between mb-10">
                <div class="text-primary flex items-center">
                  <span class="text-xl font-medium"> ${{ post.price ? post.price : '' }} </span>
                  <span>/hour</span>
                </div>
                <Favourite
                  v-if="$auth.loggedIn && $auth.user.current_role === 'guest'"
                  :listing-id="post.id"
                  class="z-2 -mr-10"
                />
              </div>
              <div
                v-if="!$auth.loggedIn || ($auth.loggedIn && $auth.user.id !== post.host.id)"
                class="grid grid-flow-row gap-8 mb-20"
              >
                <client-only>
                  <date-picker
                    v-model="date"
                    placeholder="Select Date"
                    format="MM-DD-YYYY"
                    value-type="YYYY-MM-DD"
                    input-class="text-field text-field-border"
                    :disabled-date="checkDataAvailable"
                  >
                    <i slot="icon-calendar"></i>
                  </date-picker>
                </client-only>

                <Dropdown position="right">
                  <TextField
                    v-model="time.label"
                    :disabled="!date || timeLoading"
                    placeholder="Time"
                    label="Time"
                    readonly
                    class="w-full"
                    :loading="timeLoading"
                  />
                  <template v-if="reservation.disabledHours" v-slot:dropdown="{ closeDropdown }">
                    <TimePicker
                      :disabled-hours="reservation.disabledHours"
                      :rent-time-min="post.rent_time_min"
                      @confirm="
                        closeDropdown()
                        confirmTime($event)
                      "
                    />
                  </template>
                </Dropdown>
                <!-- <v-select :clearable="false" :options="['Canada', 'United States']"></v-select> -->
              </div>
              <div v-if="hours && hours >= post.rent_time_min">
                <div class="grid grid-flow-row gap-15">
                  <div class="flex justify-between items-center px-15">
                    <span>${{ post.price }} x {{ hours }} hours</span>
                    <span>${{ subtotal }}</span>
                  </div>
                  <div class="flex justify-between items-center px-15">
                    <span> Service fee </span>
                    <span>${{ serviceFee }}</span>
                  </div>
                  <div v-if="initial_fee > 0" class="flex justify-between items-center px-15">
                    <span> Initial fee </span>
                    <span>${{ initial_fee }}</span>
                  </div>
                </div>

                <Divider size="sm" />

                <div class="grid grid-flow-row gap-15">
                  <div class="flex justify-between items-center px-15">
                    <span class="font-medium"> Total </span>
                    <span class="font-medium"> ${{ total_price }} </span>
                  </div>
                </div>
              </div>
              <div class="text-black text-sm text-opacity-35 mt-15 text-center">
                {{ post.cancellation }}
              </div>
              <Button
                :disabled="!hours || hours < post.rent_time_min"
                :disabled-opacity="
                  !$auth.loggedIn || ($auth.loggedIn && $auth.user.id !== post.host.id)
                "
                color="primary"
                size="md"
                block
                class="mt-30"
                @click="reserve"
              >
                Reserve now
              </Button>
              <Button
                color="primary"
                size="md"
                outlined
                block
                class="mt-10"
                :loading="chatLoading"
                @click.prevent="$auth.loggedIn ? createChat() : showAuth('login')"
              >
                Chat
              </Button>
            </div>
          </div>

          <div v-if="isMobile" class="mob-page-footer">
            <Price :price="post.price" class="col-span-2"></Price>
            <Button color="primary" size="md" class="col-span-3" @click="showDateModal">
              Reserve now
            </Button>
          </div>
        </div>
        <ObjectsSlider v-if="similar.length" :items="similar" class="mt-50 lg:mt-0">
          <template v-slot:header>
            <h2 class="inline">Other places you might like</h2>
            <Button
              :to="`/search?similar_id=${post.id}&latitude=${similar[0].location.point[0]}&longitude=${similar[0].location.point[1]}`"
              text
              color="primary"
              bold
              size="sm"
              class="text-base px-5"
            >
              See all
            </Button>
          </template>
        </ObjectsSlider>
      </div>
    </div>
  </div>
</template>

<script>
  import AuthForm from '~/components/auth/AuthForm'
  import MobDateModal from '~/components/MobDateModal'
  import ReviewsModal from '~/components/ReviewsModal'
  export default {
    name: 'SinglePage',
    /**
     * Validate url
     * Schema: /<type>/<slug>-<id>
     * Valid urls: /pool/pool-123 | /pool/my-good-pool-12345
     *
     * @param {object} params
     * @return {boolean}
     */
    validate({ params }) {
      const slug = params?.slug || undefined
      if (slug === undefined) {
        return false
      }
      // const parts = slug.split('-')
      // if (parts.length && +parts[parts.length - 1]) {
      //   return true
      // }
      return new RegExp('^.+-(\\d+)$', 'g').test(slug)
    },
    data() {
      return {
        loading: true,
        chatLoading: false,
        timeLoading: false,
        index: null,
        date: '',
        time: {
          label: '',
        },
        hours: 0,
        hoursList: [],
        post: null,
        similar: [],
      }
    },
    computed: {
      showCircle() {
        return !this.$auth.loggedIn || !this.$auth.user.listings_accessible.includes(this.post.id)
      },
      reservation() {
        return this.$store.state.reservation
      },
      isMobile() {
        return this.$store.getters.isMobile
      },
      config() {
        return this.$store.state.config
      },
      subtotal() {
        return this.post.price * this.hours
      },
      serviceFee() {
        const subTotal = this.post.price * this.hours
        const price = subTotal * (this.config.RESERVATION_SERVICE_FEE_GUEST_PERCENT / 100)
        return parseFloat(price.toFixed(2))
        // return this.subtotal * (this.config.RESERVATION_SERVICE_FEE_GUEST_PERCENT / 100)
        // return this.config.RESERVATION_SERVICE_FEE
      },
      total_price() {
        return parseFloat(this.subtotal) + this.serviceFee + this.initial_fee
      },
      initial_fee() {
        if (this.$auth.loggedIn && this.$auth.user.reservation.has_guest_first_fee) {
          return this.$store.state.config.RESERVATION_SERVICE_INITIAL_FEE
        }
        return 0
      },
    },
    watch: {
      // call again the method if the route changes
      $route: 'fetchData',
      date() {
        this.fetchTime()
      },
    },
    created() {
      this.fetchData()
    },
    methods: {
      createChat() {
        this.chatLoading = true
        this.$axios
          .$get(`/listings/${this.post.id}/chat`)
          .then(({ data }) => {
            this.chatLoading = false
            this.$router.push(`/messages/${data.id}`)
          })
          .catch(res => {
            this.chatLoading = false
            const message = res.response.data.message
            this.$noty.error(message)
          })
      },
      getTomorrow() {
        const tomorrow = new Date(new Date())
        tomorrow.setDate(tomorrow.getDate() + 1)
        return this.getFormattedDate(tomorrow)
      },
      changeStep(step) {
        this.$store.dispatch('authForm/set', { step })
      },
      showAuth(step, params = {}) {
        this.changeStep(step)
        this.$modal.show(
          AuthForm,
          params, // { message },
          AuthForm.methods.getModalParams({
            'click-to-close': this.step !== 'verify',
          })
        )
      },
      getFormattedDate(date, format = 'y-m-d') {
        const y = date.getFullYear()
        const m = (1 + date.getMonth()).toString().padStart(2, '0')
        const d = date.getDate().toString().padStart(2, '0')
        return format.replace('y', y).replace('m', m).replace('d', d)
      },
      fetchTime(date, onSuccess) {
        if (date) {
          this.date = date
        }
        this.time.label = ''
        this.time.selected = []
        date = this.date // || this.getTomorrow()
        this.$store.dispatch('reservation/set', {
          disabledHours: [],
        })
        this.timeLoading = true
        this.$axios
          .$get(`/listings/${this.post.id}/times`, {
            params: {
              date,
            },
          })
          .then(res => {
            this.timeLoading = false
            if (res.success) {
              this.$store.dispatch('reservation/set', {
                disabledHours: res.data.locked,
              })
              onSuccess && onSuccess(this.reservation.disabledHours)
            }
          })
      },
      checkDataAvailable(date) {
        return date < new Date() || !!this.post.dates.locked.includes(this.getFormattedDate(date))
      },
      fetchData() {
        const parts = this.$route.params.slug.split('-')
        console.log(this.$route.params.slug)
        this.$axios.$get(`/listings/${parts[parts.length - 1]}`).then(res => {
          this.post = res.data
          // this.fetchTime()
          this.loading = false
          this.$axios.$get(`/listings/${this.post.id}/similar?limit=4`).then(res => {
            // console.log(res)
            this.similar = res.data
            // this.post = res.data
            // this.fetchTime()
            // this.loading = false
          })
        })
      },
      confirmTime(data) {
        this.time.label = data.totalLabel
        this.hoursList = data.selected
        this.hours = data.selected.length
      },
      reserve() {
        this.$store.dispatch('reservation/set', {
          post: this.post,
          timeLabel: this.time.label,
          hours: this.hours,
          hoursList: this.hoursList,
          date: this.date,
          total_price: this.total_price,
        })
        this.$router.push('/booking')
      },
      showDateModal() {
        this.$modal.show(
          MobDateModal,
          {
            post: this.post,
            fetchTime: this.fetchTime,
            confirmTime: this.confirmTime,
            reserve: this.reserve,
            checkDataAvailable: this.checkDataAvailable,
          }, // { message },
          MobDateModal.methods.getModalParams()
        )
      },
      showReviewsModal() {
        this.$modal.show(
          ReviewsModal,
          {
            post: this.post,
          }, // { message },
          ReviewsModal.methods.getModalParams()
        )
      },
    },
  }
</script>

<style lang="postcss">
  .object-gallery {
    @apply grid grid-rows-2 grid-cols-10;
    position: relative;
    height: 30rem;
    gap: 2rem;
    @screen lg {
      height: 50rem;
    }
    li {
      @apply rounded;
      position: relative;
      overflow: hidden;
    }
    &[data-count='1'] {
      li {
        @apply row-span-2 col-span-10;
      }
    }
    &[data-count='2'] {
      li:nth-child(1) {
        @apply row-span-2 col-span-5;
      }
      li:nth-child(2) {
        @apply row-span-2 col-span-5;
      }
    }
    &[data-count='3'] {
      li:nth-child(1) {
        @apply row-span-2 col-span-7;
      }
      li:nth-child(2) {
        @apply row-span-1 col-span-3;
      }
      li:nth-child(3) {
        @apply row-span-1 col-span-3;
      }
    }
  }
  /* :class="[
            'overflow-hidden rounded',
            { 'row-span-2 col-span-10': i === 0 && post.images.length === 1 },
            {
              'row-span-2 col-span-7':
                i === 0 && (post.images.length === 2 || post.images.length === 3),
            },
            { 'row-span-1 col-span-3': i === 1 },
            { 'row-span-1 col-span-3': i === 2 },
          ]" ; */
</style>
