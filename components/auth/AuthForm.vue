<template>
  <div>
    <Button
      v-if="step !== 'signup-phone-verify' && step !== 'phone-verify'"
      icon
      rounded
      alpha-bg
      size="sm"
      color="black"
      class="absolute top-0 right-0 mt-15 mr-15"
      aria-label="Close"
      @click="$emit('close')"
    >
      <svg-icon name="close" class="fill-current h-12 w-12" />
    </Button>
    <div class="px-50 pt-25 pb-40 text-center">
      <LoginForm
        v-if="step === 'login' || step === 'login-email' || step === 'phone-verify'"
        inside-modal
        :reservation="reservation"
        @close="$emit('close')"
      />
      <SignupForm
        v-if="step === 'signup-login' || step === 'register' || step === 'signup-phone-verify'"
        :host="host"
        inside-modal
        @close="$emit('close')"
      />
      <ResetPasswordForm v-if="step === 'reset-password'" inside-modal @close="$emit('close')" />
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  const modalParams = {
    width: 435,
    scrollable: true,
    height: 'auto',
    adaptive: false,
    'focus-trap': true,
    'click-to-close': true,
    classes: 'shadow',
  }
  export default {
    name: 'AuthForm',
    props: {
      host: Boolean,
      reservation: Boolean,
    },
    computed: {
      step() {
        return this.$store.state.authForm.step
      },
      isMobile() {
        return this.$store.getters.isMobile
      },
    },
    mounted() {
      if (!this.isMobile) {
        this.$store.dispatch('authForm/set', { role: this.host ? 'host' : 'guest' })
        Cookies.set('role', this.host ? 'host' : 'guest')
      }
    },
    methods: {
      getModalParams(opts) {
        return Object.assign(modalParams, opts)
      },
      changeStep(step, changeRouter = false) {
        this.$store.dispatch('authForm/set', { step })
        if (!this.insideModal && changeRouter) {
          this.$router.push(`/${step}`)
        }
      },
    },
  }
</script>
