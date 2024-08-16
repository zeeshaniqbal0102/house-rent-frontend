<template>
  <div></div>
</template>

<script>
  export default {
    name: 'Logout',
    middleware: 'auth',
    layout: 'loading',
    mounted() {
      this.logout()
    },
    methods: {
      async logout() {
        try {
          this.logoutLoading = true
          await this.$auth.logout()
          this.$auth.setUserToken(false)
          // this.$axios.setHeader('Authorization', false)
          // localStorage && localStorage.setItem('auth._token.local', 'false')
          this.$router.push('/')
        } catch (error) {
        } finally {
          this.logoutLoading = false
        }
      },
    },
  }
</script>
