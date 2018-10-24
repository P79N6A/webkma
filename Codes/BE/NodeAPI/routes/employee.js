const
    router = require('koa-router')(),
    mscore = require('mscore'),
    dataFormat = mscore.data,
    Exception = mscore.Exception,
    Validator = mscore.Validator;

let employeeCtrl = global.require("./business/controller/employee"),
    businessCtrl = global.require('./business/controller/business');

router.prefix('/employee')

// 登录验证()
router.all('*', async (ctx, next) => {
    if (!!ctx.user.userUuid)
        ctx.user.businessInfo = await businessCtrl.getBusinessInfoFormRedis({ userId: ctx.user.userUuid });
    else
        return Promise.reject(new Error('headers session_id is not null'));
    await next();
})

/**
 * @api {get} /employee/info/:id 获取员工信息
 * @apiName 获取员工信息(get)
 * @apiDescription Author: 高阳
 * @apiGroup Employee
 *
 *  * @apiParam {String} id 员工id
 * 
 * @apiParamExample {url传参} 请求参数:
 * 
 * /employee/info/83d6eb90-7dd0-11e8-a324-dd005ee5607f
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *    "status": 0,
 *    "message": " Interface response successful ",
 *    "data": [
 *      {
 *        "id": "7fd963f0-7ab6-11e8-b60f-a1c6a551b9bd",
 *        "businessId": "f3da6960-7a80-11e8-9e23-83b577ed5c79",
 *        "name": "擦事发地点", // 员工姓名
 *        "phone": "13222222222", // 电话
 *        "state": 1, // 启用禁用
 *        "delete": 0,
 *        "createTime": "2018-06-28 17:34:48"
 *      }
 *    ]
 *  }
 */
router.get('/info/:id', async (ctx, next) => {
    let rules = {
        id: { attrName: '员工ID', rule: 'required|string' }
    }
    v = new Validator(ctx.params, rules, []);
    if (v.fails()) return Promise.reject(v.firstError());
    ctx.body = dataFormat.success(await employeeCtrl.get(ctx.params));
})

/**
 * @api {POST} /employee/search 员工列表
 * @apiName 员工列表(POST)
 * @apiDescription Author: 高阳
 * @apiGroup Employee
 *
 * @apiParam {int} pageIndex 起始页
 * @apiParam {int} pageSize 每页数据显示条数
 * @apiParam {int} keyWords 关键词
 * @apiParam {int} state 状态 0正常 1禁用 
 * @apiParam {Array} [orderBy] 排序规则，支持的排序项：[{'totalShare': 'desc'},{'totalAccess': 'asc'},{'totalVisitor': 'desc'},{'createTime': 'desc'}] 默认按照 createTime 降序排列
 * @apiParam {String} [manuscriptId] 模板Id(查询员工分派情况)
 * 
 * @apiParamExample {url} 请求参数:
 *    {
 *        "pageIndex":1,
 *        "pageSize":2,
 *        "manuscriptId":"11001180719000000004", // 活动列表下,需要传
 *        "orderBy":[{"totalShare":"asc"}]
 *    }
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 * {
 *   "status": 0,
 *   "message": " Interface response successful ",
 *   "data": {
 *     "total": 4,
 *     "list": [
 *       {
 *         "id": "7fd963f0-7ab6-11e8-b60f-a1c6a551b9bd", // 员工id 
 *         "businessId": "f3da6960-7a80-11e8-9e23-83b577ed5c79", // 商铺id
 *         "name": "擦事发地点", // 名字
 *         "phone": "13222222222", // 电话
 *         "userFace": "", // 用户头像
 *         "state": 1, // 启用禁用状态
 *         "delete": 0,
 *         "createTime": "2018-06-28 17:34:48", // 创建时间
 *         "totalShare": 0, // 累计分享
 *         "totalVisitor": 0,// 累计访客
 *         "totalAccess": 0, // 累计浏览
 *         "distribution":0 // 0未分派 1已分派
 *       }
 *     ]
 *   }
 * }
 */
router.post('/search', async (ctx, next) => {
    let rules = {
        keyWords: { attrName: '关键词', rule: 'string|regex:^[\\u4e00-\\u9fa5a-zA-Z0-9]+$' },
        pageIndex: { attrName: '起始页', rule: 'required|integer' },
        pageSize: { attrName: '每页显示条数', rule: 'required|integer' }
    }
    v = new Validator(ctx.request.body, rules, []);
    if (v.fails()) return Promise.reject(Exception.BusinessException(v.firstError()));
    ctx.body = dataFormat.success(await employeeCtrl.search(ctx.user, ctx.request.body));
})

