'use strict';

let demsysconfigBiz = global.require('./business/biz/sysconfig');

class ctrl {
    static async getConfig(params) {
        return await demsysconfigBiz.getConfig(params)
    }

    static async saveConfig(params) {
        return await demsysconfigBiz.saveConfig(params)
    }

    static async deleteConfig(params) {
        return await demsysconfigBiz.deleteConfig(params)
    }    
}

module.exports = ctrl;