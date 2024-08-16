<template>
  <label class="swither">
    <input
      :id="id"
      type="checkbox"
      :name="name"
      :value="value"
      :class="className"
      :required="required"
      :disabled="disabled"
      :checked="state"
      class="sr-only"
      @change="onChange"
    />
    <div class="swither__content"><slot></slot></div>
  </label>
</template>

<script>
  export default {
    name: 'Switcher',
    model: {
      prop: 'modelValue',
      event: 'input',
    },
    props: {
      id: {
        type: String,
        default() {
          return 'checkbox-id-' + this._uid
        },
      },
      name: {
        type: String,
        default: null,
      },
      value: {
        type: [String, Number, Array, Object],
        default: null,
      },
      modelValue: {
        type: [String, Number, Array, Boolean],
        default: undefined,
      },
      className: {
        type: String,
        default: null,
      },
      checked: {
        type: Boolean,
        default: false,
      },
      required: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      state() {
        if (this.modelValue === undefined) {
          return this.checked
        }
        if (Array.isArray(this.modelValue)) {
          return this.modelValue.includes(this.value)
        }
        return !!this.modelValue
      },
    },
    watch: {
      checked(newValue) {
        if (newValue !== this.state) {
          this.toggle()
        }
      },
    },
    mounted() {
      if (this.checked && !this.state) {
        this.toggle()
      }
    },
    methods: {
      onChange() {
        this.toggle()
      },
      toggle() {
        let value
        if (Array.isArray(this.modelValue)) {
          value = this.modelValue.slice(0)
          if (this.state) {
            value.splice(value.indexOf(this.value), 1)
          } else {
            value.push(this.value)
          }
        } else {
          value = !this.state
        }
        this.$emit('input', value)
      },
    },
  }
</script>

<style lang="postcss">
   .swither  {
      cursor: pointer;
   }
  .swither__content {
    @apply rounded-full relative bg-black bg-opacity-35 h-35 w-65 transition duration-150;
  }
  .swither__content::before {
     content: '';
     position: absolute;
     top: 3px;
     left: 3px;
     width: 2.9rem;
     height: 2.9rem;
     background-color: #fff;
     border-radius: 50%;
     transition: .15s
  }
  input:checked ~ .swither__content {
     @apply bg-primary bg-opacity-100;
  }
  input:checked ~ .swither__content::before {
      transform: translateX(2.9rem);
  }
</style>
