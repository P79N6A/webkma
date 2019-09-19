// components/tasks-list/tasks-list.js
const utils = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   * itemData  单条数据
   * url 跳转页面url
   */
  properties: {
    item:{
      type:Object,
      value:'',
      observer: function (newVal, oldVal) {
        let that = this
        let info = newVal
        let temp = info.activeEndDate - info.newTime
        info.timer = temp > 0 ? utils.timeCount(temp) : "已过期"
        info.completionRate = info.completionRate>0?info.completionRate.toFixed(2):0
        info.exposure = utils.convertJoinCount(info.exposure)
        info.userNumber = utils.convertJoinCount(info.userNumber)
        that.setData({
          itemData: info,
          pageType: that.properties.isManager
        })
      }
    },
    urls:{
      type: Object,
      value:''
    },
    isManager:{
      type: String,
      value: ''
    },
    isCompany:{
      type: Boolean,
      value: false
    },
    showShare:{
      type: Boolean,
      value: true
    },
    showQueryInfo: {
      type: Boolean,
      value: true
    },
    showCompleteRate: {
      type: Boolean,
      value: true
    },
    showRanking: {
      type: Boolean,
      value: true
    },
    itemIndex:{
      type:Number,
      value:''
    },
    isOwnerTask: {
      type: Boolean,
      value: true
    }
  },
  ready(){
    
  },
  /**
   * 组件的初始数据
   */
  data: {
    pageType:0,
    itemData:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    shareBtn() {
      // 传递给父组件
      var that = this;
      var myEventDetail = { 
        isShare: true, 
        itemData: that.data.itemData 
      } // detail对象，提供给事件监听函数
      this.triggerEvent('itemDataEvent', myEventDetail) //myevent自定义名称事件，父组件中使用
    },
    itemDetali() {
      let that = this, _param = !this.data.isOwnerTask ? `&hideShare= true` : '';

      wx.navigateTo({
        url: that.properties.urls.detailUrl + `?activityUrl=${that.data.itemData.url}&title=${that.data.itemData.sourceName}&id=${that.data.itemData.id}${_param}`,
      })
    },
    dataInfoData(){
      let that = this
      getApp().globalData.taskId = that.data.itemData.id
      getApp().globalData.isCompany = that.properties.isCompany
      wx.navigateTo({
        url: that.properties.urls.analysisUrl + `?id=${that.data.itemData.id}&name=${that.data.itemData.name}&isCompany=${that.properties.isCompany}`
      })
    }
  }
})