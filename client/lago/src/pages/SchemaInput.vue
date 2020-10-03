<template>
  <div class="content">
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step id="first" :complete="e1 > 1" step="1">
          데이터 입력하기
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step id="second" :complete="e1 > 2" step="2">
          스키마 선택하기
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step id="third" :complete="e1 > 3" step="3">
          데이터 입력하기
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
          <v-container height="450px" fluid>
            <v-row>
              <v-col cols="6">
                <v-card-subtitle class="pa-2">
                  Select schema class
                </v-card-subtitle>
                <v-virtual-scroll height="300" item-height="42"
                                  :items="$sdo.sdoClasses">
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
              </v-col>
              <v-col cols="6" >
                  <vue-json-pretty id="jsonObj" :data="srcObject" :deep="4"></vue-json-pretty>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-card v-if="selected" class="pa-4">
                  <p>이름: <span>{{selected.getName()}}</span></p>
                  <p>IRI: <a :target="selected.getName()" :href="selected.getIRI()">{{selected.getIRI()}}</a></p>
                  <p v-html="selected.getDescription()"></p>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <v-btn raised color="primary" @click="setDone(2, 3)">Continue</v-btn>
          <v-btn text>Cancel</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card class="mb-12" height="450px"></v-card>
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
      selectedSchema: null
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
    }
  },
  computed: {
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

  #jsonObj {
    max-height: 300px;
    overflow: auto;
  }

</style>
