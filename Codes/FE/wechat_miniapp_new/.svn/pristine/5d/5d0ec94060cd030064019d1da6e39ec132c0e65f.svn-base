Component({
  /**
   * 组件的属性列表
   */
  properties: {
    redpackId: String //红包id
  },

  /**
   * 组件的初始数据
   */
  data: {
    open: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    spread: function(){
      this.setData({
        open: !this.data.open
      })
    },
    //首页
    jumpIndex: function () {
      wx.switchTab({
        url: "/pages/home/home"
      })
    },
    toRedpackLog: function(){
      let self = this;
      wx.navigateTo({
        url: `/pages/red-envelopes-detail/red-envelopes-detail?id=${self.data.redpackId}`
      })
    }
  }
})