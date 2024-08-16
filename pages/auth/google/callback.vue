<script>
  import Cookies from 'js-cookie'
  export default {
    name: 'AuthGoogleCallback',
    layout: 'loading',
    mounted() {
      const params = this.$route.query
      if (this.$auth.loggedIn) {
        params.user_id = this.$auth.user.id
      }
      this.$axios.$get('/sanctum/auth/google/callback', { params }).then(r => {
        Cookies.remove('role')
        if (!this.$auth.loggedIn) {
          this.$auth.setUserToken(r.data.token)
        } else {
          this.logout(() => {
            this.$auth.setUserToken(r.data.token)
          })
        }
        // this.$auth.setUserToken(r.data.token)// .then(() => this.$router.push('/adding'))
      })
    },
    methods: {
      async logout(after) {
        try {
          await this.$auth.logout()
          after()
        } catch (error) {
        } finally {
        }
      },
    },
  }
  // http://localhost:3000/auth/google/callback?code=4%2F5AEF-Tw4adaC0a5tD1xpF6B-tjUMygekssYMj1zgBeoUafR3K7xOW1GAH_9ePkjTiIsw0BLVx8HbHTqc99pQndw&scope=email%20profile%20openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=1&hd=ag.digital&prompt=none
</script>
