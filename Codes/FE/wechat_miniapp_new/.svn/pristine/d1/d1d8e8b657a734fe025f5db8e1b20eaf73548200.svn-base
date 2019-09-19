// pages/post-img/post-img.js
let utils = require('../../utils/util.js'),
  activityService = require('../../services/activity-service.js'),
  userInfoService = require('../../services/user-info.js'),
  cardsService = require('../../services/cards.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    h5Info: null,
    cardDetail: null, //海报分享者名片信息
    src: '',
    coverSaveStatus: 0,
    canvasW: '100vw',
    showImg: {
      width: '',
      height: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    self.data.id = options.id || '';
    self.data.from_user = options.from_user || '';
    self.data.from_company = options.from_company || '';
    activityService.activityInfo(self.data.id, (err, res) => {
      if (err) return self.errMessage(err);
      if (res.status !== 0) return self.errMessage(res.message);
      wx.setNavigationBarTitle({
        title: res.data.name
      });
      self.data.h5Info = res.data;
      self.buildImg();
    });
  },
  buildImg: function () {
    let self = this;
    wx.showLoading();
    wx.createSelectorQuery().select('.cover_box').fields({
      size: true,
    }, (box) => {
      let
        qrcodeInfo = {
          source: null,
          size: {
            width: 100,
            height: 100
          }
        },
        coverInfo = {
          source: null,
          size: {
            width: box.width,
            height: box.height - qrcodeInfo.size.height - 10
          }
        };
      Promise.all([
        new Promise((resolve, reject) => {//获取海报分享者信息
          userInfoService.getOrtherInfo({
            cardUserId: self.data.from_user,
            cardBusinessId: self.data.from_company
          }, function (err, res) {
            if (res.status == 0) {
              self.setData({
                cardDetail: res.data
              });
              resolve(res.data);
            } else {
              reject();
            }
          })
        }),
        new Promise((resolve, reject) => {
          // todo: 生成带登陆者身份的小程序
          var option = {
            data: {
              "from_user": self.data.from_user,
              "from_company": self.data.from_company
            },
            type: 'conf_card'
          };

          cardsService.saveCustomConfig(option, function (err, res) {
            if (res.status == 0) {
              resolve(res.data);
            } else {
              reject();
            }
          })
        }).then((id) => {
          return new Promise((resolve, reject) => {
            activityService.creatQrcode(JSON.stringify({
              "width": 200,
              "page": "pages/index/index",
              "id": self.data.h5Info.relationId,
              "isHyaline": true,
              "scene": `act=card&id=${id}`
            }), function (err, res) {
              if (res.status == 0) {
                wx.getImageInfo({
                  src: res.data.file,
                  success: resolve,
                  fail: reject
                })
              } else {
                reject();
              }
            })
          })
        }),
        new Promise((resolve, reject) => {//获取海报图片
          // cover image info
          var poster = self.data.h5Info.posterImage;
          if (!!poster) {
            var posterImg = JSON.parse(poster),
              posterPng = posterImg.png;
            wx.getImageInfo({
              src: posterPng + '@s_0,h_' + coverInfo.size.height,
              success: resolve,
              fail: reject
            })
          } else {
            resolve(true);
          }
        })
      ]).then((result) => {
        let cardDetail = result[0];
        qrcodeInfo.source = result[1];
        coverInfo.source = result[2];
        self.setData({
          'showImg.width': coverInfo.source.width + 'px',
          'showImg.height': '100vh',
          canvasW: (coverInfo.source.width * 750 / wx.getSystemInfoSync().windowWidth) + 'rpx'
        })
        const ctx = wx.createCanvasContext('canvas_cover');
        // 设置底色
        ctx.setFillStyle('white');
        ctx.fillRect(0, 0, box.width, box.height);
        // 绘制封面
        ctx.drawImage(coverInfo.source.path,
          0, 0, coverInfo.source.width, coverInfo.size.height
        );

        // 绘制小程序码
        ctx.drawImage(qrcodeInfo.source.path,
          coverInfo.source.width - qrcodeInfo.size.width  - 10,
          coverInfo.size.height + 5,
          qrcodeInfo.size.width,
          qrcodeInfo.size.height
        );
        //绘制名片信息
        let phone = cardDetail.phone,
          job = cardDetail.job.length > 10 ? cardDetail.job.substring(0, 10) : cardDetail.job,
          businessName = cardDetail.company;
        let nickname = cardDetail.name.length > 6 ? cardDetail.name.substring(0, 6) + '...' : cardDetail.name;
        utils.fillTextFn(ctx, nickname, 12, '#000000', 10, coverInfo.size.height + 16, box.width - 10);
        
        if (coverInfo.source.width - qrcodeInfo.size.width < ctx.measureText(nickname).width + ctx.measureText(phone).width){
          //一行显示不下时
          //绘制职位
          utils.fillTextFn(ctx, phone, 10, '#000000', 10, box.height - 75, box.width - 10);
          utils.fillTextFn(ctx, job, 10, '#999999', 10, box.height - 55, box.width - 10);
          //绘制分割线
          ctx.drawImage('../../images/article-line.png', 10, coverInfo.size.height + 78, coverInfo.source.width - qrcodeInfo.size.width - 30, 1);
          //绘制公司名称
          utils.fillTextFn(ctx, businessName, 10, '#999999', 10, box.height - 25, box.width - 10);
        } else {
          utils.fillTextFn(ctx, phone, 12, '#000000', 20 + ctx.measureText(nickname).width, coverInfo.size.height + 16, box.width - 20);
          utils.fillTextFn(ctx, job, 10, '#999999', 10, box.height - 68, box.width - 10);
          //绘制分割线
          ctx.drawImage('../../images/article-line.png', 10, coverInfo.size.height + 68, coverInfo.source.width - qrcodeInfo.size.width - 30, 1);
          //绘制公司名称
          utils.fillTextFn(ctx, businessName, 10, '#999999', 10, box.height - 30, box.width - 10);
        }

        
        ctx.draw(true, self.saveImage);

        wx.hideLoading();
      }).catch(self.errMessage);
    }).exec();
  },
  saveImage: function () {
    let self = this;
    wx.createSelectorQuery().select('.cover_box').fields({
      size: true,
    }, (box) => {
      wx.canvasToTempFilePath({
        fileType: "png",
        destWidth: box.width * 750 / wx.getSystemInfoSync().windowWight,
        destHeight: box.height * 750 / wx.getSystemInfoSync().windowWight,
        canvasId: 'canvas_cover',
        success: (res) => {
          self.setData({
            src: res.tempFilePath
          })
        },
        fail: self.errMessage
      })
    }).exec();
  },

  download: function(){
    let self = this;
    wx.saveImageToPhotosAlbum({
      filePath: self.data.src,
      success: (res) => {
        self.setData({
          coverSaveStatus: 1
        });
      },
      fail: (err) => {
        utils.toast.fail({
          title: "图片保存失败"
        });
        console.error("图片保存失败", err);
        self.setData({
          coverSaveStatus: 2
        });
      }
    })
  },

  errMessage: function (err) {
    wx.hideLoading();
    utils.toast.fail({
      title: "图片生成失败"
    });
    console.error(err);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let self = this,
      userInfo = getApp().globalData.userInfo,
      h5Info = self.data.h5Info;
    
    activityService.analysisSave({
      as_from: 'weapp',
      as_type: 'scan_share',
      as_belong_module: h5Info.relationId,
      as_belong_user: self.data.from_user,
      as_belong_id: self.data.from_company
    });

    return {
      title: h5Info.name,
      path: `/pages/index/index?target=` + encodeURIComponent(`/pages/post-img/post-img?id=${h5Info.relationId}&from_user=${self.data.from_user}&from_company=${self.data.from_company}`),
      imageUrl: h5Info.cover || null
    };
  }
})