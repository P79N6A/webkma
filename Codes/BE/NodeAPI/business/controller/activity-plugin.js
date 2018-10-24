'use strict';

let mscore = require("mscore"),
	Exception = mscore.Exception,
	activityPluginBiz = global.require('./business/biz/activity-plugin'),
	Validator = mscore.Validator

class ctrl {
	static async saveSetting(params) {
		if (!params) {
			throw new exception('参数不能为空')
		}

		let rules = {
			'relationId': 'string|required',
			'controlId': 'string|required',
			'activePluginType': 'integer|required|between:1,5',
			'prizes': "array|required",
			'prizes.*.optionName': "string|required",
			'prizes.*.prizeName': "string|required",
			'prizes.*.amount': "integer|required|min:1",
			'prizes.*.rate': "numeric|required|min:0.01|max:100.00",
			'drawTime': 'integer|required|min:1',
			'winTime': 'integer|required|min:1',
			'intervalTime': 'integer|required|min:1',
			'intervalTimeType': 'integer|required|between:1,3',
			'actStartTime': 'date|required',
			'actEndTime': 'date|required',
			'fromSetting': 'string|required'
		}

		let v = new Validator(params, rules, []);
		if (v.fails()) return Promise.reject(Exception.BusinessException(v.firstError(), null, 400));

		return await activityPluginBiz.saveSetting(params)
	}

	static async drawPrize(params) {
		let rules = {
			'relationId': 'string|required',
			'controlId': 'string|required',
			'userUuid': 'string|required'
		}

		let v = new Validator(params, rules, []);
		if (v.fails()) return Promise.reject(Exception.BusinessException(v.firstError(), null, 400));
		return await activityPluginBiz.drawPrize(params)
	}

	static async getDrawPrizeDataList(params) {
        return await activityPluginBiz.getDrawPrizeDataList(params);
    }
}

module.exports = ctrl;