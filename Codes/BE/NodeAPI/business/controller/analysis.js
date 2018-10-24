'use strict';

let analysisBiz = global.require('./business/biz/analysis'),
    _ = require('underscore');

class ctrl {

    /**
     * 同步所有数据
     * @param {*} params 
     */
    static async syncAnalysis(params) {
        return await analysisBiz.syncAnalysis(params)
    }

    /**
     * 同步某个店铺数据
     * @param {*} params {businessId:'', userId:''}
     */
    static async syncAnalysisBusiness(params) {
        return await analysisBiz.syncAnalysisBusiness(params)
    }
}

module.exports = ctrl;