<template>
  <div class="vehicleBikeAlone">
    <div id='distribution_header'>
      <h3>分配车辆
        <!-- <p @click="closeWindow" style="float: right; font-size: 12px; cursor: pointer;line-height:12px">关闭</p> -->
      </h3>
      <table class="franchiseeDetail">
        <tbody>
          <tr>
            <td>
              <span>加盟商编号：</span>{{franchiseeDetail.cityPartnerId}}</td>
            <td>
              <span>企业名称/个人姓名：</span>{{franchiseeDetail.joinTarget=='1'?franchiseeDetail.companyName:franchiseeDetail.conName}}</td>
          </tr>
           <tr>
            <td>
              <span>加盟区域：</span> 
              <el-select v-model="cityId" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  style="position:relative;z-index:100001">
                </el-option>
              </el-select></td>
              

          </tr>
          <tr>
            <td>
              <span>认购车辆：</span>{{new Number(relationSubscriptionNum).thousand()}}</td>
            <td>
              <span>拥有车辆：</span>{{new Number(relationBikeNum).thousand()}}</td>
           
          </tr>
        </tbody>
      </table>
    </div>

    <div id='distribution_selectBase'>
      <div id='distribution_table'>
        <div class='distribution_table_search'>
          <h5>【{{cityName}}】待分配的车辆</h5>
          <div id="bike_state">

                <span class="labelAlign">车辆状态:</span>
                <el-checkbox-group v-model="checkList">
                    <el-checkbox label="4" style="color:#555">待出租</el-checkbox>
                    <el-checkbox label="5" style="color:#555">已预订</el-checkbox>
                    <el-checkbox label="6" style="color:#555">已出租</el-checkbox>
                    <el-checkbox label="7" style="color:#555">维护中</el-checkbox>
                </el-checkbox-group>
                <div style="clear:both"></div>
          </div>
          <!-- <input type="text" v-on:blur='inputBlurFun' ref="val" placeholder="车辆号\终端号" /> -->
          <div id="search_tips">
            <input type="text"  ref="val" placeholder="车辆号\终端号" />
            <!-- <span>
              <i class='el-icon-search'></i>
            </span> -->
            <input type="text" v-model="choseBikes" style="margin-left: 20px;margin-right:20px" placeholder="需要分配的车辆数量" />
            <!-- <span>
              <i></i>
            </span> -->
              <!-- <el-radio class="time"  v-model="time" label="1" value="1">24小时有订单</el-radio>
              <el-radio  class="time" v-model="time" label="2" value="2">48小时有订单</el-radio> -->
        
              <el-select class="time_select" v-model="time">
                <!-- <el-option label="所有时间" value=""></el-option> -->
                <el-option label="全部" value=""></el-option>
                <el-option label="24小时有订单" value="1" class="opt"></el-option>
                <el-option label="48小时有订单" value="2"></el-option>
              </el-select>


             
            
            <button @click="findBikeByInfo" class="distribution_btn">查询</button>
            <div style="clear:both"></div>
          </div>
          <div class="total_bike">共有记录 {{totalItems}} 辆</div>
          <!-- <span class="all_chose" @click="choseAllBike">全选</span> -->
          
        </div>

        <div class='table'>
          <el-table @select="handleSelectChange" @select-all="handleSelectionAll" v-loading="loading2" element-loading-text="拼命加载中" ref="multipleTable" :data="tableData_distribution" border tooltip-effect="dark" style="width: 100%; font-size: 13px;" class="this_loading">
            <el-table-column type="selection" min-width="55">
            </el-table-column>
            <el-table-column prop="code" label="车牌号" min-width="80">
            </el-table-column>
            <el-table-column prop="boxCode" label="终端编号" min-width="120">
            </el-table-column>
            <el-table-column prop="generationsName" label="车辆型号" min-width="80">
            </el-table-column>
            <el-table-column prop="onlineTimeStr" label="上线日期" min-width="80">
            </el-table-column>
            <el-table-column prop="stateName" label="车辆状态" min-width="80">
            </el-table-column>
          </el-table>
        </div>
        <!-- <el-pagination v-show="pageShow" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="10" layout="prev, pager, next, jumper" :total="totalItems">
        </el-pagination> -->
      </div>

      <div id='right_hasbeen_distribution'>
        <h6>你选择的车辆:
          <span>共{{this.countAllotCars.length}}辆</span>
          <span @click="cleanCar">清空</span>
        </h6>
        <ul>
          <li :key="item" v-for="(item,index) of countAllotCars">{{item}}
            <span>
              <i class="iconfont" style="cursor: pointer" @click="removeCar(index)">&#xe60a;</i>
            </span>
          </li>
        </ul>
        <el-row class="allot" v-show="countAllotCars.length>0?true:false">
          <button @click="confimBikes" class="btn_bike">确定</button>
          <button class="btn_bike" @click="cleanCar">取消</button>
        </el-row>
      </div>

    </div>
  </div>
