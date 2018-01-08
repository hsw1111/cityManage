<template>
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
</template>
