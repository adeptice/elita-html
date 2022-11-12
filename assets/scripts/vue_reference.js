var reference = new Vue ({
  name: 'reference',
  el: '#reference',
  template: `
    <article class="reference" id="reference">
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
      <div v-show="loadOnce" class="reference-loader" id="refloader">
        <div class="reference-loader__container">
          <div class="icon icon__spinner icon--spin"></div>
        </div>
      </div>      
    </article>
  `,
  data: {
    sortBy: 'date',
    isReady: true,
    referenceObjects: {},
    // { "id": { "id", "title", "bghex", "img", "date_created", "seen", "url", "place" } }
    loadOnce: true,
    observer: null
  },
  created() {
    let initialReference = JSON.parse(JSON.stringify(window.reference)) || [];
    this.pushObjects(initialReference);
  },
  mounted() {
    this.observer = new IntersectionObserver(
      this.loadNext,
      {
        root: null, 
        threshold: 1
      }
    );
    this.observer.observe(document.querySelector('#refloader'));    
  },
  destroyed() {
    this.observer.disconnect();
  },
  computed: {
    sortByYear() {
      let getByYear = {};

      for (const id in this.referenceObjects) {
        let object = this.referenceObjects[id];
        const objectDate = new Date(object.date_created);
        const objectYear = objectDate.getFullYear();
        if (!getByYear.hasOwnProperty(objectYear)) {
          getByYear[objectYear] = { "title": objectYear, "objects": new Array };
        };
        object.style = 'background-color: ' + object.bghex + '; background-image: url(\"' + object.img + '\");';
        getByYear[objectYear].objects.push(object);        
      }

      let sortByYear = Object.keys(getByYear).sort((a, b) => { return b - a });
      sortByYear.forEach((year, index) => {
        let yearBlock = getByYear[sortByYear[index]];
        yearBlock.objects = yearBlock.objects.sort((a, b) => { return b.seen - a.seen });
        sortByYear[index] = yearBlock;
      });

      return sortByYear;
    },
  },
  methods: {
    pushObjects(objectsArray) {
      for (let i = 0; i < objectsArray.length; i++) {
        const {id} = objectsArray[i];
        this.$set(this.referenceObjects, id, {...objectsArray[i]})
      }
    },
    loadNext() {
      let add = [
        { "id": "11",
          "title": "Название объекта",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref05.jpg",
          "date_created": "2020-03-13 22:16:15",
          "seen": "234",
          "url": "velikolukskij_myasokombinat",
          "place": "г. Великие Луки, Новгородская обл.",
        },
        { "id": "12",
          "title": "Название объекта",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref02.jpg",
          "date_created": "2020-03-01 11:16:15",
          "seen": "142",
          "url": "newton_live",
          "place": "г. Город объекта",
        },
        { "id": "13",
          "title": "Название объекта",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref03.jpg",
          "date_created": "2020-02-12 11:16:15",
          "seen": "212",
          "url": "newton_live",
          "place": "г. Город объекта",
        },
        { "id": "14",
          "title": "Название объекта",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref04.jpg",
          "date_created": "2019-12-15 11:16:15",
          "seen": "789",
          "url": "newton_live",
          "place": "г. Город объекта",
        },
        { "id": "15",
          "title": "Название объекта",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref01.jpg",
          "date_created": "2019-11-12 11:16:15",
          "seen": "32",
          "url": "newton_live",
          "place": "г. Город объекта",
        },
        { "id": "16",
          "title": "Название объекта",
          "bghex": "#00254F",
          "img": "./img/bg/ref03.jpg",
          "date_created": "2019-10-17 22:16:15",
          "seen": "633",
          "url": "newton_live",
          "place": "г. Город объекта",
        },
        { "id": "17",
          "title": "Название объекта",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref02.jpg",
          "date_created": "2019-09-12 11:16:15",
          "seen": "1231",
          "url": "newton_live",
          "place": "г. Город объекта",
        },
        { "id": "18",
          "title": "Название объекта",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref03.jpg",
          "date_created": "2019-08-12 11:16:15",
          "seen": "1767",
          "url": "newton_live",
          "place": "г. Город объекта",
        },
        { "id": "19",
          "title": "Название объекта",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref04.jpg",
          "date_created": "2019-07-12 11:16:15",
          "seen": "1112",
          "url": "newton_live",
          "place": "г. Город объекта",
        },
        { "id": "20",
          "title": "Название объекта",
          "bghex": "#CCFFCC",
          "img": "./img/bg/ref06.jpg",
          "date_created": "2019-06-12 11:16:15",
          "seen": "32",
          "url": "newton_live",
          "place": "г. Город объекта",
        }
      ];
 
      let action = () => {
        // Имитация ответа
        console.log('RS', add);
        this.pushObjects(add);
        this.loadOnce = false;
      }

      if (this.loadOnce) {
        // Имитация запроса
        console.log('RQ', { section: 'reference', action:'list', limit: 10, offset: 10 });
        setTimeout(action, 3000);
        this.observer.disconnect();
      }
    }
  }
})
