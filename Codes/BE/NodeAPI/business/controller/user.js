const
    userBiz = require('../biz/user')

class userCtrl {


    static async bindPhone(params) {
        return await userBiz.bindPhone(params)
    }

    static async unbindPhone(params) {
        return await userBiz.unbindPhone(params)
    }

    static async search(params) {
        return await userBiz.search(params)
    }

}

module.exports = userCtrl