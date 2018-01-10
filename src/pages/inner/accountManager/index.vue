<template>
  <div style="margin-right:20px;">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClickTab">
      <el-tab-pane name="平台">
        <span slot="label">
          <i class="el-icon-date"></i> 平台</span>
        <div class="am_search">
          <label>
            <span>关键字</span>
            <!-- <input type="text" placeholder="账号\姓名" v-on:blur="initQuery" v-model="accountOrUsername" class="account_my_input"> -->
            <input type="text" placeholder="账号\姓名"  v-model="accountOrUsername" class="account_my_input">
          </label>
          <label>
            <span>联系方式</span>
            <!-- <input type="text" placeholder="手机号\邮箱" v-on:blur="initQuery" v-model="telOrMail" class="account_my_input"> -->
            <input type="text" placeholder="手机号\邮箱"  v-model="telOrMail" class="account_my_input">
          </label>
          <el-button id="accountSearchBtn" @click="queryAccountInfo" class="timeSelect_button">查询</el-button>
        </div>

        <!-- account -->
        <div id="err_add" class="account">
          <h1>
            <button type="button" @click="addAccount">添加新账号</button>
            <!--新增数据开始-->
            <!--新增数据结束-->
          </h1>

          <!-- 表单 -->
          <el-table :data="platTableData" :empty-text='emptyText' style="width: 100%; font-size:13px;" v-loading="loading" :element-loading-text="loadingText">
            <el-table-column prop="userName" label="用户名" min-width="140"></el-table-column>
            <el-table-column prop="phoneNo" label="手机号" min-width="140"></el-table-column>
            <el-table-column prop="email" label="邮箱" min-width="170"></el-table-column>
            <el-table-column prop="name" label="姓名" min-width="100"></el-table-column>
            <el-table-column prop="roleName" label="角色" min-width="120">
            </el-table-column>
            <el-table-column label="状态" min-width="120" style="font-size:12px;">
              <template slot-scope="scope">
                <el-switch v-on:change="changeState(scope)" v-model="scope.row.status" on-text="启用" off-text="冻结" on-color="#13ce66" off-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="del" label="操作">
              <template slot-scope="scope">
                <a href="javascript:;"></a>
                <i class="el-icon-edit" @click="openEdit(scope)" title="修改" style="margin-right:10px;"></i>
                </a>
                <i class="el-icon-close" title="删除" @click="openDelete(scope)"></i>
                <!--dialog 弹窗开始 编辑平台账号-->
                <el-dialog id="pt_form" title="编辑平台账号信息" :visible.sync="dialogVisible" :modal="true" :modal-append-to-body="false">
                  <el-form class="editAccount" :model="editAccount" :rules="editAccountRule" ref="editRuleForm">
                    <el-form-item label="用户名" prop="userName" :label-width="formLabelWidth">
                      <el-input v-model="editAccount.userName"  @change="handlechange" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="passWord" :label-width="formLabelWidth">
                      <el-input type='password'  @change="handlechange" v-model="editAccount.passWord" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="所属角色" prop="roleName">
                      <el-select v-model="editAccount.roleName" placeholder="选择角色类型" @change="platChangeRole">
                        <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value" style="padding:8px">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="姓名" :label-width="formLabelWidth">
                      <el-input v-model="editAccount.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop='phoneNo' :label-width="formLabelWidth">
                      <el-input v-model="editAccount.phoneNo"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth">
                      <el-input v-model="editAccount.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                      <el-input type="textarea" style="width:340px" v-model="editAccount.description" placeholder="不超过200个字符"></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer editfooter">
                    <el-button class="accountMangerBtn" type="primary" @click="handleEditAccount">确 定</el-button>
                    <el-button class="accountMangerBtn" @click="dialogVisible = false">取 消</el-button>
                  </div>
                </el-dialog>
                <!--dialog 弹窗结束-->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

<!-- 加盟商 -->
      <el-tab-pane label="加盟商" name="加盟商" id="partner">
        <div id="search_content">
          <el-row class="selectPlace">
            <!-- 新增按加盟商查询 -->
              <p class="select_connect account_select" style="margin-bottom: -10px;">
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
            <!-- <div class="citys" style="margin-left:65px;color:#555">
              <address class="joinArea" style="margin-right:10px;margin-left:-65px">加盟区域</address>
              <span @click="handleClick" name="0" class="active">全部地区</span> -->
              <!-- <span @click="handleClick" :name="list.cityId" :key="list.cityId" v-for="list of cityList">{{list.cityName}}</span> -->
              <!-- <span @click="handleClick" :name="list.code" :key="list.id" v-for="list of cityList">{{list.name}}</span>
            </div> -->
          </el-row>
          <div class="am_search">
            <label>
              <span style="margin-right:13px;margin-left:15px">关键字</span>
              <!-- <input type="text" v-model="accountOrUsername" placeholder="账号\姓名" @blur="initQueryinitQuery" class="account_my_input"> -->
              <input type="text" v-model="accountOrUsername" placeholder="账号\姓名"  class="account_my_input">
            </label>
            <label>
              <span>联系方式</span>
              <!-- <input type="text" v-model="telOrMail" placeholder="手机号\邮箱" @blur="initQuery" class="account_my_input"> -->
              <input type="text" v-model="telOrMail" placeholder="手机号\邮箱"  class="account_my_input">
            </label>
            <el-button id="accountSearchBtn2" @click="queryAccountInfo" class="timeSelect_button">查询</el-button>
          </div>
        </div>
        <!-- account -->
        <div class="account">
          <h1>
            <button type="button" @click="addAccount">添加新账号</button>
          </h1>
          <!-- 表单 -->
          <el-table :data="joinTableData" style="width: 100%; font-size:13px;" v-loading="loading" element-loading-text="拼命加载中" :empty-text="emptyText">
            <el-table-column prop="userName" label="用户名" min-width="15%"></el-table-column>
            <el-table-column prop="phoneNo" label="手机号" min-width="15%"></el-table-column>
            <el-table-column prop="email" label="邮箱" min-width="15%"></el-table-column>
            <el-table-column prop="name" label="姓名" min-width="10%"></el-table-column>
            <el-table-column label="所属加盟商"  min-width="15%">
              <template slot-scope="scope">
                {{scope.row.joinTarget=='1'?scope.row.companyName:scope.row.conName}}
              </template>
            </el-table-column>
            <el-table-column label="加盟区域" prop="cityName" min-width="20%"></el-table-column>
            <el-table-column label="状态" min-width="10%" style="font-size:12px;">
              <template slot-scope="scope">
                <el-switch v-on:change="changeState(scope)" v-model="scope.row.status" on-text="启用" off-text="冻结" on-color="#13ce66" off-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="10%">
              <template slot-scope="scope">
                <a href="javascript:;"></a>
                <i class="el-icon-edit" @click="openEdit(scope)" title="修改" style="cursor:pointer;margin-right:10px;"></i>
                </a>
                <i class="el-icon-close" style="cursor:pointer;" title="删除" @click="openDelete(scope)"></i>
                <!--dialog 弹窗开始 编辑加盟商-->
                <el-dialog id="err_form" class="edit_join" title="编辑加盟商账号信息" :visible.sync="dialogVisible" :modal="true" :modal-append-to-body="false">
                  <el-form :model="editAccount" :rules="editAccountRule">
                    <el-form-item label="用户名" prop='userName' :label-width="formLabelWidth">
                      <el-input v-model="editAccount.userName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label='密码' prop='passWord' :label-width="formLabelWidth">
                      <el-input type="password" v-model="editAccount.passWord" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="所属加盟商" prop="alliance">
                        <el-select v-model="editAccount.alliance" placeholder="请选择加盟商" v-on:input='recode'>
                            <el-option v-for="item in allianceList" :key="item.cityPartnerId" :label="item.companyName" :value="item.cityPartnerId.toString()" style="padding:10px">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属角色" style="margin-left: 12px;" prop="roleName">
                      <el-select v-model="recodeRoleName" placeholder="请选择">
                        <el-option
                          style="padding:8px"
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="姓名" :label-width="formLabelWidth">
                      <el-input v-model="editAccount.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth">
                      <el-input v-model="editAccount.phoneNo"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth">
                      <el-input v-model="editAccount.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" style="margin-left: 50px;">
                      <el-input type="textarea" style="width:340px" v-model="editAccount.description" placeholder="不超过200个字符"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="所属加盟商" :label-width="formLabelWidth">
                            <el-radio-group v-model="editAccount.radio">
                              <el-radio :label="3">上海</el-radio>
                              <el-radio :label="6">北京</el-radio>
                              <el-radio :label="9">芜湖</el-radio>
                            </el-radio-group>
                          </el-form-item>-->
                  </el-form>
                  <div slot="footer" class="dialog-footer editfooter">
                    <el-button class="accountMangerBtn" type="primary" @click="handleEditAccount">确 定</el-button>
                    <el-button class="accountMangerBtn" @click="dialogVisible = false">取 消</el-button>
                  </div>
                </el-dialog>
                <!--dialog 弹窗结束-->
              </template>
            </el-table-column>
          </el-table>

        </div>
      </el-tab-pane>

      <el-pagination v-show="pageShow" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="prev, pager, next, jumper" :total="totalItems">
      </el-pagination>
    </el-tabs>

    <!-- 添加账号  -->
    <router-view id="account_router"></router-view>
  </div>