/**
 * @api {post} /employee/create 新增或修改
 * @apiName 新增或修改员工信息(post)
 * @apiDescription Author: 高阳
 * @apiGroup Employee
 *
 * @apiParam {String} name 员工姓名
 * @apiParam {String} phone 员工手机号
 * @apiParam {int} state 员工状态 0正常 1禁用 
 * @apiParam {int} [id] 员工id:修改的时候必传
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id:""
 *      name: 'llalalalalla',
 *      phone:'13000000000',
 *      state:0
 *  }
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          ...
 *      }
 *  }
 */
router.post('/create', async (ctx, next) => {
    let rules = {
        name: { attrName: '员工姓名', rule: 'required|string|between:2,10|regex:^[\\u4e00-\\u9fa5a-zA-Z]+$' },
        phone: { attrName: '手机号', rule: 'required|regex:/^\\d{11}$/' },
        state: { attrName: '状态', rule: 'required|boolean' }
    }
    v = new Validator(ctx.request.body, rules, []);
    if (v.fails()) return Promise.reject(Exception.BusinessException(v.firstError()));
    ctx.body = dataFormat.success(await employeeCtrl.create(ctx.user, ctx.request.body));
})

/**
 * @api {put} /employee/modify 批量修改员工信息
 * @apiName 批量修改员工信息(put)
 * @apiDescription Author: 高阳
 * @apiGroup Employee
 *
 * @apiParam {Array} ids 员工id字符串数组
 * @apiParam {String} field 字符串 state (修改状态)
 * @apiParam {String} value 值 0,1 // 0正常 1禁用 
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      ids: ['44a99d30-7c29-11e8-b0ce-99eb2b5dabd5','44a99d30-7c29-11e8-b0ce-99eb2b5dabd5'],
 *      field:'state',
 *      value:1
 *  }
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          ...
 *      }
 *  }
 */
router.put('/modify', async (ctx, next) => {
    let rules = {
        ids: { attrName: '员工IDS', rule: 'required|array' },
        field: { attrName: '属性', rule: 'required|string' },
        value: { attrName: '值', rule: 'required|boolean' }
    }
    v = new Validator(ctx.request.body, rules, []);
    if (v.fails()) return Promise.reject(Exception.BusinessException(v.firstError()));
    ctx.body = dataFormat.success(await employeeCtrl.modify(ctx.request.body));
})

/**
 * @api {post} /employee/delete 员工删除
 * @apiName 员工删除(post)
 * @apiDescription Author: 高阳
 * @apiGroup Employee
 *
 * @apiParam {Array} ids 员工id字符串数组
 * 
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      ids: ['44a99d30-7c29-11e8-b0ce-99eb2b5dabd5','44a99d30-7c29-11e8-b0ce-99eb2b5dabd5']
 *  }
 *  
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          ...
 *      }
 *  }
 */
router.post('/delete', async (ctx, next) => {
    let rules = {
        ids: { attrName: '员工IDS', rule: 'required|array' }
    }
    v = new Validator(ctx.request.body, rules, []);
    if (v.fails()) return Promise.reject(Exception.BusinessException(v.firstError()));
    ctx.body = dataFormat.success(await employeeCtrl.delete(ctx.request.body));
})

/**
 * @api {post} /employee/distribute 员工分派
 * @apiName 员工分派-(post)
 * @apiDescription Author: 高阳
 * @apiGroup Employee
 *
 * @apiParam {String} manuscriptId 模板id
 * @apiParam {Boolean} distribution 分派状态 0为撤销, 1为分派
 * @apiParam {Boolean} [range] 分派范围 0 全部 1 指定 (range = 0时 employeeId失效)
 * @apiParam {String} employeeId 员工Id, 可单传字符串 也支持Array字符串数组
 * 
 * @apiParamExample {json} 请求参数:
 *  type1
 *  {
 *      manuscriptId: '44a99d30-7c29-11e8-b0ce-99eb2b5dabd5',
 *      distribution: 1,
 *      range: 1,
 *      employeeId: '44a99d30-7c29-11e8-b0ce-99eb2b5dabd5'
 *  }
 *  type2
 *  {
 *      manuscriptId: '44a99d30-7c29-11e8-b0ce-99eb2b5dabd5',
 *      distribution: 1,
 *      range: 1,
 *      employeeId: ['44a99d30-7c29-11e8-b0ce-99eb2b5dabd5']
 *  }
 *  
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          ...
 *      }
 *  }
 */
router.post('/distribute', async (ctx, next) => {
    let rules = {
        manuscriptId: { attrName: '模板id', rule: 'required|string' },
        // employeeId: { attrName: '员工id', rule: 'required' },
        distribution: { attrName: '分派状态', rule: 'required:boolean' }
    }
    v = new Validator(ctx.request.body, rules, []);
    if (v.fails()) return Promise.reject(Exception.BusinessException(v.firstError()));
    ctx.body = dataFormat.success(await employeeCtrl.distribute(ctx.user, ctx.request.body));
})






module.exports = router