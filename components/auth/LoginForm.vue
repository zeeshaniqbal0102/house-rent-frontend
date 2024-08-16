<template>
  <RegisterForm v-if="step === 'register'" :inside-modal="insideModal" @close="$emit('close')" />
  <LoginEmailForm
    v-else-if="step === 'login-email'"
    :inside-modal="insideModal"
    @close="$emit('close')"
  />
  <div v-else>
    <Title size="lg" class="mb-25"> Log in </Title>

    <!-- <RoleSwitcher /> -->

    <form novalidate @submit.prevent="submit">
      <TextField
        v-model="phone"
        required
        type="tel"
        label="Your phone number"
        placeholder="Your phone number"
        description="We will text you to confirm your number"
        class="text-center"
        :field-classes="['text-center', 'pr-40']"
        :mask="{
          numericOnly: true,
          delimiters: ['-', '-'],
          blocks: [3, 3, 4],
        }"
        :error-message="!phone && showErrors ? 'The phone number is required' : phoneError"
        :has-error="(showErrors && !phone) || phoneError"
      >
        <span slot="prefix"> +1 </span>
      </TextField>
      <Button type="submit" :loading="loading" color="primary" size="md" class="w-full mt-20">
        Continue
      </Button>
    </form>
    <Divider class="px-20 my-35"> or continue with </Divider>
    <AuthButtons type="login" :inside-modal="insideModal" @close="$emit('close')" />
    <div class="mt-20">
      Don’t have an account?
      <Button
        v-if="insideModal"
        text
        color="primary"
        bold
        class="px-0 py-5"
        @click="changeStep('signup-login', true)"
      >
        Sign up here
      </Button>
      <Button
        v-else
        :to="`/signup-login${$route.query.host ? '?host=1' : ''}`"
        text
        color="primary"
        bold
        class="px-0 py-5"
      >
        Sign up here
      </Button>
    </div>
  </div>
</template>

<script>
  import VerifyModal from '~/components/auth/VerifyModal'
  export default {
    name: 'LoginForm',
    props: {
      insideModal: Boolean,
      reservation: Boolean,
    },
    data() {
      return {
        loading: false,
        phone: '',
        showErrors: false,
        phoneError: '',
        roles: [
          {
            title: 'Guest',
          },
          {
            title: 'Host',
          },
        ],
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
    methods: {
      changeStep(step, changeRouter = false) {
        this.$store.dispatch('authForm/set', { step })

        // if (step === 'phone-verify') {
        //   return
        // }
        if (!this.insideModal && changeRouter) {
          this.$router.push(`/${step}`)
        }
      },
      submit() {
        if (this.loading || !this.phone) {
          this.showErrors = true
          return
        }

        this.phoneError = ''
        this.loading = true

        this.$axios
          .$post('/auth/phone/code', { phone: '+1' + this.phone, type: 'login' })
          .then(resp => {
            this.$store.dispatch('authForm/set', { phone: '+1' + this.phone })
            this.changeStep('phone-verify')
            const _this = this
            this.loading = false
            this.showVerifyModal({
              type: 'login',
              onSuccess(resp) {
                if (resp.data.token) {
                  this.$auth.setUserToken(resp.data.token).then(() => {
                    _this.$emit('close')
                    if (!_this.insideModal) {
                      _this.$router.push('/')
                    }
                  })
                }
              },
            })
          })
          .catch(error => {
            const errors = error.response.data.errors
            this.loading = false
            if (error.response.data.message) {
              this.phoneError = error.response.data.message
            }
            if (errors && errors.phone) {
              this.phoneError = errors.phone
            }
          })
      },
      showVerifyModal(data) {
        this.$modal.show(
          VerifyModal,
          data, // { message },
          VerifyModal.methods.getModalParams({
            'click-to-close': false,
          })
        )
      },
    },
  }
</script>