</template>

<script>
// import $ from 'jquery'
import request from 'superagent'
import {mapActions} from 'vuex'
import { siblings, checkPositiveNumber } from '../../../../utils/index.js'
import { checkUserName, checkMobile, isEmail } from '../../../../utils/index.js'
import { getAllAdminUser } from '../../../api/getAdminUser.api.js'
import { getAllAccount } from '../../../api/getAllAccount.api'
import { updateAdmin } from '../../../api/updateAdmin.api'
import { updateAccountByAdmin } from '../../../api/updateAccountByAdmin.api'
import { modifyAdminState } from '../../../api/modifyAdminState.api'
import { modifyAccountStateByAdmin } from '../../../api/modifyAccountStateByAdmin.api'
import { delAdminUser } from '../../../api/delAdminUser.api'
import { delAccountByAdmin } from '../../../api/delAccountByAdmin.api'
import { host } from '../../../config/index.js'
export default {
  created(){
    this.searchPartner1()
    this.searchPartner2()
  },
  data() {
    var that = this
    var validatorUserName = function(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (!checkUserName(value)) {
        callback('用户名格式：必须英文字母开头 不可以为汉字')
      } else {
        request
          .post(host + 'beepartner/admin/User/checkIsExistsUserName')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'userName': value,
            'sign': that.editAccount.id
          })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              if (JSON.parse(res.text).resultCode === 1) {
                callback()
              } else {
                var message = JSON.parse(res.text).message
                callback(new Error(message))
              }
            }
          })
      }
    }
    var validatePhoneNo = function(rule, value, callback) {
      if (value === '') {
        // callback(new Error('请输入手机号'))
        return
      } else if (!checkMobile(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        request
          .post(host + 'beepartner/admin/User/AdminUserUserNameOrPhone')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            'phoneNo': value
          })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              if (JSON.parse(res.text).resultCode === 1) {
                callback()
              } else {
                var message = JSON.parse(res.text).message
                callback(new Error(message))
              }
            }
          })
      }
    }
    return {
       //查询条件
      joinMode:'0',
      joinPartner:'0',
      cityId:'0',
      partnerLists:[],
      temp1:[],
      temp2:[],
      citys:[],
// --------------------------------
      radio2:'',
      cityList: [],
      cityId: '0',
      isQuery: false,
      accountOrUsername: '',
      telOrMail: '',
      pageShow: false,
      emptyText: ' ',
      loadingText: '',
      totalItems: 1,
      name: '',
      phone: '',
      recodeCityName:'',
      recodeCityId:'',
      recodeRoleName:'',
      recodeRoleId:'',
      activeName: '平台',
      totalItems: 1,
      pageShow: false,
      input: '',
      currentPage: 1,
      totalPage: 1,
      platTableData: [],
      joinTableData: [],
      initData: [],
      router_show: false,
      dialogVisible: false,
      totalPage: '',
      loading: false,
      loadingText: '',
      emptyText: ' ',
      formLabelWidth: '90px',
      options4: [],
      editAccountRule: {
        userName: [
          { validator: validatorUserName, trigger: 'blur', required: true },
          { required: true, trigger: 'blur', message: '请输入用户名' }
        ],
        passWord: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度应该在6-20位之间', trigger: 'blur' }
        ],
        roleName: [{ trigger: 'blur', required: true }],
        phoneNo: [{ validator: validatePhoneNo, trigger: 'blur' }],
        alliance: [{ required: true, message: '请选择加盟商', trigger: 'blur' }]
      },
      editAccount: {
        userName: '',
        passWord: '********',
        roleName: '',
        name: '',
        roleId: '',
        phoneNo: '',
        email: '',
        description: '',
        alliance: '',
        cityId: '',
        email: '',
        description: ''
      },
      isDisabled: true,
      options: [],
      value: '',
      allianceList: [],
      isSearch: false
    }
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
            console.log(JSON.parse(res.text))
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
            console.log(JSON.parse(res.text))
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
    ha(scope){
      console.log(scope)
    },
    platChangeRole(val){
     this.options4.map((item)=>{
       if(item.value==val){
          this.recodeRoleName = item.value
          this.recodeRoleId = item.id
       }
     })
    },
    recode(val){
     
        var that = this;
        // this.cityList.map((item)=>{
        //   if(item.cityName=== val){
        //     this.recodeCityId = item.cityId
        //   }
        // })
        this.recodeCityId = val
        // console.log('val', val)
        setTimeout(() => {
                    request.post(host + 'beepartner/admin/User/findRole')
                    .withCredentials()
                        .set({
                            'content-type': 'application/x-www-form-urlencoded'
                        })
                        .send({
                            'cityPartnerId':  val
                        })
                        .end((error, res) => {
                            if (error) {
                                console.log(error)
                                that.options = []
                            } else {
                                that.checkLogin(res)
                                var roles = JSON.parse(res.text).data.map((item) => {
                                    var obj = {}
                                    obj.value = item.roleName
                                    obj.label = item.roleName
                                    obj.id = item.id
                                    return obj
                                })
                                if (roles.length > 0) {
                                    that.isDisabled = false
                                }
                                that.recodeRoleName = ''
                                that.options = roles
                            }
                        })
                }, 200)
    },
    ...mapActions(['setName']),
    handlechange(){},
    remoteMethodPartner() {
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    queryAccountInfo() {

      this.isSearch = true

      this.isQuery = true
      var obj = {
        queryName: this.accountOrUsername,
        queryNumber: this.telOrMail,
        // cityId: $('.citys span.active').attr('name'),
        // cityId:this.cityId,
        // joinMode:this.joinMode,
        // cityPartnerId:this.joinPartner

      }
      console.log(obj)
      // if (this.accountOrUsername.trim().length === 0 && this.telOrMail.trim().length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '查询条件并不能为空！'
      //   })
      //   return false
      // }
      var that = this
      if (this.activeName === '平台') {
        that.loading = true
        // 不需判断查询条件是否为空
        // if (this.accountOrUsername.trim().length > 0 || this.telOrMail.trim().length > 0) {
          request.post(host + 'beepartner/admin/User/findAdminUser')
            .withCredentials()
            .set({
              'content-type': 'application/x-www-form-urlencoded'
            })
            .send(obj)
            .end(function(error, res) {
              if (error) {
                console.log(error)
                that.loading = false
              } else {
                that.checkLogin(res)
                that.loading = false
                var newArr = JSON.parse(res.text).data
                that.totalPage = Number(JSON.parse(res.text).totalPage)
                if (that.totalPage > 1) {
                  that.emptyText = ''
                  that.pageShow = true
                } else {
                  that.emptyText = '暂无数据'
                  that.pageShow = false
                }
                that.totalItems = Number(JSON.parse(res.text).totalItems)
                that.platTableData = that.handleData(newArr)
              }
            })
        // } else {
        //   request.post(host + 'franchisee/account/getAllAdminUser')
        //     .send(obj)
        //     .withCredentials()
        //     .set({
        //       'content-type': 'application/x-www-form-urlencoded'
        //     })
        //     .end(function(error, res) {
        //       if (error) {
        //         console.log(error)
        //         that.loading = false
        //       } else {
        //         that.checkLogin(res)
        //         that.loading = false
        //         var newArr = JSON.parse(res.text).list
        //         that.totalPage = JSON.parse(res.text).totalPage
        //         if (that.totalPage > 1) {
        //           that.emptyText = ''
        //           that.pageShow = true
        //         } else {
        //           that.emptyText = '暂无数据'
        //           that.pageShow = false
        //         }
        //         that.totalItems = JSON.parse(res.text).totalItems
        //         that.platTableData = that.handleData(newArr)
        //       }
        //     })
        // }
      } else {
        that.loading = true
        getAllAccount({ cityId: this.cityId,joinMode:this.joinMode,cityPartnerId:this.joinPartner,queryName: this.accountOrUsername, queryNumber: this.telOrMail }, function(error, res) {
          if (error) {
            console.log(error)
            setTimeout(function() {
              that.loading = false
              that.loadingText = '服务器链接超时'
            }, 5000)
            setTimeout(function() {
              that.emptyText = '暂无数据'
            }, 6000)
          } else {
            that.checkLogin(res)
            that.loading = false
            that.totalPage = Number(JSON.parse(res.text).totalPage)
            var arr = JSON.parse(res.text).data
            that.totalItems = Number(JSON.parse(res.text).totalItems)
            if (that.totalPage > 1) {
              that.emptyText = ' '
              that.pageShow = true
            } else {
              that.emptyText = '暂无数据'
              that.pageShow = false
            }
            that.$store.state.joinTableData = that.handleData(arr)
            that.joinTableData = that.$store.state.joinTableData
          }
        })
      }
    },
    loadData() {
      if (this.activeName === '平台') {
        var that = this
        that.loading = true
        getAllAdminUser({}, function(err, res) {
          if (err) {
            console.log(err)
            setTimeout(function() {
              that.loading = false
              that.loadingText = '服务器链接超时'
            }, 5000)
            setTimeout(function() {
              that.emptyText = '暂无数据'
            }, 6000)
          } else {
            that.checkLogin(res)
            that.loading = false
            that.emptyText = ''
            that.totalPage = Number(JSON.parse(res.text).totalPage)
            var arr = JSON.parse(res.text).data
            if (that.totalPage > 1) {
              that.emptyText = ' '
              that.pageShow = true
            } else {
              that.emptyText = '暂无数据'
              that.pageShow = false
            }
            that.totalItems = Number(JSON.parse(res.text).totalItems)
            that.$store.state.users.platTableData = that.handleData(arr)
            that.platTableData = that.$store.state.users.platTableData
            that.initData = that.platTableData
            that.currentPage = 1
          }
        })
      } else {
        var that = this
        this.accountOrUsername = ""
        this.telOrMail = ""
        that.loading = true
        request
          .post(host + 'beepartner/admin/User/findFranchiseeUser')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            // cityId: $('.citys span.active').attr('name')
            cityId: this.cityId,
            cityPartnerId:this.joinPartner,
            joinMode:this.joinMode,
            queryName:'',
            queryNumber:''
          })
          .end((error, res) => {
            if (error) {
              console.log(error)
              setTimeout(function() {
                that.loading = false
                that.loadingText = '服务器链接超时'
              }, 5000)
              setTimeout(function() {
                that.emptyText = '暂无数据'
              }, 6000)
            } else {
              
              that.totalPage = Number(JSON.parse(res.text).totalPage)
              var arr = JSON.parse(res.text).data
              that.totalItems = Number(JSON.parse(res.text).totalItems)
              if (that.totalPage > 1) {
                that.emptyText = ' '
                that.pageShow = true
              } else {
                that.emptyText = '暂无数据'
                that.pageShow = false
              }
              that.$store.state.joinTableData = that.handleData(arr)
              that.joinTableData = that.$store.state.joinTableData
              that.initData = that.joinTableData
              that.loading = false
            }
          })
      }
    },
    // initQuery() {
    //   this.isSearch = false
    //   var that = this
    //   this.isQuery = false
    //   this.currentPage = 1
    //   if (this.activeName === '平台') {
    //     if (this.accountOrUsername.trim().length === 0 && this.telOrMail.trim().length === 0 && this.isQuery === false) {
    //       getAllAdminUser({ franchiseeId: '123456', userId: 'admin' }, function(error, res) {
    //         if (error) {
    //           console.log(error)
    //           setTimeout(function() {
    //             that.loading = false
    //             that.loadingText = '服务器链接超时'
    //           }, 5000)
    //           setTimeout(function() {
    //             that.emptyText = '暂无数据'
    //           }, 6000)
    //         } else {
    //           that.checkLogin(res)
    //           that.loading = false
    //           that.totalPage = Number(JSON.parse(res.text).totalPage)
    //           var arr = JSON.parse(res.text).data
    //           if (that.totalPage > 1) {
    //             that.emptyText = ' '
    //             that.pageShow = true
    //           } else {
    //             that.emptyText = '暂无数据'
    //             that.pageShow = false
    //           }
    //           that.totalItems = Number(JSON.parse(res.text).totalItems)
    //           that.$store.state.users.accountMangerData = that.handleData(arr)
    //           that.initData = that.$store.state.users.accountMangerData
    //           that.platTableData = that.$store.state.users.accountMangerData
    //         }
    //       })
    //     }
    //   } else {
    //     if (this.accountOrUsername.trim().length === 0 && this.telOrMail.trim().length === 0 && this.isQuery === false) {
    //       getAllAccount({ franchiseeId: '123456', userId: 'admin', cityId: this.cityId, type: 1 }, function(error, res) {
    //         if (error) {
    //           console.log(error)
    //           setTimeout(function() {
    //             that.loading = false
    //             that.loadingText = '服务器链接超时'
    //           }, 5000)
    //           setTimeout(function() {
    //             that.emptyText = '暂无数据'
    //           }, 6000)
    //         } else {
    //           that.checkLogin(res)
    //           that.loading = false
    //           that.totalPage = Number(JSON.parse(res.text).totalPage)
    //           var arr = JSON.parse(res.text).data
    //           if (that.totalPage > 1) {
    //             that.emptyText = ' '
    //             that.pageShow = true
    //           } else {
    //             that.emptyText = '暂无数据'
    //             that.pageShow = false
    //           }
    //           that.totalItems = Number(JSON.parse(res.text).totalItems)
    //           that.$store.state.accountMangerData = that.handleData(arr)
    //           that.initData = that.$store.state.accountMangerData
    //           that.joinTableData = that.$store.state.accountMangerData
    //         }
    //       })
    //     }
    //   }
    // },
    queryInfo() {
      var name = this.name.trim()
      var phone = this.phone.trim()
      var that = this
      var type = null
      if (this.activeName === '平台') {
        this.currentPage = 1
        type = 0
        if (name.length > 0 || phone.length > 0) {
          request.post(host + 'franchisee/account/getAllAdminUser')
            .withCredentials()
            .set({
              'content-type': 'application/x-www-form-urlencoded'
            })
            .send({
              name: this.name.trim(),
              phone: this.phone.trim(),
              type: type
            }).end(function(error, res) {
              if (error) {
                console.log(error)
              } else {
                that.checkLogin(res)
                var arr = JSON.parse(res.text).list
                that.platTableData = that.handleData(arr)
                that.totalItems = JSON.parse(res.text).totalItems
                var totalPage = JSON.parse(res.text).totalPage
                if (totalPage > 1) {
                  that.pageShow = true
                } else {
                  that.pageShow = false
                }
              }
            })
        }
      } else {
        type = 1
        this.currentPage = 1
        if (name.length > 0 || phone.length > 0) {
          request.post(host + 'franchisee/account/getAllAccount')
            .withCredentials()
            .set({
              'content-type': 'application/x-www-form-urlencoded'
            })
            .send({
              name: this.name.trim(),
              phone: this.phone.trim(),
              type: type
            }).end(function(error, res) {
              if (error) {
                console.log(error)
              } else {
                that.checkLogin(res)
                var arr = JSON.parse(res.text).list
                that.joinTableData = that.handleData(arr)
                console.log("joinTableData",that.joinTableData)
                that.totalItems = JSON.parse(res.text).totalItems
                var totalPage = JSON.parse(res.text).totalPage
                if (totalPage > 1) {
                  that.pageShow = true
                } else {
                  that.pageShow = false
                }
              }
            })
        }
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    change(type) {
      this.$router.push('/index/accountManager/addaccount' + type)
      this.router_show = true
    },
    addAccount() {
      if (this.activeName === '平台') {
        this.$router.push('/index/accountManager/addaccount')
        this.router_show = true
      } else {
        this.$router.push('/index/accountManager/addaccount2')
        this.router_show = true
      }
    },
    getAllianceList () {
        request
            .post(host + 'beepartner/admin/cityPartner/queryEffectCityPartnerList')
            .withCredentials()
            .set({
                'content-type': 'application/x-www-form-urlencoded'
            })
            .end((error,res)=>{
                this.checkLogin(res)
                var data = JSON.parse(res.text).data

                this.allianceList = data
                
            })
    },

// --------------------原先点击地区查询改为按加盟商及地区查询
    handleClick(e) {
      // this.accountOrUsername = ""
      // this.telOrMail = ""

      // var elems = siblings(e.target)
      // for (var i = 0; i < elems.length; i++) {
      //   elems[i].setAttribute('class', '')
      // }
      var that = this
      // e.target.setAttribute('class', 'active')
      // that.cityId = e.target.getAttribute('name')
      that.loading = true
      that.currentPage = 1
      getAllAccount(
        {
        'joinMode':this.joinMode,
        'cityPartnerId':this.joinPartner,
        'cityId': this.cityId,
        'queryName': this.isSearch === false?'':this.accountOrUsername,
        'queryNumber': this.isSearch === false?'':this.telOrMail,
        }, function(error, res) {
        if (error) {
          console.log(error)
          that.loading = false
          that.pageShow = false
        } else {
          that.checkLogin(res)
          that.loading = false
          that.totalPage = Number(JSON.parse(res.text).totalPage)
          var arr = JSON.parse(res.text).data
          that.totalItems = Number(JSON.parse(res.text).totalItems)
          if (that.totalPage > 1) {
            that.emptyText = ' '
            that.pageShow = true
          } else {
            that.emptyText = '暂无数据'
            that.pageShow = false
          }
          that.$store.state.joinTableData = that.handleData(arr)
          that.joinTableData = that.$store.state.joinTableData
          that.initData = that.joinTableData
        }
      })
    },
    //编辑
    openEdit(scope) {
      console.log(scope)
      if(this.activeName==='平台'){
        if(scope.row.status===false){
          this.$message({
            type:'error',
            message:'账号已冻结，请解冻后再编辑'
          })
          return;
        }
        this.dialogVisible = true
        this.editAccount.roleName = scope.row.roleName
        this.editAccount.userName = scope.row.userName
        this.editAccount.email = scope.row.email
        this.editAccount.phoneNo = scope.row.phoneNo
        this.editAccount.name = scope.row.name
        this.editAccount.status = scope.row.status
        this.editAccount.index = scope.$index
        this.editAccount.description = scope.row.description
        this.editAccount.cityName = scope.row.cityName
        this.editAccount.id = scope.row.id
        this.editAccount.initUserId = scope.row.userId
        this.editAccount.roleId = scope.row.roleId
        this.editAccount.passWord = '********'
        this.recodeRoleName = scope.row.roleName
        this.options4.map((item)=>{
          if(item.value==this.recodeRoleName){
            this.recodeRoleId = item.id
          }
        })
// ----加盟商
      }else{
        console.log(scope.row)
            if(scope.row.status===false){
            this.$message({
              type:'error',
              message:'账号已冻结，请解冻后再编辑'
            })
            return;
          }
            var that = this;
            this.dialogVisible = true
            this.recodeRoleName = scope.row.roleName;
            this.recodeCityId = scope.row.cityPartnerId
            this.editAccount.passWord = '********'
            this.editAccount.userName = scope.row.userName
            this.editAccount.email = scope.row.email
            // 显示加盟商
            this.editAccount.alliance = scope.row.joinTarget=='1'?scope.row.companyName:scope.row.conName

            this.editAccount.phoneNo = scope.row.phoneNo
            this.editAccount.name = scope.row.name
            this.editAccount.status = scope.row.status
            this.editAccount.index = scope.$index
            this.editAccount.description = scope.row.description
            this.editAccount.cityName = scope.row.cityName
            this.editAccount.id = scope.row.id
            this.editAccount.initUserId = scope.row.userId
            this.editAccount.roleId = scope.row.roleId
            this.recodeCityName = scope.row.cityName;
            this.radio2 = this.recodeCityName
             setTimeout(function(){
              $("input.el-radio__original").each(function(index,ele){
                if(ele.value==that.editAccount.alliance){
                  ele.click()
                }
              })
            },200)
            request.post(host + 'beepartner/admin/User/findRole')
              .withCredentials()
              .set({
                'content-type': 'application/x-www-form-urlencoded'
              }).
              send({
                cityPartnerId:  this.recodeCityId 
              })
              .end((err,res)=>{
                var roles = JSON.parse(res.text).data.map((item) => {
                    var obj = {}
                    obj.value = item.roleName
                    obj.label = item.roleName
                    obj.id = item.id
                    return obj
                  })
                  that.options = roles
                  that.options.map((item)=>{
                    if(item.value===that.recodeRoleName){
                      that.recodeRoleId = item.id
                    }
                  })
              })
              return;
        }
     
    },
    handleEditAccount() {
      if (this.editAccount.userName === '') {
        return
      }
      this.dialogVisible = false
      var that = this
      var newAccountInfo = {}
     
      var index = this.editAccount.index
      if (this.activeName === '平台') {
         newAccountInfo.id = this.editAccount.id
        newAccountInfo.userName = this.editAccount.userName
        newAccountInfo.roleName = this.recodeRoleName
        newAccountInfo.passWord = this.editAccount.passWord
        newAccountInfo.description = this.editAccount.description
        newAccountInfo.email = this.editAccount.email
        newAccountInfo.phoneNo = this.editAccount.phoneNo
        newAccountInfo.cityId = this.recodeCityId
        newAccountInfo.cityName = this.editAccount.cityName
        newAccountInfo.roleId = this.recodeRoleId
        newAccountInfo.name = this.editAccount.name
        var AccountInfo = newAccountInfo
        delete AccountInfo.role
        updateAdmin(AccountInfo, function(error, res) {
          if (error) {
            console.log(error)
          } else {
            that.checkLogin(res)
            var code = JSON.parse(res.text).resultCode
            if (code === 1) {
              that.$message({
                type: 'success',
                message: '恭喜您，修改成功！'
              })
              that.platTableData.splice(index, 1, that.editAccount)
              that.loadData()
            } else {
              that.$message({
                type: 'error',
                message: 'sorry, 对不起修改失败！'
              })
            }
          }
        })
      } else {
        var that = this;
        newAccountInfo.userName = this.editAccount.userName
        newAccountInfo.passWord = this.editAccount.passWord

        // 新需求字段更改
        // newAccountInfo.city = this.recodeCityId
        newAccountInfo.cityPartnerId = this.recodeCityId

        newAccountInfo.cityName = this.radio2
        newAccountInfo.roleId = this.recodeRoleId
        newAccountInfo.name = this.editAccount.name
        newAccountInfo.phoneNo = this.editAccount.phoneNo
        newAccountInfo.email = this.editAccount.email
        newAccountInfo.description = this.editAccount.description
        newAccountInfo.id = this.editAccount.id
        newAccountInfo.roleName = this.recodeRoleName
        updateAccountByAdmin(newAccountInfo, function(error, res) {
          if (error) {
            console.log(error)
          } else {
            that.checkLogin(res)
            var code = JSON.parse(res.text).resultCode
            if (code === 1) {
              that.$message({
                type: 'success',
                message: '恭喜您，修改成功！'
              })
              that.joinTableData.splice(index, 1, Object.assign({},newAccountInfo,{status:that.editAccount.status}))
              that.loadData()
            } else {
              that.$message({
                type: 'error',
                message: 'sorry, 对不起修改失败！'
              })
            }
          }
        })
      }
    },
    openDelete(scope) {
      var that = this
      if (this.activeName === '平台') {
        this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.loading = true
          delAdminUser(
            {
              id: scope.row.id
            },
            function(error, res) {
              if (error) {
                that.loading = false
                that.$message({
                  type: 'error',
                  message: 'sorry，删除失败!'
                })
                console.log(error)
              } else {
                that.checkLogin(res)
                var code = JSON.parse(res.text).resultCode
                if (code === 0) {
                  that.loading = false
                  that.$message({
                    type: 'error',
                    message: '对不起，您没有权限!'
                  })
                } else if (code === 1) {
                  that.loading = false
                  that.$message({
                    type: 'success',
                    message: '恭喜您，删除成功!'
                  })
                  that.platTableData.splice(scope.$index, 1)
                  if (that.platTableData.length === 0) {
                    that.pageShow = false
                    that.emptyText = '暂无数据'
                  }
                }
              }
            }
          )
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
      } else {
        this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.loading = true
          delAccountByAdmin(
            {
              // adminUser: {
              //   id: 0,
              //   role: 0,
              //   userId: '123'
              // },
              // account: {
              //   id: scope.row.id,
              //   userId: scope.row.userId
              // }
              id: scope.row.id,
              userId: scope.row.userId
            }, function(error, res) {
              if (error) {
                console.log(error)
                that.loading = false
                that.$message({
                  type: 'error',
                  message: '对不起，删除失败!'
                })
              } else {
                that.checkLogin(res)
                var code = JSON.parse(res.text).resultCode
                if (code === -1) {
                  that.loading = false
                  that.$message({
                    type: 'error',
                    message: '对不起，您没有权限!'
                  })
                } else if (code === 1) {
                  that.loading = false
                  that.$message({
                    type: 'success',
                    message: '恭喜您，删除成功!'
                  })
                  that.joinTableData.splice(scope.$index, 1)
                  if (that.joinTableData.length === 0) {
                    that.pageShow = false
                    that.emptyText = '暂无数据'
                  }
                }
              }
            }
          )
        }).catch(() => {

        })
      }
    },
    // 启用或冻结
    changeState(scope) {
      if (this.activeName === '平台') {
        var that = this
        var initObj = Object.assign({}, scope.row, { status: scope.row.status })
        var obj = Object.assign({}, scope.row, { status: !scope.row.status })
       // this.platTableData.splice(scope.$index,1,initObj) SHIBAI 失败
       this.platTableData.splice(scope.$index,1,obj) // 成功
        //var obj2 = Object.assign({}, scope.row, { status: !scope.row.status ? 0 : 1 })
        
        modifyAdminState(
          {
            id: scope.row.id,
            status: scope.row.status ? 1 : 0
          }, function(error, res) {
            if (error) {
              console.log(error)
              that.$message({
                type: 'error',
                message: '对不起，修改失败'
              })
              that.platTableData.splice(scope.$index,1,initObj) //SHIBAI 失败
            } else {
              that.checkLogin(res)
              var code = JSON.parse(res.text).resultCode
              var message = JSON.parse(res.text).message
              if (code === 1) {
                that.$message({
                  type: 'success',
                  message: message
                })
                that.loadData()
                // that.platTableData.splice(scope.$index, 1, obj)
              } else {
                that.$message({
                  type: 'error',
                  message:message
                })
              that.platTableData.splice(scope.$index,1,initObj) //SHIBAI 失败
              }
            }
          }
        )
      } else {
        var that = this
        this.accountOrUsername = ''
        this.phoneNo = ''
        var init =  Object.assign({}, scope.row, { status: scope.row.status }) //成功
        var initObj2 = Object.assign({}, scope.row, { status: !scope.row.status }) //失败
        // var obj = Object.assign({}, scope.row, { status: !scope.row.status })
        // var obj2 = Object.assign({}, scope.row, { status: scope.row.status ?  0 : 1 })
         
         
        modifyAccountStateByAdmin(
          {
            id: scope.row.id,
            status: !scope.row.status ? 0 : 1
          }, function(error, res) {
            if (error) {
              console.log(error)
              that.$message({
                type: 'error',
                message: '对不起，修改失败'
              })
              that.joinTableData.splice(scope.$index,1,initObj2) //SHIBAI 失败
            } else {
              that.checkLogin(res)
              var code = JSON.parse(res.text).resultCode
              var message = JSON.parse(res.text).message
              if (code === 1) {
                that.$message({
                  type: 'success',
                  message: message
                })
                that.joinTableData.splice(scope.$index, 1, init)
                that.loadData()
              } else {
                that.$message({
                  type: 'error',
                  message: message
                })
                // that.joinTableData.splice(scope.$index, 1, scope.row)
              }
            }
          }
        )
      }
    },
    handleData(arr) {
      var res = arr.map((item) => {
        var obj = {}
        var status = null
        if (item.status === 1) {
          status = true
        } else {
          status = false
        }
        obj = Object.assign({}, item, { status: status })
        return obj
      })
      return res
    },
    // loadCity() {
    //   // request.post(host + 'beepartner/admin/city/findCity')
    //   request.post(host + 'beepartner/admin/city/findAreaAlreadyOpen')
    //     .withCredentials()
    //     .set({
    //       'content-type': 'application/x-www-form-urlencoded'
    //     })
    //     .end((error, res) => {
    //       if (error) {
    //         console.log(error)
    //         this.cityList = []
    //       } else {
    //         this.checkLogin(res)
    //         // var result = JSON.parse(res.text).data
    //         // var map = result.map((item) => {
    //         //   var obj = {}
    //         //   obj.cityId = item.cityId
    //         //   obj.cityName = item.cityName
    //         //   return obj
    //         // })
    //         // this.cityList = map
    //         this.cityList = res.body
    //       }
    //     })
    // },
    handleClickTab(tab, event) {
      var that = this
      this.name = ''
      this.phone = ''
      this.accountOrUsername = ''
      this.telOrMail = ''
      this.pageShow = false

      this.cityId = '0'
      this.joinPartner = '0'
      this.joinMode = '0'
      this.partnerLists = []
      this.citys = []


      if (this.activeName === '平台') {
        this.currentPage = 1
        var that = this
        this.loading = true
        getAllAdminUser({}, function(err, res) {
          if (err) {
            console.log(err)
            setTimeout(function() {
              that.loading = false
              that.loadingText = '服务器链接超时'
            }, 5000)
            setTimeout(function() {
              that.emptyText = '暂无数据'
            }, 6000)
          } else {
            
            that.checkLogin(res)
            that.loading = false
            that.emptyText = ' '
            that.totalPage = JSON.parse(res.text).totalPage
            
            var arr = JSON.parse(res.text).data
            if (that.totalPage > 1) {
              that.emptyText = ' '
              that.pageShow = true
            } else {
              that.emptyText = '暂无数据'
              that.pageShow = false
            }
            that.totalItems = Number(JSON.parse(res.text).totalItems)
            that.$store.state.platTableData = that.handleData(arr)
            that.platTableData = that.$store.state.platTableData
            that.initData = that.platTableData
          }
        })
      } else {
        // 获取加盟商的列表
        this.loading = true
        this.getAllianceList()
        
        
        this.currentPage = 1
        request
          .post(host + 'beepartner/admin/User/findFranchiseeUser')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            // cityId: $('.citys span.active').attr('name')
            cityId: '0',
            joinMode:'0',
            cityPartnerId:'0',
            queryName:'',
            queryNumber:''

          })
          .end((error, res) => {
            if (error) {
              console.log(error)
              setTimeout(function() {
                that.loading = false
                that.loadingText = '服务器链接超时'
              }, 5000)
              setTimeout(function() {
                that.emptyText = '暂无数据'
              }, 6000)
            } else {
              that.checkLogin(res)
              
              
              that.totalPage = Number(JSON.parse(res.text).totalPage)
              console.log(JSON.parse(res.text))
              var arr = JSON.parse(res.text).data
              that.totalItems = Number(JSON.parse(res.text).totalItems)
              if (that.totalPage > 1) {
                that.emptyText = ' '
                that.pageShow = true
              } else {
                that.emptyText = '暂无数据'
                that.pageShow = false
              }
              that.$store.state.joinTableData = that.handleData(arr)
              // console.log('that.$store.state.joinTableData', that.$store.state.joinTableData)
              that.joinTableData = that.$store.state.joinTableData
              that.initData = that.joinTableData
              console.log(that.initData)
              that.loading = false
            }
          })
      }
    },
    checkLogin(res) {
      if (JSON.parse(res.text).message === '用户登录超时') {
        this.$router.push('/login')
      }
    },
    remoteMethod() {
      var that = this
      setTimeout(() => {
        request.post(host + 'beepartner/admin/User/findAdminRole')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send()
          .end((error, res) => {
            if (error) {
              console.log(error)
              that.options4 = []
            } else {
              that.checkLogin(res)
              var roles = JSON.parse(res.text).data.map((item) => {
                var obj = {}
                obj.value = item.roleName
                obj.label = item.roleName
                obj.id = item.id
                return obj
              })
              that.options4 = roles
            }
          })
      }, 200)
    },
  },
  mounted() {
    $(".sign").removeClass('is-active')
    $('.sign[name="80"]').addClass('is-active')
    document.title = '账号管理'
    var that = this;
     request.post(host + 'beepartner/admin/User/findAdminRole')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .end((err,res)=>{
             var roles = JSON.parse(res.text).data.map((item) => {
                var obj = {}
                obj.value = item.roleName
                obj.label = item.roleName
                obj.id = item.id
                return obj
              })
              that.options4 = roles

          })
    this.loadData()
    // this.loadCity()
  },
  watch: {
    'joinMode':'handleClick',
    'cityId':'handleClick',
    'recodeRoleName':{
      handler:function(val,oldVal){
        this.options.map((item)=>{
          if(item.value===val){
            this.recodeRoleId = item.id
          }
        })
      },
      deep:true
    },
    'editAccount.alliance': {
      handler: function(val, oldVal) {
        this.cityList.map((item) => {
          if (item.cityId == val) {
            this.editAccount.cityName = item.cityName
          }
        })
      },
      deep: true
    },
    currentPage: {
      handler: function(val, oldVal) {
        var that = this
        that.loading = true
        if (this.activeName === '平台') {
          if (this.name.trim().length === 0 && this.phone.trim().length === 0) {
            getAllAdminUser({
              'currentPage': val,
              'queryName': this.isSearch === false?'':this.accountOrUsername,
              'queryNumber': this.isSearch === false?'':this.telOrMail,
            }, function(err, res) {
              if (err) {
                console.log(err)
                that.loading = false
              } else {
                that.loading = false
                var arr = JSON.parse(res.text).data
                var totalPage = Number(JSON.parse(res.text).totalPage)
                if (totalPage > 1) {
                  that.emptyText = ' '
                  that.pageShow = true
                } else {
                  that.pageShow = false
                  that.emptyText = '暂无数据'
                }
                that.$store.state.platTableData = that.handleData(arr)
                that.platTableData = that.$store.state.platTableData
              }
            })
          } else {
            request.post(host + 'beepartner/admin/User/findAdminUser')
              .send({
                'queryName': this.isSearch === false?'':this.accountOrUsername,
                'queryNumber': this.isSearch === false?'':this.telOrMail,
                'currentPage': val
              }).end(function(error, res) {
                if (error) {
                  console.log(error)
                  that.loading = false
                } else {
                  that.loading = false
                  var arr = JSON.parse(res.text).data
                  that.tableTableData = that.handleData(arr)
                  that.totalItems = Number(JSON.parse(res.text).totalItems)
                  var totalPage = Number(JSON.parse(res.text).totalPage)
                  if (totalPage > 1) {
                    that.pageShow = true
                  } else {
                    that.pageShow = false
                  }
                }
              })
          }
          // 加盟商
        } else {
          //加盟商
          if (this.name.trim().length === 0 && this.phone.trim().length === 0) {
            getAllAccount({
              'joinMode':this.joinMode,
              'cityPartnerId':this.joinPartner,
              'cityId': this.cityId,

              'currentPage': val,
              'queryName': this.isSearch === false?'':this.accountOrUsername,
              'queryNumber': this.isSearch === false?'':this.telOrMail
            }, function(error, res) {
              if (error) {
                console.log(error)
                that.loading = false
              } else {
                that.loading = false
                var arr = JSON.parse(res.text).data
                var totalPage = JSON.parse(res.text).totalPage
                if (totalPage > 1) {
                  that.pageShow = true
                } else {
                  that.pageShow = false
                  that.emptyText = '暂无数据'
                }
                that.$store.state.joinTableData = that.handleData(arr)
                that.joinTableData = that.$store.state.joinTableData
              }
            })
          } else {
            
            request.post(host + 'beepartner/admin/User/findFranchiseeUser').
              send({
                'queryName': this.isSearch === false?'':this.accountOrUsername,
                'queryNumber': this.isSearch === false?'':this.telOrMail,
                'type': 1,
                'currentPage': val,

                'joinMode':this.joinMode,
                'cityPartnerId':this.joinPartner,
                'cityId': this.cityId,
              })
              .withCredentials()
              .set({
                'content-type': 'application/x-www-form-urlencoded'
              })
              .end(function(error, res) {
                if (error) {
                  console.log(error)
                  that.loading = false
                } else {
                  that.loading = false
                  var arr = JSON.parse(res.text).data
                  that.joinTableData = that.handleData(arr)
                  that.totalItems = JSON.parse(res.text).totalItems
                  var totalPage = JSON.parse(res.text).totalPage
                  if (totalPage > 1) {
                    that.pageShow = true
                  } else {
                    that.pageShow = false
                  }
                }
              })
          }
        }
      },
      deep: true
    },
    '$route': 'loadData'
  }
}
</script>

