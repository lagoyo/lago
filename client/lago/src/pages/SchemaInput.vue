<template>
  <div class="content">
    <div>HELLO WORLD!!</div>
    <md-card>
      <md-card-header data-background-color="orange">
        <h4 class="title">스키마와 함께 코드 생성하기</h4>
        <p class="category">기존의 문서를 입력합니다.</p>
      </md-card-header>
      <md-card-content>
        <md-steppers md-active-step="data" md-vertical>
          <md-step id="data" md-label="데이터 입력하기">
            <md-field>
              <label>스키마로 변경할 데이터를 여기에 입력하세요.</label>
              <md-textarea v-model="srcData"></md-textarea>
            </md-field>
          </md-step>
          <md-step id="choose-schema" md-label="관련 스키마 입력하기">
            <p>여기서는 데이터를 입력합니다.</p>
          </md-step>
          <md-step id="input-data" md-label="데이터 입력하기">
            <p>여기서는 데이터를 입력합니다.</p>
          </md-step>
          <md-step id="gen-code" md-label="코드 생성 및 다운로드">
            <p>여기서는 데이터를 입력합니다.</p>
          </md-step>
        </md-steppers>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>

export default {
  name: 'SchemaInput',

  data () {
    return {
      // 사용작 입력한 최초의 입력 데이터
      srcData: null,
      selectSchema: ''
    }
  }
}
</script>

<style scoped>

</style>
