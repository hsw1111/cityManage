<template>
  <div style="width:98%;position: relative;">
      <div v-title>报表管理-消费数据-走势图</div>
      <div class="my_noDate" style="position: absolute; min-height:40px; height: 40px;" v-show="noData">
        <img src="../assets/img/2.png"/>
        <p>暂无数据</p>
      </div>
      <div id="container" style="position: relative;" v-loading="loading"></div>
  </div>
</template>
<script>
// import $ from 'jquery'
  import { host } from '../config/index.js'
  import request from 'superagent'
  import moment from 'moment'
  var Highcharts = require('highcharts')
  // 在 Highcharts 加载之后加载功能模块
  require('highcharts/modules/exporting')(Highcharts)
  export default {
    data () {
      return {
        noData: false,
        chartData: [],
        cityId:'',
        loading:true
      }
    },
    mounted () {
      this.cityId = this.$route.query.cityId
      this.routeChange()
      var that = this
      // setInterval( function () {
      //   that.noData = false
      //   request
      //     .post(host + 'beepartner/admin/statistics/adminTrend')
      //     .withCredentials()
      //     .set({
      //       'content-type': 'application/x-www-form-urlencoded'
      //     })
      //     .send({
      //       'cityId': that.cityId
      //     })
      //     .end((err, res) => {
      //       if (err) {
      //         that.noData = true
      //         console.log('err:' + err)
      //       } else {
      //         var arr = JSON.parse(res.text).data || []
      //         var newChartData = []
      //         arr.map( (item) => {
      //           newChartData.push(item.totalBill)
      //           return newChartData
      //         })

      //            var num = 0;
      //         for (var i=0; i<newChartData.length; i++) {
      //           num += newChartData[i]
      //         } 

              
      //         if (num != 0) {
      //           that.chartData = newChartData
      //           that.noData = false
      //           that.initChart()
      //         }else{
      //           $('#container').html('')
      //           that.noData = true
      //         } 


      //         if (JSON.parse(res.text).data.length === 0) {
      //           $('#container').html('')
      //           that.noData = true
      //         }

      //       }
      //     })
      // }, 60000)
    },
    methods: {
      // randomColor() {
      //   var rgb = '255,255,255'
      //   var r = Math.floor(Math.random() * 255) + 1
      //   var g = Math.floor(Math.random() * 255) + 1
      //   var b = Math.floor(Math.random() * 255) + 1
      //   var color = 'rgba(' + r + ',' + g + ',' + b + ',0.7)'
      //   return color
      // },
      initChart () {
        // 创建图表
        Highcharts.chart('container', {
          /** Highcharts 配置 */
          colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00',
                 '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
          lang: {
            printChart: '打印图表',
            contextButtonTitle: '图表导出菜单',
            decimalPoint: '.',
            downloadJPEG: '下载JPEG图片',
            downloadPDF: '下载PDF文件',
            downloadPNG: '下载PNG文件',
            downloadSVG: '下载SVG文件'
          },
          credits: {
            enabled: false // 禁用版权信息
          },
          chart: {
            type: 'column', // 指定图表的类型，默认是折线图（line
            backgroundColor: '#fff'
          },
          title: {
            text: ' '                 // 指定图表标题
          },
          xAxis: {
            categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
            crosshair: true
          },
          yAxis: {
            title: {
              text: ''
            },
            labels: {
              step: 1
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            borderWidth: 0
          },
          exporting: {
            enabled: false
          },
          series: [
            {
              name: ' ',
              color: '#74f7af',
              data:this.chartData,
              colorByPoint:true,
              // data: [
              //   {
              //     color: 'red',
              //     y: this.chartData[0]
              //   },
              //   {
              //     color: 'green',
              //     y: this.chartData[1]
              //   },
              //   {
              //     color: 'blue',
              //     y: this.chartData[2]
              //   },
              //   {
              //     color: 'orange',
              //     y: this.chartData[3]
              //   },
              //   {
              //     color: 'brown',
              //     y: this.chartData[4]
              //   },
              //   {
              //     color: 'gray',
              //     y: this.chartData[5]
              //   },
              //   {
              //     color: 'pink',
              //     y: this.chartData[6]
              //   },
              //   {
              //     color: 'red',
              //     y: this.chartData[7]
              //   },
              //   {
              //     color: 'green',
              //     y: this.chartData[8]
              //   },
              //   {
              //     color: 'blue',
              //     y: this.chartData[9]
              //   },
              //   {
              //     color: 'orange',
              //     y: this.chartData[10]
              //   },
              //   {
              //     color: 'brown',
              //     y: this.chartData[11]
              //   },
              //   {
              //     color: 'gray',
              //     y: this.chartData[12]
              //   },
              //   {
              //     color: 'pink',
              //     y: this.chartData[13]
              //   },
              //   {
              //     color: 'red',
              //     y: this.chartData[14]
              //   },
              //   {
              //     color: 'green',
              //     y: this.chartData[15]
              //   },
              //   {
              //     color: 'blue',
              //     y: this.chartData[16]
              //   },
              //   {
              //     color: 'orange',
              //     y: this.chartData[17]
              //   },
              //   {
              //     color: 'brown',
              //     y: this.chartData[18]
              //   },
              //   {
              //     color: 'gray',
              //     y: this.chartData[19]
              //   },
              //   {
              //     color: 'pink',
              //     y: this.chartData[20]
              //   },
              //   {
              //     color: 'red',
              //     y: this.chartData[21]
              //   },
              //   {
              //     color: 'green',
              //     y: this.chartData[22]
              //   },
              //   {
              //     color: 'blue',
              //     y: this.chartData[23]
              //   },
              //   {
              //     color: 'orange',
              //     y: this.chartData[24]
              //   }
              // ],
              // data:this.chartData.map((item)=>{return {color:this.randomColor(),y:item}}) ,
              tooltip: {
                valueSuffix: '单',
                useHTML: true,
                headerFormat: '<span style="font-size: 12px">时间 {point.key}</span><br/>',
                pointFormatter: function () {
                  return '<span style="color:{' + this.series.color + '}"></span>单数: <b>' +  this.y + '</b>'
                }
              }
            }
          ]

        })
      },
      routeChange () {
        this.cityId = this.$route.query.cityId
        this.noData = false
        var that = this;
        request
          .post(host + 'beepartner/admin/statistics/adminTrend')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'cityId': this.cityId
          })
          .end((err, res) => {
            if (err) {
              this.loading = false              
              this.noData = true
              console.log('err:' + err)
            } else {
              this.loading = false
              this.checkLogin(res)
              var arr = JSON.parse(res.text).data || []
              var newChartData = []
              arr.map( (item) => {
                newChartData.push(item.totalBill)
                return newChartData
              })

                 var num = 0;
              for (var i=0; i<newChartData.length; i++) {
                num += newChartData[i]
              } 

              
              if (num != 0) {
                this.chartData = newChartData
                this.noData = false
                this.initChart()
              }else{
                $('#container').html('')
                this.noData = true
              } 


              if (JSON.parse(res.text).data.length === 0) {
                $('#container').html('')
                this.noData = true
              }

            }
          })
      },
      checkLogin (res) {
        if (JSON.parse(res.text).message === '用户登录超时') {
          this.$router.push('/login')
        }
      }
    },
    watch: {
      '$route': 'routeChange'
    }
  }
</script>
<style>
  div#container{width:100%;height:265px;}
  div#container g.highcharts-legend-item{display:none;}
</style>
