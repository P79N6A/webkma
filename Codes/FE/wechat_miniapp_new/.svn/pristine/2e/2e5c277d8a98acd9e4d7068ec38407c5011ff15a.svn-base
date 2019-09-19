// pages/task-data.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNavTab: 'taskData',
    radarDataSource: [],
    // 地图
    mapDataSource: [],
    funnelDataSource: [],
    // 男女比例
    genderDataSource: {},
    // 浏览习惯
    dailyLineDataSource: [],
    compPhoto: [{
        url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2857172539,3231616089&fm=26&gp=0.jpg'
      },
      {
        url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2197066702,135802552&fm=26&gp=0.jpg'
      },
      {
        url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2857172539,3231616089&fm=26&gp=0.jpg'
      },
      {
        url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2197066702,135802552&fm=26&gp=0.jpg'
      },
      {
        url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2857172539,3231616089&fm=26&gp=0.jpg'
      }
    ],
    takePhoto: [{
        url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2857172539,3231616089&fm=26&gp=0.jpg'
      },
      {
        url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2197066702,135802552&fm=26&gp=0.jpg'
      },
      {
        url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2857172539,3231616089&fm=26&gp=0.jpg'
      },
      {
        url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2197066702,135802552&fm=26&gp=0.jpg'
      },
      {
        url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2857172539,3231616089&fm=26&gp=0.jpg'
      }
    ]
  },
  // tabs切换
  navbarTabChange: function (e) {
    this.setData({
      activeNavTab: e.detail.key
    })
  },
  // 打开说明窗
  openDesc() {
    wx.showModal({
      title: '相关规则说明',
      showCancel: false,
      content: '1)曝光量: 打开活动的浏览数据;\r\n2)访客量: 打开活动的访客数据;\r\n3)咨询量: 报名提交成功的数据;\r\n4)成交量: 进商品下单成功数据.',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      radarDataSource: [80, 60, 40, 20],
      genderDataSource: {
        total: 2000,
        male: 800,
        female: 600
      },
      funnelDataSource: [{
          value: 1000,
          name: '浏览'
        },
        {
          value: 600,
          name: '客户'
        },
        {
          value: 20,
          name: '咨询'
        },
        {
          value: 2,
          name: '成交'
        }
      ],
      dailyLineDataSource: [60, 80, 100, 40, 150, 440, 620, 310, 600, 500, 800, 400, 200, 160, 78, 40, 33, 21, 12, 30, 8, 33, 16, 28],
      mapDataSource: [{
          name: '四川',
          value: 1503
        },
        {
          name: '新疆',
          value: 703
        },
        {
          name: '湖南',
          value: 1020
        },
        {
          name: '北京',
          value: 925
        },
        {
          name: '上海',
          value: 1204
        },
        {
          name: '西藏',
          value: 354
        },
        {
          name: '内蒙古',
          value: 602
        },
      ]
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})