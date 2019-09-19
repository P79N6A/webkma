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
    count: Number,
    total: Number,
    title: String,
    where: {//用于哪儿,'otherPage' --其他的数据等页面, 'home' --营销日报
      type: String,
      value: 'otherPage'
    },
    isShowTitle:{
      type:Boolean,
      value:true
    }  
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
    jumpCustomList: function(e){
      let id = e.currentTarget.dataset.itemId;
      wx.switchTab({
        url: `/pages/customer/customer`
      })
    }
  }
})