import Vue from 'vue'

import VueRouter from 'vue-router'
import App from './App'

// router setup
import routes from './routes'

import vuetify from './plugins/vuetify'
import Clipboard from 'v-clipboard'
import SDO from './sdo'

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: 'nav-item active'
})
Vue.use(VueRouter)

Vue.config.productionTip = false

SDO.install = function () {
  Object.defineProperty(Vue.prototype, '$sdo', {
    get () { return SDO }
  })
}

Vue.use(SDO)
Vue.use(Clipboard)

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
