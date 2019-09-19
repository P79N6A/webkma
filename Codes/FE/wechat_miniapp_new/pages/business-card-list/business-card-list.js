// pages/card-list/card-list.js
let cardsService = require('../../services/cards.js'),
  activityService = require('../../services/activity-service.js'),
  utils = require("../../utils/util.js"),
  timCommon = require("../../vendor/timsdk/common.js"),
  userSvr = require("../../services/user-info.js"),
  utilStatistics = require("../../services/statistics-service.js");
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTips:false,
    list:[],
    tpl: '',
    pagination: { //用户雷达分页
      pageIndex: 1,
      pageSize: 6,
      dataMore: true
    },
    listStatus: {
      isLoading: false,
      loadingText: ''
    },
    totalNum:"" //名片总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu(); //隐藏右上角转发
  },
  onShow: function(){
    let self = this;
    this.data.pagination.pageIndex = 1;
    this.data.pagination.dataMore = true;
    this.getList();
  },
  // 获取自己的信息
  getSelfInfo: function () {
    var self = this;
    activityService.personalInfoQuery({}, (err, res) => {
      if (res.status == 0) {
        self.setData({
          detail: res.data,
          tpl: 'exchange'
        });
      } else {
        utils.toast.fail({
          title: "获取名片信息失败"
        });
      }
      wx.hideLoading();
    })
  },
  //可见不可见处理
  dataProcess: function (data, type, status) {
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
  getList: function(more){
    wx.showNavigationBarLoading();
    this.setData({
      listStatus: {
        isLoading: true,
        loadingText: "加载中"
      }
    });
    let self = this
    , option = {
      type: '',
      status: '0,3', 
      name: "", 
      pageIndex: self.data.pagination.pageIndex,
      pageSize: self.data.pagination.pageSize
    };
    cardsService.getCardList(option, function (err, result) {
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

      if (parseInt(option.pageIndex) * parseInt(option.pageSize) >= parseInt(result.data.total)) {
        self.data.pagination.dataMore = false;
        self.data.listStatus.loadingText = '这是我的底线了';
      } else {
        self.data.listStatus.loadingText = '';
      }

      if (!!more) {//分页
        self.data.list = self.data.list.concat(result.data.data);
      } else {
        self.data.list = result.data.data;
      }

      self.setData({
        list: self.data.list,
        listStatus: self.data.listStatus,
        tpl: 'list',
        totalNum: result.data.total,
        isList: self.data.type != '2' ? true : '',
        'pagination.dataMore': self.data.pagination.dataMore
      })
      wx.setNavigationBarTitle({
        title: '名片夹'
      });
    })
  },
  toCardDetail: function(e){
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/bussiness-card-detail/bussiness-card-detail?id=${item.id}&from_company=${item.from_company}&rootUserId=${item.from_user}&origin=list`
    })
  },
  searchCard: function(){
    wx.navigateTo({
      url: '/pages/business-card-search/business-card-search',
    })
  },
  onHide: function(){
    this.data.pagination.pageIndex = 1;
    this.data.pagination.dataMore = 1;
    this.data.listStatus.loadingText = '';
    this.data.listStatus.isLoading = false;
  },
  onPageScroll(e){
    this.setData({
      showTips:true
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!!this.data.pagination.dataMore && this.data.tpl == 'list'){
      this.data.pagination.pageIndex++;

      this.getList(true);
    }    
  }

})