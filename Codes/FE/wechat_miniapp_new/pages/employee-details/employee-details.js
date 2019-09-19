// pages/employee-details/employee-details.js
const activityService = require('../../services/activity-service.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "", //当前员工id
    userId: "",
    marketingData: { 
      exposure: 0, //曝光
      visitors: 0, //访客
      consulting: 0, //咨询
      trading: 0 //成交
    },
    taskActionList: ['剩余时间', '完成率', '营销力排行'], //线索切换
    taskActionText: '剩余时间',
    taskOrder: 0, //切换状态
    customer: { //客户列表
      list: [],
      count: ""
    },
    showTask: false, //显示任务侧边按钮
    task: { //任务列表
      list: [],
      params: {
        id: '',
        search: '',
        pageIndex: 1,
        pageSize: 5,
        searchType: 1
      },
      urls: {
        detailUrl: '/pages/extension-task-detail/extension-task-detail',
        analysisUrl: '/pages/extension-task-charts/extension-task-charts'
      },
      total: 0,
    },
    employeeInfo: {}, //员工信息
    loadingOpj: {
      more: true, //是否有下一页
      loadingText: '',
      isLoading: false
    },
    employeeName: '' //员工姓名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      userId: options.userId,
      "task.params.id": options.id,
      employeeName: options.name
    })
    this.getEmployeeInfo();
    this.getTaskList();
    this.getCustomerList();
  },

  //获取员工信息 
  getEmployeeInfo: function () {
    let self = this;
    activityService.getEmployeeInfo({
      id: self.data.id
    }, (err, res) => {
      if (res.status == 0) {
        self.setData({
          employeeInfo: res.data,
          marketingData: {
            exposure: res.data.exposureNum, 
            visitors: res.data.visitorNum, 
            consulting: res.data.consultNum, 
            trading: res.data.orderNum 
          }
        })
      }
    })
  },

  // 获取客户列表
  getCustomerList: function () {
    let self = this,
      businessId = getApp().globalData.userInfo.businessId,
      session_id = getApp().globalData.userInfo.session_id;

    activityService.getCustomerList({
      "session_id": session_id,
      "employee_user_id": self.data.userId,
      "pageIndex": 1,
      "pageSize": 10000,
      "keyword": '',
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
  getTaskList: function (e) {
    let self = this;
    wx.showNavigationBarLoading();
    self.setData({
      loadingOpj: {
        isLoading: true,
        loadingText: "玩命加载中..."
      }
    });
    activityService.rankingList(this.data.task.params, (err, res) => {
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
      } else {
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
          taskActionText: res.tapIndex == 0 ? self.data.taskActionList[0] : (res.tapIndex == 1 ? self.data.taskActionList[1] : self.data.taskActionList[2]),
          "task.params.searchType": res.tapIndex + 1
        })
      }
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
    wx.setNavigationBarTitle({
      title: this.data.employeeName
    })
    this.getEmployeeInfo()
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