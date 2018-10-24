const router = require('koa-router')(),
    mscore = require('mscore'),
    dataFormat = mscore.data,
    Exception = mscore.Exception,
    Validator = mscore.Validator;
let
    userCtrl = global.require("./business/controller/user"),
    businessCtrl = global.require('./business/controller/business'),
    employeeCtrl = global.require("./business/controller/employee"),
    microservice = require('../utils/microservice');

router.prefix('/user')

// 登录验证()
router.all('*', async (ctx, next) => {
    if (ctx.method == 'GET') {
        ctx.query.userId = ctx.user.userUuid
        ctx.query.sessionId = ctx.session_id
    } else if (ctx.method == 'POST') {
        ctx.request.body.userId = ctx.user.userUuid
        ctx.request.body.sessionId = ctx.session_id
    }
    await next();
})


/**
 * @api {post} /user/bind/phone 绑定手机号
 * @apiDescription Author：斗高甲
 * @apiName 绑定手机号
 * @apiGroup user
 *
 * @apiParam {String} phone 手机号
 * @apiParam {String} code 短信验证码
 * 
 * @apiHeader {String} session_id 用户登录的session_id
 * @apiHeader {String} secret_key 商户标识
 * 
 *  
 *@apiParamExample {json} 请求参数:
 *  {
 *      phone:""
 *      code:""
 *      businessId: ''
 *  }
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": ''    //id  
 *  }
 */
router.post('/bind/phone', async (ctx, next) => {
    ctx.body = dataFormat.success(await userCtrl.bindPhone(ctx.request.body))
})

/**
 * @api {post} /user/unbind/phone 解除绑定手机号
 * @apiDescription Author：斗高甲
 * @apiName 解除绑定手机号
 * @apiGroup user
 *
 * @apiParam {String} phone 手机号
 * @apiParam {String} code 短信验证码
 * 
 * @apiHeader {String} session_id 用户登录的session_id
 * 
 *  
 *@apiParamExample {json} 请求参数:
 *  {
 *      phone:""
 *      code:""
 *      businessId: ''
 *  }
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": '更新成功'      
 *  }
 */
router.post('/unbind/phone', async (ctx, next) => {
    ctx.body = dataFormat.success(await userCtrl.unbindPhone(ctx.request.body))
})


/**
 * @api {get} /user/bind/info 查询用户绑定情况
 * @apiDescription Author：斗高甲
 * @apiName 查询用户绑定情况
 * @apiGroup user
 *
 * 
 * @apiHeader {String} session_id 用户登录的session_id
 * 
 *  
 *@apiParamExample {json} 请求参数:
 *  
 * ?businessId=
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          state:1          //员工状态 0启用，1禁用或者不是员工
 *          businessState:0  //商家状态 0启用，1禁用
 *          employeeId:''    //员工id，如果state=0时才有
 *      }      
 *  }
 */
router.get('/bind/info', async (ctx, next) => {
    ctx.body = dataFormat.success(await userCtrl.search(ctx.query))
})


/**
 * @api {get} /user/infomerge 获取员工信息(包括商家和推广数据)
 * @apiName 获取员工信息
 * @apiDescription Author: 斗高甲
 * @apiGroup user
 *
 * @apiParam {String} employeeId 员工Id, 
 * 
 *  
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          "id": "",                       //员工id
 *          "businessId": "",               //商家id
 *          "name": "一一一一",              //员工名称
 *          "phone": "18212345666",         //员工电话
 *          "state": 0,                     //员工状态
 *          "delete": 0,                    
 *          "createTime": "",               //员工创建时间
 *          "businessName": "不要删",        //商家名称
 *          "businessCover": null,          //商家封面
 *          "businessLogo": null,           //商家logo 
 *          "totalShare": 0,                // 累计分享
 *          "totalVisitor": 0,              // 累计访客
 *          "totalAccess": 0,               // 累计浏览
 *      }
 *  }
 */
router.get('/infomerge', async (ctx, next) => {
    let rules = {
        employeeId: { attrName: '员工id', rule: 'required|string' }
    }
    v = new Validator(ctx.query, rules, []);
    if (v.fails()) return Promise.reject(Exception.BusinessException(v.firstError()));
    ctx.body = dataFormat.success(await employeeCtrl.getInfo(ctx.query));
})



module.exports = router