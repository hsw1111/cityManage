<template>
  <div style="margin-right:20px;overflow:auto">
    <div style="background-color:#faebd7;padding-top:20px;padding-bottom:5px">
      <div style="background-color:#faebd7;font-size:14px;color:#555;margin-bottom:5px" class="partner_new">
        <address class="joinArea joinMode">加盟模式</address>
        <span id="joinMode">
        <span class="active"  @click="handleClick" mode="0">全部</span>
        <span @click="handleClick" mode="1">独家</span>
        <span @click="handleClick" mode="2">非独家</span>
        </span>
      </div>
      <div style="background-color:#faebd7;font-size:14px;padding-bottom:10px;color:#555" class="partner_new">
        <address class="joinArea" style="margin-top:5px;margin-right:15px;height:25px">加盟区域</address>
        <div id="joinArea" style="padding-left:105px">
          <span myId="0" class="active" @click="handleClick">
              全部地区
          </span>
          <span @click="handleClick" :key='item.id' :myId='item.code' v-for="item in allcityList">
            {{item.name}}
          </span>
        </div>
      </div>
      <div style="">
        <div id="partner_header"  style="background-color:#faebd7;font-size:14px;margin-left:13px;margin-right:-20px">
          <label>
            <span style="color:#555;margin-right:-15px;margin-left:15px">关键字</span>
              <!-- <input type="text" v-on:input='inputChange' ref="val1" placeholder="企业名称\个人姓名" v-model="name" class="partner_my_input1"> -->
              <input type="text" ref="val1" placeholder="企业名称\个人姓名" v-model="name" class="partner_my_input1">
          </label>
          <label>
            <span style="color:#555;margin-left:12px;">联系方式</span>
              <!-- <input type="text" v-on:input='inputChange' ref="val2"  placeholder="手机号\邮箱" v-model="phone" class="partner_my_input2"> -->
              <input type="text"  ref="val2"  placeholder="手机号\邮箱" v-model="phone" class="partner_my_input2">
          </label>
        </div>
        <div id="partner_data_select"  style="background-color:#faebd7;font-size:14px">
          <label>
            <span style="color:#555;margin-right:7px;margin-left:5px">加盟日期</span>
            <el-date-picker
            v-model="startTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          </label>
          <label>
            <span style="color:#555;margin:0 10px">至</span>
            <el-date-picker
            v-model="endTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          </label>

          <button class="my_btn" @click="queryInfo">查询</button>
        </div>
        <div style="clear:both"></div>
      </div>
      <div>
        
      </div>
    </div>
    <div id="partner_table">
      <div id="partner_add">
        <button @click="checkAuth">添加加盟商</button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="拼命加载中"
        style="width: 100% font-size:13px;"
        :empty-text="emptyText"
        >
        <!-- <el-table-column
          prop="cityPartnerId"
          label="加盟商编号"
          min-width="70">
        </el-table-column> -->
        <el-table-column
          prop="cityPartnerId"
          label="加盟商编号"
          min-width="70">
          <template slot-scope="scope">
            <!-- $router.push('/index/partnerDetail/' +  scope.row.id + '&' + scope.row.cityPartnerId) -->
                <router-link style="color:rgb(118, 103, 233); text-decoration: none; cursor: pointer;" target='_blank' v-bind:to="{
                  path: '/index/partnerDetail/' + scope.row.id + '&' + scope.row.cityPartnerId + '&' + scope.row.joinTarget
                }">{{scope.row.cityPartnerId}}</router-link>   
          </template>
        </el-table-column>
        <el-table-column
          label="企业名称/个人姓名"
          min-width="100">
          <template slot-scope="scope">
            {{scope.row.joinTarget=='1'?scope.row.companyName:scope.row.conName}}
          </template>
        </el-table-column>
        <el-table-column
          label="加盟区域"
          min-width="100">
          <template slot-scope="scope">
            <span v-html="scope.row.joinArea"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="加盟资金(元)"
          min-width="100">
          <template slot-scope="scope">
            <span v-html="scope.row.joinMoney"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="加盟日期"
          min-width="100">
          <template slot-scope="scope">
            <span v-html="scope.row.joinDay"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="认购车辆数"
          min-width="100">
          <template slot-scope="scope">
              <span v-html="scope.row.subscriptionNumStrs"></span>
             <!-- @click='handleRowHandle(scope.row.subscription_id)'  -->
            <!-- <span><a  class="alliance_table_allocation">分配车辆</a></span> -->
            <router-link style="color:rgb(118, 103, 233); text-decoration: none; cursor: pointer;" target='_blank' v-bind:to="{
              path: '/index/vehicleDistribution/' + scope.row.id + '&' + scope.row.cityPartnerId
            }">分配车辆</router-link>
          </template>
        </el-table-column>    
        <el-table-column
          label="操作"
          prop="del"
          max-width="80">
          <template slot-scope="scope">
            <!-- <a style="color:#444; margin-right:10px; cursor: pointer;" @click="goDetail(scope)" title="查看">
              <i class="el-icon-document"></i>
            </a> -->
            <a href="javascript:;" @click="openEdit(scope.row, scope.$index)" style="color:#444; margin-right:10px;" title="编辑">
              <i class="el-icon-edit"></i>
            </a>
            <a href="javascript:;" @click='delPartner(scope.row.id,scope.row.cityPartnerId, scope.$index)' style="color:#444; margin-right:10px;" title="删除">
              <i class="el-icon-close"></i>
            </a>
            <!--dialog 弹窗开始-->
            <el-dialog title="编辑加盟商信息" :visible.sync="dialogVisible" :modal="true" :modal-append-to-body="false">
             <div id="editpartner_form">
              <el-form :model="editAccount" :rules="editRules"  ref="editAccount" label-width="139px" class="demo-ruleForm">
                <el-form-item label="企业名称" prop="companyName">
                  <el-input v-model="editAccount.companyName" placeholder='长度不超过100字符'></el-input>
                </el-form-item>
                <el-form-item label="营业执照号" prop="businessLicense">
                  <el-input v-model="editAccount.businessLicense" placeholder='请输入营业执照注册号'></el-input>
                </el-form-item>
                <el-form-item label="通讯地址" prop="address">
                  <el-input v-model="editAccount.address" placeholder='请输入地址'></el-input>
                </el-form-item>
               
                <h1 class="form_table_h1">加盟与结算信息</h1>
                <div class="mutiFormSelect" v-bind:key="list.cityName" v-for="(list,index) of editAccount.multiForm">
                   <div class="menuIcon">
                      <i style="cursor:pointer;" @click="addMutiCity" class="iconfont icon-jia"></i>
                      <i  style="cursor:pointer;" @click="removeMutiCity(index,list)" class="iconfont icon-jian"></i>
                      </div>
                     
                     <el-form-item label="加盟地区" :id="'cityId'+ index" style="width: 700px;"
                     >
                       
                       <el-input v-show="(index+1)<=recodeCityList" v-model="list.cityName" readonly></el-input>
                        <el-select v-show="(index+1)>recodeCityList" v-model="list.cityItem" placeholder="请选择">
                          <el-option
                            v-for="item in editAccount.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                          </el-option>
                        </el-select>
                     </el-form-item>   
              
                 <el-form-item label="加盟日期" :id="'joinTime'+ index" 
                     :rules="[
                        { required: true, message: '请输入加盟日期', trigger: 'blur' },
                      ]"
                  >
                    <el-date-picker
                      v-model="list.joinTime"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>           
                </el-form-item>
                <el-form-item label="车辆数" :id="'subscriptionNum'+ index" 
                   :rules="[
                    { required: true, message: '请输入认购车辆', trigger: 'blur' },
                  ]"
                >
                  <el-input v-model.number="list.subscriptionNum" placeholder='请输入车辆数(单位：/辆)'></el-input>
                </el-form-item>
                <el-form-item label="加盟资金" :id="'subscriptionMoney'+ index"
                     :rules="[
                        { required: true, message: '请输入加盟资金', trigger: 'blur' },
                      ]"
                >
                  <el-input v-model.number="list.subscriptionMoney" placeholder='请输入加盟资金（元）'></el-input>
                </el-form-item>
                <!-- <el-form-item label="加盟分成比例" prop="percent">
                  <el-input v-model="editAccount.percent" placeholder='请输入分成比例(%)'></el-input><span style="margin-left:5px;">%</span>
                </el-form-item> -->
                <el-form-item label="授权费率" :id="'licenseFeeRate'+ index"
                     :rules="[
                        { required: true, message: '请输入授权费率', trigger: 'blur' },
                      ]"
                >
                  <el-input v-model="list.licenseFeeRate" placeholder='请输入授权费率'></el-input><span style="margin-left:5px;">%</span>
                </el-form-item>
                <el-form-item label="结算周期"  :id="'wType'+ index"
                     :rules="[
                        { required: true, message: '请输入结算周期', trigger: 'blur' },
                      ]"
                >
                  <el-radio-group v-model="list.wType">
                    <!-- <el-radio label="自然月" value='0'></el-radio>
                    <el-radio label="自然周(周一到周日)" value='1'></el-radio> -->
                     <el-radio label="自然月" value='0'></el-radio>
                      <el-radio label="自然周(周一到周日)" value='1'></el-radio>
                      <el-radio label="自定义" value='2'></el-radio>
                      <el-input class="customInput" style="display:inline;width:200px;" v-show="list.wType=='自定义'"
                        v-model="list.circleDays"
                        placeholder="输入结算周期，正数">
                      </el-input> 
                  </el-radio-group>
                </el-form-item>
                 <h1 class="form_table_h2">次周期结算上一个结算周期的收益，如果第一个周期不满一个结算周期也进行结算</h1>
                <el-form-item label="第一次结算开始日期" :id="'firstDealDate'+ index"
                    :rules="[
                      { required: true, message: '请输入第一次结算开始日期', trigger: 'blur' },
                    ]"
                >
                    <el-date-picker
                      v-model="list.firstDealDate"
                      :disabled='list.isEdit'
                      placeholder="选择日期">
                    </el-date-picker>           
                </el-form-item>
                 <h1 class="form_table_h2">生成结算单后，此日期不允许修改</h1>
                </div> 
               
                <h1 class="form_table_h1">联系人信息</h1> 
                <el-form-item label="姓名" prop="userName">
                  <el-input v-model="editAccount.userName" placeholder='请输入姓名'></el-input>
                </el-form-item>
                <el-form-item label="证件类别" prop="cardType">
                  <el-select v-model="editAccount.cardType" placeholder="请选择证件类别">
                    <el-option label="身份证" value="身份证"></el-option>
                    <el-option label="护照" value="护照"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="证件号码" prop="idCard">
                  <el-input v-model="editAccount.idCard" placeholder='请输入证件号码'></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="editAccount.phone" placeholder='请输入手机号'></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editAccount.email" placeholder='请输入邮箱'></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName" v-show='add'>
                  <el-input v-model="editAccount.userName" placeholder='请输入用户名'></el-input>
                </el-form-item>
              </el-form>
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  :with-credentials='true'
                  action=''
                  :http-request = 'uploadWay'
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 100%;">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <h3>点击更换营业执照</h3>
                </el-upload>
                
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="partner_button" type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click="submitForm('editAccount')">确定</el-button>
                <el-button class="partner_button" @click="cancelEdit">取消</el-button>
              </div>
            </el-dialog>
            <!--dialog 弹窗结束-->
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage3"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="totalItems"
        v-show="pageShow"
        >
      </el-pagination>
    </div>
    <router-view id="partnerManager_router"></router-view>
  </div>
