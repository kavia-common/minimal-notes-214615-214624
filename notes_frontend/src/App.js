import Blits from '@lightningjs/blits'

import NotesHome from './pages/NotesHome.js'

export default Blits.Application({
  template: `
    <Element>
      <RouterView />
    </Element>
  `,
  routes: [{ path: '/', component: NotesHome }],
})
