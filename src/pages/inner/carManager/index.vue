<template>
  <div class="carManager" style="margin-right: 20px;">
    <el-tabs type="border-card" @tab-click="getTabName" v-model="activeName">
      <el-tab-pane name='已分配'>
        <span slot="label">
          <i class="el-icon-date"></i> 已分配</span>
            <div class="carManager_content">
              <div class="queryCarInfo">
                <el-form :model="form">
                  <el-row>
                    <el-row class="selectPlace_carManage">
<!-- 新增按加盟商查询 -->
                        <p class="select_connect">
                          <el-select v-model="joinMode"  @change="modeChange">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="独家" value="1"></el-option>
                            <el-option label="非独家" value="2"></el-option>
                          </el-select>
                          <el-select v-model="joinPartner" placeholder="请选择加盟商" @change="partnerChange">
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
                          <el-select v-model="cityId" placeholder="请选择加盟商地区">
                            <el-option label="全部地区" value="0" v-if='joinPartner=="0"'></el-option>
                            <el-option 
                              v-else
                              v-for='(item,index) in citys'
                              :key="index"
                              :label='item.cityName'
                              :value='item.cityId'
                            ></el-option>
                          </el-select>
                        </p>
                      <!-- <div class="citys" style=" margin-left: 69px;color:#555">

                        <address class="joinArea">加盟区域</address>
                        <span @click="handleClick" myId='0' class="active">全部地区</span>
                        <span @click="handleClick" :key='item.id' :myId='item.code' v-for="item in cityList">{{item.name}}</span>
                      </div> -->
                    </el-row>
                    <el-col>
                      <el-form-item class="filtercar">
                        <span class="labelAlign">关键字</span>
                        <!-- <input v-model="terminalNumber" v-on:input='inputChange' class="carMan_bar" placeholder="车辆号\终端编号"> -->
                        <input v-model="terminalNumber"  class="carMan_bar" placeholder="车辆号\终端编号">
                      </el-form-item>
                      <el-form-item class="filtercar" style="width: 400px;color:#555">
                        <span class="labelAlign">车辆状态</span>
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox label="4" style="color:#555">待出租</el-checkbox>
                            <el-checkbox label="5" style="color:#555">已预订</el-checkbox>
                            <el-checkbox label="6" style="color:#555">已出租</el-checkbox>
                            <el-checkbox label="7" style="color:#555">维护中</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-form-item>
                        <span class="labelAlign">上线日期</span>
                        <el-date-picker v-model='form.data1' type="date" placeholder="选择日期"></el-date-picker>
                      <span class="division">至</span>
                        <el-date-picker v-model='form.data2' type="date" placeholder="选择日期"></el-date-picker>
                        <input type="button" class="my_btn"  value="查询" @click="searchByTimeline">
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
            <div class="showCarInfo">
                <el-table
                  :data="tableData"
                  style="width: 100% font-size:13px; color: #6c6c6c;"
                  v-loading="loading2"
                  element-loading-text="拼命加载中"
                >
                  <el-table-column
                    min-width="60"
                    label="车辆号"
                    prop='code'>
                    <template slot-scope="scope">
                        <!-- <a>{{scope.row.bikeCode}}</a> -->
                         <router-link style="color:rgb(118, 103, 233); text-decoration: none;" target='_blank' v-bind:to="{path:'/carUseDetail', query: {code:scope.row.bikeCode}}">{{scope.row.bikeCode}}</router-link>   
                       <!-- <a style="color:rgb(118, 103, 233); text-decoration: none;" >{{scope.row.bikeCode}}</a>   -->
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="boxCode"
                    label="终端编号"
                    min-width="80">
                  </el-table-column>
                  <el-table-column
                    prop="cityName"
                    label="加盟区域"
                    min-width="60">
                  </el-table-column>
                  <el-table-column
                    prop="onlineTime"
                    label="上线日期"
                    min-width="60">
                  </el-table-column>
                  <el-table-column
                    prop="stateName"
                    label="车辆状态">
                  </el-table-column>
                </el-table>

                <el-pagination
                v-show="pageShow"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="10"
                layout="prev, pager, next, jumper"
                :total="totalItems">
              </el-pagination>
            </div>
          
            <!-- <div id="carManager_page">
              <div class="M-box"></div>
            </div> -->
      </el-tab-pane>
      <el-tab-pane label="未分配" name='未分配'>
        <div class="carManager_content">
              <div class="queryCarInfo">
                <el-form :model="form">
                  <el-row>
                    <el-col>
                      <el-form-item class="filtercar">
                        <span class="labelAlign">关键字</span>
                        <!-- <input v-model="terminalNumber" v-on:input='inputChange' class="carMan_bar" placeholder="车辆号\终端编号"> -->
                        <input v-model="terminalNumber"  class="carMan_bar" placeholder="车辆号\终端编号">
                      </el-form-item>
                      <el-form-item class="filtercar" style="width: 400px;">
                        <span class="labelAlign">车辆状态</span>
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox label="4">待出租</el-checkbox>
                            <el-checkbox label="5">已预订</el-checkbox>
                            <el-checkbox label="6">已出租</el-checkbox>
                            <el-checkbox label="7">维护中</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-form-item>
                        <span class="labelAlign">上线日期</span>
                        <el-date-picker v-model='form.data1' type="date" placeholder="选择日期"></el-date-picker>
                      <span class="division">至</span>
                        <el-date-picker v-model='form.data2' type="date" placeholder="选择日期"></el-date-picker>
                        <button class="my_btn" @click="searchByTimeline">查询</button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
            <div class="showCarInfo">
              <el-table
              :data="tableData"
              style="width: 100% font-size:13px; color: #6c6c6c;"
              v-loading="loading2"
              element-loading-text="拼命加载中"
              >
                <el-table-column
                  min-width="80"
                  label="车辆号"
                  prop='code'>
                  <template slot-scope="scope">
                      <!-- <a>{{scope.row.bikeCode}}</a> -->
                        <router-link style="color:rgb(118, 103, 233); text-decoration: none;" target='_blank' v-bind:to="{path:'/carUseDetail', query: {code:scope.row.bikeCode}}">{{scope.row.bikeCode}}</router-link>   
                      <!-- <a style="color:rgb(118, 103, 233); text-decoration: none;" >{{scope.row.bikeCode}}</a>   -->
                  </template>
                </el-table-column>
                <el-table-column
                  prop="boxCode"
                  label="终端编号"
                  min-width="90">
                </el-table-column>
                <el-table-column
                  prop="generationsName"
                  label="车辆型号"
                  min-width="80">
                </el-table-column>
                <el-table-column
                  prop="onlineTime"
                  label="上线日期"
                  min-width="80">
                </el-table-column>
                <el-table-column
                  prop="stateName"
                  label="车辆状态">
                </el-table-column>
              </el-table>
              <el-pagination
              v-show="pageShow"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="10"
              layout="prev, pager, next, jumper"
              :total="totalItems">
            </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import request from 'superagent'
