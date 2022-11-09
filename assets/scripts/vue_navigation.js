Vue.component('navigation-list', {
  name: 'navigationList',
  props: {
    list: {
      type: Object,
      required: true
    },
    returnLink: {
      type: Object,
      required: true
    }
  },
  template: `
    <ul class="navigation__list">
      <li v-for="item in list" :key="item.id">
        <a
          :class="['navigation__item',
                    item.children ? 'navigation__item-parent' : '',
                    !!+item.isActive ? 'navigation__item--active' : '',
                    !!+item.isCurrent && !item.children ? 'navigation__item--current' : ''
                  ]"
          :href="item.url"
          v-html="item.title"
          @click.prevent="navigationItemClick(item)"
        ></a>
        <div
          v-if="item.children"
          :class="['navigation__column', !!+item.isActive ? 'navigation__column--active' : '' ]"
        >
          <div class="navigation__wrapper">
            <a
              class="navigation__return"
              :href="returnLink.url"
              v-html="returnLink.title"
              @click.prevent="returnItemClick(item)"
            ></a>
            <a
              class="navigation__link"
              :class="[!!+item.isCurrent ? 'navigation__link--current' : '' ]"
              :href="item.url"
              v-html="item.title"
            ></a>
            <navigation-list
              :list="item.children"
              :returnLink="item"
              @toggleActive="navigationItemClick"
              @closeActive="returnItemClick"
            ></navigation-list>
          </div>
        </div>
      </li>
    </ul>
  `,
  methods: {
    navigationItemClick(item) {
      this.$emit('toggleActive', item)
    },
    returnItemClick(item) {
      this.$emit('closeActive', item)
    }
  }
});

var navigation = new Vue ({
  name: 'navigation',
  el: '#navigation',
  template: `
    <nav class="navigation" :class="navClass" id="navigation">
      <header class="navigation__header">
        <img class="logo" src="./assets/images/elita_logo.svg" alt="Компания Элита" title="Компания Элита">
      </header>
      <div class="navigation__block" :data-level="level">
        <div class="navigation__column">
          <div class="navigation__wrapper">
            <template v-for="extLink in menuTree">
              <a
                :class="['navigation__ext-link', !!+extLink.isActive ? 'navigation__ext-link--active' : '' ]"
                :key="extLink.id"
                :href="extLink.url"
                v-html="extLink.title"
              ></a>
              <navigation-list
                v-if="extLink.children"
                :list="extLink.children"
                :returnLink="extLink"
                @toggleActive="toggleActiveItem"
                @closeActive="closeActiveItem"
              ></navigation-list>
            </template>
          </div>
        </div>
      </div>
      <footer class="navigation__footer">
        <h5 class="navigation__footer-phone">(812) 702-42-42</h5>
        <p>Санкт-Петербург</p>
      </footer>
    </nav>
  `,
  data: {
    isReady: true,
    isActive: false,
    level: 1,
    currentItem: null,
    menu: JSON.parse(JSON.stringify(window.menu)) || []
  },
  created() {
    this.currentItem = this.getCurrent(this.menuTree);
    this.activateParents(this.currentItem);
    this.level = this.currentItem.level;
    if (this.level === 0) this.level++
  },
  computed: {
    menuTree() {
      return this.findChild({ id: 'root', level: -1 });
    },
    navClass() {
      return this.isActive ? 'navigation--active' : ''
    }
  },
  methods: {
    findChild(potentialParent) {
      let output = new Object();
      for (let i = 0; i < this.menu.length; i++) {
        if (this.menu[i].id_parent === potentialParent.id) {
          let treeItem = Object.assign({}, this.menu[i], { level: potentialParent.level + 1 });
          let treeItemChildren = this.findChild(treeItem);
          if (Object.keys(treeItemChildren).length > 0 ) {
            treeItem.children = treeItemChildren;
          }
          output[this.menu[i].sort] = treeItem;
        }
      }
      return output
    },
    getCurrent(tree) {
      if (!!tree) {
        for (let i in tree) {
          if (!!+tree[i].isCurrent)
            return tree[i]

          if (tree[i].children) {
            let child = this.getCurrent(tree[i].children);
            if (child) return child
          }
        }
      }
      return false
    },
    activateParents(item) {
      for (let i = 0; i < this.menu.length; i++) {
        let $menu_record = this.menu[i];
        if ($menu_record.id === item.id) {
          $menu_record.isActive = '1';
          this.$set(this.menu, i, $menu_record);
        }

        if ($menu_record.id === item.id_parent) {
          $menu_record.isActive = '1'
          this.$set(this.menu, i, $menu_record);
          this.activateParents($menu_record);
          return true;
        }
      }
      return false
    },
    openNavigation(){
      if (!this.isActive) this.isActive = true;
    },
    toggleActiveItem(item) {
      if (item.children) {
        this.openNavigation();
        if (!!!+item.isActive) {
          for (let i = 0; i < this.menu.length; i++) {
            let $menu_record = this.menu[i];
            if ($menu_record.id === item.id) {
              this.level = item.level + 1;
              $menu_record.isActive = '1'
              this.$set(this.menu, i, $menu_record);
            } else if (($menu_record.id_parent !== 'root') && (!!+$menu_record.isActive) && (item.id_parent !== $menu_record.id)) {
              delete $menu_record.isActive
              this.$set(this.menu, i, $menu_record);
            }
          }
        }
      } else {
        window.location.href = item.url;
      }
    },
    closeActiveItem(item) {
      this.openNavigation();

      if (!!+item.isActive && item.children) {
        for (let i = 0; i < this.menu.length; i++) {
          let $menu_record = this.menu[i];
          if ($menu_record.id === item.id) {
            this.level = item.level;
            delete $menu_record.isActive
            this.$set(this.menu, i, $menu_record);
            return true
          }
        }
      }

      return false
    },
    navigationToggle() {
      if (this.isActive) {
        this.menu = JSON.parse(JSON.stringify(window.menu));
        this.activateParents(this.currentItem);
        this.level = this.currentItem.level;
      }

      this.isActive = !this.isActive;
    }
  }
})