<style scoped>
html,
body,
h1,
h2,
h3,
h4,
h5,
h6,
td,
tr,
th,
table,
thead,
tbody,
dl,
dt,
dd,
p,
span,
ul,
li,
ol {
  margin: 0;
  padding: 0;
}

body {
  background: #f2f2f2;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

::-webkit-input-placeholder{
  font-size: 14px;
}


/*#account_router_cover {
  width: 100%;
  height: 100%;
  background: rgba(128,128,128,0.6);
  position: fixed;
  left: 0;
  top: 0;
}*/
.el-select-dropdown li {
    padding-left: 9px!important;
    padding-top: 5px!important;
}
#account_router {
  width: 100%;
  height: 100%;
  background: rgba(68, 68, 68, 0.6);
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}

#search_content { 
  overflow: hidden;
}



/*#account_router {
  position: fixed;
  left: 0;
  top: 0;
  display: block;
  height: 80%;
  margin-left: 10%;
  margin-top: 5%;
  width: 80%;
  z-index: 100;
  background: #f60;
  overflow: hidden;
}*/

div.account {
  /* width: 100%; */
  /* padding: 0 30px 0px 30px; */
  background: #fff;
  margin-top: 20px;
  /* border: 1px solid #e7ecf1; */
}
div.el-tabs.el-tabs--border-card div.el-tabs__content {
    padding-bottom: 20px !important;
}

