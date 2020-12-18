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
            <v-textarea v-model="srcData" id="srcData" placeholder="여기에 JSON 데이터를 입력하세요.">
              {
              "name": "샘플",
              "desc": "설명",
              "url": "https://baikal.ai/",
              "contentRating": "",
              "award": "국어원 코퍼스 1등상",
              "comment": {},
              "distribution": {
              "uploadDate": "2020-12-16T23:04:18Z",
              "accessMode": "chartOnVisual",
              "audience": {
              "audienceType": "veterans"
              },
              "author": {
              "name": "Baikal AI"
              }
              },
              "author": {
              "name": "Baikal AI",
              "email": "gih2yun@baikal.ai"
              },
              "creator": {
              "name": "Baikal AI",
              "email": "gih2yun@baikal.ai"
              },
              "dateCreated": "2020-12-16T23:04:18Z",
              "dateModified": "2020-12-16T23:04:18Z",
              "datePublished": "2020-12-16T23:04:18Z",
              "genre": "Korean Language",
              "typicalAgeRange": "7-21"
              }
            </v-textarea>
            <v-content v-if="firstStepError"><p>{{firstStepError}}</p></v-content>
            <v-btn raised elevation="2" primary @click="loadJson()">Continue</v-btn>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-container class="pa-0" fluid>
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
                          {{active ? 'mdi-cube-send' : 'mdi-cube'}}
                        </v-icon>
                      </template>
                    </v-treeview>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
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
              <a class="pa-2" :target="activeClass.getName()"
                 :href="activeClass.getIRI()">{{activeClass.getIRI(true)}}</a>
              <span v-html="activeClass.getDescription()"></span>
              <v-chip class="ma-2" label v-for="cl of superClasses" :key="cl.getName()">{{cl.getName()}}</v-chip>
            </v-sheet>
            <v-card-text>
              <v-container class="pa-0" fluid>
                <v-row class="pa-0" v-if="allProperties">
                  <v-col cols="7">
                    <div id="propEdit">
                      <v-data-table
                        :headers="headers"
                        :items="allProperties.allProps"
                        item-key="name"
                        class="elevation-1"
                        height="600px"
                        hide-default-footer
                        disable-pagination
                        disable-filtering
                        :item-class="itemRowBackground"
                        dense>
                        <template v-slot:item.name="{ item }">
                          <div :class="'indent-' + item.depth" class="shrink-el-1">
                            <v-tooltip bottom eager>
                              <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs" v-on="on">
                                  {{getNameInfo(item.name).show}}
                                </span>
                              </template>
                              <div>
                                <div>{{item.name}}</div><br/>
                                <div v-html="item.desc"></div>
                              </div>
                            </v-tooltip>
                            <span class="mini">/{{item.from}}</span>
                          </div>
                        </template>
                        <template v-slot:item.inputType="{ item }">
                          <div class="shrink-el" :title="item.inputType">
                            <v-tooltip left>
                              <template v-slot:activator="{on, attrs}">
                                <span v-bind="attrs" v-on="on">
                                  {{item.inputType}}
                                </span>
                              </template>
                              <span>{{item.inputType}}</span>
                            </v-tooltip>
                          </div>
                        </template>
                        <template v-slot:item.self="{ item }">
                          <div v-if="isPrimitive(item.self.type)" class="in-control">
                            <div class="in-div"
                                 :class="{have: item.self.value.length > 0}"
                            >
                              <div class="in-slot">
                                <input v-if="item.self.type=='Text'" type="text"
                                       class="in"
                                       v-model="item.self.value"/>
                                <input v-else-if="item.self.type=='URL'" type="text"
                                       class="in"
                                       v-model="item.value"/>
                                <input v-else-if="item.self.type=='Number'" type="number"
                                       class="in"
                                       v-model="item.value"/>
                                <input v-else-if="item.self.type=='Integer'" type="number"
                                       class="in"
                                       v-model="item.self.value"/>
                                <input v-else-if="item.self.type=='Date'" type="date"
                                       class="in"
                                       v-model="item.self.value"/>
                                <input v-else-if="item.self.type=='DateTime'" type="datetime-local"
                                       class="in"
                                       v-model="item.self.value"/>
                                <input v-else-if="item.self.type=='Boolean'" type="checkbox"
                                       class="in"
                                       v-model="item.self.value"/>
                              </div>
                            </div>
                          </div>
                          <div v-else>
                            <v-btn class="mx-2" right rounded small @click="toggleExpand(item.self)">
                              <v-icon dark>
                                {{item.self.expanded ? "mdi-chevron-up" : "mdi-chevron-down"}}
                              </v-icon>
                            </v-btn>
                          </div>
                        </template>
                      </v-data-table>
                    </div>
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
        <v-stepper-content step="4">
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

