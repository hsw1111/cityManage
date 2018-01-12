<template>
  <div class="consumeData">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClickTab">
      <el-tab-pane name="partner">
        <div style="padding:0 16px" slot="label" @click="$router.push('/index/incomingRank?type=daily&activeName=partner')">按加盟商</div>
      </el-tab-pane>
      <el-tab-pane name="city">
        <div style="padding:0 16px" slot="label" @click="$router.push('/index/incomingRank?type=daily&activeName=city')">按地区</div>
      </el-tab-pane>
       <div class="countInfo">
          <!-- <div class="cityContainer" v-show="remoteCityList.length>1" >
              <span class="joinPlace">加盟区域</span>
              <city-list v-bind:joinCity="remoteCityList" v-on:listenToChildEvetn="showMsgFormChild"></city-list>
            </div> -->
          <el-row class="countTitle">
            <!-- <span class="countDimension labelAlign" style="margin-right: 0px;">统计维度</span> -->
            <div class="timeSelectBtn" style='margin-left: -10px;'>
              <el-button class="active" @click="handleChangeType" myId='daily'>今日</el-button>
              <el-button @click="handleChangeType" myId='weekly'>本周</el-button>
              <el-button @click="handleChangeType" myId='monthly'>本月</el-button>
              <el-button @click="handleChangeType" myId='all'>所有日期</el-button>
              <el-button @click='handleChangeType' myId='define' style="margin-right: 15px;">指定时间段</el-button>
            </div>
            <el-date-picker 
              v-model="value4" 
              type="daterange" 
              v-show="show" 
              placeholder="选择时间范围"  
              style="vertical-align: top; margin-top: 0px;"
              align="right">
            </el-date-picker>
            <button style="border-radius: 4px; font-size: 14px; cursor: pointer;" v-show="show" class="incomingRank_my_btn" @click="getDateByTimeLine">查询</button>
          </el-row>
        </div>
        <el-row class="countDetail">
          <router-view></router-view>
        </el-row>
    </el-tabs>
  </div>
</template>
<script>
// import $ from 'jquery'
import { siblings } from '../../../../utils/index.js'
import moment from 'moment'
import { host } from '../../../config/index.js'
import cityList from "../../../components/cityList.vue";
import request  from 'superagent'
import {mapActions,mapGetters} from 'vuex'
export default {
  data: function () {
    return {
      activeName:'partner',
      remoteCityList:[],
       cityCodeList: [],
      form: {
        data1: '',
        data2: '',
        type: 'date',
        formatType: 'yyyy-MM-dd'
      },
      active: false,
      value4: '',
      show: false,
      // pickerOptions2: {
      //   shortcuts: [
      //     // {
      //     //   text: '最近一周',
      //     //   onClick(picker) {
      //     //     const end = new Date()
      //     //     const start = new Date()
      //     //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      //     //     picker.$emit('pick', [start, end])
      //     //   }
      //     // },
      //     // {
      //     //   text: '最近一个月',
      //     //   onClick(picker) {
      //     //     const end = new Date()
      //     //     const start = new Date()
      //     //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      //     //     picker.$emit('pick', [start, end])
      //     //   }
      //     // },
      //     // {
      //     //   text: '最近三个月',
      //     //   onClick(picker) {
      //     //     const end = new Date()
      //     //     const start = new Date()
      //     //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      //     //     picker.$emit('pick', [start, end])
      //     //   }
      //     // }
      //   ]
      // }
    }
  },
   components: {
    cityList
  },
   created() {
    // 初始化调用查询可加盟城市的接口,动态渲染数据
    var that = this;
     request.post(host + 'beepartner/admin/city/findAreaAlreadyOpen')
    .withCredentials()
      .set({
        "content-type": "application/x-www-form-urlencoded"
      })
      .end((error, res) => {
        if (error) {
          console.log(error);
        } else {
          var result = JSON.parse(res.text);
          // console.log('---------------------arr',result)
          var arr = result.map(list => {
            return { cityName: list.name, code: list.id };
          });

          this.remoteCityList = arr;
        }
      });
  },
  methods: {
    ...mapActions(['setCityId']),
     showMsgFormChild(data) {
      // 子组件像父组件传值,目的是获取被选中的cityCode
      this.cityCodeList = data;
    },
    handleClickTab(){
      this.show = false
      this.value4 = []
      this.$store.state.users.timeline = {}
    },
    handleChangeType(e) {
      var that = this
      switch (e.target.innerText) {
        case '今日': {
          this.form.type = 'date'
          this.show = false
          this.value4 = []
          this.$router.push({ query: { type: 'daily',activeName:that.activeName } })
          this.form.formatType = 'yyyy-MM-dd'
          break
        }
        case '本周': {
          this.form.type = 'week'
          this.show = false
          this.value4 = []
          this.$router.push({ query: { type: 'weekly',activeName:that.activeName } })
          this.form.formatType = 'yyyy 第 WW 周'
          break
        }
        case '本月': {
          this.form.type = 'month'
          this.show = false
          this.value4 = []
          this.$router.push({ query: { type: 'monthly',activeName:that.activeName} })
          this.form.formatType = ''
          break
        }
        case '所有日期': {
          this.show = false
          this.value4 = []
          this.$router.push({ query: { type: 'all',activeName:that.activeName } })
          this.$store.state.users.timeline = {}
          this.form.formatType = ''
          break
        }
        case '指定时间段': {
          this.show = true
          this.$router.push({ query: { type: 'define',activeName:that.activeName } })
          this.form.formatType = ''
          break
        }
      }
      var siblingsBtn = siblings(e.currentTarget)
      for (var i = 0; i < siblingsBtn.length; i++) {
        siblingsBtn[i].setAttribute('class', 'el-button el-button--default')
      }
      e.currentTarget.setAttribute('class', 'el-button active el-button--default')
    },
    getDateByTimeLine() {
      
      if (this.value4.length === 0) {
        this.$message({
          message: '请输入日期',
          type: 'warning'
        })
      } else {
        var startTime = this.value4[0]===null?'': moment(this.value4[0]).format('YYYY-MM-DD HH:mm:ss')
        var endTime =this.value4[1]===null?'': moment(this.value4[1]).format('YYYY-MM-DD HH:mm:ss')
        var newObj = {}
        newObj.time1 = startTime
        newObj.time2 = endTime
        this.$store.dispatch('timeline_action', { newObj })
      }
    },
    routeChange () {
      var that = this
      $('.timeSelectBtn button').each(function () {
        if ($(this).attr('myId') === that.$route.query.type) {
          $(this).addClass('active').siblings().removeClass('active')
        }
      })
    }
  },
  mounted () {
    this.$router.push('/index/incomingRank?type=daily&activeName=partner')
    $(".sign").removeClass('is-active')
    $('.sign[name="51"]').addClass('is-active')
    document.title = '报表管理-收益排行'
  },
  watch: {
    '$route': 'routeChange',
    cityCodeList: {
      handler: function(n, o) {
        //console.log('搞事情')
        this.setCityId(this.cityCodeList.join());
      },
      deep: true
    },
  }
}
</script>
<style>