div.account>h1 {
  width: 90%;
  height: 68px;
  line-height: 55px;
}

div.account>h1 button {
  width: 100px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  border: none;
  outline: none;
  font-size: 12px;
  color: #fff;
  border-radius: 4px;
  background: rgba(66, 66, 66, 0.8);
  transition: all .2s linear 0s;
}

div.account>h1 button:hover {
  background: rgb(66, 66, 66);
  cursor: pointer;
}

.am_search {
  width: 100%;
  height: 70px;
  background: #faebd7;
  padding-top:1px;
  padding-bottom:5px
  
  /* border: 1px solid #e7ecf1; */
}

.account_my_input {
  width: 140px;
  height: 36px;
  outline: none;
  margin-top: 4px;
  border-radius: 4px;
  border: 1px solid #ddd;
  display: inline-block;
  text-indent: 8px;
  font-size:14px
}

.am_search label {
  /* width: 190px; */
  height: 70px;
  line-height: 70px;
  margin-right: 10px;
  margin-left: 16px;
  float: left;
}

.am_search label span {
  line-height: 74px;
  font-weight: 400;
  font-size: 14px;
  display: block;
  margin-right: 10px;
  float: left;
  color:#555;
}

.am_search label:nth-child(2) {
  margin-left: 0;
}

