<template>
  <div class="content">
    <md-card>
      <md-card-header data-background-color="white">
        <h4 class="title">SCHEMA.ORG Schemas</h4>
        <p class="category">All schemas from schema.org</p>
      </md-card-header>
      <md-card-content>
        <ordered-table table-header-color="orange"></ordered-table>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import { OrderedTable } from '../components'

export default {
  name: 'SchemaBrowser',

  components: {
    OrderedTable
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
