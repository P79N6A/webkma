'use strict';

let
	mscore = require("mscore"),
	dao = mscore.dao,
	redis = mscore.redis,
	Exception = mscore.Exception,
	activityPluginDao = global.require('./business/dao/activity-plugin'),
	manuscriptDao = global.require('./business/dao/manuscript'),
	locker = mscore.locker,
	lotteryDraw = global.require("./business/biz/lottery-draw"),
	microservice = global.require("./utils/microservice"),
	Decimal = require('decimal.js'),
	_ = require("lodash"),
	cryptoRandomString = require('crypto-random-string')

class activityPluginBiz {
	static async saveDrawprizedata(params) {
		return await dao.manageConnection(async (connection) => {
			if ((await activityPluginDao.isExists(connection, { pluginId: params.pluginId, type: 2 })) == false)
				return Promise.reject(new Exception('抽奖插件不存在', null, 400));

			// return await activityPluginDao.saveDrawprizedata(connection, {
			// 	type: params.type,
			// 	skip: parseInt(params.skip),
			// 	count: parseInt(params.count),
			// 	search: params.search
			// });
		});
	}

	static async saveSetting(params) {
		return await locker.lock({ key: `lock:saveSetting_${params.pluginId}`, ttl: 3000 }, async () => {
			var _totalRate = _.reduce(params.prizes, (sum, prize) => +Decimal.add(sum, prize.rate).toFixed(2), 0);
			if (_totalRate > 100) {
				return Promise.reject(new Exception('总概率超过100', null, 400))
			}

			let optionNameSet = new Set();
			let prizeNameSet = new Set();
			for (var prize of params.prizes) {
				if (optionNameSet.has(prize.optionName))
					return Promise.reject(new Exception('奖项重复', null, 400));

				if (prizeNameSet.has(prize.prizeName))
					return Promise.reject(new Exception('奖品重复', null, 400));

				optionNameSet.add(prize.optionName)
				prizeNameSet.add(prize.prizeName)
			}

			return new Promise(async (resolve, reject) => {
				try {
					let result = await dao.manageTransactionConnection(async (connection) => {
						if ((await manuscriptDao.isExists(connection, params.relationId)) == false)
							return Promise.reject(new Exception('模板不存在', null, 400));

						let pluginId = await activityPluginDao.savePlugin(connection, params);
						await activityPluginDao.deletePrizeSetting(connection, pluginId)

						let promises = params.prizes.map(prize => activityPluginDao.savePrizeSetting(connection, {
							pluginId: pluginId,
							optionName: prize.optionName,
							prizeName: prize.prizeName,
							amount: prize.amount,
							rate: prize.rate
						}))

						promises.push(activityPluginDao.saveCollect(connection, { pluginId: pluginId, collect_json: params.fromSetting }))
						promises.push(activityPluginDao.savePrizedrawSetting(connection, {
							pluginId: pluginId,
							drawtime: params.drawTime,
							wintime: params.winTime,
							intervaltime: params.intervalTime,
							intervaltime_type: params.intervalTimeType
						}))

						await Promise.all(promises);

						return Promise.resolve({ msg: "设置成功" })
					});

					// 返回数据
					resolve(result)
				} catch (err) {
					reject(err)
				}
			})
		})
	}

