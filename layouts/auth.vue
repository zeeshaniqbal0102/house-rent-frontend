<template>
  <div class="fix-bottom-footer min-h-full">
    <TheHeader />
    <div :class="[{ 'lg:flex lg:flex-col lg:justify-center lg:items-center': isVerify }]">
      <main
        :class="[
          'container w-600 mx-auto max-w-full text-center py-20 pb-80 lg:py-50 md:my-50 md:border border-gray-100 rounded',
          { 'border-none': isVerify },
        ]"
      >
        <!-- <NavigationAuth v-if="isMobile" class="mb-20" /> -->
        <Nuxt />
      </main>
    </div>
    <TheFooter v-if="!isMobile || $route.name == 'index'" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'AuthLayout',
    auth: false,
    computed: {
      ...mapGetters({
        isMobile: 'isMobile',
      }),
      isVerify() {
        return (
          this.$route.name === 'auth-verify-success' || this.$route.name === 'auth-verify-failed'
        )
      },
    },

    watch: {
      '$auth.loggedIn'() {
        this.$store.dispatch('getClientData')
      },
      $route(to, from) {
        this.$store.dispatch('authForm/set', { role: to.query.host ? 'host' : 'guest' })
      },
    },
    mounted() {
      this.$store.dispatch('getClientData')
    },
    created() {
      this.$store.dispatch('authForm/set', { role: this.$route.query.host ? 'host' : 'guest' })
    },
  }
</script>
