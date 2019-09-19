// pages/switch-card/switch-card.js
// pages/marketing/marketing.js
const config = require('../../config.js'),
  utils = require('../../utils/util.js'),
  activityService = require('../../services/activity-service.js'),
  userSvr = require("../../services/user-info.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    corpList: {},
    //businessId:'' //企业id
    current:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.changeIndexIne();
  },
  // 获取上级页面数据
  changeIndexIne: function () {
    var pages = getCurrentPages(); 
    var prevPage = pages[pages.length - 2];
    // console.log("切换企业数据", prevPage)
    //将父页面的数据赋给子页面
    this.setData({
      corpList: prevPage.data.dataList.companys
      // current: prevPage.data.current
    })
  },
  //点击选中当前企业
  selectCorp: function (e) {
    var self = this;
    var item = e.currentTarget.dataset.item; 
    var businessId = item.businessId;
    this.setData({ 
      current: e.currentTarget.dataset.index,
    })
    userSvr.staffCorp({ businessId: businessId }, function (err, res) {
      if (res.status == 0) { 
        // wx.reLaunch({
        //   url: '/pages/my/index',
        // })
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 1];
        prePage.onLoad();
        setTimeout(function () {
          wx.navigateBack({ delta: 1 });
        }, 500);
        console.log(res)
      } else { console.log(err) }
    })
    // console.log("id", e, "shangjiaid", item, '企业', businessId)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.changeIndexIne();
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