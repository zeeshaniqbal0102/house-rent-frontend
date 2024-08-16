<template>
  <div class="container lg:pt-55 pb-50">
    <div class="h-full lg:w-1000 max-w-full mx-auto">
      <Title v-if="mq !== 'mobile'" tag="h1" size="xl" class="mb-30"> Account settings </Title>
      <Navigation
        v-if="mq !== 'mobile'"
        class="mb-40 -ml-15"
        type="secondary"
        :list="[
          {
            title: 'Personal info',
            to: `/settings/`,
          },
          {
            title: 'Phone',
            to: `/settings/phone`,
          },
          {
            title: 'Password',
            to: `/settings/password`,
          },
          {
            title: 'Connected accounts',
            to: `/settings/connected-accounts`,
          },
          {
            title: 'Payment methods',
            to: `/settings/payment-methods`,
          },
          {
            title: 'Notifications',
            to: `/settings/notifications`,
          }, {
            title: 'Integrations',
            to: `/settings/integrations`,
            role: `host`,
          }, {
            title: 'Other',
            to: `/settings/other`,
          },
        ]"
      />
      <nuxt-child />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'Settings',
    // layout: 'dashboard',
    middleware: 'auth',
    computed: mapState({
      mq: 'mq',
    }),
  }
</script>
