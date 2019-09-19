const
  config = require('../config.js'),
  request = require('../utils/request.js');

module.exports = {
  // 用户授权登录
  myMerketingActivities: (options, callback) => {
    callback = callback || function() {};
    request.post({
      url: `${config.apiHost}api/identify_service/v1/openauth/weapp_authorize?secret_key=${config.secretKey}&client_type=weapp`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        // 登录结果代码
        if (data.status != 0) return callback(data);
        // 正常值返回
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  activityList: (options, callback) => {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/manuscript/recommend/activities?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取员工信息
  infomerge: function(options, callback) {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/user/infomerge?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取绑定员工信息 bindStaffInfo
  bindStaffInfo: function(options, callback) {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/employee/bind/info?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //个人信息修改 
  personalInfoUpdate: function (options, callback) {
    callback = callback || function () { };
    options.secret_key = config.secretKey;
    request.post({
      url: `${config.apiHost}/user/update?secret_key=${config.secretKey}&client_type=weapp`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //个人信息查询
  personalInfoQuery: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/user/info?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 我的团队推广数据
  teamPromotion: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/manuscript/team/promotion?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 我的个人推广数据
  myPromotion: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/manuscript/my/promotion?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 我的任务
  myJob: function(options, callback) {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/manuscript/my/job?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 我的奖励
  myReward: function(options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/award/my?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 我的个人奖励 
  personalReward: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/award/my/single?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 我的团队奖励 
  teamReward: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/award/my/group?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //发红包
  sendMoney: function (data, callback) {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/red/packet/send`,
      data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 账户详情
  payInfo: function (data, callback) {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/wx/pay/jsapi`,
      data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 生成签名
  generateSign: function (data, callback) {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/wx/pay/sign`,
      data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 保存预支付id 
  savePayid: function (data, callback) {
    // let session_id = getApp().globalData.userInfo.session_id;
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/wx/prepay/id/save`,
      data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 红包记录
  redpackets: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/award/redpackets/list?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 收到的红包记录 
  getPacketReceive: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/red/packet/receive/list?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 发出的红包记录 
  getPacketSend: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/red/packet/send/list?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 红包详情 
  getredPackeInfo: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/red/packet/info?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 检测红包状态 
  checkRedpack: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/red/packet/check?secret_key=${config.secretKey}&client_type=weapp&id=${options}`,
      data: {},
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 开红包 
  openRedpack: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/red/packet/open?secret_key=${config.secretKey}&client_type=weapp&id=${options}`,
      data: {},
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 提现记录
  cashRecord: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/wx/pay/log/withdrawal/list?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //团队成员查询  
  teamMemberQuery: function(options, callback) {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/manuscript/team/list?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 获取用户参与的活动列表
  joinActivities: function(options, callback) {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/manuscript/join/activities?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取活动详情
  activityDetail: function(options, callback) {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/manuscript/detail?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取活动详情（不包含Page&Plugin内容）
  activitySimple: function(options, callback) {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/manuscript/simple?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 活动详情业务获取活动信息
  activityInfo: function(id, callback) {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/manuscript/detail/release?id=${id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //统计分析服务 - 记录
  analysisSave: function(options, callback) { 
    callback = callback || function() {};
    options.secret_key = config.secretKey;
    request.post({
      // url: `${config.apiGateway}api/analysis_service/v1/analysis/save?client_type=weapp`,
      url: `${config.apiHost}/manuscript/analysis/save?client_type=weapp`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  getPrizeList: function(data, callback) {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/activity/plugin/drawprizedata`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  getPrizeDetail: function(data, callback) {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/activity/plugin/form/content`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取线下兑奖记录详情
  getOffineDatail: function(data, callback) {
    callback = callback || function() {};
    request.get({
      url: `${config.apiHost}/activity/plugin/cash/offline`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //发放奖品
  grantPrize: function(data, callback) {
    callback = callback || function() {};
    request.post({
      url: `${config.apiHost}/activity/plugin/cash/offline?id=${data.id}`,
      data: {},
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //生成线下兑奖二维码
  creatQrcode: function(data, callback) {
    callback = callback || function() {};
    let session_id = getApp().globalData.userInfo.session_id
    request.post({
      url: `${config.apiHost}/manuscript/wxqrcode/get?session_id=${session_id}`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  getFormList: function(options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/activity/plugin/marketing/form?relationId=${options.id}&session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  getFormContentDetail: function(options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/activity/plugin/form/content/info?formId=${options.id}&session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //提现
  cashWithdrawal: function (data, callback) {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/wx/pay/mch/withdrawal`,
      data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取用户余额
  getAccountInfo: function (options, callback) {
    request.get({
      url: `${config.apiHost}/wx/account/info`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //我的推广列表
  getMyPromotionList: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/user/behavior/extension/search?secret_key=${config.secretKey}`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //互动分析列表 
  getInteractionInfo: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/user/behavior/extension/interaction?secret_key=${config.secretKey}`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //脉圈线索列表 
  getCuleList: function (options, callback) {
    request.get({
      url: `${config.apiHost}/relation/clue/list?order=${options.order}&range=${options.range}&pageIndex=${options.pageIndex}&pageSize=${options.pageSize}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //脉圈人脉列表 
  getPeopleList: function (options, callback) {
    request.get({
      url: `${config.apiHost}/relation/people/list?order=${options.order}&range=${options.range}&pageIndex=${options.pageIndex}&pageSize=${options.pageSize}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //人脉转客户
  saveCustomer: function (data, callback) {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/relation/change`,
      data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //脉圈客户列表
  // getCustomerList: function (options, callback) {
  //   request.get({
  //     url: `${config.apiHost}/relation/customer/list?order=${options.order}&range=${options.range}&pageIndex=${options.pageIndex}&pageSize=${options.pageSize}`,
  //     success: (res) => {
  //       callback(null, res.data);
  //     },
  //     fail: (res) => {
  //       callback(res);
  //     }
  //   })
  // },
  //脉圈客户详情 
  // getCustomerInfo: function (options, callback) {
  //   request.get({
  //     url: `${config.apiHost}/relation/customer/info?cid=${options.cid}&sid=${options.sid}`,
  //     success: (res) => {
  //       callback(null, res.data);
  //     },
  //     fail: (res) => {
  //       callback(res);
  //     }
  //   })
  // },
  //客户互动分享数据 
  customerInteraction: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/user/behavior/target/interaction?secret_key=${config.secretKey}`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //客户信息编辑 
  // editCustomerInfo: function (options, callback) {
  //   callback = callback || function () { };
  //   options.secret_key = config.secretKey;
  //   request.post({
  //     url: `${config.apiHost}/relation/customer/edit?secret_key=${config.secretKey}`,
  //     data: Object.assign({}, options),
  //     success: (res) => {
  //       callback(null, res.data);
  //     },
  //     fail: (res) => {
  //       callback(res);
  //     }
  //   })
  // },
  //客户兴趣统计 
  getInterest: function (data, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/user/behavior/interest/aggs`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //客户活跃度统计(折线图) 
  getTimeAggs: function (data, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/user/behavior/time/aggs`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //客户活跃度统计(进度条) 
  getinteraction: function (data, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/user/behavior/interaction/aggs`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取员工信息 (新) 
  getEmployeeInfo: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/employee/info?id=${options.id}&session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //员工所属客户统计 (新)
  getCustomerStatistics: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/customer_employee/statistics?session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取员工客户列表 (新)
  getCustomerList: function (data, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/customer_employee/list?session_id=${session_id}`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取企业客户列表 
  getBusinessCustomer: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/customer_employee/business_customer?session_id=${session_id}`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //员工客户详情 (新)
  getCustomerInfo: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/customer_employee/info?id=${options.id}&session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //企业客户详情 
  getBusinessCustomerInfo: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/customer_employee/business_customer_info?id=${options.id}&taskId=${options.taskId}&session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //客户信息编辑 (新)
  editCustomerInfo: function (options, callback) {
    callback = callback || function () { };
    let session_id = getApp().globalData.userInfo.session_id
    request.post({
      url: `${config.apiHost}/customer_employee/update?session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //客户来源 
  customerSource: function (options, callback) {
    callback = callback || function () { };
    let session_id = getApp().globalData.userInfo.session_id
    request.post({
      url: `${config.apiHost}/relationship/query/sourcePath?session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取formId 
  getFormId: function (data, callback) {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/wx/form/id/save`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 任务列表
  rankingList: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/manuscript/my/job`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 员工查看客户参与任务 
  getCustomerTask: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/manuscript/customer/task/list?secret_key=${config.secretKey}`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 添加客户备注
  addRemarks: function (data, callback) {
    callback = callback || function () { };
    let session_id = getApp().globalData.userInfo.session_id
    request.post({
      url: `${config.apiHost}/customer_remark/create?session_id=${session_id}`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 客户备注列表
  remarksList: function (data, callback) {
    callback = callback || function () { };
    let session_id = getApp().globalData.userInfo.session_id
    request.post({
      url: `${config.apiHost}/customer_remark/list?session_id=${session_id}`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 员工列表 (新) 
  getEmployeeList: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/employee/api_list?session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 获取转发唯一标识
  getforwardKey: (options, callback) => {
    var self = this;
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/relationship/query/forwardKey`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 用户行为采集
  behaviorRecord: (options, callback) => {
    var self = this;
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/relationship/behavior/gather`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //  获取员工面板统计
  employeeDashboard: (options, callback) => {
    var self = this;
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/dashboard/employee/summary`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //  获取boss面板统计
  bossDashboard: (options, callback) => {
    var self = this;
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/dashboard/boss/summary`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 修改微信推送客户阅读数
  readManuscript: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/manuscript_push/read_manuscript?session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 插件数据tab列表
  plugTabList: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/manuscript/plugin/name?session_id=${session_id}&taskId=${options.taskId}&source=1`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 获取中奖记录
  drawprizeLog: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/activity/plugin/drawprize/list?relationId=${options.relationId}&pageIndex=${options.pageIndex}&pageSize=${options.pageSize}&rootUserId=${options.rootUserId}&session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 插件数据商品列表
  plugUnitGoodsList: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/dashboard/plugins/goods/list?session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 插件数据商品概况
  plugUnitGoodsSummary: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/dashboard/plugins/goods/summary?session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 插件数据模块统计概况
  pluginStatistical: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/activity/plugin/statistical/data?taskId=${options.taskId}&businessId=${options.businessId}&type=${options.type}&session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 插件数据模块红包列表
  redRedpacketlist: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/award/redpacket/open/list?taskId=${options.taskId}&keyword=${options.keyword}&pageIndex=${options.pageIndex}&pageSize=${options.pageSize}&session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 插件数据模块 投票列表
  voteList: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/activity/plugin/vote/content/list?relationId=${options.relationId}&rootUserId=${options.rootUserId}&session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 插件数据 报名
  //获取表单列表
  fromLableList: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/activity/plugin/form/name/list?relationId=${options.relationId}&session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 获取报名列表
  getFormContent: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/activity/plugin/form/content/list?relationId=${options.id}&controlId=${options.controlId}&rootUserId=${options.rootUserId}&pageSize=${options.pageSize}&pageIndex=${options.pageIndex}&session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 任务数据   -> 获取指定任务或商家的区域统计
  regionList: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/dashboard/region/list?session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 任务数据   -> 获取指定任务或商家的男女比例统计
  sexList: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/dashboard/sex/list?session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 任务数据  -> 获取任务或员工浏览时间分布
  browseTimespan: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/dashboard/browse/timespan?session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 任务数据  -> 客户列表简版(员工)
  simpleListData: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/customer_employee/simpleList?rootUserId=${options.rootUserId}&fromId=${options.fromId}&businessId=${options.businessId}&session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 任务数据  -> 客户列表简版（boss）
  getCustomerBusinessList: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/customer_business/listByFromId?from_id=${options.from_id}&businessId=${options.businessId}&ser_user_id=${options.ser_user_id}&session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 任务数据  -> 完成员工列表
  getEmployeeListData: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/award/employee/list?taskId=${options.taskId}&finishStatus=${options.finishStatus}&session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 任务数据  -> 人脉图
  taskRelationImage: (options, callback) => {
    var self = this;
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/relationship/query/taskRelation/image?session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  }, 
  // 任务数据  -> 获取任务统计数据 (漏斗图)
  getIndicatorsCont: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/analysis/indicators?businessId=${options.businessId}&taskId=${options.taskId}&employeeId=${options.employeeId}&session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 获取预约设置项
  getAppointmentConfig: function (options, callback) {
    let session_id = getApp().globalData.userInfo.session_id
    request.get({
      url: `${config.apiHost}/activity/plugin/getAppointmentByRelationId?relationId=${options.relationId}&session_id=${session_id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 用户提交表单
  formSubmit: function () {
    let session_id = getApp().globalData.userInfo.session_id
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/activity/plugin/from/content?session_id=${session_id}`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        if (data.status != 0) {
          return callback(data);
        }
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  }
} 