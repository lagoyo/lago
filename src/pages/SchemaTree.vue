<template>
  <v-container class="pa-4" fluid >
    <v-row>
      <v-col cols="4">
        <v-card
          class="mx-auto"
        >
          <v-sheet class="pa-4 primary lighten-2">
            <v-text-field
              v-model="search"
              label="Search Schema Directory"
              dark
              flat
              solo-inverted
              hide-details
              clearable
              clear-icon="mdi-close-circle-outline"
            ></v-text-field>
          </v-sheet>
          <v-card-text class="pa-1" id="treeView">
            <v-treeview
              :items="sdoNodes"
              itemKey="iri"
              itemText="name"
              :open.sync="openNodes"
              :active.sync="activeNodes"
              :filter="filterNode"
              :search="search"
              rounded
              v-model="tree"
              dense
              hoverable
              activatable
              v-on:update:active="clearPropKey()"
              color="warning">
              <template v-slot:prepend="{ item, open, active }">
                <v-icon v-if="item.children">
                  {{active ? 'mdi-folder-star': (open ? 'mdi-folder-open' : 'mdi-folder')}}
                </v-icon>
                <v-icon v-else>
                  {{active ? 'mdi-cube-send' : 'mdi-cube'}}</v-icon>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8" ref="schematreeProp">
