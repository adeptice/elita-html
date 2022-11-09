var controls = new Vue ({
  name: 'controls',
  el: '#controls',
  template: `
    <header class="controls" id="controls">
      <div class="button button__menu" :class="menuClass" :data-level="currentLevel" @click="menuToggle">
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path stroke-width="3" d="M0 3H36"></path>
          <path stroke-width="3" d="M0 18H36"></path>
          <path stroke-width="3" d="M0 33H36"></path>
        </svg>
      </div>
    </header>
  `,
  data: {
    isReady: true
  },
  computed: {
    menuClass() {
      return navigation.isActive ? 'button--transform': ''
    },
    isNavigation() {
      return !!navigation.isReady
    },
    currentLevel() {
      if (this.isNavigation)
        if (navigation.isActive) return navigation.level;
      return false
    }
  },
  methods: {
    menuToggle() {
      if (this.isNavigation) {
        navigation.navigationToggle();
      }
    }
  }
})
