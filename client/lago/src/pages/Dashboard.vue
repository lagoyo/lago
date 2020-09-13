<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"
      >
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
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <md-card>
          <md-card-header data-background-color="white">
            <h4 class="title">SCHEMA.ORG Schemas</h4>
            <p class="category">New employees on 15th September, 2016</p>
          </md-card-header>
          <md-card-content>
            <ordered-table table-header-color="orange"></ordered-table>
          </md-card-content>
        </md-card>
      </div>
<!--      <div-->
<!--        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"-->
<!--      >-->
<!--        <nav-tabs-card>-->
<!--          <template slot="content">-->
<!--            <span class="md-nav-tabs-title">Tasks:</span>-->
<!--            <md-tabs class="md-success" md-alignment="left">-->
<!--              <md-tab id="tab-home" md-icon="bug_report" md-label="Bugs">-->
<!--                <nav-tabs-table></nav-tabs-table>-->
<!--              </md-tab>-->

<!--              <md-tab id="tab-pages" md-icon="code" md-label="Website">-->
<!--                <nav-tabs-table></nav-tabs-table>-->
<!--              </md-tab>-->

<!--              <md-tab id="tab-posts" md-icon="cloud" md-label="server">-->
<!--                <nav-tabs-table></nav-tabs-table>-->
<!--              </md-tab>-->
<!--            </md-tabs>-->
<!--          </template>-->
<!--        </nav-tabs-card>-->
<!--      </div>-->
    </div>
  </div>

</template>

<script>

import {
  OrderedTable
  // NavTabsTable,
  // NavTabsCard
} from '../components'

export default {
  name: 'Dashboard',
  components: {
    // NavTabsCard,
    // NavTabsTable,
    OrderedTable
  },

  data () {
    return {
      // 사용작 입력한 최초의 입력 데이터
      srcData: null,
      emailsSubscriptionChart: {
        data: {
          labels: [
            'Ja',
            'Fe',
            'Ma',
            'Ap',
            'Mai',
            'Ju',
            'Jul',
            'Au',
            'Se',
            'Oc',
            'No',
            'De'
          ],
          series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            'screen and (max-width: 640px)',
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0]
                }
              }
            }
          ]
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
