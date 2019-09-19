// pages/overview/overview.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radarDataSource: [],
    mapDataSource: [],
    dailyLineDataSource: [],
    taskDataSource: {}, 
    genderDataSource: {},
    formDataSource: {},
    orderDataSource: {},
    employeeRecordDataSource: {},
    funnelDataSource:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(() => {
      this.setData({
        funnelDataSource: [
          { value: 5, name: '国外' },
          { value: 12, name: '情况不明' },
          { value: 18, name: '省外' },
          { value: 25, name: '省内' },
        ],
        radarDataSource:{
          label:[80, 60, 0, 0],
          value: [100, 120, 0, 0]
        },
        mapDataSource:{
          province:[]
        },
        dailyLineDataSource: [60, 80, 100, 40, 150, 440, 620, 310, 600, 500, 800, 400, 200, 160, 78, 40, 33, 21, 12, 30, 8, 33, 16, 28],
        taskDataSource: {
          total: 5000,
          completed: 800
        },
        genderDataSource: {
          total: 2000,
          male: 800,
          female: 600
        },
        formDataSource: {
          total: 800,
          value: 256
        },
        orderDataSource: {
          total: 800,
          value: 46
        },
        employeeRecordDataSource: {
          total: 200,
          value: 152
        }
      });
    }, 500);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})