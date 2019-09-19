const
  activityService = require('../../services/activity-service.js'),
  utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTips:false,
    total: 0,
    pageIndex: 1, //分页页码
    pageSize: 20, //一页显示几个数据
    loadingOpj: {
      more: true, //是否有下一页
      loadingText: '',
      isLoading: false
    },
    cashList: [], //下拉加载时获取的数据
    myDataPageStatus: "empty",
    cashStaffId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu(); //隐藏右上角转发
    this.setData({
      cashStaffId: options.id || ""
    })
    // console.log("踢踢踢",this.data.cashStaffId)
    this.cashRecordList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.cashRecordList();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.pageIndex = 1;
    this.cashRecordList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!!this.data.loadingOpj.more) {
      this.data.pageIndex++;
      this.cashRecordList();
    }
  },

  onPageScroll(e) {
    this.setData({
      showTips: true
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获取提现记录 
  cashRecordList: function() {
    let self = this;
    wx.showNavigationBarLoading();
    self.setData({
      loadingOpj: {
        isLoading: true,
        loadingText: "加载中"
      }
    });
    activityService.cashRecord({
      "emplId": self.data.cashStaffId,
      "pageIndex": self.data.pageIndex,
      "pageSize": self.data.pageSize
    }, (err, res) => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.hideLoading();
      if (res.status == 0) {
        self.data.loadingOpj.isLoading = false;
        self.data.total = res.data.pageInfo.total;
        if (self.data.pageIndex === 1) {
          self.data.cashList = [];
        };
        for (let i = 0; i < res.data.dataList.length; i++) {
          res.data.dataList[i].createTime = utils.dateString(res.data.dataList[i].createTime);
          let item = res.data.dataList[i]
          let itemType = item.errMsg.split(":")[0]
          switch(itemType){
            case "NOTENOUGH":
              res.data.dataList[i].errMsg = "余额不足"
              break;
            case "AMOUNT_LIMIT":
              if (item.amount<0.3){
                res.data.dataList[i].errMsg = "低于最小提现金额"
              }else{
                res.data.dataList[i].errMsg = "超出最大提现金额"
              }
              break;
            default: 
              res.data.dataList[i].errMsg = "提现失败"
          }
          self.data.cashList.push(res.data.dataList[i]);
        }
        self.data.loadingOpj.more = self.data.pageIndex * self.data.pageSize < self.data.total ? 1 : 0;
        self.data.loadingOpj.loadingText = self.data.total > 0 ? (self.data.pageIndex * self.data.pageSize < self.data.total ? '' : '这是我的底线了') : '';
        self.setData({
          cashList: self.data.cashList
        })
        // console.log("提现记录列表", self.data.cashList)
      } else {
        self.data.loadingOpj.loadingText = '';
        utils.toast.fail({
          title: "网络连接超时"
        });
      }
      self.setData({
        loadingOpj: self.data.loadingOpj
      });
    })
  },
  // cashRecordList: function () {
  //   let self = this;
  //   activityService.cashRecord({
  //     "emplId":self.data.cashStaffId,
  //     "pageIndex": self.data.pageIndex,
  //     "pageSize": self.data.pageSize
  //   }, (err, res) => {
  //     console.log("提现数据", res)      
  //   })
  // }
})