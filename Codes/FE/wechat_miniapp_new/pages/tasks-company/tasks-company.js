// pages/task-list/task-list.js
const activityService = require('../../services/activity-service.js');
const utils = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pullstatus:false,
    showLoadMore:false,
    urls: {
      detailUrl: '/pages/extension-task-detail/extension-task-detail',
      analysisUrl: '/pages/extension-task-charts/extension-task-charts'
    },
    coverSaveStatus: 0,
    textinfo: '玩命加载中...',
    params: {
      id: '',
      search: '',
      searchType: 1,
      pageIndex: 1,
      pageSize: 10,
      isManager:1,
      taskStatus:'2,3'
    },
    conditionTxt: '剩余时间',
    dataLsit: [],
    total: 0,
    isShare: false,
    type: null, //活动类型
    rankingData: [],
    currActivity: {}, //当前选中的要分享的活动
    conditionlist: ['剩余时间', '完成率', '营销力排行']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    that.data.params.id = app.globalData.userInfo.emplId
    that.getList(this.data.params)
    that.getRankingList()
  },
  getRankingList(){
    this.getList('ranking')
  },
  // 获取子组件信息
  itemDataEvent(e) {
    this.setData({
      isShare: e.detail.isShare,
      currActivity: e.detail.itemData
    })
  },

  // 下载任务排行
  downloadImg(e) {
    wx.showLoading({
      title: '榜单下载中'
    });
    this.buildImg(true);
  },
  downloadFileImg(url) {
    return Promise.all(url.map(url => {
      return new Promise((resolve, reject) => wx.downloadFile({
        url: url,
        success: function(res) {
          if (res.statusCode === 200) {
            var avaterSrc = res.tempFilePath;
            resolve(avaterSrc);
          }
        },
        fail: reject
      }));
    }));
  },
  // 授权使用保存到相册功能回调
  saveImg: function () {
    this.setData({
      coverSaveStatus: 1
    });
    this.saveImage();
  },
  buildImg() {
    let self = this
    let canvasContainer = { //canvas容器的rpx尺寸
      width: 750,
      height: 377
    };
    wx.createSelectorQuery().select('.canvas_cover').fields({
      size: true,
    }, (box) => {
      const ctx = wx.createCanvasContext('canvas_cover');
      // 设置底色
      ctx.setFillStyle('white');
      ctx.fillRect(0, 0, box.width, box.height);
      let imgUrls = ['https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/reward_bg.png']
      let rankData = JSON.parse(JSON.stringify(self.data.rankingData))
      for (let i in rankData) {
        imgUrls.push(rankData[i].cover)
      }
      let imgUrlsFn = self.downloadFileImg(imgUrls)
      imgUrlsFn.then(res => {
        console.log(res)
        ctx.drawImage(res[0], 0, 0, box.width, box.height);
        //画圆点
        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.arc(251 / canvasContainer.width * box.width, 34, 4, 0, 2 * Math.PI);
        ctx.fillRect(255 / canvasContainer.width * box.width, 34, 51, 1);
        ctx.fillRect(450 / canvasContainer.width * box.width, 34, 51, 1);
        ctx.arc(500 / canvasContainer.width * box.width, 34, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.rect(104, 134, 80, 154);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.rect(331, 110, 80, 154);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.rect(573, 140, 80, 154);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        function fillTextFn(str, fontSize, fontColor, startX, startY) {
          let maxWidth = box.width - startX,
          maxLength = Math.floor(maxWidth / fontSize);
          ctx.setTextBaseline('top');
          ctx.setFontSize(fontSize);
          ctx.setTextAlign('center');
          ctx.setFillStyle(fontColor);
          if (str.length <= maxLength) {
            ctx.fillText(str, startX, startY, maxWidth);
          } else {
            ctx.fillText(str.substring(0, 11) + '...', startX, startY, maxWidth);
          }
        }
        //标题
        fillTextFn('热门任务榜', (24 / canvasContainer.width * box.width), '#ffffff', (379 / canvasContainer.width * box.width), (20 / canvasContainer.height * box.height));

        fillTextFn(`${self.data.rankingData[0].newTimeArr.y}/${self.data.rankingData[0].newTimeArr.m}/${self.data.rankingData[0].newTimeArr.d}更新`, (16 / canvasContainer.width * box.width), '#ffffff', (379 / canvasContainer.width * box.width), (62 / canvasContainer.height * box.height));
        // 排行
        // 第二名
        if (res.length > 2) {
          ctx.drawImage(res[2],
            104, 134, 80, 154
          );
          ctx.drawImage('../../images/icon-num2.png',
            175, 253, 32, 40
          );
          fillTextFn(self.data.rankingData[1].name, (16 / canvasContainer.width * box.width), '#ffffff', (138 / canvasContainer.width * box.width), (316 / canvasContainer.height * box.height));
          fillTextFn(`${self.data.rankingData[1].marketingForce}分`, (26 / canvasContainer.width * box.width), '#FFFF00', (138 / canvasContainer.width * box.width), (338 / canvasContainer.height * box.height));
        }

        // 第一名
        if (res.length > 1) {
          ctx.drawImage(res[1],
            331, 110, 80, 154
          );
          ctx.drawImage('../../images/icon-num1.png', 397, 224, 32, 40);
          fillTextFn(self.data.rankingData[0].name, (16 / canvasContainer.width * box.width), '#ffffff', (380 / canvasContainer.width * box.width), (299 / canvasContainer.height * box.height));
          fillTextFn(`${self.data.rankingData[0].marketingForce}分`, (26 / canvasContainer.width * box.width), '#FFFF00', (380 / canvasContainer.width * box.width), (324 / canvasContainer.height * box.height));
        }
        
        // 第三名
        if (res.length > 3) {

          ctx.drawImage(res[3],
            573, 140, 80, 154
          );
          ctx.drawImage('../../images/icon-num3.png',
            637, 253, 32, 40
          );
          fillTextFn(self.data.rankingData[2].name, (16 / canvasContainer.width * box.width), '#ffffff', (630 / canvasContainer.width * box.width), (316 / canvasContainer.height * box.height));
          fillTextFn(`${self.data.rankingData[2].marketingForce}分`, (26 / canvasContainer.width * box.width), '#FFFF00', (630 / canvasContainer.width * box.width), (338 / canvasContainer.height * box.height));
        }
        ctx.draw(true, () => {
          // if (download)
          self.saveImage();
        });
      })
    }).exec();
  },
  // 保存到相册
  saveImage: function() {
    let self = this
    wx.createSelectorQuery().select('.canvas_cover').fields({
      size: true,
    }, (box) => {
      wx.canvasToTempFilePath({
        fileType: "png",
        width: box.width, //导出图片的宽
        height: box.height, //导出图片的高
        destWidth: box.width,
        destHeight: box.height,
        canvasId: 'canvas_cover',
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              self.setData({
                coverSaveStatus: 1
              });
              wx.hideLoading();
              wx.showToast({
                title: "图片下载成功",
              })
            },
            fail: (err) => {
              wx.hideLoading();
              utils.toast.fail({
                title: "图片下载失败"
              });
              console.error("图片下载失败", err);
              self.setData({
                coverSaveStatus: 2
              });
            }
          })
        },
        fail: (err => {
          console.log(err)
        })
      })
    }).exec();
  },
  getKeyword(e) {
    this.setData({
      'params.search': e.detail.value
    })
  },
  // 选择筛选条件
  openConditionlist(e) {
    let self = this
    wx.showActionSheet({
      itemList: self.data.conditionlist,
      success(res) {
        console.log(res)
        self.setData({
          conditionTxt: res.tapIndex == 0 ? '剩余时间' : (res.tapIndex == 1 ? '完成率' : '营销力排行'),
          "params.pageIndex": 1,
          "params.searchType": res.tapIndex + 1,
        })
        self.getList(self.data.params)
      }
    })
  },
  getKeyword(e) {
    this.setData({
      'params.search': e.detail.value
    })
  },
  searchFn() {
    this.data.params.pageIndex = 1
    this.getList(this.data.params)
  },
  // 获取列表
  getList(data) {
    let self = this
    let cont = JSON.parse(JSON.stringify(this.data.params))
    if (data =='ranking'){
      cont.searchType = 3
    }
    activityService.rankingList(cont, (err, res) => {
      if (res.status == 0) {
        let datainfo = []
        if (data =='ranking') {
          datainfo = res.data.length > 2 ? res.data.list.slice(0, 2) : res.data.list
          datainfo.map((item, index) => {
            item.newTimeArr = utils.format(item.newTime)
          })
          self.setData({
            rankingData:datainfo
          })
          return
        }
        let allTotal = Math.ceil(res.data.total / self.data.params.pageSize)
        self.setData({
          dataLsit: self.data.params.pageIndex > 1 ? self.data.dataLsit.concat(res.data.list) : res.data.list,
          total: res.data.total,
          "params.pageIndex": self.data.params.pageIndex + 1,
          textinfo: res.data.total < 1 && self.data.params.pageIndex == 1 ? "暂无数据" : (this.data.params.pageIndex < allTotal ? "玩命加载中..." : '这是我的底线了')
        });
        console.log(self.data.dataLsit)
      }
      wx.stopPullDownRefresh({
        complete: () => {
          this.setData({
            pullstatus: false //最后还原该状态
          })
        }
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      "params.pageIndex": 1,
      pullstatus: true
    })
    this.getList(this.data.params)
  },

  /**
   * 页面监听滚动条
   */
  onPageScroll(e) {
    this.setData({
      showLoadMore: true
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.pullstatus) return
    let pageAll = Math.ceil(this.data.total / this.data.params.pageSize) 
    if (this.data.params.pageIndex <= pageAll) {
      this.getList(this.data.params)
    } else {
      this.setData({
        textinfo: "已经到底了"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let h5Info = this.data.currActivity
    let userInfo = app.globalData.userInfo
    let shareObj = {
      title: h5Info.name,
      imageUrl: h5Info.cover || null
    };
    activityService.analysisSave({
      as_from: 'weapp',
      as_type: 'scan_share',
      as_belong_module: h5Info.id,
      as_belong_user: userInfo.data[0].user_uuid,
      as_belong_id: app.globalData.userInfo.businessId
    });
    return shareObj;
  }
})