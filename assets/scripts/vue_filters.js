var filtersModule = new Vue ({
  name: 'filters',
  el: '#filters',
  template: `
    <aside class="filters" id="filters">
      <h3 class="filters__header">Фильтры</h3>
      <div class="filters__container">
      <label
        class="filters__option"
        v-for="filter in filters"
        :key="filter.id"
      >
        <input type="checkbox" v-model="filter.checked">
        <svg class="icon icon--m"><use xlink:href="#icon__checkbox" href="#icon__checkbox"></use></svg>
        <h5 v-html="filter.title"></h5>
      </label>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="icon__svg-sprite">
        <symbol id="icon__checkbox" viewBox="0 0 24 24">
          <rect x="1.5" y="1.5" width="21" height="21" rx="1" stroke-width="3"/>
          <path stroke="currentColor" d="M6 13.5L10 17L14 12L18 7" stroke-width="2"/>
        </symbol>
      </svg>        
    </aside>
  `,
  data: {
    filters: []
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
  }
});