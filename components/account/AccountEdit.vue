<template>
  <div class="container">
    <MobPageHeader v-if="isMobile" title="Your profile" back="/account/info">
      <template v-slot:right>
        <Button text color="primary" size="sm" :loading="loading" @click="save"> Save </Button>
      </template>
    </MobPageHeader>
    <div class="lg:pt-55 pb-50 h-full w-1000 max-w-full mx-auto">
      <div class="lg:grid lg:grid-cols-11 gap-60">
        <AccountSidebar v-if="!isMobile" :user="$auth.user" />
        <div class="lg:col-span-7">
          <div v-if="!isMobile" class="mb-45">
            <div class="text-2xl font-medium">HI, I’m {{ $auth.user.first_name }}</div>
            <div class="text-gray">Joined in {{ $auth.user.registered_at_formatted }}</div>
          </div>

          <label
            v-if="isMobile"
            class="block w-120 h-120 mx-auto mb-25 relative rounded-full overflow-hidden"
          >
            <div class="absolute inset-0 bg-black-dark bg-opacity-50 z-2">
              <svg-icon
                name="camera"
                class="absolute-center w-25 h-25 fill-current text-white"
              ></svg-icon>
            </div>
            <input
              ref="uploadFile"
              type="file"
              accept="image/*;capture=camera"
              class="sr-only"
              @change="saveImage"
            />
            <Avatar
              v-if="isMobile"
              size="w-120 h-120"
              class="relative text-left"
              :loading="loading"
              :src="$auth.user.image"
            />
          </label>

          <div class="sm:w-600 max-w-full">
            <Title tag="label" for="description-field" size="md" class="block mb-15 lg:mb-20">
              About
            </Title>

            <TextField
              id="about-field"
              v-model="description"
              required
              type="textarea"
              :has-error="showErrors && !description"
              placeholder="Tell us about yourself, your hobby, etc."
              class="mb-35"
            ></TextField>

            <Title tag="label" for="description-field" size="md" class="block mb-15 lg:mb-20">
              I live in
            </Title>

            <v-select
              v-model="city"
              placeholder="Enter or select your city"
              :options="cities"
              :label="'description'"
              :no-drop="searchCityQuery ? false : true"
              class="sm:w-300"
              @search="debounceFetchAddress"
            >
              <template #no-options>
                <div class="text-left w-full px-20">City not found</div>
              </template>
            </v-select>

            <div v-if="!isMobile" class="flex mt-60">
              <Button size="md" color="primary" :loading="loading" @click="save"> Save </Button>
              <Button size="md" to="/account" class="underline text-gray-300"> Cancel </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import debounce from 'debounce'
  export default {
    name: 'AccountEdit',
    data() {
      return {
        description: '',
        showErrors: false,
        loading: false,
        searchCityQuery: '',
        city: '',
        photo: this.$auth.user.image,
        cities: [],
      }
    },
    computed: {
      isMobile() {
        return this.$store.getters.isMobile
      },
      debounceFetchAddress() {
        const DELAY = 300
        return debounce(this.fetchAddress, DELAY)
      },
    },
    mounted() {
      this.description = this.$auth.user.description
      if (this.$auth.user.location) {
        this.city = {
          description: this.$auth.user.location.text,
          place_id: this.$auth.user.location.place_id,
        }
      }
    },
    methods: {
      fetchAddress(search, loading) {
        if (search) {
          loading(true)
          this.$axios
            .$get(`/search/city?q=${search}`)
            .then(r => {
              this.searchCityQuery = search
              this.cities = r.data
              loading(false)
            })
            .catch(error => {
              console.log(error)
              loading(false)
            })
        }
      },
      save() {
        this.loading = true
        this.$axios
          .put('/user', {
            description: this.description,
            city: this.city.description,
            place_id: this.city.place_id,
          })
          .then(resp => {
            this.$auth.fetchUser().then(resp => {
              this.loading = false
              this.$router.push('/account')
            })

            // if (resp.data.success) {

            // }
          })
      },

      deleteAvatar() {
        this.loading = true
        this.$axios.delete('/user/image').then(resp => {
          this.$auth.fetchUser().then(resp => {
            this.loading = false
            this.$refs.uploadFile.value = ''
          })
        })
      },
      changeAvatar() {
        this.$refs.uploadFile.click()
      },
      saveImage({ target }) {
        if (!target.files[0]) {
          return
        }
        this.loading = true
        const params = new FormData()
        params.append('image', target.files[0])
        this.$axios({
          method: 'POST',
          url: '/user',
          headers: {
            Authorization:
              localStorage.getItem('auth._token.local') ||
              `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
          data: params,
        }).then(resp => {
          this.$auth.fetchUser().then(resp => {
            this.loading = false
          })
          if (resp.data.success) {
          }
        })
      },
    },
  }
</script>
