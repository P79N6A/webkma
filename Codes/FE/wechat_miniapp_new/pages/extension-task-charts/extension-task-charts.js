const
  activityService = require('../../services/activity-service.js'),
  statisticsService = require('../../services/statistics-service.js'),
  utils = require('../../utils/util.js'),
  config = require('../../config.js')

let app = getApp()
let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isManager: 0,
    isCompany:false,
    /*----------------------------- 插件数据参数---------------------------------*/
    showLoadMore: false,
    textinfo: '玩命加载中...',
    goodsListData: [],
    statistical: {
      total: '', //报名人数/订单总数/红包领取人数/点赞总数/投票总人数/中奖总人数/拨号插件的点击数
      value: '', //任务浏览客户数/商品详情浏览数
      totalVolume: '' // 成交金额/红包发放总额 
    },
    orderDataSource: {
      total: '',
      value: '',
      totalVolume: ''
    },
    showTitle: false,
    id: "",
    articleid: "",
    activeNavTab: "baseData",
    params: {
      search: '',
      pageSize: 20,
      pageIndex: 1
    },
    titleCont: {
      title: '领取人数',
      titleNun: 0,
      redEnvelopes: '发放总额',
      redPrice: 0,
      content: "小小红包，也是一种很好的裂变方式，帮助您带来更多的客户"
    },
    tabNav: [],
    activePlugTab: "", //当前项
    listData: [], //投票记录
    bgcolor: "",
    fromLables: [],
    conditionTxt: '',
    controlIdFrom: '',
    formDataListData: [],//报名数据列表
    formDataTitle: [],//报名数据title
    redpacketListdata: [],//红包列表数据
    rewardDataList: [],//中奖列表
    isShowInfo: false,
    maskInfoData: {},
    itemTypeArr: ["text_upload", "text_image-checkbox-option", "text_radio-option", "text_image-radio-option", "text_checkbox-option"],//弹窗内容验证
    /*----------------------------- 插件数据结束---------------------------------*/
    /*----------------------------- 任务数据 ---------------------------------*/
    marketingData:{
      label: [0, 0, 0, 0],
      value: [0, 0, 0, 0]
    },
    topRanking: '-',//综合指数排名
    differenceNum: '-',//距离上一名相差
    topScore: '-',//综合评分
    genderDataSource: {
      total: 0,
      male: 0,
      female: 0
    }, 
    dailyLineDataSource: [],
    mapDataSource: {
      city: [
        {
          name: "",
          value: ''
        }
      ],
      province: [
        {
          name: "",
          value: ''
        }
      ]
    },
    funnelDataSource: [{ value: 0, name: '浏览' },
    { value: 0, name: '客户' },
    { value: 0, name: '咨询' },
    { value: 0, name: '成交' }
    ], 
    paramsTask: {
      businessId: '',
      userId: '',
      taskId: ''
    },
    customer: {
      count: 0,
      list: []
    },//员工 带来客户 / TA的客户
    staffCustomer: {
      count: 0,
      list: [],
      finishNum: 0
    },//完成任务员工
    atlasUrl: ``,//人脉图
    taskName: '' //任务名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    var bg = self.bgColor();
    self.setData({
      id: options.id,
      bgcolor: bg,
      taskName: options.name,
      isCompany:options.isCompany == 'false'?false:true
    });
  },
  onShow() {
    let that = this
    wx.getStorage({
      key: 'isManager',
      success: function (res) {
        that.setData({
          isManager: res.data,
          "paramsTask.businessId": app.globalData.userInfo.businessId,
          "paramsTask.userId": res.data > 0 && that.data.isCompany ? '': app.globalData.userInfo.userId,
          "paramsTask.taskId": that.data.id,
          mapDataSource: that.data.mapDataSource
        })
        that.taskDataFn() 
      },
    })
    that.getTabs();
    wx.setNavigationBarTitle({
      title: this.data.taskName || this.data.taskName
    })
  },
  /*------------------------------ 任务数据--------------------------------------*/
  taskDataFn() {
    let that = this
    console.log(that.data.paramsTask)
    console.log(that.data.isCompany)
    console.log(that.data.isManager)
    that.getRegionList()
    that.getSexCont()
    that.getBrowseTimespanList()
    that.isManagerCustomer()
    that.getEmployeeListCont()
    that.getIndicatorsContData()
    that.setData({
      atlasUrl: `${config.apiHost}/relationship/query/taskRelation/image?session_id=${app.globalData.userInfo.session_id}&merchantId=${app.globalData.userInfo.businessId}&taskId=${that.data.id}&userId=${that.data.isCompany ? '' : app.globalData.userInfo.userId}`
    })
  },
  //综合评分
  getIndicatorsContData() {
    let that = this
    activityService.getIndicatorsCont({
      businessId: app.globalData.userInfo.businessId,
      taskId: that.data.id,
      employeeId: that.data.isManager > 0 && that.data.isCompany ? "" : app.globalData.userInfo.emplId
    }, (err, res) => {
      let arr = []
      for (let i in res.data) {
        arr.push(res.data[i])
      }
      let mValue = res.data.actualNum
      let mLabel = res.data.targetNum
      that.setData({
        "marketingData.value[0]": mValue.exposureNum ? mValue.exposureNum : 0,
        "marketingData.value[1]": mValue.visitorNum ? mValue.visitorNum : 0,
        "marketingData.value[2]": mValue.consultNum ? mValue.consultNum : 0,
        "marketingData.value[3]": mValue.orderNum ? mValue.orderNum : 0,

        "marketingData.label[0]": mLabel.targetAccess ? mLabel.targetAccess : 0,
        "marketingData.label[1]": mLabel.targetVisitor ? mLabel.targetVisitor : 0,
        "marketingData.label[2]": mLabel.targetService ? mLabel.targetService : 0,
        "marketingData.label[3]": mLabel.targetDeal ? mLabel.targetDeal : 0,
        topScore: res.data.marketingForce ? res.data.marketingForce : '-',
        topRanking: res.data.ranking > 0 ? res.data.ranking : '-',
        differenceNum: res.data.difference ? res.data.difference : '-',
        "funnelDataSource[0].value": mValue.exposureNum,
        "funnelDataSource[1].value": mValue.visitorNum,
        "funnelDataSource[2].value": mValue.consultNum,
        "funnelDataSource[3].value": mValue.orderNum
      })
      console.log(that.data.marketingData)
    })
  },
  // 营销漏斗
  // 男女比例
  getSexCont() {
    let that = this
    activityService.sexList(that.data.paramsTask, (err, res) => {
      let sexInfo = that.data.genderDataSource
      sexInfo.total = res.data.male + res.data.female + res.data.unknown
      sexInfo.male = res.data.male > 0 ? res.data.male : 0
      sexInfo.female = res.data.female > 0 ? res.data.female : 0
      sexInfo.total = sexInfo.total > 0 ? sexInfo.total : 0
      that.setData({
        genderDataSource: sexInfo
      })
    })
  },
  // 员工带来客户
  isManagerCustomer() {
    if (this.data.isManager == 1 && this.data.isCompany) {
      this.getCustomerList()
    } else {
      this.getSimpleListData()
    }
    // this.getCustomerList()
  },
  getSimpleListData() {
    let that = this
    let cont = {
      rootUserId:app.globalData.userInfo.userId,
      businessId: app.globalData.userInfo.businessId,
      fromId: that.data.id
    }
    activityService.simpleListData(cont, (err, res) => {
      that.setData({
        "customer.list": res.data.list,
        "customer.count": res.data.total
      })
    })
  },
  // 带来客户
  getCustomerList() {
    let that = this
    let cont = {
      businessId: app.globalData.userInfo.businessId,
      from_id: that.data.id,
      ser_user_id: that.data.isCompany ? '' : app.globalData.userInfo.userId
    }
    activityService.getCustomerBusinessList(cont, (err, res) => {
      if (res.status == 0) {
        that.setData({
          "customer.list": res.data.list,
          "customer.count": res.data.total
        })
      }
    })
  },
  // 完成员工数
  getEmployeeListCont() {
    let that = this
    let cont = {
      taskId: that.data.id
    }
    activityService.getEmployeeListData(cont, (err, res) => {
      that.setData({
        "staffCustomer.finishNum": res.data.finishNum ? res.data.finishNum:0,
        "staffCustomer.list": res.data.list,
        "staffCustomer.count": res.data.list ? res.data.list.length : 0
      })
    })
  },
  // 页面跳转
  customInfo(e) {
    let type = e.currentTarget.dataset.type
    console.log(type)
    let url = ''
    // customer 员工客户列表      boss客户列表 user - customer         员工龙虎榜  employees - list  
    if (type == "custom") {
      if (this.data.customer.list.length>0){
        url = "../user-customer/user-customer?taskId=" + this.data.id 
      }else{
        url=null
      }
    } else {
      if (this.data.staffCustomer.list.length>0){
        url = "../employees-list/employees-list"
      } else {
        url = null
      }
    }
    wx.navigateTo({
      url: url
    })
  },
  // 地域分布
  getRegionList() {
    let that = this
    activityService.regionList(that.data.paramsTask, (err, res) => {
      that.setData({
        mapDataSource: res.data
      })
    })
  },
  // 浏览习惯
  getBrowseTimespanList() {
    let that = this
    activityService.browseTimespan(that.data.paramsTask, (err, res) => {
      let arr = res.data
      let arrData = []
      arr.forEach((item, index) => {
        if (index > 2) {
          arrData.push(item.value)
        }
      })
      arr.forEach((item, index) => {
        if (index < 3) {
          arrData.push(item.value)
        }
      })
      that.setData({
        dailyLineDataSource: arrData
      })
    })
  },
  /*---------------------------- 任务数据结束--------------------------------------*/
  /*------------------------------ 插件数据--------------------------------------*/
  getKeyword(e) {
    this.setData({
      'params.search': e.detail.value
    })
  },
  //获取tabs
  getTabs() {
    let self = this
    activityService.plugTabList({
      taskId: self.data.id
    }, (err, res) => {
      let arrNavData = []
      if (res.status == 0) {
        let arr = res.data
        let tabscont = [{ key: 'formData', name: "报名", isShow: false },
          { key: 'goods', name: "商品", isShow: false },
          { key: 'redEnvelopes', name: "红包", isShow: false },
          { key: 'reward', name: "抽奖", isShow: false },
          { key: 'call', name: "拨号", isShow: false },
          { key: 'thumbup', name: "点赞", isShow: false },
          { key: 'vote', name: "投票", isShow: false },
          { key: 'yuyue', name: "预约", isShow: false }]

        if (arr.length > 0) {
          arr.forEach(item => {
            switch (item.type) {
              case 1:
                item.key = "card"
                break;
              case 2:
                item.key = "formData"
                tabscont[0].isShow = true
                break;
              case 3:
                item.key = "goods"
                tabscont[1].isShow = true
                break;
              case 4:
                item.key = "redEnvelopes"
                tabscont[2].isShow = true
                break;
              case 5:
                item.key = "thumbup"
                tabscont[5].isShow = true
                break;
              case 6:
                item.key = "vote"
                tabscont[6].isShow = true
                break;
              case 7:
                item.key = "reward"
                tabscont[3].isShow = true
                break;
              case 10:
                item.key = "yuyue"
                tabscont[7].isShow = true
                break;
              default:
                tabscont[4].isShow = true
                item.key = "call"
            }
          })
          tabscont.forEach((item,index)=>{
            if (item.isShow){
              arrNavData.push(item)
            } 
          })
        }
        self.setData({
          tabNav: arrNavData,
          activePlugTab: arrNavData[0] ? arrNavData[0].key: ''
        })
        self.navPlurTabChange()
      }
    })
  },
  // 获取 controlId 
  getIds() {
    let self = this
    let cont = {
      relationId: self.data.id,
      type: self.data.activePlugTab == "yuyue"?3:1
    }
    return new Promise((resolve,reject)=>{
      activityService.fromLableList(cont, (err, res) => {
        let arr = res.data ? res.data : []
        self.setData({
          fromLables: arr,
          conditionTxt: arr[0] ? arr[0].name : '',
          controlIdFrom: arr[0] ? arr[0].controlId : ''
        })
        if(arr.length>0){
          resolve(res)
        }
      })
    })
  },
  // 修改表单
  openConditionlist(e) {
    let self = this
    let lablesArr = self.data.fromLables
    console.log(lablesArr)
    let listArr = []
    lablesArr.forEach(item => {
      listArr.push(item.name)
    })
    console.log(listArr)
    wx.showActionSheet({
      itemList: listArr,
      success(res) {
        console.log(res)
        self.setData({
          controlIdFrom: lablesArr[res.tapIndex].controlId,
          conditionTxt: lablesArr[res.tapIndex].name
        })
        self.getFormContData()
      }
    })
  },
  // 投票
  getVoteList() {
    let self = this
    let cont = {
      relationId: self.data.id,
      pageSize :self.data.params.pageSize,
      pageIndex: self.data.params.pageIndex,
      rootUserId: self.data.isCompany ? '' : app.globalData.userInfo.userId
    }
    activityService.voteList(cont, (err, res) => {
      let arr = res.data.list ? res.data.list : []
      self.setData({
        listData: arr
      })
    })
  },
  //公共汇总数据 pluginStatistical
  getStatisitical(type) {
    let self = this
    let contType = 2  //1：名片(预留) 2：报名 3：商品 4：红包 5：点赞 6：投票 7：中奖 8：拨号
    switch (type) {
      case "formData":
        contType = 2
        break;
      case "goods":
        contType = 3
        break;
      case "redEnvelopes":
        contType = 4
        break;
      case "thumbup":
        contType = 5
        // 点赞
        break;
      case "vote":
        contType = 6
        // 投票
        break;
      case "reward":
        contType = 7
        // 中奖
        break;
      default:
        contType = 8
      // 拨号
    }
    return new Promise((resolve, reject) => {
      activityService.pluginStatistical({
        taskId: self.data.id,
        type: contType,
        businessId:app.globalData.userInfo.businessId,
        rootUserId: self.data.isCompany ? '' : app.globalData.userInfo.userId
      }, (err, res) => {
        if (res.status == 0) {
          let cont = self.data.statistical
          cont.value = res.data.dataNum ? res.data.dataNum : 0
          cont.total = res.data.browseData ? res.data.browseData : 0
          cont.totalVolume = res.data.amount ? res.data.amount : 0
          self.setData({
            statistical: cont
          })
          resolve(cont)
        }
      })
    })
  },
  // 报名
  getFormContData() {
    let self = this
    let cont = {
      controlId: self.data.controlIdFrom,
      id: self.data.id,
      rootUserId: self.data.isCompany ? '' : app.globalData.userInfo.userId,
      pageIndex: self.data.params.pageIndex,
      pageSize: self.data.params.pageSize,
      // 加一个预约和报名区分
    }
    activityService.getFormContent(cont, (err, resdata) => {
      if (resdata.status == 0) {
        let resList = resdata.data.list
        resList.forEach(item => {
          item.content.forEach(it => {
            if (this.data.itemTypeArr.includes(it.type)) {
              it.text = JSON.parse(it.text)
              it.isArrs = true
            } else {
              it.isArrs = false
            }
          })
        })
        self.setData({
          formDataListData: resList,
          formDataTitle: resdata.data.title
        })
        console.log(self.data.formDataListData)
      }
    })
  },
  //报名查看详情
  pulgFromEvent(data) {
    // 中奖 data.currentTarget.dataset.maskitem 
    // 报名 data
    let maskData;
    if (this.data.activePlugTab == "formData") {
      maskData = data
    } else if (this.data.activePlugTab == "reward") {
      maskData = data.currentTarget.dataset.maskitem
    }
    this.setData({
      isShowInfo: true,
      maskInfoData: maskData
    })
    console.log(this.data.maskInfoData)
  },
  // 复制信息 copyMaskInfo 
  copyMaskInfo() {
    let copydata = ''
    if (this.data.activePlugTab == "formData") {
      let infoTitle = this.data.formDataTitle
      let infoData = this.data.maskInfoData.detail.content
      infoTitle.forEach((item, index) => {
        if (index > 0) {
          if (infoData[index - 1].isArrs) {
            infoData[index - 1].text.forEach(it => {
              if (!it.img) {
                copydata += it.text + ' '
              }
            })
          } else {
            copydata += item + ': ' + infoData[index - 1].text + ' '
          }
        }
      })
    } else if (this.data.activePlugTab == "reward") {
      let infodata = this.data.maskInfoData
      copydata += "活动名称：" + infodata.acticityName
      copydata += " 奖项奖品：" + infodata.prizeName
      copydata += " 兑奖情况："
      copydata += infodata.userCashType == 1 ? '线上兑奖 ' : '线下兑奖 '
      copydata += infodata.exchangeState == 1 ? '奖品已寄出 ' : '未兑奖 '
      copydata += infodata.exchangetime ? infodata.exchangetime : ""
      copydata += " "
      infodata.content.forEach(item => {
        copydata += item.name + ": " + item.content
      })
    }
    wx.setClipboardData({
      data: copydata,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data)
          }
        })
      }
    })
  },
  //商品列表
  getGoodsList() {
    let self = this
    let cont = {
      "businessId": app.globalData.userInfo.businessId,
      "taskId": self.data.id,
      "goodsName": self.data.params.search,
      "pageIndex": self.data.params.pageIndex,
      "pageSize": self.data.params.pageSize
    }
    activityService.plugUnitGoodsList(cont, (err, res) => {
      let arr = res.data.goods ? res.data.goods : []
      self.setData({
        goodsListData: self.data.params.pageIndex == 1 ? arr : self.data.listData.concat(arr)
      })
    })
  },
  //商品概况
  getGoodsCont() {
    let self = this
    let cont = {
      "businessId": app.globalData.userInfo.businessId,
      "taskId": self.data.id
    }
    activityService.plugUnitGoodsSummary(cont, (err, res) => {
      self.setData({
        "orderDataSource.total": res.data.totalBrowseCount,
        "orderDataSource.value": res.data.totalOrderCount,
        "orderDataSource.totalVolume": res.data.totalVolume
      })
    })
  },
  //红包
  getRedPacketList() {
    let self = this
    let cont = {
      taskId: self.data.id,
      pageIndex: self.data.params.pageIndex,
      pageSize: self.data.params.pageSize,
      keyword: self.data.params.search,
      rootUserId: self.data.isCompany ? '' : app.globalData.userInfo.userId
    }
    activityService.redRedpacketlist(cont, (err, res) => {
      let arr = res.data.list ? res.data.list : []
      self.setData({
        redpacketListdata: self.data.params.pageIndex == 1 ? arr : self.data.redpacketListdata.concat(arr)
      })
    })
  },
  // 中奖
  getRewardContent() {
    let self = this
    let cont = {
      relationId: self.data.id,
      pageSize: self.data.params.pageSize,
      pageIndex: self.data.params.pageIndex,
      rootUserId: self.data.isCompany ? '' : app.globalData.userInfo.userId
    }
    activityService.drawprizeLog(cont, (err, res) => {
      let arr = res.data.list ? res.data.list : []
      self.setData({
        rewardDataList: self.data.params.pageIndex == 1 ? arr : self.data.rewardDataList.concat(arr)
      })
    })
  },
  // 预约
  getYuyueContent(){

  },
  // 搜索
  getInfoCont() {
    let that = this
    this.navPlurTabChange()
  },
  closeMask() {
    this.setData({
      isShowInfo: false
    })
  },
  navbarTabChange: function (e) { //一级菜单tab切换
    this.setData({
      activeNavTab: e.detail.key,
      activePlugTab: this.data.tabNav[0].key
    })
    if (this.data.activeNavTab == 'baseData') {
      this.taskDataFn()
    } else {
      this.navPlurTabChange()
      if (this.data.activeNavTab[0].key == 'formData') {
        this.getFormContData()
      }
    }
  },
  navPlurTabChange: function (e) { //插件tab切换
    let that = this
    let isKey = that.data.activePlugTab
    if (e) {
      isKey = e.currentTarget.dataset.key
      if (isKey != that.data.activePlugTab) {
        that.setData({
          activePlugTab: isKey,
          "params.pageIndex": 1
        })
      }
    }
    that.getStatisitical(isKey).then(res => {
      switch (that.data.activePlugTab) {
        case "formData":
          // 报名
          that.setData({
            showTitle: isKey == 'formData' || isKey == 'goods' ? false : true,
            showLoadMore: false
          })
          that.getIds().then(res => { that.getFormContData()})
          break;
        case "goods":
          // 商品
          that.setData({
            showTitle: isKey == 'formData' || isKey == 'goods' ? false : true,
            showLoadMore: false
          })
          that.getGoodsList()
          that.getGoodsCont()
          break;
        case "redEnvelopes":
          // 红包
          that.setData({
            "titleCont.title": '领取次数',
            "titleCont.titleNun": res.value,
            "titleCont.redEnvelopes": '发放总额',
            "titleCont.redPrice": res.totalVolume,
            "titleCont.content": "小小红包，也是一种很好的裂变方式，帮助您带来更多的客户",
            showTitle: isKey == 'formData' || isKey == 'goods' ? false : true,
            showLoadMore: false
          })
          that.getRedPacketList()
          break;
        case "thumbup":
          that.setData({
            "titleCont.title": '点赞次数',
            "titleCont.titleNun": res.value,
            "titleCont.content": "小小点赞是客户对您的最好褒奖",
            showTitle: isKey == 'formData' || isKey == 'goods' ? false : true,
            showLoadMore: false
          })
          // 点赞
          break;
        case "vote":
          // 投票
          that.setData({
            "titleCont.title": '投票次数',
            "titleCont.titleNun": res.value,
            "titleCont.content": "小小投票，是客户表达自己心意的方式，也是对您的信任",
            showTitle: isKey == 'formData' || isKey == 'goods' ? false : true,
            showLoadMore: false
          })
          that.getVoteList()
          break;
        case "reward":
          // 中奖
          that.setData({
            "titleCont.title": '中奖次数',
            "titleCont.titleNun": res.value,
            "titleCont.content": "抽奖活动，增加客户和你的黏性，帮助他更好的认识你",
            showTitle: isKey == 'formData' || isKey == 'goods' ? false : true,
            showLoadMore: false
          })
          that.getRewardContent()
          break;
        case "yuyue":
          // 预约
          that.setData({
            "titleCont.title": '预约次数',
            "titleCont.titleNun": res.value,
            "titleCont.content": "预约的都是意向客户，快快联系确定安排，下一个爆单王就是你！",
            showTitle: isKey == 'formData' || isKey == 'goods' ? false : true,
            showLoadMore: false
          })
          that.getIds().then(res => { that.getFormContData() })
          break;
        default:
          // 拨号
          that.setData({
            "titleCont.title": '拨号次数',
            "titleCont.titleNun": res.value,
            "titleCont.content": "小小拨号，证明客户是有心想要联系你，还等什么，主动出击吧！",
            showTitle: isKey == 'formData' || isKey == 'goods' ? false : true,
            showLoadMore: false
          })
      }
      var list = this.data.tabNav;
    })
    // for (var i in list) {
    //   console.log("lis",list[i].key)
    // }
    // switch (e.detail.key) {
    //   case "formData":
    //     self.getFormContData();
    //     break;
    // }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.setData({
        "params.pageIndex": 1
      })
    this.getList()
  },
  /**
   * 页面监听滚动条
   */
  onPageScroll(e) {
    let that = this
    this.setData({
      showLoadMore: that.data.activeNavTab == 'plugData' ? true : false
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.activeNavTab == 'plugData') {
      let that = this
      let pageAll = Math.ceil(that.data.total / that.data.params.pageSize)
      that.setData({
        "params.pageIndex": that.data.params.pageIndex + 1
      })
      if (that.data.params.pageIndex <= pageAll) {
        that.navPlurTabChange()
      } else {
        that.setData({
          textinfo: "已经到底了"
        })
      }
    }
  },
  /*------------------------------插件数据结束--------------------------------------*/
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  previewImage: function (e) {
    let urls = e.currentTarget.dataset.imgs.map(item => {
      return item.img
    });
    wx.previewImage({
      current: urls[e.currentTarget.id],
      urls: urls
    });
  },
  stopScroll: function (event) {
    event && event.stopPropagation && event.stopPropagation();
  },
  bgColor: function () {
    var i = 0;
    var str = "#";
    var random = 0;
    var aryNum = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

    for (i = 0; i < 6; i++) {
      random = parseInt(Math.random() * 16);

      str += aryNum[random];
    }
    return str
  }
})