<template>
  <div style="position: relative;">
    <div v-title>报表管理-收益排行-统计图</div>
    <div class="my_noDate" style="position: absolute; min-height:40px; height: 40px;" v-show="noData">
      <img src="../assets/img/2.png" />
      <p>暂无数据</p>
    </div>
    <div id="container" style="position: relative;"></div>
  </div>
</template>
<script>
// import $ from 'jquery'
var Highcharts = require('highcharts')
// 在 Highcharts 加载之后加载功能模块
require('highcharts/modules/exporting')(Highcharts)
import request from 'superagent'
import moment from 'moment'
import {isOwnEmpty} from '../util/util.js'
import { host } from '../config/index.js'
import { mapActions, mapGetters } from "vuex";
// import Vue from 'vue'
export default {
  data() {
    return {
      x_data: [],
      orderNumber: [],
      consumeMoney: [],
      noData: false
    }
  },
   computed:{
    ...mapGetters(['cityId'])
  },
  mounted() {
    // debugger
    if (this.$store.state.users.consumeData.length === 0) {
     this.loadData()
    } else {
      this.getChartDate()
      this.createChartsShap()
      return
    }
  },
  methods: {
    loadData(){
      if(this.$route.query.activeName=='partner'){
         request
        .post(host + 'beepartner/admin/statistics/adminStatisticsBy')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'type': this.$route.query.type,
          'cityList': this.$store.state.users.incomingCityListStr.toString(),
          'showType': 'chart',
          'startTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time1:'',
          'endTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time2:''
        })
        .end((error, res) => {
          if (error) {
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            var arr = JSON.parse(res.text).data
            var newArr = []
            for (var i = 0; i < arr.length; i++) {
              var obj = {}
              obj.allianceArea = arr[i].cityName
              obj.orderNum = arr[i].totalBill
              obj.totalBill = arr[i].totalMoney
              obj.couponAmount = arr[i].totalDiscount
              obj.userPayAmount = arr[i].actualMoney

              obj.conName = arr[i].conName
              obj.companyName = arr[i].companyName
              obj.joinTarget = arr[i].joinTarget
              newArr.push(obj)
            }
            this.$store.dispatch('consumeData_action', { newArr })
            this.getChartDate()
            /**
             * 判断是否显示暂无数据
             */
           
            if (arr.length === 0) {
              $('#container').html('')
              this.noData = true
            } else {
              this.noData = false
              this.createChartsShap()
            }
          }
        })
      }else{
         request
        .post(host + 'beepartner/admin/statistics/adminStatistics')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          cityId:this.cityId,
          'type': this.$route.query.type,
          'cityList': this.$store.state.users.incomingCityListStr.toString(),
          'showType': 'chart',
          'startTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time1:'',
          'endTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time2:''
        })
        .end((error, res) => {
          if (error) {
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            var arr = JSON.parse(res.text).data
            var newArr = []
            for (var i = 0; i < arr.length; i++) {
              var obj = {}
              obj.allianceArea = arr[i].cityName
              obj.orderNum = arr[i].totalBill
              obj.totalBill = arr[i].totalMoney
              obj.couponAmount = arr[i].totalDiscount
              obj.userPayAmount = arr[i].actualMoney
              newArr.push(obj)
            }
            this.$store.dispatch('consumeData_action', { newArr })
            this.getChartDate()
            /**
             * 判断是否显示暂无数据
             */
           
            if (arr.length === 0) {
              $('#container').html('')
              this.noData = true
            } else {
              this.noData = false
              this.createChartsShap()
            }
          }
        })
      }
    },
    createChartsShap() {
      if (this.consumeMoney.length === 0 && this.orderNumber === 0) {
        this.noData = true
        return
      } else {
        // 创建图表
        Highcharts.chart('container', {
          chart: {
            type: 'column'
          },
          title: {
            text: ' '
          },
          scrollbar: {
            enabled: true
          },
          xAxis: {
            categories: this.x_data,
            // max:5
          },
          yAxis: [{
            min: 0,
            title: {
              text: '单数'
            }
          }, {
            title: {
              text: '实际收益'
            },
            opposite: true
          }],
          scrollbar: {
            enabled: true
          },
          exporting: {
            enabled: false
          },
          credits: {
            enabled: false,
            text: "北京蜜蜂出行科技有限公司",
            href: "http://www.mmuu.com"
          },
          legend: {
            shadow: false
          },
          tooltip: {
            formatter: function() {
              if(this.point.series.name==='单数'){
                  return this.point.series.name + ":" + Highcharts.numberFormat(this.point.y, 0, "", ",") + '单'
              }else{
                return this.point.series.name + ":" + Highcharts.numberFormat(this.point.y, 2, ".", ",") + '元'
              }
              
            }
          },
          plotOptions: {
            column: {
              grouping: false,
              shadow: false,
              borderWidth: 0,
              // maxPoinitWidth: 60
            }
          },
          series: [{
            name: '单数',
            color: '#058DC7',
            data: this.orderNumber,
            pointPadding: 0.3,
            pointPlacement: -0.2,
            pointWidth:20
            
          }, {
            name: '实际收益',
            color: '#50B432',
            data: this.consumeMoney,
            pointWidth:20,
          
            tooltip: {
              valuePrefix: '￥',
              valueSuffix: ' 元',
              
            },
            pointPadding: 0.3,
            pointPlacement: 0.2,
            yAxis: 1
          }]
        });

      }/**判断结束 */
    },
    getChartDate() {
      var res = this.$store.state.users.consumeData.map((item) => {
        if(this.$route.query.activeName=='partner'){
          return item.companyName||item.conName
        }else{
          return item.allianceArea
        }
        
      })

      var order = this.$store.state.users.consumeData.map((item) => {
        return item.orderNum
      })

      var allMoney = this.$store.state.users.consumeData.map((item) => {
        return item.userPayAmount
      })
      this.x_data = res
      this.orderNumber = order
      this.consumeMoney = allMoney
    },
    getChartByRoute(arr) {
      var res = arr.map((item) => {
          if(this.$route.query.activeName=='partner'){
            return item.companyName||item.conName
          }else{
            return item.allianceArea
          }
        })

        var order = arr.map((item) => {
          return item.orderNum
        })

        var allMoney = arr.map((item) => {
          return item.userPayAmount
        })

        this.$set(res, this.x_data)
        this.x_data = res
        this.orderNumber = order
        this.consumeMoney = allMoney

    },
    dataUpdate() {
      if (this.$route.query.type === 'define') {
      return
    } else {
      if(this.$route.query.activeName=='partner'){
        request
        .post(host + 'beepartner/admin/statistics/adminStatisticsBy')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'type': this.$route.query.type,
          'showType': 'chart',
          'cityList': this.$store.state.users.incomingCityListStr.toString(),
           'startTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time1:'',
            'endTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time2:''
        })
        .end((error, res) => {
          if (error) {
            console.log('error:', error)
          } else {
            if (JSON.parse(res.text).data.length === 0) {
              $('#container').html('')
              this.noData = true
            } else {
              this.checkLogin(res)
              this.noData = false
              var arr = JSON.parse(res.text).data
              var newArr = []
              for (var i = 0; i < arr.length; i++) {
                var obj = {}
                obj.allianceArea = arr[i].cityName
                obj.orderNum = arr[i].totalBill
                obj.totalBill = arr[i].totalMoney
                obj.couponAmount = arr[i].totalDiscount
                obj.userPayAmount = arr[i].actualMoney

                obj.conName = arr[i].conName
                obj.companyName = arr[i].companyName
                obj.joinTarget = arr[i].joinTarget
                newArr.push(obj)
              }

              this.getChartByRoute(newArr)
              this.createChartsShap()
            }
          }
        })
      }else{
        request
        .post(host + 'beepartner/admin/statistics/adminStatistics')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          cityId:this.cityId,
          'type': this.$route.query.type,
          'showType': 'chart',
          'cityList': this.$store.state.users.incomingCityListStr.toString(),
           'startTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time1:'',
            'endTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time2:''
        })
        .end((error, res) => {
          if (error) {
            console.log('error:', error)
          } else {
            if (JSON.parse(res.text).data.length === 0) {
              $('#container').html('')
              this.noData = true
            } else {
              this.checkLogin(res)
              this.noData = false
              var arr = JSON.parse(res.text).data
              var newArr = []
              for (var i = 0; i < arr.length; i++) {
                var obj = {}
                obj.allianceArea = arr[i].cityName
                obj.orderNum = arr[i].totalBill
                obj.totalBill = arr[i].totalMoney
                obj.couponAmount = arr[i].totalDiscount
                obj.userPayAmount = arr[i].actualMoney
                newArr.push(obj)
              }

              this.getChartByRoute(newArr)
              this.createChartsShap()
            }
          }
        })
      }
      
      }
    },
    time() {
      var type = this.$route.query.type
      if(isOwnEmpty(this.$store.state.users.timeline)==true){
        return;
      }
      if (this.$store.state.users.timeline.newObj.time1.length === 0&&this.$store.state.users.timeline.newObj.time2.length === 0) {
        this.$message({
          message: '请输入日期',
          type: 'warning'
        })
      } else {
        if(this.$route.query.activeName=='partner'){
          request
          .post(host + 'beepartner/admin/statistics/adminStatisticsBy')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'startTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time1:'',
            'endTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time2:'',
            'type': type,
            'cityList': this.$store.state.users.incomingCityListStr.toString(),
            'showType': 'chart'
          })
          .end((error, res) => {
            if (error) {
              console.log('error:', error)
            } else {
              if (JSON.parse(res.text).data.length === 0) {
                $('#container').html('')
                this.noData = true
                return;
              } else {
                
                this.checkLogin(res)
                this.noData = false
                var arr = JSON.parse(res.text).data
                var newArr = []
                for (var i = 0; i < arr.length; i++) {
                  var obj = {}
                  obj.allianceArea = arr[i].cityName
                  obj.orderNum = arr[i].totalBill
                  obj.totalBill = arr[i].totalMoney
                  obj.couponAmount = arr[i].totalDiscount
                  obj.userPayAmount = arr[i].actualMoney

                  obj.conName = arr[i].conName
                  obj.companyName = arr[i].companyName
                  obj.joinTarget = arr[i].joinTarget
                  newArr.push(obj)
                }
                this.getChartByRoute(newArr)
                this.createChartsShap()
              }
             
            }
          })
        }else{
          request
          .post(host + 'beepartner/admin/statistics/adminStatistics')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'startTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time1:'',
            'endTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time2:'',
            'type': type,
            'cityList': this.$store.state.users.incomingCityListStr.toString(),
            'showType': 'chart'
          })
          .end((error, res) => {
            if (error) {
              console.log('error:', error)
            } else {
              if (JSON.parse(res.text).data.length === 0) {
                $('#container').html('')
                this.noData = true
                return;
              } else {
                
                this.checkLogin(res)
                this.noData = false
                var arr = JSON.parse(res.text).data
                var newArr = []
                for (var i = 0; i < arr.length; i++) {
                  var obj = {}
                  obj.allianceArea = arr[i].cityName
                  obj.orderNum = arr[i].totalBill
                  obj.totalBill = arr[i].totalMoney
                  obj.couponAmount = arr[i].totalDiscount
                  obj.userPayAmount = arr[i].actualMoney
                  newArr.push(obj)
                }
                this.getChartByRoute(newArr)
                this.createChartsShap()
              }
             
            }
          })
        }

      }
    },
    checkLogin(res) {
      if (JSON.parse(res.text).message === '用户登录超时') {
        this.$router.push('/login')
      }
    }
  },
  watch: {
    'cityId':{
      handler:function(n,o){
        this.loadData()
      },
      deep:true,
    },
    '$route': 'dataUpdate',
    '$store.state.users.timeline': 'time'
  }
}
</script>
<style>
div#container g.highcharts-legend-item {
  display: none;
}

.my_noDate {
  width: 100%;
  text-align: center;
  font-size: 22px;
  color: rgba(243, 243, 245, 1);
  position: relative;
  text-align: center;
  /* left: 50%; */
}

.my_noDate img {
  display: inline-block;
  width: 300px;
  height: 200px;
}

.my_noDate p {
  color: #ccc;
}
</style>
