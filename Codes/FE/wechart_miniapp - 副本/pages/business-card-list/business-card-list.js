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
    totalNum:null //名片总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu(); //隐藏右上角转发
    let self = this;
    this.data.type = options.type || '';//查询交换名片列表
    this.data.status = options.status || '0,3'; //查询交换名片列表
    this.data.from_user = options.from_user || '';
    this.data.from_company = options.from_company || '';
    this.data.selfUserId = getApp().globalData.userInfo.data[0].user_uuid;
    this.data.isShowFastNav = options.isShowFastNav || '';
    if (this.data.from_user == this.data.selfUserId){
      this.setData({
        isSelfCard: true
      })
    }
    this.setData({
      isShowFastNav: !!self.data.from_user || self.data.isShowFastNav
    })
    wx.showLoading({
      title: '加载中...',
    });
    wx.$on('refreshUserBindInfo', () => {
      this.onShow();
    })
  },
  onShow: function(){
    let self = this;
    this.data.pagination.pageIndex = 1;
    this.data.pagination.dataMore = true;
    this.setData({ from_user: self.data.from_user});
    if(self.data.isSelfCard) {//读取自己的信息
      this.getSelfInfo(); 
    } else if (!!this.data.from_user) {//交换名片申请
      this.getPersonalInfo(() => {
        self.exchangeSingleCard();
      });
    } else {
      this.getPersonalInfo(() => {
        self.getList();
      })
    }
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
  //单个交换名片
  exchangeSingleCard: function(){
    let self = this;
    this.setData({ from_user: self.data.from_user });
    wx.setNavigationBarTitle({
      title: '交换名片邀请'
    });
    new Promise((resolve, rej) => {
      let data = {
        from_user: self.data.from_user,
        from_company: self.data.from_company,
        type: "2",
        status: "1"
      };
      cardsService.saveCard(data, (err, res) => {
        if (res.status == 0) {
          self.setData({
            isExist: res.data.isPass || ''
          })
          resolve(res.data.id);
        } else {
          rej()
        }
      })
    }).then((result) => {
      cardsService.getCardInfo({ 'id': result }, (err, res) => {
        if (res.status == 0) {
          res.data.phone = self.dataProcess(res.data, 'phone', 'pvtPhone');
          self.setData({
            detail: res.data,
            tpl: 'exchange'
          });
        } else {
          rej();
        }
        wx.hideLoading();
      })
    }).catch(() => {
      utils.toast.fail({
        title: "获取名片信息失败"
      });
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
  // 获取个人信息
  getPersonalInfo: function (callback) {
    var self = this;
    activityService.personalInfoQuery({}, (err, res) => {
      if (res.status == 0) {
        self.setData({
          userInfo: res.data
        });
      } else {
        utils.toast.fail({
          title: "获取个人信息失败"
        });
      }
      !!callback && callback();
    })
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
      type: self.data.type,
      status: self.data.status, 
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
        self.data.listStatus.loadingText = '已经到底部了';
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
    let _param = !!e.currentTarget.dataset.id && !e.currentTarget.dataset.isExist ? '?id=' + e.currentTarget.dataset.id+'&origin=list' : '';
    wx.navigateTo({
      url: `/pages/card-detail/card-detail${_param}`
    })
  },
  //处理名片交换请求
  exchange: function(e){
    let status = e.currentTarget.dataset.type
      , id = e.currentTarget.dataset.id
      , item = e.currentTarget.dataset.item || this.data.detail
      , self = this;

    cardsService.exchangeCard({ status: status, id: id }, function (err, result) {
      if (!!err || result.status != 0) {
        utils.toast.fail({
          title: result.message
        });
      }
      if (status != 3) {//同意申请交换名片发送私信提醒
        timCommon.sendMsgAlone(item.from_user, self.data.selfUserId, timCommon.customMsgTpl.exchangeCard.key)
      }
      if (!self.data.type || self.data.list.length <= 1){
        self.data.from_user = '';
        self.data.type = '';
        self.data.status = '0,3';
        self.data.pagination.pageIndex = 1;
      } 
      self.getList();

      utilStatistics.behaviorRecord({ type: status != 3 ? "be_agree_card" : "be_refuse_card", targetUser: item.from_user, targetClass: item.from_company, comment: status != 3 ? "同意交换名片" : "拒绝交换名片", action: "处理交换名片" }, () => { })
    })

  },
  //绑定手机
  getPhoneNumber: function (e) {
    var self = this;
    var app = getApp();

    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var userInfo = app.globalData.userInfo;
      wx.showLoading({
        title: '绑定中'
      });
      userSvr.bindPhone({
        sessionKey: userInfo.sessionKey,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        type: 0
      }, function (err, res) {
        wx.hideLoading();
        if (!!err) {
          utils.toast.fail({
            title: err.message
          });
          return;
        }
        app.checkBindInfo(true);
        self.onShow();
      })
    } 
    // else {
    //   wx.navigateTo({
    //     url: '/pages/binding-phone/binding-phone',
    //   })
    // }
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