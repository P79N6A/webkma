const
	router = require('koa-router')(),
	dataFormat = require('mscore').data

let activityPluginCtrl = global.require("./business/controller/activity-plugin")

router.prefix('/activity/plugin')

/**
 * @api {post} /activity/plugin/savesetting 保存活动插件设置
 * @apiDescription Author: 帅俊
 * @apiName 保存活动插件设置
 * @apiGroup ActivityPlugin
 *
 * @apiParam {String} relationId 模板Id
 * @apiParam {String} controlId 活动插件Id
 * @apiParam {Int} activePluginType 活动插件类型
 * @apiParam {Object} prizes 奖项设置
 * @apiParam {String} prizes.optionName 奖项名称
 * @apiParam {String} prizes.prizeName 奖品名称
 * @apiParam {Int} prizes.amount 奖品数量
 * @apiParam {Float} prizes.rate 获奖概率，0到100的小数
 * @apiParam {Int} drawTime 每人抽奖次数
 * @apiParam {Int} winTime 每人可中奖次数
 * @apiParam {Int} intervalTime 每人中奖间隔
 * @apiParam {Int} intervalTimeType 每人中奖间隔类型(1 分钟,2 小时,3 天)
 * @apiParam {Date} actStartTime 活动开始时间
 * @apiParam {Date} actEndTime 活动结束时间
 * @apiParam {String} fromSetting 表单设置(JSON)
 * 
 * @apiParamExample {json} 请求参数:
{
	"relationId": "10025100000001467",
	"controlId": "1111",
	"activePluginType": 3,
	"prizes": [{
		"optionName": "奖项名称(1)",
		"prizeName": "奖品A",
		"amount": 999,
		"rate": "30"
	}, {
		"optionName": "奖项名称(2)",
		"prizeName": "奖品B",
		"amount": 999,
		"rate": "30"
	}, {
		"optionName": "奖项名称(3)",
		"prizeName": "奖品C",
		"amount": 999,
		"rate": "30"
	}],
	"drawTime": 5,
	"winTime": 1,
	"intervalTime": 1,
	"intervalTimeType": "3",
	"actStartTime": "2017-09-01 00:00:00",
	"actEndTime": "2022-01-01 00:00:00",
	"fromSetting": ""
}
 *   
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
* {
*     "status": 0,
*     "message": " Interface response successful ",
*     "data": {
*         "msg": "设置成功"
*     }
* }
 */
router.post('/savesetting/', async (ctx, next) => {
	ctx.body = dataFormat.success(await activityPluginCtrl.saveSetting(ctx.request.body))
})

router.post('/drawprize/', async (ctx, next) => {
	let p = ctx.request.body || {}
	p.userUuid = ctx.user.userUuid
	p.userNickname = ctx.user.userNickname
	ctx.body = dataFormat.success(await activityPluginCtrl.drawPrize(p))
})

/**
 * @api {get} /activity/plugin/drawprizedata?pageIndex=0&pageSize=10 获取抽奖记录
 * @apiDescription Author: 帅俊
 * @apiName 获取抽奖记录
 * @apiGroup ActivityPlugin
 *
 * @apiParam {String} relationId 模板id
 * @apiParam {String} keyword 关键字
 * 
 *   
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
{
    "status": 0,
    "message": " Interface response successful ",
    "data": {
        "list": [
            {
                "id": 10010,
                "relationId": "11001180719000000015",
                "pluginId": "211cde3c-8e6b-11e8-9a6d-fcaa14c7f139",
                "userUuid": "69aa978f-5f13-46b9-ba20-020904fecf3d",
                "createtime": "2018-07-23T11:27:21.000Z",
                "state": 0,
                "prizeName": null,
                "prizeNo": null,
                "exchangeState": 0,
                "exchangetime": null,
                "userNickname": "昵称",
                "phone": ""
            },
            {
                "id": 10009,
                "relationId": "11001180719000000015",
                "pluginId": "211cde3c-8e6b-11e8-9a6d-fcaa14c7f139",
                "userUuid": "69aa978f-5f13-46b9-ba20-020904fecf3d",
                "createtime": "2018-07-23T11:27:20.000Z",
                "state": 0,
                "prizeName": null,
                "prizeNo": null,
                "exchangeState": 0,
                "exchangetime": null,
                "userNickname": "昵称",
                "phone": ""
            }
        ]
    }
}
 */
router.get('/drawprizedata/', async (ctx, next) => {
	let p = ctx.request.query || {}
	p.userUuid = ctx.user.userUuid
	ctx.body = dataFormat.success(await activityPluginCtrl.getDrawPrizeDataList(p))
})

module.exports = router