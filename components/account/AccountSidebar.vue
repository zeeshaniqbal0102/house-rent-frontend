<template>
  <div class="col-span-4">
    <div class="shadow-lg px-25 py-40 rounded sticky top-20 text-center">
      <div class="relative inline-block mb-35">
        <Avatar size="w-130 h-130" class="relative" :loading="loading" :src="user.image"></Avatar>
        <input
          v-if="allowEdit"
          ref="uploadFile"
          type="file"
          accept="image/*;capture=camera"
          class="sr-only"
          @change="saveImage"
        />
        <div
          v-if="allowEdit"
          class="absolute bottom-0 right-0 border-2 border-solid border-white rounded-full mb-5 mr-5"
        >
          <Dropdown position="center" class="flex">
            <Button color="primary" fab rounded size="sm">
              <svg-icon name="plus-bold" class="w-12 h-12 fill-current text-white"></svg-icon>
            </Button>
            <div slot="dropdown" class="py-10">
              <Button
                v-if="user.has_image"
                text
                block
                start
                tile
                alpha-bg
                color="black"
                size="sm"
                class="whitespace-no-wrap px-25 close-dropdown"
                @click="deleteAvatar"
              >
                Delete a Photo
              </Button>
              <Button
                text
                block
                start
                tile
                alpha-bg
                color="black"
                size="sm"
                class="whitespace-no-wrap px-25 close-dropdown"
                @click="changeAvatar"
              >
                {{ user.has_image ? 'Change' : 'Upload' }} a Photo
              </Button>
            </div>
          </Dropdown>
        </div>
      </div>

      <div class="px-20">
        <div class="flex items-center">
          <svg-icon name="star-line" class="fill-current h-22 w-22 -mt-3"></svg-icon>
          <span class="font-semibold pl-15">Reviews ({{ user.reviews_length }})</span>
        </div>
      </div>
      <Divider
        v-if="user.is_phone_verified || user.is_email_verified || user.is_email_verified"
        class="my-20"
      />
      <div
        v-if="user.is_phone_verified || user.is_email_verified || user.is_identity_verified"
        class="px-20"
      >
        <div class="text-lg font-semibold mb-20 text-left">{{ user.first_name }} confirmed</div>
        <div class="grid grid-flow-row gap-15">
          <IconText v-if="user.is_phone_verified" icon="checked"> Phone number </IconText>
          <IconText v-if="user.is_email_verified" icon="checked"> Email address </IconText>
          <IconText v-if="user.is_identity_verified" icon="secure" size="w-18 h-18 -ml-2">
            Identity verified
          </IconText>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AccountSidebar',
    props: {
      user: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        photo: this.user.image,
        loading: false,
      }
    },
    computed: {
      allowEdit() {
        return this.user.id === this.$auth?.user?.id
      },
    },
    methods: {
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

<style></style>