const primitiveTypes = {
  Integer: undefined,
  Text: undefined,
  URL: undefined,
  Number: undefined,
  Date: undefined,
  DateTime: undefined,
  Boolean: undefined
}

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
      srcData: '{\n' +
          '  "name": "샘플",\n' +
          '  "desc": "설명",\n' +
          '  "url": "https://baikal.ai/",\n' +
          '  "contentRating": "",\n' +
          '  "award": "국어원 코퍼스 1등상",\n' +
          '  "comment": {},\n' +
          '  "distribution": {\n' +
          '    "uploadDate": "2020-12-16T23:04:18Z",\n' +
          '    "accessMode": "chartOnVisual",\n' +
          '    "audience": {\n' +
          '      "audienceType": "veterans"\n' +
          '    },\n' +
          '    "author": {\n' +
          '      "name": "Baikal AI"\n' +
          '    }\n' +
          '  },\n' +
          '  "author": {\n' +
          '    "name": "Baikal AI",\n' +
          '    "email": "gih2yun@baikal.ai"\n' +
          '  },\n' +
          '  "creator": {\n' +
          '    "name": "Baikal AI",\n' +
          '    "email": "gih2yun@baikal.ai"\n' +
          '  },\n' +
          '  "dateCreated": "2020-12-16T23:04:18Z",\n' +
          '  "dateModified": "2020-12-16T23:04:18Z",\n' +
          '  "datePublished": "2020-12-16T23:04:18Z",\n' +
          '  "genre": "Korean Language",\n' +
          '  "typicalAgeRange": "7-21"\n' +
          '}',
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
        { text: 'Name', align: 'start', width: 400, sortable: true, value: 'name', groupable: false },
        { text: 'Type', value: 'inputType', width: 100, groupable: false },
        { text: 'Input', value: 'self', groupable: false }
      ],
      allProperties: {
        allProps: [],
        props: {}
      }
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
      if (this.e1 === 3) {
        this.getAllProperties()
      }
    },
    setError () {
      this.secondStepError = 'This is an error!'
    },
    downloadAsFile () {
      console.log('func is called!')
    },
    getNameSplit (name) {
      return name.split('.')
    },
    getNameInfo (name) {
      const arr = name.split('.')
      let ret = ''
      let i = 0
      for (; i < arr.length - 1; i++) {
        ret += arr[i].charAt(0) + '.'
      }
      ret += arr[i]
      return { len: arr.length, show: ret }
    },
    getProps (thing, parentName, depth) {
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
        const primitive = strTypes[0] in primitiveTypes
        const o = {
          name: name,
          from: thing.getName(),
          inputType: strTypes[0],
          type: strTypes[0],
          typeName: dataTypes[0],
          types: strTypes.join('<br>'),
          typeNames: dataTypes,
          subProps: null,
          subExpanded: [],
          value: '',
          link: null,
          desc: prop.getDescription(),
          primitive: primitive, // 기본값인가 여부
          expansible: !primitive, // 펼칠 수 있는가 여부
          expanded: false, // 펼쳐저 있는가 여부
          parentNode: null, // 부모노드 하나에 대한 포인터
          childrenNodes: null, // 클릭을 하게 되면 펼처질 자식 노드들의 시작과 끝
          visible: true,
          depth: 0,
          _: 0
        }
        // 서브 페이지를 만들기 위해서 사용하는 자기를 다시 가리키는 변수
        if (parentName !== undefined) {
          o.name = parentName + '.' + o.name
          o.depth = depth
        }
        o.self = o
        props.push(o)
      }
      return { name, props }
    },
    getAllProperties () {
      const cls = this.superClasses
      let temp = []
      for (const cl of cls) {
        const { name, props } = this.getProps(cl)
        temp = temp.concat(props)
        this.allProperties.props[name] = props
      }
      this.allProperties.allProps = temp
    },
    toggleExpand (node) {
      if (node.expanded) {
        this.collapse(node)
      } else {
        this.expand(node)
      }
    },
    getAllSubNodeCount (node) {
      let ret = 0
      if (node.subProps !== null) {
        ret = node.subProps.length
        for (const sub of node.subProps) {
          if (!sub.primitive) {
            ret += this.getAllSubNodeCount(sub)
          }
        }
      }
      return ret
    },
    expandSubNodes (node) {
      let cl = this.$sdo.sdo.getClass(node.typeName)
      const cls = [cl]
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
      let temp = []
      for (const cl of cls) {
        const o = this.getProps(cl, node.name, node.depth + 1)
        temp = temp.concat(o.props)
      }
      node.subProps = temp
    },
    collapse (node) {
      if (node.subProps === null) {
        return
      }
      const idx = this.allProperties.allProps.map(x => x.name).indexOf(node.name)
      console.log('node', node, idx)
      this.allProperties.allProps.splice(idx + 1, this.getAllSubNodeCount(node))
      node.expanded = false
    },
    expand (node) {
      const idx = this.allProperties.allProps.map(x => x.name).indexOf(node.name)
      console.log('node', node, idx)
      if (node.subProps === null) {
        this.expandSubNodes(node)
      }
      this.allProperties.allProps.splice(idx + 1, 0, ...node.subProps)
      const idx2 = this.allProperties.allProps.map(x => x.name).indexOf(node.name)
      console.log('node', node, idx2)
      node.expanded = true
    },
    isPrimitive (type) {
      return type in primitiveTypes
    },
    itemRowBackground (item) {
      return 'indent-bg-' + item.depth
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
    }
  }
}
</script>

