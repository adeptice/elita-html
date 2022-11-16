var controlsModule = new Vue ({
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
    menuLevel: 1,
    isMenuActive: false
  },
  computed: {
    menuClass() {
      return (window.navigationModule && navigationModule.isActive) || this.isMenuActive
        ? 'button--transform'
        : ''
    },
    currentLevel() {
      if ((window.navigationModule && navigationModule.isActive) || this.isMenuActive) {
        return this.menuLevel;
      }        
      return false      
    }
  },
  methods: {
    menuToggle() {
      if (window.navigationModule) {
        navigationModule.navigationToggle();
      }      
    }
  }
});
