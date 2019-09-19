// pages/red-envelopes-card/red-envelopes-card.js
let
  app = getApp(),
  config = require('../../config.js'),
  activityService = require('../../services/activity-service.js'),
  util = require("../../utils/util.js");
const articleService = require("../../services/article.js");
import WxValidate from '../../utils/wx-validate.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //个人信息
    coverImg: '', //活动封面
    title: '', //活动标题
    desc: '', //活动摘要
    ordinaryNumber: '', //普通红包金额
    luckNumber: '', //拼手气红包金额
    number: '', //红包个数
    switchIndex: '1', //红包切换,1-默认普通红包，2-拼手气红包
    id: '', //活动id(推广活动过来)
    userId: '', //用户id(红包名片过来)
    companyId: '', //商户id(红包名片过来)
    redpackeId: '', //红包id
    prepayId: '', //预支付id
    orderId: '', //账单id
    time: '', //时间戳
    random: '' , //随机数
    flag: false, //塞红包按钮状态
    detail: {}, //文章信息
    descImg: '', //文章封面
    descText: '' //文章标注
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getUserIp(); //用户ip  
    self = this;
    self.setData({
      id: options.relationId == undefined ? '' : options.relationId,
      userId: options.from_user == undefined ? '' : options.from_user,
      companyId: options.from_company == undefined ? '' : options.from_company,
      coverImg: options.coverImg == undefined ? '' : options.coverImg + '@s_2,w_200,h_214', 
      title: options.title == undefined ? '' : options.title, 
      desc: options.desc == undefined ? '' : options.desc,
      articleid: options.articleid == undefined ? '' : options.articleid
    });
    if (self.data.id !== ''){
      wx.setNavigationBarTitle({
        title: '红包推广'
      })
    }else if (self.data.articleid !== ''){
      wx.setNavigationBarTitle({
        title: '文章推广'
      })
      //获取文章信息
      articleService.articalDetail({
        id: self.data.articleid
      }, function (err, res) {
        if (res.status == 0) {
          var desc = res.data.descText;
          var descText = desc.replace(/\\x0a/g, "")
          self.setData({
            detail: res.data,
            descImg: res.data.descImg + '@s_2,w_200,h_214',
            descText: descText
          })
        }
      })
    }
    // console.log("活动id",this.data.id,"用户id",this.data.userId,"商户id",this.data.companyId)
    this.initValidate(); //表单验证
  },
  // 获取员工信息
  getPersonalInfo: function () {
    var self = this;
    activityService.personalInfoQuery({}, (err, res) => {
      if (res.status == 0) {
        self.setData({
          userInfo: res.data
        })
        // console.log("数据", res.data)
      } else {
        console.log(err)
      }
    })
  },
  // 切换为拼手气红包
  luckCard: function (){
    this.setData({
      switchIndex: '2'
    })
    if (this.data.switchIndex == '2') {
      this.setData({
        ordinaryNumber: '',
        number: ''
      })
    }
  },
  // 切换为普通红包
  ordinaryCard: function () {
    this.setData({
      switchIndex: '1'
    })
    if (this.data.switchIndex == '1'){
      this.setData({
        luckNumber:'',
        number: ''
      })
    }
  },
  // 限制输入两位小数
  checkInputText: function (text) {
    var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g; 
    if (reg.test(text)) { 
      text = text.replace(reg, '$2$3$4');
    } else { 
      text = '';
    } return text; 
  },
  // 生成随机数
  generateNonceString: function () {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var length_1 = 16;
    var noceStr = '';
    var maxPos = chars.length;
    while (length_1--)
      noceStr += chars[Math.random() * maxPos | 0];
    return noceStr;
  },
  // 监听input 
  ordinary: function(e){
    var ordinaryNumber = this.checkInputText(e.detail.value);
    var length = e.detail.value.length;
    this.setData({
      ordinaryNumber: ordinaryNumber
    })
    if (e.detail.value > 200){
      util.toast.fail({
        title: '单个红包金额不可超过200元'
      });
    } else if (ordinaryNumber * this.data.number>200){
      util.toast.fail({
        title: '红包总金额不能超过200元'
      });
    }
    // console.log("单个金额", this.data.ordinaryNumber, "长度", e.detail.value.length)
  },
  luck: function(e){
    var luckNumber = this.checkInputText(e.detail.value);
    this.setData({
      luckNumber: luckNumber
    }) 
    if (luckNumber > 200) {
      util.toast.fail({
        title: '单次支付总额不可超过200元'
      });
    } 
    if (this.data.number !== '') {
      if (luckNumber / this.data.number < 0.01) {
        util.toast.fail({
          title: '单个红包不可低于0.01元'
        });
        this.setData({ luckFlag: true })
      } else {
        this.setData({ luckFlag: false })
      }
    } else {
      this.setData({ luckFlag: false })
    }
  },
  reNumber: function(e){
    var number = e.detail.value;
    this.setData({
      number: number
    })
    if(number == ''){
      return
    }else{
      if ((this.data.luckNumber / number) > 200) {
        util.toast.fail({
          title: '单个红包金额不可超过200元'
        });
      } else if (number * this.data.ordinaryNumber > 200) {
        util.toast.fail({
          title: '红包总金额不能超过200元'
        });
      } 
      if (this.data.luckNumber !== ''){
        if (this.data.luckNumber / number < 0.01) {
          util.toast.fail({
            title: '单个红包不可低于0.01元'
          });
          this.setData({ luckFlag: true })
        } else {
          this.setData({ luckFlag: false })
        }
      } else {
        this.setData({ luckFlag: false })
      }
      if(number>100){
        util.toast.fail({
          title: '红包个数不可超过100个'
        });
      }
    }
    // console.log("凭手气",this.data.luckNumber)
  },
  // 失焦事件
  // oinput: function (){
  //   this.setData({
  //     ordinaryNumber: ''
  //   })
  // },
  // 报错信息
  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
    })
  },
  // 初始化表单校验
  initValidate() {
    // 验证规则
    const rules = {
      ordinaryNumber: {
        // digits: true,
        number: true,
        min: 0.1,
        max: 200
      },
      luckNumber: {
        // digits: true,
        number: true,
        min: 0.1,
        max: 200
      },
      number: {
        digits: true,
        number: true,
        min: 1,
        max: 100
      }
    }
    // 提示信息
    const messages = {
      ordinaryNumber: {
        // digits: '请输入有效金额',
        number: '请输入有效的数字',
        min: '请输入不小于0.1的数值',
        max: '单个红包金额不可超过200元'
      },
      luckNumber: {
        // digits: '请输入有效金额',
        number: '请输入有效的数字',
        min: '请输入不小于0.1的数值',
        max: '单次支付总额不可超过200元'
      },
      number: {
        digits: '输入个数有误',
        number: '请输入有效的个数',
        min: '请输入不小于1的个数',
        max: '红包个数不可超过100个'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  // 表单数据 sendMoney
  formSubmit: function (e){
    var self = this;
    const params = e.detail.value;
    self.setData({
      ordinaryNumber: parseFloat(params.ordinaryNumber == null ? '' : params.ordinaryNumber), //普通红包金额
      luckNumber: parseFloat(params.luckNumber == null ? '' : params.luckNumber), //拼手气红包金额
      number: parseInt(params.number), //红包个数
    })
    // console.log("表单信息", params)
    // 校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      self.getFormId(e.detail.formId);
      self.setData({
        flag: true
      })
      new Promise((resolve, reject) => {
          var num = self.data.luckNumber || (self.data.ordinaryNumber * self.data.number);
          var total = num.toString();
          activityService.payInfo({
            productId: '1xsa11xs11sdadxsa',
            totalFee: total
          }, (err, res) => {
            if (res.status == 0) {
              self.setData({
                prepayId: res.data.data.prepayId,
                orderId: res.data.orderId
              })
              resolve(res.data.data.prepayId)
            } else {
              reject()
            }
          })
        }).then((result) => {
          return new Promise((resolve, reject) => {
            var appId = config.appId,
              timeStamp = (new Date()).getTime(),
              nonceStr = self.generateNonceString(),
              packStr = 'prepay_id=' + result;
              self.setData({
                time: timeStamp,
                random: nonceStr
              })
              // console.log("时间错", timeStamp,"时间",self.data.time)
            activityService.generateSign(JSON.stringify({
              "appId": appId,
              "timeStamp": timeStamp,
              "nonceStr": nonceStr,
              "package": packStr,
              "signType": "MD5"
            }), function (err, res) {
              if (res.status == 0) {
                resolve(res.data.data)
                // console.log("签名", res.data.data)
              }
            })
          }) 
        }).then((sign) => {
          var nonceStr = self.generateNonceString(),
            packStr = 'prepay_id=' + self.data.prepayId,
            time = self.data.time,
            nonceStr = self.data.random;
          var timeStr = time.toString();
          //发起微信支付
          wx.requestPayment({
            'timeStamp': timeStr,
            'nonceStr': nonceStr,
            'package': packStr,
            'signType': 'MD5',
            'paySign': sign,
            'success': function (res) {
              wx.showToast({
                title: '支付成功',
              })
              self.setData({flag: false})
              self.sendMoney();
            },
            'fail': function (res) {
              self.setData({flag: false})
              console.log("失败", res)
            }
          });
        })
    }
  },
  //塞红包接口
  sendMoney: function (){
    var self = this;
    var stat = self.data.id == ''?'名片':'活动'; 
    console.log( "relationId", this.data.id, "from_user", this.data.userId, "from_company", this.data.companyId, "articleid", this.data.articleid)
    activityService.sendMoney({
      type: self.data.switchIndex,
      money: self.data.luckNumber,
      permoney: self.data.ordinaryNumber,
      title: "感谢您关注我的" + stat + "，奉上红包，预祝商祺！",
      num: self.data.number,
      extId: self.data.id || self.data.articleid || '',
      extType: self.data.id !== '' ? 1 : (!!self.data.articleid?3:2),
      orderId: self.data.orderId
    }, (err, res) => {
      if (res.status == 0) {
        self.setData({
          redpackeId: res.data
        });

        self.savePayid(self.data.prepayId, self.data.redpackeId); //保存预支付id
        wx.navigateTo({
          url: '/pages/create-redpack/create-redpack?redpackId=' + this.data.redpackeId + '&relationId=' + this.data.id + '&from_user=' + this.data.userId + '&from_company=' + this.data.companyId + '&articleid=' + this.data.articleid
        })
        
      } else {
        util.toast.fail({
          title: res.message
        });
      }
    })
  },
  //获取formID getFormId
  getFormId: function (id) {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id;
    activityService.getFormId({
      formId: id,
      session_id: session_id
    }, (err, res) => {
      if (res.status == 0) {
        console.log("发送成功")
      }
    })
  },
  //保存预支付id
  savePayid: function(pid,rid){
    activityService.savePayid({
      prepayId: pid,
      relationId: rid
    }, (err, res) => {
      if (res.status == 0) {
        console.log("保存成功")
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPersonalInfo();
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