<template>
  <div class="md-layout">
    <div class="md-layout-item md-large-size-25 ">
      <md-subheader>Select schema class</md-subheader>
      <md-content class="md-scrollbar">
        <md-list>
          <md-list-item v-for="cl in $sdo.sdoClasses"
                        v-bind:key="cl.name"
                        v-bind:class="selectedSchema === cl.value ? 'selected': ''"
                        @click="getSchemaInfo(cl.value)">{{cl.name}}
          </md-list-item>
        </md-list>
      </md-content>
    </div>
    <div class="md-list-item md-layout-nowrap md-large-size-15">
      <md-table v-model="users" :table-header-color="tableHeaderColor">
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="ID">{{ item.id }}</md-table-cell>
          <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
          <md-table-cell md-label="Salary">{{ item.salary }}</md-table-cell>
          <md-table-cell md-label="Country">{{ item.country }}</md-table-cell>
          <md-table-cell md-label="City">{{ item.city }}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SchemaBrowser',

  components: {
    // OrderedTable
  },
  data () {
    return {
      sel: null,
      selectedSchema: null,
      selected: [],
      users: [
        {
          id: 1,
          name: 'Dakota Rice',
          salary: '$36,738',
          country: 'Niger',
          city: 'Oud-Turnhout'
        },
        {
          id: 2,
          name: 'Minerva Hooper',
          salary: '$23,738',
          country: 'Curaçao',
          city: 'Sinaai-Waas'
        },
        {
          id: 3,
          name: 'Sage Rodriguez',
          salary: '$56,142',
          country: 'Netherlands',
          city: 'Overland Park'
        },
        {
          id: 4,
          name: 'Philip Chaney',
          salary: '$38,735',
          country: 'Korea, South',
          city: 'Gloucester'
        }
      ]
    }
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: ''
    }
  },
  methods: {
    getSchemaInfo (category) {
      if (category.indexOf('schema:') < 0) {
        return
      }
      const obj = this.$sdo.sdo.getClass(category)
      if (obj == null) {
        return
      }
      this.selectedSchema = category
      this.sel = obj
    }
  }
}
</script>

<style scoped lang="scss">
  .selected {
    background-color: antiquewhite;
  }
  .md-scrollbar {
    max-height: 300px;
    overflow: auto;
  }

</style>
