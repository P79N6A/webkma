// components/list-card/list-card.js
const activityService = require('../../services/activity-service.js'),
utils = require('../../utils/util.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardDetail: {
      type: Object,
      value: {}
    },
    redpackId: String,
    relationId: String,
    fromUser: String,
    fromCompany: String,
    coverImg: String,
    jumpUrl: String,
    articleId: String
  },
  lifetimes: {
    ready() {
      let self = this;
      self.checkRedpack(() => {
        self.setData({
          showModal: !self.data.redpackInfo.received || !!self.data.open
        });
      });
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    redpackInfo: {},
    showModal: false,
    open: false
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    // 查询红包状态
    checkRedpack: function(cb){
      let self = this;
      activityService.checkRedpack(self.data.redpackId, (err, res) => {
        if (res.status == 0) {

          self.setData({
            redpackInfo: res.data
          });
          !!cb && cb();
        } else {
          utils.toast.fail({
            title: "查询红包状态失败"
          });
        }
      });
    },
    //开红包
    openRedpack: function(){
      let self = this;
      if(this.opening){ return false; }
      this.opening = true;
      activityService.openRedpack(self.data.redpackId, (err, res) => {
        if (res.status == 0) {
          if(res.data.code == 200){
            self.setData({
              'open': true
            });
          }
          self.checkRedpack();
        } else {
          utils.toast.fail({
            title: "红包领取失败,status:" + res.status
          });
        }
        self.opening = false;
      });
    },
    closeModal: function(){
      this.setData({
        showModal: false
      })
    },
    toActivityDetail: function(){
      let self = this;
      wx.navigateTo({
        url: self.data.jumpUrl
      })
    },
    failClose: function(){
      if(!!this.data.relationId){
        this.toActivityDetail();
      } else {
        this.closeModal();
      }
    },
    toRedpackDetail: function(){
      let self = this;
      wx.navigateTo({
        url: `/pages/red-envelopes-detail/red-envelopes-detail?id=${self.data.redpackId}`
      });
    }
  }
})