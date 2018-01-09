import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    consumeData: [],
    earningsDate: [],
    settlementDate: [],
    timeline: [],
    allData: [],
    partnerList: [],
    platTableData: [],
    joinTableData: [],
    keepParnterAccount:[],
    loginSign: false,
    isHeaderImg: false,
    isOpenAddAccount:false,
    name:'',
    phone: '',
    recodeCityId:'',
    incomingCityListStr: []
}

const mutations = {
    recodeCityId(state,cityId){
        state.recodeCityId = cityId
    },
    updateName(state,name){
        state.name = name
    },
    changeAddAccount(state){
        state.isOpenAddAccount =  !state.isOpenAddAccount
    },
    addPlatAcount(state, {obj}) {
        state.platTableData.push(obj)
    },
    addJoinAcount(state, {obj}) {
        state.joinTableData.push(obj)
    },
    consumeData_evaluation(state, { newArr }) {
        // console.log('[[ consumeData_evaluation is commited ]]')
        state.consumeData = newArr.newArr
        // console.log('-------------------------------state.consumeData',state.consumeData)
    },
    earningDate_detail(state, { arr }) {
        // console.log('[[ earningDate_detail is commited ]]')
        state.earningsDate = arr
    },
    settlementDate_detail(state, { arr }) {
        // console.log('[[ settlementDate_detail is commited ]]')
        state.settlementDate = arr
    },
    setTimeLine(state, { obj }) {
        // console.log('[[ timeline is setted ]]')
        state.timeline = obj
        console.log('-------------------------------state.timeline',state.timeline)
    },
    setAllData(state, { obj }) {
        // console.log('[[ setAllData is setted ]]')
        state.allData = obj
    },
    setPartnerList(state, { arr }) {
        // console.log('[[ setPartnerList ]]')
        // console.log(arr.newArr)
        var arr2 = arr.newArr
        var arrDeled = []
        for (var i = 0; i < arr2.length; i++) {
            var newoObj = {}
            newoObj.name = arr2[i].name
            newoObj.sex = arr2[i].sex
            newoObj.IDcard = arr2[i].idCard
            newoObj.tel = arr2[i].phoneNo
            newoObj.email = arr2[i].email
            newoObj.cars = arr2[i].bikeNum
            newoObj.partnerId = arr2[i].id
            arrDeled.push(newoObj)
        }
        state.partnerList = arrDeled
    },
    keepParnterAccount(state,obj){
        state.keepParnterAccount.unshift(obj)
    },
    loginSign (state) {
        // console.log('loginsian change')
        state.loginSign = !state.loginSign
    },
    incomingCityList(state, cityList) {
        var newArr = []
        cityList.map( item => {
            newArr.push(item.cityId)
            return newArr
        })
        state.incomingCityListStr = newArr
    }
}

const actions = {
    setCityId(context,id){
        context.commit('recodeCityId',id)
    },
    setName({ commit }, name){
        commit('updateName',name)
    },
    setIncomingCityList( {commit}, cityList) {
        commit('incomingCityList', cityList)
    }, 
    setAccountOpendState({commit}){
        commit('changeAddAccount')
    },
    //  报表管理 消费数据模块 start ====>
    consumeData_action: ({ commit }, newArr) => commit('consumeData_evaluation', { newArr }),
    //  <=====  end
    // 营收记录 收益明细 结算记录模块 start ====>
    earningsDate_action: ({ commit }, arr) => commit('earningDate_detail', { arr }),
    settlementDate_action: ({ commit }, arr) => commit('settlementDate_detail', { arr }),
    //  <====== end
    // 报表管理时间段传递  start  ====>
    timeline_action: ({ commit }, obj) => commit('setTimeLine', { obj }),
    // <===== end
    // 报表管理走势图数据  start  ====>
    alldata_action: ({ commit }, obj) => commit('setAllData', { obj }),
    // <===== end 
    // 合伙人管理模块 start ====>
    partner_action: ({ commit }, arr) => commit('setPartnerList', { arr }),
    // <=====
    // 登录超时的sign ====>
    loginSian_action: ({ commit }) => commit('loginSign')
}
const cityId = state => state.recodeCityId
const getters = {
    cityId: cityId
}
export default {
    state,
    mutations,
    actions,
    getters
}
