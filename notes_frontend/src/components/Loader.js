import Blits from '@lightningjs/blits'

export default Blits.Component('Loader', {
  template: `
    <Element>
      <Circle size="40" :color="$color1" :alpha="$alpha1" />
      <Circle size="40" :color="$color2" x="60" :alpha="$alpha2" />
      <Circle size="40" :color="$color3" x="120" :alpha="$alpha3" />
    </Element>
    `,
  props: ['loaderColor'],
  state() {
    const base = this.loaderColor ? this.loaderColor : '#94a3b8'
    return {
      color1: base,
      color2: base,
      color3: base,
      alpha1: 1,
      alpha2: 0.8,
      alpha3: 0.6,
    }
  },
  hooks: {
    ready() {
      this.$setInterval(() => {
        // simple cyclic alpha without transition objects
        const a1 = this.alpha1
        this.alpha1 = this.alpha2
        this.alpha2 = this.alpha3
        this.alpha3 = a1
      }, 800)
    },
  },
})
