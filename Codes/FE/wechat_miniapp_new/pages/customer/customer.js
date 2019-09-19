// pages/customer/customer.js
const activityService = require('../../services/activity-service.js');

Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    customerStatistics: {}, //客户统计数据
    customerActionList: ['最新时间', '营销力'], //线索切换
    customerActionText: '最新时间',
    customerOrder: 0, //切换状态
    customerList: [], //客户列表
    keyword: '', //搜索词
    total: 0,
    pageIndex: 1,//分页页码
    pageSize: 10,//一页显示几个数据
    loadingOpj: {
      more: true, //是否有下一页
      loadingText: '',
      isLoading: false,
      showLoadMore:false
    },
    type: '', //1-今日新增 2-昨日新增 3-成交客户
    sort: 'latesTime', //latesTime-最新时间 marketingForce-营销力
    isManager: 0, //0-员工查看客户 1-企业查看客户
    isLoding: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var value = wx.getStorageSync('userType')
    // this.setData({
    //   employeeId: value
    // })
  },
  /**
   * 页面监听滚动条
   */
  onPageScroll(e) {
    this.setData({
      "loadingOpj.showLoadMore": true
    })
  },

  //获取当前员工所属客户统计
  getCustomerStatistics: function () {
    let self = this;
    activityService.getCustomerStatistics({}, (err,res) => {
      if (res.status == 0) {
        self.setData({
          customerStatistics: res.data
        })
      }else{
        if (!!self.data.employeeId){
          wx.showToast({
            title: "获取统计数据失败",
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },

  //获取客户列表
  getCustomerList: function () {
    let self = this,
    userId = getApp().globalData.userInfo.data[0].user_uuid,
    businessId = getApp().globalData.userInfo.businessId,
    session_id = getApp().globalData.userInfo.session_id;
    wx.showNavigationBarLoading();
    self.setData({
      loadingOpj: {
        isLoading: true,
        loadingText: "玩命加载中..."
      }
    });
    activityService.getCustomerList({
      "session_id": session_id,
      "pageIndex": self.data.pageIndex,
      "pageSize": self.data.pageSize,
      "keyword": self.data.keyword,
      "sort": self.data.sort,
      "isManager": self.data.isManager,
      "type": self.data.type,
      "business_id": businessId
    }, (err, res) => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.hideLoading();
      self.data.loadingOpj.isLoading = false;
      if (res.status == 0) {
        self.data.total = res.data.total;
        if (self.data.pageIndex === 1) {
          self.data.customerList = [];
        };
        for (let i = 0; i < res.data.list.length; i++) {
          self.data.customerList.push(res.data.list[i]);
        }
        self.data.loadingOpj.more = self.data.pageIndex * self.data.pageSize < self.data.total ? 1 : 0;
        self.data.loadingOpj.loadingText = self.data.total > 0 ? (self.data.pageIndex * self.data.pageSize < self.data.total ? '' : '这是我的底线了') : '';
        self.setData({
          customerList: self.data.customerList
        })
      } else {
        self.data.loadingOpj.loadingText = '';
        if (!!self.data.employeeId) {
          wx.showToast({
            title: "获取客户数据失败",
            icon: 'none',
            duration: 2000
          });
        }
      }
      self.setData({
        loadingOpj: self.data.loadingOpj
      });
    });
  },

  //切换排序
  customerAction: function (e) {
    let self = this;
    wx.showActionSheet({
      itemList: self.data.customerActionList,
      success(res) {
        self.setData({
          customerOrder: res.tapIndex
        })
        if (res.tapIndex === 0) {
          self.setData({
            customerActionText: self.data.customerActionList[0],
            sort: 'latesTime',
            pageIndex: 1
          })
          self.getCustomerList();
        } else {
          self.setData({
            customerActionText: self.data.customerActionList[1],
            sort: 'marketingForce',
            pageIndex: 1
          })
          self.getCustomerList();
        }
      }
    })
  },
  //客户总数
  sumCustomer: function () {
    this.setData({ type: "", pageIndex: 1, customerActionText: '最新时间', sort: 'latesTime'})
    this.getCustomerList();
  },
  //今日新增
  todayNew: function () {
    this.setData({ type: 1, pageIndex: 1, customerActionText: '最新时间', sort: 'latesTime'})
    this.getCustomerList();
  },
  //昨日新增
  yesterdayNew: function () {
    this.setData({ type: 2, pageIndex: 1, customerActionText: '最新时间', sort: 'latesTime'})
    this.getCustomerList();
  },
  //成交客户
  makeCustomer: function () {
    this.setData({ type: 3, pageIndex: 1, customerActionText: '最新时间', sort: 'latesTime'})
    this.getCustomerList();
  },
    

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      type:"",
      pageIndex: 1
    })
    this.getCustomerStatistics();
    this.getCustomerList();
    var value = wx.getStorageSync('userType');
    if (value !== null || value !== undefined ){
      this.setData({
        employeeId: value,
        isLoding: false
      })
    }
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.pageIndex = 1;
    this.getCustomerList();
    this.getCustomerStatistics();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!!this.data.loadingOpj.more) {
      this.data.pageIndex++;
      this.getCustomerList();
    }
  }
})