</template>

<style>
.time_select.el-select .el-input .el-input__icon {
  height: 30px;
  margin-top:5px;
}
.time_select.el-select .el-input {
  height:38px
}
.time_select .el-input__icon + .el-input__inner{
    height: 30px;
    margin-left: 0px;
}
.time_radio {
  width:18px;
  float:left;
}
.num_time {
  float:left
}
#bike_state {
  margin-left:5px
}
#bike_state span.labelAlign {
  float:left;
  margin-right:15px;
  font-size:14px;
  height: 24px;
  line-height:24px;
}
#search_tips  {
  margin-left:25px;
}
#search_tips .time {
  float: left;
  height: 43px;
  line-height: 43px;
  margin-left: 20px;
}
.total_bike {
    font-size: 14px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-top: 4px;
    float:left;
}
.all_chose {
  float: right;
  font-size: 14px;
  color: blue;
  margin-top: 10px;
  cursor:pointer;
}
.vehicleBikeAlone {
  background: #fff;
  margin: 0 auto;
  width: 1200px;
}

.btn_bike:nth-of-type(1) {
  width: 60px;
  height: 30px;
  outline: none;
  color: #fff;
  cursor: pointer;
  background: #f87e2b;
  border: none;
  border-radius: 4px;
}

.btn_bike:nth-of-type(1):hover {
  opacity: 0.9;
}

.btn_bike:nth-of-type(2) {
  width: 60px;
  cursor: pointer;
  height: 30px;
  outline: none;
  color: #1f2d3d;
  background: #fff;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
}

.btn_bike:nth-of-type(2):hover {
  color: #f87e2b;
  border: 1px solid #f87e2b;
}

div.allot {
  text-align: center;
  margin-top: 20px;
}

#distribution_header {
  min-height: 110px;
  display: block;
  background: #fff;
  border: 1px solid #e7ecf1;
  border-bottom: none;
  padding-bottom:20px
}

#distribution_header>h3 {
  line-height: 30px;
  background: #555;
  color: #fff;
  margin-bottom: 20px;
  padding: 10px
}

#distribution_header>h3 p:hover {
  color: #f2f2f2;
}

#distribution_header ul {
  list-style: none;
  font-size: 16px;
  display: block;
  width: 100%;
  padding: 4px;
  height: 40px;
}

#distribution_header ul li {
  float: left;
  margin-right: 120px;
}


/* #distribution_header ul:nth-of-type(2) {
  width: 400px;
  position: relative;
}

#distribution_header ul:nth-of-type(2) li {
  width: 100px;
  display: block;
}

#distribution_header ul:nth-of-type(2) li:nth-of-type(3) {
  position: absolute;
  left: 200px;
  top: 4px;
} */

#distribution_header ul:nth-of-type(2) li:nth-of-type(1) {
  margin-left: 12px;
}

#distribution_header ul:nth-of-type(2) li:nth-of-type(2) {
  margin-left: 27px;
}


/* ======  distribution_selectBase  ============*/

#distribution_selectBase {
  width: 100%;
  background: #f3f3f5;
  overflow: hidden;
  height: 600px;
}

#distribution_selectBase #distribution_table {
  width: 800px;
  float: left;
  padding: 10px 20px 0 20px;
  border: 1px solid #e7ecf1;
  border-right: none;
  background: #fff;
  overflow-y: scroll;
  box-sizing: border-box;
  height: 100%;
}
.distribution_table_search {
  margin-top:-10px;
}
.distribution_table_search>h5 {
  /* padding: 14px 0 14px 0; */
  width: 200px;
  height: 30px;
  line-height: 30px;
  /* float: left; */
  margin-top:15px
}

