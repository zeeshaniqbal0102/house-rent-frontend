<template>
  <div :class="['flex relative', alignClass, { 'flex-row-reverse': position === 'right' }]">
    <component
      :is="to ? 'nuxt-link' : 'div'"
      v-if="src"
      :tabindex="to ? 0 : null"
      :to="to"
      :class="[
        'focus:outline-none rounded-full overflow-hidden flex-shrink-0 object-center object-cover',
        size,
      ]"
    >
      <img :src="src" :alt="alt" class="image-full" />
    </component>
    <Loading v-if="loading" class="w-30 h-30 absolute-center text-gray"></Loading>
    <div
      v-if="$slots.default"
      :class="['w-full', !src ? '' : position === 'left' ? 'pl-20' : 'pr-20']"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Avatar',
    props: {
      src: {
        type: String,
        default: '',
      },
      alt: {
        type: String,
        default: '',
      },
      size: {
        type: String,
        default: '',
      },
      loading: Boolean,
      align: {
        type: String,
        default: 'center',
      },
      position: {
        type: String,
        default: 'left',
      },
      to: {
        type: String,
        default: null,
      },
    },
    computed: {
      alignClass() {
        switch (this.align) {
          case 'top':
            return 'items-start'
          case 'bottom':
            return 'items-end'
          case 'center':
          default:
            return 'items-center'
        }
      },
    },
  }
</script>

<style lang="postcss"></style>
