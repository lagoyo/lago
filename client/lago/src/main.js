import Vue from 'vue'

import VueRouter from 'vue-router'
import App from './App'

// router setup
import routes from './routes'

import SDOAdapter from 'schema-org-adapter'
import vuetify from './plugins/vuetify'

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: 'nav-item active'
})
Vue.use(VueRouter)

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
    shared.ready = true
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

  vuetify,

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
