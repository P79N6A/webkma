const statisticsService = require('../services/statistics-service.js')

module.exports = {
  // 用户行为埋点
  behaviorRecord: (options, callback) => {
    statisticsService.behaviorRecord(options, (err, res) => {
    if (res.status == 0) {
      callback(res.data)
    } else {
      utils.toast.fail({
        title: res.message
      });
    }
  })
  }
}