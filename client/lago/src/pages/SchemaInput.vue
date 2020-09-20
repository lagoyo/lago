<template>
  <div class="content">
    <md-card>
      <md-card-header data-background-color="orange">
        <h4 class="title">스키마와 함께 코드 생성하기</h4>
        <p class="category">기존의 문서를 입력합니다.</p>
      </md-card-header>
      <md-card-content>
        <md-steppers :md-active-step.sync="active">
          <md-step id="first" md-label="데이터 입력하기" :md-done.sync="first">
            <md-field>
              <label>스키마로 변경할 데이터를 여기에 입력하세요.</label>
              <md-textarea v-model="srcData" id="srcData"></md-textarea>
            </md-field>
            <md-content v-if="firstStepError"><p>{{firstStepError}}</p></md-content>
            <md-button class="md-raised md-primary" @click="loadJson()">Continue</md-button>
          </md-step>
          <md-step class="second" id="second" md-label="관련 스키마 입력하기" :md-done.sync="second">
            <div class="md-layout">
              <div class="md-layout-item">
                <md-content class="md-scrollbar">
                  <md-list>
                    <md-subheader>Select schema class</md-subheader>
                    <md-list-item v-for="cl in $sdo.sdoClasses"
                                  v-bind:key="cl.name"
                                  v-bind:class="selectedSchema === cl.value ? 'selected': ''"
                                  @click="getSchemaInfo(cl.value)">{{cl.name}}
                    </md-list-item>
                  </md-list>
                </md-content>
                <md-divider></md-divider>
                <div v-if="selected">
                  <p>설명: <span>{{selected.getDescription()}}</span></p>
                  <p>이름: <span>{{selected.getName()}}</span></p>
                  <p>IRI: <a :target="selected.getName()" :href="selected.getIRI()">{{selected.getIRI()}}</a></p>
                </div>
                <!--                <md-field>-->
                <!--                  <label>Select Schema Class</label>-->
                <!--                  <md-select v-model="selectedClass" id="selectedClass1" name="selClass">-->
                <!--                    <md-option v-for="cl in sdo.sdoClasses" v-bind:key="cl.name" :value="cl.value">{{cl.name}}</md-option>-->
                <!--                  </md-select>-->
                <!--                </md-field>-->
              </div>
              <div class="md-layout-item md-scrollbar">
                <vue-json-pretty :data="srcObject" :deep="4"></vue-json-pretty>
              </div>
            </div>
            <md-button class="md-raised md-primary" @click="setDone('second', 'third')">Continue</md-button>
          </md-step>
          <md-step id="third" md-label="데이터 입력하기" :md-done.sync="third">
            <p>여기서는 데이터를 입력합니다.</p>
            <md-button class="md-raised md-primary" @click="setDone('third', 'fourth')">Continue</md-button>
          </md-step>
          <md-step id="fourth" md-label="코드 생성 및 다운로드" :md-done.sync="fourth">
            <p>여기서는 데이터를 입력합니다.</p>
            <md-button class="md-raised " @click="downloadAsFile()">save</md-button>
            <md-button class="md-raised md-primary" @click="setDone('fourth')">Continue</md-button>
          </md-step>
        </md-steppers>
      </md-card-content>
    </md-card>
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
            this.setDone('first', 'second')
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
      console.log('this', this)
      this[id] = true
      this.secondStepError = null

      if (index) {
        this.active = index
      }
      console.log(this.active)
      if (this.active === 'second') {
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
  .md-textarea {
    height: 250px;
    min-height: 250px;
    max-height: 300px;
  }

  .second .md-layout .md-layout-item {
    min-height: 100px;
  }

  .md-scrollbar {
    max-height: 300px;
    overflow: auto;
  }

  .selected {
    background-color: antiquewhite;
  }

</style>
