// components/customer-info/customer-info.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type: Array
    },
    flag: String, //右侧图标状态 2--企业客户
    where: {//用于哪儿,'otherPage' --其他的数据等页面, 'home' --营销日报
      type: String,
      value: 'otherPage'
    }  
  },

  /**
   * 组件的初始数据
   */
  data: {
    taskId: getApp().globalData.taskId
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //拨号
    telCall: function(e) {
      let call = e.currentTarget.dataset.call;
      if (call==null){
        wx.showToast({
          title: "获取电话号码失败",
          icon: 'none',
          duration: 2000
        });
        return false
      }
      wx.makePhoneCall({
        phoneNumber: call,
      })
    },
    //员工详情
    employeesInfo: function (e) {
      wx.navigateTo({
        url: '/pages/employee-details/employee-details?id=' + e.currentTarget.dataset.empid + '&userId=' + e.currentTarget.dataset.userid + '&name=' + e.currentTarget.dataset.name
      })
    },
    //企业客户详情信息
    detailsInfo: function(e){
      let item = JSON.stringify(e.currentTarget.dataset.item);
      let urls = ''
      if (getApp().globalData.taskId) {
        urls = '/pages/tasks-customer-details/tasks-customer-details?'
      } else {
        urls = '/pages/business-customer-details/business-customer-details?'
      }
      wx.navigateTo({
        url: urls+'item=' + item + '&type=1' + '&userId=' + e.currentTarget.dataset.userid
      })
    } ,
    //员工客户详情
    staffInfo: function(e){
      let item = JSON.stringify(e.currentTarget.dataset.item);
      wx.navigateTo({
        url: '/pages/customer-details/customer-details?id=' + e.currentTarget.dataset.id + '&item=' + item + '&type=2' + '&userId=' + e.currentTarget.dataset.userid
      })
    },
    //任务客户详情
    taskCustmoer: function(e){
      wx.navigateTo({
        url: '/pages/tasks-customer-details/tasks-customer-details' 
      })
    }
  },
})