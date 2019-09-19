const activityService = require('../../services/activity-service.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 设置组件内容对齐方式
     * 属性可选值: left | center | right
     */
    "textAlign": {
      type: String,
      value: 'left',
      observer: function(newVal, oldVal) {
        this.setData({
          textAlignClassName: (() => {
            switch (newVal) {
              case "left":
              default:
                return "text-align-left";
              case "center":
                return "text-align-center";
              case "right":
                return "text-align-right";
            }
          })()
        });
      }
    }
  },

  /**
   * 组件的初始数据 
   */
  data: {
    textAlignClassName: "text-align-left"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getFormId: function(e) {
      let
        formId = e.detail.formId,
        session_id = getApp().globalData.userInfo.session_id;

      if (formId && session_id) {
        activityService.getFormId({
          formId: formId,
          session_id: session_id
        }, (err, res) => {
          console.log(`收集formId${res.status == 0 ? '成功' : '失败'}`, formId);
        });
      }

      this.triggerEvent('click');
    },
  }
})