</template>

<style scoped>
.partner_new {
  padding-top:10px;
}
.partner_new span {
  padding:5px;
  cursor:pointer;
  border:1px solid transparent;
}
address.joinArea {
    font-style: normal;
    display: inline;
    font-size: 14px;
    margin-left: 34px;
    margin-right: 10px;
    float: left;
}
#joinArea span {
  /* line-height:30px; */
  display: inline-block;
 
}
span.active {
    border: 1px solid orange;
    border-radius: 4px;
  }
div.menuIcon {
  text-align: right;

  margin-bottom: 10px;
  position: relative;
}
div.menuIcon i.iconfont {
  position: absolute;
  right: 0;
  z-index: 99;
}
div.menuIcon i.icon-jian {
  right: -36px;
}
.form_table_h2 {
  width: 100%;
  padding: 0px 0 10px 140px;
  height: 30px;
  line-height: 0px;
  font-size: 10px;
  font-weight: 400;
  color: #ddd;
}
.alliance_table_allocation {
  color: #f60;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 6px;
}

#partnerManager_router {
  width: 100%;
  height: 100%;
  background: rgba(68, 68, 68, 0.6);
  position: fixed;
  z-index: 10000000000000000;
  left: 0;
  top: 0;
}
#partner_header {
  height: 55px;
  background: #fff;
  /* border: 1px solid #e7ecf1; */
  border-bottom: none;
  float:left;
  padding-left:20px;
}
#partner_header .partner_my_input1 {
    width: 133px;
    height: 34px;
    outline: none;
    margin-left: 25px;
    border-radius: 4px;
    border: 1px solid #ddd;
    text-indent: 8px;
    display: inline-block;
    font-size:inherit
}

#partner_header .partner_my_input2 {
    width: 133px;
    border-radius: 4px;
    height: 34px;
    outline: none;
    margin-left: 10px;
    text-indent: 10px;
    border: 1px solid #ddd;
    display: inline-block;
    font-size:inherit
} 
#partner_data_select {
    height: 55px;
    background: #fff;
    margin-left: 475px;
    /* border: 1px solid #e7ecf1; */
    border-top: none;
}

#partner_data_select button:hover {
  color: #20a0ff;
  border-color: #20a0ff;
}
#partner_data_select .my_btn {
  margin-right:20px;
}

::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #dddddd;
  font-weight: 400;
}

:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #dddddd;
  font-weight: 400;
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #dddddd;
  font-weight: 400;
}

:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #dddddd;
  font-weight: 400;
}


#partner_table {
  padding: 0 30px 30px 30px;
  background: #fff;
  border: 1px solid #e7ecf1;
  /* border-bottom: none; */
  margin-top: 20px;
}

