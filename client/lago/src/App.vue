<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          id="xx"
          alt="LAGO logo"
          class="shrink mr-2"
          contain
          :src="require('./assets/lago.png')"
          transition="scale-transition"
          width="120"
        />
        <span>라고 / LAGO : the data typed as</span>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer></v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>
<style>
  #xx {
    background-image: url("/assets/lago.png");
  }
</style>
