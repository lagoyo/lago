<template>
  <div class="content">
    <v-card>
      <v-card-title>
        <h4 class="title">My Schema List</h4>
      </v-card-title>
      <v-card-text>
        <p>내 스키마 작업 목록</p>
        <p>로컬 스토리지를 사용해서, 내가 최근에 작업한 목록을 보여준다.
          다른 브라우저를 사용하면 정보는 저장되지 않습니다.
        </p>
      </v-card-text>
    </v-card>
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

<style scoped lang="scss">
  .content {
    padding-bottom: 150px;
  }
</style>
