// components/plug-in-unit.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowIphon: {
      type: String,
      value: ''
    },
    isShowInfo: {
      type: String,
      value: ''
    },
    item:{
      type:Object,
      value:''
    },
    isPrice:{
      type:Boolean,
      value:false
    }
  },
  ready(){
    console.log("----------------------------------")
    console.log(this.properties.item)
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
    callPhon(){
      let self = this
      wx.makePhoneCall({
        phoneNumber:self.properties.item.phone,
      })
    },
    dataInfoData(){
      this.triggerEvent('pulgEvent', this.properties.item)
    },
  }
})