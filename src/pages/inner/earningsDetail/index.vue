<template>
  <div style="margin-right:20px;">
    <!-- <div v-show="notice" class="el-notification" style="top: 16px; z-index: 2000;">
      <i class="el-notification__icon el-icon-warning"></i>
      <div class="el-notification__group is-with-icon">
        <h2 class="el-notification__title">温馨提示</h2>
        <div class="el-notification__content">实际收益=用户实际支付金额，为本订单扣除了优惠券、赠送余额支付的金额。</div>
      </div>
    </div> -->
    <div id="earD_header">
      <div class="earD_con" style="margin-top: 10px;">
        <div>
          <el-row class="city">
<!-- 新增按加盟商查询 -->
            <p class="select_connect" style="margin-left:22px">
              <el-select v-model="joinMode"  @change="modeChange">
                <el-option label="全部" value="0"></el-option>
                <el-option label="独家" value="1"></el-option>
                <el-option label="非独家" value="2"></el-option>
              </el-select>
              <el-select v-model="joinPartner" placeholder="请选择加盟商" @change="partnerChange" :title='title'>
                <el-option label="全部加盟商" value="0"></el-option>
                <!-- <el-option label="加盟商1" value="1"></el-option>
                <el-option label="加盟商2" value="2"></el-option> -->
                <el-option 
                  v-for='(item,index) in partnerLists'
                  :key="item.id"
                  :label='item.joinTarget=="1"?item.companyName:item.conName'
                  :value='item.cityPartnerId'
                  :index='index'
                  
                ></el-option>
              </el-select>
              <el-select v-model="cityId" placeholder="请选择加盟商区域">
                <el-option label="请选择加盟区域" value="0" v-if='joinPartner=="0"'></el-option>
                <el-option 
                  v-else
                  v-for='(item,index) in citys'
                  :key="index"
                  :label='item.cityName'
                  :value='item.cityId'
                ></el-option>
              </el-select>
            </p>

            <!-- <div class="citys" style="margin-left:90px;color:#555">
              <address class="joinArea" style="margin-left: -66px;">加盟区域</address>
              <span @click="handleClick" myId='0' class="active">全部地区</span>
              <span @click="handleClick" :key='item.id' :myId='item.code' v-for="item in cityList">{{item.name}}</span>
            </div> -->
          </el-row>
        </div>
        <div class="time_earning">
          <el-button @click='getDailyDate' v-bind:class="{active: isDay}">今日</el-button>
          <el-button @click='getWeekDate' v-bind:class="{active: isWeek}">本周</el-button>
          <el-button @click='getMonthDate' v-bind:class="{active: isMonth}">本月</el-button>
          <el-button @click='getAllDate' v-bind:class="{active: AllTime}">近三个月</el-button>
          <el-button @click='handleChangeType' v-bind:class="{active: spceTime}">指定时间段</el-button>
        </div>
        <el-date-picker 
          v-model="timeLine" 
          type="daterange" 
          v-show="show"
          
          placeholder="选择时间范围"  
          style="margin-top: 6px;"
          align="right">
        </el-date-picker>
        <el-button v-show="show2" class="earning_btn" style="margin-top: 2px;" @click="searchByTimeLine">查询</el-button>        
      </div>
		</div>

		<div id="earD_excel">
			<div id="earD_all">
				<h1>
          <el-tooltip class="item" effect="dark" content="所有车辆骑行收益" placement="bottom-end"> 
					  <p>实际收益合计：<span>{{sumMoney.thousandFormat()}}元</span></p>
          </el-tooltip>
					<p @click='export_excel'>导出明细到Excel</p>
				</h1>
			</div>
		</div>
		<div id="earD_body">
         <el-popover
          slot="reference"
          placement="top-end"
          width="252"
          title="数据项说明">
          <p>实际收益=用户实际支付金额,</p>
          <p>为本订单扣除了优惠券、赠送余额支付的金额。</p>
        </el-popover>
        <!-- <i class="icon iconfont icon-wenhao" v-popover:popover1 style='cursor:pointer;margin-left:0px;color:orange;font-size:18px;vertical-align:middle;float:right'></i> -->
        <el-table
        :data="tableData"    
        v-loading="loading2"
        element-loading-text="拼命加载中"
        style="width: 100%">
        <el-table-column
          min-width="65"
          label="车辆号"
          prop='bikeCode'>
          <template slot-scope="scope">
              <!-- <a>{{scope.row.bikeCode}}</a> -->
                <router-link style="color:rgb(118, 103, 233); text-decoration: none;" target='_blank' v-bind:to="{path:'/carUseDetail', query: {code:scope.row.bikeCode}}">{{scope.row.bikeCode}}</router-link>   
              <!-- <a style="color:rgb(118, 103, 233); text-decoration: none;" >{{scope.row.bikeCode}}</a>   -->
          </template>
        </el-table-column>
        <el-table-column
          prop="cityName"
          label="加盟地区"
          min-width="60"
          >
        </el-table-column>
        <el-table-column
          prop="placeOrderTime"
          min-width="90"
          label="订单结束时间">
          
        </el-table-column>
        <el-table-column
          prop="rideTime"
          label="骑行时间(分钟)"
          min-width="90"
        >
          <template slot-scope="scope">
            {{(scope.row.rideTime).thousand()}}
          </template>
        </el-table-column>
        <el-table-column
          prop="rideMileage"
          label="骑行里程(米)"
          min-width="85"
          >
          <template slot-scope="scope">
            {{(scope.row.rideMileage).thousand()}}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderMoney"
          label="订单费用(元)"
          min-width="60"
          >
           <template slot-scope="scope">
            {{(scope.row.orderMoney).thousandFormat()}}
          </template>
        </el-table-column>
        <el-table-column
          prop="couponAmount"
          label="优惠券支付(元)"
          min-width="60"
        >
            <template slot-scope="scope">
            {{(scope.row.couponAmount).thousandFormat()}}
          </template>
        </el-table-column>
        <el-table-column
          prop="grantAmount"
          label="赠送金额支付(元)"
          min-width="60"
        >
            <template slot-scope="scope">
            {{(scope.row.grantAmount).thousandFormat()}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="balanceAmount"
          label="实际收益(元)"
        > -->
        <el-table-column
          prop="balanceAmount"
          label="实际收益(元)"
          :render-header="rendHeader"
        >
          <template slot-scope="scope">
            {{(scope.row.balanceAmount).thousandFormat()}}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-show="pageShow"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="totalItems"
        id="pageInput">
      </el-pagination>
		</div>
	</div>
</template>

<style scope>
  #earD_header address {
    font-style: normal;
    display: inline;
    font-size: 14px;
    margin-left: 34px;
    margin-right: 6px;
  }

  #earD_header div.citys {
    display: inline-block;
    /* width: 1000px; */
    vertical-align: top;
  }

  #earD_header div.citys span {
    cursor: pointer;
    font-size: 14px;
    display: inline;
    padding: 5px;
    border: 1px solid transparent;
  }
  #earD_header div.citys span.active {
    border: 1px solid orange;
    border-radius: 4px;
  }
  #pageInput .el-pagination__editor{width:50px}

  /* 加盟商样式 */
    html,body,h1,h2,h3,h4,h5,h6,td,tr,th,table,thead,tbody,dl,dt,dd,p,span,ul,li,ol {
      margin: 0;
      padding: 0;
    }

    body {
      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }

    .loading_class {
      background: rgba(68,68,68,0.4);
    }

    #earD_header {
      /* width: 100%; */
      min-height: 102px;
      line-height: 40px;
      background:#faebd7;
      border: 1px solid #e7ecf1;
      overflow: hidden;
      padding-bottom: 12px;
      padding-top: 5px;
    }

    #earD_header div.time_earning {
      display:block;
      float:left;
      margin-right: 8px;
      margin-top: 5px;
      padding-left: 15px;
    }

    #earD_header div.time_earning button {
      margin-left: 8px;
      display: inline-block;
      border: 1px solid #ddd;
      outline: none;
      font-size: 14px;
      color: #666;
      /*background: rgba(66, 66, 66, 0.8);*/
      background: #fff;
      /*transition: all .2s linear 0s;*/
      box-sizing: border-box;
      height: 35px;
    }

    #earD_header div.time_earning button.active {
      /*background: rgb(66, 66, 66);*/
      background: rgba(	255,140,0, 0.8);
      color: #fff;
      border: 1px solid rgba(	255,140,0, 0.5);
    }

    /*#earD_header div.time_earning button:hover{color:#999;}*/

    #earD_excel {
      padding: 0px 20px 0px 20px;
      background:#fff;
      border: 1px solid #e7ecf1;
      border-bottom: none;
      margin-bottom: -10px;
      margin-top: 20px;
    }

    #earD_all {
      width: 100%;
      height: 40px;
      background: #fcfcd3;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    #earD_all h1 {
      width: 100%;
      line-height: 40px;
      height: 40px;
    }

    #earD_all h1 p:nth-of-type(1) {
      float: left;
      margin-left: 10px;
      font-size: 12px;
      color: #868671;
      cursor: pointer;
    }

    #earD_all h1 p:nth-of-type(2) {
      float: right;
      font-size: 12px;
      margin-right: 10px;
      color: #ff9900;
    }

    #earD_all h1 p:nth-of-type(2):hover {
      text-decoration: underline;
      cursor: pointer;
    }

    #earD_body {
      padding: 2px 20px 20px 20px;
      background: #fff;
      border: 1px solid #e7ecf1;
      border-top: none;
    }

    #earD_page {
      padding: 4px 10px 0 18px;
      padding-bottom: 100px;
      background: #fff;
      border: 1px solid #e7ecf1;
      border-top: none;
      min-height: 233px;
    }

    #earD_header .earning_btn {
      width: 80px;
      /*float: right;*/
      height: 36px;
      line-height: 11px;
      margin-right: 30px;
      color: #fff;
      margin-top: 11px;
      outline: none;
      border: none;
      /* border-radius: 4px; */
      background: rgba(52,52,67, 0.8);
    }

    #earD_header .earning_btn:hover {
        background: rgba(52,52,67, 0.9);
        color: #fff;
    }

    #earD_body .el-pagination {
      white-space: nowrap;
      padding: 2px 5px;
      color: #48576a;
      border: none;
      margin-top: 10px;
      margin-left: -5px;
      background: #fff;
      /* padding-left: 31px; */
      /* border-left: 1px solid #f3f3f5; */
    }
