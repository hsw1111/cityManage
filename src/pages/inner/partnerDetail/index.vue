<template>
  <div class="carUseDetail">
    <div class="detailTitle">
      <h3>加盟商详情</h3>
    </div>
    <!-- 企业加盟 -->
    <el-row v-if="joinTarget=='1'">
      
      <el-col :span="16">
        <table>
          <tbody>
            <tr>
              <td class="top">
                <span class="prex">加盟商编号：</span>{{franchiseeDetail.cityPartnerId}}</td>
              <td class="top">
                <span class="prex">企业名称：</span><span>{{franchiseeDetail.companyName}}</span></td>
            </tr>
            <tr>
              <td class="top">
                <span class="prex">营业执注册号：</span>{{franchiseeDetail.businessLicense}}</td>
              <td class="top">
                <span class="prex">通讯地址：</span>{{franchiseeDetail.address}}</td>
            </tr>
            <tr>
               <td style="width:350px">
                <span class="prex" style="margin-right:0">加盟区域：</span>
                    <el-select v-model="cityId" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
                </td>
            </tr>
            <tr>
              <td>
                <span class="prex">加盟日期：</span>{{relationJoinTime}}</td>
              <td>
                <span class="prex">认购车辆：</span>{{new Number(relationDatas.subscriptionNum).thousand()}}辆(已分配 :<span class="num">{{new Number(relationBikeNum).thousand()}}</span>辆)</td>
            </tr>
            <!-- 独家 -->
            <tr v-if="relationDatas.joinMode=='1'">
              <td>
                <span class="prex">加盟资金：</span>{{new Number(relationDatas.subscriptionMoney).thousandFormat() + '元'}}</td>
              <td>
                <span class="prex">结算周期：</span>{{relationDatas.wType=='0'?"每月":(relationDatas.wType=='1'?"每周":relationDatas.circleDays+'天')}}
              </td>
            </tr>
            <tr v-if="relationDatas.joinMode=='1'">
              <td>
                <span class="prex">授权费率：</span>{{new Number(relationDatas.licenseFeeRate).toFixed(1)+"%"}}</td>
              <td>
                <span class="prex">首次结算日期：</span>{{relationFirstDealDate}}</td>
            </tr>
            <tr v-if="relationDatas.joinMode=='1'">
              <td>
                <span class="prex">加盟模式：</span>{{relationDatas.joinMode=='1'?'独家':'非独家'}}
              </td>
            </tr>
            <!-- 非独家 -->
            <tr v-if="relationDatas.joinMode=='2'">
            <td>
              <!-- <span class="prex">加盟资金：</span>￥{{new Number(relationSubscriptionMoney).thousandFormat() + '元'}} -->
              <span class="prex">加盟资金：</span>{{new Number(relationDatas.subscriptionMoney).thousandFormat() + '元'}}
            </td>
            <td>
              <span class="prex">结算周期：</span>{{settleDaysData.length>2?("每月"+ settleDaysData.split(",")[0]+"号、"+settleDaysData.split(",")[1]+"号"):("每月"+settleDaysData+"号")}}
            </td>

          </tr>
             <tr v-if="relationDatas.joinMode=='2'">
              <td>
                <span class="prex">运营管理费：</span>{{new Number(relationDatas.manageFee).thousandFormat()}}元/车.天</td>
              <td>
                <span class="prex">首次结算日期：</span>{{relationFirstDealDate}}</td>
            </tr>
            <tr v-if="relationDatas.joinMode=='2'">
              <td>
                <span class="prex">后期分成比例：</span>{{new Number(relationDatas.divisionPercent).toFixed(1) + '%'}}</td>
              <td>
                <span class="prex">加盟模式：</span>{{relationDatas.joinMode=="1"?'独家':'非独家'}}</td>
              
            </tr>
          </tbody>
        </table>
      </el-col>
      <el-col :span="6" class="battery">
        <ul style="padding-left:0">
          <li>
            <img :src="imgUrl" alt=" ">
          </li>
        </ul>
      </el-col>
    </el-row>

    <!-- 个人加盟 -->
    <el-row v-else>
      <el-col :span="16">
        <table>
          <tbody>
            <tr>
              <td>
                <span class="prex">加盟商编号：</span>{{franchiseeDetail.cityPartnerId}}</td>
              <td>
                <span class="prex">姓名：</span>{{franchiseeDetail.conName}}</td>
            </tr>
            <tr>
              <td>
                <span class="prex">证件类别：</span>{{franchiseeDetail.conCardType=="1"?'护照':'身份证'}}</td>
              <td>
                <span class="prex">证件号码：</span>{{franchiseeDetail.conIdCard}}</td>
            </tr>
             <tr>
              <td>
                <span class="prex">手机号：</span>{{franchiseeDetail.conPhone}}</td>
              <td>
                <span class="prex">邮箱：</span>{{franchiseeDetail.conEmail}}</td>
            </tr>
             <tr>
              <td class="top">
                <span class="prex">通讯地址：</span><span style="width:300px;float:left">{{franchiseeDetail.address}}</span></td>
            </tr>
            <tr>
               <td>
                <span class="prex" style="margin-right:0">加盟区域：</span>
                    <el-select v-model="cityId" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
                </td>
            </tr>
            <tr>
              <td>
                <span class="prex">加盟日期：</span>{{relationJoinTime}}</td>
              <td>
                <!-- <span class="prex">认购车辆：</span>{{new Number(relationSubscriptionNum).thousand()}}辆(已分配： <span class="num">{{franchiseeDetail.bikeNum}}</span>辆)</td> -->
                <span class="prex">认购车辆：</span>{{new Number(relationDatas.subscriptionNum).thousand()}}辆(已分配:<span class="num">{{new Number(relationBikeNum).thousand()}}</span>辆)</td>
            </tr>
            <tr>
              <td>
                <!-- <span class="prex">加盟资金：</span>￥{{new Number(relationSubscriptionMoney).thousandFormat() + '元'}} -->
                <span class="prex">加盟资金：</span>{{new Number(relationDatas.subscriptionMoney).thousandFormat() + '元'}}
              </td>
              <td>
                <span class="prex">结算周期：</span>{{settleDaysData.length > 2 ? ("每月" + settleDaysData.split(",")[0] + "号、" + settleDaysData.split(",")[1] + "号"):("每月"+ settleDaysData + "号")}}
              </td>

            </tr>
             <tr>
              <td>
                <span class="prex">运营管理费：</span>{{new Number(relationDatas.manageFee).thousandFormat()}}元/车.天</td>
              <td>
                <span class="prex">首次结算日期：</span>{{relationFirstDealDate}}</td>
            </tr>
            <tr>
              <td>
                <span class="prex">后期分成比例：</span>{{new Number(relationDatas.divisionPercent).toFixed(1) + '%'}}</td>
              <td>
                <span class="prex">加盟模式：</span>非独家</td>
              
            </tr>
          </tbody>
        </table>
      </el-col>
    </el-row> 
    
    <el-row class="record">
      <span class="export" style="cursor:pointer" v-show="activeName=='车辆明细'" @click="export_excel">导出到Excel</span>
      
      <el-tabs v-model="activeName" @tab-click="handleTabClick">        
        <el-tab-pane class="recodeTable" label="车辆明细" name="车辆明细">
          
          <el-table :data="carDetail" style="width: 100%" v-loading="loading2" element-loading-text="拼命加载中">
            <el-table-column prop="code" label="车辆号">
            </el-table-column>
            <el-table-column prop="boxCode" label="终端编号">
            </el-table-column>
            <el-table-column prop="generationsName" label="车辆型号">
            </el-table-column>
            <el-table-column prop="onlineTimeStr" label="上线日期">
            </el-table-column>
            <el-table-column prop="stateName" label="状态">
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="10" layout="prev, pager, next, jumper" :total="totalItems" v-show="pageShow">
          </el-pagination>
        </el-tab-pane>
        <!-- <el-tab-pane label="合伙人" name="second" class="recodeTable">
            <el-table
              :data="partnerData"
              stripe
              style="width: 100%">
              <el-table-column
                prop="name"
                label="姓名"
                >
              </el-table-column>
              <el-table-column
                prop="sex"
                label="性别"
                >
              </el-table-column>
              <el-table-column
                prop="idCard"
                label="证件号码">
              </el-table-column>
              <el-table-column
                prop="phoneNo"
                label="手机号">
              </el-table-column>
               <el-table-column
                prop="email"
                label="邮箱">
              </el-table-column>
              <el-table-column
                prop="email"
                label="认购车辆数">
              </el-table-column>
            </el-table>
          </el-tab-pane> -->
        <el-tab-pane label="结算记录" name="结算记录" class="recodeTable">
          <div class="total">
            <span>累计已结算：{{alreadyWidthDrawTimes}} 次</span>
            <span>累计获得收益：{{new Number(alreadyWidthDrawMoney).thousandFormat()}} 元</span>
          </div>
          <el-table :data="drawalData" style="width: 100%">
            <el-table-column prop="month" label="结算周期">
            </el-table-column>
            <el-table-column prop="money" label="结算金额">
              <template slot-scope="scope">
                {{new Number(scope.row.money).thousandFormat()}}
              </template>
            </el-table-column>
            <el-table-column prop="applyTimeS" label="申请时间">
            </el-table-column>
            <el-table-column prop="statusDes" label="状态">
            </el-table-column>
            <el-table-column prop="description" label="财务备注">
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="10" layout="prev, pager, next, jumper" :total="totalItems" v-show="pageShow">
          </el-pagination>
          <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage0"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="totalItems0"
            v-show="pageShow0"
            >
          </el-pagination> -->
        </el-tab-pane>
        <el-tab-pane label="联系人" name="联系人" class="recodeTable">
          <ul class='contact_ul'>
            <li>
              <span>姓名：</span>{{franchiseeDetail.userName}}</li>
            <li>
              <span>证件类别：</span>{{franchiseeDetail.cardType===0?'身份证':(franchiseeDetail.cardType==1?'护照':"")}}</li>
            <li>
              <span>证件号码：</span>{{franchiseeDetail.idCard}}</li>
            <li>
              <span>手机号：</span>{{franchiseeDetail.phone}}</li>
            <li>
              <span>邮箱：</span>{{franchiseeDetail.email}}</li>
            <li>
              <span>用户名：</span>{{franchiseeDetail.userId}}</li>
          </ul>
        </el-tab-pane>
      </el-tabs>
      	
    </el-row>
    
  </div>