<style scoped lang="scss">
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

  div.in-control {
    display: flex;
    flex-direction: column;
    height: auto;
    flex-grow: 1;
    flex-wrap: wrap;
    min-width: 0;
    width: 100%;
    text-align: left;

    div.in-div::before {
      border-style: solid;
      border-width: thin 0 0 0;
      bottom: -1px;
      content: "";
      left: 0;
      position: absolute;
      transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
      width: 100%;
    }

    div.in-div::after {
      bottom: -1px;
      content: "";
      left: 0;
      position: absolute;
      transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
      width: 100%;
      border-style: solid;
      border-width: thin 0 thin 0;
      transform: scaleX(0);
      border-color: currentColor;

      .have {
        border-color: red;
      }
    }

    div.in-div {

      align-items: center;
      color: inherit;
      display: flex;
      margin-bottom: 8px;
      min-height: inherit;
      position: relative;
      transition: .3s cubic-bezier(.25, .8, .5, 1);
      width: 100%;

      div.in-slot {
        display: flex;
        flex: 1 1 auto;
        position: relative;

        input:focus {
          outline-offset: 0px;
          outline: none;
        }

        input {
          -webkit-writing-mode: horizontal-tb !important;
          text-rendering: auto;
          color: rgba(0, 0, 0, 0.87);
          letter-spacing: normal;
          word-spacing: normal;
          text-transform: none;
          text-indent: 0px;
          text-shadow: none;
          display: inline-block;
          text-align: start;
          background-color: rgb(255, 255, 255);
          -webkit-rtl-ordering: logical;
          cursor: text;
          margin: 0em;
          font: 400 13.3333px Arial;
          padding: 1px 2px;
          /*border-width: 2px;*/
          /*border-style: inset;*/
          /*border-color: rgb(118, 118, 118);*/
          /*border-image: initial;*/
          border: 0 none;
        }

        input[type=text] {
          flex: 1 1 auto;
          line-height: 16px;
          max-width: 100%;
          min-width: 0px;
          width: 100%;
          cursor: text;
        }
      }
    }
  }
  .indent-0 {
    padding-left: 0px;
  }
  .indent-1 {
    padding-left: 10px;
    color: #1A237E;
  }
  .indent-2 {
    padding-left: 20px;
    color: #283593;
  }
  .indent-3 {
    padding-left: 30px;
    color: #303F9F;
  }
  .indent-4 {
    padding-left: 40px;
    color: #0D47A1;
  }
  .indent-5 {
    padding-left: 50px;
    color: #311B92;
  }
  .indent-6 {
    padding-left: 60px;
    color: #4527A0;
  }
  .indent-7 {
    padding-left: 70px;
    color: #512DA8
  }
  .indent-8 {
    padding-left: 80px;
    color: #4A148C;
  }
  .indent-9 {
    padding-left: 90px;
    color: #004D40;
  }

  .mini {
    font-size: 8px;
    font-color: grey;
  }
  .shrink-el {
    width:90px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .shrink-el-1 {
    display: block;
    width:380px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }

</style>
