<template>
  <div>
    <v-stepper v-model="step" class="elevation-0">
      <v-stepper-header>
        <v-stepper-step id="first" :complete="step > 1" step="1">
          샘플 데이터 입력하기
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step id="second" :complete="step > 2" step="2">
          스키마 선택하기
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step id="third" :complete="step > 3" step="3">
          스키마 데이터 입력하기
        </v-stepper-step>
        <v-stepper-step id="fourth" :complete="step > 4" step="4">
          코드 생성 및 다운로드
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-card elevation="0">
                  <v-textarea v-model="srcData" class="srcDataClass" rows="auto"
                  placeholder="JSON.stringify(srcData)">
                  </v-textarea>
                  <v-content v-if="firstStepError"><p>{{firstStepError}}</p></v-content>
                </v-card>
                <v-btn width="130px" raised elevation="2" primary @click="loadJson()">Continue</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-container class="pa-0" fluid >
            <v-row class="pa-0 secondStepperContent">
              <v-col cols="6" class="pa-3">
                <v-card
                  class="mx-auto secondStepperTreeView mb-0 pb-0"
                >
                  <v-sheet class="pa-2 primary lighten-2">
                    <v-text-field
                      v-model="treeSearch"
                      label="Search Schema Directory"
                      dark
                      flat
                      solo-inverted
                      hide-details
                      clearable
                      clear-icon="mdi-close-circle-outline"
                    ></v-text-field>
                  </v-sheet>
                  <v-card-text id="treeView" class="pb-0"
                  >
                    <v-treeview
                      :items="sdoNodes"
                      itemKey="iri"
                      itemText="name"
                      :open.sync="openNodes"
                      :active.sync="activeNodes"
                      :filter="filterNode"
                      :search="treeSearch"
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
              <v-col cols="6" >
                <v-card class="secondStepperJsonObj">
                  <v-card v-if="activeClass" class="secondStepperJsonObjTitle">
                    <v-sheet class="pa-2 lighten-1" color="orange" style="flex:1;">
                      <v-card class="pa-3 lighten-2" color="orange" elevation=0 style="height:100%">
                        <span class="font-weight-bold" style="align-items:center;">{{activeClass.getName()}}</span>
                        <a class="pa-2" :target="activeClass.getName()"
                          color="rgba(0, 0, 255, 0.9)"
                            :href="activeClass.getIRI()">{{activeClass.getIRI(true)}}</a>
                          <span v-html="activeClass.getDescription()"></span>
                      </v-card>
                    </v-sheet>
                  </v-card>
                  <div v-else class="secondStepperJsonObjTitle">
                    <v-sheet class="pa-2 lighten-1" color="orange" style="flex:1;">
                      <v-card class="pa-3 lighten-2 justify-center" color="orange" elevation=0 style="height:100%">
                      왼쪽의 트리에서 스키마를 선택해주세요.
                      </v-card>
                    </v-sheet>
                  </div>
                  <v-card class="pl-4 pt-4 secondStepperJsonObjDataWrapper" elevation="0">
                    <vue-json-pretty
                      class="jsonObj secondStepperJsonObjData" :data="srcObject"
                      :deep="4"></vue-json-pretty>
                  </v-card>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn raised color="primary" :disabled="activeClass === null"
                 @click="setDone(2, 3)">Continue
                </v-btn>
                <v-btn text>Cancel</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card class="mb-0 thirdStepperWrapper" min-height="min-content" height="max-content"
          >
            <v-sheet class="lighten-1" v-if="activeClass">
              <v-card class="grey lighten-3 thirdStepperMenu" elevation="1">
                <v-container fluid>
                  <v-row no-gutters>
                    <v-col cols="3" class="text-center">
                      <v-chip label class="ma-1"
                              v-for="cl of superClasses"
                              v-bind:key="cl.getName()"
                      > <a :target="activeClass.getName()"
                          :href="cl.getIRI()">{{cl.getName()}}</a> </v-chip>
                    </v-col>
                    <v-col class="d-flex justify-center" flex-direction="row">
                      <label class="schemaInputUpperLabel">전체 편집
                        <v-chip label class="ma-1">
                        {{editedSize}}</v-chip></label>
                      <label class="schemaInputUpperLabel"> 입력 소스와 연결:
                        <v-chip class="ma-1" label>{{linkedItems}}</v-chip></label>
                      <label class="schemaInputUpperLabel"> 직접 편집:
                        <v-chip class="ma-1" label>{{editedItems}}</v-chip></label>
                    </v-col>
                    <v-col cols="1" class="schemaInputUpperLabel">
                      <v-btn @click="makeTemplate" >생성</v-btn>
                    </v-col>
                    <v-col cols="3" class="schemaInputUpperLabel  justify-center">
                      <v-checkbox :hide-details="true" class="normal-check"
                        dense v-model="jsonSrcSelected.enabled"
                      >
                        <template v-slot:label>
                          <div>소스 데이터의 필드 이름으로 검색
                            <span class="srcLink">
                              {{jsonSrcSelected.path.substring(1)}}</span>
                          </div>
                        </template>
                      </v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-sheet>
            <v-card-text class="mt-0 mb-0 pb-0 thirdStepperBody">
              <v-container class="pa-0" fluid>
                <v-row class="pa-0" v-if="allProperties">
                  <v-col cols="8" class="pa-2">
                    <v-card style="display: flex; flex: 1; flex-direction:column;">
                    <div
                      id="propEdit"
                      >
                      <v-data-table
                        :headers="headers"
                        :items="allProperties.allProps"
                        item-key="name"
                        class="elevation-1"
                        hide-default-footer
                        disable-pagination
                        fixed-header
                        :item-class="itemRowBackground"
                        :search="inputItemSearch"
                        :custom-filter="itemFilter"
                        dense
                        >
                        <template v-slot:item.name="{ item }">
                          <div :class="'indent-' + item.depth" class="shrink-el-1">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs" v-on="on">
                                  {{item.shortenName}}
                                </span>
                              </template>
                              <span>{{item.name}}</span>
                            </v-tooltip>
                            <span class="mini">/ {{item.from}}</span>
                            <v-tooltip right open-on-click
                                       color="lime darken-4"
                                       max-width="400" min-width="150">
                              <template v-slot:activator="{on, attrs}">
                                <span v-bind="attrs" v-on="on"
                                      class="mini" style="padding-left: 5px">
                                  <v-icon>info</v-icon></span>
                              </template>
                              <span v-html="item.desc"></span>
                            </v-tooltip>
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
                        <template v-slot:item.type="{ item }">
                          <div v-if="isPrimitive(item.type)" class="in-control float-left">
                            <div v-if="item.editing">
                              <div class="in-div"
                                   :class="{have: item.value.length > 0}">
                                <div class="in-slot">
                                  <input v-if="item.type==='Text'"
                                         type="text" v-model="item.value"/>
                                  <input v-else-if="item.type==='URL'"
                                         type="text" v-model="item.value"/>
                                  <input v-else-if="item.type==='Number'"
                                         type="number" v-model="item.value"/>
                                  <input v-else-if="item.type==='Integer'"
                                         type="number" v-model="item.value"/>
                                  <input v-else-if="item.type==='Date'"
                                         type="date" v-model="item.value"/>
                                  <input v-else-if="item.type==='DateTime'"
                                         type="datetime-local" v-model="item.value"/>
                                  <input v-else-if="item.type==='Time'"
                                         type="time" v-model="item.value"/>
                                  <input v-else-if="item.type==='Boolean'"
                                         type="checkbox" v-model="item.checked"/>
                                </div>
                                <v-btn icon @click="editDonePrimitive(item)">
                                  <v-icon>mdi-check-all</v-icon></v-btn>
                              </div>
                            </div>
                            <div v-else-if="item.link">
                              <v-row align="start" justify="start">
                                <v-icon small color="green">mdi-link-variant</v-icon>
                                <span class="sp">{{item.link}}</span>
                                <v-btn @click="unuseLink(item)" icon
                                       elevation="0"
                                       :disabled="item.link === null">
                                  <v-icon>mdi-link-variant-off</v-icon></v-btn>
                                <v-btn @click="editPrimitive(item)"
                                       icon><v-icon>mdi-pencil</v-icon></v-btn>
                              </v-row>
                            </div>
                            <div
                              v-else-if="item.value.length > 0 || item.checked !== undefined">
                              <v-row align="start" justify="start">
                                <v-icon small color="green" >mdi-pencil</v-icon>
                                <span class="sp">{{item.value}}</span>
                                <v-btn @click="editPrimitive(item)"
                                       elevation="0"
                                       icon><v-icon>mdi-pencil</v-icon></v-btn>
                              </v-row>
                            </div>
                            <div v-else>
                              <v-row align="start" justify="start">
                                <v-btn
                                  @click="useLink(item)"
                                  :disabled="jsonSrcSelected.path.length === 0"
                                  elevation="0"
                                  icon
                                ><v-icon>mdi-link-variant</v-icon>
                                </v-btn>
                                <v-btn
                                  @click="editPrimitive(item)"
                                  elevation="0"
                                  icon
                                ><v-icon>mdi-pencil</v-icon></v-btn>
                              </v-row>
                            </div>
                          </div>
                          <div v-else class="float-right">
                            <v-btn icon @click="toggleExpand(item)">
                              <v-icon :color="item.expanded ? 'orange': ''">
                                {{item.expanded ? "mdi-chevron-up" : "mdi-chevron-right"}}
                              </v-icon>
                            </v-btn>
                          </div>
                        </template>
                      </v-data-table>
                    </div>
                    </v-card>
                  </v-col>
                  <v-col cols="4" class="pa-2">
                    <v-card >
                      <div
                        class="jsonObj elevation-2 pa-2" id="propDetailList"
                        >
                        <vue-json-pretty
                          v-model="jsonSrcSelected.path"
                          :data="srcObject"
                          :path="jsonSelect.path"
                          :show-double-quotes="jsonSelect.showDoubleQuotes"
                          :highlight-mouseover-node="jsonSelect.highlightMouseoverNode"
                          :highlight-selected-node="jsonSelect.highlightSelectedNode"
                          :show-length="jsonSelect.showLength"
                          :show-line="jsonSelect.showLine"
                          :select-on-click-node="jsonSelect.selectOnClickNode"
                          :collapsed-on-click-brackets="jsonSelect.collapsedOnClickBrackets"
                          :path-selectable="((path, data) => (path.length > 0))"
                          :selectable-type="jsonSelect.selectableType"
                          :show-select-controller="jsonSelect.showSelectController"
                          @click="printSelected(...arguments, 'CLICK')"
                        ></vue-json-pretty>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                :disabled="editedSize === 0"
                @click="setDone(3, 4)">Continue
              </v-btn>
              <v-btn text>Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="4" class="fourthStepper">
          <v-card class="mb-12" height="max-content">
            <v-card-text class="pb-0">
              <v-container fluid>
                <v-row>
                  <v-col><span>변환 템플릿</span></v-col>
                  <v-col><span>입력 소스 데이터</span></v-col>
                  <v-col><span>생성된 {{selectedLang}} 코드</span></v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" class="jsonObj fourthStepperObj elevation-1 pa-2">
                    <div
                      id="srcTemplate"
                      >
                      <vue-json-pretty
                        :data="template"
                        :deep="4"></vue-json-pretty>
                    </div>
                  </v-col>
                  <v-col cols='4' class="jsonObj fourthStepperObj elevation-1 pa-2">
                    <div
                      id="srcObject"
                    >
                      <vue-json-pretty class="jsonObj" :data="srcObject"
                                       :deep="4"></vue-json-pretty>
                    </div>
                  </v-col>
                  <v-col cols="4" class="jsonObj fourthStepperObj elevation-1 pa-2">
                    <div
                      id="genSource"
                      >
                      <pre>{{generatedSource}}</pre>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="pr-8 pl-8 pt-6 pb-10 elevation-0 fourthStepperJS">
              <v-row no-gutters>
                <v-col cols="2" class="mr-3 text-center">
                  <v-select
                    v-model="selectedLang"
                    :items="genLanguages"
                    label="Select Language"
                    return-object
                    dense
                    item-value="name"
                    @change="generateSource"
                  ></v-select>
                </v-col>
