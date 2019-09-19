 // components/share-menu/share-menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currActivity: {
      type: Object,
      value: '',
      observer: function (newVal, oldVal) {
        let that = this
        that.setData({
          shareActivity: newVal
        })
      }
    }
  },
  ready() {
    shareActivity:{}
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
    shareBtn(e) {
      // 传递给父组件
      var that = this;
      let type = e.currentTarget.dataset.type || false
      var myEventDetail = { isShareType: e.currentTarget.dataset.type } // detail对象，提供给事件监听函数
      this.triggerEvent('shareEvent', myEventDetail) //myevent自定义名称事件，父组件中使用
    }
  }
})