// pages/feedback/feedback.js
const config =require('../../config.js');
const util =require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedback:'',
    errorMsg:'',
    counter:0,
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu(); //隐藏右上角转发
    this.setData({
      phone: options.phone
    })
  },

  inputHandler:function(e){
    let val = e.detail.value;
    this.setData({
      'feedback': val,
      "errorMsg":'',
      "counter": val.length
    });
  },
  confirmHandler:function(e){
    let self = this;
    let feedback = self.data.feedback;
    if (!feedback || !!/^\s*$/.test(feedback) || feedback.length>200){
      return wx.showToast({ 'title': "请输入1-200个字符","icon":"none" });
    }
    util.showModal({
      content: '确认提交反馈内容？',
      success:function(res){
        if (res.confirm) {
          let app = getApp();
          let userInfo = app.globalData.userInfo;
          let loginInfo = userInfo.data[0];
          wx.showLoading({
            title: '提交中...',
          })
          wx.request({
            url: `${config.apiGateway}api/feedback_service/v1/feedback/save?secret_key=${config.secretKey}`,
            method:"POST",
            data:{
              fb_content: self.data.feedback,
              fb_user_name: userInfo.nickName ||'匿名',
              fb_user_id: loginInfo.user_uuid,
              fb_user_concat: self.data.phone||'未绑定手机',
            },
            success:function(ret){
              wx.hideLoading();
              if(ret.data.status===0){
                setTimeout(function(){
                  wx.showToast({
                    title: '提交反馈成功',
                    duration: 3000,
                  })
                  // util.toast.success({
                  //   title: '提交反馈成功',
                  //   duration: 3000,
                  // });
                  setTimeout(function () {
                    wx.navigateBack({ delta: 1 });
                  }, 3000);
                },100)
               
              }else{
                util.toast.fail({ 'title': ret.data.message || '提交反馈失败', "duration":2000});
              }
            },
            fail:function(){
              wx.hideLoading();
            }
          })
          console.log(self.data.feedback)
        }
      }
    })
  } ,
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
  
  }
})