</style>

<script>
// import $ from 'jquery'
import request from 'superagent'
import moment from 'moment'
import { siblings } from '../../../../utils/index.js'
import {thousand,thousandFormat} from '../../../util/util.js'
// require('../../../assets/lib/js/exportExcel.js')
//require('../../../assets/lib/js/Blob.js')
import { host } from '../../../config/index.js'
export default {
  data () {
    return {
      joinMode:this.$route.query.joinMode||'0',
      // 注意cityPartnerId为字符串
      joinPartner:Number(this.$route.query.cityPartnerId)||'0',
      cityId:this.$route.query.cityId||'0',
      partnerLists:[],
      temp:[],
      temp1:[],
      temp2:[],
      citys:[],
      title:'',
// --------------------
      cityName:'全部地区',
      notice: false,
      tableData: [],
      timer: null,
      totalPage: '',
      // pickerOptions2: {
      //   shortcuts: [
      //     {
      //       text: '最近一周',
      //       onClick (picker) {
      //         const end = new Date()
      //         const start = new Date()
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      //         picker.$emit('pick', [start, end])
      //       }
      //     },
      //     {
      //       text: '最近一个月',
      //       onClick (picker) {
      //         const end = new Date()
      //         const start = new Date()
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      //         picker.$emit('pick', [start, end])
      //       }
      //     },
      //     {
      //       text: '最近三个月',
      //       onClick (picker) {
      //         const end = new Date()
      //         const start = new Date()
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      //         picker.$emit('pick', [start, end])
      //       }
      //     }
      //   ]
      // },
      timeLine: '',
      cityList: [],
      show: false,
      show2: false,
      loading2: false,
      pageShow: false,
      currentPage: 1,
      totalItems: 1,
      isDay:false,
      isWeek:false,
      isMonth:false,
      AllTime:false,
      spceTime:false,
      sumMoney:0
    }
  },
  created(){
     this.hrefChange()
     this.searchPartner()
     this.searchPartner1()
     this.searchPartner2()
     
  },
  mounted () {
    $(".sign").removeClass('is-active')
    $('.sign[name="40"]').addClass('is-active')
    document.title = '订单管理'
    // this.getCityList()

    this.getDate()
    
   
  },
  methods: {
// ----------------------------------下拉菜单三联动部分开始-----------------------------------------------
    searchPartner(){
      request
        .post(host + 'beepartner/admin/cityPartner/queryContionByMode')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          joinMode:0
        })
        .end((error, res) => {
          if (error) {
          
            console.log('error:', error)
          } else {
            // console.log(JSON.parse(res.text))
            var data = JSON.parse(res.text).data
              this.temp = data
              this.partnerLists = this.temp
          }
        })
    },
    searchPartner1(){
      request
        .post(host + 'beepartner/admin/cityPartner/queryContionByMode')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          joinMode:1
        })
        .end((error, res) => {
          if (error) {
          
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            // console.log(JSON.parse(res.text))
            var data = JSON.parse(res.text).data
              this.temp1 = data
            

          }
        })
    },
    searchPartner2(){
      request
        .post(host + 'beepartner/admin/cityPartner/queryContionByMode')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          joinMode:2
        })
        .end((error, res) => {
          if (error) {
          
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            // console.log(JSON.parse(res.text))
            var data = JSON.parse(res.text).data
              this.temp2 = data
            

          }
        })
    },
    // 从首页跳转到订单管理页面时根据joinMode处理加盟商下拉菜单
    hrefChange(){
        request
        .post(host + 'beepartner/admin/cityPartner/queryContionByMode')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          joinMode:this.joinMode
        })
        .end((error, res) => {
          if (error) {
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            // console.log(JSON.parse(res.text))
            var data = JSON.parse(res.text).data
              this.partnerLists = data
             var partnerArr =  data.filter(item=>{
                    return this.$route.query.cityPartnerId==item.cityPartnerId
              })
              console.log(partnerArr)
              if(this.joinMode=='0'){
                this.citys = partnerArr[0].areaList
              }else if(this.joinMode=='1'){
                this.citys = partnerArr[0].areaList.filter(item=>{
                  return item.joinMode=='1'
                })
              }else if(this.joinMode=='2'){
                this.citys = partnerArr[0].areaList.filter(item=>{
                  return item.joinMode=='2'
                })
              }
          }
        })
    },
    // 加盟模式改变
    modeChange(val){
      if(val=='0'){
        this.partnerLists = this.temp
      }else if(val=='1'){
         this.partnerLists = this.temp1
      }else{
        this.partnerLists = this.temp2
      }
      this.citys = []
      this.joinPartner = '0'
      this.cityId = '0'
      // console.log(this.partnerLists)
      
    },
    // 加盟商改变
    partnerChange(val){
      
      var data = this.partnerLists.filter(item=>{
        return item.cityPartnerId == val
      })
      if(val=='0'){
            this.citys = []
            this.cityId = '0'
        }else if(this.joinMode=='0'){
            this.citys = data[0].areaList
            this.cityId = this.citys[0].cityId
        }else if(this.joinMode=='1'){
          this.citys = data[0].areaList.filter(item=>{
            return item.joinMode=='1'
          })
          this.cityId = this.citys[0].cityId
        }else if(this.joinMode=='2'){
          this.citys = data[0].areaList.filter(item=>{
            return item.joinMode=='2'
          })
          this.cityId = this.citys[0].cityId
        }
      
      
      // console.log(this.cityId)
      var that  =this
      setTimeout(function(){
        that.title = $("p.select_connect .el-select input")[1].value
      },200)
    },
