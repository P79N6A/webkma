const utils = require('../../utils/util.js');
const config = require('../../config.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userData: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {
        this.setData({
          paintData: newVal
        })
      }
    },
    showModal: {
      type: Boolean,
      value: false
    }
  },
  lifetimes: {
    ready: function() {
      this.buildEmployImg();
      wx.$on('drawReport', () => {
        this.buildEmployImg();
      })
    },
    resize: function(size) {
      // 页面尺寸变化
      console.log(111)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    imgSrc: '',
    coverSaveStatus: 0,
    isPainted: false,
    paintData: {}
  },
  /**
   * 组件的方法列表
   */
  methods: {
    fillText: function(ctx, str, fontSize, color, x, y, maxWidth) {
      ctx.setTextBaseline('top');
      ctx.setTextAlign('left');
      ctx.setFontSize(fontSize);
      ctx.setFillStyle(color);
      ctx.fillText(str, x, y);
    },
    buildEmployImg: function(download) {
      console.log('开始绘制了');
      var self = this;
      wx.createSelectorQuery().in(this).select('.canvas_box').fields({
        size: true
      }, (box) => {
        let rate = box.width / 500;
        const ctx = wx.createCanvasContext('canvas_cover', this);

        ctx.clearRect(0,0, 500 * rate, 680 * rate);
        wx.hideLoading();
        Promise.all([
            new Promise((resolve, reject) => {
              wx.getImageInfo({
                src: 'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/report_img1.png',
                success: resolve,
                fail: reject
              })
            }),
            new Promise((resolve, reject) => {
              wx.getImageInfo({
                src: self.data.paintData.headImg,
                success: resolve,
                fail: reject
              })
            })
          ])
          .then((result) => {
            // 绘制白色面板
            function drawPanel(x, y, r, w, h) {
              ctx.beginPath()
              ctx.setFillStyle('#ffffff')
              ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
              ctx.moveTo(x + r, y)
              ctx.lineTo(x + w - r, y)
              ctx.lineTo(x + w, y + r)
              ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
              ctx.lineTo(x + w, y + h - r)
              ctx.lineTo(x + w - r, y + h)
              ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
              ctx.lineTo(x + r, y + h)
              ctx.lineTo(x, y + h - r)
              ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
              ctx.lineTo(x, y + r)
              ctx.lineTo(x + r, y)
              ctx.fill()
              ctx.closePath()
              ctx.draw(true);
            }
            drawPanel(0, 145 * rate, 10 * rate, 500 * rate, 535 * rate);

            // 头像发光图
            ctx.drawImage(result[0].path, 102 * rate, 0, 297 * rate, 297 * rate);

            ctx.arc(250 * rate, 148 * rate, 87 * rate, 0, 2 * Math.PI);
            ctx.setFillStyle('white');
            ctx.fill();

            ctx.save();
            ctx.beginPath();
            ctx.arc(250 * rate, 148 * rate, 79 * rate, 0, 2 * Math.PI);
            ctx.clip();
            // 头像
            ctx.drawImage(result[1].path, 171 * rate, 69 * rate, 158 * rate, 158 * rate);
            ctx.restore();
            ctx.closePath();
            ctx.draw(true);


            // 排名绘制
            let rank = self.data.userData.rank==-1?'暂无':'No.' + self.data.userData.rank;
            ctx.setFontSize(24 * rate);
            let rankStrW = ctx.measureText(rank).width;

            ctx.arc(287 * rate, 236 * rate, 15 * rate, 0, 2 * Math.PI);
            ctx.rect(287 * rate, 221 * rate, rankStrW, 30 * rate);
            ctx.arc(287 * rate + rankStrW, 236 * rate, 15 * rate, 0, 2 * Math.PI);
            ctx.setFillStyle('#f86411');
            ctx.fill();
            self.fillText(ctx, rank, 24 * rate, 'white', 287 * rate, 221 * rate);
            ctx.draw(true);

            // 文字绘制
            let title = self.data.paintData.rankrate > 50 ? '任务达人!' : '我是潜力股!';
            ctx.setFontSize(34 * rate);
            self.fillText(ctx, title, 34 * rate, '#3C4A55', (500 * rate - ctx.measureText(title).width) / 2, 274 * rate);
            //累计完成
            ctx.setFontSize(22 * rate);
            let str1 = `累计完成${self.data.paintData.taskNum}个任务`;
            let str1_left = (500 * rate - ctx.measureText(str1).width) / 2;
            self.fillText(ctx, '累计完成', 22 * rate, '#3C4A55', str1_left, 343 * rate);
            self.fillText(ctx, self.data.paintData.taskNum, 22 * rate, '#F68411', str1_left + ctx.measureText('累计完成').width, 343 * rate);
            self.fillText(ctx, '个任务', 22 * rate, '#3C4A55', str1_left + ctx.measureText(`累计完成${self.data.paintData.taskNum}`).width, 343 * rate);

            let str2 = self.data.paintData.rankrate > 50 ? '你做任务这么厉害，领导都笑醒了！' : '这盘只是攒人品，是时候展示真正的技术了！';
            let str2_left = (500 * rate - ctx.measureText(str2).width) / 2;
            self.fillText(ctx, str2, 22 * rate, '#3C4A55', str2_left, 373 * rate);

            self.fillText(ctx, '奖励', 22 * rate, '#B1BFCD', (500 * rate - ctx.measureText('奖励').width) / 2, 433 * rate);

            // 奖励金额
            ctx.setFontSize(24 * rate);
            let unit_width = ctx.measureText('￥').width;
            ctx.setFontSize(48 * rate);
            let reward_width = ctx.measureText(self.data.paintData.reward).width;
            let str3_left = (500 * rate - unit_width - reward_width) / 2;
            self.fillText(ctx, '￥', 24 * rate, '#FA766B', str3_left, 489 * rate);
            self.fillText(ctx, self.data.paintData.reward, 48 * rate, '#FA766B', str3_left + unit_width, 468 * rate);

            self.fillText(ctx, '转发', 22 * rate, '#B1BFCD', 70 * rate, 559 * rate);
            self.fillText(ctx, '曝光', 22 * rate, '#B1BFCD', 230 * rate, 559 * rate);
            self.fillText(ctx, '获客', 22 * rate, '#B1BFCD', 390 * rate, 559 * rate);

            //转发、曝光、获客数据处理
            ctx.setFontSize(36 * rate);
            let share_left = 16 * rate + (152 * rate - ctx.measureText(self.data.paintData.shareNum).width) / 2;
            let despose_left = 168 * rate + (165 * rate - ctx.measureText(self.data.paintData.despose).width) / 2;
            let getTarget_left = 333 * rate + (152 * rate - ctx.measureText(self.data.paintData.getTargetNum).width) / 2;
            self.fillText(ctx, self.data.paintData.shareNum, 36 * rate, '#24D0C6', share_left, 594 * rate);
            self.fillText(ctx, self.data.paintData.despose, 36 * rate, '#24D0C6', despose_left, 594 * rate);
            self.fillText(ctx, self.data.paintData.getTargetNum, 36 * rate, '#24D0C6', getTarget_left, 594 * rate);

            // 竖线
            ctx.moveTo(168 * rate, 565 * rate);
            ctx.lineTo(168 * rate, 635 * rate);
            ctx.moveTo(333 * rate, 565 * rate);
            ctx.lineTo(333 * rate, 635 * rate);
            ctx.setLineWidth(1 * rate);
            ctx.setStrokeStyle('rgba(221,228,235,1)');
            ctx.stroke();

            ctx.draw(true, setTimeout(() => {
              self.setData({
                isPainted: true
              })
              self.saveImage();
            }, 1000));
          });
      }).exec();
    },
    saveImage: function() {
      let self = this;
      wx.createSelectorQuery().in(this).select('.canvas_box').fields({
        size: true
      }, (box) => {
        wx.canvasToTempFilePath({
          fileType: "png",
          destWidth: box.width * 3,
          destHeight: box.height * 3,
          canvasId: 'canvas_cover',
          success: (res) => {
            self.data.imgSrc = res.tempFilePath;
          }
        }, self)
      }).exec();
    },
    // 下载图片
    downloadImg: function() {
      let self = this;
      wx.showLoading({
        title: '图片下载中'
      });
      wx.saveImageToPhotosAlbum({
        filePath: self.data.imgSrc,
        success: (res) => {
          self.setData({
            coverSaveStatus: 1
          });
          wx.hideLoading();
          wx.showToast({
            title: "图片下载成功"
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
      }, self);
    },
    // 授权使用保存到相册功能回调
    saveImg: function() {
      this.setData({
        coverSaveStatus: 1
      });
      this.downloadImg();
    },
    closeModal: function() {
      this.setData({
        coverSaveStatus: 0
      })
      this.triggerEvent('parentEvent', false); //myevent自定义名称事件，父组件中使用
    },
    showHelp: function() {
      let urls = [`${config.bosHost}help-share-moments.jpg`];
      console.log(urls);
      wx.previewImage({
        current: urls[0],
        urls: urls
      })
    }
  }
})