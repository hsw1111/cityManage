<template>
  <div class="settlementManager">
        <div class="settlementManager_head1">
            <el-row class="selectPlace">
<!-- 新增按加盟商查询 -->
              <p class="select_connect"  style="margin-left:8px">
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
                <!-- <div class="citys" style="margin-left: 80px;color:#555">
                  <address class="joinArea" style="margin-left: -57px;">加盟区域</address>
                  <span @click="handleClick" myId='0' class="active">全部地区</span>
                  <span @click="handleClick" :key='item.id' :myId='item.code' v-for="item in cityList">{{item.name}}</span>
                </div> -->
            </el-row>
        </div>
        <div class="settlementManager_head2">
            <el-row class="selectPlace">
                <div class="citys" style="margin-left: 67px;color:#555">
                    <address class="joinArea" style="margin-left: -57px;margin-right: 1px;">结算单状态</address>
                    <span :myStatus='0' @click="handleTypeClick">全部状态</span>
                    <span :myStatus='1' @click="handleTypeClick">待确认</span>
                    <span :myStatus='2' @click="handleTypeClick" class="active">待结算</span>
                    <span :myStatus='3' @click="handleTypeClick">已结算</span>
                </div>
            </el-row>
        </div>
        <div id="settlementManager_table">
        <el-row class="table">
          <el-table 
                :data="tableData"
                v-loading="loading2"
                element-loading-text="拼命加载中"
                style="width: 100% font-size:13px; color: #6c6c6c;">
            <el-table-column prop="applyTimeStr" label="结算周期" min-width="200">
               <template slot-scope="scope">
                <router-link target="_blank" style="color:#0202ff;text-decoration:none;" v-bind:to="{path:'/index/settlementRecord/detail', query: {month:scope.row.applyTimeStr,id:scope.row.cityPartnerId,'wType':scope.row.wType,cityId:scope.row.cityId,cityName:scope.row.cityName}}"> {{scope.row.applyTimeStr}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="applyMoney" label="结算金额(￥)" min-width="160">
                <template slot-scope="scope">
                  {{new Number (scope.row.applyMoney).thousandFormat()}}
                </template>
            </el-table-column>
            <el-table-column prop="cityName" label="加盟区域" min-width="100">
              <template slot-scope="scope">
                  {{scope.row.cityName}}
              </template>
            </el-table-column>
            <el-table-column prop="companyName" label="所属加盟商" min-width="150">
              <template slot-scope="scope">
                  {{scope.row.joinTarget=='1'?scope.row.companyName : scope.row.conName}}
              </template>
            </el-table-column>
            <el-table-column prop="applyUserName" label="结算单确认用户" min-width="150">
              <template slot-scope="scope">
                  {{scope.row.applyUserName}}
              </template>
            </el-table-column>
            <el-table-column prop="confirmTimeStr" label="结算确认日期" min-width="180">
              <template slot-scope="scope">
                  {{scope.row.confirmTimeStr}}
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="del">
              <template slot-scope="scope">
               
                <a v-if="scope.row.status == 3" href="javascript:;" prop="cityPartnerId" id='openId' @click="openEdit(scope.row, scope.$index)" style="color:#ccc; margin-right:10px; cursor:not-allowed;" title="已结算">
                  <!-- <i class="el-icon-document"></i> -->结算  <!-- 已结算 -->
                </a>
                <a v-else-if="scope.row.status == 2" href="javascript:;" prop="cityPartnerId"  @click="openEdit(scope.row, scope.$index)" style="color:#444; margin-right:10px;" title="待结算">
                  <!-- <i class="el-icon-document"></i> -->结算<!-- 待结算 -->
                </a>
                 <a v-else href="javascript:;" prop="cityPartnerId"  @click="openEdit(scope.row, scope.$index)" style="color:#ccc; margin-right:10px;cursor:not-allowed;" title="待确认">
                  <!-- <i class="el-icon-document"></i> -->结算<!-- 待确认 -->
                </a>
                <!--dialog 弹窗开始-->
                 <el-dialog id="settle_input" class="settle" title="结算确认" :visible.sync="dialogVisible" :modal="true" :modal-append-to-body="false">
                    <span id="tips">*当财务给加盟商线下打款后,才可以点击结算按钮，更改结算状态</span>
                    <el-form :model="editAccount">
                      <el-form-item label="结算周期:" :label-width="formLabelWidth" style="width: 300px;">
                        <el-input v-model="editAccount.applyTimeStr" :readonly="true" style="border:none;" auto-complete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="加盟商编号:" :label-width="formLabelWidth" style="width: 300px;  margin-top: -10px" readonly>
                        <el-input v-model="editAccount.cityPartnerId" style="border:none;"  :readonly="true"></el-input>
                      </el-form-item>
                      <el-form-item id="com" label="加盟企业名称/个人姓名:" :label-width="formLabelWidth" style="width: 300px;  margin-top: -10px" readonly>
                        <el-input v-model="companyName" style="border:none;"  :readonly="true">
            
                        </el-input>
                      </el-form-item>
                      <el-form-item label="加盟地区:" :label-width="formLabelWidth" style="width: 300px;  margin-top: -10px">
                        <el-input v-model="editAccount.cityName"  style="border:none;" auto-complete="off" :readonly="true"></el-input>
                      </el-form-item>
                      <el-form-item label="结算单确认用户:" :label-width="formLabelWidth" style="width: 300px;  margin-top: -10px">
                        <el-input v-model="editAccount.applyUserName" style="border:none;"  auto-complete="off" :readonly="true"></el-input>
                      </el-form-item>
                      <el-form-item label="结算金额:" :label-width="formLabelWidth" style="width: 300px;  margin-top: -10px">
                        <el-input  style="border:none;" :value="new Number(editAccount.applyMoney).thousandFormat()+'元'"  auto-complete="off" :readonly="true" ></el-input>
                      </el-form-item>
                      <el-form-item label="备注:" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="editAccount.description" style="width: 400px;  margin-top: -10px ;margin-left:10px"></el-input>
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <!-- v-loading.fullscreen.lock="fullscreenLoading"  -->
                      <el-button class="partner_button" type="primary" 
                      
                      @click="editConfim(scope.row, scope.$index)">确定结算</el-button>
                      <el-button class="partner_button" @click="dialogVisible = false">取消</el-button>
                    </div>
                  </el-dialog> 
                <!--dialog 弹窗结束-->
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
          v-show="pageShow"
          class="page"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="totalItems">
          </el-pagination>
        </el-row>
        </div>
  </div>
</template>
<script>
import request from 'superagent'
import moment from 'moment'
// import $ from 'jquery'
import { siblings } from '../../../../utils/index.js'
import { toThousand,thousandFormat } from '../../../util/util.js'
import { host } from '../../../config/index.js'
export default {
  data: function () {
    return {
      //查询条件
      joinMode:'0',
      joinPartner:'0',
      cityId:'0',
      partnerLists:[],
      temp1:[],
      temp2:[],
      citys:[],
      title:'',
// --------------------------------
      companyName:"",
      tableData: [],
      tableData2: [],
      dialogVisible: false,
      editAccount: {
        month: '',
        allianceNum: '',
        allianceArea: '',
        applyPerson: '',
        settleMoney: '',
        settleRemark: '',
        id: ''
      },
      formLabelWidth: '120px',
      dialogVisible: false,
      fullscreenLoading: false,
      activeName: '待结算',
      pagetotal: '',
      cityList: [],
      timer2: null,
      loading2: false,
      totalItems: 1,
      currentPage: 1,
      pageShow: false,
      currentStatus: 2
    }
  },
  mounted: function () {
    document.title="结算管理"
    $(".sign").removeClass('is-active')
    $('.sign[name="60"]').addClass('is-active')
    this.getCityList()
    this.getDateByTabName('2')
     this.searchPartner1()
    this.searchPartner2()
  },
  methods: {
     // ----------------------------------下拉菜单三联动部分

    searchPartner1(){
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
            // console.log(JSON.parse(res.text))
            var data = JSON.parse(res.text).data
              this.temp1 = data
            

          }
        })
    },
    searchPartner2(){
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
            // console.log(JSON.parse(res.text))
            var data = JSON.parse(res.text).data
              this.temp2 = data
            

          }
        })
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
      // console.log(this.partnerLists)
      
    },
  // 加盟商改变
  partnerChange(val){
    // console.log(val)
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
    // console.log(this.cityId)
    var that  =this
    setTimeout(function(){
      that.title = $("p.select_connect .el-select input")[1].value
    },200)
  },

    handleCurrentChange(val) {
     
     this.currentPage = val
      this.loading2 = true
      request
        .post(host + 'beepartner/admin/withDraw/findWithDraw')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'status': this.currentStatus,
          // 'cityId': this.activeName === '待结算'?$('.citys span.active').attr('myId'):$('.citys2 span.active').attr('myId'),
          'cityId':this.cityId,
          'cityPartnerId':this.joinPartner,
          'joinMode':this.joinMode,

          'currentPage': val
        })
        .end((error, res) => {
          // console.log('this is entry')
          if (error) {
            console.log('error:', error)
            this.loading2 = false
          } else {
            this.checkLogin(res)
            var data = JSON.parse(res.text).data
            // console.log("findWithDraw",data)
            this.totalItems = Number(JSON.parse(res.text).totalItems)
            var totalPage = Number(JSON.parse(res.text).totalPage)
            if (totalPage > 1) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }
            var newData = this.tableDataDel(data)
            this.tableData = newData
              this.loading2 = false
              
          }
        })
    },
    handleClick(e) {
      this.loading2 = true

      this.currentPage = 1
      // var elems = siblings(e.target)
      // for (var i = 0; i < elems.length; i++) {
      //   elems[i].setAttribute('class', '')
      // }
      // e.target.setAttribute('class', 'active')
      request
        .post(host + 'beepartner/admin/withDraw/findWithDraw')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'status': $('.citys span.active')[0].getAttribute('myStatus'),
          // 'cityId': $('.citys span.active').attr('myId'),
          'cityId':this.cityId,
          'cityPartnerId':this.joinPartner,
          'joinMode':this.joinMode,
        })
        .end((error, res) => {
          if (error) {
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            var data = JSON.parse(res.text).data
            var code = JSON.parse(res.text).resultCode
            var messsage = JSON.parse(res.text).message
            if(code==-1){
                this.$message.error(message)
            }
            this.totalItems = Number(JSON.parse(res.text).totalItems)
            var totalPage = Number(JSON.parse(res.text).totalPage)
            if (totalPage > 1) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }
            var newData = this.tableDataDel(data)
            this.loading2 = false
            this.tableData = newData
          }
        })
    },
    handleTypeClick (e) {
      this.loading2 = true
      var elems = siblings(e.target)
      for (var i = 0; i < elems.length; i++) {
        elems[i].setAttribute('class', '')
      }
      e.target.setAttribute('class', 'active')

      this.getDateByTabName(e.target.getAttribute('myStatus'))
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
            this.checkLogin(res)
            this.cityList = res.body
          }
        })
    },
    getDateByTabName (status) {
      this.currentStatus = status
      this.currentPage = 1
      this.loading2 = true
      request
        .post(host + 'beepartner/admin/withDraw/findWithDraw')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          // 'cityId': $('.citys span.active').attr('myId'),
          'cityId':this.cityId,
          'cityPartnerId':this.joinPartner,
          'joinMode':this.joinMode,

          'status': status
        })
        .end((error, res) => {
          // console.log('this is entry')
          if (error) {
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            var data = JSON.parse(res.text).data
            if (Object.prototype.toString.call(data) === '[object Array]') {
              this.totalItems = Number(JSON.parse(res.text).totalItems)
              var totalPage = Number(JSON.parse(res.text).totalPage)
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              // 关闭loading
              this.loading2 = false
              var newData = this.tableDataDel(data)
              this.tableData = newData
              // console.log(this.tableData)
            }
           
          }
        })   
    },
    tableDataDel(arr) {
      var arrDeled = []
      if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
          var obj = {}
          obj.applyTimeStr = arr[i].applyTimeStr
          obj.applyMoney = arr[i].applyMoney
          obj.cityName = arr[i].cityName
          obj.applyUserName = arr[i].applyUserName
          if (this.activeName === '待结算') {
            obj.confirmTimeStr = arr[i].confirmTimeStr
          } else {
            obj.confirmTime = arr[i].confirmTimeStr
          }
          // obj.allianceId = arr[i].applyTimeStr
          obj.cityPartnerId = arr[i].cityPartnerId
          obj.id = arr[i].id
          obj.description = arr[i].description
          obj.companyName = arr[i].companyName
          obj.conName = arr[i].conName
          obj.joinTarget = arr[i].joinTarget
          obj.status = arr[i].status
          obj.wType = arr[i].wType
          obj.cityId = arr[i].cityId
          arrDeled.push(obj)
        }
         return arrDeled
      }

     
    },
    openEdit(row) {
      // console.log($('.citys span.active')[1].getAttribute('myStatus'))
      if (row.status!= 2) {
        return
      } else {
        
        // 打开结算弹窗先清空上次输入的备注
        this.editAccount.description = ""

        this.dialogVisible = true
        this.editAccount.applyTimeStr = row.applyTimeStr
        this.editAccount.cityPartnerId = row.cityPartnerId
        this.editAccount.companyName = row.companyName
        this.editAccount.conName = row.conName
        this.editAccount.joinTarget = row.joinTarget
        this.editAccount.cityName = row.cityName
        this.editAccount.applyUserName = row.applyUserName
        this.editAccount.applyMoney = row.applyMoney
        this.editAccount.id = row.id
        this.editAccount.wType = row.wType
        this.companyName = this.editAccount.joinTarget=='1'?this.editAccount.companyName:this.editAccount.conName
        // this.editAccount.withdrawalCode = row.allianceId
      }

    },
    editConfim (row, index) {
      // this.fullscreenLoading = true
      request
        .post(host + 'beepartner/admin/withDraw/confirmWithDraw')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'applyTimeStr': this.editAccount.applyTimeStr,
          'applyMoney': Number(this.editAccount.applyMoney.toString().split('元')[0]),
          'description': this.editAccount.description,
          'cityPartnerId': this.editAccount.cityPartnerId,
          'id': this.editAccount.id,
          'wType': this.editAccount.wType
        })
        .end((error, res) => {
          if (error) {
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            if (JSON.parse(res.text).resultCode === 1) {
              this.tableData.splice(index, 1)

              this.loading2 = false
              this.$message({
                type: 'success',
                message: '加盟商将收到你的结算信息'
              })
               this.dialogVisible = false
        // 结算成功更新状态
        request
        .post(host + 'beepartner/admin/withDraw/findWithDraw')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          'status': $('.citys span.active')[0].getAttribute('myStatus'),
          // 'cityId': $('.citys span.active').attr('myId'),
          'cityId':this.cityId,
          'cityPartnerId':this.joinPartner,
          'joinMode':this.joinMode,

          'currentPage':this.currentPage
          
        })
        .end((error, res) => {
          if (error) {
            console.log('error:', error)
          } else {
            this.checkLogin(res)
            var data = JSON.parse(res.text).data
            var code = JSON.parse(res.text).resultCode
            var messsage = JSON.parse(res.text).message
            if(code==-1){
                this.$message.error(message)
            }
            this.totalItems = Number(JSON.parse(res.text).totalItems)
            var totalPage = Number(JSON.parse(res.text).totalPage)
            if (totalPage > 1) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }
            var newData = this.tableDataDel(data)
            this.loading2 = false
            this.tableData = newData
          }
        })

            } else {
              this.$message('结算失败')
            }
          }
          var that = this
          // setTimeout(function () {
          //   that.fullscreenLoading = false
          //   that.dialogVisible = false
          // }, 1000)
        })
    },
    checkLogin (res) {
      if (JSON.parse(res.text).message === '用户登录超时') {
        this.$router.push('/login')
      }
    }
  },
  watch:{
    // 'joinMode':'handleClick',
    'cityId':'handleClick'
  }
}
</script>
<style scoped>
#tips {
   margin-top: -70px;
    position: absolute;
    font-size: 12px;
    color: #ccc;
    margin-left: 10px;
}
div.settlementManager_head1 {
    padding: 20px 10px 5px 10px;
    background: #faebd7;
}

