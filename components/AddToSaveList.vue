<template>
  <div class="flex flex-col h-full overflow-hidden w-full">
    <div
      class="window-header flex justify-between items-center flex-shrink-0 pl-15 pr-25 sm:px-40 py-20 border-b border-line"
    >
      <div class="text-lg md:text-xl font-medium">Save to the list</div>
      <Button
        rounded
        icon
        color="black"
        size="sm"
        class="-mr-15"
        aria-label="Close"
        @click="$emit('close')"
      >
        <svg-icon name="close" class="h-12 w-12 fill-current" />
      </Button>
    </div>

    <div class="px-20 lg:px-40 py-20 lg:py-30 relative">
      <Loading v-if="loading" class="w-40 h-40 mx-auto"></Loading>
      <div
        v-if="loadingSave"
        class="absolute inset-0 z-4 grid place-items-center bg-white bg-opacity-80"
      >
        <Loading class="w-40 h-40 mx-auto"></Loading>
      </div>
      <ul v-if="!loading && list.length" class="grid grid-flow-row gap-10 lg:gap-15">
        <li v-for="item in list" :key="item.id">
          <button class="btn-base save-listing-preview" @click="AddToSaveList(item.id)">
            <img :src="item.image" :alt="item.title" class="save-listing-preview__photo" />
            <div class="save-listing-preview__title">
              {{ item.title }}
            </div>
            <div class="save-listing-preview__desc">
              {{ `${item.count} ${item.count > 1 ? 'spaces' : 'space'}` }}
            </div>
          </button>
        </li>
      </ul>
      <div v-if="!loading && !list.length" class="sm:text-lg text-gray">
        You don't have any lists yet
      </div>
    </div>

    <div class="border-t border-line px-40 py-8 lg:py-10 text-center">
      <Button alpha-bg text color="primary" size="md" class="w-150" @click="showCreateSaveList">
        Create new lIst
      </Button>
    </div>
  </div>
</template>

<script>
  import CreateSaveList from '~/components/CreateSaveList'

  const modalParams = {
    width: 480,
    scrollable: true,
    height: 'auto',
    adaptive: true,
    'focus-trap': true,
    classes: 'shadow',
  }
  export default {
    name: 'AddToSaveList',
    props: {
      listingId: {
        type: Number,
        required: true,
      },
      onSaved: {
        type: Function,
        default: Function,
      },
    },
    data() {
      return {
        list: [],
        loading: true,
        loadingSave: false,
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      AddToSaveList(saveId) {
        this.loadingSave = true
        this.$axios
          .$post('/user/favorites/toggle', {
            item_type: 'listing',
            item_id: this.listingId,
            user_save_id: saveId,
          })
          .then(r => {
            if (r.success) {
              this.$store.dispatch('getFavorites', {
                onUpdate: () => {
                  this.loadingSave = false
                  this.$emit('close')
                },
              })
            } else {
              this.loadingSave = false
            }
          })
      },
      fetchData() {
        this.loading = true
        this.$axios
          .$get('/user/saves', {
            params: { limit: 99 },
          })
          .then(r => {
            this.list = r.data
            this.loading = false
          })
      },
      showCreateSaveList() {
        this.$modal.show(
          CreateSaveList,
          {
            onSaved: this.fetchData,
          },
          CreateSaveList.methods.getModalParams()
        )
      },
      getModalParams() {
        return modalParams
      },
    },
  }
</script>

<style lang="postcss">
  .save-listing-preview {
    @apply rounded;
    position: relative;
    width: 100%;
    padding: 1.2rem;
    padding-left: 9rem;
    text-align: left;
    transition: 0.15s;
    &:hover {
      background-color: #f5f5f5;
    }
    &__photo {
      @apply rounded;
      position: absolute;
      top: 1.2rem;
      left: 1.2rem;
      width: 6.4rem;
      height: 4.8rem;
      object-fit: cover;
      object-position: center;
    }
    &__title {
      font-weight: 500;
      font-size: 1.5rem;
    }
  }
</style>
