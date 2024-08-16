<template>
  <div class="flex flex-col h-full overflow-hidden w-full">
    <div
      class="window-header flex justify-between items-center flex-shrink-0 px-25 md:px-50 py-20 border-b border-line"
    >
      <div class="text-lg md:text-xl font-medium">Filters</div>
      <Button
        rounded
        icon
        color="black"
        size="sm"
        class="-mr-15"
        aria-label="Close"
        @click="$emit('close')"
      >
        <svg-icon name="close" class="h-12 w-12 fill-current" />
      </Button>
    </div>

    <div class="pt-20 lg:pt-50 px-15 md:px-50 overflow-y-auto overflow-x-hidden">
      <section>
        <Title size="lg" class="mb-20"> Price range </Title>
        <div v-if="mq == 'mobile'" class="flex justify-between items-center mb-10">
          <div>
            From <span class="font-semibold">${{ priceFrom }}</span>
          </div>
          <div>
            To <span class="font-semibold">${{ priceTo }}</span>
          </div>
        </div>
        <vue-slider
          ref="priceSlider"
          :dot-size="24"
          :height="2"
          :value="[priceFrom, priceTo]"
          :min="priceMin"
          :max="priceMax"
          :tooltip-formatter="val => `$${val}`"
          :tooltip="mq == 'mobile' ? 'none' : 'active'"
          @change="changeSliderPrice"
        />
        <div
          v-if="mq !== 'mobile'"
          class="inline-grid grid-flow-col items-center gap-15 text-lg mt-25"
        >
          <span>From</span>
          <!-- v-model="selectedPrice[1]" -->
          <TextField
            type="text"
            :mask="{
              numeral: true,
              numeralPositiveOnly: true,
              prefix: '$',
              rawValueTrimPrefix: true,
            }"
            :min="priceMin"
            :max="priceMax"
            class="w-130"
            :value="priceFrom"
            @change="onChangeFromPrice"
          ></TextField>
          <span>to</span>
          <TextField
            type="text"
            :mask="{
              numeral: true,
              numeralPositiveOnly: true,
              prefix: '$',
              rawValueTrimPrefix: true,
            }"
            input-prefix="$"
            :min="priceMin"
            :max="priceMax"
            class="w-130"
            :value="priceTo"
            @change="onChangeToPrice"
          ></TextField>
        </div>
      </section>
      <!-- <Divider :size="mq == 'mobile' ? 'sm' : 'lg'" /> -->

      <!-- <div class="flex items-center justify-between">
        <Title size="lg"> Verified host </Title>
        <Switcher v-model="verified" checked />
      </div>
      <div class="mt-10">Hosts that provided government issed ID</div> -->

      <Divider :size="mq == 'mobile' ? 'sm' : 'lg'" />
      <div class="flex items-center justify-between">
        <div>
          <Title size="lg"> Number of guests </Title>
          <Counter
            v-if="filterByNumberGuests"
            v-model="quests_size"
            :min="1"
            :editable="true"
            :prefix="['guest', 'guests']"
            class="mt-30"
          />
        </div>
        <Switcher v-model="filterByNumberGuests" />
      </div>
      <Divider :size="mq == 'mobile' ? 'sm' : 'lg'" />
      <div class="flex items-center justify-between">
        <div>
          <Title size="lg"> Number of hours </Title>
          <Counter
            v-if="filterByHours"
            v-model="hours"
            :min="1"
            :editable="true"
            :prefix="['hour', 'hours']"
            class="mt-30"
          />
        </div>
        <Switcher v-model="filterByHours" />
      </div>
      <div v-if="mq == 'mobile' && amenitiesAll.length">
        <Divider :size="mq == 'mobile' ? 'sm' : 'lg'" />
        <Title size="lg" class="mb-25"> Features </Title>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-20">
          <li v-for="amenity in amenitiesAll" :key="amenity.id">
            <Checkbox v-model="amenities" :value="amenity.id">
              {{ amenity.title }}
            </Checkbox>
          </li>
        </ul>
      </div>

      <Divider :size="mq == 'mobile' ? 'sm' : 'lg'" />
      <Title size="lg" class="mb-25"> Host Rules </Title>
      <ul class="grid grid-cols-1 gap-20">
        <li v-for="rule in rulesAll" :key="rule.id">
          <Checkbox v-model="rules" :value="rule.id">
            {{ rule.title }}
          </Checkbox>
        </li>
      </ul>

      <Divider :size="mq == 'mobile' ? 'sm' : 'lg'" />

      <div class="grid grid-cols-1 gap-30">
        <!-- <div class="flex items-center justify-between">
          <div>
            <Title size="lg"> No deposit </Title>
          </div>
          <Switcher v-model="no_deposit" />
        </div> -->

        <div class="flex items-center justify-between">
          <div>
            <Title size="lg"> No cleaning fee </Title>
          </div>
          <Switcher v-model="no_cleaning_fee" />
        </div>
      </div>

      <div class="h-40"></div>
    </div>
    <div
      class="grid grid-cols-2 gap-15 md:gap-0 md:flex justify-between border-t border-line px-25 lg:px-50 py-8 lg:py-30"
    >
      <Button text size="md" color="primary" bold class="px-0" @click="clearAll">
        Clear all
      </Button>
      <Button
        color="primary"
        size="md"
        @click="
          submit()
          $emit('close')
        "
      >
        Apply
      </Button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  const DEFAULT_DATA = {
    priceFrom: 0,
    priceTo: null,
    priceMin: 0,
    priceMax: null,
    filterByNumberGuests: 0,
    filterByHours: 0,
    verified: 0,
    quests_size: 1,
    hours: null,
    amenities: [],
    amenitiesAll: [],
    rules: [],
    types: [],
    no_deposit: false,
    no_cleaning_fee: false,
  }

  export default {
    name: 'FilterModal',
    data() {
      return Object.assign({}, DEFAULT_DATA)
    },
    computed: mapState({
      mq: 'mq',
      search: 'search',
      config: 'config',
      rulesAll: 'rules',
    }),
    mounted() {
      this.selectedTypes = this.search.types
      this.priceFrom = this.search.price.from
      this.priceTo = this.search.price.to
      this.verified = this.search.verified
      this.amenities = this.search.amenities
      this.rules = this.search.rules
      this.no_deposit = this.search.no_deposit
      this.no_cleaning_fee = this.search.no_cleaning_fee
      this.quests_size = this.search.quests_size || 1
      this.hours = this.search.hours || 1
      this.filterByNumberGuests = Boolean(this.search.quests_size)
      this.filterByHours = Boolean(this.search.hours)

      this.priceTo = this.config.SEARCH.max_price
      this.priceMax = this.config.SEARCH.max_price

      this.fetchAmenities()
    },
    methods: {
      fetchAmenities(after) {
        this.$axios
          .$get(`/amenities?${this.selectedTypes?.map(id => `type_id[]=${id}`).join('&')}`)
          .then(({ data }) => {
            this.amenitiesAll = data
            after && after()
          })
      },
      changeSliderPrice(price) {
        this.priceFrom = price[0]
        this.priceTo = price[1]
      },
      onChangeFromPrice(e) {
        this.$refs.priceSlider.setValue([Number(e.target.cleave.getRawValue()), this.priceTo])
      },
      onChangeToPrice(e) {
        this.$refs.priceSlider.setValue([this.priceFrom, Number(e.target.cleave.getRawValue())])
      },
      clearAll() {
        for (const [key, value] of Object.entries(DEFAULT_DATA)) {
          this[key] = value
        }
        this.$emit('close')
        this.submit()
      },
      submit() {
        const data = {
          price: {
            from: this.priceFrom,
            to: this.priceTo,
          },
          verified: this.verified,
          amenities: this.amenities,
          rules: this.rules,
          no_deposit: this.no_deposit,
          no_cleaning_fee: this.no_cleaning_fee,
          quests_size: this.filterByNumberGuests ? this.quests_size : null,
          hours: this.filterByHours ? this.hours : null,
          page: 1,
        }
        this.$store.dispatch('search/set', { data, push: true })
      },
    },
  }
</script>
