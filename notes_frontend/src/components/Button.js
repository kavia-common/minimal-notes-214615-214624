import Blits from '@lightningjs/blits'

export default Blits.Component('Button', {
  template: `
      <Element>
          <Text content="$label"></Text>
      </Element>
    `,
  state() {
    return {
      label: 'Press Enter',
      _toggle: false,
    }
  },
  input: {
    enter() {
      this._toggle = !this._toggle
      this.label = this._toggle ? 'Press Enter Again' : 'Press Enter'
    },
  },
})
