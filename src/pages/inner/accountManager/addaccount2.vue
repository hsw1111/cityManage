<template>
    <div>
        <div id="addaccount_form">
            <h1 id="addaccount_title">添加加盟商账号
                <span>
                    <a style="color:#000" @click="$router.push({path:'/index/accountManager'})">
                        <i class="el-icon-close">
                        </i>
                    </a>
                </span>
            </h1>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="ruleForm.userName" placeholder='不超过100个字符'></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input type="passWord" v-model="ruleForm.passWord" placeholder='6-20位字符，可包括字母数字，区分大小写'></el-input>
                </el-form-item>
                <el-form-item label="所属加盟商" prop="alliance">
                    <!-- <el-radio-group v-model="ruleForm.alliance"  v-on:input='remoteMethod'>
                        <el-radio :key="list.cityId" :myId="list.cityId" :label="list.cityId.toString()" v-for="list of cityList">{{list.cityName}}</el-radio>
                    </el-radio-group> -->

                    <el-select v-model="ruleForm.alliance" placeholder="选择加盟商" v-on:input='remoteMethod'>
                        <el-option v-for="item in allianceList" :key="item.cityPartnerId" :label="item.companyName" :value="item.cityPartnerId.toString()">
                        </el-option>
                        <!--<el-option label="管理员" value="管理员"></el-option>-->
                        <!-- <el-option label="加盟商" value="加盟商"></el-option> -->
                        <!--<el-option label="加盟商" value="加盟商"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="所属角色" prop="roleName">
                    <el-select v-model="ruleForm.roleName" placeholder="选择角色类型" :remote-method="remoteMethod" :disabled="isDisabled">
                        <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                        <!--<el-option label="管理员" value="管理员"></el-option>-->
                        <!-- <el-option label="加盟商" value="加盟商"></el-option> -->
                        <!--<el-option label="加盟商" value="加盟商"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="ruleForm.name" placeholder='不超过50个字符'></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNo">
                    <el-input v-model="ruleForm.phoneNo" placeholder='请输入手机号'></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email" placeholder='请输入邮箱'></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" style="width:340px" v-model="ruleForm.description" placeholder="不超过200个字符"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class='addaccount_button' type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                    <el-button class='addaccount_button' @click="$router.push({path:'/index/accountManager'})">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<style scoped>
    @media screen and (min-width:1367px) {
        #addaccount_form {
            /*  适配好的样式 */
            /* height: 60%; */
            /*overflow-y: scroll; 
        overflow-x: hidden;*/
            /* overflow-y: scroll;  */
            width: 50%;
            box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
            position: fixed;
            display: block;
            top: 62%;
            left: 50%;
            margin-left: -28%;
            margin-top: -27%;
            padding: 70px 80px 0 50px;
            margin-right: 20px;
            border: 1px solid #ccc;
            background: #fff;
            border-radius: 2px;
        }
    }

    @media screen and (max-width:1367px) {
        #addaccount_form {
            height: 60%;
            width: 62%;
            overflow-y: scroll; 
            box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
            position: fixed;
            display: block;
            top: 54%;
            left: 53%;
            margin-left: -38%;
            margin-top: -24%;
            padding: 90px 80px 0px 50px;
            margin-right: 20px;
            border: 1px solid #ccc;
            background: #fff;
            border-radius: 2px;
        }
    }

    .addaccount_button:nth-of-type(1) {
        background: #f87e2b;
        border: none;
        margin-left: 93px;
    }

    .addaccount_button:nth-of-type(1):hover {
        background: rgba(248, 126, 43, 0.9);
    }


    .addaccount_button:nth-of-type(2):hover {
        border: 1px solid rgb(248, 126, 43);
        color: rgb(248, 126, 43);
    }

    .addaccount_button {
        width: 120px;
        height: 50px;
    }

    #addaccount_title {
        position: absolute;
        left: 0px;
        top: 0px;
        padding-left: 20px;
        width: 100%;
        height: 60px;
        font-size: 24px;
        font-weight: 500;
        overflow: hidden;
        line-height: 60px;
        color: #444;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
    }

    #addaccount_title>h1 {
        font-weight: 400;
    }

    #addaccount_title span {
        float: right;
        margin-right: 14px;
        cursor: pointer;
        font-size: 18px;
    }

    div#addaccount_form .el-form-item__content .el-input input.el-input__inner {
        width: initial;
    }

    span.tips {
        color: #dedede;
    }

    #addaccount_form .el-radio-group {
        display: inline-block;
        font-size: 0;
        padding-top: 10px;
        width: 337px;
    }

    #addaccount_form  .el-radio-group .el-radio {
        width: 84px;
        margin-left: 0;
        height: 30px;
        display: inline-block;
    }
</style>
      
