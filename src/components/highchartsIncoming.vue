<template>
  <div style="position: relative;">
      <div v-title>报表管理-收益排行-统计图</div>
      <div class="my_noDate" v-show="noData">
        <img src="../assets/img/2.png" style="margin-top:100px"/>
        <p>暂无数据</p>
      </div>
      <div v-loading="loading" id="container2" style="height:400px" v-show="!noData"></div>
      <!-- <div v-loading="loading" id="container2"  v-show="!noData"></div> -->
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
        cityList: [],
        noData: false,
        chartData: [],
        loading:true
      }
    },
    mounted () {
      this.loadData()
      var that = this
      // setInterval( function () {
      //   that.loadData()
      // }, 600000)
    },
    methods: {
      //  randomColor() {
      //   var rgb = '255,255,255'
      //   var r = Math.floor(Math.random() * 255) + 1
      //   var g = Math.floor(Math.random() * 255) + 1
      //   var b = Math.floor(Math.random() * 255) + 1
      //   var color = 'rgba(' + r + ',' + g + ',' + b + ',0.7)'
      //   return color
      // },
      initChart () {
        // 创建图表
        Highcharts.chart('container2', {
          /** Highcharts 配置 */
          lang: {
            printChart: '打印图表',
            contextButtonTitle: '图表导出菜单',
            decimalPoint: '.',
            downloadJPEG: '下载JPEG图片',
            downloadPDF: '下载PDF文件',
            downloadPNG: '下载PNG文件',
            downloadSVG: '下载SVG文件'
          },
          tooltip: {
                valueSuffix: '单',
                useHTML: true,
                headerFormat: '<span style="font-size: 12px">地点: {point.key}</span><br/>',
                pointFormatter: function () {
                  return '<span style="color:{' + this.series.color + '}"></span>收益: ￥<b>' + Highcharts.numberFormat(this.y, 2, ".", ",") + '</b>'
                
               }
              },
          exporting: {
            enabled: false
          },
          credits: {
            enabled: false // 禁用版权信息
          },
          chart: {
            type: 'bar',                           // 指定图表的类型，默认是折线图（line）
            backgroundColor: 'rgba(0,0,0,0)'
          },
          title: {
            text: ' '                 // 指定图表标题
          },
          //   scrollbar: {

          //      enabled: true

          // },
          xAxis: {
            categories: this.cityList,
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
          plotOptions: {
            bar: {
              dataLabels: {
                enabled: true,
                allowOverlap: true,
                formatter: function() { 
                    return   Highcharts.numberFormat(this.y, 2, ".", ",");
                },
              }
            }
          },
          legend: {
            enabled: false,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 100,
            floating: true,
            borderWidth: 0,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
          },
           colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00',
                 '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
          series: [
            {
              name: ' ',
              color: '#74f7af',
              data:this.chartData ,
              colorByPoint:true,
              pointWidth: 20
            }
          ]

        })
      },
      loadData () {
        request
          .post(host + 'beepartner/admin/statistics/adminRevenue')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send()
          .end((err, res) => {
            if (err) {
              this.loading = false
              this.noData = true
              console.log('err:' + err)
            } else {
               this.loading = false
               this.checkLogin(res)
              var data = JSON.parse(res.text).data || []
              var newCity = []
              data.map( (item) => {
                newCity.push(item.cityName)
                return newCity
              })

              var newChartData = []
              data.map( (item) => {
                newChartData.push(item.actualMoney)
                return newChartData
              })

              var num = 0;
              for (var i=0; i<newChartData.length; i++) {
                num += newChartData[i]
              } 

              if (num != 0) {
                // this.chartData = newChartData
                // this.cityList = newCity
  // ------------取前五个数
                this.chartData = newChartData.slice(0,5)
                this.cityList = newCity.slice(0,5)

                this.initChart()
                this.noData = false
              }else{
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
    }
  }
</script>
<style>
  div#container2{width:100%; overflow: hidden; }
  div#container2 g.highcharts-legend-item{display:none;}
  .my_noDate {
    width: 100%;
    text-align: center;
    font-size: 22px;
    color: #ccc;
    /* left: 50%; */
  }
</style>
