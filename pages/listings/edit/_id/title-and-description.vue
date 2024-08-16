<template>
  <div class="w-500 max-w-full">
    <h2 class="listing-edit-header">Title for your listing</h2>
    <TextField
      v-model="title"
      placeholder="Type the title here"
      label="Type the title here"
      :limit="50"
      autofocus
    ></TextField>
    <div class="text-gray text-sm mt-10">E.g., Beautiful green backyard with BBQ spot</div>
    <Divider size="lg" />
    <h2 class="listing-edit-header">Description</h2>
    <TextField
      v-model="description"
      type="textarea"
      rows="3"
      placeholder="Type your message here"
      label="Type your message here"
      :limit="500"
      required
    ></TextField>
    <div class="text-gray text-sm mt-10">
      E.g., Our heated, salt water, full sun pool has a modern, clean aesthetic with a beautiful
      jacuzzi and a Baja shelf (with umbrella stand for shade upon request) for small children. The
      pool was part of our recent renovation so it’s only about a year old. Bring the kids and play
      a game of kick ball on our turf grass, take a swim then cozy up to our fire pit.
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ListingsEditTitleAndDescription',
    props: {
      post: {
        required: true,
        type: Object,
      },
      listing: {
        required: true,
        type: Object,
      },
      save: {
        type: Function,
        default: Function,
      },
    },
    data() {
      return {
        title: this.listing.title,
        description: this.listing.description,
      }
    },
    watch: {
      title(title) {
        this.$store.dispatch('listing/set', { title })
      },
      description(description) {
        this.$store.dispatch('listing/set', { description })
      },
    },
  }
</script>
