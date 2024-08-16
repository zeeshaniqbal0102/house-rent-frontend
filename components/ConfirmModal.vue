<template>
  <div class="flex flex-col h-full overflow-hidden w-full p-40 text-center">
    <Title tag="h2" size="lg" class="mb-20">{{ title }}</Title>
    <div v-if="description" v-html="description"></div>
    <div class="grid grid-cols-2 gap-15 mt-30">
      <Button :loading="actionLoading" outlined size="md" color="red" @click="actionClick()">
        {{ actionText }}
      </Button>
      <Button size="md" color="primary" @click="$emit('close')"> {{ cancelText }} </Button>
    </div>
    <div v-if="description2" class="mt-20 text-sm" v-html="description2"></div>
  </div>
</template>

<script>
  const modalParams = {
    width: 400,
    scrollable: true,
    height: 'auto',
    adaptive: true,
    'focus-trap': true,
    classes: 'shadow',
  }
  export default {
    name: 'DeleteAccount',
    props: {
      title: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      description2: {
        type: String,
        default: '',
      },
      actionText: {
        type: String,
        default: '',
      },
      cancelText: {
        type: String,
        default: 'Cancel',
      },
      onSuccess: {
        type: Function,
        default: Function,
      },
    },
    data() {
      return {
        actionLoading: false,
      }
    },
    methods: {
      getModalParams() {
        return modalParams
      },
      actionClick() {
        this.onSuccess(this, this.loading)
      },
      loading(s) {
        this.actionLoading = s
      },
    },
  }
</script>
