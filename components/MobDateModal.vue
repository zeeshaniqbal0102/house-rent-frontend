<template>
  <div class="h-full flex flex-col items-stretch overflow-hidden">
    <div
      class="window-header flex justify-center items-center flex-shrink-0 px-25 md:px-50 py-20 border-b border-line"
    >
      <div class="text-lg md:text-xl font-medium">Date</div>
      <Button
        rounded
        icon
        color="black"
        size="sm"
        class="absolute right-0 mr-15"
        aria-label="Close"
        @click="$emit('close')"
      >
        <svg-icon name="close" class="h-12 w-12 fill-current" />
      </Button>
    </div>

    <div class="pt-20 lg:pt-50 px-15 md:px-50 overflow-hidden h-full flex flex-col">
      <date-picker
        v-if="step === 'date'"
        v-model="date"
        placeholder="Tomorrow"
        format="MM-DD-YYYY"
        :inline="true"
        value-type="YYYY-MM-DD"
        input-class="text-field text-field-border"
        :disabled-date="checkDataAvailable"
        :class="['transition-all duration-150', { 'opacity-25 pointer-events-none': loading }]"
        @pick="datePick"
      >
        <i slot="icon-calendar"></i>
      </date-picker>
      <Loading v-if="loading" class="w-30 h-30 fill-current text-black absolute-center"></Loading>
      <TimePicker
        v-if="step === 'time'"
        :disabled-hours="reservation.disabledHours"
        :rent-time-min="post.rent_time_min"
        @confirm="
          confirmTime($event)
          reserve()
          $emit('close')
        "
      />
    </div>
  </div>
</template>

<script>
  const modalParams = {
    width: '100%',
    scrollable: false,
    height: '100%',
    adaptive: true,
    'focus-trap': true,
    classes: ['shadow', 'flex', 'flex-col', 'h-full'],
  }
  export default {
    name: 'MobDateModal',
    props: {
      post: {
        type: Object,
        required: true,
      },
      fetchTime: {
        type: Function,
        required: true,
      },
      reserve: {
        type: Function,
        default: Function,
      },
      checkDataAvailable: {
        type: Function,
        default: Function,
      },
      confirmTime: {
        type: Function,
        default: Function,
      },
    },
    data() {
      return {
        date: '',
        step: 'date',
        loading: false,
      }
    },
    computed: {
      reservation() {
        return this.$store.state.reservation
      },
    },
    methods: {
      datePick() {
        this.loading = true
        this.fetchTime(this.date, () => {
          this.step = 'time'
          this.loading = false
        })
      },
      getModalParams(opts) {
        return Object.assign(modalParams, opts)
      },
    },
  }
</script>
