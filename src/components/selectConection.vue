<template>
   <p class="select_connect">
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
</template>
<script>
export default {
  data(){
    return {
      joinMode:this.$route.query.joinMode||'0',
      joinPartner:Number(this.$route.query.cityPartnerId)||'0',
      cityId:this.$route.query.cityId||'0',
      partnerLists:[],
      temp:[],
      temp1:[],
      temp2:[],
      citys:[],
      title:'',
    }
  },
  created(){
    this.hrefChange()
    this.searchPartner()
    this.searchPartner1()
    this.searchPartner2()
  },
  methods:{
      
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
      this.loading2 = true
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
              this.loading2 = false
          }
        })
    },
    searchPartner2(){
       this.loading2 = true
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
               this.loading2 = false

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
      
      this.$emit('fun',this.joinMode,this.joinPartner,this.cityId)
      // console.log(this.cityId)
      var that  =this
      setTimeout(function(){
        that.title = $("p.select_connect .el-select input")[1].value
      },200)
    },
// ----------------------------------下拉菜单三联动部分结束-----------------------------------------------
  }
}
</script>
<style>

</style>