.distribution_table_search input {
  width: 150px;
  height: 28px;
  display: block;
  border-radius: 5px;
  border: 1px solid #ddd;
  text-indent: 10px;
  float: left;
  margin-top: 8px;
  margin-left: -20px;
  outline: none;
}

::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #bfcbd9;
}

:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #bfcbd9;
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #bfcbd9;
}

:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #bfcbd9;
}

.distribution_table_search input+span {
  width: 28px;
  height: 28px;
  line-height: 28px;
  display: block;
  border-radius: 0 5px 5px 0;
  border: 1px solid #ddd;
  border-left: none;
  float: left;
  margin-top: 14px;
  outline: none;
  color: #bfcbd9;
}

.distribution_table_search .el-icon-search:before {
  content: "\E61D";
  color: #ddd;
}

#right_hasbeen_distribution {
  background: #fff;
  border: 1px solid #e7ecf1;
  float: left;
  padding: 0 10px 0 10px;
  width: 400px;
  height: 100%;
  box-sizing: border-box;
}

#right_hasbeen_distribution ul span:hover {
  color: #777;
}

#right_hasbeen_distribution h6 {
  height: 70px;
  width: 100%;
  line-height: 70px;
  font-size:14px;
}

#right_hasbeen_distribution h6 span:nth-of-type(2) {
  float: right;
  color: blue;
  font-weight:400;
}

#right_hasbeen_distribution h6 span:nth-of-type(2):hover {
  cursor: pointer;
  text-decoration: underline;
}

#right_hasbeen_distribution ul {
  list-style: none;
  border-top: 1px solid #dfe6ec;
  max-height: 400px;
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}

#right_hasbeen_distribution ul li {
  list-style: none;
  height: 40px;
  width: 100%;
  line-height: 40px;
  font-size: 12px;
  padding-left: 20px;
  border-bottom: 1px solid #eee;
}

#right_hasbeen_distribution ul li span {
  float: right;
  width: 20px;
  height: 30px;
  margin-right: 25px;
}


table.franchiseeDetail {
  width: 100%;
  border-collapse: collapse;
}

table.franchiseeDetail tr {
  line-height: 40px;
}

table.franchiseeDetail tr td {
  border: 1px dotted #fff;
}

table.franchiseeDetail tr td span {
  text-align: right;
  width: 180px;
  display: inline-block;
  color: rgba(153, 153, 153, 1);
}


/*#distribution_selectBase #distribution_table*/


/*  ======= distribution_page ======*/

#distribution_page {
  /*padding: 4px 10px 0 20px;*/
  padding-bottom: 100px;
  margin-left: -8px;
  margin-top: 25px;
  background: #fff;
  min-height: 230px;
}

.el-pagination {
  margin-left: 0;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-left: 0;
  border-left: 0;
}

.distribution_btn {
  width: 80px;
  float: right;
  height: 30px;
  line-height: 11px;
  color: #fff;
  /* margin-top: 10px; */
  outline: none;
  border: none;
  border-radius: 4px;
  margin-top: 8px;
  margin-left: 20px;
  cursor: pointer;
  background: rgba(52, 52, 67, 0.8);
}

.distribution_btn:hover {
  opacity: 0.8;
}
.this_loading .el-loading-mask {
  z-index:3
}
</style>

