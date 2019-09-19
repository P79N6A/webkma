// pages/customer-details/customer-details.js
const activityService = require('../../services/activity-service.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', //客户主键id
    singleItem: {}, //当前客户信息
    customerInfo: {}, //客户详情
    type: "", //跳转类型,1--企业客户信息 2--员工客户信息
    radarDataSource: [], //用户行为
    taskActionList: ['最新时间', '营销力'], //线索切换
    taskActionText: '最新时间',
    taskOrder: 0, //切换状态
    showTask: false, //显示任务侧边按钮
    task:{
      list: [],
      params: {
        userId: '', //客户userid
        empUserId: '', //员工userid
        businessId: '', //商家id
        pageIndex: 1,
        pageSize: 5,
        searchType: 1 //塞选排序 1-最新时间 2-营销力
      },
      urls: {
        detailUrl: '/pages/extension-task-detail/extension-task-detail',
        analysisUrl: '/pages/extension-task-charts/extension-task-charts'
      },
      total: 0,
    },
    loadingOpj: {
      more: true, //是否有下一页
      loadingText: '',
      isLoading: false
    }, 
    sourceList:[], //来源数据
    marketingData: {
      exposure: 0, //曝光
      visitors: 0, //访客
      consulting: 0, //咨询
      trading: 0 //成交
    },
    listLength: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = getApp().globalData.userInfo;
    let item = JSON.parse(options.item) 
    this.setData({
      id: options.id,
      "task.params.userId": item.user_id,
      "task.params.empUserId": userInfo.emplId,
      "task.params.businessId": userInfo.businessId,
      singleItem: item,
      type: options.type || ""
    })
    this.getTaskList();
    this.customerSource();
  },

  // 获取客户详情
  getCustomerInfo: function () {
    var self = this;
    activityService.getCustomerInfo({
      id: self.data.id,
    }, (err, res) => {
      if (res.status == 0) {
        if (res.data.phone !== null) {
          self.setData({
            isHasCard: true
          })
        } else {
          self.setData({
            isHasCard: false
          })
        }
        self.setData({
          customerInfo: res.data,
          marketingData: {
            exposure: res.data.exposureNum,
            visitors: res.data.visitorNum,
            consulting: res.data.consultNum,
            trading: res.data.orderNum
          }
        })
      } else {
        wx.showToast({
          title: "获取客户详情失败",
          icon: 'none',
          duration: 2000
        });
      }
    })
  },

  //客户来源 customerSource
  customerSource: function (){
    let self = this;
    new Promise(function (resolve, reject){
      activityService.getCustomerInfo({
        id: self.data.id,
      }, (err, res) => {
        if (res.status == 0) {
          resolve(res.data)
        } else {
          reject(res.message);
        }
      })
    }).then(function(data){
      activityService.customerSource({
        merchantId: data.business_id,
        taskId: data.from_id,
        rootUserId: data.ser_user_id,
        userId: data.user_id
      }, (err, res) => {
        if (res.status == 0){
          for (var i = 0; i < res.data.length; i++) {
            if (i == res.data.length - 1) {
              var oldObj = res.data[i];
              var newObj = Object.assign({
                from_type: data.from_type,
                from_name: data.from_name
              },oldObj)
            }
          }
          var newArr = res.data.splice(-1, 1, newObj)
          self.setData({
            sourceList: res.data,
            listLength: res.data.length
          })
        }
      })
    })
  },

  // 获取任务列表
  getTaskList: function (e) {
    let self = this;
    wx.showNavigationBarLoading();
    self.setData({
      loadingOpj: {
        isLoading: true,
        loadingText: "玩命加载中..."
      }
    });
    activityService.getCustomerTask(this.data.task.params, (err, res) => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.hideLoading();
      self.data.loadingOpj.isLoading = false;
      if (res.status == 0) {
        self.data.task.total = res.data.total;
        if (self.data.task.params.pageIndex === 1) {
          self.data.task.list = [];
        };
        for (let i = 0; i < res.data.list.length; i++) {
          self.data.task.list.push(res.data.list[i]);
        }
        self.data.loadingOpj.more = self.data.task.params.pageIndex * self.data.task.params.pageSize < self.data.task.total ? 1 : 0;
        self.data.loadingOpj.loadingText = self.data.task.total > 0 ? (self.data.task.params.pageIndex * self.data.task.params.pageSize < self.data.task.total ? '' : '这是我的底线了') : '';
        self.setData({
          "task.list": self.data.task.list
        })
      }else{
        self.data.loadingOpj.loadingText = '';
      }
      self.setData({
        loadingOpj: self.data.loadingOpj
      });
    });
  },

  //切换排序
  taskAction: function (e) {
    let self = this;
    wx.showActionSheet({
      itemList: self.data.taskActionList,
      success(res) {
        self.setData({
          taskOrder: res.tapIndex,
          taskActionText: res.tapIndex == 0 ? self.data.taskActionList[0] : self.data.taskActionList[1],
          "task.params.searchType": res.tapIndex + 1
        })
        self.getTaskList();
      }
    })
  },

  //客户备注
  geturl: function(e) {
    let user_id = this.data.singleItem.user_id;
    let id = this.data.singleItem.id;
    let uesrName = this.data.singleItem.nickname
    wx.navigateTo({
      url: '/pages/remarks/remarks?user_id=' + user_id + '&id=' + id + "&uesrName=" + uesrName
    })
  },

  //跳转私信
  sendMessenger: function () {
    let self = this;
    if (!!self.data.customerInfo.privateMsg){
      wx.navigateTo({
        url: '/pages/instant-messenger-send/instant-messenger-send?accountid=' + self.data.customerInfo.user_id + '&businessId=' + self.data.customerInfo.business_id + 'isHasCard=' + self.data.isHasCard,
      })
    }else{
      wx.showToast({
        title: "公众号来源无法私信！",
        icon: 'none',
        duration: 2000
      });
    }
  },

  //修改客户信息
  editCustomerInfo: function (){
    wx.navigateTo({
      url: '/pages/customer-edit-info/customer-edit-info?id=' + this.data.singleItem.id,
    })
  },

  // 获取任务列表当前点击项数据并跳转至分享页面
  itemDataEvent(e) {
    wx.navigateTo({
      url: `/pages/extension-task-share/extension-task-share?id=${e.detail.itemData.id}`,
    });
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
    wx.setNavigationBarTitle({
      title: this.data.singleItem.name || this.data.singleItem.nickname
    })
    this.getCustomerInfo();
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
    if (!!this.data.loadingOpj.more) {
      this.data.task.params.pageIndex++;
      this.getTaskList();
    }
  }
})