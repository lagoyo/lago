<template>
  <v-container class="schemaBowserScroll" fluid>
    <v-row>
      <v-col cols="3">
        <v-card class="pa-4">
          <v-card-title>
            Select schema class
          </v-card-title>
          <v-virtual-scroll item-height="42" class="schemaBrowserScroll"
                            :items="sdoClasses">
            <template v-slot="{ item }">
              <v-list-item :key="item.name"
                           @click="getSchemaInfo(item.value)"
                           v-bind:class="selectedSchema === item.value ? 'selected': ''">
                <v-list-item-content>
                  <v-list-item-title>
                    {{item.name}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
      </v-col>
      <v-col cols="9">
        <div id="schemaView" v-if="selected">
          <v-subheader>
            요약
          </v-subheader>
          <div class="summary">
            <p>이름: <span>{{selected.getName()}}</span></p>
            <p class="descr">설명: <span v-html="selected.getDescription()"></span></p>
            <p>IRI: <a :target="selected.getName()" :href="selected.getIRI()">{{selected.getIRI()}}</a></p>
          </div>
          <v-divider></v-divider>
          <v-tabs v-model="activeTab"
                   elevation="2">
            <v-tab v-for="sc in superClasses"
                   :key="sc.id" exact>
              {{sc.name}} <v-badge inline tile offset-y="10"
            >{{sc.propsCount}}</v-badge>
            </v-tab>
            <v-tab-item v-for="sc of superClasses"
                        :key="sc.id">
              <div>
                <a :target="sc.name" :href="sc.getIRI()">{{sc.getName()}}</a>
              </div>
              <v-data-table
                :headers="headers"
                :items="props[sc.name]"
                :items-per-page="200"
                class="elevation-1"
              >
                <template v-slot:item.type="{ item }">
                  <p v-html="item.type"/>
                </template>
                <template v-slot:item.desc="{ item }">
                  <p v-html="item.desc"/>
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs>
        </div>
        <div v-else>
          <p>스키마를 선택하세요.</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'SchemaBrowser',
  components: {
  },
  data () {
    return {
      activeTab: 0,
      selected: null,
      selectedSchema: null,
      scs: [],
      superClasses: [],
      props: {}
    }
  },
  mounted () {
    console.log('mounted')
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: ''
    }
  },
  computed: {
    sdoClasses: function () {
      return this.$sdo.sdoClasses
    },
    checkReady () {
      console.log('this.$sdo', this.$sdo)
      console.log('sdo ready', typeof this.$sdo.sdoClasses)
      return this.$sdo && this.$sdo.sdoClasses && this.$sdo.sdoClasses.length > 0
    },
    headers () {
      return [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: 'From',
          value: 'from'
        },
        { text: 'Type', value: 'type' },
        { text: 'Description', value: 'desc' }
      ]
    }
  },
  methods: {
    getProps (thing) {
      const name = thing.getName()
      console.log('thing get props', name)
      const prev = this.props[name]
      console.log('prev', prev)
      if (prev !== undefined && prev.length > 0) {
        console.log('this properties already retrieved!', prev.length)
        return prev.length
      }
      const props = thing.getProperties(false).sort()
      const tempProps = []
      props.forEach((p, idx) => {
        const name = p.split(':')[1]
        console.log('prop', p, 'name', name)
        const prop = this.$sdo.sdo.getProperty(p)
        const dataTypes = prop.getRanges(false)
        const strTypes = []
        for (let j = 0; j < dataTypes.length; j++) {
          strTypes.push(dataTypes[j].split(':')[1])
        }
        tempProps.push({
          name: name,
          from: thing.getName(),
          type: strTypes.join('<br>'),
          desc: prop.getDescription()
        })
      })
      this.props[name] = tempProps
      return tempProps.length
    },
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

      this.superClasses = []
      this.selected.name = category.split(':')[1]
      this.selected.propsCount = this.getProps(this.selected)
      this.selected.id = 'tab-0'

      this.superClasses.push(this.selected)

      this.scs = obj.getSuperClasses(true)
      console.log('super classes', this.scs)
      this.scs.forEach((sc, idx) => {
        if (sc.indexOf('schema:') < 0) {
          console.log('ignore sc is not schema.')
          return
        }
        const name = sc.split(':')[1]
        console.log('super classes', sc, 'name', name)
        const cl = this.$sdo.sdo.getClass(sc)
        cl.propsCount = this.getProps(cl)
        cl.name = name
        cl.id = 'tab-' + (idx + 1).toString()
        console.log('super class', cl)
        this.superClasses.push(cl)

        if (idx === (this.scs.length - 1)) {
          this.activeTab = 0
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .selected {
    background-color: antiquewhite;
  }
  #schemaView {
    height: calc(100vh - 250px);
    overflow: auto;
  }
</style>
