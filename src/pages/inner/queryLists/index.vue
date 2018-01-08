<template>
  <div class="queryLists">
    <!-- <div v-show="notice" class="el-notification" style="top: 16px; z-index: 2000;">
      <i class="el-notification__icon el-icon-warning"></i>
      <div class="el-notification__group is-with-icon">
        <h2 class="el-notification__title">温馨提示</h2>
        <div class="el-notification__content">实际收益=用户实际支付金额，为本订单扣除了优惠券、赠送余额支付的金额。</div>
      </div>
    </div> -->
    <h3>
      <p class="queryLists_info">*收益排行数据每10分钟自动统计</p>
      <button class="btn_list" @click="handeClick">查看统计图</button>
    </h3>
    <div>
      <el-popover
          slot="reference"
          placement="top-end"
          width="252"
          title="数据项说明">
          <p>实际收益=用户实际支付金额,</p>
          <p>为本订单扣除了优惠券、赠送余额支付的金额。</p>
        </el-popover>
      <el-table
        :data="lists"
        v-loading="loading2"
        element-loading-text="拼命加载中"
        style="width: 100%">
        <el-table-column
          prop="allianceArea"
          label="加盟区域"
          min-width="80"
          :render-header="rendHeader1">
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="订单数"
          min-width="80">
             <template slot-scope="scope">
            {{new Number(scope.row.orderNum).thousand()}}
          </template>
        </el-table-column>
        <el-table-column
          prop="totalBill"
          label="订单总额"
          min-width="90">
             <template slot-scope="scope">
            {{new Number(scope.row.totalBill).thousandFormat()}}
          </template>
        </el-table-column>
        <el-table-column
          prop="couponAmount"
          label="优惠券支付(元)">
             <template slot-scope="scope">
            {{new Number(scope.row.couponAmount).thousandFormat()}}
          </template>
        </el-table-column>
        <el-table-column
          prop="grantAmount"
          label="赠送金额支付(元)"
          min-width="100"
        >
            <template slot-scope="scope">
            {{new Number(scope.row.grantAmount).thousandFormat()}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="80"
          label="实际收益(元)"
          prop='userPayAmount'
          :render-header="rendHeader">
          
             <template slot-scope="scope">
            {{new Number(scope.row.userPayAmount).thousandFormat()}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="pageShow"
        class="page_sort"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="totalItems">
      </el-pagination>
    </div>
  </div>
</template>
<style scoped>

  .datashow {
    /* width: 100%; */
    height: 60px;
    line-height: 60px;
    border: 1px solid #dfe6ec;
    border-top: none;
  }

  .datashow p {
    text-align: center;
    color: #5e7382;
  }

  div.queryLists h3 {
    text-align: right;
    /* margin-bottom: 15px; */
    margin-bottom: 1px;
  }

  div.queryLists {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #dfe6ec;
    padding: 20px 20px 800px 20px;
  }

  div.queryLists h3 button {
    margin-right: 0px;
    width: 137px;
  }

  div.queryLists table {
    border-collapse: collapse;
    width: 100%;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }

  div.queryLists table tr th {
    text-align: left;
    border: 1px solid #eee;
    height: 40px;
    font-size: 14px;
    background: #eee;
    font-weight: 400;
    color: #444;
  }

  div.queryLists table tr {
    border-bottom: 1px solid #eee;
    text-indent: 2em;
  }

  div.queryLists table tr td {
    text-align: left;
    /*border: 1px solid #dfe6ec;*/
    padding: 10px 0;
    color: #555;
    font-size: 14px;
  }

  #earD_page {
    padding: 14px 0px 0px 0px;
    background: #fff;
    /*border: 1px solid #e7ecf1;*/
    border-top: none;
    min-height: 233px;
    margin-left: -9px;
  }

  .btn_list {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c4c4c4;
    color: #1f2d3d;
    font-size: 14px;
    margin: 0;
    padding: 10px 15px;
    outline: none;
    border-radius: 4px;
  }

  .btn_list:hover {
    color: rgba(255,140,0, 0.8);
    border: 1px solid rgba(	255,140,0, 0.8);
  }


  .page_sort {
    white-space: nowrap;
    padding: 2px 5px;
    color: #48576a;
    background: #fff;
    margin-left: -5px;
    margin-top: 10px;
    border: none;
  }
  .queryLists_info {
    float: left;
    color: #ddd;
    font-weight: 400;
    font-size: 12px;
    line-height: 50px;
  }
  div.el-notification{right:-330px;}
</style>
<script>
// import $ from 'jquery'
import request from 'superagent'
import moment from 'moment'
import { host } from '../../../config/index.js'
import {isOwnEmpty} from '../../../util/util.js'
import { mapActions, mapGetters } from "vuex";
export default {
  data () {
    return {
      notice: false,
      lists: [],
      pageTotal: '',
      noDate: false,
      loading2: true,
      currentPage: 1,
      pageShow: false,
      totalItems: 1,
      signForQuery: false
    }
  },
  methods: {
     rendHeader1(h, { column, $index }){
      var activeName = this.$route.query.activeName
      var contentStr = activeName=='partner'?'加盟商':'加盟区域'
      return h('div',contentStr)
    },
    getCurrentCity (res) {
      var data = JSON.parse(res.text).data
      var arr = []
      data.map( item => {
        var obj = {}
        obj.cityId = item.cityId
        obj.cityName = item.cityName

        arr.push(obj)

        return arr
      })

      this.$store.dispatch('setIncomingCityList', arr)
      console.log('this.$store.state', this.$store.state.users.incomingCityListStr)
      console.log('arr', arr)
    },
    handleCurrentChange (val) {
      this.loading2 = true
      request
        .post(host + 'beepartner/admin/statistics/adminStatistics')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
           cityId:this.cityId,
          'type': this.signForQuery === true?'define':this.$route.query.type,
          'startTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time1:'',
            'endTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time2:'',
          'currentPage': val,
          'showType': 'table'
        })
        .end((error, res) => {
          if (error) {
            this.loading2 = false
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            this.getCurrentCity(res)
            this.loading2 = false
            var arr = JSON.parse(res.text).data
            var totalPage = Number(JSON.parse(res.text).totalPage)
            this.totalItems = Number(JSON.parse(res.text).totalItems)
            if (totalPage > 1) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }
            var newArr = [] 
            if(arr.length!=0){
                for (var i = 0; i < arr.length; i++) {
              var obj = {}
              obj.allianceArea = arr[i].cityName
              obj.orderNum = arr[i].totalBill
              obj.totalBill = arr[i].totalMoney
              obj.couponAmount = arr[i].totalDiscount
              obj.userPayAmount = arr[i].actualMoney
              obj.grantAmount = arr[i].grantAmount
              newArr.push(obj)
            }
            this.$store.dispatch('consumeData_action', {newArr})
            this.lists = this.$store.state.users.consumeData
            }
            
          }
        })
    },
    handeClick () {
      this.$router.push('/index/incomingRank/queryCharts?type=' + this.$route.query.type)
    },
    dataUpdate () {
      if (this.$route.query.type === 'define') {
        return
      } else {
        this.currentPage = 1
        this.signForQuery = false
        this.loading2 = true
        request
          .post(host + 'beepartner/admin/statistics/adminStatistics')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
             cityId:this.cityId,
            'type': this.$route.query.type,
            'currentPage': 1,
            'showType': 'table',
            'startTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time1:'',
            'endTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time2:''
          })
          .end((error, res) => {
            if (error) {
              this.loading2 = false
              console.log('error:', error)
            } else {
              this.checkLogin(res)
              this.getCurrentCity(res)
              this.loading2 = false
              var arr = JSON.parse(res.text).data
              var totalPage = Number(JSON.parse(res.text).totalPage)
              this.totalItems = Number(JSON.parse(res.text).totalItems)
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              var newArr = [] 
              for (var i = 0; i < arr.length; i++) {
                var obj = {}
                obj.allianceArea = arr[i].cityName
                obj.orderNum = arr[i].totalBill
                obj.totalBill = arr[i].totalMoney
                obj.couponAmount = arr[i].totalDiscount
                obj.userPayAmount = arr[i].actualMoney
                obj.grantAmount = arr[i].grantAmount
                newArr.push(obj)
              }
              this.$store.dispatch('consumeData_action', {newArr})
              this.lists = this.$store.state.users.consumeData
            }
          })
      }
    },
    getDateMount () {
      this.loading2 = true
      request
        .post(host + 'beepartner/admin/statistics/adminStatistics')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          cityId:this.cityId,
          'startTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time1:'',
          'endTimeStr':isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time2:'',
          'type': this.$route.query.type,
          'currentPage': this.currentPage,
          'showType': 'table'
        })
        .end((error, res) => {
          if (error) {
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            this.getCurrentCity(res)
            this.loading2 = false
            var arr = JSON.parse(res.text).data
            var totalPage = Number(JSON.parse(res.text).totalPage)
            this.totalItems = Number(JSON.parse(res.text).totalItems)
            if (totalPage > 1) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }
            var newArr = [] 
            for (var i = 0; i < arr.length; i++) {
              var obj = {}
              obj.allianceArea = arr[i].cityName
              obj.orderNum = arr[i].totalBill
              obj.totalBill = arr[i].totalMoney
              obj.couponAmount = arr[i].totalDiscount
              obj.userPayAmount = arr[i].actualMoney
              obj.grantAmount = arr[i].grantAmount
              newArr.push(obj)
            }
            this.$store.dispatch('consumeData_action', {newArr})
            this.lists = this.$store.state.users.consumeData
          }
        })
    },
    time () {
      var type = this.$route.query.type
      if (this.$store.state.users.timeline.length === 0) {
        return
      } else {
          this.currentPage = 1
          this.signForQuery = true
          this.loading2 = true
          request
            .post(host + 'beepartner/admin/statistics/adminStatistics')
            .withCredentials()
            .set({
              'content-type': 'application/x-www-form-urlencoded'
            })
            .send({
              cityId:this.cityId,
              'type': type,
              'currentPage': 1,
              'startTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time1:'',
              'endTimeStr': isOwnEmpty(this.$store.state.users.timeline)==false?this.$store.state.users.timeline.newObj.time2:'',
              'showType': 'table'
            })
            .end((error, res) => {
              if (error) {
                this.loading2 = false
                console.log('error:', error)
              } else {
                this.checkLogin(res)
                this.getCurrentCity(res)
                this.loading2 = false

                var totalPage = Number(JSON.parse(res.text).totalPage)
                this.totalItems = Number(JSON.parse(res.text).totalItems)
                if (totalPage > 1) {
                  this.pageShow = true
                } else {
                  this.pageShow = false
                }
                
                var arr = JSON.parse(res.text).data
                var newArr = []
                for (var i = 0; i < arr.length; i++) {
                  var obj = {}
                  obj.allianceArea = arr[i].cityName
                  obj.orderNum = arr[i].totalBill
                  obj.totalBill = arr[i].totalMoney
                  obj.couponAmount = arr[i].totalDiscount
                  obj.userPayAmount = arr[i].actualMoney
                  obj.grantAmount = arr[i].grantAmount
                  newArr.push(obj)
                }
                this.$store.dispatch('consumeData_action', {newArr})
                this.lists = this.$store.state.users.consumeData
                }

            })

      }
    },
    checkLogin (res) {
      if (JSON.parse(res.text).message === '用户登录超时') {
        this.$router.push('/login')
      }
    },
   mouseLeaveHandler() {
       $('div.el-popover').css({
         "display":"none",
       })
    },
    mouseEnterHandler() {
      $('div.el-popover').css({
         right:21,
         top:0,
         "display":"block",
       })
    },
    rendHeader(h, { column, $index }) {
      return h('div', {
        class: {
          tips: true,
          cell: true
        },
        attrs: {
          style: 'background:#eee;margin-left:-20px;width:240px;',
          
        }
      }, [
          h('span', '实际收益(元)'),
          h('i', {
            class: {
              'icon iconfont icon-wenhao': true
            },
            attrs: {
              style: 'cursor:pointer;margin-left:0px;color:orange;font-size:18px;vertical-align:middle',
            },
            on: {
              mouseenter: this.mouseEnterHandler,
              mouseleave: this.mouseLeaveHandler
            }
          })
        ])
    }
  },
  mounted () {
    document.title = '报表管理-收益排行'
    setTimeout(()=>{
      this.getDateMount()
    },500)
    if (this.$store.state.users.timeline.length === 0) {
      this.getDateMount()
    } else {
      return
    }
    var that = this
  },
  // // created () {
  // //   this.dataUpdate()
  // // },
  // beforeMount () {
  //   this.time()
  // },
   computed:{
    ...mapGetters(['cityId'])
  },
  watch: {
    'cityId':{
      handler:function(n,o){
        this.getDateMount()
      },
      deep:true,
    },
    '$route': 'dataUpdate',
    '$store.state.users.timeline': 'time'
  }
}
</script>
