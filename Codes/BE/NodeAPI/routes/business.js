const router = require('koa-router')(),
    data = require('mscore').data;

let
    businessCtrl = global.require("./business/controller/business");

router.prefix('/business')

router.all('*', async (ctx, next) => {
    ctx.body = data.success(await next());
})

/**
 * @api {get} /business/getbusiness 获取商家/设计师
 * @apiName 获取商家/设计师(get)
 * @apiGroup business
 *
 * @apiParam {String} businessId  商家/设计师ID
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": [
 *       {
 *           "businessId": "61903180-7840-11e8-b344-cd3b47203337", 商家编号
 *           "businessName": "搞事", 商家名称
 *           "businessPhone": "18981841725",商家电话/账号,
 *           "businessCover": "封面.jpg", // 商家封面
 *           "businessLogo": "商标.jpg", // 商家商标
 *           "createtime": "2018-06-25T06:22:43.000Z", 创建时间
 *           "state": 0,状态 1禁用 0正常
 *           "businessType": 1,商家类型 1商家 2设计师
 *           "staffCount": 10,员工数
 *           "staffCreated": 1,员工数
 *           //"items": [
 *               //"123",
 *               //"12312311",
 *               //"123123111",
 *               //"21312"
 *           //], 专题ID
 *           "smsCount": 10,短信数
 *           "smsUsed": 10, 短信已使用数量
 *           "extensionCount": 10 推广数
 *       }
 *   ]
 *  }
 */
router.get('/getbusiness', async (ctx, next) => {
    var params = ctx.query;
    params.sessionId = ctx.header.sessionid;
    return await businessCtrl.getBusiness(params);

})

/**
 * @api {post} /business/logonbusiness B端用户登录
 * @apiName B端用户登录(post)
 * @apiGroup business
 *
 * @apiParam {String} user_account  用户账号
 * @apiParam {String} user_password  密码
 * @apiParam {String} [user_type]  登录类型 1商家 2设计师
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
    "status": 0,
    "message": " Interface response successful ",
    "data": {
        "user_uuid": "9be870c5-7be8-410d-a748-ff68acb1324f",
        "session_id"："5a5a6919-2633-41b0-93ee-1b5fdf1b8337"
        "user_nickname": null,
        "user_merchant_id": "a1d583e0-04d2-4bfe-b678-0c4f4eb4a28f",
        "user_face": null,
        "user_id": 1180628000000008,
        "user_last_login_time": 1530188502707,
        "user_login_times": 0,
        "user_reg_clienttype": 2,
        "user_reg_project_id": "KMA",
        "user_salt": "c034bbcc7a",
        "user_account": "18981841738",账号
        "user_as_answer": null,
        "user_as_question": null,
        "user_birthday": null,  
        "user_mail": null,
        "user_mobile": null,
        "user_name": null,
        "user_sex": 0,
        "businessInfo": {
            "businessId": "23db7877-4f45-4d65-a095-f36ce2e79dfa",
            "userId": "9be870c5-7be8-410d-a748-ff68acb1324f",
            "businessName": "111搞事111111", 商户名称
            "businessPhone": "18981841738",
            "businessCover": "封面.jpg", // 商家封面
            "businessLogo": "商标.jpg", // 商家商标
            "createtime": "2018-06-28T12:15:20.000Z",
            "state": 0, 状态
            "businessType": 1, 类型 1商家 2设计师
            "staffCount": 10 员工数
        }
    }
}
 */
router.post('/logonbusiness', async (ctx, next) => {
    var params = ctx.request.body;
    params.sessionId = ctx.header.sessionid;
    return await businessCtrl.logonBusiness(params);
})


/**
 * @api {post} /business/savebusiness 新增/修改商家/设计师信息
 * @apiName 新增/修改商家/设计师信息(post)
 * @apiGroup business
 *
 * @apiParam {String} businessId  商家/设计师ID 空新增 
 * @apiParam {String} businessName  商家/设计师名称
 * @apiParam {String} businessPhone  商家/设计师账号/手机号
 * @apiParam {String} businessCover  商家封面
 * @apiParam {String} businessLogo  商家商标
 * @apiParam {String} voucher  商家/设计师密码
 * @apiParam {Number} businessType  类型 1商家/2设计师
 * @apiParam {Number} staffCount 员工数量
 * @apiParam {Number} smsCount 短信数量
 * @apiParam {Array} items 分发方案 例："items":[{id:'', distribution:0},{id:'', distribution:1}]
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          OK
 *       }
 *   ]
 *  }
 */
