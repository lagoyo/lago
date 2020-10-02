<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed-last">
      <md-app-toolbar class="md-large md-dense md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <!--            <md-button class="md-icon-button" @click="menuVisible = !menuVisible">-->
            <!--              <md-icon>menu</md-icon>-->
            <!--            </md-button>-->

            <span class="md-title">라고 / LAGO : the data typed as </span>
          </div>

<!--          <div class="md-toolbar-section-end">-->
<!--            <md-button class="md-icon-button">-->
<!--              <md-icon>more_vert</md-icon>-->
<!--            </md-button>-->
<!--          </div>-->
        </div>
        <div class="md-toolbar-row">
          <md-tabs class="md-primary" md-sync-route>
            <md-tab id="dashboard" md-label="Dashboard" to="/dashboard"/>
            <md-tab id="tab-input" md-label="Schema Input" to="/schema/gencode"/>
            <md-tab id="tab-browser" md-label="Schema Browser" to="/schema/browser"/>
            <md-tab id="tab-tree" md-label="Schema Tree" to="/schema/tree"/>
            <md-tab id="tab-my" md-label="My Schemas" to="/schema/my"/>
            <md-tab id="tab-about" md-label="About" to="/schema/about"/>
          </md-tabs>
        </div>
      </md-app-toolbar>
      <md-app-content>
        <main-content></main-content>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import ContentFooter from './ContentFooter.vue'
import MainContent from './Content.vue'

export default {
  components: {
    MainContent,
    ContentFooter
  },
  data () {
    return {}
    //   sidebarBackground: 'green',
    //   sidebarBackgroundImage: require('@/assets/img/sidebar-2.jpg')
    // }
  }
}
</script>

<style scoped lang="scss">
body {
  font-size: 16px !important;
}
</style>
