<template>
  <!-- <Loading v-if="loading" class="w-50 h-50 text-primary fixed-center" /> -->
  <form novalidate @submit.prevent="submit">
    <Title size="lg" class="mb-25">Reset password</Title>

    <div class="grid grid-flow-row gap-8 text-left">
      <TextField
        v-model="password"
        type="password"
        name="password"
        label="New password"
        placeholder="New password"
        required
        :error-message="passwordError"
        :has-error="(showErrors && !password) || passwordError"
      />
      <TextField
        v-model="password_confirmation"
        type="password"
        name="password_confirmation"
        label="Confirm new password"
        placeholder="Confirm new password"
        required
        :error-message="confirmPasswordError"
        :has-error="showErrors && !password_confirmation"
      />
    </div>

    <div v-if="emailError" class="text-red mt-20 -mb-10">{{ emailError }}</div>

    <Button :loading="loading" type="submit" color="primary" size="md" class="mt-30 w-230">
      Log in
    </Button>
  </form>
</template>

<script>
  export default {
    name: 'AuthPasswordReset',
    layout: 'auth',
    data() {
      return {
        loading: false,
        token: '',
        email: '',
        emailError: '',
        showErrors: '',
        passwordError: '',
        confirmPasswordError: '',
        password: '',
        password_confirmation: '',
      }
    },
    mounted() {
      const params = this.$route.query
      this.token = params.token
      this.email = params.email
      // this.$axios
      //   .$post('/auth/verify/success', {
      //     token: params.token,
      //     email: params.email,
      //   })
      //   .then(res => {
      //     if (res.success) {
      //       this.loading = false
      //     }
      //     // this.$router.push('/new-password')
      //   })
      // if (this.$auth.loggedIn) {
      //   // params.user_id = this.$auth.user.id
      // }
    },
    methods: {
      submit() {
        this.showErrors = true
        this.newPasswordError = ''
        this.confirmPasswordError = ''
        this.emailError = ''
        this.loading = true

        const params = {
          token: this.token,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
        }

        this.$axios
          .$post('/auth/password/reset', params)
          .then(resp => {
            if (resp.success) {
              const _this = this
              this.$auth.setUserToken(resp.data.token).then(() => {
                _this.loading = false
              })
            } else {
              this.loading = false
            }
          })
          .catch(error => {
            const errors = error.response.data.errors
            this.passwordError = errors.password || ''
            this.emailError = errors.email || ''
            this.confirmPasswordError = errors.new_password_confirmation || ''
            this.loading = false
          })
      },
      async logout(after) {
        try {
          await this.$auth.logout()
          this.$auth.setUserToken(false)
          // this.$auth.setToken(false)
          // this.$auth.setRefreshToken(false)
          // this.$axios.setHeader('Authorization', false)
          // localStorage && localStorage.setItem('auth._token.local', 'false')
          after()
        } catch (error) {
        } finally {
        }
      },
    },
  }
  // http://localhost:3000/auth/google/callback?code=4%2F5AEF-Tw4adaC0a5tD1xpF6B-tjUMygekssYMj1zgBeoUafR3K7xOW1GAH_9ePkjTiIsw0BLVx8HbHTqc99pQndw&scope=email%20profile%20openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=1&hd=ag.digital&prompt=none
</script>