	static async drawPrize(params) {
		const resultStruct = {
			// 抽奖结果 -1:异常 0:未中奖 1:中奖
			drawStatus: 1,
			// 错误消息:drawStatus=-1
			errorMsg: '',
			// 未中奖原因:drawStatus=0
			// 1:未中奖(算法)
			// 2:用户抽奖次数已经用完
			// 3:用户中奖次数已经用完
			// 4:中奖时间间隔限制中
			// 5:奖品数量不足
			rType: 1,
			// 中奖奖品Id:drawStatus=1
			prizeId: 1,
			// 中奖奖项名称Id:drawStatus=1
			optionName: '',
			// 中奖奖品名称Id:drawStatus=1
			prizeName: '',
			// 兑奖码
			prizeNo: ''
		}
		return await locker.lock({ key: `lock:drawPrize_${params.userUuid}`, ttl: 6000 }, async () => {
			return new Promise(async (resolve, reject) => {
				try {
					let result = await dao.manageTransactionConnection(async (connection) => {

						let drawprizeConfig = await activityPluginDao.getDrawprizeConfig(connection, params);
						let drawprizeStruct = {
							plugin: {
								// 抽奖插件Id
								pluginId: drawprizeConfig.drawPrizeSetting.plugin_id,
								// 每人抽奖次数限制
								Limit_NOFD: drawprizeConfig.drawPrizeSetting.drawtime,
								// 每人中奖次数限制
								Limit_NOFW: drawprizeConfig.drawPrizeSetting.wintime,
								// 每人中奖间隔时间
								intervalTime: drawprizeConfig.drawPrizeSetting.intervaltime,
								// 间隔时间单位，1：分钟；2：小时；3：天
								intervalTimeType: drawprizeConfig.drawPrizeSetting.intervaltime_type,
								prizeSetting: {}
							},
							user: {
								// 第三方用户Id
								userId: params.userUuid,
								// 抽奖次数
								NOFD: drawprizeConfig.drawPrizeData.NOFD,
								// 中奖次数
								NOFW: drawprizeConfig.drawPrizeData.NOFW,
								// 最后一次中奖时间
								LWT: drawprizeConfig.drawPrizeData.LWT
							}
						}

						if (drawprizeConfig.prizeSetting == void 0 || drawprizeConfig.prizeSetting == null || drawprizeConfig.prizeSetting.length == 0)
							return Promise.resolve({
								// 抽奖结果 -1:异常 0:未中奖 1:中奖
								drawStatus: 0,
								// 未中奖原因:drawStatus=0
								// 1:未中奖(算法)
								// 2:用户抽奖次数已经用完
								// 3:用户中奖次数已经用完
								// 4:中奖时间间隔限制中
								// 5:奖品数量不足
								rType: 5
							})

						for (var prize of drawprizeConfig.prizeSetting) {
							drawprizeStruct.plugin.prizeSetting[prize.id] = {
								// 奖品Id
								id: prize.id,
								// 奖品数量
								amount: prize.amount,
								// 中奖概率
								odds: prize.rate
							}
						}

						let drawResult = lotteryDraw.lotteryDraw(drawprizeStruct)
						if (drawResult.status == -1) {
							return Promise.resolve(drawResult);
						}

						let prize_no = null
						if (drawResult.drawStatus == 1) {
							// 生成中奖码
							prize_no = cryptoRandomString(16)
						}

						let saveResult = await activityPluginDao.saveDrawPrizeResult(connection, {
							drawStatus: drawResult.drawStatus,
							rType: drawResult.rType,
							relationId: params.relationId,
							userUuid: params.userUuid,
							userNickname: params.userNickname,
							pluginId: drawprizeConfig.drawPrizeSetting.plugin_id,
							prize_no: prize_no,
							prizeId: drawResult.prizeId
						})

						if (saveResult.drawStatus == -1) {
							return Promise.resolve({
								// 抽奖结果 -1:异常 0:未中奖 1:中奖
								drawStatus: -1,
								// 错误消息:drawStatus=-1
								errorMsg: saveResult.msg
							});
						}

						if (saveResult.drawStatus == 0) {
							return Promise.resolve({
								// 抽奖结果 -1:异常 0:未中奖 1:中奖
								drawStatus: 0,
								rType: saveResult.rType
							});
						} else {
							return Promise.resolve({
								// 抽奖结果 -1:异常 0:未中奖 1:中奖
								drawStatus: 1,
								// 中奖奖品Id:drawStatus=1
								prizeId: saveResult.prizeId,
								// 中奖奖项名称Id:drawStatus=1
								optionName: saveResult.optionName,
								// 中奖奖品名称Id:drawStatus=1
								prizeName: saveResult.prizeName,
								// 兑奖码
								prizeNo: saveResult.prizeNo
							})
						}
					});

					// 返回数据
					resolve(result)
				} catch (err) {
					reject(err)
				}
			})
		})
	}

	// 获取活动列表
	static async getDrawPrizeDataList(params) {
		return await dao.manageConnection(async (connection) => {
			let query = Object.assign({}, params);
			let date = await activityPluginDao.getDrawPrizeDataList(connection, query);
			return Promise.resolve(date)
		});
	}
}

module.exports = activityPluginBiz