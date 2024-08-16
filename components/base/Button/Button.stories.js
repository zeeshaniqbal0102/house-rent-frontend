import { withKnobs, text, select } from '@storybook/addon-knobs'
import ButtonDoc from './Button.md'

export default {
 title: 'Button',
 decorators: [withKnobs],
 parameters: {
  notes: ButtonDoc,
 },
}

export const baseButton = () => ({
  components: '<Button>Base Button</Button>',
  props: {
    color: {
      default: select('Color', { Default: '', Primary: 'primary', Green: 'green', Blue: 'blue', White: 'white', Black: 'black' }, 'primary'),
    },
    text: {
      default: text('Text', 'Base Button'),
    },
  },
  template: '<Button :color="color">{{ text }}</Button>',
})
export const primaryButton = () => '<Button color="primary">Primary Button</Button>'
export const greenButton = () => '<Button color="green">Primary Button</Button>'
export const blueButton = () => '<Button color="blue">Primary Button</Button>'
export const whiteButton = () => '<Button color="white">Primary Button</Button>'
export const blackButton = () => '<Button color="black">Primary Button</Button>'
