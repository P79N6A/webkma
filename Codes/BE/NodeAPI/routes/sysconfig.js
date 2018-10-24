const router = require('koa-router')()

let
    sysconfigCtrl = global.require("./business/controller/sysconfig"),
    data = require('mscore').data;

router.prefix('/sysconfig')

router.all('*', async (ctx, next) => {
    try {
        var result = await next();
        ctx.body = data.success(result, "");
    } catch (err) {
        console.log(err.stack);
        ctx.body = data.error(err);
        // ctx.body = { errorCode: 500, stack: err.stack }
    }
})

/**
 * @api {get} /sysconfig/getconfig 获取配置信息
 * @apiDescription Author: 黄毅
 * @apiName 获取配置信息-(getconfig)
 * @apiGroup sysconfig
 *
 * @apiParam {String} config_id_type 配置类型补偿字段： syswx 系统微信配置
 * @apiParam {String} type 配置类型 1系统配置 
 *   
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          id:'',
 *          sys_key:'', // 键
 *          sys_value:'', // 值
 *          describe:'' // 描述
 *      }
 *  }
 */
router.get('/getconfig', async (ctx, next) => {
    var params = ctx.query;
    params.sessionId = ctx.header.sessionid;
    return await sysconfigCtrl.getConfig(params);
})


/**
 * @api {post} /sysconfig/saveconfig 保存系统配置信息
 * @apiDescription Author: 黄毅
 * @apiName 保存系统配置信息(getconfig)
 * @apiGroup sysconfig
 *
 * @apiParam {int} [id] 修改的时候传
 * @apiParam {String} sys_key 键
 * @apiParam {String} sys_value 值
 * @apiParam {String} describe 描述
 * @apiParam {String} type 配置类型 1系统配置 
 * @apiParam {String} config_id_type 配置类型补偿字段： syswx 系统微信配置
 * 
 * @apiParamExample {json} 请求参数:
 *  {id: "1001000000001", sys_key:'', sys_value:'', describe:'', type:'', config_id_type:''}
 * or
 *  [obj,obj]
 *   
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *      }
 *  }
 */
router.post('/saveconfig', async (ctx, next) => {
    var params = ctx.request.body;
    params.sessionId = ctx.header.sessionid;
    await sysconfigCtrl.saveConfig(params);
    return "OK"
})

/**
 * @api {post} /sysconfig/deleteconfig 删除配置信息
 * @apiDescription Author: 黄毅
 * @apiName 删除配置信息(getconfig)
 * @apiGroup sysconfig
 *
 * @apiParam {int} id 需放入对象里面 
 * 
 * @apiParamExample {json} 请求参数:
 *  {id: "1001000000001"}
 * or
 *  [{id: "1001000000001"},{id: "1001000000001"}]
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *      }
 *  }
 */
router.post('/deleteconfig', async (ctx, next) => {
    var params = ctx.request.body;
    params.sessionId = ctx.header.sessionid;
    await sysconfigCtrl.deleteConfig(params);
    return "OK"
})

module.exports = router