// ----------------------------------下拉菜单三联动部分结束-----------------------------------------------

    getDate () {
      if (this.$route.query.type === '0') {
        this.isDay = true
        this.isWeek = false
        this.isMonth = false
        this.AllTime = false
        this.spceTime = false
        this.show = false
        this.show2 = false
      } else if (this.$route.query.type === '1'){
        this.show = false
        this.show2 = false
        this.isWeek = true
        this.isDay = false
        this.isMonth = false
        this.AllTime = false
        this.spceTime = false
      } else if (this.$route.query.type === '2'){
        this.show = false
        this.show2 = false
        this.isMonth = true
        this.isWeek = false
        this.isDay = false
        this.AllTime = false
        this.spceTime = false
      } else if (this.$route.query.type === '3'){
        this.show = false
        this.show2 = false
        this.isMonth = false
        this.isWeek = false
        this.isDay = false
        this.AllTime = true
        this.spceTime = false
      } else {
        this.isMonth = false
        this.isWeek = false
        this.isDay = false
        this.AllTime = false
        this.spceTime = true
        this.show = true
        this.show2 = true
      }
      this.currentPage = 1;
      this.loading2 = true
      request
        .post(host + 'beepartner/admin/order/findOrder4Admin')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'type': this.$route.query.type,
          'pageNum':1,
          // 'cityId': $('.citys span.active').attr('myId'),
          'cityId': this.cityId,
          'joinMode':this.joinMode,
          'cityPartnerId':this.joinPartner,
          'startTime': this.timeLine === ''?'':moment(this.timeLine[0]).format('YYYY-MM-DD HH:mm:ss'),
          'endTime': this.timeLine === ''?'':moment(this.timeLine[1]).format('YYYY-MM-DD HH:mm:ss')
        })
        .end((err, res) => {
          if (err) {
            console.log('err:' + err)
          } else {
            this.checkLogin(res)
            // 表单Loading
            this.loading2 = false
            var totalPage = Number(JSON.parse(res.text).totalPage)
            var newArr = JSON.parse(res.text).data
            this.totalItems = Number(JSON.parse(res.text).totalItems)
            this.sumMoney = JSON.parse(res.text).sumMoney

            if (totalPage > 1) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }
            var arr2 = this.tableDataDel(newArr)
            this.$store.dispatch('earningsDate_action', { arr2 })
            this.tableData = this.$store.state.users.earningsDate.arr2
          }
        })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      var startTime, endTime;
      if (this.timeLine === '') {
        startTime = ''
        endTime = ''
      } else {
        startTime = moment(this.timeLine[0]).format('YYYY-MM-DD HH:mm:ss')
        endTime = moment(this.timeLine[1]).format('YYYY-MM-DD HH:mm:ss')       
      }
      this.loading2 = true
      request
        .post(host + 'beepartner/admin/order/findOrder4Admin')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          type: this.$route.query.type,
          // cityId: $('.citys span.active').attr('myId'),
          cityId: this.cityId,
          joinMode:this.joinMode,
          cityPartnerId:this.joinPartner,

          pageNum: val,
          startTime: startTime,
          endTime: endTime,

        })
        .end((error, res) => {
          if (error) {
            this.loading2 = false
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            this.loading2 = false
            var totalPage = Number(JSON.parse(res.text).totalPage)
            var newArr = JSON.parse(res.text).data
            this.totalItems = Number(JSON.parse(res.text).totalItems)
            if (totalPage > 1) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }
            var arr2 = this.tableDataDel(newArr)
            this.$store.dispatch('earningsDate_action', { arr2 })
            this.tableData = this.$store.state.users.earningsDate.arr2
          }
        })
    },
    handleChangeType (e) {
      if (e.currentTarget.innerText === '指定时间段') {
        this.$router.push('/index/earningsDetail?type=4')
        this.show = true
        this.show2 = true
        this.spceTime = true
        this.isDay = false
        this.isMonth = false
        this.AllTime = false
        this.isWeek = false
        this.startTime = ' '
        this.endTime = ' '
      } else {
        //this.show = false
        //this.show2 = false
      }
    },
    export_excel () {
       if(this.tableData.length==0){
         this.$message({
          type: 'warning',
          message:"当前无数据!"
        })
        return
       }
      this.$confirm('确认导出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        require.ensure([], () => {
          var that = this
          that.$loading({customClass: 'loading_class'})
          // setTimeout(() => {
            // const { export_json_to_excel } = require('../../../assets/lib/js/Export2Excel.js')
            // const tHeader = ['车辆编号', '加盟地区', '订单结束时间', '骑行时间(分钟)', '骑行里程(米)', '订单费用(元)', '优惠劵支付(元)', '赠送金额支付(元)','实际收益(元)']
            // const filterVal = ['bikeCode','cityName', 'placeOrderTime', 'rideTime', 'rideMileage', 'orderMoney', 'couponAmount', 'grantAmount', 'balanceAmount']
            var startTime, endTime;
            if (that.timeLine === '') {
              startTime = ''
              endTime = ''
            } else {
              startTime = moment(that.timeLine[0]).format('YYYY-MM-DD HH:mm:ss')
              endTime = moment(that.timeLine[1]).format('YYYY-MM-DD HH:mm:ss')       
            }
            request
              .get(host + 'beepartner/admin/order/exportOrders2')
              .withCredentials()
              .set({
                'content-type': 'application/x-www-form-urlencoded'
              })
              .query({
                'type': that.$route.query.type,
                'cityId': this.cityId,
                'startTime': startTime||'',
                'endTime': endTime||'',
                'cityPartnerId':this.joinPartner
              })
              // .send({
              //   'type': that.$route.query.type,
              //   'cityId': $('.citys span.active').attr('myId'),
              //   'startTime': startTime,
              //   'endTime': endTime
              // })
              .end((err, res) => {
                if (err) {
                  console.log('err:' + err)
                  that.$loading({customClass: 'loading_class'}).close()
                } else {
                  this.checkLogin(res)
                  // 数据处理
                  var list = JSON.parse(res.text).data || []
                  // var newList = that.tableDataDel(list)
                  if (list.length === 0) {
                    that.$message.error('当前查询没有信息，无法导出哦~');
                    that.$loading({customClass: 'loading_class'}).close()
                  } else {
                    that.$loading({customClass: 'loading_class'}).close()
                    // console.log(res)
                    window.location.href = (res.body.data)
                  //   const data = that.formatJson(filterVal, newList)
                  //   export_json_to_excel(tHeader, data, that.cityName + '_订单明细excel')
                    
                  //   that.$message({
                  //     type: 'success',
                  //     message: '导出成功'
                  //   })
                  // }
                 
                  }
                }
              })
          // }, 1000)
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消'
        // })
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    tableDataDel (arr) {
      var arrDeled = []
      for (var i = 0; i < arr.length; i++) {
        var obj = {}
        obj.bikeCode = arr[i].bikeCode
        obj.cityName = arr[i].cityName
        obj.placeOrderTime = arr[i].placeOrderTime
        obj.rideTime = arr[i].rideTime
        obj.rideMileage = arr[i].rideMileage
        obj.orderMoney = arr[i].orderMoney
        obj.couponAmount = arr[i].couponAmount
        obj.balanceAmount = arr[i].balanceAmount
        obj.grantAmount = arr[i].grantAmount
        arrDeled.push(obj)
      }
      return arrDeled
    },
    getDailyDate () {
      this.currentPage = 1;
      this.$router.push('/index/earningsDetail?type=0')
      this.getDate()
    },
    getWeekDate () {
       this.currentPage = 1;
      this.$router.push('/index/earningsDetail?type=1')
      this.getDate()
    },
    getMonthDate () {
       this.currentPage = 1;
      this.$router.push('/index/earningsDetail?type=2')
      this.getDate()
    },
    getAllDate () {
       this.currentPage = 1;
      this.$router.push('/index/earningsDetail?type=3')
      this.getDate()
    },
    searchByTimeLine () {
      this.currentPage = 1
      if (this.timeLine === '') {
        this.$message({
          message: '请输入时间段',
          type: 'warning'
        })
      } else {
        var startTime = moment(this.timeLine[0]).format('YYYY-MM-DD HH:mm:ss')
        var endTime = moment(this.timeLine[1]).format('YYYY-MM-DD HH:mm:ss')
        this.loading2 = true
        request
          .post(host + 'beepartner/admin/order/findOrder4Admin')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'type': 4,
            // 'cityId': $('.citys span.active').attr('myId'),
            'cityId': this.cityId,
            'cityPartnerId':this.joinPartner,
            'joinMode':this.joinMode,
            
            'startTime': startTime,
            'endTime': endTime,
          })
          .end((error, res) => {
            if (error) {
              console.log('error:', error)
            } else {
              this.checkLogin(res)
              this.loading2 = false
              var totalPage = Number(JSON.parse(res.text).totalPage)
              var newArr = JSON.parse(res.text).data
              this.totalItems = Number(JSON.parse(res.text).totalItems)
              this.sumMoney = JSON.parse(res.text).sumMoney
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              var arr2 = this.tableDataDel(newArr)
              this.$store.dispatch('earningsDate_action', { arr2 })
              this.tableData = this.$store.state.users.earningsDate.arr2
            }
          })
      }
    },
    handleClick (e) {
      this.currentPage = 1;
      var elems = siblings(e.target)
      for (var i = 0; i < elems.length; i++) {
        elems[i].setAttribute('class', '')
      }
      e.target.setAttribute('class', 'active')
      this.getDate()
      this.cityName = e.target.innerText
     
    },
    getCityList () {
      request
        .post(host + 'beepartner/admin/city/findAreaAlreadyOpen')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send()
        .end((error, res) => {
          if (error) {
            console.log('error:', error)
          } else {
            this.cityList = res.body
          }
        })
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
         right:41,
         top:145,
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
  watch:{
    // 'joinMode':'getDate',
    // 'cityId':'getDate',
    'cityId':'getDate'
  }
}
</script>