</template>
<script>
// import $ from 'jquery'
import request from 'superagent'
import { host } from '../../../config/index'
import moment from 'moment'
import {isOwnEmpty,thousand,thousandFormat} from '../../../util/util.js'
export default {
  data: function () {
    return {
      alreadyWidthDrawTimes:"",
      alreadyWidthDrawMoney:"",
      relationDatas:'',
      realtionDatasJoinMode:"",
      relationJoinTime:'',
      relationFirstDealDate:'',
      relationSubscriptionNum:'',
      relationSubscriptionMoney:'',
      relationBikeNum:'',
      cityName:'',
      cityId:'',
      options:[],
      loading2: false,
      currentPage3: 1,
      totalItems: 1,
      pageShow: false,
      carDetail: [],
      drawalData: [],
      imgUrl: '',
      partnerData: [],
      franchiseeDetail: {},
      router: this.$route.query.carNum,
      car_infor_data: [],
      activeName: '车辆明细',
      joinTarget:this.$route.params.id.split('&')[2],
      currentPage0:1,
      totalItems0:'',
      settleDaysData:""
    }
  },
  methods: {
    export_excel () {
       var id = this.$route.params.id.split('&')[0]
       var cityPartnerId = this.$route.params.id.split('&')[1]
       if(this.carDetail.length==0){
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
            request
              .get(host + 'beepartner/admin/Bike/exportBikeDetail')
              .withCredentials()
              .set({
                'content-type': 'application/x-www-form-urlencoded'
              })
              .query({
                id:id,
                cityId:this.cityId,
                cityPartnerId:cityPartnerId
              })
              .end((err, res) => {
                if (err) {
                  console.log('err:' + err)
                } else {
                  this.checkLogin(res)
                  // 数据处理
                  // var list = JSON.parse(res.text).data || []
                  // if (list.length === 0) {
                  //   that.$message.error('当前查询没有信息，无法导出哦~');
                  //  that.$loading({customClass: 'loading_class'}).close()
                  // } else {
                  //   that.$loading({customClass: 'loading_class'}).close()
                  // console.log(res)
                  window.location.href = (res.body.data)
                  }
                // }
              })
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消'
        // })
      })
    },
    getWithdrawals(){
       var id = this.$route.params.id.split('&')[0]
      var cityPartnerId = this.$route.params.id.split('&')[1]
      var val = this.currentPage3
      request.post(host + 'beepartner/admin/withDraw/getWithdrawals')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'id': id,
            'cityPartnerId': cityPartnerId,
            cityId:this.cityId,
            'currentPage': val
          })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              this.checkLogin(res)
              this.loading2 = false
              var result = JSON.parse(res.text).data || []
              this.totalItems = Number(JSON.parse(res.text).totalItems)
              var totalPage = Number(JSON.parse(res.text).totalPage)
              // var newdrawalData = result.map((item)=>{
              //   return Object.assign({},item,{applyTime:moment(item.applyTime).format('YYYY-MM-DD HH:MM:SS')})
              // })
               this.	alreadyWidthDrawMoney = JSON.parse(res.text).cityPartner?JSON.parse(res.text).cityPartner.alreadyWidthDrawMoney:0
               this.alreadyWidthDrawTimes = JSON.parse(res.text).cityPartner?JSON.parse(res.text).cityPartner.alreadyWidthDrawTimes:0
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              this.drawalData = result
            }
          })
    },
    getRelationDataByCitId(){
       var cityPartnerId = this.$route.params.id.split('&')[1]
       this.currentPage3 = 1
       this.activeName = "车辆明细"
      request.post(host + 'beepartner/admin/cityPartner/queryBikeNum')
      .withCredentials()
      .set({
        'content-type': 'application/x-www-form-urlencoded'
      })
      .send({
        cityPartnerId,
        cityId:this.cityId
      })
      .end((error,res)=>{
        if(error){
          console.log(error)
        }else{
          var res = JSON.parse(res.text).data
          // console.log("queryBikeNum",res)
          if(!isOwnEmpty(res)){
            this.relationBikeNum = res.bikeNum
            // this.relationJoinTime  = res.joinTime
            this.relationSubscriptionMoney = res.subscriptionMoney
            this.relationSubscriptionNum = res.subscriptionNum
            this.divisionPercent  = res.divisionPercent
          }else{
            this.relationBikeNum = ''
            this.relationJoinTime  = ''
            this.relationSubscriptionMoney = ''
            this.relationSubscriptionNum = ''
          }
          
        }
      })
    },
    loadDetail(){},
    loadData(){
    var id = this.$route.params.id.split('&')[0]
    var cityPartnerId = this.$route.params.id.split('&')[1]
    request
      .post(host + 'beepartner/admin/cityPartner/getCityPartnerDetail')
      .withCredentials()
      .set({
        'content-type': 'application/x-www-form-urlencoded'
      })
      .send({
        'id': id,
         cityId:this.cityId,
        'cityPartnerId': cityPartnerId
      })
      .end((err, res) => {
        if (err) {
          //this.loading = false
          console.log('err:' + err)
        } else {
          this.checkLogin(res)
          var res = JSON.parse(res.text).data
          // this.franchiseeDetail = Object.assign({},res,{joinTime:moment(res.joinTime).format('YYYY年MM月DD号')})
          this.franchiseeDetail = res
          this.imgUrl = res.businessLicenseIconUrl
          // // 如果后台请求出错，设置基础默认值
          // if(res.resultCode!=1){
          //    this.relationDatas = {
          //      subscriptionNum:0,
          //      subscriptionMoney:0,
          //       licenseFeeRate:0,
          //       joinMode:this.joinTarget=='1'?'1':'2',
          //       settleDays:"",
          //       manageFee:0,
          //       wType:1,
          //       divisionPercent:0
          //    }
          //   return;
          // }
            for(var i = 0; i < res.areaList.length; i++){
              if(res.areaList[i].cityId==this.cityId){
                this.relationDatas = res.areaList[i]
                
                if(res.areaList[i].settleDays){
                  this.settleDaysData = res.areaList[i].settleDays
                }

                this.relationJoinTime = moment(this.relationDatas.joinTime).format('YYYY-MM-DD')
                this.relationFirstDealDate = moment(this.relationDatas.firstDealDate).format('YYYY-MM-DD')
              }
            }

          
          
        }
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage3 =  val
      var id = this.$route.params.id.split('&')[0]
      var cityPartnerId = this.$route.params.id.split('&')[1]
      if (this.activeName === '车辆明细') {
        this.loading2 = true
        request.post(host + 'beepartner/admin/cityPartner/getBikeDetail')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'id': id,
            cityId:this.cityId,
            'cityPartnerId': cityPartnerId,
            'currentPage': val
          })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              this.checkLogin(res)   
              this.loading2 = false
              var result = JSON.parse(res.text).data || []
              this.totalItems = Number(JSON.parse(res.text).totalItems)
              var totalPage = Number(JSON.parse(res.text).totalPage)
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              // var newCarDetail = result.map((item)=>{
              //   return Object.assign({},item,{onlineTime:moment(item.onlineTime).format('YYYY年MM月DD号')})
              // })
              this.carDetail = result
            }
          })
      } else if (this.activeName === '结算记录') {
        this.loading2 = true
        this.activeName = '结算记录'
        request.post(host + 'beepartner/admin/withDraw/getWithdrawals')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'id': id,
            'cityPartnerId': cityPartnerId,
            cityId:this.cityId,
            'currentPage': val
          })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              this.checkLogin(res)
              this.loading2 = false
              var result = JSON.parse(res.text).data || []
              this.totalItems = Number(JSON.parse(res.text).totalItems)
              var totalPage = Number(JSON.parse(res.text).totalPage)
              // var newdrawalData = result.map((item)=>{
              //   return Object.assign({},item,{applyTime:moment(item.applyTime).format('YYYY-MM-DD HH:MM:SS')})
              // })
               this.	alreadyWidthDrawMoney = JSON.parse(res.text).cityPartner.alreadyWidthDrawMoney
               this.alreadyWidthDrawTimes = JSON.parse(res.text).cityPartner.alreadyWidthDrawTimes
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              this.drawalData = result
            }
          })
      } else {
        this.pageShow = false
        this.activeName = '联系人'
        return false
      }
    },
    handleTabClick(tab) {
      this.currentPage3 = 1
      this.pageShow = false
      var id = this.$route.params.id.split('&')[0]
      var cityPartnerId = this.$route.params.id.split('&')[1]
      if (tab.label === '车辆明细') {
        this.getBikeDetail()
      } else if (tab.label === '结算记录') {
        this.activeName = '结算记录'
        request.post(host + 'beepartner/admin/withDraw/getWithdrawals')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'id': id,
             cityId:this.cityId,
            'cityPartnerId': cityPartnerId
          })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              this.checkLogin(res)
              var result = JSON.parse(res.text).data || []
              this.totalItems = Number(JSON.parse(res.text).totalItems)
              var totalPage = Number(JSON.parse(res.text).totalPage)
              // var newdrawalData = result.map((item)=>{
              //   return Object.assign({},item,{applyTime:moment(item.applyTime).format('YYYY-MM-DD HH:MM:SS')})
              // })
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              this.drawalData = result
            }
            this.	alreadyWidthDrawMoney = JSON.parse(res.text).cityPartner?JSON.parse(res.text).cityPartner.alreadyWidthDrawMoney:0
            this.alreadyWidthDrawTimes = JSON.parse(res.text).cityPartner?JSON.parse(res.text).cityPartner.alreadyWidthDrawTimes:0
            // console.log(JSON.parse(res.text))
          })
      } else {
        this.pageShow = false
        this.activeName = '联系人'
        return false
      }
    },
    getBikeDetail() {
      var id = this.$route.params.id.split('&')[0]
      var cityPartnerId = this.$route.params.id.split('&')[1]
      request.post(host + 'beepartner/admin/cityPartner/getBikeDetail')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'id': id,
           cityId:this.cityId,
          'cityPartnerId': cityPartnerId
        })
        .end((err, res) => {
          if (err) {
            console.log(err)
          } else {
            this.checkLogin(res)
            var result = JSON.parse(res.text).data || []
            this.totalItems = Number(JSON.parse(res.text).totalItems)
            var totalPage = Number(JSON.parse(res.text).totalPage)
            if (totalPage > 1) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }
            // var newCarDetail = result.map((item)=>{
            //   return Object.assign({},item,{onlineTime:moment(item.onlineTime).format('YYYY年MM月DD号')})
            // })
            this.carDetail = result
          }
        })
    },
    checkLogin (res) {
      if (JSON.parse(res.text).message === '用户登录超时') {
        //this.$router.push('/login')
      }
    }
  },
    created() {
      // console.log(this.$route.params)
      var cityPartnerId = this.$route.params.id.split('&')[1]
      
      // 初始化调用查询可加盟城市的接口,动态渲染数据
    request.post(host + 'beepartner/admin/city/findCity')
    .withCredentials()
    .set({
      "content-type": "application/x-www-form-urlencoded"
    })
    .send({
      cityPartnerId:cityPartnerId
    })
    .end((error,res)=>{
      if(error){
        console.log(error)
      }else{
        var result = JSON.parse(res.text).data
        if(Object.prototype.toString.call(result) !== '[object Array]'){
          return;
        }
        if(result.length==0){
          this.options = [];
          return;
        }
        

        this.options = result.map((item)=>{
          return {
            value:item.cityId,
            label:item.cityName
          }
        })
        this.cityId = this.options[0].value
        this.options.map((item)=>{
          if(item.value===this.cityId){
            this.cityName = item.label
          }
        })
      }
    })
    this.getBikeDetail()
  },
  mounted: function () {
    //this.loading = true
    document.title = '加盟商详情'
  //  this.loadData()
    /**
     * 获取车辆详情
     */
    this.getBikeDetail()
  },
  watch:{
    'cityId':{
      handler:function(n,o){
        this.options.map((item)=>{
          if(item.value=== n){
            this.cityName = item.label
          }
        })
        this.loadData()
        
        this.getRelationDataByCitId()
        // this.getWithdrawals()
        this.getBikeDetail()
      },
      deep:true,
    },
  }
  
}
</script>
<style scoped>

