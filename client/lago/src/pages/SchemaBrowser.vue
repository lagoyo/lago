<template>
  <div class="md-layout">
    <div class="md-layout-item md-large-size-20 ">
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
    <div class="md-list-item md-large-size-80 md-layout-nowrap md-centered">
      <div v-if="selected">
        <div class="summary">
          <p>이름: <span>{{selected.getName()}}</span></p>
          <p class="descr">설명: <span v-html="selected.getDescription()"></span></p>
          <p>IRI: <a :target="selected.getName()" :href="selected.getIRI()">{{selected.getIRI()}}</a></p>
        </div>
        <md-divider></md-divider>
        <md-table v-model="props" :table-header-color="tableHeaderColor">
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="Type" class="type" v-html="item.type"></md-table-cell>
            <md-table-cell md-label="Description" class="descr" v-html="item.desc"></md-table-cell>
          </md-table-row>
        </md-table>
      </div>
      <div v-else>
        <p>스키마를 선택하세요.</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SchemaBrowser',
  components: {
  },
  data () {
    return {
      selected: null,
      selectedSchema: null,
      props: []
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
      this.selected = obj
      this.props = []
      const props = this.selected.getProperties(false)
      console.log('propertis', props)
      props.forEach((p, idx) => {
        console.log('p', p)
        const name = p.split(':')[1]
        console.log('name', name)
        const prop = this.$sdo.sdo.getProperty(p)
        const dataTypes = prop.getRanges(false)
        const strTypes = []
        for (let j = 0; j < dataTypes.length; j++) {
          strTypes.push(dataTypes[j].split(':')[1])
        }
        this.props.push({
          id: idx + 1,
          name: name,
          type: strTypes.join('<br>'),
          desc: prop.getDescription()
        })
        console.log('this.props', this.props)
      })
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
  .summary {
    width: auto;
  }
  .type {
    max-width: fit-content;
  }
  .descr {
    max-width: fit-content;
  }

</style>
