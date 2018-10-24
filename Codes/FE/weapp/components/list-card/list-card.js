// components/list-card/list-card.js
const utils= require('../../utils/util.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData:{
      type:Array,
      value:[],
      observer: function (newVal, oldVal, changedPath){
      }
    },
    showPublishTime:Boolean,
    showJoinCount: Boolean,
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
    onTapHandler:function(e){
      let id = e.currentTarget.dataset.itemId;
      let record = this.data.listData.find(d=>d.id===id);
      if (!!record){
        this.triggerEvent('tapEvent', record)
      }
      else{
        wx.showToast({
          title: '数据未找到',
        })
      }
    }
  }
})
