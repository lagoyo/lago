<template>
  <div class="content">
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step id="first" :complete="e1 > 1" step="1">
          샘플 데이터 입력하기
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step id="second" :complete="e1 > 2" step="2">
          스키마 선택하기
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step id="third" :complete="e1 > 3" step="3">
          스키마 데이터 입력하기
        </v-stepper-step>
        <v-stepper-step id="fourth" :complete="e1 > 4" step="4">
          코드 생성 및 다운로드
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-12" height="400px">
            <v-textarea v-model="srcData" id="srcData" placeholder="여기에 JSON 데이터를 입력하세요."></v-textarea>
            <v-content v-if="firstStepError"><p>{{firstStepError}}</p></v-content>
            <v-btn raised elevation="2" primary @click="loadJson()">Continue</v-btn>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-container  class="pa-0" fluid>
            <v-row class="pa-0">
              <v-col cols="6" class="pa-0">
                <v-card
                  class="mx-auto"
                  max-width="700"
                >
                  <v-sheet class="pa-2 primary lighten-2">
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
                  <v-card-text id="treeView">
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
              <v-col cols="6" >
                  <vue-json-pretty class="jsonObj" :data="srcObject" :deep="4"></vue-json-pretty>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-card v-if="activeClass">
                  <v-sheet class="pa-2 lighten-1">
                    <span class="font-weight-bold">{{activeClass.getName()}}</span>
                    <a class="pa-2" :target="activeClass.getName()" :href="activeClass.getIRI()">{{activeClass.getIRI(true)}}</a>
                    <span v-html="activeClass.getDescription()"></span>
<!--                    <v-chip class="ma-2" label v-for="cl of superClasses" :key="cl.getName()">{{cl.getName()}}</v-chip>-->
                  </v-sheet>
                </v-card>
                <div v-else>위에서 스키마를 선택해주세요.</div>
              </v-col>
            </v-row>
          </v-container>
          <v-btn raised color="primary" :disabled="activeClass === null" @click="setDone(2, 3)">Continue</v-btn>
          <v-btn text>Cancel</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card class="mb-12" height="450px">
            <v-sheet class="pa-2 lighten-1" v-if="activeClass">
              <span class="font-weight-bold">{{activeClass.getName()}}</span>
              <a class="pa-2" :target="activeClass.getName()" :href="activeClass.getIRI()">{{activeClass.getIRI(true)}}</a>
              <span v-html="activeClass.getDescription()"></span>
              <v-chip class="ma-2" label v-for="cl of superClasses" :key="cl.getName()">{{cl.getName()}}</v-chip>
            </v-sheet>
            <v-card-text>
              <v-container class="pa-0" fluid>
                <v-row class="pa-0" v-if="allProperties">
                  <v-col cols="4">
                    <div id="propEdit">
                      <v-simple-table
                        fixed-header
                        height="300px"
                      >
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th class="text-left">Name</th>
                            <th class="text-left">Type</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr
                            v-for="item in allProperties.allProps"
                            :key="item.name"
                          >
                            <td>{{ item.name }}</td>
                            <td>{{ item.type }}</td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </div>
                  </v-col>
                  <v-col>
                    <p>SELECT PROP TO EDIT</p>
                  </v-col>
                  <v-col cols="4" class="pa-2">
                    <vue-json-pretty class="jsonObj" :data="srcObject" :deep="4"></vue-json-pretty>
                  </v-col>
                </v-row>
            </v-container>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="setDone(3, 4)">Continue
          </v-btn>
          <v-btn text>Cancel</v-btn>
        </v-stepper-content>
        <v-stepper-content step="4" >
          <v-card class="mb-12" height="450px"></v-card>
          <v-btn raised @click="downloadAsFile()">save</v-btn>
          <v-btn raised color="primary" @click="setDone(4)">Continue</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'

export default {
  name: 'SchemaInput',
  components: {
    VueJsonPretty
  },
  data () {
    return {
      e1: 1,
      first: false,
      second: false,
      third: false,
      fourth: false,
      // 사용작 입력한 최초의 입력 데이터
      srcData: null,
      srcObject: null,
      secondStepError: null,
      firstStepError: null,
      // 현재 활성화된 스텝 정보
      active: 'first',
      selected: null,
      // tree view
      tree: [],
      openNodes: [],
      activeNodes: [],
      search: null,
      selectedSchema: null,
      // ## 3
      headers: [
        { text: 'Name', align: 'start', sortable: true, value: 'name' },
        { text: 'From', value: 'from' },
        { text: 'Type', value: 'type' },
        { text: 'Value', value: 'data' }
        // { text: 'Description', value: 'desc', sortable: false }
      ]

    }
  },
  methods: {
    loadJson () {
      if (this.srcData !== undefined) {
        try {
          this.srcObject = JSON.parse(this.srcData)
          if (this.srcObject !== null) {
            // console.log(this.srcData)
            console.log(this.srcObject)
            this.setDone(1, 2)
          } else {
            console.log('catch error!')
            this.firstStepError = 'Source Object is empty!'
          }
        } catch (err) {
          console.log('catch error!', err)
          this.firstStepError = err.toString()
        }
      }
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
      // console.log('get schema info', category, obj.getDescription(), obj)
      // console.log(category, JSON.stringify(obj))
      this.selected = obj
    },
    setDone (id, index) {
      console.log('set done', id, index)
      this.e1 = index
      this.secondStepError = null

      if (index) {
        this.active = index
      }
      console.log(this.active)
      if (this.e1 === 2) {
        console.log(this.$sdo.sdoClasses)
      }
    },
    setError () {
      this.secondStepError = 'This is an error!'
    },
    downloadAsFile () {
      console.log('func is called!')
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
        console.log('prop', p, 'name', name)
        const prop = this.$sdo.sdo.getProperty(p)
        const dataTypes = prop.getRanges(false)
        const strTypes = []
        for (let j = 0; j < dataTypes.length; j++) {
          strTypes.push(dataTypes[j].split(':')[1])
        }
        props.push({
          name: name,
          from: thing.getName(),
          type: strTypes[0],
          types: strTypes.join('<br>'),
          value: {},
          desc: prop.getDescription()
        })
      }
      return { name, props }
    }
  },
  computed: {
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
          console.log(clCategory, clCategory.length)
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
    }
  }
}
</script>

<style scoped lang="scss">
  .content {
    padding-bottom: 150px;
  }
  #srcData {
    height: 250px;
    min-height: 250px;
    max-height: 300px;
  }

  .selected {
    background-color: antiquewhite;
  }

  .jsonObj {
    max-height: 280px;
    overflow: auto;
  }
  #treeView {
    height: 300px;
    overflow: auto;
  }
  #propEdit {
    height: 300px;
    overflow: auto;
  }

</style>