div.settlementManager_head2 {
    padding: 5px 10px 18px 10px;
    background: #faebd7;
}

div.selectPlace address {
  font-style: normal;
  display: inline;
  font-size: 14px;
  margin-right: 2px;
}

div.selectPlace div.citys {
  display: inline-block;
}

div.selectPlace div.citys2 {
  display: inline-block;
}

div.selectPlace span {
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
  padding: 5px;
  border: 1px solid transparent;
}

div.selectPlace span.active {
  border: 1px solid orange;
  border-radius: 4px;
}

div.table table {
  border-collapse: collapse;
  width: 100%;
}

div.table table thead tr th {
  font-weight: normal;
  text-align: left;
  border-bottom: 2px solid #585555;
  padding: 5px 10px;
}

div.table table tbody tr td {
  font-size: 14px;
  color: rgba(121, 121, 121, 1);
  font-family: '微软雅黑';
  border: none;
  border-bottom: 1px dotted #afa7a7;
  padding: 14px 10px;
  color: #555;
}

div.table table thead tr th span.sort {
  padding: 0 5px;
  display: inline-block;
  cursor: pointer;
}

.partner_button:nth-of-type(1) {
  background: #f87e2b;
  border: none;
  color: #fff;
  margin-left: 210px;
}

.partner_button:nth-of-type(1):hover {
  background: rgba(248, 126, 43, 0.9);
}

div#settlementManager_table {
    margin-top: 20px;
    padding: 20px;
    background:  #fff;
}

.partner_button:nth-of-type(2) {
  background: #fff;
  color: #444;
  border: 1px solid rgba(196,196,196,1);
}

.partner_button:nth-of-type(2):hover {
  border: 1px solid rgb(248, 126, 43);
  color: rgb(248, 126, 43);
}

.partner_button {
  width: 120px;
  height: 50px;
  float: left;
  margin-top: -30px;
  margin-bottom: 20px;
}

.page {
  white-space: nowrap;
  padding: 2px 5px;
  color: #48576a;
  background: #fff;
  margin-left: -5px;
  margin-top: 10px;
  border: none;
}
</style>

