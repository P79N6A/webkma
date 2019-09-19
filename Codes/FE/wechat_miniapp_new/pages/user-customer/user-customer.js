// pages/user-customer/user-customer.js
const activityService = require('../../services/activity-service.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerActionList: ['最新时间', '营销力'], //线索切换
    customerActionText: '最新时间',
    customerOrder: 0, //切换状态
    customerList: [], //客户列表,
    empCustomerList: [], //员工任务带来客户
    sort: 'latesTime', //latesTime-最新时间 marketingForce-营销力
    isManager: 1, //0-员工查看客户 1-企业查看客户
    keyword: "", //搜索词
    total: 0,
    pageIndex: 1,//分页页码
    pageSize: 10,//一页显示几个数据
    loadingOpj: {
      more: true, //是否有下一页
      loadingText: '玩命加载中...',
      isLoading: false,
      showLoadMore: false//底线 
    },
    typeFlag: "",
    tipStatus: "loading", //容错状态
    taskId: '', //任务id
    isCompany: '' //是否从企业任务
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      typeFlag: options.type,
      taskId: options.taskId,
      isCompany: getApp().globalData.isCompany
    })
    this.getBusinessCustomer('');
  },
  /**
   * 页面监听滚动条
   */
  onPageScroll(e) {
    this.setData({
      "loadingOpj.showLoadMore": true
    })
  },

  //获取客户列表(企业任务带来客户)
  getBusinessCustomer: function (keyword) {
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
    
    if (self.data.typeFlag == 2 || !!self.data.isCompany){
      activityService.getBusinessCustomer({
        session_id: session_id,
        pageIndex: self.data.pageIndex,
        pageSize: self.data.pageSize,
        keyword: keyword || '',
        sort: self.data.sort,
        isManager: self.data.isManager,
        business_id: businessId,
        taskId: self.data.taskId || ''
      }, (err, res) => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.status == 0) {
          self.data.loadingOpj.isLoading = false;
          self.data.total = res.data.total;
          if (self.data.pageIndex === 1) {
            self.data.customerList = [];
          };
          res.data.list.forEach(function (item, index) {
            item.flag = 2
          })
          for (let i = 0; i < res.data.list.length; i++) {
            self.data.customerList.push(res.data.list[i]);
          }
          self.data.loadingOpj.more = self.data.pageIndex * self.data.pageSize < self.data.total ? 1 : 0;
          self.data.loadingOpj.loadingText = self.data.total > 0 ? (self.data.pageIndex * self.data.pageSize < self.data.total ? '玩命加载中...' : '这是我的底线了') : '';
          // self.data.tipStatus = self.data.customerList.length == 0 ? "empty" : "";
          self.setData({
            customerList: self.data.customerList
          })
        } else {
          self.data.loadingOpj.loadingText = '';
          // self.data.tipStatus = "error-network";
          wx.showToast({
            title: "获取客户数据失败",
            icon: 'none',
            duration: 2000
          });
        }
        self.setData({
          loadingOpj: self.data.loadingOpj,
          // tipStatus: self.data.tipStatus
        });
      });
    } else{
      activityService.getCustomerList({
        session_id: session_id,
        pageIndex: self.data.pageIndex,
        pageSize: self.data.pageSize,
        keyword: keyword || '',
        sort: self.data.sort,
        isManager: self.data.isManager,
        business_id: businessId,
        taskId: self.data.taskId || ''
      }, (err, res) => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.status == 0) {
          self.data.loadingOpj.isLoading = false;
          self.data.total = res.data.total;
          if (self.data.pageIndex === 1) {
            self.data.customerList = [];
          };
          res.data.list.forEach(function (item, index) {
            item.flag = 2
          })
          for (let i = 0; i < res.data.list.length; i++) {
            self.data.customerList.push(res.data.list[i]);
          }
          self.data.loadingOpj.more = self.data.pageIndex * self.data.pageSize < self.data.total ? 1 : 0;
          self.data.loadingOpj.loadingText = self.data.total > 0 ? (self.data.pageIndex * self.data.pageSize < self.data.total ? '' : '这是我的底线了') : '';
          // self.data.tipStatus = self.data.customerList.length == 0 ? "empty" : "";
          self.setData({
            customerList: self.data.customerList
          })
        } else {
          self.data.loadingOpj.loadingText = '';
          // self.data.tipStatus = "error-network";
          wx.showToast({
            title: "获取客户数据失败",
            icon: 'none',
            duration: 2000
          });
        }
        self.setData({
          loadingOpj: self.data.loadingOpj,
          // tipStatus: self.data.tipStatus
        });
      });
    }
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
          self.getBusinessCustomer();
        } else {
          self.setData({
            customerActionText: self.data.customerActionList[1],
            sort: 'marketingForce',
            pageIndex: 1
          })
          self.getBusinessCustomer()
        }
      }
    })
  },

  //搜索客户
  getKeyword: function (e) {
    var self = this;
    self.keyword = e.detail.value;
    self.setData({
      customerList: [],
      pageIndex: 1
    })
    self.getBusinessCustomer(self.keyword)
  },

  /**
   * 页面监听滚动条
   */

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: !!this.data.isCompany && !!this.data.isCompany ? '企业任务客户' : (!!this.data.taskId?'员工任务客户':'企业客户')
    })
    this.data.pageIndex = 1;
    this.getBusinessCustomer();
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.data.pageIndex = 1;
    this.getBusinessCustomer();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!!this.data.loadingOpj.more) {
      this.data.pageIndex++;
      this.setData({
        "loadingOpj.loadingText": "玩命加载中..."
      })
      this.getBusinessCustomer();
    }else{
      this.setData({
        "loadingOpj.loadingText": "这是我的底线了"
      })
    }
  }
})