<script>
// import $ from 'jquery'
import request from 'superagent'
import { checkUserName, checkMobile, isEmail } from '../../../../utils/index.js'
import { host } from '../../../config/index'
export default {
    data() {
        var validateUserId = function (rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入用户名'))
            } else if (!checkUserName(value)) {
                callback('用户名格式：必须英文字母或数字的组合')
            } else {
                request
                .post(host + 'beepartner/admin/User/checkIsExistsUserName')
                .withCredentials()
                .set({
                    'content-type': 'application/x-www-form-urlencoded'
                })
                .send({
                    'userName': value
                })
                .end((err, res) => {
                    if (err) {
                    this.$message({
                        type: 'warning',
                        message: '网络请求错误'
                    })
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
        var validatePhoneNo = function (rule, value, callback) {
            if (value === '') {
                callback()
                return
                // callback(new Error('请输入手机号'))
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
                    this.$message({
                        type: 'warning',
                        message: '网络请求错误'
                    })
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
        var validateEmail = function (rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入邮箱'))
            } else if (!isEmail(value)) {
                callback(new Error('邮箱格式不正确'))
            } else {
                callback()
            }
        }
        var validateRole = function (rule, value, callback) {
            if (value === '') {
                callback(new Error('请选择所属角色'))
            } else {
                callback()
            }
        }
        return {
            isDisabled: true,
            options4: [],
            cityList:[],
           ruleForm: {
                userName: '',
                passWord: '',
                alliance: '',
                roleName: '',
                name: '',
                phoneNo: '',
                cityId: ' ',
                email: '',
                description: ''
            },
            rules: {
                userName: [
                    { validator: validateUserId, trigger: 'blur', required: true },
                    { max: 100, message: '用户名长度应不超过100个字符', trigger: 'change' }
                ],
                passWord: [
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '密码长度应该在6-20位之间', trigger: 'change' }
                ],
                alliance: [
                    { message: '请选择加盟商', trigger: 'blur',required:true }
                ],
                roleName: [
                    { required: true, message: '请选择所属于的角色', trigger: 'change' }
                ],
                // roleName: [{ validator: validateRole, trigger: 'change', required: true }],
                name: [
                    { message: '请输入姓名', trigger: 'blur' },
                ],
                phoneNo: [
                    { validator: validatePhoneNo, trigger: 'blur' }
                ]
                // email: [{ validator: validateEmail, trigger: 'blur' }]
            },
            allianceList: []
        }
    },
    methods: {
        getAllianceList () {
            request
                .post(host + 'beepartner/admin/cityPartner/queryEffectCityPartnerList')
                .withCredentials()
                .set({
                    'content-type': 'application/x-www-form-urlencoded'
                })
                .end((error,res)=>{
                    this.checkLogin(res)
                    // console.log('allianceList', res)
                    var data = JSON.parse(res.text).data
                    // console.log('data', data)


                    this.allianceList = data
                })
        },
        loadCity () {
            request
                .post(host + 'beepartner/admin/city/findCity')
                .withCredentials()
                .set({
                    'content-type': 'application/x-www-form-urlencoded'
                })
                .end((error,res)=>{
                    if(error){
                    console.log(error)
                    this.cityList = []
                    }else {
                    this.checkLogin(res)
                    var result = JSON.parse(res.text).data
                    var city = result.map((item)=>{
                        var obj = {}
                        obj.cityId = item.cityId
                        obj.cityName = item.cityName
                        return obj
                    })
                    this.cityList = city
                    }
                })
        },
        remoteMethod() {
            var that = this
            if (this.ruleForm.alliance === '') {
                return
            } else {
                setTimeout(() => {
                    request.post(host + 'beepartner/admin/User/findRole')
                        .withCredentials()
                        .set({
                            'content-type': 'application/x-www-form-urlencoded'
                        })
                        .send({
                            'cityPartnerId': that.ruleForm.alliance
                        })
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
                                if (roles.length > 0) {
                                    that.isDisabled = false
                                }
                                that.options4 = roles
                            }
                        })
                }, 200)
            }
        },
        submitForm(formName) {
            var that = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var obj = {}
                    this.options4.map((item) => {
                        if (item.value === this.ruleForm.roleName) {
                            obj = Object.assign({}, this.ruleForm, { roleId: item.id, cityPartnerId: this.ruleForm.alliance})
                        }
                    })
                    request.post(host + 'beepartner/admin/User/addFranchiseeUser')
                        .withCredentials()
                        .set({
                            'content-type': 'application/x-www-form-urlencoded'
                        })
                        .send(obj)
                        .end((err, res) => {
                            if (err) {
                                console.log(err)
                            } else {
                                this.checkLogin(res)
                                var code = JSON.parse(res.text).code
                                if (code === -1) {
                                    this.$router.push('/index/accountManager')
                                    this.$message({
                                        type: 'error',
                                        message: '对不起，您没有权限'
                                    })
                                } else {
                                    this.$router.push('/index/accountManager')
                                    this.$message({
                                        type: 'success',
                                        message: '添加成功'
                                    })
                                    var newAccount = Object.assign({},JSON.parse(JSON.parse(res.text).data),{state:true})
                                    //that.$store.state.joinTableData.unshift(newAccount)
                                    // this.$store.commit({
                                    //     type: 'addJoinAcount',
                                    //     obj: this.ruleForm
                                    // })
                                }
                            }
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        checkLogin (res) {
            if (JSON.parse(res.text).message === '用户登录超时') {
                this.$router.push('/login')
            }
        }
    },
    mounted: function () {
    document.title = '添加加盟商账号'
        this.remoteMethod()
        this.loadCity()
        this.getAllianceList()
        
    }
}
</script>
