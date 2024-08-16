<template>
  <div
    :class="[
      'mob-page-header mob-page-header--center mob-page-header--has-save',
      { 'mb-20': !noMargin },
    ]"
  >
    <Button
      v-if="back || backHistory"
      rounded
      :to="back && !backHistory ? back : null"
      icon
      color="primary"
      size="sm"
      aria-label="Back"
      class="mob-page-header__back"
      @click="backHistory && $router.go(-1)"
    >
      <svg-icon name="arrow-left"></svg-icon>
    </Button>
    <div class="mob-page-header__title">{{ title }}</div>
    <div class="mob-page-header__save">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MobPageHeader',
    props: {
      title: {
        type: String,
        default: '',
      },
      back: {
        type: String,
        default: '',
      },
      backHistory: Boolean,
      noMargin: Boolean,
    },
  }
</script>

<style></style>
