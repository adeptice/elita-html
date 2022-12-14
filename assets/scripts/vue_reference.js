var referenceModule = new Vue ({
  name: 'reference',
  el: '#reference',
  template: `
    <article class="reference" :class="referenceClass" id="reference">
      <div class="reference-block" v-for="block in sortByYear" :key="block.title">
        <h2 class="reference-block__header">{{ block.title }}</h2>
        <div class="reference-grid">
          <a class="reference-card"
            v-for="object in block.objects"
            :key="object.id"
            :href="object.url"
            :style="object.style">

            <h5 class="reference-card__seen icon-bg icon__seen" v-html="object.seen"></h5>
            <h3 class="reference-card__header" v-html="object.title"></h3>
            <p class="reference-card__description" v-html="object.place"></p>
          </a>         
        </div>         
      </div>
      <div v-show="loadOnce" class="reference-loader" id="reference-loader">
        <div class="reference-loader__container">
          <div class="icon icon__spinner icon--l icon--spin"></div>
        </div>
      </div>      
    </article>
  `,
  data: {
    sortBy: 'date',
    isReady: true,
    referenceObjects: {},
    loadOnce: true,
    filtersStatus: false,
    observer: null,
    isFiltersOpened: false
  },
  created() {
    const initReferenceData = JSON.parse(JSON.stringify(window.referenceData)) || [];
    this.storeObjects(initReferenceData);
  },
  mounted() {
    this.observer = new IntersectionObserver(this.observerController);
    this.observer.observe(document.querySelector('#reference-loader'));   
  },
  destroyed() {
    this.observer.disconnect();
  },
  computed: {
    isFilters(){
      return !!window.filtersModule || this.filtersStatus
    },
    referenceClass() {
      return this.isFiltersOpened ? 'reference--slided' : ''
    },    
    filteredByTags() {
      if (this.isFilters) {
        const selected = filtersModule.selected;
        if (selected.length > 0) {
          const referenceArray = Object.entries(this.referenceObjects);
          const filteredReferenceArray = referenceArray.filter( ([id, object])=> {
            const tags = object.tags;
            const arraysIntersection = selected.filter( x => tags.includes(x));
            return (arraysIntersection.length === selected.length);
          });
          return filteredReferenceArray.reduce( (a, [id, object]) => ({ ...a, [id]: object}), {})
        }
      }
      return this.referenceObjects
    },
    objectsVisible() {
      return Object.keys(this.filteredByTags).length
    },
    sortByYear() {
      let getByYear = {};

      for (const id in this.filteredByTags) {
        let object = this.filteredByTags[id];
        const objectDate = new Date(object.date_created);
        const objectYear = objectDate.getFullYear();
        if (!getByYear.hasOwnProperty(objectYear)) {
          getByYear[objectYear] = { "title": objectYear, "objects": new Array };
        };
        object.style = 'background-color: ' + object.bghex + '; background-image: url(\"' + object.img + '\");';
        getByYear[objectYear].objects.push(object);        
      }

      let sortByYear = Object.keys(getByYear).sort((a, b) => { return b - a });

      for (let i = 0; i < sortByYear.length; i++) {
        let yearBlock = getByYear[sortByYear[i]];
        yearBlock.objects = yearBlock.objects.sort((a, b) => { return b.seen - a.seen });
        sortByYear[i] = yearBlock;
      }

      return sortByYear;
    },
  },
  methods: {
    storeObjects(objectsArray) {
      for (let i = 0; i < objectsArray.length; i++) {
        const {id} = objectsArray[i];
        this.$set(this.referenceObjects, id, {...objectsArray[i]});
      }
    },    
    observerController(entries) {
      entries.forEach( (entry) => {
        if (entry.isIntersecting && this.loadOnce) {
          this.observer.disconnect();

          // ???????????????? ??????????????
          let letter = {section: 'reference', action:'list', limit: 10, offset: this.objectsVisible};
          console.log('RQ', letter);
          
          // ???????????????? ????????????
          this.getNextObjects(letter)
          .then( (response) => {
            if (response.status === 200) {
              console.log('RS', response.data);
              this.storeObjects(response.data);
              this.loadOnce = false;
            }
          })
        }        
      });
    },
    async getNextObjects() {
      const nextObjects = [
        { "id": "386",
          "title": "???????????????? ??????????????",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref05.jpg",
          "date_created": "2020-03-13 22:16:15",
          "seen": "234",
          "url": "velikolukskij_myasokombinat",
          "place": "??. ?????????????? ????????, ???????????????????????? ??????.",
          "tags": ["1"]
        },
        { "id": "385",
          "title": "???????????????? ??????????????",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref02.jpg",
          "date_created": "2020-03-01 11:16:15",
          "seen": "142",
          "url": "newton_live",
          "place": "??. ?????????? ??????????????",
          "tags": ["2"]
        },
        { "id": "384",
          "title": "???????????????? ??????????????",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref03.jpg",
          "date_created": "2020-02-12 11:16:15",
          "seen": "212",
          "url": "newton_live",
          "place": "??. ?????????? ??????????????",
          "tags": ["3", "4"]
        },
        { "id": "382",
          "title": "???????????????? ??????????????",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref04.jpg",
          "date_created": "2019-12-15 11:16:15",
          "seen": "789",
          "url": "newton_live",
          "place": "??. ?????????? ??????????????",
          "tags": ["4", "5"]
        },
        { "id": "381",
          "title": "???????????????? ??????????????",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref01.jpg",
          "date_created": "2019-11-12 11:16:15",
          "seen": "32",
          "url": "newton_live",
          "place": "??. ?????????? ??????????????",
          "tags": ["5", "6"]
        },
        { "id": "380",
          "title": "???????????????? ??????????????",
          "bghex": "#00254F",
          "img": "./img/bg/ref03.jpg",
          "date_created": "2019-10-17 22:16:15",
          "seen": "633",
          "url": "newton_live",
          "place": "??. ?????????? ??????????????",
          "tags": ["1", "6"]
        },
        { "id": "379",
          "title": "???????????????? ??????????????",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref02.jpg",
          "date_created": "2019-09-12 11:16:15",
          "seen": "1231",
          "url": "newton_live",
          "place": "??. ?????????? ??????????????",
          "tags": ["1", "5"]
        },
        { "id": "377",
          "title": "???????????????? ??????????????",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref03.jpg",
          "date_created": "2019-08-12 11:16:15",
          "seen": "1767",
          "url": "newton_live",
          "place": "??. ?????????? ??????????????",
          "tags": ["2", "4"]
        },
        { "id": "376",
          "title": "???????????????? ??????????????",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref04.jpg",
          "date_created": "2019-07-12 11:16:15",
          "seen": "1112",
          "url": "newton_live",
          "place": "??. ?????????? ??????????????",
          "tags": ["2", "3"]
        },
        { "id": "375",
          "title": "???????????????? ??????????????",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref06.jpg",
          "date_created": "2019-06-12 11:16:15",
          "seen": "32",
          "url": "newton_live",
          "place": "??. ?????????? ??????????????",
          "tags": ["6"]
        }
      ];

      return await new Promise( (resolve) => {
        setTimeout(() => resolve({ status: 200, data: nextObjects }), Math.random() * 2000);
      });
    }
  }
})