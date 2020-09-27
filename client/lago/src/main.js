import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import VueRouter from 'vue-router'
import App from './App'

// router setup
import routes from './routes'

// Plugins
// import GlobalComponents from "./globalComponents";
import GlobalDirectives from './globalDirectives'

import SDOAdapter from 'schema-org-adapter'

Vue.use(VueMaterial)

// change multiple options
Vue.material = {
  ...Vue.material,
  locale: {
    ...Vue.material.locale,
    dateFormat: 'yyyy-MM-dd',
    firstDayOfAWeek: 1
  }
}

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: 'nav-item active'
})
Vue.use(VueRouter)
Vue.use(GlobalDirectives)

Vue.config.productionTip = false

const shared = {
  ready: false
}

async function initSdo () {
  const sdo = new SDOAdapter()
  console.log('sdo is', sdo)
  const urlLatestSDO = await sdo.constructSDOVocabularyURL('latest', 'all-layers')
  // resolves to "https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/6.0/all-layers.jsonld" if 6.0 is the latest version
  await sdo.addVocabularies([urlLatestSDO])

  const temp = sdo.getListOfClasses().sort()
  const sdoClasses = temp.map(function (x) {
    return {
      value: x,
      name: x.split(':')[1]
    }
  })
  console.log('sdoClasses', sdoClasses)
  return {
    sdo: sdo,
    sdoClasses: sdoClasses
  }
}

shared.install = function () {
  console.log('install called')
  initSdo().then((response) => {
    console.log('in install', response)
    shared.sdo = response.sdo
    shared.sdoClasses = response.sdoClasses
    return response
  })
  Object.defineProperty(Vue.prototype, '$sdo', {
    get () { return shared }
  })
}

Vue.use(shared)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,

  data: {
    sdo: {}
  },
  // created () {
  //   console.log('created called')
  //   initSdo().then((response) => {
  //     console.log('in created', response)
  //     this.$set(this, 'sdo', response)
  //     return response
  //   })
  // },
  mounted () {
    console.log(this.sdo)
  }
})