<!--                <v-col cols="2" class="pa-1">-->
<!--                  <v-btn raised @click="generateSource()">generate source</v-btn>-->
<!--                </v-col>-->
                <v-col cols="1" class="pa-1 mr-3 ml-3">
                  <v-btn
                    v-clipboard="() => generatedSource"
                    v-clipboard:success="copyToClipSucc"
                    v-clipboard:error="copyToClipError"
                    raised
                  >save</v-btn>
                </v-col>
                <v-col cols="1" class="pa-1">
                  <v-btn raised color="primary" @click="setDone(4)">Done</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-snackbar
      v-model="snack.show"
      :timeout="3000"
      multi-line
    >
      {{ snack.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snack.show = false"
        >
          닫기
        </v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import gen from '../lago-gen'

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
      step: 1,
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
      jsonSrcSelected: {
        path: '',
        enabled: true
      },
      // tree view
      tree: [],
      openNodes: [],
      activeNodes: [],
      treeSearch: 'data',
      selectedSchema: null,
      // ## 3
      headers: [
        { text: 'Name', align: 'start', width: 400, filterable: true, sortable: true, value: 'name', groupable: false },
        { text: 'Type', value: 'inputType', width: 100, groupable: false, filterable: false },
        { text: 'Input', value: 'type', groupable: false, filterable: false }
      ],
      allProperties: {
        allProps: [],
        props: {},
        editingItem: null
      },
      editedProps: [],
      jsonSelect: {
        value: 'res.error',
        selectableType: 'single',
        showSelectController: true,
        showLength: true,
        showLine: true,
        showDoubleQuotes: false,
        highlightMouseoverNode: true,
        highlightSelectedNode: true,
        selectOnClickNode: true,
        collapsedOnClickBrackets: true,
        path: '',
        model: {}
      },
      snack: {
        text: null,
        show: false
      },
      windowHeight: window.innerHeight,
      template: null,
      generatedSource: 'function ()\n{\n}\n',
      genLanguages: ['JavaScript', 'Java'],
      selectedLang: 'JavaScript'
    }
  },
  methods: {
    onResize () {
      this.windowHeight = window.innerHeight
    },
    loadJson () {
      if (this.srcData !== undefined) {
        try {
          this.srcObject = JSON.parse(this.srcData)
          if (this.srcObject !== null) {
            // console.log(this.srcData)
            // console.log(this.srcObject)
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
      // console.log('set done', id, index)
      if (id === 4) {
        this.saveToLocalStorage()
        return
      }
      if (index) {
        this.step = index
        this.active = index
        console.log('setDone active', this.active)
        this.secondStepError = null
        if (this.step === 2) {
          // console.log(this.$sdo.sdoClasses)
        }
        if (this.step === 3) {
          this.getAllProperties()
        }
        if (this.step === 4) {
          this.makeTemplate()
          this.generateSource()
        }
      }
    },
    // setError () {
    //   this.secondStepError = 'This is an error!'
    // },
    copyToClipSucc () {
      this.openSnack(`생성된 ${this.selectedLang} 코드가 클립보드에 복사되었습니다.`)
    },
    copyToClipError () {
      this.openSnack(`생성된 ${this.selectedLang} 코드를 복사하는 중 오류가 발생했습니다.`)
    },
    shorten (name) {
      const arr = name.split('.')
      let ret = ''
      let i = 0
      for (; i < arr.length - 1; i++) {
        ret += arr[i].charAt(0) + '.'
      }
      ret += arr[i]
      return ret
    },
    getProps (thing, parent) {
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
          shortenName: name,
          nam: name,
          from: thing.getName(),
          desc: prop.getDescription(),
          inputType: strTypes[0],
          // 입력 컨트롤
          type: strTypes[0],
          typeName: dataTypes[0],
          types: strTypes.join('<br>'),
          typeNames: dataTypes,
          // 데이터 입력
          editing: false,
          value: '',
          checked: undefined,
          link: null,
          // 자식노드 관련
          primitive: primitive, // 기본값인가 여부
          expansible: !primitive, // 펼칠 수 있는가 여부
          expanded: false, // 펼쳐저 있는가 여부
          subProps: null,
          depth: 0,
          parent: null,
          _: 0
        }
        // 서브 페이지를 만들기 위해서 사용하는 자기를 다시 가리키는 변수
        if (parent !== undefined) {
          o.name = parent.name + '.' + o.name
          o.shortenName = this.shorten(o.name)
          o.depth = parent.depth + 1
          o.parent = parent
        }
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
      if (node.subProps !== null && node.expanded) {
        ret = node.subProps.length
        for (const sub of node.subProps) {
          if (!sub.primitive) {
            ret += this.getAllSubNodeCount(sub)
          }
        }
        // 열린 모든 서브 노드는 모조리 닫는다.
        node.expanded = false
      }
      return ret
    },
    expandSubNodes (node) {
      let cl = this.$sdo.sdo.getClass(node.typeName)
      const cls = [cl]
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
      let temp = []
      for (const cl of cls) {
        const o = this.getProps(cl, node)
        temp = temp.concat(o.props)
      }
      node.subProps = temp
    },
    // 열기, 닫기를 반복하면, 중간에 더 열린 노드들이 모두 다 함께 열려야 하는데
    // 현재로서는 컨트롤이 쉽지 않아서 모든 서브들을 다 닫도록 한다.
    collapse (node) {
      if (node.subProps === null) {
        return
      }
      const idx = this.allProperties.allProps.map(x => x.name).indexOf(node.name)
      // console.log('node', node, idx)
      this.allProperties.allProps.splice(idx + 1, this.getAllSubNodeCount(node))
      node.expanded = false
    },
    expand (node) {
      const idx = this.allProperties.allProps.map(x => x.name).indexOf(node.name)
      // console.log('node', node, idx)
      if (node.subProps === null) {
        this.expandSubNodes(node)
      }
      this.allProperties.allProps.splice(idx + 1, 0, ...node.subProps)
      // this.allProperties.allProps.map(x => x.name).indexOf(node.name)
      // console.log('node', node, idx2)
      node.expanded = true
    },
    editOrLinkItem (item, add = true) {
      const idx = this.editedProps.map(x => x.name).indexOf(item.name)
      if (add) {
        if (idx > -1) {
          this.editedProps.splice(idx, 1)
        }
        this.editedProps.push(item)
      } else {
        if (idx > -1) {
          this.editedProps.splice(idx, 1)
        }
      }
    },
    useLink (item) {
      if (this.jsonSrcSelected.path.length > 1) {
        item.link = this.jsonSrcSelected.path.substring(1)
        this.editOrLinkItem(item)
      } else {
        this.openSnack('오른쪽 데이터에서 데이터 객체를 컬럼을 선택하세요.')
      }
    },
    unuseLink (item) {
      this.editOrLinkItem(item, false)
      item.link = null
    },
    editPrimitive (item) {
      if (this.allProperties.editingItem !== null) {
        this.allProperties.editingItem.editing = false
      }
      this.allProperties.editingItem = item
      item.editing = true
    },
    editDonePrimitive (item) {
      if (this.allProperties.editingItem !== null) {
        this.allProperties.editingItem.editing = false
        this.allProperties.editingItem = null
      }
      item.link = null
      item.editing = false
      this.editOrLinkItem(item, item.value.length > 0 || item.checked !== undefined)
    },
    isPrimitive (type) {
      return type in primitiveTypes
    },
    itemRowBackground (item) {
      return 'indent-bg-' + item.depth
    },
    itemFilter (value, search, item) {
      // console.log('filter', value, search, item)
      if (search.length === 0) { return true }
      const paths = search.substring(1).split('.')
      for (const p of paths) {
        let pp = p.split('[')[0]
        pp = pp.toLocaleString()
        if (item.name.indexOf(pp) > -1) {
          // console.log('match name', item.name, pp, p)
          return true
        }
        if (item.types.toLocaleString().indexOf(pp) > -1) {
          return true
        }
      }
      return false
    },
    printSelected (path, data, _) {
      const paths = path.split('.')
      this.jsonSrcSelected.path = path
      this.jsonSrcSelected.name = paths[paths.length - 1]
      this.jsonSrcSelected.value = data
    },
    openSnack (msg) {
      this.snack.text = msg
      this.snack.show = true
    },
    makeTemplate () {
      const active = this.activeClass
      const temp = {
        '@context': 'https://schema.org',
        '@type': active.getName()
      }
      const putValue = (dest, obj) => {
        if (obj.value.length > 0) {
          switch (obj.inputType) {
            case 'Number':
            case 'Integer':
              dest[obj.nam] = Number.parseInt(obj.value)
              break
            default:
              dest[obj.nam] = obj.value
              break
          }
        } else if (obj.checked !== undefined) {
          dest[obj.nam] = obj.checked
        } else {
          dest[obj.nam] = '{{' + obj.link + '}}'
        }
      }

      const findObject = (from, name) => {
        // name = rootMember.sub1Member,sub2Member
        // topDown 방식으로 만드는 거이 바람직합니다.
        const paths = name.split('.')
        let target = from
        let schemaArr = this.allProperties.allProps
        for (const elem of paths) {
          const idx = schemaArr.map(x => x.nam).indexOf(elem)
          // 타입 이름을 가져올 수 있는 객체
          const nextObj = schemaArr[idx]
          if (nextObj.primitive) {
            return target
          }
          if (target[elem] === undefined) {
            // 찾으려고 하는 객체가 없는 경우, 여기서는 nam을 사용함.
            target[elem] = {
              '@type': nextObj.inputType
            }
          }
          target = target[elem]
          schemaArr = nextObj.subProps
        }
        // 최종적으로 발견된 객체
        return target
      }

      this.editedProps.forEach((v) => {
        // console.log('make template', v)
        if (v.parent === null) {
          // console.log('make direct ...')
          putValue(temp, v)
          // console.log('after v', temp, v)
        } else {
          putValue(findObject(temp, v.name), v)
          // console.log('after v subsub', temp, v.name, v)
        }
      })

      console.log('after v subsub', temp)
      this.template = temp
    },
    // setHeight (elementId, divisionRate) {
    //   const windowHeight = this.windowHeight
    //   // console.log('onLoad () window height ', windowHeight)
    //   // console.log(' onLoad () return ', windowHeight * divisionRate)
    //
    //   const elem = document.getElementById(elementId)
    //   if (elem != null) {
    //     // console.log(elem)
    //     elem.style.height = windowHeight * divisionRate + 'px'
    //     // console.log('onLoad () set ' + elementId)
    //   } else {
    //     // console.log('onLoad () ' + elementId + ' is null')
    //   }
    // },
    setStaticHeight (elementId, subVal, maxHeight = false, overflow = false) {
      const windowHeight = this.windowHeight
      // console.log('window height ', windowHeight)
      // console.log('return ', windowHeight - subVal)

      // console.log('return obj ', { height: windowHeight - subVal + 'px' })
      const elem = document.getElementById(elementId)
      let styleString = ''

      if (elem != null) {
        // console.log(elem)

        if (maxHeight !== false) {
          styleString += 'height: ' + String(windowHeight - subVal) + 'px;'
          styleString += 'max-height: ' + String(windowHeight - subVal) + 'px;'
        } else {
          styleString += 'height: ' + String(windowHeight - subVal) + 'px;'
        }
        if (overflow !== false) {
          styleString += 'overflow: auto;'
        } else {
        }
        elem.style = styleString
        // console.log('set ' + elementId + '=' + styleString)
      } else {
        // console.log(elementId + ' is null')
      }
    },
    // getHeight (elementId, divisionRate) {
    //   const windowHeight = this.windowHeight
    //   // console.log('window height ', windowHeight)
    //   // console.log('return ', windowHeight * divisionRate)
    //
    //   // console.log('return obj ', { height: windowHeight * divisionRate + 'px' })
    //   const elem = document.getElementById(elementId)
    //   if (elem != null) {
    //     // console.log(elem)
    //     elem.style.height = windowHeight * divisionRate + 'px'
    //     // console.log('set ' + elementId)
    //   } else {
    //     // console.log(elementId + ' is null')
    //   }
    //
    //   return { height: windowHeight * divisionRate + 'px' }
    // },
    getSchemaDescHeight () {
      const propDOM = this.$refs.shcemaInputDesc
      if (propDOM != null) {
        // console.log('getSchemaDescHeight is ' + propDOM.clientHeight)
        return propDOM.clientHeight
      } else {
        // console.log('getSchemaDescHeight is None')
        return 0
      }
    },
    generateSource () {
      this.generatedSource = gen.generateSource(this.selectedLang,
        this.activeClass.getName(),
        this.template)
      // this._conv(this.template, this.srcObject)
    },
    saveToLocalStorage () {
      // 로컬 스토리지에 저장하기
      this.openSnack('작업 결과를 로컬스토리지에 저장했습니다.')
    },
    getStaticHeight (elementId, subVal, maxHeight = false, overflow = false) {
      const windowHeight = this.windowHeight
      // console.log('window height ', windowHeight)
      // console.log('return ', windowHeight - subVal)

      // console.log('return obj ', { height: windowHeight - subVal + 'px' })
      const elem = document.getElementById(elementId)
      let styleString = ''
      const styleObj = {}

      if (elem != null) {
        // console.log(elem)

        if (maxHeight !== false) {
          styleString += 'height: ' + String(windowHeight - subVal) + 'px;'
          styleString += 'max-height: ' + String(windowHeight) - subVal + 'px;'
          styleObj.height = String(windowHeight) - subVal + 'px'
          styleObj.maxHeight = String(windowHeight) - subVal + 'px'
        } else {
          styleString += 'height: ' + String(windowHeight - subVal) + 'px;'
          styleObj.height = String(windowHeight - subVal) + 'px'
        }
        if (overflow !== false) {
          styleString += 'overflow: auto;'
          styleObj.overflow = 'auto'
        } else {
        }
        elem.style = styleString
        console.log('set ' + elementId + '=' + styleString)
        return styleObj
      } else {
        // console.log(elementId + ' is null')
      }
    }

  },
  mounted () {
    this.$nextTick(() => {
      // this.setStaticHeight('srcData', 350, 350)
      // this.setStaticHeight('schemaInputWrapper', 300)
      // this.setStaticHeight('treeView', 450, 450)
      // this.setStaticHeight('schemdaInputJsonObj', 550, 550)
      window.addEventListener('resize', this.onResize)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  computed: {
    filterNode () {
      return function (item, search, name) {
        return item[name].toLowerCase().indexOf(search.toLowerCase()) > -1
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
      addNodeAtRoot(treeNodes, thing.getIRI(true), thing)
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
    inputItemSearch () {
      return this.jsonSrcSelected.enabled ? this.jsonSrcSelected.path : ''
    },
    editedSize () {
      return this.editedProps.length
    },
    linkedItems () {
      return this.editedProps.filter(x => x.link != null).length
    },
    editedItems () {
      return this.editedProps.filter(
        x => x.value.length > 0 || x.checked !== undefined).length
    }
  }
}
</script>

<style scoped lang="scss">
  @import '~vue-json-pretty/lib/styles.css';

  .selected {
    background-color: antiquewhite;
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
        /* TODO: // 잘 안먹음.*/
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
          outline-offset: 0;
          outline: none;
        }

        input {
          -webkit-writing-mode: horizontal-tb !important;
          text-rendering: auto;
          color: rgba(0, 0, 0, 0.87);
          letter-spacing: normal;
          word-spacing: normal;
          text-transform: none;
          text-indent: 0;
          text-shadow: none;
          display: inline-block;
          text-align: start;
          background-color: rgb(255, 255, 255);
          -webkit-rtl-ordering: logical;
          cursor: text;
          margin: 0;
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
          max-width: 70%;
          min-width: 0;
          width: 70%;
          cursor: text;
        }
      }
    }
  }

  .indent-0 {
    padding-left: 0;
  }

  .indent-1 {
    padding-left: 5px;
  }

  .indent-2 {
    padding-left: 10px;
  }

  .indent-3 {
    padding-left: 15px;
  }

  .indent-4 {
    padding-left: 20px;
  }

  .indent-5 {
    padding-left: 25px;
  }

  .indent-6 {
    padding-left: 30px;
  }

  .indent-7 {
    padding-left: 35px;
  }

  .indent-8 {
    padding-left: 40px;
  }

  .indent-9 {
    padding-left: 45px;
  }

  .mini {
    font-size: 8px;
    color:sienna;
  }

  .shrink-el {
    width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .shrink-el-1 {
    display: block;
    width: 380px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .lower {
    text-transform: none !important;
    text-align: left !important;
    font-weight: normal !important;
    display: block;
    width: 60%;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
  .sp {
    margin: 8px;
    padding-left: 3px;
    padding-right: 3px;
    vertical-align: middle;
    line-height: normal;
  }
  .srcLink {
    font-style: italic;
    text-underline: brown;
    font-weight: bold;
    color: navy;
  }
  .normal-check {
    margin-top:0 !important;
  }
  .thirdStepperWrapper {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  .thirdStepperMenu {
    display: flex;
    flex: 1;
  }
  .thirdStepperBody {
    display: flex;
    flex: 1;
  }
  .schemaInputUpperLabel {
    display: flex;
    align-items: center;
    margin: 0 3px 0 3px;
  }
  .firstStepperContent {
    height: calc(100vh - 250px);
    padding-bottom: 20px;
  }
  .secondStepperTreeView {
    height: calc(100vh - 350px);
    // padding-bottom: 20px;
  }
  .secondStepperJsonObj {
    height: calc(100vh - 350px);
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  .secondStepperJsonObjTitle {
    max-height: 400px;
    display: flex;
    flex-direction: column;
    flex: 2;
    overflow: auto;
  }
  #treeView {
    height: 100%;
  }
  .secondStepperJsonObjDataWrapper {
    display: flex;
    flex: 7;
    width: 100%;
    overflow: auto;
  }
  .secondStepperJsonObjData {
    height: 100%;
    width: 100%;
    overflow: auto;
  }
  #srcTemplate {
    min-height: calc(100vh - 440px);
    max-height: calc(100vh - 440px);
    overflow: auto;
  }
  #propDetailList {
    min-height: calc(100vh - 440px);
    max-height: calc(100vh - 440px);
    flex:1;
    overflow: auto;
  }

  .fourthStepperObj {
    min-height: calc(100vh - 420px);
    max-height: calc(100vh - 420px);
    overflow: auto;
  }

  #propEdit {
    // display: flex;
    // flex-direction: column;
    // flex: 1;
    height:100%;
    min-height: calc(100vh - 440px);
    max-height: calc(100vh - 440px);
    // height: 100%;
    overflow: auto;
  }

  .fourthStepper {
    max-height: calc(100vh - 200px);
  }
</style>
