<template>
  <form novalidate @submit.prevent="submit">
    <Title size="lg" class="mb-25"> Log in </Title>
    <div class="grid grid-flow-row gap-8 text-left">
      <TextField
        v-model="email"
        type="email"
        label="Email"
        placeholder="Email"
        required
        :has-error="showErrors && !email"
      />
      <TextField
        v-model="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Password"
        required
        :has-error="showErrors && !password"
      />
    </div>

    <Button :loading="loading" type="submit" color="primary" size="md" class="mt-30 w-230">
      Log in
    </Button>

    <div v-if="emailError" class="text-red mt-20">
      {{ emailError }}
    </div>
    <div v-if="passwordError" class="text-red mt-20">
      {{ passwordError }}
    </div>

    <div class="mt-20 -mb-10">
      <Button
        text
        size="md"
        color="black"
        class="underline hover:no-underline h-40"
        @click="changeStep('reset-password', true)"
      >
        Forgot password?
      </Button>
      <Button
        text
        size="md"
        color="black"
        class="underline hover:no-underline h-40"
        @click="changeStep('login', true)"
      >
        Other login options
      </Button>
    </div>
  </form>
</template>

<script>
  export default {
    name: 'LoginEmailForm',
    props: {
      insideModal: Boolean,
    },
    data() {
      return {
        email: '',
        password: '',
        loading: false,
        showErrors: false,
        emailError: '',
        passwordError: '',
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
        if (!this.insideModal && changeRouter) {
          this.$router.push(`/${step}`)
        }
      },
      async submit() {
        if (!this.email || !this.password || this.loading) {
          this.showErrors = true
          return
        }
        this.emailError = ''
        this.passwordError = ''
        this.loading = true
        try {
          await this.$auth
            .loginWith('local', {
              data: {
                email: this.email,
                role: this.role,
                password: this.password,
              },
            })
            .then(r => {
              this.$emit('close')
              if (!this.insideModal) {
                this.$router.push('/')
              }
            })
        } catch (error) {
          // this.error = error.response.data?.message || ''
          this.emailError = error.response.data?.errors?.email || false
          this.passwordError = error.response.data?.errors?.password || false
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>
