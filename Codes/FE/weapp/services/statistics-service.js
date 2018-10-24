const
  config = require('../config.js'),
  request = require('../utils/request.js');

module.exports = {
  //统计分析服务 - 根据(所属模块,类型)聚合查询
  aggsTypeByBelongModule: (options, callback) => {
    callback = callback || function () { };
    options.secret_key = config.secretKey;
    request.post({
      url: `${config.apiGateway}api/analysis_service/v1/analysis/aggsTypeByBelongModule?client_type=weapp`,
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
    callback = callback || function () { };
    options.secret_key = config.secretKey;
    request.post({
      url: `${config.apiGateway}api/analysis_service/v1/analysis/aggsTime?client_type=weapp`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  }
}


