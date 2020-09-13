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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
