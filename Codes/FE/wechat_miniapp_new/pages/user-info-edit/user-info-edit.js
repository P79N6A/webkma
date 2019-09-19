// pages/staff-info/staff-info.js
let
  app = getApp(),
  config = require('../../config.js'),
  activityService = require('../../services/activity-service.js'),
  util = require("../../utils/util.js"),
  userSvr = require("../../services/user-info.js");
import WxValidate from '../../utils/wx-validate.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {},
    // index: 0,
    // current: 0,
    type: '', //个人类型
    emplId: '', //员工id
    businessId: '', //企业id
    imgSrc: '', //头像路径
    phone: '可见', //手机号
    weChat: '可见', //微信号
    email: '可见', //邮箱
    showList: ['可见', '不可见'],
    sex: '无', //性别
    sexList: ['男', '女'], //性别选项
    form: {
      userName: '', //姓名
      job: '', //职位
      department: '', //部门
      weChatNumber: '', //微信号
      emailNumber: '', //邮箱
      phoneNumber: '', //手机号
      corpName: '' //企业名称 
    },
    phoneIndex: 1, //手机隐私切换索引
    wxIndex: 1, //微信隐私切换索引
    emailIndex: 1, //邮箱隐私切换索引
    sexIndex: null, //性别切换索引
    weText: '', //输入值回填
    emailText: '',
    corpPage: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu(); //隐藏右上角转发
    this.getPersonalInfo();
    this.initValidate();
  },
  // 获取员工信息
  getPersonalInfo: function() {
    var self = this;
    activityService.personalInfoQuery({}, (err, res) => {
      if (res.status == 0) {
        self.setData({
          dataList: res.data, //信息数据
          type: res.data.type, //个人类型
          phoneIndex: res.data.pvtPhone - 1, //手机隐私切换索引
          wxIndex: res.data.pvtWxNo - 1, //微信隐私切换索引
          emailIndex: res.data.pvtEmail - 1, //邮箱隐私切换索引
          emplId: res.data.emplId == null ? '' : res.data.emplId, //员工id
          businessId: res.data.businessId, //企业id
          imgSrc: res.data.face, //个人头像
          sexIndex: res.data.sex - 1, //性别
          form: {
            userName: res.data.name, //姓名
            job: res.data.job, //职位
            department: res.data.dept, //部门
            weChatNumber: res.data.wxNo || self.data.weText, //微信号
            emailNumber: res.data.email || self.data.emailText, //邮箱
            phoneNumber: res.data.phone, //手机号
            corpName: res.data.company //企业名称
          }
        })
        // console.log("数据", self.data.phoneIndex, self.data.wxIndex, self.data.emailIndex, '员工id', self.data.emplId)
      } else {
        console.log(err)
      }
    })
  },
  // 储存输入值
  saveData: function(e) {
    var self = this;
    let value = e.detail.value
    wx.setStorageSync('wechat', value)
  },
  saveEmail: function(e) {
    var self = this;
    let value = e.detail.value
    wx.setStorageSync('email', value)
  },
  // 企业切换
  onTapSwitchCorp: function() {
    wx.navigateTo({
      url: '/pages/switch-corp/switch-corp',
    })
  },
  // 解除绑定跳转
  relieveBinding: function(e) {
    wx.navigateTo({
      url: '/pages/user-setup-phone/user-setup-phone?phone=' + e.currentTarget.dataset.phone,
    })
  },
  // 更换头像
  switchPhoto: function(e) {
    // console.log("当前id",e)
    var self = this;
    //调用微信api
    wx: wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        //图片临时路径
        var filep = res.tempFilePaths[0]
        //上传图片接口
        wx.uploadFile({
          url: `${config.apiGateway}api/assets_service/v1/assets/upload?secret_key=${config.secretKey}&client_type=weapp`,
          filePath: filep,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function(res) {
            var uploadData = JSON.parse(res.data);
            //上传图片到服务器后的地址
            var imgPath = uploadData.data[0].file;
            self.setData({
              imgSrc: imgPath
            })
            // console.log("获取选中图片路径", uploadData);
            //切换头像接口
            // userSvr.switchPhoto({
            //   id: self.data.emplId,
            //   face: self.data.imgSrc
            // }, (err, result) => {
            //   if (err) return reject(err);
            //   if (result.status == 0){
            //     // wx.switchTab({
            //     //   url: '/pages/extension-main/extension-main',
            //     //   success: function (e) {
            //     //     var page = getCurrentPages().pop();
            //     //     if (page == undefined || page == null) return;
            //     //     page.onLoad();
            //     //   }
            //     // })
            //     console.log(result.message)
            //   };
            // })
          }
        })
      },
      // fail: function(res) {},
      // complete: function(res) {},
    })
  },
  // 隐私设置
  showPhone: function(e) {
    console.log("sdsdsdsds", e)
    let self = this;
    wx.showActionSheet({
      itemList: self.data.showList,
      success(res) {
        // console.log("手机切换",self.data.phoneIndex)        
        if (res.tapIndex === 0) {
          self.setData({
            phone: self.data.showList[0],
            phoneIndex: res.tapIndex
          })
        } else if (res.tapIndex === 1) {
          self.setData({
            phone: self.data.showList[1],
            phoneIndex: res.tapIndex + 1
          })
        }
      }
    })
  },
  shoWechat: function(e) {
    let self = this;
    wx.showActionSheet({
      itemList: self.data.showList,
      success(res) {
        // console.log("微信切换", self.data.wxIndex)    
        if (res.tapIndex === 0) {
          self.setData({
            weChat: self.data.showList[0],
            wxIndex: res.tapIndex
          })
        } else if (res.tapIndex === 1) {
          self.setData({
            weChat: self.data.showList[1],
            wxIndex: res.tapIndex + 1
          })
        }
      }
    })
  },
  showEmail: function(e) {
    let self = this;
    wx.showActionSheet({
      itemList: self.data.showList,
      success(res) {
        // console.log("邮箱切换", self.data.emailIndex)    
        if (res.tapIndex === 0) {
          self.setData({
            email: self.data.showList[0],
            emailIndex: res.tapIndex
          })
        } else if (res.tapIndex === 1) {
          self.setData({
            email: self.data.showList[1],
            emailIndex: res.tapIndex + 1
          })
        }
      }
    })
  },
  // 性别设置
  showSex: function(e) {
    let self = this;
    wx.showActionSheet({
      itemList: self.data.sexList,
      success(res) {
        self.setData({
          sexIndex: res.tapIndex
        })
        // console.log("性别切换", self.data.sexIndex)
        if (res.tapIndex === 0) {
          self.setData({
            sex: self.data.sexList[0]
          })
        } else {
          self.setData({
            sex: self.data.sexList[1]
          })
        }
      }
    })
  },
  // 刷新上页数据
  refreshData: function() {
    wx.$emit('_refleshUserInfo');
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    // wx.closeSocket();
    prePage.onLoad();
    console.log("上级页面", prePage)
    setTimeout(function() {
      wx.$emit('_refleshOverviewData');
      wx.navigateBack({
        delta: 1
      });
    }, 500);
  },
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
      userName: {
        required: true,
        maxlength: 15
      },
      emailNumber: {
        email: true
      },
      phoneNumber: {
        tel: true
      },
      corpName: {
        required: true
      }
    }
    // 提示信息
    const messages = {
      userName: {
        required: '请填写姓名',
        maxlength: '最多可输入15个字符'
      },
      emailNumber: {
        email: '请填写正确的邮箱'
      },
      phoneNumber: {
        tel: '请填写正确的手机号'
      },
      corpName: {
        required: '请填写企业名称'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  // 表单提交
  formSubmit: function(e) {
    var self = this;
    // const type = self.data.emplId ? 2 : 1;
    const params = e.detail.value;
    console.log("表单信息", e)
    // 校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      if (!!params.weChatNumber && !/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})$/.test(params.weChatNumber)) {
        this.showModal({
          msg: '微信号码格式不正确！'
        });
        return false;
      }
      activityService.personalInfoUpdate({
        type: self.data.type,
        name: params.userName,
        emplId: self.data.emplId,
        businessId: self.data.businessId,
        face: self.data.imgSrc,
        sex: self.data.sexIndex + 1,
        job: params.job,
        dept: params.department,
        company: params.corpName || self.data.form.corpName,
        wxNo: params.weChatNumber,
        email: params.emailNumber,
        phone: params.phoneNumber,
        pvtPhone: self.data.phoneIndex + 1,
        pvtWxNo: self.data.wxIndex + 1,
        pvtEmail: self.data.emailIndex + 1
      }, (err, res) => {
        if (res.status == 0) {
          wx.showToast({
            title: '保存成功',
          })
          self.refreshData();
        } else {
          console.log(err)
        }
      })
    }
  },

  // 绑定手机
  getPhoneNumber: function(e) {
    var self = this;
    var app = getApp();
    let corp = wx.getStorageSync('corp');
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var userInfo = app.globalData.userInfo;
      wx.showLoading({
        title: '绑定中'
      });
      userSvr.bindPhone({
        sessionKey: userInfo.sessionKey,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        type: 0
      }, function(err, res) {
        wx.hideLoading();
        if (!!err) {
          util.toast.fail({
            title: err.message
          });
          return;
        }
        if (res.status != 0) {
          self.getStaffInfo();
        }
        app.checkBindInfo(true);
        self.onShow();
        if (corp !== '') {
          wx.showToast({
            title: '当前手机号为认证企业绑定的手机号',
            icon: 'none',
            duration: 3000
          })
        } else {
          return
        }
      })
    }
    // else {
    //   wx.navigateTo({
    //     url: '/pages/binding-phone/binding-phone',
    //   })
    // }
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
    var self = this;
    wx.setStorageSync('corp', self.data.emplId)
    let wechat = wx.getStorageSync('wechat');
    let email = wx.getStorageSync('email');
    self.setData({
      weText: wechat,
      emailText: email
    })
    this.getPersonalInfo();
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
    this.refreshData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})