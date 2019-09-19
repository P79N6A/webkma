let webim = require("../../vendor/timsdk/webim_wx.min.js");
global.webim = webim;
const config = require('../../config.js'),
  timCommon = require("../../vendor/timsdk/common.js"),
  regeneratorRuntime = require("../../utils/runtime.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recentContactList: [],
    isShowFastNav: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu(); //隐藏右上角转发
    this.setData({
      isShowFastNav: options.isShowFastNav || '' //是否展示快键菜单
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(webim.MsgStore.sessMap())
    wx.$on('getRecentContactList', () => {
      this.getRecentContactList();
    })
    this.getRecentContactList()
  },
  //获取最近联系人
  getRecentContactList: function() {
    let _this = this;
    timCommon.getRecentContactList().then(result => {
      _this.setData({
        recentContactList: result
      })
    });
  },
  //跳转私信聊天界面
  toMessageSend: function(e) {
    console.log(webim.MsgStore.sessMap())
    this.setData({
      friendsList: this.data.recentContactList.map(item => {
        if (item.SessionId == e.currentTarget.dataset.accountid) {
          item.UnreadMsgCount = 0;
        }
        return item;
      })
    });
    wx.navigateTo({
      url: '/pages/instant-messenger-send/instant-messenger-send?accountid=' + e.currentTarget.dataset.accountid,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // this.data.pagination.dataMore = true;
    // this.data.pagination.pageIndex++;
    // this.getAllFriend();
  },
})