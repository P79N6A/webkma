const activityService = require('../../services/activity-service.js'),
  utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    qrcodeImg: '',
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self=this;
    wx.showLoading({
      title: '加载中',
    });
    activityService.getPrizeDetail({ relationId: options.relationid, controlId: options.controlid},function(err,res){
      if(res.status==0){
        console.log(res);
        res.data.createtime = utils.dateString(res.data.createtime, '/');
        if(!!res.data.exchangetime) res.data.exchangetime = utils.dateString(res.data.exchangetime, '/');
        if(!!res.data.businessContact) res.data.businessContact = JSON.parse(res.data.businessContact);
        if(res.data.cashType != 1 && res.data.userCashType != 1) self.creatQrcode(res.data.id);
        res.data.isProvideText = '未兑奖';
        if (!!res.data.userCashType) {
          switch (res.data.userCashType){
            case 1:
              res.data.isProvideText = res.data.isProvide == 1 ? '奖品已寄出' : '奖品未寄出';
              break;
            case 2:
              res.data.isProvideText = res.data.isProvide == 1 ? '已兑奖' : '未兑奖';
              break;
          }
        } else if (res.data.cashType == 2){
          res.data.isProvideText = res.data.isProvide == 1 ? '已兑奖' : '未兑奖';
        }
        self.setData({
          detail: res.data,
          loading: false
        })
      } else {
        wx.showToast({
          title: '获取活动奖品详情失败',
          duration: 3000,
        })
      }
      wx.hideLoading();
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
  
  },
   /**
   * 生成线下兑奖二维码
   */
  creatQrcode: function(id){
    let self = this;
    activityService.creatQrcode(JSON.stringify({
      "width": 540,
      "page": "pages/index/index",
      "scene": "act=offineCashPrize&id=" + id
    }), function (err, res) {
      if (res.status == 0) {
        self.setData({
          qrcodeImg: res.data.file
        })
      } else {
        wx.showToast({
          title: '生成二维码图片失败',
          duration: 3000,
        })
      }
    })
  },
  jumpOffline: function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/offine-cash-prize/offine-cash-prize?id='+id,
    })
  }
})