.export {
     margin-top: 20px;
    color: #ff9900;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    position: absolute;
    left: 1120px;
    /* top: 25px; */
    z-index: 2000;
}
.num {
  color:orange;
  padding:5px;
}
.total {
  width: 100%;
  height: 40px;
  background: #fcfcd3;
  margin-bottom: 15px;
  padding-left:15px;
  font-size:14px;
  color:#555;
}
.total span {
  line-height:40px;
  margin-right:60px;
}
div.carUseDetail {
  background: #fff;
  margin: 0 auto;
  border: 1px solid #e7ecf1;
  width: 1200px;
}
.record {
 margin-bottom:15px;
}
div.carUseDetail table {
  border-collapse: collapse;
  width: 100%;
  
}

div.carUseDetail table tr td {
  padding: 5px 10px;
}

div.carUseDetail table tr td span.prex {
  display: inline-block;
  width: 100px;
  text-align: right;
  color: #bdb6b6;
  font-size: 14px;
  margin-right: 8px;
}
div.carUseDetail table tr td.top span.prex {
  height: 25px;
  line-height:25px;
  float: left;
}

div.carUseDetail div.detailTitle h3 {
  line-height: 30px;
  background: #555;
  color: #fff;
  margin-bottom: 20px;
  padding: 10px;
}

