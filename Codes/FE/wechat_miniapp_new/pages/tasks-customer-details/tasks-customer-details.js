// pages/tasks-customer-details/tasks-customer-details.js
const activityService = require('../../services/activity-service.js');
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskCust: {}, //列表客户信息
    customerInfo: {}, //客户详情
    id: '', //客户id
    marketingData: {
      label: [0, 0, 0, 0],
      value: [0, 0, 0, 0]
    },
    dailyLineDataSource: [], //浏览习惯
    sourceList: [], //来源数据
    listLength: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item = JSON.parse(options.item) 
    this.setData({
      taskCust: item,
      id: item.id,
      isCompany: getApp().globalData.isCompany
    })
    console.log("单个客户数据", this.data.taskCust, options.item.id)
  },

  //任务客户详情(来源和详情)
  customerSource: function () {
    let self = this;
    new Promise(function (resolve, reject) {
      if (!!self.data.isCompany){
        activityService.getBusinessCustomerInfo({
          id: self.data.id,
          taskId: getApp().globalData.taskId || ''
        }, (err, res) => {
          if (res.status == 0) {
            self.setData({
              customerInfo: res.data
            })
            resolve(res.data);
            console.log("企业任务客户详情", self.data.customerInfo)
          } else {
            reject(res.message);
          }
        })
      }else{
        activityService.getCustomerInfo({
          id: self.data.id,
          taskId: getApp().globalData.taskId || ''
        }, (err, res) => {
          if (res.status == 0) {
            self.setData({
              customerInfo: res.data,
            })
            resolve(res.data);
            console.log("员工任务客户详情", self.data.customerInfo)
          } else {
            reject(res.message);
          }
        })
      }
      
    }).then(function (data) {
      activityService.customerSource({
        merchantId: data.business_id,
        taskId: data.from_id,
        rootUserId: data.ser_user_id,
        userId: data.user_id
      }, (err, res) => {
        if (res.status == 0) {
          for (var i = 0; i < res.data.length; i++) {
            if (i == res.data.length - 1) {
              var oldObj = res.data[i];
              var newObj = Object.assign({
                from_type: data.from_type,
                from_name: data.from_name
              }, oldObj)
            }
          }
          var newArr = res.data.splice(-1, 1, newObj)
          self.setData({
            sourceList: res.data,
            listLength: res.data.length
          })
        }
      })
    })
  },

  // 浏览习惯
  getBrowseTimespanList() {
    let self = this;

    activityService.browseTimespan({
      businessId: self.data.taskCust.business_id,
      taskId: getApp().globalData.taskId,
      userId: !!self.data.isCompany?'':getApp().globalData.commonInfo.userId,
      targetUserId: self.data.taskCust.user_id
    }, (err, res) => {
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
      self.setData({
        dailyLineDataSource: arrData
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      marketingData: {
        label: [0, 0, 0, 0],
        value: [0, 0, 0, 0]
      },
      //dailyLineDataSource: [60, 80, 100, 40, 150, 440, 620, 310, 600, 500, 800, 400, 200, 160, 78, 40, 33, 21, 12, 30, 8, 33, 16, 28]
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: this.data.taskCust.name || this.data.taskCust.nickname 
    })
    this.customerSource();
    this.getBrowseTimespanList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})