router.post('/savebusiness', async (ctx, next) => {
    var params = ctx.request.body;
    params.sessionId = ctx.header.sessionid;
    await businessCtrl.saveBusiness(params);
    return "OK"
})

/**
 * @api {get} /business/searchbusiness 查询商家OR设计师
 * @apiName 查询商家/设计师(get)111
 * @apiGroup business
 *
 * @apiParam {String} businessType  商家/设计师 类型 1商家 2设计师  空 全部
 * @apiParam {String} businessPhone  商家/设计师账号手机号
 * @apiParam {String} businessName  商家/设计师名称
 * @apiParam {String} businesskeyword  商家/设计师查询关键词
 * @apiParam {String} [manuscriptId]  稿件/模板id 选填
 * @apiParam {Boolean} [distribution] 过滤分配情况  1 只显示已分配的， 0 只显示未分配的，不传显示所有 
 * @apiParam {Number} pageIndex  页码
 * @apiParam {Number} pageSize  页面大小
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 * {
 *   "status": 0,
 *   "message": " Interface response successful ",
 *   "data": {
 *       "total": 2,
 *       "data": [
 *           {
 *               "businessId": "057e84e0-79d6-11e8-85e7-ddeebd88932d",
 *               "userId": "1111111111", 
 *               "businessName": "ccccc",
 *               "businessPhone": "13200002652",
 *               "businessCover": "cover.jpg",
 *               "businessLogo": "商标.jpg", // 商家商标
 *               "distribution": 1, // 1已分配, 0为未分配
 *               "createtime": "2018-06-27T06:47:55.000Z",
 *               "state": 0,
 *               "businessType": 2
 *           }
 *       ]
 *   }
 *}
 */
router.get('/searchbusiness', async (ctx, next) => {
    var params = ctx.query;
    params.sessionId = ctx.header.sessionid;
    return await businessCtrl.searchBusiness(params);
})

/**
 * @api {post} /business/openbusiness 解禁商家/设计师信息
 * @apiName  解禁商家/设计师信息(post)
 * @apiGroup business
 *
 * @apiParam {String} businessId  商家/设计师ID
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *       OK
 *       }
 *  }
 */
router.post('/openbusiness', async (ctx, next) => {
    var params = ctx.request.body;
    params.sessionId = ctx.header.sessionid;
    await businessCtrl.openBusiness(params);
    return "OK"
})

/**
 * @api {post} /business/disablebusiness 禁用商家OR设计师信息
 * @apiName  禁用商家/设计师信息(post)111
 * @apiGroup business
 *
 * @apiParam {String} businessId  商家/设计师ID
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *       OK
 *       }
 *  }
 */
router.post('/disablebusiness', async (ctx, next) => {
    var params = ctx.request.body;
    params.sessionId = ctx.header.sessionid;
    await businessCtrl.disableBusiness(params);
    return "OK"
})

/**
 * @api {post} /business/saveunion 分发案例
 * @apiName 分发案例(post)
 * @apiGroup business
 *
 * @apiParam {String} businessId  商家/设计师ID
 * @apiParam {Array} items 分发方案 例："items":["123","21312","12312311","123","123123111"]
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *       OK
 *       }
 *  }
 */
router.post('/saveunion', async (ctx, next) => {
    var params = ctx.request.body;
    params.sessionId = ctx.header.sessionid;
    await businessCtrl.saveUnion(params);
    return "OK"
})

/**
 * @api {post} /business/delete 删除商户/设计师
 * @apiName  删除商户/设计师(post)
 * @apiDescription Author: 高阳
 * @apiGroup business
 *
 * @apiParam {String} businessId  商家/设计师ID
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      businessId:""
 *  }
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *       OK
 *       }
 *  }
 */
router.post('/delete', async (ctx, next) => {
    var params = ctx.request.body;
    params.sessionId = ctx.header.sessionid;
    await businessCtrl.delete(params);
    return "OK"
})

module.exports = router