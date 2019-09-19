// pages/remarks/remarks.js
const activityService = require('../../services/activity-service.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remarksList: [],
    isShow: false,
    remark: "",
    user_id: "",
    userInfo: {},
    userName:"",
    id:"",
    defaultImg:"../../images/icon-default-photo.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user_id: options.user_id,
      id: options.id,
      userName: options.uesrName
    })
    this.list();
    this.getCustomerInfo()
  },
  onShow(){
    wx.setNavigationBarTitle({
      title: this.data.userName
    })
  },
  list() {
    var self = this;
    activityService.remarksList({"user_id":self.data.user_id}, (err, res) => {
      if (res.status == 0) {
        this.setData({
          remarksList: res.data.list
        })
      } else {
        wx.showToast({
          title: "获取客户备注信息失败",
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
 
  // 获取客户详情
  getCustomerInfo: function (id) {
    var self = this;
    activityService.getCustomerInfo({
      id:self.data.id 
    }, (err, res) => {
      if (res.status == 0) {
        self.setData({
          userInfo: res.data
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

  getData: function (e) {
    var val = e.detail.value;
    this.setData({
      remark: val
    });
  },
  Preservation() {
    var self = this;
    self.setData({
      isShow: true
    })
    if(self.data.remark!=''){
      activityService.addRemarks({
        user_id: self.data.user_id,
        remark: self.data.remark
      }, (err, res) => {
        if (res.status == 0) {
          self.list();
          self.setData({
            isShow: !self.data.isShow
          })
          self.setData({
            remark:""
          })
        } else {
          wx.showToast({
            title: "添加失败",
            icon: 'none',
            duration: 2000
          });
        }
      })
    }else{
      self.setData({
        isShow: false
      })
    }
  },
  bindfocus(){
    var self=this;
      self.setData({
        isShow:true
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})