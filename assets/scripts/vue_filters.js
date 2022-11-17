var filtersModule = new Vue ({
  name: 'filters',
  el: '#filters',
  template: `
    <aside class="filters" :class="filtersClass" id="filters">
      <div class="filters__header">
        <svg class="button button__filters icon icon--l" @click="toggleFilters">
          <use href="#icon__filters"></use>
        </svg>
        <h3>Фильтры</h3>
      </div>
      <div class="filters__container">
      <label
        class="filters__option"
        v-for="filter in filters"
        :key="filter.id"
      >
        <input type="checkbox" v-model="filter.checked">
        <svg class="icon icon--m"><use href="#icon__checkbox"></use></svg>
        <h5 v-html="filter.title"></h5>
      </label>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="icon__svg-sprite">
        <symbol id="icon__checkbox" viewBox="0 0 24 24">
          <rect x="1.5" y="1.5" width="21" height="21" rx="1" stroke-width="3"/>
          <path stroke="currentColor" d="M6 13.5L10 17L14 12L18 7" stroke-width="2"/>
        </symbol>
        <symbol id="icon__filters" viewBox="0 0 36 36">
          <path stroke-width="3" d="M16.5 11.5H34m-17.5 0a4.5 4.5 0 1 1-9 0m9 0a4.5 4.5 0 1 0-9 0m-5.5 0h5.5M19.5 25H2m17.5 0a4.5 4.5 0 1 1 9 0m-9 0a4.5 4.5 0 1 0 9 0m5.5 0h-5.5"/>
        </symbol>        
      </svg>        
    </aside>
  `,
  data: {
    filters: [],
    isActive: false
  },
  watch: {
    isActive(value) {
      if (!!window.referenceModule) {
        referenceModule.isFiltersOpened = value
      }  
    }
  },
  created() {
    let initFiltersData = JSON.parse(JSON.stringify(window.filtersData)) || [];
    this.filters = initFiltersData.map( (filter) => {
      if (!filter.hasOwnProperty('checked')){
        return { ...filter, checked: false }
      }
      return filter
    });
    if (!!window.referenceModule) {
      referenceModule.filtersStatus = true
      return true
    }    
  },
  computed: {
    filtersClass() {
      return this.isActive ? 'filters--slided' : ''
    },
    sortedFilters(){
      return this.filters.sort( (filterA, filterB) => {
        return (filterA.sort - filterB.sort)
      })
    },
    selected() {
      let selectedFilters = [];
      for (let i = 0; i < this.sortedFilters.length; i++) {
        const filter = this.sortedFilters[i];
        if (filter.checked) {
          selectedFilters.push(filter.id)
        }
      }
      return selectedFilters
    }
  },
  methods: {
    toggleFilters() {
      this.isActive = !this.isActive
    }
  }
});