import moment from 'moment'
import {siblings} from '../../../../utils/index.js'
// import $ from 'jquery'
// import Vue from 'vue'
import { host } from '../../../config/index.js'
export default {
  data: function () {
    return {
      joinMode:this.$route.query.joinMode||'0',
      joinPartner:Number(this.$route.query.cityPartnerId)||'0',
      cityId:this.$route.query.cityId||'0',
      partnerLists:[],
      temp1:[],
      temp2:[],
      citys:[],
      form: {
        radio: '',
        data1: '',
        data2: ''
      },
      tableData: [],
      timer: null,
      timer2: null,
      pagetotal: '',
      checkList: [],
      terminalNumber: '',
      activeName: '已分配',
      cityList: [],
      currentPage: 1,
      pageShow: false,
      noDate: false,
      totalItems: 1,
      loading2: false,
      isSearch: false
    }
  },
  created(){
    this.hrefChange()
    this.searchPartner1()
    this.searchPartner2()
  },
  mounted: function () {
    $(".sign").removeClass('is-active')
    $('.sign[name=30]').addClass('is-active')
     document.title = '车辆管理'

    
   
    // this.getCityList()
    this.getDateByTabName('0')
  },
  methods: {
  
// ----------------------------------下拉菜单三联动部分

    searchPartner1(){
      this.loading2 = true
      request
        .post(host + 'beepartner/admin/cityPartner/findCityPartner')
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
            console.log(JSON.parse(res.text))
            var data = JSON.parse(res.text).data
              this.temp1 = data
              this.loading2 = false
          }
        })
    },
    searchPartner2(){
       this.loading2 = true
      request
        .post(host + 'beepartner/admin/cityPartner/findCityPartner')
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
            console.log(JSON.parse(res.text))
            var data = JSON.parse(res.text).data
              this.temp2 = data
               this.loading2 = false

          }
        })
    },
     // 从首页跳转到订单管理页面时根据joinMode处理加盟商下拉菜单
    hrefChange(){
      if(this.joinMode=='0'){
        this.partnerLists = []
        this.citys = []
      }else{
        request
        .post(host + 'beepartner/admin/cityPartner/findCityPartner')
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
            console.log(JSON.parse(res.text))
            var data = JSON.parse(res.text).data
              this.partnerLists = data
             var partnerArr =  data.filter(item=>{
               if(this.$route.query.cityPartnerId==item.cityPartnerId){
                 return item
               }
                
              })
              this.citys = partnerArr[0].areaList

          }
        })
      }
    },
    // 加盟模式改变
    modeChange(val){
      if(val=='0'){
        this.partnerLists = []
        this.citys = []
      }else if(val=='1'){
         this.partnerLists = this.temp1
      }else{
        this.partnerLists = this.temp2
      }
      this.joinPartner = '0'
      this.cityId = '0'
      console.log(this.partnerLists)
      
    },
  // 加盟商改变
  partnerChange(val){
    console.log(val)
    var data = this.partnerLists.filter(item=>{
      return item.cityPartnerId == val
    })
   
    if(val=='0'){
      this.citys = []
      this.cityId = '0'
    }else{
      this.citys = data[0].areaList
      this.cityId = this.citys[0].cityId
    }
    console.log(this.cityId)
  },


    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      var radio = this.checkList.toString()
      this.loading2 = true

      var startTime, endTime
      if (this.form.data1 === '' || this.form.data2 === '') {
        startTime = null
        endTime = null
      } else {
        startTime = moment(this.form.data1).format('YYYY-MM-DD')
        endTime = moment(this.form.data2).format('YYYY-MM-DD')
      }
      request
        .post(host + 'beepartner/admin/Bike/findBike')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'type': this.activeName === '已分配'?0:1,
          // 'cityCode': this.activeName === '已分配'?$('.citys span.active').attr('myId'):'',
          'cityCode': this.activeName === '已分配'?this.cityId:'',
          'joinMode':this.joinMode,
          'cityPartnerId':this.joinPartner,
          'currentPage': val,
          'bikeState': radio,
          'startOnlineTime': startTime,
          'endOnlineTime': endTime,
          'keyName': this.isSearch === false?'':this.terminalNumber
        })
        .end((error, res) => {
          if (error) {
            this.loading2 = false
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            this.loading2 = false
            var data = JSON.parse(res.text).data
            var newData = this.tableDataDel(data)
            this.totalItems = Number(JSON.parse(res.text).totalItems)
            var totalPage = Number(JSON.parse(res.text).totalPage)
            if (totalPage > 1) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }
            this.tableData = newData
          }
        })
    },
    searchByTimeline () {
      this.currentPage = 1
      this.isSearch = true
      var type 
      if (this.activeName === '已分配') {
        type = '0'
      } else {
        type = '1'
      }
      // if (this.terminalNumber === '' && this.form.data1 === '' && this.form.data2 === '' &&  this.checkList.length === 0) {
      //      this.$message({
      //       type: 'warning',
      //       message: '查询条件不能为空！'
      //     })
      //     return
      // } else {
         
         var startTime,endTime
        // if (this.form.data1 === '' || this.form.data2 === '') {
        //   startTime = ''
        //   endTime = ''
        // } else {
        //   startTime = moment(this.form.data1).format('YYYY-MM-DD')
        //   endTime = moment(this.form.data2).format('YYYY-MM-DD')
        // }
        startTime = this.form.data1 == ''?"":moment(this.form.data1).format('YYYY-MM-DD')
        endTime = this.form.data2 === ''?"":moment(this.form.data2).format('YYYY-MM-DD')
        var _startTime = new Date(this.form.data1).getTime()
        var _endTime = new Date(this.form.data2).getTime()
        _endTime = isNaN(_endTime) ? 0 : _endTime
        _startTime = isNaN(_startTime) ? 0 : _startTime
        if(_startTime!="" &&_endTime!=""&&_endTime<_startTime){
              this.$message({
                type: 'warning',
                message: '开始日期不能大于结束日期'
              })
              return
        }
        

        // if (_endTime > 1 && _startTime <= 1) {
        //     this.$message({
        //       type: 'warning',
        //       message: '开始日期不能为空'
        //     })
        //     return
        //   } else if (_endTime < 0) {
        //     this.$message({
        //       type: 'warning',
        //       message: '结束日期不能为空'
        //     })
        //     return
        //   } else {
        //     if(_endTime<_startTime){
        //       this.$message({
        //         type: 'warning',
        //         message: '开始日期不能大于结束日期'
        //       })
        //       return
        //     }
        //   }
        // var startTime, endTime
        // if (this.form.data1 === '' || this.form.data2 === '') {
        //   startTime = null
        //   endTime = null
        // } else {
        //   startTime = moment(this.form.data1).format('YYYY-MM-DD')
        //   endTime = moment(this.form.data2).format('YYYY-MM-DD')
        // }
          // startTime = this.form.data1?moment(this.form.data1).format('YYYY-MM-DD'):''
          // endTime = this.form.data2?moment(this.form.data2).format('YYYY-MM-DD'):''
        // if (this.form.data1 === '' && this.form.data2 != '') {
        //   this.$message({
        //     message: '请选择开始日期',
        //     type: 'warning'
        //   })
        // } 

        // if (this.form.data2 === '' && this.form.data1 != '') {
        //   this.$message({
        //     message: '请选择结束日期',
        //     type: 'warning'
        //   })
        // } 
        this.loading2 = true
        // 根据用户选择不同状态进行数据的筛选
        var radio = this.checkList.toString()
        request
          .post(host + 'beepartner/admin/Bike/findBike')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'startOnlineTime': startTime,
            'endOnlineTime': endTime,
            'bikeState': radio,
            'keyName': this.terminalNumber,
            // 'cityCode': this.activeName === '已分配'?$('.citys span.active').attr('myId'):'',
            'cityCode': this.activeName === '已分配'?this.cityId:'',
            'type': type,
            'cityPartnerId':this.joinPartner,
            'joinMode':this.joinMode
          })
          .end((error, res) => {
            if (error) {
              this.loading2 = false
              console.log('error:', error)
            } else {
              this.checkLogin(res)            
              this.loading2 = false
              var data = JSON.parse(res.text).data
              var newData = this.tableDataDel(data)
              this.totalItems = Number(JSON.parse(res.text).totalItems)
              var totalPage = Number(JSON.parse(res.text).totalPage)
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              this.tableData = newData
            }
          })
      // }
    },
    // 通过车辆状态查询
    searchThroughCheckList () {
      console.log(this.form)
      this.currentPage = 1
      
      var type 
      if (this.activeName === '已分配') {
        type = '0'
      } else {
        type = '1'
      }
       var startTime,endTime
        // if (this.form.data1 === '' || this.form.data2 === '') {
        //   startTime = ''
        //   endTime = ''
        // } else {
        //   startTime = moment(this.form.data1).format('YYYY-MM-DD')
        //   endTime = moment(this.form.data2).format('YYYY-MM-DD')
        // }
         startTime = this.form.data1 == ''?"":moment(this.form.data1).format('YYYY-MM-DD')
        endTime = this.form.data2 === ''?"":moment(this.form.data2).format('YYYY-MM-DD')
        var _startTime = new Date(this.form.data1).getTime()
        var _endTime = new Date(this.form.data2).getTime()
        _endTime = isNaN(_endTime) ? 0 : _endTime
        _startTime = isNaN(_startTime) ? 0 : _startTime
        if(_startTime!="" &&_endTime!=""&&_endTime<_startTime){
              this.$message({
                type: 'warning',
                message: '开始日期不能大于结束日期'
              })
              return
        }

        // if (_endTime > 1 && _startTime <= 1) {
        //     this.$message({
        //       type: 'warning',
        //       message: '开始日期不能为空'
        //     })
        //     return
        //   } else if (_endTime < 0) {
        //     this.$message({
        //       type: 'warning',
        //       message: '结束日期不能为空'
        //     })
        //     return
        //   } else {
        //     if(_endTime<_startTime){
        //       this.$message({
        //         type: 'warning',
        //         message: '开始日期不能大于结束日期'
        //       })
        //       return
        //     }
        //   }
      // var startTime, endTime
      // if (this.form.data1 === '' && this.form.data2 === '') {
      //   startTime = null
      //   endTime = null
      // } else {
      //   startTime = this.form.data1.toString().length>0?moment(this.form.data1).format('YYYY-MM-DD'):''
      //   endTime = this.form.data2.toString().length>0?moment(this.form.data2).format('YYYY-MM-DD'):''
      // }
      this.loading2 = true
      // 根据用户选择不同状态进行数据的筛选
      var radio = this.checkList.toString()
      request
        .post(host + 'beepartner/admin/Bike/findBike')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'startOnlineTime': startTime,
          'endOnlineTime': endTime,
          'bikeState': radio,
          'keyName': this.terminalNumber,
          // 'cityCode': this.activeName === '已分配'?$('.citys span.active').attr('myId'):'',
          'cityCode': this.activeName === '已分配'?this.cityId:'',
          'cityPartnerId':this.joinPartner,
          'joinMode':this.joinMode,
          'type': type
        })
        .end((error, res) => {
          if (error) {
            this.loading2 = false
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            this.loading2 = false
            var data = (JSON.parse(res.text)).data
            var newData = this.tableDataDel(data)
            this.totalItems = Number(JSON.parse(res.text).totalItems)
            var totalPage = Number(JSON.parse(res.text).totalPage)
            if (totalPage > 1) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }
            this.tableData = newData
          }
        })
    },
    // // 通过点击城市查询
    // handleClick (e) {
    //   this.currentPage = 1
    //   var elems = siblings(e.target)
    //   for (var i = 0; i < elems.length; i++) {
    //     elems[i].setAttribute('class', '')
    //   }
    //   e.target.setAttribute('class', 'active')
    //   /**
    //    * 根据不同的加盟城市，来展示不同的数据
    //    * */
    //   // 清空查询信息,
    //    this.form.data1 = ''
    //    this.form.data2 = ''
    //    this.form.radio = ''
    //    this.checkList = []
    //    this.terminalNumber = ''

    //   // var radio = this.checkList.toString()
      
  
    //   this.loading2 = true
    //   request
    //     .post(host + 'beepartner/admin/Bike/findBike')
    //     .withCredentials()
    //     .set({
    //       'content-type': 'application/x-www-form-urlencoded'
    //     })
    //     .send({
    //       'type': 0,
    //       'cityCode': this.cityId,
    //       'cityPartnerId':thhis.joinPartner,
    //       // 'cityCode': $('.citys span.active').attr('myId'),
    //       // 'startOnlineTime': this.form.data1 === ''?'':moment(this.form.data1).format('YYYY-MM-DD'),
    //       // 'endOnlineTime': this.form.data2 === ''?'':moment(this.form.data2).format('YYYY-MM-DD'),
    //       // 'bikeState': radio,
    //       // 'keyName': this.terminalNumber,
    //       'startOnlineTime': '',
    //       'endOnlineTime':'',
    //       'bikeState': '',
    //       'keyName': '',

    //     })
    //     .end((error, res) => {
    //       if (error) {
    //         this.loading2 = false
    //         console.log('error:', error)
    //       } else {
    //         this.checkLogin(res)
    //         this.loading2 = false
    //         var totalPage = Number(JSON.parse(res.text).totalPage)
    //         var data = (JSON.parse(res.text)).data
    //         if (totalPage > 1) {
    //           this.pageShow = true
    //         } else {
    //           this.pageShow = false
    //         }     
    //         this.totalItems = Number(JSON.parse(res.text).totalItems)
    //         var newData = this.tableDataDel(data)
    //         this.tableData = newData
    //       }
    //     })
    // },
    getTabName (tab, event) {
      // 切换tab标签时恢复默认查询标记
      this.isSearch = false

      this.terminalNumber = ''
      this.form.data1 = ''
      this.form.data2 = ''
      this.checkList = []

      //切换tab栏清空数据
      this.joinMode = '0'
      this.joinPartner = '0'
      this.cityId = '0'
      this.partnerLists = []
      this.citys = []


      if (this.activeName === '未分配') {
        this.getDateByTabName('1')

      } else {
        this.getDateByTabName('0')
      }
    },
    getDateByTabName (type) {
      this.currentPage = 1
      this.loading2 = true

      
      var radio = this.checkList.toString()
      request
        .post(host + 'beepartner/admin/Bike/findBike')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'type': type,
          'cityCode': this.activeName === '已分配'?this.cityId:'',
          'startOnlineTime': this.form.data1 === ''?'':moment(this.form.data1).format('YYYY-MM-DD'),
          'endOnlineTime': this.form.data2 === ''?'':moment(this.form.data2).format('YYYY-MM-DD'),
          'bikeState': radio,
          'keyName': this.terminalNumber,
          'cityPartnerId':this.joinPartner,
          'joinMode':this.joinMode
        })
        .end((error, res) => {
          if (error) {
            this.loading2 = false
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            var data = (JSON.parse(res.text)).data
            var totalPage = Number(JSON.parse(res.text).totalPage)
            this.totalItems = Number(JSON.parse(res.text).totalItems)
            var newData = this.tableDataDel(data)
            if (totalPage > 1) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }            
            this.tableData = newData
            this.loading2 = false
          }
        })
    },
    tableDataDel (arr) {
      var arrDeled = []
      if(arr.length>0){
         for (var i = 0; i < arr.length; i++) {
        var obj = {}
        obj.bikeCode = arr[i].code
        obj.boxCode = arr[i].boxCode
        obj.cityName = arr[i].cityName
        obj.onlineTime = arr[i].onlineTimeStr
        obj.stateName = arr[i].stateName
        obj.generationsName = arr[i].generationsName

        arrDeled.push(obj)
      }
      }
     

      return arrDeled
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
            this.checkLogin(res)
          }
        })
    },
    inputChange () {
      if (this.form.data1 === '' && this.form.data2 === '' && this.terminalNumber === ''&&this.checkList.length===0) {
          // 关闭查询标记
          this.isSearch = false

          var startTime, endTime, type
          if (this.form.data1 === '' || this.form.data2 === '') {
            startTime = ''
            endTime = ''
          } else {
            startTime = moment(this.form.data1).format('YYYY-MM-DD')
            endTime = moment(this.form.data2).format('YYYY-MM-DD')
          }

          if (this.activeName === '未分配') {
            type = 1
          } else {
            type = 0
          }

          var radio = this.checkList.toString()
          request
              .post(host + 'beepartner/admin/Bike/findBike')
              .withCredentials()
              .set({
                'content-type': 'application/x-www-form-urlencoded'
              })
              .send({
                'startOnlineTime': startTime,
                'endOnlineTime': endTime,
                'bikeState': radio,
                'keyName': this.terminalNumber,
                'cityCode': this.activeName === '已分配'?this.cityId:'',
                'type': type,
                'cityPartnerId':this.cityPartnerId,
                'joinMode':this.joinMode
              })
              .end((error, res) => {
                if (error) {
                  console.log('error:', error)
                } else {
                  this.loading2 = false
                  var data = (JSON.parse(res.text)).data
                  var totalPage = Number(JSON.parse(res.text).totalPage)
                  this.totalItems = Number(JSON.parse(res.text).totalItems)
                  var newData = this.tableDataDel(data)
                  this.tableData = newData
                  if (totalPage > 1) {
                    this.pageShow = true
                  } else {
                    this.pageShow = false
                  }
                }
              })
      } else {
        return
      }
    },
    checkLogin (res) {
      if (JSON.parse(res.text).message === '用户登录超时') {
        this.$router.push('/login')
      }
    }
  },
  watch: {
    // 'joinMode':'searchByTimeline',
    'cityId':'searchByTimeline',
    // 'joinPartner':'searchByTimeline',
    'checkList': 'searchThroughCheckList',
    "form.data1": {
      handler: function (val, oldVal) {
        console.log(val)
        if(val===undefined){
           if (this.activeName === '未分配') {
            this.form.data1 = ''
            //this.getDateByTabName('1')
          } else {
            //this.getDateByTabName('0')
          }
        }
        
        return;
        if (val.toString().length === 0 && this.form.data2.toString().length === 0 && this.terminalNumber.length === 0 && this.checkList.length === 0) {
          if (this.activeName === '未分配') {
            this.getDateByTabName('1')
          } else {
            this.getDateByTabName('0')
          }
        }
        var startTime = new Date(val).getTime()
        var endTime = new Date(this.form.data2).getTime()
        endTime = isNaN(endTime) ? 0 : endTime
        // if ((startTime > endTime) && endTime.toString().length > 1) {
        //   this.$message({
        //     type: 'warning',
        //     message: '开始日期不能大于结束日期'
        //   })
        // } else if ((startTime > endTime) && endTime.toString().length === 1) {
        //   // this.$message({
        //   //   type: 'warning',
        //   //   message: '请输入结束日期'
        //   // })
        // } else {
        //   return
        // }
      },
      deep: true
    },
    "form.data2": {
      handler: function (val, oldVal) {
        console.log('val', val)

        if(val===undefined){
            this.form.data2 = ''
           if (this.activeName === '未分配') {
            //this.getDateByTabName('1')
          } else {
            //this.getDateByTabName('0')
          }
        }
        
        return;
        if (val.toString().length === 0 && this.form.data1.toString().length === 0 && this.terminalNumber.length === 0 && this.checkList.length === 0) {
          if (this.activeName === '未分配') {
            this.getDateByTabName('1')
          } else {
            this.getDateByTabName('0')
          }
        }
        var endTime = new Date(val).getTime()
        var startTime = new Date(this.form.data1).getTime()
        startTime = isNaN(startTime) ? 0 : startTime
        // if ((endTime < startTime) && startTime.toString().length > 1) {
        //   this.$message({
        //     type: 'warning',
        //     message: '开始日期不能大于结束日期'
        //   })
        // } else if ((endTime > startTime) && startTime.toString().length === 1) {
        //   this.$message({
        //     type: 'warning',
        //     message: '请选择开始日期'
        //   })
        // } else {
        //   return
        // }
      },
      deep: true
    }
  }
}
</script>
<style>
  div.selectPlace_carManage {
    margin-top: 8px;
    margin-bottom: 10px;
    padding-left: 10px;
  }

  div.selectPlace_carManage address {
    font-style: normal;
    display: inline;
    font-size: 14px;
    margin-right: 8px;
    margin-left: -70px;
  }

  div.selectPlace_carManage div.citys {
   /*display: inline-block;*/
    vertical-align: top;
    /* width: 900px; */
    margin-top: -6px;
  }

  div.selectPlace_carManage span {
    cursor: pointer;
    font-size: 14px;
    display: inline-block;
    padding: 5px;
    border: 1px solid transparent;
  }

  div.selectPlace_carManage span.active {
    border: 1px solid orange;
    border-radius: 4px;
  }

    /*  加盟端样式  */

  .carManager_content {
    background: #faebd7;
    padding: 12px 30px 6px 20px;
    margin-bottom: 20px;
    /* border: 1px solid #e7ecf1; */
  }

  div.carManager div.queryCarInfo {
    /* background: #f3f0f0;
    padding: 10px 10px 0 10px; */
    margin-top:5px;
  }

  div.carManager div.queryCarInfo div.el-form-item {
    margin-bottom: 10px;
  }
  div.carManager div.queryCarInfo div.el-form-item  span.labelAlign{
    float:left;
    width: 68px;
    display: block;
    text-align: right;
    margin-right: 10px;
    font-size: 14px;
    color:#555;
  }
  span.division{
  font-size: 14px;
      color: #555;
      width: 32px;
      display: inline-block;
      text-align: center;
    }
  div.filtercar{display: inline-block;}
  div.line {
    margin-left: 0px;
  }

  div.el-input {
    width: 200px;
  }
  div.carManager div.el-tabs.el-tabs--border-card div.el-tabs__content {
      padding-bottom: 20px;
  }
  div.el-tabs.el-tabs--border-card div.el-tabs__content {
      padding-bottom: 20px;
  }
  div.showCarInfo {
      padding: 20px 0 10px 0px;
      background: #fff;
      /* border: 1px solid #e7ecf1; */
      /* border-bottom: none; */
    }

  div#carManager_page {
      padding: 4px 10px 0 22px;
      /* padding-bottom: 100px; */
      background: #fff;
      border: 1px solid #e7ecf1;
      border-top: none;
      min-height: 304px;
  }

  .carMan_bar {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-color: #fff;
      width: 427px;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #ddd;
      box-sizing: border-box;
      color: #1f2d3d;
      font-size: inherit;
      height: 36px;
      line-height: 1;
      outline: 0;
      padding: 3px 10px;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }

  .el-pagination {
    white-space: nowrap;
    padding: 2px 5px;
    margin-top: 10px;
    color: #48576a;
    margin-left: -5px;
    border: none;
    background: #fff;
  }

  .my_btn {
      width: 80px;
      float: right;
      height: 36px;
      line-height: 11px;
      color: #fff;
      font-size: 14px;
      /*margin-top: 10px;*/
      outline: none;
      border: none;
      border-radius: 4px; 
      cursor: pointer;
      background: rgba(52,52,67, 0.8);
  }

  .my_btn:hover {
      background: rgba(52,52,67, 0.9);
      color: #fff !important;
  }

  .el-input__inner {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    color: #1f2d3d;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }

  .el-input__inner::-webkit-input-placeholder {
    color: #ddd;
  }

  .el-date-table td.current:not(.disabled), .el-date-table td.end-date, .el-date-table td.start-date {
    background: black !important;
    color: #fff !important;
  }

  .el-input__inner:hover {
    border: 1px solid #bbb;
  } 

  .el-checkbox__inner {
    border-color: #ddd !important;
  }

  .el-checkbox__inner:hover {
    border-color: #ddd !important;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #444;
    border-color: #888;
    color: #fff;
  }
  div.carManager .el-form-item__content .el-input input.el-input__inner{width:194px;}

</style>