<script>
// import $ from 'jquery'
import request from 'superagent'
import { host } from '../../../config/index'
import moment from 'moment'
import { mapActions, mapGetters } from "vuex"
import {isOwnEmpty} from '../../../util/util.js'
export default {
  data() {
    return {
      relationBikeNum:'',
      relationSubscriptionNum:'',
      cityName:'',
      cityId:'',
      options:[],
      selectCars: [],
      franchiseeDetail: {},
      currentPage3: 1,
      totalItems: 1,
      pageShow: false,
      loading2: false,
      tableData_distribution: [],
      multipleSelection: [],
      tempcar:[],
      countAllotCars: [],
      choseBikes: '',
      signForQuery: false,
      checkList:[],
      time:"",
      totalItems:""
    }
  },
   created() {
    
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
         this.loadDate()
      }
    })
   
  },
  methods: {
    // 通过加盟城市获取相关信息
    getRelationDataByCitId(){
      // 清空查询信息
        this.$refs.val.value = ""
        this.choseBikes = ""
        this.checkList = []
        this.time = ''
       var cityPartnerId = this.$route.params.id.split('&')[1]
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
            if(!isOwnEmpty(res)){
              this.relationBikeNum = res.bikeNum
              this.relationSubscriptionNum = res.subscriptionNum
            }else{
              this.relationBikeNum = ''
              this.relationSubscriptionNum = ''
            }
            
          }
        })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    cleanCar() {
      this.currentPage3 = 1
      this.loadDate()
      this.countAllotCars = []
      this.choseBikes = ''
    },
    closeWindow() {
      // this.$confirm('确定要关闭当前页面?', '温馨提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
        window.close()
      // }).catch(() => {

      // })
    },
    loadDate() {
      this.signForQuery = false
      var id = this.$route.params.id.split('&')[0]
      var cityPartnerId = this.$route.params.id.split('&')[1]
      this.loading2 = true
      request
        .post(host + 'beepartner/admin/cityPartner/getCityPartnerDetail')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'id': id,
          'cityPartnerId': cityPartnerId,
           cityId: this.cityId
        })
        .end((err, res) => {
          if (err) {
            this.loading2 = false
            console.log('err:' + err)
          } else {
            this.checkLogin(res)
            this.loading2 = false
            var res = JSON.parse(res.text).data
            // this.franchiseeDetail = Object.assign({},res,{joinTime:moment(res.joinTime).format('YYYY年MM月DD号')})
            this.franchiseeDetail = res
            
            // console.log('加盟商详情数据',res)

            this.loading2 = true
              request.post(host + 'beepartner/admin/cityPartner/getNotAllotBikes')
                .withCredentials()
                .set({
                  'content-type': 'application/x-www-form-urlencoded'
                })
                .send({
                  'type': 1,
                  cityId:this.cityId,
                  'choseBikes': this.choseBikes === '' ? 0 : this.choseBikes
                })
                .end((error, res) => {
                  if (error) {
                    this.loading2 = false
                    console.log(error)
                  } else {
                    this.getRelationDataByCitId()
                    this.checkLogin(res)
                    this.loading2 = false
                    var data = JSON.parse(res.text).data
                    // var newData = data.map((item)=>{
                    //   return Object.assign({},item,{onlineTime:moment(item.onlineTime).format('YYYY-MM-DD')})
                    // })
                    this.tableData_distribution = data||[]

                    var totalPage = Number(JSON.parse(res.text).totalPage)
                    if (totalPage > 1) {
                      this.pageShow = true
                    } else {
                      this.pageShow = false
                    }
                    this.totalItems = Number(JSON.parse(res.text).totalItems)
                  }
                })
          }
        })
    },
    removeCar(index) {
      var code = this.countAllotCars[index]
      var res = this.tempcar.filter((item)=>{
        return item.code==code
      })
       res.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      this.countAllotCars.splice(index, 1)
      
    },
    handleSelectChange(selection, row) {
      this.tempcar = selection
      if (this.countAllotCars.indexOf(row.code) === -1) {
        this.countAllotCars.push(row.code)
      } else {
        this.countAllotCars.splice(this.countAllotCars.indexOf(row.code), 1)
      }
      //new Set(this.countAllotCars)
    },
    handleSelectionAll(selection) {
      // console.log(selection)
      this.multipleSelection = selection;
      this.tempcar = [...this.multipleSelection];
      if(this.countAllotCars.length>0){
         selection.map((list)=>{
          this.countAllotCars.map((item)=>{
            if(list.code===item){
              return;
            }else{
            this.countAllotCars.push(list.code)
            }
          })
        })
      }else{
         selection.map((item)=>{
           this.countAllotCars.push(item.code)
         })
      }
      var es = this.countAllotCars.unique()
      this.countAllotCars = es;
     
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      var that = this;
      if (this.signForQuery = false) {
        this.loading2 = true
        request
          .post(host + 'beepartner/admin/Bike/findBike')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'type': 1,
            // 'cityCode': this.cityCode,
            'currentPage': val,
            cityId:this.cityId
          })
          .end((error, res) => {
            if (error) {
              this.loading2 = false
              console.log(error)
            } else {
              this.checkLogin(res)
              this.loading2 = false
              var data = JSON.parse(res.text).data
              this.tableData_distribution = data
              var totalPage = Number(JSON.parse(res.text).totalPage)
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              this.totalItems = Number(JSON.parse(res.text).totalItems)
            }
          })
      } else {
        this.loading2 = true
        request
          .post(host + 'beepartner/admin/cityPartner/getNotAllotBikes')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'currentPage': val,
            // 'cityCode': this.cityCode,
             cityId:this.cityId,
            'limitNum': this.choseBikes === '' ? 0 : this.choseBikes
          })
          .end((error, res) => {
            if (error) {
              this.loading2 = false
              console.log(error)
            } else {
              this.checkLogin(res)
              this.loading2 = false
              var data = JSON.parse(res.text).data
              var setArr = []
              this.countAllotCars.map((item) => {
                data.map((list) => {
                  if (item === list.code) {
                    setArr.push(list)
                  }
                })
              })
             setTimeout(function(){
                that.toggleSelection(setArr)
             },500)
              //this.toggleRowSelection(setArr)
              // var newData = data.map((item)=>{
              //   return Object.assign({},item,{onlineTime:moment(item.onlineTime).format('YYYY-MM-DD')})
              // })
              this.tableData_distribution = data
              var totalPage = Number(JSON.parse(res.text).totalPage)
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              this.totalItems = Number(JSON.parse(res.text).totalItems)
            }
          })
      }
    },
    checkLogin(res) {
      if (JSON.parse(res.text).message === '用户登录超时') {
        //this.$router.push('/login')
      }
    },
    inputBlurFun() {
      if (this.$refs.val.value !== '') {
        /**
         * 关闭查询标识
         */
        this.signForQuery = false
        this.loading2 = true
        request
          .post(host + 'beepartner/admin/cityPartner/getNotAllotBikes')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'type': 1,
            // 'cityCode': this.cityCode,
            cityId:this.cityId,
            'keyName': this.$refs.val.value
          })
          .end((error, res) => {
            if (error) {
              this.loading2 = false
              console.log(error)
            } else {
              this.checkLogin(res)
              this.loading2 = false
              /**
               * 关闭查询标识
               */
              this.signForQuery = false
              var data = JSON.parse(res.text).data
              this.tableData_distribution = data
              var totalPage = Number(JSON.parse(res.text).totalPage)
              // if (totalPage > 1) {
              //   this.pageShow = true
              // } else {
              //   this.pageShow = false
              // }
              this.totalItems = Number(JSON.parse(res.text).totalItems)
            }
          })
      } else {
        this.loading2 = true
        request
          .post(host + 'beepartner/admin/Bike/findBike')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'type': 1,
            // 'cityCode': this.cityCode,
            cityId:this.cityId
          })
          .end((error, res) => {
            if (error) {
              this.loading2 = false
              console.log(error)
            } else {
              this.checkLogin(res)
              this.loading2 = false
              var data = JSON.parse(res.text).data
              this.tableData_distribution = data
              var totalPage = Number(JSON.parse(res.text).totalPage)
              // if (totalPage > 1) {
              //   this.pageShow = true
              // } else {
              //   this.pageShow = false
              // }
              this.totalItems = Number(JSON.parse(res.text).totalItems)
            }
          })
      }
    },
    findBikeByInfo() {
      // 车辆状态
      var state = this.checkList.toString()
      this.currentPage3 = 1
      // if (this.choseBikes === '') {
      //   this.$message({
      //     message: '请输入要分配的车辆总数',
      //     type: 'warning'
      //   })
      // } else {
        this.signForQuery = true
        this.loading2 = true
        request
          .post(host + 'beepartner/admin/cityPartner/getNotAllotBikes')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            // 'cityCode': this.cityCode,
            cityId:this.cityId,
            'limitNum': this.choseBikes === '' ? 0 : this.choseBikes,
            bikeState:state,
            keyName:this.$refs.val.value,
            lastEndTime:this.time == ''? 0 : this.time
          })
          .end((error, res) => {
            if (error) {
              this.loading2 = false
              console.log(error)
            } else {
              this.checkLogin(res)
              this.loading2 = false
              var data = JSON.parse(res.text).data
              // var newData = data.map((item)=>{
              //   return Object.assign({},item,{onlineTime:moment(item.onlineTime).format('YYYY-MM-DD')})
              // })
              this.totalItems = JSON.parse(res.text).totalItems
              this.tableData_distribution = data
              var totalPage = Number(JSON.parse(res.text).totalPage)
              // if (totalPage > 1) {
              //   this.pageShow = true
              // } else {
              //   this.pageShow = false
              // }
              this.totalItems = Number(JSON.parse(res.text).totalItems)
            }
          })
      // }
    },
    confimBikes() {
      if (this.countAllotCars.length === 0) {
        this.$message({
          message: '当前没有已选的车辆',
          type: 'warning'
        })
      } else {
        request
          .post(host + 'beepartner/admin/cityPartner/allotBikes')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
             cityId:this.cityId,
            'id': this.$route.params.id.split('&')[0],
            'cityPartnerId': this.$route.params.id.split('&')[1],
            'bikes': this.countAllotCars.toString()
          })
          .end((error, res) => {
            if (error) {
              this.loading2 = false
              console.log(error)
            } else {
              this.checkLogin(res)
              if (JSON.parse(res.text).resultCode === 0) {
                this.$message({
                  message: '车辆分配成功',
                  type: 'success'
                })
              } else {
               this.$message.error(JSON.parse(res.text).message);
              }
              this.countAllotCars = []
              this.loadDate()
            }
          })
      }
    }
  },
  
  mounted() {
    document.title = '分配车辆'
    // this.loadDate()


  },
  watch: {
    'tempcar':{
      handler:function(val,oldVal){
        var res = []
        var arr2 = []
        if(oldVal.length==10){
            res = oldVal.map((item)=>{
              return item.code
            })
        }
      //  for(var i=0;i<res.length;i++){
      //    for(var j=0;j<this.countAllotCars.length;j++){
      //      console.log(this.countAllotCars);
      //       if(this.countAllotCars[j]==res[i]){
      //         this.countAllotCars.splice(j,1)
      //         j = j - 1;
      //       }
      //    }
      //  }
      
      },
      deep:true
    },
    // 'choseBikes': {
    //   handler: function() {
    //     if (this.choseBikes === '') {
    //       this.loadDate()
    //     }
    //   }
    // },
    'cityId':{
      handler:function(n,o){
        this.options.map((item)=>{
          if(item.value=== n){
            this.cityName = item.label
          }
        })
         this.loadDate()
         this.getRelationDataByCitId()
        //  this.findBikeByInfo()
      },
      deep:true,
    },
    'checkList':'findBikeByInfo',
    'time':'findBikeByInfo'
    // currentPage3:{
    //   handler:function(val,oldVal){
    //     if(this.cityCode.length>0){
    //       this.loading2 = true
    //       request.post(host + 'franchisee/franchiseeManager/getNotAllotBikes?page=' + val)
    //         .withCredentials()
    //         .set({
    //           'content-type': 'application/x-www-form-urlencoded'
    //         })
    //         .send({
    //           cityCode:this.cityCode
    //         })
    //         .end((error,res)=>{
    //           if(error){
    //             console.log(error)
    //             this.loading2 = false
    //           }else{
    //             this.loading2 = false
    //             var data = JSON.parse(res.text).list
    //             var newData = data.map((item)=>{
    //               return Object.assign({},item,{onlineTime:moment(item.onlineTime).format('YYYY-MM-DD')})
    //             })
    //             this.tableData_distribution = newData
    //             this.countAllotCars.forEach((row)=>{
    //               this.tableData_distribution.map((item,index)=>{
    //                 if(item.boxCode===row){
    //                    this.selectCars.push(row)
    //                 }
    //               })
    //             })
    //             var totalPage = JSON.parse(res.text).totalPage
    //             if(totalPage>1){
    //               this.pageShow = true
    //             }else{
    //               this.pageShow = false
    //             }
    //             this.totalItems = JSON.parse(res.text).totalItems
    //             //console.log(data)
    //           }
    //         })
    //     }
    //   },
    //   deep:true
    // }
  },
  updated(){
    
  }
}
</script>
