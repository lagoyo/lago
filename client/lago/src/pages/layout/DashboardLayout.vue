<template>
  <div>
    <v-tabs v-model="activeTab">
      <v-tab v-for="tab of tabs" :key="tab.id" :to="tab.route" exact>
        {{ tab.name }}
      </v-tab>
      <v-tab-item v-for="tab of tabs" :key="tab.id" :value="tab.route">
        <router-view></router-view>
<!--        <transition name="fade" mode="out-in">-->
<!--        </transition>-->
      </v-tab-item>
    </v-tabs>
    <v-footer height="40px" :fixed="true">
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </v-footer>
  </div>
</template>

<script>
import ContentFooter from './ContentFooter.vue'

export default {
  components: {
    ContentFooter
  },
  data () {
    return {
      activeTab: '/schema/browser',
      tabs: [
        { id: 1, name: 'Dashboard', route: '/dashboard' },
        { id: 2, name: 'Input Schema', route: '/schema/gencode' },
        { id: 3, name: 'Schema Browser', route: '/schema/browser' },
        { id: 4, name: 'Schema Tree', route: '/schema/tree' },
        { id: 5, name: 'My Schemas', route: '/schema/my' },
        { id: 6, name: 'About', route: '/schema/about' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
body {
  font-size: 16px !important;
}
</style>
