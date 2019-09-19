// pages/red-envelopes-detail/red-envelopes-detail.js
const config = require('../../config.js'),
  util = require('../../utils/util.js'),
  activityService = require('../../services/activity-service.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    pageIndex: 1, //分页页码
    pageSize: 10, //一页显示几个数据
    loadingOpj: {
      more: true, //是否有下一页
      loadingText: '',
      isLoading: false
    },
    active: '', //跳转状态(receiveData:收到,issueData:发出)
    name: '', //用户姓名
    photo: '', //用户头像
    id: '', //红包id
    //sendid: '', //发送红包id
    redpackeList: [], //收到的红包数据
    redpackeInfo: {},
    // sendInfoList: [], //收到的红包数据
    // sendInfo: {},
    sendstate: null //发出红包状态 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu(); //隐藏右上角转发
    this.setData({
      active: options.active,
      // name: options.name,
      // photo: options.photo,
      id: options.id == null ? '' : options.id,
      // sendid: options.sendid == null ? '' : options.sendid,
      sendstate: options.sendstate == null ? '' : options.sendstate,
      showFastNav: !!options.id && !options.hideFastNav
    })
    // console.log("传递参数",options)
  },
  //获取上级页面数据
  superior: function () {
    var self = this;
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    // console.log("山鸡也面", prePage)
  },
  //红包详情 
  getredPackeInfo: function () {
    var self = this;
    wx.showNavigationBarLoading();
    self.setData({
      loadingOpj: {
        isLoading: true,
        loadingText: "加载中"
      }
    });
    activityService.getredPackeInfo({
      id: self.data.id,
    }, (err, res) => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.hideLoading();
      if (res.status == 0) {
        self.data.loadingOpj.isLoading = false;
        self.data.total = res.data.total;
        if (self.data.pageIndex === 1) {
          self.data.redpackeList = [];
        };
        for (let i = 0; i < res.data.list.length; i++) {
          self.data.redpackeList.push(res.data.list[i]);
        }
        self.data.loadingOpj.more = self.data.pageIndex * self.data.pageSize < self.data.total ? 1 : 0;
        self.data.loadingOpj.loadingText = self.data.total > 0 ? (self.data.pageIndex * self.data.pageSize < self.data.total ? '' : '这是我的底线了') : '';
        self.setData({
          redpackeList: self.data.redpackeList,
          redpackeInfo: res.data.info
        })
        // console.log("收到数据", self.data.redpackeList)
      } else {
        self.data.loadingOpj.loadingText = '';
        util.toast.fail({
          title: "获取红包数据失败"
        });
      }
      self.setData({
        loadingOpj: self.data.loadingOpj
      });
    })
  },
  //提现跳转
  cashMoney: function () {
    wx.navigateTo({
      url: '/pages/cash-withdrawal/cash-withdrawal'
    })
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
    this.superior();
    // if (this.data.active == 'receivedData') {
    //   this.getReceiveInfo();
    // } else if (this.data.active == 'issueData') {
    //   this.getSendInfo();
    // }
    this.getredPackeInfo()

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
    // if (this.data.active == 'receivedData'){
    //   this.getReceiveInfo();
    // } else if (this.data.active == 'issueData'){
    //   this.getSendInfo();
    // }
    this.getredPackeInfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this;
    // if (this.data.active == 'receivedData') {
    //   if (!!self.data.loadingOpj.more) {
    //     self.data.pageIndex++;
    //     self.getReceiveInfo();
    //   }
    // } else if (this.data.active == 'issueData') {
    //   if (!!self.data.loadingOpj.more) {
    //     self.data.pageIndex++;
    //     self.getSendInfo();
    //   }
    // }
    this.getredPackeInfo()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})