// pages/overview/overview.js
const activityService = require('../../services/activity-service.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    employeeId: "", //员工id
    showLoadMore: false,
    userInfo: null, //个人信息
    customer: {
      list: [],
      count: ""
    },
    dashbord: {}, //营销面板数据
    task: { //任务列表相关数据
      list: [],
      params: {
        id: '',
        isManager: 0,
        taskStatus: '2',
        searchType: 1,
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      conditionTxt: '剩余时间',
      conditionlist: ['剩余时间', '完成率'],
      urls: {
        detailUrl: '/pages/extension-task-detail/extension-task-detail',
        analysisUrl: '/pages/extension-task-charts/extension-task-charts'
      },
      isShare: false,
      currActivity: {} //当前选中的要分享的活动
    },
    userType: '',
    showModal: false,
    isLoding: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init();
    wx.$on('_refleshOverviewData', () => {
      this.init();
    })
  },
  onShow: function () {
    this.getPersonalInfo()
  },
  /**
   * 页面监听滚动条
   */
  onPageScroll(e) {
    this.setData({
      showLoadMore: true
    })
  },
  init: function(){
    let self = this;
    this.getPersonalInfo(() => {
      if (!self.data.userInfo.emplId) return false;
      self.getTaskList();
      self.getCustomerList();
      if (this.data.userType == 'boss') {
        this.getBossDashboard();
      } else {
        this.getEmployeeDashboard();
      }
    });
    // wx.showLoading({});
  },
  // 获取个人信息
  getPersonalInfo: function(callback) {
    var self = this;
    activityService.personalInfoQuery({}, (err, res) => {
      if (res.status == 0) {
        let datas = res.data
        // datas.phone = datas.phone ? (datas.phone.substring(0, 3) + "****" + datas.phone.substring(datas.phone.length - 4, datas.phone.length)) : ''
        self.setData({
          userInfo: datas,
          userType: !!res.data.isManager ? 'boss' : 'employee',
          "task.params.id": res.data.emplId || "",
          employeeId: res.data.emplId || "",
          isLoding: false
        });
        wx.setStorageSync('userType', res.data.emplId || '')
        !!callback && callback();
      } else {
        utils.toast.fail({
          title: "获取个人信息失败"
        });
      }
    })
  },
  //获取员工营销面板数据
  getEmployeeDashboard: function() {
    let self = this;
    activityService.employeeDashboard({
      "businessId": self.data.userInfo.businessId,
      "empId": self.data.userInfo.emplId,
    }, (err, res) => {
      if (res.status == 0) {
        self.setData({
          "dashbord": res.data,
          userData: {
            rank: res.data.empMarketRank,
            taskNum: res.data.completeTaskCount,
            headImg: self.data.userInfo.face,
            reward: res.data.totalAward.toString(),
            shareNum: res.data.forwardCount.toString(),
            getTargetNum: res.data.customerCount.toString(),
            despose: res.data.browseCount.toString(),
            rankrate: (res.data.empMarketRank/res.data.merchantEmpCount)*100 
          }
        })
      } else {
        utils.toast.fail({
          title: "获取营销面板数据失败"
        });
      }
    });
  },
  //获取boss营销面板数据
  getBossDashboard: function() {
    let self = this;
    activityService.bossDashboard({
      "businessId": self.data.userInfo.businessId,
      "empId": self.data.userInfo.emplId,
    }, (err, res) => {
      if (res.status == 0) {
        self.setData({
          "dashbord": res.data
        })
        console.log("boss", res.data)
      } else {
        utils.toast.fail({
          title: "获取营销面板数据失败"
        });
      }
    });
  },
  // 获取客户列表
  getCustomerList: function() {
    let self = this,
      businessId = getApp().globalData.userInfo.businessId,
      session_id = getApp().globalData.userInfo.session_id;

    activityService.getCustomerList({
      "session_id": session_id,
      "pageIndex": 1,
      "pageSize": 10000,
      "keyword": '',
      "sort": 'latesTime',
      "isManager": 0,
      "business_id": businessId
    }, (err, res) => {
      if (res.status == 0) {
        self.setData({
          "customer.list": res.data.list,
          "customer.count": res.data.total
        })
      } else {
        utils.toast.fail({
          title: "获取客户数据失败"
        });
      }
    });
  },
  // 获取任务列表
  getTaskList: function(e) {
    let self = this
    activityService.rankingList(this.data.task.params, (err, res) => {
      if (res.status == 0) {
        let datainfo = res.data.length > 2 ? res.data.list.slice(0, 2) : res.data.list
        console.log(datainfo)
        datainfo.map((item, index) => {
          item.newTimeArr = utils.format(item.newTime)
        })

        self.setData({
          "task.list": res.data.list,
          "task.total": res.data.total
        });
        wx.stopPullDownRefresh();
      }
      wx.hideLoading();
    });
  },
  // 选择筛选条件
  openConditionlist: function(e) {
    let self = this
    wx.showActionSheet({
      itemList: self.data.task.conditionlist,
      success(res) {
        console.log(res)
        self.setData({
          "task.conditionTxt": res.tapIndex == 0 ? '剩余时间' : '完成率',
          "task.params.pageIndex": 1,
          "task.params.searchType": res.tapIndex + 1,
        })
        // 排序TODO
        self.getTaskList()
      }
    })
  },
  // 查看更多待办事项
  queryAllTask: function() {
    wx.switchTab({
      url: `/pages/tasks/tasks`
    });
  },
  // 跳转企业员工
  jumpEmployeeList() {
    getApp().globalData.taskId = ''
    getApp().globalData.isCompany = ''
    wx.navigateTo({
      url: "/pages/employees-list/employees-list",
    });
  },
  // 跳转企业客户
  jumpCustomerList() {
    getApp().globalData.taskId = ''
    getApp().globalData.isCompany = ''
    wx.navigateTo({
      url: "/pages/user-customer/user-customer?type=2",
    });
  },
  // 监听用户下拉动作
  onPullDownRefresh: function(e) {
    wx.stopPullDownRefresh()
    this.onLoad();
  },
  //跳转到名片详情
  toCardDeatil: function() {
    wx.navigateTo({
      url: `/pages/bussiness-card-detail/bussiness-card-detail`
    });
  },
  // 跳转到boss营销报表
  toBossReport() {
    wx.navigateTo({
      url: `/pages/marketing-report/marketing-report`
    });
  },
  //跳转到企业任务页
  toBossTaskPage(e) {
    let param = !!e.currentTarget.dataset.type ? '?isManager=1' : '';
    wx.navigateTo({
      url: '/pages/tasks-company/tasks-company' + param
    })
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
  // 获取子组件信息
  itemDataEvent(e) {
    let self = this;
    let item_type = e.detail.itemData.manuscriptStatus

    if (item_type == 1) {
      wx.showToast({
        title: '任务还没有开始哟~',
        icon: 'none'
      })
      return
    }
    new Promise((resolve, reject) => {
      let option = {
        relationId: e.detail.itemData.id,
        rootUserId: self.data.userInfo.userId,
        forwardKey: '',
        sourceType: 0,
        clientType: 'weapp'
      };
      activityService.getforwardKey(option, (err, res) => {//获取转发者forwardkey
        if (!!res && res.status == 0) {
          self.setData({
            myforwardKey: res.data.forwardKey
          })
        }
        resolve(null);
      });
    }).then((result) => {
      self.setData({
        isShare: e.detail.isShare,
        currActivity: e.detail.itemData
      })
    })
  },
   /*
   *分享组件方法
   *type：Link 复制链接
   *      Moments 分享朋友圈
   *      friends 分享给朋友
   */
  shareEvent(e) {
    let type = e.detail.isShareType
    switch (type) {
      case 'Link':
        if (this.data.currActivity.manuscriptType == 2) {
          this.btnMoments()
        } else {
          this.copyLink()
        }
        break;
      case 'Moments':
        this.btnMoments()
        break;
      default:
        this.setData({
          isShare: false
        })
    }
  },
  copyLink: function () { //复制链接
    let self = this,
      _data = '',
      _share_url = this.data.currActivity.url;

    _share_url = this.data.currActivity.manuscriptType == 3 ? _share_url.replace('//', '$').split('/')[0].replace('$', '//') + '/article?id=' + this.data.currActivity.id : _share_url;

    _share_url = `${_share_url}?rootUserId=${self.data.userInfo.userId}&forwardKey=${self.data.myforwardKey}`;

    switch (self.data.currActivity.manuscriptType) {
      case 1: //活动
        _data = `【${self.data.currActivity.name}】${_share_url} 这里有一个好活动分享给你，请查收哦~`;
        break;
      case 2: //产品
        _data = `【${self.data.currActivity.name}】${_share_url} 悄悄告诉你，这些商品正在搞活动~`;
        break;
      default:
        _data = `【${self.data.currActivity.name}】${_share_url} 这里有一个好活动分享给你，请查收哦~`;
    }
    console.log(_data)
    wx.setClipboardData({
      data: `${_data}`,
      success(res) {
        wx.getClipboardData({
          success(res) {
            self.qiutHandler();
          }
        })
      }
    })
  },
  qiutHandler: function () {
    this.setData({
      isShare: false //是否展示快键分享菜单
    })
  },
  btnMoments: function () { //跳转到朋友圈推广
    let self = this
    let userInfo = getApp().globalData.userInfo;

    wx.navigateTo({
      url: `/pages/extension-task-share-cover/extension-task-share-cover?id=${self.data.currActivity.id}&from_user=${userInfo.data[0].user_uuid}&from_company=${userInfo.businessId}`,
    });
    this.qiutHandler();
  },
  onShareAppMessage: function () {
    let self = this,
      h5Info = self.data.currActivity,
      userInfo = getApp().globalData.userInfo,
      timeStamp = new Date().getTime(),
      shareObj = null;
    console.log(`/pages/activity-detail/activity-detail?activityUrl=${h5Info.url}&title=${h5Info.name}&id=${h5Info.id}&rootUserId=${userInfo.data[0].user_uuid}&timeStamp=${timeStamp}&forwardKey=${self.data.myforwardKey}`)
    switch (true) {
      case h5Info.manuscriptType != 2: //活动
        shareObj = {
          title: h5Info.name,
          path: `/pages/index/index?target=` + encodeURIComponent(`/pages/activity-detail/activity-detail?activityUrl=${h5Info.url}&id=${h5Info.id}&rootUserId=${userInfo.data[0].user_uuid}&timeStamp=${timeStamp}&forwardKey=${self.data.myforwardKey}`),
          imageUrl: h5Info.cover || null
        }
        break;
      default: //海报
        shareObj = {
          title: h5Info.name,
          path: `/pages/index/index?target=` + encodeURIComponent(`/pages/post-img/post-img?id=${h5Info.id}&from_user=${userInfo.data[0].user_uuid}&from_company=${h5Info.businessId}&timeStamp=${timeStamp}&forwardKey=${self.data.myforwardKey}`),
          imageUrl: h5Info.cover || null
        };
    }
    console.log(shareObj.path)
    // 分享数+1
    activityService.behaviorRecord({
      "forwardKey": self.data.myforwardKey,
      "relationId": h5Info.id,
      "rootUserId": userInfo.data[0].user_uuid,
      "clientType": "weapp",
      "indexType": "user_forward",
      "timeStamp": new Date().getTime()
    });
    console.log(shareObj.path)
    return shareObj;
  }
})