<!--        <p>Open: {{openNodes}}</p>-->
<!--        <p>Tree:{{tree}}</p>-->
<!--        <p>Active: {{activeNodes}}</p>-->
<!--        <p>Seach: {{search}}</p>-->
        <v-card v-if="activeClass" class="schematreePropWrapper">
          <v-sheet class="pa-4 accent lighten-1" ref="schemaPropName">
            <span class="font-weight-bold">{{activeClass.getName()}}</span>
            <a class="pa-10" :target="activeClass.getName()" :href="activeClass.getIRI()">{{activeClass.getIRI(true)}}</a>
          </v-sheet>
          <v-card-subtitle ref="schemaPropDesc" id="schemaPropDesc">
            <p><span v-html="activeClass.getDescription()"></span></p>
          </v-card-subtitle>
          <v-card-text class="pa-0" id="schemaPropView">
            <div class="text-left">
              <v-chip
                class="ma-2"
                label
                v-for="cl of superClasses"
                :color="propKey === cl.getName() ? 'warning': ''"
                :class="propKey === cl.getName() ? 'font-weight-black': ''"
                @click="setPropKey(cl.getName())"
                :key="cl.getName()"
              >{{cl.getName()}}</v-chip>
            </div>
            <v-data-table
              v-show="propKey === cl.getName()"
              v-for="cl of superClasses"
              :key="cl.getName()"
              :headers="headers"
              :items="allProperties.props[cl.getName()]"
              :items-per-page="200"
              group-by="from"
              hide-default-footer
              hide-default-header
              class="elevation-5 propView"
            >
              <template v-slot:item.type="{ item }">
                <p v-html="item.type"/>
              </template>
              <template v-slot:item.desc="{ item }">
                <p v-html="item.desc"/>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <v-card v-else>
          <v-card-title>
            왼쪽에서 노드를 선택하세요.
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'SchemaTreeBrowser',
  components: {},
  data () {
    return {
      tree: [],
      openNodes: [],
      activeNodes: [],
      search: null,
      selectedSchema: null,
      headers: [
        { text: 'Name', align: 'start', sortable: true, value: 'name' },
        { text: 'From', value: 'from' },
        { text: 'Type', value: 'type' },
        { text: 'Description', value: 'desc', sortable: false }
      ],
      chipPropKey: '',
      windowHeight: window.innerHeight
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)

      // const propHeight = this.getPropHeight()
      // const propNameHeight = this.getPropNameHeight()
      // const propDescHeight = this.getPropDescHeight()
      // this.setPropViewHeight(propHeight, propNameHeight, propDescHeight)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  computed: {
    propKey () {
      if (this.chipPropKey.length > 0) {
        return this.chipPropKey
      } else {
        return this.activeClass.getName()
      }
    },
    filterNode () {
      return function (item, search, name) {
        if (item[name].toLowerCase().indexOf(search.toLowerCase()) > -1) {
          return true
        }
        return false
      }
    },
    sdoNodes: function () {
      let globalIdx = 0
      const sdo = this.$sdo.sdo
      const makeChildren = function (superClass) {
        const subs = superClass.getSubClasses(false).sort()
        if (subs.length > 0) {
          const ret = []
          for (const sub of subs) {
            ret.push(newNode(sub, sdo.getClass(sub)))
          }
          return ret
        } else {
          return undefined
        }
      }
      const newNode = (IRI, sClass) => ({
        id: globalIdx++,
        iri: IRI,
        name: IRI.split(':')[1],
        props: [],
        children: makeChildren(sClass)
      })
      const addNodeAtRoot = function (node, IRI, sClass) {
        const ret = newNode(IRI, sClass)
        node.push(ret)
        return ret
      }
      const treeNodes = []
      const thing = this.$sdo.sdo.getClass('schema:Thing')
      const thingNode = addNodeAtRoot(treeNodes, thing.getIRI(true), thing)
      console.log('full tree', treeNodes, thingNode)
      return treeNodes
    },
    activeClass () {
      if (this.activeNodes.length > 0) {
        return this.$sdo.sdo.getClass(this.activeNodes[0])
      } else {
        return null
      }
    },
    superClasses () {
      const active = this.activeClass
      if (active) {
        const cls = [active]
        let cl = active
        while (cl !== null) {
          const clCategory = cl.getSuperClasses(false)
          // console.log(clCategory, clCategory.length)
          if (clCategory.length > 0) {
            cl = this.$sdo.sdo.getClass(clCategory[0])
            cls.push(cl)
          } else {
            cl = null
          }
        }
        return cls
      } else {
        return []
      }
    },
    allProperties () {
      const all = {
        allProps: [],
        props: {}
      }
      const cls = this.superClasses
      for (const cl of cls) {
        const { name, props } = this.getProps(cl)
        all.allProps = all.allProps.concat(props)
        all.props[name] = props
      }
      return all
    },
    checkReady () {
      return this.$sdo && this.$sdo.sdoClasses && this.$sdo.sdoClasses.length > 0
    }
  },
  methods: {
    onResize () {
      this.windowHeight = window.innerHeight
      // const propHeight = this.getPropHeight()
      // const propNameHeight = this.getPropNameHeight()
      // const propDescHeight = this.getPropDescHeight()
      // this.setPropViewHeight(propHeight, propNameHeight, propDescHeight)
    },
    getPropHeight () {
      const propDOM = this.$refs.schematreeProp
      console.log('proheight is ' + propDOM.clientHeight)
      return propDOM.clientHeight
    },
    getPropNameHeight () {
      // const propDOM = this.$refs.schemaPropName
      // console.log('propnameheight is ' + propDOM.clientHeight)
      // return propDOM.clientHeight
      return 56
    },
    getPropDescHeight () {
      // const propDOM = this.$refs.schemaPropDesc
      // console.log('propdescheight is ' + propDOM.clientHeight)
      // return propDOM.clientHeight
      return 114
    },
    setPropViewHeight (height, nameHeight, descHeight) {
      console.log('param ', height, ' ', nameHeight, ' ', descHeight)
      const propViewDOM = document.getElementById('propView')
      let styleString = 'height: ' + (height - nameHeight - descHeight) + 'px;'
      styleString += 'overflow: auto;'
      console.log('set to ' + 'height: ' + (height - nameHeight - descHeight) + 'px')
      propViewDOM.style = styleString
    },
    getProps (thing) {
      const name = thing.getName()
      // console.log('thing get props', name)
      // const prev = this.props[name]
      // console.log('prev', prev)
      // if (prev !== undefined && prev.length > 0) {
      //   console.log('this properties already retrieved!', prev.length)
      //   return prev.length
      // }
      const ps = thing.getProperties(false).sort()
      const props = []
      for (const p of ps) {
        const name = p.split(':')[1]
        // console.log('prop', p, 'name', name)
        const prop = this.$sdo.sdo.getProperty(p)
        const dataTypes = prop.getRanges(false)
        const strTypes = []
        for (let j = 0; j < dataTypes.length; j++) {
          strTypes.push(dataTypes[j].split(':')[1])
        }
        props.push({
          name: name,
          from: thing.getName(),
          type: strTypes.join('<br>'),
          desc: prop.getDescription()
        })
      }
      return { name, props }
    },
    setPropKey (prop) {
      // console.log('set prop key', prop)
      this.chipPropKey = prop
    },
    clearPropKey () {
      this.chipPropKey = ''
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
      // console.log('super classes', this.scs)
      this.scs.forEach((sc, idx) => {
        if (sc.indexOf('schema:') < 0) {
          // console.log('ignore sc is not schema.')
          return
        }
        const name = sc.split(':')[1]
        // console.log('super classes', sc, 'name', name)
        const cl = this.$sdo.sdo.getClass(sc)
        cl.propsCount = this.getProps(cl)
        cl.name = name
        cl.id = 'tab-' + (idx + 1).toString()
        // console.log('super class', cl)
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
  .schematreePropWrapper {
    height: calc(100vh - 200px);
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  #treeView {
    height: calc(100vh - 280px);
    overflow: auto;
  }
  .propView {
    height: 100%;
    overflow: auto;
  }
  #schemaPropDesc {
    display: flex;
    flex: 1;
    overflow: auto;
  }
  #schemaPropView {
    display: flex;
    flex: 7;
    overflow: auto;
    flex-direction: column;
  }
</style>
