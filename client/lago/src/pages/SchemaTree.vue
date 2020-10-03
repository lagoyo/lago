<template>
  <v-container fluid height="450px">
    <v-row>
      <v-col>
        <p>TREE</p>
      </v-col>
      <v-col>
        <p>PROPERTY</p>
      </v-col>
    </v-row>
  </v-container>
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
</style>