div.carUseDetail div.battery {
  float: right;
}

div.carUseDetail div.battery ul li {
  list-style-type: none;
  margin-bottom: 10px;
  margin-right: 20px;
  width: 230px;
  height: 150px;
}

div.carUseDetail div.battery ul li img {
  display: block;
  width: 100%;
  height:100%;
}

div.carUseDetail div.record {
  margin-top: 30px;
  padding: 0 4px 0 4px;
  background: #fff;
}

div.carUseDetail div.recodeTable table {
  border-collapse: collapse;
  width: 100%;
}

div.carUseDetail div.recodeTable table thead tr th {
  font-weight: normal;
  text-align: left;
  border-bottom: 1px solid #afa7a7;
  padding: 5px 10px;
}

div.carUseDetail div.recodeTable table tbody tr td {
  border: none;
  border-bottom: 1px dotted #afa7a7;
  padding: 10px;
  color: #555;
}

div#carUseDetail_page {
  margin-top: 50px;
  min-height: 230px;
}

.contact_ul {
  width: 300px;
  height: 200px;
  margin-left: 20px;
  margin-top: 10px;
  list-style: none;
}

.contact_ul li {
  height: 30px;
  line-height: 30px;
  color: #555;
}

.contact_ul li span {
  height: 30px;
  width: 80px;
  display: inline-block;
  margin-right: 6px;
  text-align: right;
  color: #bdb6b6;
  line-height: 30px;
}

div.el-pagination {
  margin-left: 1px;
  padding-left: 0;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
