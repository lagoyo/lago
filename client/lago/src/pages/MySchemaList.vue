<template>
  <div class="content">
    <md-card>
      <md-card-header data-background-color="white">
        <h4 class="title">My Schema List</h4>
      </md-card-header>
      <md-card-content>
        <p>내 스키마 작업 목록</p>
        <p>로컬 스토리지를 사용해서, 내가 최근에 작업한 목록을 보여준다.
          다른 브라우저를 사용하면 정보는 저장되지 않습니다.
        </p>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>

export default {
  name: 'MySchemaList',
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