div.cityList {
  display: inline-block;
  margin-top: 4px;
  
  width: calc( 100% - 118px);
  
}
span.joinPlace {
  height: 44px;
  line-height: 44px;
  float: left;
  width: 70px;
  text-align: left;
  margin-right: 1px;
  font-size: 14px;
  color: #555;
}
div.consumeData {
  margin-right: 20px;
}

div.countInfo {
  padding: 20px 20px 20px 22px;
  background:#faebd7;
  border: 1px solid #dfe6ec;
  margin-bottom: 20px;
}
div.queryLists[data-v-6f528dc7] {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #dfe6ec;
    padding: 20px 20px 20px 20px !important;
}


/*div.countTitle {
  background: #f3f0f0;
  padding: 20px;
  color: #444;
}*/

div.countDetail {
  background: #fff;
}

span.labelAlign {
  float: left;
  margin-right: 10px;
  text-align: right;
  display: block;
  line-height: 35px;
  font-size: 14px;
  color: #555;
}

span.division {
  font-size: 14px;
  color: #555;
  width: 32px;
  display: inline-block;
  text-align: center;
}

span.timePeried {
  margin-left: 50px;;
}

span.division {
  font-size: 14px;
  color: #555;
}

button.query {
  float: initial;
}

button.isClick {
  background: red;
}

div.timeSelectBtn {
  display: block;
  float: left;
}

div.timeSelectBtn button {
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

div.timeSelectBtn button:hover {
  border: 1px solid #bbb;
  color: #666;
}

div.timeSelectBtn button.active {
  /*background: rgb(66, 66, 66);*/
  background: rgba(	255,140,0, 0.8);
  color: #fff;
  border: 1px solid rgba(	255,140,0, 0.5);
}

.timeSelect_button {
  font-size: 12px;
  height: 35px;
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

.el-month-table td.current:not(.disabled) .cell {
  background: black !important;
  color: #fff;
}

.el-button:focus, .el-button:hover {
  color: #fff;
}

.incomingRank_my_btn {
  width: 80px;
  height: 36px;
  line-height: 11px;
  margin-right: 30px;
  color: #fff;
  outline: none;
  border: none;
  /* border-radius: 4px; */
  background: rgba(52,52,67, 0.8);
}

.incomingRank_my_btn:hover {
  background: rgba(52, 52, 67, 0.9);
  color: #fff;
}
</style>
