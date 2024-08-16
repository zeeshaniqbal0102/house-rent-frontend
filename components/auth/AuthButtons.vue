<template>
  <div class="grid grid-cols-4 gap-10 mb-50">
    <Button
      color="black"
      outlined
      size="md"
      @click="changeStep(type == 'login' ? 'login-email' : 'register')"
    >
      <svg-icon class="w-25 h-25 absolute-center fill-current text-green" name="email" />
      <span class="absolute bottom-0 inset-x-0 -mb-30">Email</span>
    </Button>
    <Button color="black" outlined size="md" @click="loginFacebook">
      <svg-icon class="w-25 h-25 absolute-center fill-current" name="facebook-circle" />
      <span class="absolute bottom-0 inset-x-0 -mb-30">Facebook</span>
      <Loading
        v-if="facebookLoading"
        class="w-20 h-20 absolute top-1/2 right-0 transform -translate-y-1/2 mr-10"
      ></Loading>
    </Button>
    <Button color="black" outlined size="md" @click="loginGoogle()">
      <svg-icon class="w-25 h-25 absolute-center fill-current" name="google" />
      <span class="absolute bottom-0 inset-x-0 -mb-30">Google</span>
      <Loading
        v-if="googleLoading"
        class="w-20 h-20 absolute top-1/2 right-0 transform -translate-y-1/2 mr-10"
      ></Loading>
    </Button>

    <Button color="black" outlined size="md" @click="loginApple()">
      <svg-icon class="w-25 h-25 absolute-center fill-current" name="apple" />
      <span class="absolute bottom-0 inset-x-0 -mb-30">Apple</span>
      <Loading
        v-if="appleLoading"
        class="w-20 h-20 absolute top-1/2 right-0 transform -translate-y-1/2 mr-10"
      ></Loading>
    </Button>
    <div v-if="errorMessage" class="text-red -mt-5">{{ errorMessage }}</div>
  </div>
</template>

<script>
  export default {
    name: 'AuthButtons',
    props: {
      insideModal: Boolean,
      type: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        isFBReady: false,
        isAppleReady: false,
        errorMessage: '',

        facebookLoading: false,
        googleLoading: false,
        appleLoading: false,
      }
    },
    computed: {
      step() {
        return this.$store.state.authForm.step
      },
      role() {
        return this.$store.state.authForm.role
      },
    },
    watch: {
      isAppleReady() {
        this.initApple()
      },
    },
    mounted() {
      this.isFBReady = window.FB !== undefined
      window.addEventListener('fb-sdk-ready', this.onFBReady)
      if (this.isAppleReady) {
        this.initApple()
      }
    },
    beforeDestroy() {
      window.removeEventListener('fb-sdk-ready', this.onFBReady)
    },
    methods: {
      initApple() {
        window.AppleID.auth.init({
          clientId: 'WebServiceID',
          usePopup: true,
          state: 'origin:web',
          scope: 'name email',
          redirectURI: 'https://staymenity.com',
        })
      },
      onFBReady() {
        this.isFBReady = true
      },
      async loginApple() {
        try {
          this.appleLoading = true
          const data = await window.AppleID.auth.signIn()
          this.$axios
            .$get('/auth/socialite/apple/callback', {
              params: {
                access_token: data.authorization.id_token,
                role: this.role,
              },
            })
            .then(resp => {
              if (resp.data.token) {
                const _this = this
                this.$auth.setUserToken(resp.data.token).then(() => {
                  _this.loading = false
                  _this.$emit('close')
                  _this.appleLoading = false
                  if (!_this.insideModal) {
                    this.$router.push('/')
                  }
                })
              }
            })
            .catch(error => {
              const message = error.response.data.message
              this.errorMessage = message
              this.appleLoading = false
            })
        } catch (error) {
          this.appleLoading = false
          // handle error.
        }
      },
      loginGoogle() {
        this.errorMessage = ''
        this.googleLoading = true
        this.$gAuth.signIn().then(res => {
          this.$axios
            .$get('/auth/socialite/google/callback', {
              params: {
                access_token: res.getAuthResponse().access_token,
                role: this.role,
              },
            })
            .then(resp => {
              if (resp.data.token) {
                const _this = this
                this.$auth.setUserToken(resp.data.token).then(() => {
                  _this.loading = false
                  _this.$emit('close')
                  _this.googleLoading = false
                  if (!_this.insideModal) {
                    this.$router.push('/')
                  }
                })
              }
            })
            .catch(error => {
              const message = error.response.data.message
              this.errorMessage = message
              this.googleLoading = false
            })
        })
      },
      loginFacebook() {
        if (this.isFBReady) {
          this.errorMessage = ''
          this.facebookLoading = true
          window.FB.login(
            res => {
              this.$axios
                .$get('/auth/socialite/facebook/callback', {
                  params: {
                    access_token: res?.authResponse?.accessToken,
                    role: this.role,
                  },
                })
                .then(resp => {
                  if (resp.data.token) {
                    const _this = this
                    this.$auth.setUserToken(resp.data.token).then(() => {
                      _this.loading = false
                      _this.$emit('close')
                      _this.facebookLoading = false
                      if (!_this.insideModal) {
                        this.$router.push('/')
                      }
                    })
                  }
                })
                .catch(error => {
                  const message = error.response.data.message
                  this.errorMessage = message
                  this.facebookLoading = false
                })
            },
            { scope: 'public_profile,email' }
          )
        }
      },
      changeStep(step, changeRouter = false) {
        this.$store.dispatch('authForm/set', { step })

        // if (step === 'phone-verify') {
        //   return
        // }
        if (!this.insideModal && changeRouter) {
          this.$router.push(`/${step}`)
        }
      },
    },
    head() {
      return {
        script: [
          {
            hid: 'appleid',
            src:
              'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
            defer: true,
            callback: () => {
              this.isAppleReady = true
            },
          },
        ],
      }
    },
  }
</script>

<style></style>
