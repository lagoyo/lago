<template>
  <div class="md-layout">
    <div class="md-layout-item md-large-size-20 ">
      <md-subheader>Select schema class</md-subheader>
    </div>
    <div class="md-layout-item md-large-size-80 md-layout-nowrap md-centered ">
      <div v-if="selected">
        <md-subheader>
          요약
        </md-subheader>
        <div class="summary">
          <p>이름: <span>{{selected.getName()}}</span></p>
          <p class="descr">설명: <span v-html="selected.getDescription()"></span></p>
          <p>IRI: <a :target="selected.getName()" :href="selected.getIRI()">{{selected.getIRI()}}</a></p>
        </div>
<!--        <md-subheader>-->
<!--          상속하는 객체-->
<!--        </md-subheader>-->
<!--        <md-list>-->
<!--          <md-list-item v-for="sc in superClasses" v-bind:key="sc.name">-->
<!--            <a :target="sc.getName()" :href="sc.getIRI()">{{sc.getName()}}</a> {{sc.getDescription()}}-->
<!--          </md-list-item>-->
<!--        </md-list>-->
        <md-divider></md-divider>
        <md-tabs ref="memberViewByInheritance" md-elevation="2" md-active-tab="tab-0">
          <template slot="md-tab" slot-scope="{ tab }">
            <span class="normal">{{ tab.label }} </span>
            <i class="badge" :class="tab.data.badge ? 'r-badge':'r-empty'">{{ tab.data.badge }}</i>
          </template>
          <md-tab v-for="(sc, index) in superClasses"
                  :key="index"
                  :id="sc.id"
                  :md-label="sc.name"
                  :md-template-data="{ badge: sc.propsCount, id: sc.id }">
            <div>
              <a :target="sc.name" :href="sc.getIRI()">{{sc.getName()}}</a>
            </div>
            <md-table v-model="props[sc.name]" :table-header-color="tableHeaderColor">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="From">{{ item.from }}</md-table-cell>
                <md-table-cell md-label="Type" class="type" v-html="item.type"></md-table-cell>
                <md-table-cell md-label="Description" class="descr" v-html="item.desc"></md-table-cell>
              </md-table-row>
            </md-table>
          </md-tab>
        </md-tabs>
      </div>
      <div v-else>
        <p>스키마를 선택하세요.</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SchemaTreeBrowser',
  components: {
  },
  data () {
    return {
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
          this.$refs.memberViewByInheritance.activeTabIndex = 0
          this.$refs.memberViewByInheritance.activeTab = 'tab-0'
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
  .md-scrollbar {
    max-height: 400px;
    overflow: auto;
  }
  .summary {
    padding: 15px;
    width: auto;
  }
  .type {
    max-width: fit-content;
  }
  .descr {
    max-width: fit-content;
  }
  .superclass {
    .md-tabs {
      .md-button {
        text-transform: none !important;
      }
      .md-button-content {
        text-transform: none !important;
      }
    }
  }
  .badge {
    width: 19px;
    height: 19px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 2px;
    right: 2px;
    border-radius: 100%;
    color: #fff;
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    letter-spacing: -.05em;
    font-family: 'Roboto Mono', monospace;
  }
  .r-badge {
    background-color: red;
  }
  .r-empty {
    background-color: darkgreen;
  }
  .normal {
    text-transform: none !important;
  }
</style>
