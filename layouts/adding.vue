<template>
  <div v-if="getDataInit" class="lg:bg-gray-100 min-h-full">
    <TheHeader @modal="showModal" />
    <Nuxt />
    <TheFooter v-if="mq !== 'mobile'" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'AddingLayout',
    middleware: 'auth',
    data() {
      return {
        progress: 0,
      }
    },
    computed: mapState({
      mq: 'mq',
      getDataInit: 'getDataInit',
    }),
    watch: {
      '$auth.loggedIn'() {
        this.$store.dispatch('getClientData')
      },
    },
    mounted() {
      this.$store.dispatch('getClientData')
    },
    methods: {
      showModal(name) {
        this.$modal.show(name)
      },
    },
  }
</script>
