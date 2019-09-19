const
  config = require('../config.js'),
  request = require('../utils/request.js');

module.exports = {
  // 保存公众号文章
  saveArtical: (options, callback) => {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/artical/recommand/save`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //文章列表
  articalList: (options, callback) => {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/artical/recommand/search`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //文章详情
  articalDetail: (options, callback) => {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/artical/recommand/details?id=${options.id}`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 更新分享时间
  updateArtical: (options, callback) => {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}/artical/recommand/update/share`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取音频地址
  getAudioUrl: (options, callback) => {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/artical/recommand/audio?key=${options.key}&tag=${options.tag}`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取视频地址
  getVideoUrl: (options, callback) => {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/artical/recommand/video?vid=${options.vid}`,
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