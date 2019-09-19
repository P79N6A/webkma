// pages/card-detail/card-detail.js
const utils = require('../../utils/util.js'),
  cardsService = require('../../services/cards.js'),
  activityService = require('../../services/activity-service.js'),
  userSvr = require("../../services/user-info.js");

Page({
  data: {
    textinfo: '玩命加载中...',
    showLoadMore: false,
    userInfo: {},//个人信息
    employeeInfo: {}, //员工个人信息
    emplId: '', //员工id
    detail: {}, //名片信息
    task: {//任务列表相关数据
      list: [],
      params: {
        id: '',
        isManager: 0,
        taskStatus: '1,2,3',
        searchType: 1
      },
      urls: {
        detailUrl: '/pages/extension-task-detail/extension-task-detail'
      },
      conditionTxt: '剩余时间',
      conditionlist: ['剩余时间', '完成率'],
      currActivity: {}, //当前选中的要分享的活动
      showCompleteRate: false,
      showRanking: false
    },
    pagination: { //分页数据
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      dataMore: true,
    },
    isOwnerTask: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    this.data.origin = options.origin || '';
    this.data.id = options.id || '';
    this.data.from_user = options.from_user || '';
    this.data.from_company = options.from_company || '';
    this.data.forwardKey = options.forwardKey || '';
    this.data.rootUserId = options.rootUserId || '';
    this.data.timeStamp = options.timeStamp || '';
    this.data.redpackId = options.redpackId || '';
    this.setData({
      isShowFastNav: self.data.origin == 'qrcode' || self.data.origin == 'share',
      redpackId: self.data.redpackId,
      userInfo: getApp().globalData.userInfo,
      emplId: getApp().globalData.userInfo.emplId
    });
    this.data.selfUserId = this.data.userInfo.userId;
    if (this.data.from_user == this.data.selfUserId) {
      this.setData({
        selfInfo: true,
        "task.showCompleteRate": true,
        "task.showRanking": true
      })
      this.data.from_user = '';
      this.data.origin = '';
    }
    this.setData({
      isOwnerTask: (!!self.data.from_user && self.data.from_user != self.data.selfUserId) ? false : true//是否是自己的任务
    })
  },
  onShow: function () {
    let self = this;

    // wx.showLoading();
    new Promise((resolve, reject) => {
      let option = {
        relationId: self.data.from_company || self.data.userInfo.businessId,
        rootUserId: self.data.rootUserId || self.data.selfUserId,
        forwardKey: self.data.forwardKey,
        sourceType: 1,
        clientType: 'weapp'
      };
      activityService.getforwardKey(option, (err, res) => {//获取转发者forwardkey
        if (!!res && res.status == 0) {
          self.data.forwardKey = res.data.forwardKey;
          self.data.rootUserId = res.data.rootUserId;
        } 
        resolve(null);
      });
    }).then((result) => {
      if (!!this.data.from_user) {
        //用户埋点--查看名片
        activityService.behaviorRecord({
          "forwardKey": self.data.forwardKey,
          "relationId": self.data.from_company,
          "rootUserId": self.data.rootUserId,
          "clientType": "weapp",
          "indexType": "bussiness_card",
          "timeStamp": self.data.timeStamp,
          "extType": "view"
        });
      }
      switch (this.data.origin) {
        case 'qrcode':
          new Promise((resolve, rejext) => {
            cardsService.getCustomConfig({ id: self.data.id }, function (err, res) {
              if (res.status == 0) {
                resolve(res.data);
              } else {
                reject();
              }
            })
          }).then((result) => {
            if (result.data.from_user == self.data.selfUserId) {//自己
              self.data.id = '';
              self.data.from_user = '';
              self.data.task.params.id = self.data.userInfo.emplId;
              self.setData({
                detail: self.data.userInfo
              });
              self.getTaskList();
              utils.createShareCover('canvas_cover_1', self.data.detail, self);
            } else {
              self.setData({ from_user: result.data.from_user, from_company: result.data.from_company });
              self.saveCard();
            }
            self.setData({
              isOwnerTask: (!!self.data.from_user && self.data.from_user != self.data.selfUserId) ? false : true//是否是自己的任务
            })
          }).catch(() => {
            utils.toast.fail({
              title: "获取信息失败"
            });
          })
          break;
        case 'list': //名片夹过来的
          self.setData({
            isOwnerTask: false//是否是自己的任务
          })
          this.queryCardDetail(this.data.id).then((res) => {
            self.data.task.params.id = self.data.detail.emplId;
            self.getTaskList();
            utils.createShareCover('canvas_cover_1', self.data.detail, self);
          });
          break;
        case 'custom': //客户详情过来的
        case 'share': //分享名片过来的
          self.setData({
            isOwnerTask: false//是否是自己的任务
          })
          this.saveCard();
          break;
        default:
          self.data.task.params.id = self.data.userInfo.emplId;
          self.setData({
            detail: self.data.userInfo,
            selfInfo: true
          });
          self.getTaskList();
          utils.createShareCover('canvas_cover_1', self.data.detail, self);
      }
    }).catch(() => {
      utils.toast.fail({
        title: "获取分享失败"
      });
    })

    this.getEmployeeInfo();
  },
  //获取员工信息 
  getEmployeeInfo: function () {
    let self = this;
    activityService.getEmployeeInfo({
      id: self.data.emplId
    }, (err, res) => {
      if (res.status == 0) {
        let datas = res.data
        datas.phone = datas.phone ? (datas.phone.substring(0, 3) + "****" + datas.phone.substring(datas.phone.length - 4, datas.phone.length)) : ''
        self.setData({
          employeeInfo:datas
        })
      }
    })
  },
  //保存别人分享的名片
  saveCard: function () {
    var self = this
      , data = {
        from_user: this.data.from_user,
        from_company: this.data.from_company,
        type: "1",
        status: "0"
      };

    cardsService.saveCard(data, (err, res) => {
      if (res.status == 0) {
        if (!res.data.isExist) {
          //用户埋点--保存名片
          activityService.behaviorRecord({
            "forwardKey": self.data.forwardKey,
            "relationId": self.data.from_company,
            "rootUserId": self.data.rootUserId,
            "clientType": "weapp",
            "indexType": "bussiness_card",
            "timeStamp": self.data.timeStamp,
            "extType": "save"
          });
        }
        self.queryCardDetail(res.data.id).then((result) => {
          self.data.task.params.id = self.data.detail.emplId;
          self.getTaskList();
          utils.createShareCover('canvas_cover_1', self.data.detail, self);
        });
      } else {
        utils.toast.fail({
          title: res.message
        });
      }
    })
  },
  //可见不可见处理
  dataProcess: function (data, type, status) {
    if (!data[type]) return data[type];
    switch (data[status]) {
      case 1: break;
      case 2:
        if (!(data['status'] == '0' && data['type'] == '2')) {
          data[type] = data[type].substr(0, 3) + data[type].substr(3, 7).replace(/[\s\S]/g, '*') + data[type].substr(7);
          data[type + '_tip'] = '仅交换名片可见';
        } else {
          data[type + '_tip'] = data[type];
        }
        break;
      case 3:
        data[type] = data[type].substr(0, 3) + data[type].substr(3).replace(/[\s\S]/g, '*');
        break;
    }
    return data[type];
  },
  //查询名片详情
  queryCardDetail: function (id, callback) {
    var self = this;
    return new Promise((resolve, reject) => {
      cardsService.getCardInfo({ 'id': id }, (err, res) => {
        if (res.status == 0) {
          res.data.phone = self.dataProcess(res.data, 'phone', 'pvtPhone');
          res.data.userId = res.data.from_user;//获取用户userid，保持字段名一致 mars 3.7
          //用户埋点--查看名片
          if (self.data.origin == 'list') {
            //用户埋点--查看名片
            activityService.behaviorRecord({
              "forwardKey": self.data.forwardKey,
              "relationId": self.data.from_company,
              "rootUserId": self.data.rootUserId,
              "clientType": "weapp",
              "indexType": "bussiness_card",
              "timeStamp": self.data.timeStamp,
              "extType": "view"
            });
          }
          self.setData({
            detail: res.data
          });
          return resolve(res.data);
        } else {
          utils.toast.fail({
            title: "获取名片信息失败"
          });
        }
      })
    })
    
  },
  // 获取任务列表
  getTaskList: function (more) {
    let self = this, _params = {}, _pagination = this.data.pagination;
    _params = Object.assign(self.data.task.params, {
      pageIndex: _pagination.pageIndex,
      pageSize: _pagination.pageSize
    });
    activityService.rankingList(_params, (err, res) => {
      wx.hideLoading();
      if (res.status == 0) {
        let datainfo = res.data.length > 2 ? res.data.list.slice(0, 2) : res.data.list
        datainfo.map((item, index) => {
          item.newTimeArr = utils.format(item.newTime)
        })

        if (parseInt(_params.pageIndex) * parseInt(_params.pageSize) >= parseInt(res.data.total)) {
          self.data.pagination.dataMore = false;
        }

        if (!!more) {//分页
          self.data.task.list = self.data.task.list.concat(res.data.list);
        } else {
          self.data.task.list = res.data.list;
        }
        let allTotal = Math.ceil(res.data.total / self.data.pagination.pageSize)
        self.setData({
          "task.list": self.data.task.list,
          "pagination.total": res.data.total,
          textinfo: res.data.total < 1 && self.data.pagination.pageIndex == 1 ? "暂无数据" : (self.data.pagination.pageIndex < allTotal ? "玩命加载中..." : '这是我的底线了')
        });
        wx.stopPullDownRefresh();
      } else {
        utils.toast.fail({
          title: "获取任务列表失败"
        });
      }
    });
  },
  // 选择筛选条件
  openConditionlist: function (e) {
    let self = this, hideFinishRate = e.currentTarget.dataset.self;

    wx.showActionSheet({
      itemList: hideFinishRate ? self.data.task.conditionlist : ['剩余时间'],
      success(res) {
        console.log(res)
        self.setData({
          "task.conditionTxt": res.tapIndex == 0 ? '剩余时间' : '完成率',
          "pagination.pageIndex": 1,
          "pagination.dataMore": true,
          "task.params.searchType": res.tapIndex + 1
        })
        // 排序TODO
        self.getTaskList();
      }
    })
  },
  //跳转至发名片页面
  toPassCard: function () {
    wx.navigateTo({
      url: "/pages/bussiness-pass-card/pass-card"
    })
  },
  //存入通讯录
  savePhone: function () {
    let self = this;
    wx.addPhoneContact({
      firstName: self.data.detail.name,
      photoFilePath: self.data.detail.face,
      mobilePhoneNumber: self.data.detail.phone,
      organization: self.data.detail.company,
      title: self.data.detail.job,
      email: self.data.detail.email,
      success: function () {},
      fail: function () {}
    });
  },
  //绑定手机
  getPhoneNumber: function (e) {
    var self = this;
    var app = getApp();

    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var userInfo = app.globalData.userInfo;
      console.log("shouji", userInfo, "e", e);
      wx.showLoading({
        title: '绑定中'
      });
      new Promise((resolve, reject) => {
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
            reject();
          }
        })
      }).then(() => {
        activityService.personalInfoQuery({}, (err, res) => {
          if (res.status == 0) {
            getApp().globalData.userInfo = Object.assign({}, getApp().globalData.userInfo, res.data);
            getApp().globalData.commonInfo = {
              emplId: res.data.emplId,
              isManager: res.data.isManager,
              businessId: res.data.businessId,
              userId: res.data.userId
            }
            wx.setStorage({
              key: 'isManager',
              data: res.data.isManager,
            });
            self.onLoad();
          }
          wx.hideLoading();
        })
      })
      
    }
  },
  // 分享
  onShareAppMessage: function (e) {
    let self = this
      , shareType = e.from != 'button' ? '' : (e.target.dataset.type || '')
      , shareObj = {}
      , _param = '?from_user=';  ''

    self.data.timeStamp = new Date().getTime();

    _param += self.data.detail.from_user + (!!self.data.detail.from_company ? '&from_company=' + self.data.detail.from_company : '') + '&rootUserId=' + self.data.rootUserId + '&timeStamp=' + self.data.timeStamp + '&forwardKey=' + self.data.forwardKey;

    shareObj = {
      title: `你好，这是我的名片，请惠存`,
      path: `/pages/index/index?target=` + encodeURIComponent(`/pages/bussiness-card-detail/bussiness-card-detail${_param}&origin=share`),
      imageUrl: self.shareCoverImg
    }
    // 分享名片
    activityService.behaviorRecord({
      "forwardKey": self.data.forwardKey,
      "relationId": self.data.from_company,
      "rootUserId": self.data.rootUserId || self.data.userInfo.userId,
      "clientType": "weapp",
      "indexType": "bussiness_card",
      "timeStamp": self.data.timeStamp,
      "extType": "share"
    });
    return shareObj;
  },
  //跳转到发名片页面
  toPassCardPage: function() {
    wx.navigateTo({
      url: '/pages/bussiness-pass-card/pass-card'
    })
  },
  sendMessage: function(){
    let _url = this.data.selfInfo ? '/pages/instant-messenger-list/instant-messenger-list' : '/pages/instant-messenger-send/instant-messenger-send?accountid=' + this.data.detail.userId ;
    wx.navigateTo({
      url: _url
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.pagination.dataMore) return false;

    this.data.pagination.pageIndex++;

    wx.showLoading({});
    this.getTaskList(true);
  },
  /**
   * 页面监听滚动条
   */
  onPageScroll(e) {
    this.setData({
      showLoadMore: true
    })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function (e) {
    wx.showNavigationBarLoading();
    this.data.pagination.pageIndex = 1;
    this.data.pagination.dataMore = true;
    this.onShow();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 100);
  },
  onHide: function () {
    this.data.pagination.pageIndex = 1;
    this.data.pagination.dataMore = true;
  }
})