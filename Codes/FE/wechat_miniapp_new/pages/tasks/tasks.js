// pages/task-list/task-list.js
const activityService = require('../../services/activity-service.js');
const utils = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pullstatus:false,//下拉标识
    showLoadMore:false,//底线 
    forwardKey:'',
    urls: {
      detailUrl: '/pages/extension-task-detail/extension-task-detail',
      analysisUrl: '/pages/extension-task-charts/extension-task-charts'
    },
    coverSaveStatus: 0,
    textinfo: '玩命加载中...',
    params: {
      id: '',
      search: '',
      searchType: 1,
      pageIndex: 1,
      pageSize: 10,
      isManager: 0,
      taskStatus: '2,3'
    },
    conditionTxt: '剩余时间',
    dataLsit: [],
    total: 0,
    isShare: false,
    type: null, //活动类型
    currActivity: {}, //当前选中的要分享的活动
    conditionlist: ['剩余时间', '完成率', '营销力排行']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var value = wx.getStorageSync('userType')
    this.setData({
      employeeId: value
    })
  },
  // 获取子组件信息
  itemDataEvent(e) {
    let self = this;
    let item_type = e.detail.itemData.manuscriptStatus
    if (item_type == 1){
      wx.showToast({
        title: '任务还没有开始哟~',
        icon:'none'
      })      
      return 
    }
    new Promise((resolve, reject) => {
      let option = {
        relationId: e.detail.itemData.id,
        rootUserId: app.globalData.userInfo.data[0].user_uuid,
        forwardKey: '',
        sourceType: 0,
        clientType: 'weapp'
      };
      activityService.getforwardKey(option, (err, res) => {//获取转发者forwardkey
        if (!!res && res.status == 0) {
          self.setData({
            forwardKey: res.data.forwardKey
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
  getKeyword(e) {
    this.setData({
      'params.search': e.detail.value
    })
  },
  searchFn(){
    this.data.params.pageIndex =1
    this.getList()
  },
  // 选择筛选条件
  openConditionlist(e) {
    let self = this
    wx.showActionSheet({
      itemList: self.data.conditionlist,
      success(res) {
        console.log(res)
        self.setData({
          conditionTxt: res.tapIndex == 0 ? '剩余时间' : (res.tapIndex == 1 ? '完成率' : '营销力排行'),
          "params.pageIndex": 1,
          "params.searchType": res.tapIndex + 1,
        })
        self.getList()
      }
    })
  },
  //关闭所有操作项
  closeAll() {
    this.setData({
      isShare: false
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
        if (this.data.currActivity.manuscriptType==2){
          this.btnMoments()
        }else{
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
  copyLink: function() { //复制链接
    let self = this,
      _data = '',
      _share_url = this.data.currActivity.url;
    _share_url = this.data.currActivity.manuscriptType == 3 ? _share_url.replace('//', '$').split('/')[0].replace('$', '//') + '/article?id=' + this.data.currActivity.id : _share_url;
    
    _share_url = `${_share_url}?rootUserId=${getApp().globalData.userInfo.userId}&forwardKey=${self.data.forwardKey}`;

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

  qiutHandler: function() {
    this.setData({
      isShare: false //是否展示快键分享菜单
    })
  },
  btnMoments: function() { //跳转到朋友圈推广
    let self = this
    let userInfo = getApp().globalData.userInfo
    wx.navigateTo({
      url: `/pages/extension-task-share-cover/extension-task-share-cover?id=${self.data.currActivity.id}&from_user=${userInfo.data[0].user_uuid}&from_company=${app.globalData.userInfo.businessId}`,
    });
    this.qiutHandler();
  },
  // 获取列表
  getList() {
    let self = this
    activityService.rankingList(this.data.params, (err, res) => {
      if (res.status == 0) {
        let datainfo = res.data.length > 2 ? res.data.list.slice(0, 2) : res.data.list
        datainfo.map((item, index) => {
          item.newTimeArr = utils.format(item.newTime)
        })
        let allTotal = Math.ceil(res.data.total / self.data.params.pageSize)
        
        self.setData({
          dataLsit: self.data.params.pageIndex<2? res.data.list : self.data.dataLsit.concat(res.data.list),
          total: res.data.total,
          rankingData: datainfo, 
          textinfo: res.data.total < 1 && self.data.params.pageIndex == 1 ? "暂无数据" : (self.data.params.pageIndex < allTotal ? "玩命加载中..." :'这是我的底线了')
        });
      } 
      wx.stopPullDownRefresh({
        complete: () => {
          this.setData({
            pullstatus: false //最后还原该状态
          })
        }
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var value = wx.getStorageSync('userType')
    this.data.params.id = app.globalData.userInfo.emplId;
    wx.pageScrollTo({
      scrollTop: 0,
    })
    this.setData({
      "params.pageIndex": 1,
      textinfo:'玩命加载中...',
      employeeId: value
    })
    if (!this.data.employeeId || this.data.employeeId !== '') {
      wx.hideLoading();
    }
    this.getList()
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
   * 页面监听滚动条
   */
  onPageScroll(e){
    this.setData({
      showLoadMore:true
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      "params.pageIndex":1,
      pullstatus:true
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.pullstatus) return
    let pageAll = Math.ceil(this.data.total / this.data.params.pageSize)
    if (this.data.params.pageIndex <= pageAll) {
      this.setData({
        "params.pageIndex": this.data.params.pageIndex + 1
      })
      this.getList()
    } else {
      this.setData({
        textinfo: "这是我的底线了"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let self = this,
      h5Info = self.data.currActivity,
      userInfo = getApp().globalData.userInfo,
      timeStamp = new Date().getTime(),
      shareObj = null;
    switch (true) {
      case h5Info.manuscriptType != 2: //活动
        shareObj = {
          title: h5Info.name,
          path: `/pages/index/index?target=` + encodeURIComponent(`/pages/activity-detail/activity-detail?activityUrl=${h5Info.url}&title=${h5Info.name}&id=${h5Info.id}&rootUserId=${userInfo.data[0].user_uuid}&timeStamp=${timeStamp}&forwardKey=${self.data.forwardKey}`),
          imageUrl: h5Info.cover || null
        }
        break;
      default: //海报
        shareObj = {
          title: h5Info.name,
          path: `/pages/index/index?target=` + encodeURIComponent(`/pages/post-img/post-img?id=${h5Info.id}&from_user=${userInfo.data[0].user_uuid}&from_company=${h5Info.businessId}&timeStamp=${timeStamp}&forwardKey=${self.data.forwardKey}`),
          imageUrl: h5Info.cover || null
        };
    }
    console.log(shareObj.path)
    // 分享数+1
    activityService.behaviorRecord({
      "forwardKey": self.data.forwardKey,
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