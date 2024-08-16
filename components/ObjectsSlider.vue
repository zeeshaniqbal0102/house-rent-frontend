<template>
  <aside class="relative">
    <div class="relative xl:static flex justify-between items-center mb-20 sm:mb-25">
      <div class="font-medium sm:text-lg">
        <slot name="header">
          <h2 class="inline">
            {{ title }}
          </h2>
          <Button to="/search" text color="primary" bold size="sm" class="text-base px-5">
            See all
          </Button>
        </slot>
      </div>

      <div
        v-if="(items.lengths > 4 && mq !== 'mobile') || mq == 'mobile'"
        class="relative xl:absolute xl:inset-x-0 xl:top-1/2 xl:transform xl:-translate-y-1/2 xl:-ml-80 xl:-mr-80 xl:-mt-12 hidden sm:flex justify-between pointer-events-none z-2 w-80 sm:w-110 xl:w-auto"
      >
        <Button
          ref="prevEl"
          icon
          rounded
          shadow
          color="primary"
          class="bg-white pointer-events-auto btn--sm sm:btn--md xl:btn--lg"
          aria-label="Previous slide"
          @click="prevSlide"
        >
          <svg-icon name="arrow-left" class="h-12 sm:h-15 w-12 sm:w-15 fill-current" />
        </Button>
        <Button
          ref="nextEl"
          slot="button-next"
          icon
          rounded
          shadow
          color="primary"
          class="bg-white pointer-events-auto btn--sm sm:btn--md xl:btn--lg"
          aria-label="Next slide"
          @click="nextSlide"
        >
          <svg-icon name="arrow-right" class="h-12 sm:h-15 w-12 sm:w-15 fill-current" />
        </Button>
      </div>
    </div>
    <div class="-mx-container sm:mx-0">
      <swiper
        v-if="mq == 'mobile'"
        ref="swiper"
        :options="swiperOptions"
        class="flex rounded objects-slider"
        :cleanup-styles-on-destroy="false"
      >
        <swiper-slide v-for="item in items" :key="item.id" class="px-10 sm:px-0 pb-20 pt-2">
          <ObjectPreview :post="item" :recalculate-slider="true" />
        </swiper-slide>
      </swiper>
      <ul v-else class="grid grid-cols-4 gap-20 rounded">
        <div v-for="item in items" :key="item.id" class="px-10 sm:px-0 pb-20 pt-2">
          <ObjectPreview :post="item" :recalculate-slider="true" />
        </div>
      </ul>
      <slot></slot>
    </div>
  </aside>
</template>

<script>
  export default {
    name: 'ObjectsSlider',

    props: {
      items: {
        type: Array,
        default: Array,
      },
      title: {
        type: String,
        default: '',
      },
    },
    data: () => {
      return {
        init: false,
        swiper: null,
        swiperOptions: {
          loop: false,
          slidesPerView: 1.2,
          spaceBetween: 0,
          threshold: 5,
          navigation: {},
          breakpoints: {
            // when window width is >= 320px
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // when window width is >= 480px
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // when window width is >= 640px
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          },
        },
      }
    },
    computed: {
      mq() {
        return this.$store.state.mq
      },
    },
    updated() {
      this.updateSlider()
    },
    mounted() {
      this.updateSlider()
    },
    methods: {
      prevSlide() {
        if (this.swiper.isBeginning) {
          this.swiper.slideTo(this.items.length - 1)
        } else {
          this.swiper.slidePrev()
        }
      },
      nextSlide() {
        if (this.swiper.isEnd) {
          this.swiper.slideTo(0)
        } else {
          this.swiper.slideNext()
        }
      },
      updateSlider() {
        if (this.$refs.swiper) {
          if (this.mq !== 'mobile') {
            return
          }
          this.swiperOptions.init = true
          this.$refs.swiper.initSwiper()
          this.swiper = this.$refs.swiper.$swiper
        }
      },
    },
  }
</script>

<style lang="postcss">
  .objects-slider > .swiper-wrapper {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    @screen md {
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>