.am_search button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c4c4c4;
  color: #1f2d3d;
  margin: 17px 30px;
  float: right;
  padding: 10px 15px;
  border-radius: 4px;
}

.am_search button:hover {
  color: #20a0ff;
  border-color: #20a0ff;
}

.el-table__body,
.el-table__footer,
.el-table__header {
  border: 2px solid red;
}

#err_form .el-form-item {
  padding-left: 140px;
  margin-bottom: 22px;
}

.el-switch__label,
.el-switch__label * {
  font-size: 12px;
}

.el-icon-close,
.el-icon-edit {
  cursor: pointer
}

.el-dialog .dialogModal {
  background: rgba(0, 0, 0, .5)
}

.one {
  background: #f87e2b;
  border: none;
  width: 120px;
  height: 50px;
}

.two {
  background: #f87e2b;
  border: none;
  width: 120px;
  height: 50px;
}

.one:hover {
  background: rgba(248, 126, 43, 0.9);
  width: 120px;
  height: 50px;
}


.two:hover {
  border: 1px solid rgb(248, 126, 43);
  color: rgb(248, 126, 43);
  width: 120px;
  height: 50px;
}

button#accountSearchBtn {
  width: 80px;
  height: 36px;
  line-height: 11px;
  margin-right: 30px;
  color: #fff;
  font-size: 14px;
  outline: none;
  border: none;
  background: rgba(52, 52, 67, 0.8);
}

