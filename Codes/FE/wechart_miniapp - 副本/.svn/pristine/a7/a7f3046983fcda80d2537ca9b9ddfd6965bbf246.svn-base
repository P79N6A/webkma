// components/list-card/list-card.js
const utils = require('../../utils/util.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal, changedPath) {}
    },
    showPublishTime: Boolean,
    showJoinCount: Boolean,
    showIsShare: Boolean,
    isTask: Boolean,
    isLoading: Boolean,
    isPoster: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapHandler: function(e) {
      let id = e.currentTarget.dataset.itemId;
      let type = e.currentTarget.dataset.type;
      let eventType = e.currentTarget.dataset.eventType;
      let record = this.data.listData.find(d => d.id === id);
      if (type==2){
        let articleid = e.currentTarget.dataset.itemId;
        wx.navigateTo({
          url: '/pages/article-detail/article-detail?articleid=' + articleid + '&hideShareBar=true' 
        })
      }else{
        if (!!record) {
          this.triggerEvent(eventType, record)
        } else {
          wx.showToast({
            title: '数据未找到',
          })
        }
      }
    },
    toPromotion: function(e){
      let id = e.currentTarget.dataset.itemId;
      wx.navigateTo({
        url: `/pages/extension-task-share/extension-task-share?id=${id}`,
      })
    }
  }
})