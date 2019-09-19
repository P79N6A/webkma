const
  activityService = require('../../services/activity-service.js'),
  config = require('../../config.js'),
  cardsService = require('../../services/cards.js'),
  utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardSrc: '',
    coverSaveStatus: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.buildImg();
  },
  // 生成名片图片
  buildImg: function () {
    wx.showLoading({ 
      title: '名片图片生成中'
    });
    let canvasContainer = {//canvas容器的rpx尺寸
      width: 720,
      height: 900
    }, self = this;
    wx.createSelectorQuery().select('.cover_box').fields({
      size: true,
    }, (box) => {
      let
        qrcodeInfo = {//小程序码
          source: null,
          size: {
            rateW: 300 / canvasContainer.width,
            rateH: 300 / canvasContainer.height
          }
        };
        new Promise((resolve, reject) => {
          // 获取个人信息
          activityService.personalInfoQuery({}, (err, res) => {
            if (res.status == 0) {
              self.userInfo = res.data;
              resolve(self.userInfo);
            } else {
              reject();
            }
          })
        }).then(() => {
          return new Promise((resolve, reject) => {
            if (!!wx.getStorageSync('cardQrcodeImg')){
              resolve();
            } else {
              let option = {
                data: {
                  "from_user": self.userInfo.userId,
                  "from_company": self.userInfo.businessId || ''
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
            }
            
          })
        }).then((id) => {
          return new Promise((resolve, reject) => {
            function next(file) {
              if (!self.data.qrcodeImg) {
                self.setData({
                  qrcodeImg: file
                })
                wx.hideLoading();
              }
              wx.getImageInfo({
                src: file,
                success: resolve,
                fail: reject
              })
            }
            if (!!wx.getStorageSync('cardQrcodeImg')) {
              next(wx.getStorageSync('cardQrcodeImg'));
            } else {
              activityService.creatQrcode(JSON.stringify({
                "width": 300,
                "page": "pages/index/index",
                "isHyaline": true,
                "scene": `act=card&id=${id}`
              }), function (err, res) {
                if (res.status == 0) {
                  wx.setStorageSync('cardQrcodeImg', res.data.file);
                  next(res.data.file);
                } else {
                  reject();
                }
              })
            }
            
          })
        }).then((result) => {
        // coverInfo.source = result[0];
        qrcodeInfo.source = result.path;
        const ctx = wx.createCanvasContext('card_canvas');
        // 设置底色
        ctx.setFillStyle('white');
        ctx.fillRect(0, 0, box.width, box.height);

        // 绘制背景
        ctx.drawImage('../../images/offlinecashprize-bg.png',
          0, 0, box.width, box.height * 0.31
        );
        ctx.arc(box.width / 2, 230 / canvasContainer.height * box.height, qrcodeInfo.size.rateW * box.width / 2, 0, 2 * Math.PI);
        ctx.fill();

        // 绘制小程序码
        ctx.drawImage(qrcodeInfo.source,
          211 / canvasContainer.width * box.width,
          83 / canvasContainer.height * box.height,
          qrcodeInfo.size.rateW * box.width,
          qrcodeInfo.size.rateH * box.height
        );

        function fillTextFn(str, fontSize, fontColor, startX, startY) {
          let maxWidth = box.width - startX,
            maxLength = Math.floor(maxWidth / fontSize);
          ctx.setTextBaseline('top');
          ctx.setFontSize(fontSize);
          ctx.setTextAlign('left');
          ctx.setFillStyle(fontColor);
          if (str.length <= maxLength) {
            ctx.fillText(str, startX, startY, maxWidth);
          } else {
            ctx.fillText(str.substring(0, maxLength - 3) + '...', startX, startY, maxWidth);
          }
        }
        // 绘制名片文字内容
        fillTextFn(self.userInfo.name, (36 / canvasContainer.width * box.width), '#000000', (50 / canvasContainer.width * box.width), (440 / canvasContainer.height * box.height));
        fillTextFn(self.userInfo.job || '暂无职位', (24 / canvasContainer.width * box.width), '#999999', (50 / canvasContainer.width * box.width), (495 / canvasContainer.height * box.height));

        function drawIconFn(path, startyPoint) { //小图标绘制
          ctx.drawImage(path,
            (50 / canvasContainer.width * box.width),
            (startyPoint / canvasContainer.height * box.height),
            (35 / canvasContainer.width * box.width),
            (35 / canvasContainer.height * box.height)
          );
        }
        drawIconFn('../../images/card-company.png', 570);
        drawIconFn('../../images/card-phone.png', 626);
        drawIconFn('../../images/card-email.png', 683);

        fillTextFn(self.userInfo.company || '暂无公司', (28 / canvasContainer.width * box.width), '#555555', (95 / canvasContainer.width * box.width), (572 / canvasContainer.height * box.height));
        fillTextFn(self.userInfo.phone || '暂无电话', (28 / canvasContainer.width * box.width), '#555555', (95 / canvasContainer.width * box.width), (628 / canvasContainer.height * box.height));
        fillTextFn(self.userInfo.email || '暂无邮箱', (28 / canvasContainer.width * box.width), '#555555', (95 / canvasContainer.width * box.width), (683 / canvasContainer.height * box.height));
        fillTextFn('扫一扫小程序码，面对面递名片', (24 / canvasContainer.width * box.width), '#999999', (194 / canvasContainer.width * box.width), (829 / canvasContainer.height * box.height));

        ctx.setLineDash([(5 / canvasContainer.width * box.width), (5 / canvasContainer.width * box.width)]);
        ctx.lineWidth = (4 / canvasContainer.width * box.width);
        ctx.strokeStyle = '#999999';
        ctx.beginPath();
        ctx.moveTo((20 / canvasContainer.width * box.width), (776 / canvasContainer.height * box.height));
        ctx.lineTo((704 / canvasContainer.width * box.width), (776 / canvasContainer.height * box.height));
        ctx.stroke();

        ctx.draw(true, () => {
          wx.canvasToTempFilePath({
            fileType: "png",
            width: box.width,
            height: box.height,
            destWidth: box.width * 750 / wx.getSystemInfoSync().windowWight,
            destHeight: box.height * 750 / wx.getSystemInfoSync().windowWight,
            canvasId: 'card_canvas',
            success: (res) => {
              self.cardSrc = res.tempFilePath;
              self.setData({ cardSrc: self.cardSrc });
              wx.hideLoading();
            },
            fail: self.errMessage
          })
        });
      }).catch(self.errMessage);
    }).exec();
  },
  // 保存图片
  downloadCard: function () {
    let self = this;
    wx.showLoading({
      title: '名片图片保存中'
    });
    wx.saveImageToPhotosAlbum({
      filePath: self.cardSrc,
      success: (res) => {
        self.setData({
          coverSaveStatus: 1
        });
        wx.hideLoading();
        utils.toast.success({
          title: "图片保存成功"
        });
      },
      fail: (err) => {
        wx.hideLoading();
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
  // 授权保存到相册功能的回调
  saveImg: function () {
    this.setData({
      coverSaveStatus: 1
    });
    this.downloadCard();
  }
})