#partner_table .el-pagination {
  white-space: nowrap;
  padding: 2px 5px;
  color: #48576a;
  margin-top: 10px;
  margin-left: -5px;
  border: none;
  background: #fff;
  /* border-left: 1px solid #f3f3f5; */
}

#partner_add {
  width: 90%;
  height: 68px;
  line-height: 68px;
}

#partner_add button {
  width: 100px;
  height: 30px;
  line-height: 25px;
  display: inline-block;
  border: none;
  outline: none;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  background: rgba(66, 66, 66, 0.8);
  transition: all 0.2s linear 0s;
}

#partner_add button:hover {
  background: rgb(66, 66, 66);
  cursor: pointer;
}

#partner_page {
  padding: 4px 10px 0 20px;
  padding-bottom: 100px;
  background: #fff;
  border: 1px solid #e7ecf1;
  border-top: none;
  min-height: 230px;
}

.partner_button:nth-of-type(1) {
  background: #f87e2b;
  border: none;
  color: #fff;
  margin-left: 214px;
  margin-top: -30px;
  margin-bottom: 20px;
}

.partner_button:nth-of-type(1):hover {
  background: rgba(248, 126, 43, 0.9);
}

.partner_button:nth-of-type(2) {
  background: #fff;
  color: #444;
  margin-top: -30px;
  margin-bottom: 20px;
  border: 1px solid rgba(196, 196, 196, 1);
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
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.el-input__inner::-webkit-input-placeholder {
  color: #ddd;
}

.el-date-table td.current:not(.disabled),
.el-date-table td.end-date,
.el-date-table td.start-date {
  background: black !important;
  color: #fff !important;
}

.el-input__inner:hover {
  border: 1px solid #bbb;
}

/**华丽的分割线**/
.demo-ruleForm {
  position: relative;
}
.avatar-uploader {
  border-radius: 6px;
  cursor: pointer;
  height: 200px;
  width: 300px;
  float: left;
  border: 1px dashed #ddd;
  position: absolute;
  text-align: center;
  right: 10%;
  top: 0;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #ccc;
  width: 10px;
  height: 10px;
  line-height: 200px;
}
.avatar-uploader h3 {
  margin-top: 20px;
  font-size: 18px;
  text-align: center;
  margin-left: 14px;
  color: #ccc;
}
.form_table_h1 {
  width: 100%;
  line-height: 30px;
  padding: 40px 0 10px 3px;
  height: 30px;
  font-size: 16px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
.avatar {
  height: 200px;
  width: 300px;
  display: block;
  box-shadow: content-box;
  overflow: hidden;
}

.avatar img {
  width: 100%;
}
div#editpartner_form {
  position: relative;
}

.my_btn {
  width: 80px;
  float: right;
  height: 36px;
  line-height: 11px;
  color: #fff;
  /*margin-top: 10px;*/
  outline: none;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: rgba(52, 52, 67, 0.8);
}

.my_btn:hover {
  background: rgba(52, 52, 67, 0.9);
  color: #fff !important;
}
</style>

<script>
// import $ from "jquery";
import request from "superagent";
import moment from "moment";
import { host } from "../../../config/index";
import { isCardNo, isPassportNo } from "../../../../utils/index.js";
import {siblings} from '../../../../utils/index.js'
import {toThousands} from '../../../util/util.js'
export default {
  data() {
    var checkTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择加盟日期"));
      } else {
        callback();
      }
    };
    var checkSubscriptionNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写认购车辆数"));
      } else {
        request
          .post(host + "beepartner/admin/cityPartner/checkBikeNum")
          .withCredentials()
          .set({
            "content-type": "application/x-www-form-urlencoded"
          })
          .send({
            cityPartnerId: this.editAccount.cityPartnerId,
            subscriptionNum: this.editAccount.subscriptionNum
          })
          .end((err, res) => {
            if (err) {
              console.log(err);
            } else {
              var code = JSON.parse(res.text).resultCode;
              var message = JSON.parse(res.text).message;
              if (code === 0) {
                callback();
              } else {
                callback(new Error(message));
              }
            }
          });
      }
    };
    var checkId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("证件号码不能为空"));
      }
      setTimeout(() => {

        if (this.editAccount.cardType === "护照") {
          if (isPassportNo(value) === false) {
            callback(new Error("请输入正确的护照号"));
          } else {
            callback();
          }
        } else {
          if (isCardNo(value) === false) {
            callback(new Error("请输入正确的身份证号"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      html:"",
      joinArea:[],
      joinMode:"",
      allcityList:[],
      recodeCityList:'',
      initNum: 0,
      isClickAddBtn: false,
      adddialogFormVisible: false,
      addForm: {
        cityId: "",
        cityName: "",
        licenseFeeRate: "",
        firstDealDate: "",
        wType: "",
        subscriptionNum: "",
        subscriptionMoney: "",
        circleDays: ""
      },
      newFormObject: {
        cityItem: "",
        cityName: "",
        cityId: "",
        joinTime: "",
        subscriptionNum: "",
        subscriptionMoney: "",
        licenseFeeRate: "",
        wType: "",
        firstDealDate: "",
        circleDays: ""
      },
      areaShow: true,
      proloading: false,
      provinceList: [],
      cityList: [],
      areaList: [],
      emptyText: " ",
      name: "",
      phone: "",
      startTime: "",
      endTime: "",
      currentPage3: 1,
      currentPage: this.$route.query.currentPage||1,
      totalItems: 1,
      pageShow: false,
      tableData: [],
      userIDID: "",
      loading: false,
      options: [
        {
          value: "0",
          label: ">"
        },
        {
          value: "1",
          label: "<"
        },
        {
          value: "2",
          label: "="
        },
        {
          value: "3",
          label: "<="
        },
        {
          value: "4",
          label: "=>"
        }
      ],
      value: "",
      pagetotal: "",
      dialogVisible: false,
      formLabelWidth: "70px",
      editAccount: {
         multiForm: [],
        options: [],
        companyName: "",
        businessLicense: "",
        address: "",
        percent: "",
        userName: "",
        cardType: "",
        idCard: "",
        phone: "",
        email: "",
        userId: "",
        password: "",
        file: "",
        cityPartnerId: "",
        cnName:"",
      },
      editRules: {
        companyName: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        businessLicense: [
          { required: true, message: "请输入营业执照号", trigger: "blur" }
        ],
        address: [{ message: "请输入正确的地址", trigger: "blur" }],
        joinTime: [{ validator: checkTime, required: true, trigger: "blur" }],
        subscriptionNum: [
          {
            validator: checkSubscriptionNum,
            type: "number",
            required: true,
            trigger: "blur"
          }
        ],
        subscriptionMoney: [
          {
            type: "number",
            required: true,
            message: "输入正确的金额",
            trigger: "blur"
          }
        ],
        cityName: [{ required: true, message: "请选择加盟城市", tigger: "change" }],
        cardType: [{ required: true, message: "请选择证件类型", trigger: "blur" }],
        percent: [{ required: true, message: "请输入加盟比例", trigger: "blur" }],
        userName: [{ message: "请输入姓名", trigger: "blur" }],
        idCard: [{ validator: checkId, required: true, trigger: "blur" }],
        phone: [
          { message: "请填写手机号", trigger: "blur" },
          { min: 11, message: "请输入正确的手机号", trigger: "blur" }
        ],
        email: [{ message: "请填写正确邮箱", trigger: "blur" }],
        licenseFeeRate: [
          { required: true, message: "请输入授权费率", trigger: "blur" }
        ],
        wType: [{ required: true, message: "请选择结算周期", tigger: "blur" }]
      },
      add: false,
      imageUrl: "",
      fullscreenLoading: false,
      searchDate1: "",
      searchDate2: "",
      search_Number: "",
      date1: "",
      date2: "",
      imageUrl: "",
      isSearch: false,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      isSettleList: []
    };
  },
  mounted() {
    $(".sign").removeClass("is-active");
    $('.sign[name="20"]').addClass("is-active");
    document.title = "加盟商管理";
    this.loadData();
    
  },
  created() {
    // 初始化调用查询可加盟城市的接口,动态渲染数据
    request
      .post(host + "beepartner/admin/city/findAreaAlreadyOpen")
      .withCredentials()
      .set({
        "content-type": "application/x-www-form-urlencoded"
      })
      .send({
        unUsed: 1
      })
      .end((error, res) => {
        if (error) {
          console.log(error);
        } else {
          var result = JSON.parse(res.text);
          this.editAccount.options = result.map(item => {
            return {
              value: item.code,
              label: item.name
            };
          });
        }
      });
    // 初始化调用查询加盟商是否生成结算单，若已生成，则第一次结算周期 input 不可编辑
    this.isHaveSettleOrders = false; // true 不可编辑

    this.getCityList();
  },
  methods: {
      handleClick(e){
          var elems = siblings(e.target)
          for (var i = 0; i < elems.length; i++) {
            elems[i].setAttribute('class', '')
          }
          e.target.setAttribute('class', 'active')
  
          // 查询
           this.isSearch = true;

              // 判断点击城市的时候清空查询信息，点击独家非独家不清空,要进行日期验证
              if(!(e.target.innerText == '全部'||e.target.innerText == '独家'||e.target.innerText=='非独家')){
                this.name = ''
                this.phone = ''
                this.startTime = ''
                this.endTime = ''
              }
              // else{

                var _startTime = new Date(this.startTime).getTime()
                  var _endTime = new Date(this.endTime).getTime()
                  _endTime = isNaN(_endTime) ? 0 : _endTime
                  _startTime = isNaN(_startTime) ? 0 : _startTime

              if(_startTime!="" &&_endTime!=""&&_endTime<_startTime){
                this.$message({
                  type: 'warning',
                  message: '开始日期不能大于结束日期'
                })
                return
             }

                //   if (_endTime > 1 && _startTime <= 1) {
                //       this.$message({
                //         type: 'warning',
                //         message: '开始日期不能为空'
                //       })
                //       return
                //  } 
                // if (_endTime < 0) {
                //   this.$message({
                //     type: 'warning',
                //     message: '结束日期不能为空'
                //   })
                // } else {
                //   if(_endTime<_startTime){
                //     this.$message({
                //       type: 'warning',
                //       message: '开始日期不能大于结束日期'
                //     })
                //     return
                //   }
                // }
              // }


               var name = this.name.trim();
               var phone = this.phone.trim();
               var startTime = this.startTime;
               var endTime = this.endTime;
                request
                  .post(host + "beepartner/admin/cityPartner/findCityPartner")
                  .withCredentials()
                  .set({
                    "content-type": "application/x-www-form-urlencoded"
                  })
                  .send({
                    joinMode:$("#joinMode span.active").attr("mode"),
                    cityId:$("#joinArea span.active").attr("myId"),
                    // name: this.name.trim(),
                    // phone: this.phone.trim(),
                    // startTime: 
                    //   this.startTime === ""
                    //     ? ""
                    //     : moment(this.startTime).format("YYYY-MM-DD"),
                    // endTime:
                    //   this.endTime === ""
                    //     ? ""
                    //     : moment(this.endTime).format("YYYY-MM-DD")
                    name: name,
                    phone: phone,
                    startTime: startTime === "" ? "" : moment(startTime).format("YYYY-MM-DD"),
                    endTime: endTime === "" ? "" : moment(endTime).format("YYYY-MM-DD")
                  })
                  .end((err, res) => {
                    if (err) {
                      this.loading = false;
                      console.log("err:" + err);
                    } else {
                      
                      this.checkLogin(res);
                      this.loading = false;
                      var newArr = JSON.parse(res.text).data || [];
                      var result = newArr.map(item => {
                        return Object.assign({}, item, {
                          joinTime: moment(item.joinTime).format("YYYY-MM-DD")
                        });
                      });
                      if (JSON.parse(res.text).data === "") {
                        this.emptyText = "暂无数据";
                      }
                      var pageNumber = Number(JSON.parse(res.text).totalPage);
                      this.totalItems = Number(JSON.parse(res.text).totalItems);
                      this.tableData = result;
                      // 一个td内显示内容过多时进行换行处理
                      for(var i = 0;i < this.tableData.length; i ++){
                        this.tableData[i].joinArea = this.tableData[i].cityList.replace(/\//g,"/<br>")
                        this.tableData[i].joinMoney = this.tableData[i].joinMoneys.replace(/\//g,"/<br>")
                        this.tableData[i].joinDay = this.tableData[i].joinDays.replace(/\//g,"/<br>")
                        this.tableData[i].subscriptionNumStrs = this.tableData[i].subscriptionNumStr.replace(/\//g,"/<br>")
                      }
                      if (pageNumber > 1) {
                        this.pageShow = true;
                      } else {
                        this.pageShow = false;
                      }
                    }
                  });
      

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
            this.allcityList = res.body
            // this.checkLogin(res)
          }
        })
    },
    cancelEdit(){
      this.dialogVisible = false
      this.loadData()
    },
    addMutiCity() {
      // 初始化调用查询可加盟城市的接口,动态渲染数据
      request
        .post(host + "beepartner/admin/city/findAreaAlreadyOpen")
        .withCredentials()
        .set({
          "content-type": "application/x-www-form-urlencoded"
        })
        .send({
          unUsed: 1
        })
        .end((error, res) => {
          if (error) {
            console.log(error);
          } else {
            var result = JSON.parse(res.text);
            if(result.length==0){
              this.$message({
                type:'error',
                message:'对不起，暂时无可加盟地区'
              })
              return;
            }
            this.editAccount.options = result.map(item => {
              return {
                value: item.code,
                label: item.name
              };
            });
          }
        });
      this.isClickAddBtn = true;
      this.editAccount.multiForm.push(
        Object.assign({}, this.newFormObject, { id: this.initNum++ })
      );
    },
    removeMutiCity(index, list) {
      if(this.editAccount.multiForm.length==1){
        this.$message({
          type:'error',
          message:'对不起，请至少保留一个地区'
        })
        return
      }
      var cityId = '';
      var cityPartnerId = ''
      if(!list.cityId){
        this.editAccount.multiForm.splice(index, 1);
        return;
      }else{
        cityId = list.cityId;
        cityPartnerId = list.cityPartnerId;
      }
      request
        .post(host + "beepartner/admin/withDraw/findWithdrawsCount")
        .withCredentials()
        .set({
          "content-type": "application/x-www-form-urlencoded"
        })
        .send({
          cityId: cityId,
          cityPartnerId: cityPartnerId
        })
        .end((error, res) => {
          if (error) {
            console.log(error);
          } else {
            var result = JSON.parse(res.text).data;
             if (result[0].withDrawCount == 0) {
                this.editAccount.multiForm.splice(index, 1);
                this.recodeCityList--
            }
            if (result[0].withDrawCount > 0) {
              this.$confirm('该地区有结算单, 是否继续删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                 this.editAccount.multiForm.splice(index, 1);
                this.recodeCityList--
                 $('.v-modal').hide() 
              }).catch(() => {
                $('.v-modal').hide()        
              });
            } else {
               return;
              this.$refs["editAccount"].validate(valid => {
                if (valid) {
                  if (this.editAccount.file === "" && this.imageUrl === null) {
                    this.$message({
                      message: "请上传营业执照",
                      type: "warning"
                    });
                    return;
                  }
                  var that = this;
                  //this.fullscreenLoading = true
                  var newMultForm = this.editAccount.multiForm.map(item => {
                    var wType, joinTime, firstDealDate;
                    if (item.wType === "自然月") {
                      wType = 0;
                    } else if (item.wType === "自然周(周一到周日)") {
                      wType = 1;
                    } else {
                      wType = 2;
                    }
                    joinTime = moment(item.joinTime).format("YYYY-MM-DD");
                    firstDealDate = moment(item.firstDealDate).format(
                      "YYYY-MM-DD"
                    );
                    delete item.cityItem;
                    return Object.assign(
                      {},
                      item,
                      { wType: wType },
                      { joinTime: joinTime },
                      { firstDealDate: firstDealDate }
                    );
                  });
                  delete this.editAccount.options;
                  delete this.editAccount.provinceId;
                  delete this.editAccount.provinceName;
                  delete this.editAccount.areaId;
                  delete this.editAccount.areaName;
                  delete this.editAccount.cityId;
                  delete this.editAccount.cityName;
                  delete this.editAccount.joinTime;
                  delete this.editAccount.licenseFeeRate;
                  delete this.editAccount.percent;
                  delete this.editAccount.subscriptionMoney;
                  delete this.editAccount.subscriptionNum;
                  delete this.editAccount.wType;
                  var obj = Object.assign(
                    {},
                    { id: this.userIDID },
                    this.editAccount,
                    { cityList: JSON.stringify(newMultForm) },
                    { cardType: this.editAccount.cardType === "身份证" ? 0 : 1 }
                  );
                  request
                    .post(
                      host + "beepartner/admin/cityPartner/updateCityPartner"
                    )
                    .withCredentials()
                    .set({
                      "content-type": "application/x-www-form-urlencoded"
                    })
                    .send(obj)
                    .end((error, res) => {
                      if (error) {
                        console.log(error);
                      } else {
                        var code = JSON.parse(res.text).resultCode;
                        if (code === 0) {
                          that.checkLogin(res)
                          that.loadData()
                        } else {
                        }
                      }
                    });
                } else {
                  return false;
                }
              });
            }
          }
        });

      //this.multiForm.splice(index,1)
    },
    checkAuth() {
      // 初始化调用查询可加盟城市的接口,动态渲染数据
      request
        .post(host + "beepartner/admin/city/checkNotUsedCityNum")
        .withCredentials()
        .set({
          "content-type": "application/x-www-form-urlencoded"
        })
        .send({
          unUsed: 1
        })
        .end((error, res) => {
          if (error) {
            console.log(error);
          } else {
            // var result = JSON.parse(res.text);
           
            if (res<= 0) {
              this.$message({
                type: "error",
                message: "对不起，暂时无可加盟地区"
              });
            } else {
              this.$router.push({ path: "/index/partnerManager/addpartner" });
            }
          }
        });
      //this.$router.push({path:'/index/partnerManager/addpartner'})
    },
    loadData() {
      this.loading = true;
      var that = this;
      request
        .post(host + "beepartner/admin/cityPartner/findCityPartner")
        .withCredentials()
        .set({
          "content-type": "application/x-www-form-urlencoded"
        })
        .send({
          name: that.name,
          phone: that.phone,
          startTime: that.startTime,
          endTime: that.endTime,
          joinMode:$("#joinMode span.active").attr("mode"),
          cityId:$("#joinArea span.active").attr("myId"),
          currentPage:this.currentPage

        })
        .end((err, res) => {
          if (err) {
            this.loading = false;
            this.emptyText = "暂无数据";
            console.log("err:" + err);
          } else {
            this.checkLogin(res);
            this.loading = false;
            var code = JSON.parse(res.text).resultCode;
            if (code === 1) {
              var newArr = JSON.parse(res.text).data;
              var result = newArr.map(item => {
                return Object.assign({}, item, {
                  joinTime:
                    item.joinTime === null
                      ? ""
                      : moment(item.joinTime).format("YYYY-MM-DD")
                });
              });
              var pageNumber = Number(JSON.parse(res.text).totalPage);
              this.totalItems = Number(JSON.parse(res.text).totalItems);
              that.$store.state.users.keepParnterAccount = [];
              result.reverse().map(item => {
                that.$store.commit("keepParnterAccount", item);
              });
              this.tableData = that.$store.state.users.keepParnterAccount;
              // 一个td内显示内容过多时进行换行处理
              for(var i = 0;i < this.tableData.length; i ++){
                this.tableData[i].joinArea = this.tableData[i].cityList.replace(/\//g,"/<br>")
                this.tableData[i].joinMoney = this.tableData[i].joinMoneys.replace(/\//g,"/<br>")
                this.tableData[i].joinDay = this.tableData[i].joinDays.replace(/\//g,"/<br>")
                this.tableData[i].subscriptionNumStrs = this.tableData[i].subscriptionNumStr.replace(/\//g,"/<br>")
              }
              // console.log("loadData",this.tableData)
              if (pageNumber > 1) {
                that.pageShow = true;
              } else {
                that.pageShow = false;
                that.emptyText = "暂无数据";
              }
            } else {
              that.emptyText = "暂无数据";
              return;
            }
          }
        });
    },
    handleEditProvince(val) {
      if (this.provinceList.length > 0) {
        this.provinceList.map(item => {
          if (val === item.name) {
            this.editAccount.provinceId = item.id;
          }
        });
        // this.editAccount.cityName = ''
        this.filterCityMethod();
      }
    },
    handleEditCity(val) {
      if (this.cityList.length > 0) {
        this.cityList.map(item => {
          if (val === item.name) {
            this.editAccount.cityId = item.id;
          }
        });
        // this.editAccount.areaName = ''
        this.filterAreaMethod();
      }
    },
    handleEditArea(val) {
      if (this.areaList.length > 0) {
        this.areaList.map(item => {
          if (val === item.name) {
            this.editAccount.areaId = item.id;
            this.editAccount.cityId = item.code;
          }
        });
        //this.ruleForm.areaName = ''
        //this.filterAreaMethod()
      }
    },
    filterProvinceMethod() {
      request
        .post(host + "beepartner/admin/cityPartner/getProvince")
        .withCredentials()
        .set({
          "content-type": "application/x-www-form-urlencoded"
        })
        .end((error, res) => {
          if (error) {
            console.log(error);
          } else {
            this.checkLogin(res);
            var result = JSON.parse(res.text).data;
            var provinceList = result.map(item => {
              var obj = {};
              obj.id = item.id;
              obj.name = item.name;
              return obj;
            });
            this.provinceList = provinceList;
          }
        });
    },
    filterCityMethod() {
      if (this.editAccount.provinceId) {
        request
          .post(host + "beepartner/admin/cityPartner/getChildrenArea")
          .withCredentials()
          .set({
            "content-type": "application/x-www-form-urlencoded"
          })
          .send({
            id: this.editAccount.provinceId
          })
          .end((error, res) => {
            if (error) {
              console.log(error);
            } else {
              this.checkLogin(res);
              var result = JSON.parse(res.text).data;
              var cityList = result.map(item => {
                var obj = {};
                obj.id = item.id;
                obj.name = item.name;
                return obj;
              });
              this.cityList = cityList;
            }
          });
      }
    },
    filterAreaMethod() {
      if (this.editAccount.provinceId) {
        request
          .post(host + "beepartner/admin/cityPartner/getChildrenArea")
          .withCredentials()
          .set({
            "content-type": "application/x-www-form-urlencoded"
          })
          .send({
            id: this.editAccount.cityId
          })
          .end((error, res) => {
            if (error) {
              console.log(error);
            } else {
              this.checkLogin(res);
              var result = JSON.parse(res.text).data;
              if (result.length === 0) {
                this.areaShow = false;
              } else {
                this.areaShow = true;
              }
              var areaList = result.map(item => {
                var obj = {};
                obj.id = item.id;
                obj.name = item.name;
                obj.code = item.code;
                return obj;
              });
              this.areaList = areaList;
            }
          });
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 2048 / 2048 < 2;
      if (!isJPG) {
        this.$message.error("上传营业执照图片只能是 jpg、jpeg、png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传的图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    uploadWay(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file.file);
      var data;
      var that = this;
      reader.onload = function(e) {
        data = this.result;
        that.imageUrl = data;
        that.editAccount.file = JSON.stringify(data);
      };
    },
    queryInfo() {
    
      this.isSearch = true;

      var name = this.name.trim();
      var phone = this.phone.trim();
      // var startTime = this.startTime;
      // var endTime = this.endTime;
      // var startTime,endTime
      // if (this.startTime === '' || this.endTime === '') {
      //   startTime = ''
      //   endTime = ''
      // } else {
        // startTime = moment(this.startTime).format('YYYY-MM-DD')
        // endTime = moment(this.endTime).format('YYYY-MM-DD')
      // }
       var _startTime = new Date(this.startTime).getTime()
        var _endTime = new Date(this.endTime).getTime()
        _endTime = isNaN(_endTime) ? 0 : _endTime
        _startTime = isNaN(_startTime) ? 0 : _startTime
         if(_startTime!="" &&_endTime!=""&&_endTime<_startTime){
              this.$message({
                type: 'warning',
                message: '开始日期不能大于结束日期'
              })
              return
        }

        //  if (_endTime > 1 && _startTime <= 1) {
        //     this.$message({
        //       type: 'warning',
        //       message: '开始日期不能为空'
        //     })
        //     return
        //   } 
        // if (_endTime < 0) {
        //     this.$message({
        //       type: 'warning',
        //       message: '结束日期不能为空'
        //     })
        //     return
        //   } else {
            // if(_endTime<_startTime){
            //   this.$message({
            //     type: 'warning',
            //     message: '开始日期不能大于结束日期'
            //   })
            //   return
            // }
        //   }
      // if (
      //   name.length === 0 &&
      //   phone.length === 0 &&
      //   startTime.toString().length === 0 &&
      //   endTime.toString().length === 0
      // ) {
      //   this.$message({
      //     type: "warning",
      //     message: "查询条件不能为空！"
      //   });
      //   return 
      // } else {
        request
          .post(host + "beepartner/admin/cityPartner/findCityPartner")
          .withCredentials()
          .set({
            "content-type": "application/x-www-form-urlencoded"
          })
          .send({
            joinMode:$("#joinMode span.active").attr("mode"),
            cityId:$("#joinArea span.active").attr("myId"),
            name: this.name.trim(),
            phone: this.phone.trim(),
            startTime:
              this.startTime === ""
                ? ""
                : moment(this.startTime).format("YYYY-MM-DD"),
            endTime:
              this.endTime === ""
                ? ""
                : moment(this.endTime).format("YYYY-MM-DD")
          })
          .end((err, res) => {
            if (err) {
              this.loading = false;
              console.log("err:" + err);
            } else {
              
              this.checkLogin(res);
              this.loading = false;
              var newArr = JSON.parse(res.text).data || [];
              var result = newArr.map(item => {
                return Object.assign({}, item, {
                  joinTime: moment(item.joinTime).format("YYYY-MM-DD")
                });
              });
              if (JSON.parse(res.text).data === "") {
                this.emptyText = "暂无数据";
              }
              var pageNumber = Number(JSON.parse(res.text).totalPage);
              this.totalItems = Number(JSON.parse(res.text).totalItems);
              this.tableData = result;
              // 一个td内显示内容过多时进行换行处理
              for(var i = 0;i < this.tableData.length; i ++){
                this.tableData[i].joinArea = this.tableData[i].cityList.replace(/\//g,"/<br>")
                this.tableData[i].joinMoney = this.tableData[i].joinMoneys.replace(/\//g,"/<br>")
                this.tableData[i].joinDay = this.tableData[i].joinDays.replace(/\//g,"/<br>")
                this.tableData[i].subscriptionNumStrs = this.tableData[i].subscriptionNumStr.replace(/\//g,"/<br>")
              }
              if (pageNumber > 1) {
                this.pageShow = true;
              } else {
                this.pageShow = false;
              }
            }
          });
      // }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.currentPage = val;
      request
        .post(host + "beepartner/admin/cityPartner/findCityPartner")
        .withCredentials()
        .set({
          "content-type": "application/x-www-form-urlencoded"
        })
        .send({
          joinMode:$("#joinMode span.active").attr("mode"),
          cityId:$("#joinArea span.active").attr("myId"),
          currentPage: val,
          name: this.isSearch === false ? "" : this.name.trim(),
          phone: this.isSearch === false ? "" : this.phone.trim(),
          startTime:
            this.startTime === ""
              ? ""
              : moment(this.startTime).format("YYYY-MM-DD"),
          endTime:
            this.endTime === "" ? "" : moment(this.endTime).format("YYYY-MM-DD")
        })
        .end((err, res) => {
          if (err) {
            this.loading = false;
            this.emptyText = "暂无数据";
            console.log("err:" + err);
          } else {
            this.checkLogin(res);
            this.loading = false;
            var newArr = JSON.parse(res.text).data;
            var result = newArr.map(item => {
              return Object.assign({}, item, {
                joinTime:
                  item.joinTime === null
                    ? ""
                    : moment(item.joinTime).format("YYYY-MM-DD")
              });
            });
            var pageNumber = Number(JSON.parse(res.text).totalPage);
            this.totalItems = Number(JSON.parse(res.text).totalItems);
            this.tableData = result;
            // 一个td内显示内容过多时进行换行处理
              for(var i = 0;i < this.tableData.length; i ++){
                this.tableData[i].joinArea = this.tableData[i].cityList.replace(/\//g,"/<br>")
                this.tableData[i].joinMoney = this.tableData[i].joinMoneys.replace(/\//g,"/<br>")
                this.tableData[i].joinDay = this.tableData[i].joinDays.replace(/\//g,"/<br>")
                this.tableData[i].subscriptionNumStrs = this.tableData[i].subscriptionNumStr.replace(/\//g,"/<br>")
              }
            if (pageNumber > 1) {
              this.pageShow = true;
            } else {
              this.pageShow = false;
            }
          }
        });
    },
    delPartner(id, cityPartnerId, index) {
      this.$confirm("此操作将永久删除该加盟商信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request
            .post(host + "beepartner/admin/cityPartner/delCityPartner")
            .withCredentials()
            .set({
              "content-type": "application/x-www-form-urlencoded"
            })
            .send({
              id: id,
              cityPartnerId: cityPartnerId
            })
            .end((err, res) => {
              if (err) {
                console.log("err:" + err);
              } else {
                this.checkLogin(res);
                var message = JSON.parse(res.text).message;
                if (JSON.parse(res.text).resultCode === 0) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.$store.state.users.keepParnterAccount.splice(index, 1);
                } else {
                  this.$message({
                    type: "error",
                    message: message
                  });
                }
              }
            });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        });
    },
    goDetail(scope) {
      this.$router.push(
        "/index/partnerDetail/" + scope.row.id + "&" + scope.row.cityPartnerId
      );
    },
    checkSettleTime(id) {
      var newArr = [];
      request
        .post(host + "beepartner/admin/withDraw/findWithdrawsCount")
        .withCredentials()
        .set({
          "content-type": "application/x-www-form-urlencoded"
        })
        .send({
          cityPartnerId: id
        })
        .end((error, res) => {
          if (error) {
            console.log(error);
          } else {
            this.checkLogin(res);
            var list = JSON.parse(res.text).data;
            var arr = [];
            list.map(item => {
              var obj = {};

              if (Number(item.withDrawCount) > 0) {
                obj.isEdit = false;
              } else {
                obj.isEdit = true;
              }
              obj.cityPartnerId = item.cityPartnerId;
              arr.push(obj);

              return arr;
            });
            this.isSettleList = arr;
          }
        });
    },
    openEdit(row, index) {
      // console.log(row)
     this.$router.push({ path: "/index/partnerManager/updatepartner",query:{cityPartnerId:row.cityPartnerId,joinTarget:row.joinTarget,currentPage:this.currentPage}});
    //  console.log(row)
      return;
      request
        .post(host + "beepartner/admin/withDraw/findWithdrawsCount")
        .withCredentials()
        .set({
          "content-type": "application/x-www-form-urlencoded"
        })
        .send({
          cityPartnerId: row.cityPartnerId,
          joinTarget:row.joinTarget
        })
        .end((error, res) => {
          if (error) {
            console.log(error);
          } else {
            this.checkLogin(res);
            var newArr = [];
            var list = JSON.parse(res.text).data;
            // console.log(list)
            var arr = [];
            list.map(item => {
              var obj = {};

              if (Number(item.withDrawCount) > 0) {
                obj.isEdit = true;
              } else {
                obj.isEdit = false;
              }

              obj.cityId = item.cityId;
              arr.push(obj);

              return arr;
            });
            newArr = arr;
            this.dialogVisible = true;
            var newMultForm = row.areaList.map(item => {
              var wType, joinTime, firstDealDate, isEdit;
              if (item.wType == 0) {
                wType = "自然月";
              } else if (item.wType == 1) {
                wType = "自然周(周一到周日)";
              } else {
                wType = "自定义";
              }
              for (var i = 0; i < newArr.length; i++) {
                if (Number(item.cityId) === Number(newArr[i].cityId)) {
                  isEdit = newArr[i].isEdit;
                }
              }
              return Object.assign(
                {},
                item,
                { wType: wType },
                { isEdit: isEdit }
              );
            });

            this.editAccount.multiForm = newMultForm;
            this.recodeCityList =  this.editAccount.multiForm.length
            this.imageUrl = row.businessLicenseIconUrl;
            this.userIDID = row.id;
            this.editAccount.companyName = row.companyName;
            this.editAccount.conName = row.conName;
            this.editAccount.businessLicense = row.businessLicense;
            this.editAccount.address = row.address;
            this.editAccount.userName = row.userName;
            this.editAccount.cardType = row.cardType == 0 ? "身份证" : "护照";
            this.editAccount.phone = row.phone;
            this.editAccount.email = row.email;
            this.editAccount.userId = row.userId;
            this.editAccount.idCard = row.idCard;
            this.editAccount.password = row.password;
            this.editAccount.cityPartnerId = row.cityPartnerId;
          }
        });
    },
    editConfim() {
      var that = this;
      //this.fullscreenLoading = true
      var newMultForm = this.editAccount.multiForm.map(item => {
        var cityName = item.cityId.label;
        var cityId = item.cityId.value;
        var wType, joinTime, firstDealDate;
        if (item.wType === "自然月") {
          wType = 0;
        } else if (item.wType === "自然周(周一到周日)") {
          wType = 1;
        } else {
          wType = 2;
        }
        joinTime = moment(item.joinTime).format("YYYY-MM-DD");
        firstDealDate = moment(item.firstDealDate).format("YYYY-MM-DD");
        return Object.assign(
          {},
          item,
          { wType: wType },
          { joinTime: joinTime },
          { firstDealDate: firstDealDate },
          { cityName: cityName },
          { cityId: cityId }
        );
      });

      delete this.editAccount.areaId;
      delete this.editAccount.areaName;
      delete this.editAccount.cityId;
      delete this.editAccount.cityName;
      delete this.editAccount.joinTime;
      delete this.editAccount.licenseFeeRate;
      delete this.editAccount.percent;
      delete this.editAccount.subscriptionMoney;
      delete this.editAccount.subscriptionNum;
      delete this.editAccount.wType;

      var obj = Object.assign(
        {},
        this.editAccount,
        { cityList: JSON.stringify(newMultForm) },
        { cardType: this.editAccount.cardType === "身份证" ? 0 : 1 }
      );
      request
        .post(host + "beepartner/admin/cityPartner/updateCityPartner")
        .withCredentials()
        .set({
          "content-type": "application/x-www-form-urlencoded"
        })
        .send(obj)
        .end((error, res) => {
          if (error) {
            console.log(error);
          } else {
            this.checkLogin(res);
          }
        });
      that.$store.state.users.keepParnterAccount.splice(
        this.editAccount.editIndex,
        1,
        this.editAccount
      );
      that.dialogVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.editAccount.file === "" && this.imageUrl === null) {
            this.$message({
              message: "请上传营业执照",
              type: "warning"
            });
            return;
          }
          var that = this;
          //this.fullscreenLoading = true
          var newMultForm = this.editAccount.multiForm.map(item => {
            var wType, joinTime, firstDealDate;
            if (item.wType === "自然月") {
              wType = 0;
            } else if (item.wType === "自然周(周一到周日)") {
              wType = 1;
            } else {
              wType = 2;
            }
            joinTime = moment(item.joinTime).format("YYYY-MM-DD");
            firstDealDate = moment(item.firstDealDate).format("YYYY-MM-DD");
            delete item.cityItem;
            return Object.assign(
              {},
              item,
              { wType: wType },
              { joinTime: joinTime },
              { firstDealDate: firstDealDate }
            );
          });
          delete this.editAccount.options;
          delete this.editAccount.provinceId;
          delete this.editAccount.provinceName;
          delete this.editAccount.areaId;
          delete this.editAccount.areaName;
          delete this.editAccount.cityId;
          delete this.editAccount.cityName;
          delete this.editAccount.joinTime;
          delete this.editAccount.licenseFeeRate;
          delete this.editAccount.percent;
          delete this.editAccount.subscriptionMoney;
          delete this.editAccount.subscriptionNum;
          delete this.editAccount.wType;
          var obj = Object.assign(
            {},
            { id: this.userIDID },
            this.editAccount,
            { cityList: JSON.stringify(newMultForm) },
            { cardType: this.editAccount.cardType === "身份证" ? 0 : 1 }
          );
          that.dialogVisible = false;

          request
            .post(host + "beepartner/admin/cityPartner/updateCityPartner")
            .withCredentials()
            .set({
              "content-type": "application/x-www-form-urlencoded"
            })
            .send(obj)
            .end((error, res) => {
              if (error) {
                console.log(error);
              } else {
                var code = JSON.parse(res.text).resultCode;
                if (code === 0) {
                  debugger
                  that.dialogVisible = false;
                  that.currentPage3 = 1;
                  that.checkLogin(res);
                  that.$message.success("修改成功");
                  that.loadData();
                } else {
                  that.$message.error("修改失败");
                  that.dialogVisible = false;
                }
              }
            });
        } else {
          // console.log('error submit!!')
          return false;
        }
      });
    },
    show_detail(row, column) {
      if (column.label === "加盟商编号") {
        this.$router.push("/index/partnerDetail/" + row.id);
      }
    },
    checkLogin(res) {
      if (JSON.parse(res.text).message === "用户登录超时") {
        this.$router.push("/login");
      }
    },
    // 关键字和联系方式改变实时查询信息
    // inputChange() {
    //   if (this.$refs.val1.value === "" && this.$refs.val2.value === "") {
    //     this.loadData();
    //     this.isSearch = false;
    //   }
    // }
  },
  watch: {
    '$route':'loadData',
    "$store.state.users.isOpenAddAccount": "loadData",
    "editAccount.multiForm":{
      handler:function(n,o){
      n.map((item,index)=>{
         if(item.cityItem){
                item.cityId = item.cityItem.value
                item.cityName = item.cityItem.label
            }
        if(!item.subscriptionNum){
          $("#subscriptionNum" + index).addClass('is-error')
        }
      })
      return;
        n.map((item,index)=>{
          if(!item.subscriptionNum==''){
            setTimeout(()=>{
            $('#subscriptionNum'+index).find('.error-list').remove()
              $('#subscriptionNum'+index).removeClass('is-error')
            },200)
          }else{
              $('#subscriptionNum'+index).find('input').blur(function(){
                var val = $(this).val()
                if(!val){
                  $('#subscriptionNum'+index).find('.error-list').remove()
                  $('#subscriptionNum'+index).addClass('is-error')
                  $('#subscriptionNum'+index).append('<div class="error-list" style="font-size: 12px;color: red;margin-left: 150px;position:absolute;">请输入认购车辆</div>')
                }
              })
          }
          if(!item.subscriptionMoney==''){
            setTimeout(()=>{
            $('#subscriptionMoney'+index).find('.error-list').remove()
              $('#subscriptionMoney'+index).removeClass('is-error')
            },200)
          }else{
              $('#subscriptionMoney'+index).find('input').blur(function(){
                var val = $(this).val()
                if(!val){
                  $('#subscriptionMoney'+index).find('.error-list').remove()
                  $('#subscriptionMoney'+index).addClass('is-error')
                  $('#subscriptionMoney'+index).append('<div class="error-list" style="font-size: 12px;color: red;margin-left: 150px;position:absolute;">请输入加盟资金</div>')
                }
              })
          }
           if(!item.licenseFeeRate==''){
            setTimeout(()=>{
            $('#licenseFeeRate'+index).find('.error-list').remove()
              $('#licenseFeeRate'+index).removeClass('is-error')
            },200)
          }else{
              $('#licenseFeeRate'+index).find('input').blur(function(){
                var val = $(this).val()
                if(!val){
                  $('#licenseFeeRate'+index).find('.error-list').remove()
                  $('#licenseFeeRate'+index).addClass('is-error')
                  $('#licenseFeeRate'+index).append('<div class="error-list" style="font-size: 12px;color: red;margin-left: 150px;position:absolute;">请输入授权费率</div>')
                }
              })
          }
          if(!item.wType==''){
            setTimeout(()=>{
            $('#wType'+index).find('.error-list').remove()
              $('#wType'+index).removeClass('is-error')
            },200)
          }else{
          }
            if(!item.circleDays==''){
            setTimeout(()=>{
              $('#circleDays'+index).find('.error-list').remove()
               $('#circleDays'+index).find('.error-list-circle').remove()
               $('#circleDays'+index).find('.el-input__inner').css({
                 borderColor:'#ddd'
               })
            },200)
          }else{
              $('#circleDays'+index).find('input').blur(function(){
                var val = $(this).val()
                if(!val){
                  $('#circleDays'+index).find('.error-list').remove()
                   $('#circleDays'+index).find('.error-list-circle').remove()
                  $('#circleDays'+index).find('.el-input__inner').css({
                    borderColor:'red'
                  })
                  $('#circleDays'+index).append('<div class="error-list" style="font-size: 12px;color: red;margin-left: 314px;width:399px;position:absolute;">请输入正整数天</div>')
                }else{
                   var reg=/^[1-9]\d*$/;
                   var res = reg.test(val)
                   if(res){
                     return;
                   }else{
                      $('#circleDays'+index).find('.error-list').remove()
                  $('#circleDays'+index).find('.el-input__inner').css({
                    borderColor:'red'
                  })
                  $('#circleDays'+index).append('<div class="error-list" style="font-size: 12px;color: red;margin-left: 314px;width:399px;position:absolute;">请输入正整数天</div>')
                   }
                }
              })
          }
          if(!item.cityId==''){
            setTimeout(()=>{
            $('#cityId'+index).find('.error-list').remove()
              $('#cityId'+index).removeClass('is-error')
            },200)
          }else{
              $('#cityId'+index).find('input').blur(function(){
                var val = $(this).val()
                if(!val){
                  $('#cityId'+index).find('.error-list').remove()
                  $('#cityId'+index).addClass('is-error')
                  $('#cityId'+index).append('<div class="error-list" style="font-size: 12px;color: red;margin-left: 150px;position:absolute;">请选择加盟地区</div>')
                }
              })
          }
        })
      },
      deep:true
    },
  }
};
</script>