button#accountSearchBtn:hover {
  color: #f60;
  background: rgba(52, 52, 67, 1);
}

button#accountSearchBtn2 {
  width: 80px;
  height: 36px;
  line-height: 11px;
  margin-right: 30px;
  color: #fff;
  font-size: 14px;
  outline: none;
  border: none;
  background: rgba(52, 52, 67, 0.8);
}

button#accountSearchBtn2:hover {
  color: #fff;
  background: rgba(52, 52, 67, 1);
}

.accountMangerBtn {
  width: 120px;
  height: 50px;
}

.accountMangerBtn:nth-of-type(1):hover {
  background: rgba(248, 126, 43, 0.9);
}

.accountMangerBtn:nth-of-type(1) {
  background: #f87e2b;
  border: none;
  color: #fff;
  margin-left: 170px;
}

.accountMangerBtn:nth-of-type(2) {
  background: #fff;
  color: #444;
  border: 1px solid rgba(196, 196, 196, 1)
}

.accountMangerBtn:nth-of-type(2):hover {
  border: 1px solid rgb(248, 126, 43);
  color: rgb(248, 126, 43);
}

div.addfooter,
div.editfooter {
  text-align: left;
  padding-left: 60px;
  margin-top: -43px;
  margin-bottom: 10px;
}

div.el-input {
  width: initial
}

.el-pagination {
  white-space: nowrap;
  /* padding: 2px 5px; */
  color: #48576a;
  padding-left: 30px;
  background: #fff;
  /* margin-left: 1px; */
  border-left: 1px solid #e7ecf1;
}

div.el-pagination {
  padding-left: 0;
  border-left: 0;
  /* margin-left: 30px; */
    margin-top: 10px;
}

#partner .selectPlace {
  width: 100%;
  min-height: 40px;
  /* border: 1px solid #e7ecf1; */
  padding: 23px 10px 0px 30px;
  box-sizing: border-box;
  background-color: #faebd7;
}

div.selectPlace address {
  font-style: normal;
  display: inline;
  font-size: 14px;
}

div.selectPlace div.citys {
  display: inline-block;
}

div.selectPlace div.citys span.active {
  border-radius: 4px;
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
}
</style>

