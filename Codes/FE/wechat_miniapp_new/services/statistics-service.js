const
  config = require('../config.js'),
  request = require('../utils/request.js');

module.exports = {
  //获取用户雷达信息
  behaviorList: (options, callback) => {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/user/behavior/target/search`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 用户行为埋点
  behaviorRecord: (options, callback) => {
    var self = this;
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/user/behavior/burying/point`,
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
  //统计分析服务 - 根据(所属模块,类型)聚合查询
  aggsTypeByBelongModule: (options, callback) => {
    callback = callback || function() {};
    options.secret_key = config.secretKey;
    request.post({
      url: `${config.apiGateway}api/analysis_service/v1/extension/aggsTypeByBelongModule?client_type=weapp`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //统计分析服务 - 根据日期聚合分析
  aggsTime: (options, callback) => {
    callback = callback || function() {};
    options.secret_key = config.secretKey;
    request.post({
      url: `${config.apiGateway}api/analysis_service/v1/analysis/aggsTime`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取待办事项
  getTodoList: (options, callback) => {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/user/todo`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //地域分布
  regionStatistics: (options, callback) => {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/dashboard/region/list`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //订单分析
  orderStatistics: (options, callback) => {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/dashboard/order/summary`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
}