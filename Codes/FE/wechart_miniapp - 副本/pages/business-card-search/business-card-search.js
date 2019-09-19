const utils = require('../../utils/util.js'),
  cardsService = require('../../services/cards.js'),
  activityService = require('../../services/activity-service.js'),
  userSvr = require("../../services/user-info.js"),
  utilStatistics = require("../../services/statistics-service.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    cardList: [],
    logList: [],
    pagination: { //用户雷达分页
      pageIndex: 1,
      pageSize: 4,
      dataMore: true
    },
    listStatus: {
      isLoading: false,
      loadingText: ''
    },
    tpl: 'log'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载搜索日志
    this.data.logList = !!wx.getStorageSync('log') ? wx.getStorageSync('log') : [];
    this.setData({
      logList: this.data.logList
    })
  },
  bindKeyInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  clearSearch: function(){
    this.setData({
      name: '',
      tpl: 'log',
      cardList: []
    });
  },
  //可见不可见处理
  dataProcess: function (data, type, status) {
    if (!data[type] || this.data.isSelfCard) return data[type];
    switch (data[status]) {
      case 1: break;
      case 2:
        if (!(data['status'] == '0' && data['type'] == '2')) {
          data[type] = data[type].substr(0, 3) + data[type].substr(3).replace(/[\s\S]/g, '*');
        }
        break;
      case 3:
        data[type] = data[type].substr(0).replace(/[\s\S]/g, '*');
        break;
    }
    return data[type];
  },
  //获取名片列表
  getList: function (more) {
    wx.showNavigationBarLoading();
    this.setData({
      listStatus: {
        isLoading: true,
        loadingText: "加载中"
      }
    });
    if(!!more && !!more.type){
      this.data.cardList = [];
    }
    let self = this;
    cardsService.getCardList({ status: '0,3', name: self.data.name, pageSize: self.data.pagination.pageSize, pageIndex: self.data.pagination.pageIndex }, function (err, result) {

      wx.hideNavigationBarLoading();
      wx.hideLoading();
      self.data.listStatus.isLoading = false;
      if (!!err || result.status != 0) {
        self.data.listStatus.loadingText = '';
        utils.toast.fail({
          title: result.message
        });
      }

      result.data.data.forEach((item) => {
        item.phone = self.dataProcess(item, 'phone', 'pvtPhone');
      })

      if (parseInt(self.data.pagination.pageIndex) * parseInt(self.data.pagination.pageSize) >= parseInt(result.data.total)) {
        self.data.pagination.dataMore = false;
        self.data.listStatus.loadingText = '已经到底部了';
      } else {
        self.data.listStatus.loadingText = '';
      }

      if (!!more) {//分页
        self.data.cardList = self.data.cardList.concat(result.data.data);
      } else {
        self.data.cardList = result.data.data;
      }

      let logList = self.data.logList.filter((n) => { return n != self.data.name; });
      logList.unshift(self.data.name);

      self.setData({
        cardList: self.data.cardList,
        listStatus: self.data.listStatus,
        logList: logList,
        tpl: 'card'
      })

    })
  },
  search: function(e){
    this.setData({
      name: e.currentTarget.dataset.item      
    });
    this.getList();
  },
  cancelSearch: function(){
    wx.navigateBack({});
  },
  // 删除记录
  removeLog: function(e){
    let index = e.currentTarget.dataset.index, self = this;
    this.data.logList.splice(index, 1);
    this.setData({
      logList: self.data.logList
    });
  },
  //清空记录
  emptyLog: function(){
    this.data.logList = [];
    this.setData({
      logList: this.data.logList
    });
  },
  toCardDetail: function (e) {
    wx.navigateTo({
      url: '/pages/card-detail/card-detail?id=' + e.currentTarget.dataset.id + '&origin=list'
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let self = this;
    wx.setStorageSync('log', self.data.logList);
  },
  onHide: function () {
    let self = this;
    this.data.pagination.pageIndex = 1;
    this.data.pagination.dataMore = true;
    this.data.listStatus.loadingText = '';
    this.data.listStatus.isLoading = false;
    wx.setStorageSync('log', self.data.logList);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!!this.data.pagination.dataMore && this.data.tpl == 'card') {
      this.data.pagination.pageIndex++;

      this.getList(true);
    }
  }
})