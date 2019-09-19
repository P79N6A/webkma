// pages/marketing-report.js
const activityService = require('../../services/activity-service.js'),
  statisticsService = require('../../services/statistics-service.js'),
  utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 测试用
    // testUrl: '../../images/icon-defaultPhoto.png',
    // testUrl: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2857172539,3231616089&fm=26&gp=0.jpg',
    totalList: [{
        label: '总任务',
        value: 20,
        length: '158rpx'
      },
      {
        label: '总曝光',
        value: 150,
        length: '188rpx'
      },
      {
        label: '总客户',
        value: 178,
        length: '163rpx'
      },
      {
        label: '总浏览时长/min',
        value: 220,
        length: '220rpx'
      }
    ],
    taskData: {
      totalInvestment: 0,
      merchantCustomerCount: 0,
      orderTotalCost: 0
    },
    taskDataSource: {},
    recordList: [1, 2, 3],
    employeeRecordDataSource: {},
    // 地图
    mapDataSource: {},
    showModal: false,
    rankingData: [], //前三名员工
    rankingFlag: true, //员工状态
    orderInfo: {},
    goodsInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBossDashboard();
  },
  // 跳转到echarts页面
  toEcharts() {
    // wx.navigateTo({
    //   url: `/pages/echart-demo/echart-demo`
    // });
    return false
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getrankingList();
    this.getRegionList();
    this.getOrderStatistics();
  },
  //获取排名信息
  getrankingList: function() {
    let self = this,
      businessId = getApp().globalData.commonInfo.businessId,
      session_id = getApp().globalData.userInfo.session_id;
    activityService.getEmployeeList({
      "session_id": session_id,
      "pageIndex": 1,
      "pageSize": 3,
      "keyWords": "",
      "orderType": 1,
      "business_id": getApp().globalData.userInfo.businessId
    }, (err, res) => {
      if (res.status == 0) {
        let datainfo = res.data.list.length > 2 ? res.data.list.slice(0, 3) : res.data.list;
        datainfo.forEach(item => {
          if (item.face !== null && item.face !== "") {
            if (item.face.indexOf("jpg") > 0 || item.face.indexOf("png") > 0 || item.face.indexOf("jpeg") > 0) {
              item.face = item.face + '@s_2,w_70,h_70'
            }
          }
        })
        if (
          datainfo[0].marketing_power == 0 && datainfo[0].totalUser == 0 &&
          datainfo[1].marketing_power == 0 && datainfo[1].totalUser == 0 &&
          datainfo[2].marketing_power == 0 && datainfo[2].totalUser == 0
          ) {
          self.setData({
            rankingFlag: false
          })
        }
        self.setData({
          rankingData: datainfo
        });
        console.log("前三名", self.data.rankingData, "全无状态", self.data.rankingFlag)
      }
    });
  },
  //获取boss营销面板数据
  getBossDashboard: function() {
    let self = this;
    activityService.bossDashboard({
      "businessId": getApp().globalData.userInfo.businessId,
      "empId": getApp().globalData.userInfo.emplId,
    }, (err, res) => {
      if (res.status == 0) {
        let _min = res.data.totalAccessTime / 60;
        self.setData({
          totalList: [{
              label: '总任务',
              value: res.data.merchantTaskCount,
              length: '158rpx'
            },
            {
              label: '总曝光',
              value: res.data.totalBrowseCount,
              length: '188rpx'
            },
            {
              label: '总客户',
              value: res.data.merchantCustomerCount,
              length: '163rpx'
            },
            {
              label: '总浏览时长/min',
              value: _min.toString().indexOf('.') != -1 ? _min.toString().substr(0, _min.toString().indexOf('.') + 3) : _min ,
              length: '220rpx'
            }
          ],
          taskDataSource: {
            total: res.data.merchantTaskCount,
            completed: res.data.completeTaskCount
          },
          taskData: {
            totalInvestment: res.data.totalInvestment,
            merchantCustomerCount: res.data.merchantCustomerCount,
            orderTotalCost: res.data.orderTotalCost
          },
          userData: {
            income: res.data.orderTotalCost, //总收益
            getTargetNum: res.data.merchantCustomerCount.toString(), //总获客
            plunge: res.data.totalInvestment, //总投入
            despose: res.data.totalBrowseCount, //总曝光
            time: res.data.totalAccessTime, //时长
            taskNum: res.data.merchantTaskCount, //总任务
            complete: res.data.completeTaskCount, //总完成
            employee: res.data.top3employee
          },
          employeeRecordDataSource: {
            total: res.data.merchantEmpCount,
            value: res.data.merchantEmpFullMarks
          }
        })
        console.log("boss", res.data)
      } else {
        utils.toast.fail({
          title: "获取营销面板数据失败"
        });
      }
    });
  },
  //获取订单分析
  getOrderStatistics: function() {
    let self = this,
      businessId = getApp().globalData.commonInfo.businessId,
      session_id = getApp().globalData.userInfo.session_id;
    statisticsService.orderStatistics({
      "session_id": session_id,
      "businessId": getApp().globalData.userInfo.businessId
    }, (err, res) => {
      if (res.status == 0) {
        res.data.summary.price = res.data.summary.totalVolume / res.data.summary.orderUser
        let _conversion = res.data.summary.orderUser / res.data.summary.userCount * 100
        res.data.summary.conversion = _conversion.toString().indexOf('.') != -1 ? _conversion.toString().substr(0, _conversion.toString().indexOf('.') + 3) : _conversion
        self.setData({
          orderInfo: res.data.summary,
          goodsInfo: res.data.hot,
        });
      }
    });
  },
  //获取地域分布
  getRegionList: function() {
    let self = this,
      businessId = getApp().globalData.commonInfo.businessId,
      session_id = getApp().globalData.userInfo.session_id;
    statisticsService.regionStatistics({
      "session_id": session_id,
      "businessId": getApp().globalData.userInfo.businessId
    }, (err, res) => {
      if (res.status == 0) {
        self.setData({
          mapDataSource: res.data
        });
      }
    });
  },
  createReport() {
    wx.showLoading({
      title: '报表生成中',
    })
    this.setData({
      showModal: true
    });
    setTimeout(() => {
      wx.$emit('drawReport');
    });
  },
  parentEvent(data) {
    this.setData({
      showModal: false
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})