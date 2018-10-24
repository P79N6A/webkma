const
    router = require('koa-router')(),
    dataFormat = require('mscore').data;

let manuscriptCtrl = global.require("./business/controller/manuscript")

router.prefix('/manuscript')

/**
 * @api {get} /manuscript/detail?id=1001 获取稿件/模板
 * @apiDescription Author: 大龙
 * @apiName 获取稿件/模板(get)
 * @apiGroup Manuscript
 *
 * @apiParam {String} id 稿件编号
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
router.get('/detail', async (ctx, next) => {
    ctx.body = dataFormat.success(await manuscriptCtrl.get(ctx.query))
})

/**
 * @api {get} /manuscript/detail/release?id=1001 获取活动信息
 * @apiDescription Author: 高阳
 * @apiName 获取活动信息(包括活动检测, 账号检测)
 * @apiGroup Manuscript
 *
 * @apiParam {String} id 活动编号
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
 * @apiErrorExample 
 *      statusCode = 400 
 *      {  "status": 10001, "message": "活动不存在" }
 *      {  "status": 10002, "message": "活动被禁用" }
 *      {  "status": 10003, "message": "活动未开始" }
 *      {  "status": 10004, "message": "活动已过期" }
 *      {  "status": 10005, "message": "参与账号异常" }
 */
router.get('/detail/release', async (ctx, next) => {
    let query = Object.assign(ctx.query, { userId: ctx.user.userUuid });
    ctx.body = dataFormat.success(await manuscriptCtrl.getRelease(ctx.query))
})

/**
 * @api {get} /manuscript/list/draft?skip=0&count=10&search=? 获取稿件列表
 * @apiDescription Author: 大龙
 * @apiName 获取稿件列表(getlistdraft)
 * @apiGroup Manuscript
 *
 * @apiParam {String} search 模糊查询关键字
 * @apiParam {String} skip 分页：从第几条开始(默认0)
 * @apiParam {String} count 分页：获取多少条(默认1000)
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          "list": [
 *              {
 *                  "id": "11001180702000000001",               // 稿件ID
 *                  "name": "update name",                      // 名称
 *                  "description": null,                        // 描述
 *                  "cover": null,                              // 封面
 *                  "operator": "UserName",                     // 最后操作人
 *                  "operatorDate": "2018-07-02T08:05:07.000Z"  // 最后操作时间
 *              }
 *          ],
 *          "total": 12                                         // 稿件总数
 *      }
 *  }
 */
router.get('/list/draft', async (ctx, next) => {
    let query = Object.assign(ctx.query, { userId: ctx.user.userUuid });
    ctx.body = dataFormat.success(await manuscriptCtrl.getListOfDraft(query))
})

/**
 * @api {get} /manuscript/list/template?skip=0&count=10&search=? 获取模板列表
 * @apiDescription Author: 大龙
 * @apiName 获取模板列表(getlisttemplate)
 * @apiGroup Manuscript
 *
 * @apiParam {String} search 模糊查询关键字
 * @apiParam {String} pageIndex 分页：1
 * @apiParam {String} pageSize 分页：获取多少条(默认1000)
 * @apiParam {String} [range] 查询范围： 0 所有默认 1 当前用户
 * @apiParam {String} [designerId] 设计师userId(查询指定设计师的模板)
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "list": [
 *          {
 *                  "id": "1530064730409",                      // 模板ID
 *                  "name": "aaaabbbb",                         // 名称
 *                  "description": null,                        // 描述
 *                  "cover": null,                              // 封面
 *                  "useTotal": 0,                              // 使用次数
 *                  "distribution":0,                           // 分发属性 0公有 1私有
 *                  "businessTotal": 0,                         // 分发商家数
 *                  "score": 0,                                 // 评分
 *                  "operator": "UserName",                     // 最后操作人
 *                  "operatorDate": "2018-06-27T01:57:16.000Z"  // 最后操作时间
 *                  "url": 0,                                   // 访问地址
 *                  "codeUrl":""                                // 二维码图片地址
 *              }
 *          ],
 *          "total": 5                                          // 模板总数
 *      }
 *  }
 */
router.get('/list/template', async (ctx, next) => {
    let query = Object.assign(ctx.query, { userId: ctx.user.userUuid });
    ctx.body = dataFormat.success(await manuscriptCtrl.getListOfTemplate(query))
})

/**
 * @api {get} /manuscript/list/template/business?pageIndex=0&pageSize=10&businessId=? 获取模板列表(商家)
 * @apiDescription Author: 高阳
 * @apiName 获取模板列表(商家getlisttemplate)
 * @apiGroup Manuscript
 *
 * @apiParam {String} search 模糊查询关键字
 * @apiParam {String} businessId 商家id
 * @apiParam {int} templateDistribution 模板的分发属性 0为公开 1为私有
 * @apiParam {String} pageIndex 分页：1
 * @apiParam {String} pageSize 分页：获取多少条(默认1000)
 * @apiParam {String} [range] 查询范围： 0 所有默认(公有+私有) 1 当前用户(公有+分配的私有 商家端不需要传businessId)
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "list": [
 *          {
 *                  "id": "1530064730409",                      // 模板ID
 *                  "name": "aaaabbbb",                         // 名称
 *                  "description": null,                        // 描述
 *                  "cover": null,                              // 封面
 *                  "useTotal": 0,                              // 使用次数
 *                  "distribution":0,                           // 是否已经分发到该商家
 *                  "templateDistribution":0,                   // 模板:分发属性 0公有 1私有
 *                  "score": 0,                                 // 评分
 *                  "operator": "UserName",                     // 最后操作人
 *                  "operatorDate": "2018-06-27T01:57:16.000Z", // 最后操作时间
 *                  "codeUrl":""                                // 二维码图片地址
 *              }
 *          ],
 *          "total": 5                                          // 模板总数
 *      }
 *  }
 */
router.get('/list/template/business', async (ctx, next) => {
    let query = Object.assign(ctx.query, { userId: ctx.user.userUuid });
    ctx.body = dataFormat.success(await manuscriptCtrl.getListOfTemplateBusiness(query))
})

/**
 * @api {post} /manuscript/list/release?pageIndex=1&pageSize=10&search=? 获取已发布稿件列表
 * @apiDescription Author: 大龙
 * @apiName 获取已发布稿件列表(getlistrelease)
 * @apiGroup Manuscript
 * 
 * @apiParam {String} [search] 模糊查询关键字,按活动名称或公司名称搜索
 * @apiParam {String} [nameSearch] 按活动名称搜索
 * @apiParam {String} [businessId] 商家id
 * @apiParam {Array} [orderBy] 排序规则，支持的排序项：[{'totalShare': 'desc'},{'totalAccess': 'asc'},{'totalVisitor': 'desc'},{'createTime': 'desc'}] 默认按照 createTime 降序排列
 * @apiParam {String} pageIndex 分页：分页索引，从1开始
 * @apiParam {String} pageSize 分页：每页获取多少条(默认10)
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
        "status": 0,
        "message": " Interface response successful ",
        "data":{
            "total": 1,
            "list":[
                {
                "uuid": "370f3c32-0ea1-49ff-81d2-b033bcb95934",
                "id": "11001180716000000002",
                "pageStartDate": null,
                "pageEndDate": null,
                "activeStartDate": null,
                "activeEndDate": null,
                "dispatchRange": 0,
                "url": "11001180716000000002.wap.pro.kma.dev.cn",
                "type": 3,
                "name": null,
                "cover": null,
                "enable": 1,
                "createTime": "2018-07-16 15:20:56",
                "modifyTime": "2018-07-16T07:20:56.000Z",
                "businessName": "万商云集",
                "recommend": 0,
                "sourceName": null,
                "totalShare": 9999,
                "totalVisitor": 35000,
                "totalAccess": 1000000000,
                "totalJoin": 35000,
                "publishDate": "2018-07-16",
                "finished": false
                }
            ]
        }
    }
 */
router.post('/list/release', async (ctx, next) => {
    let params = Object.assign({}, ctx.query);
    params = {
        ...params,
        ...ctx.request.body
    }
    ctx.body = dataFormat.success(await manuscriptCtrl.getReleaseList(params))
})


/**
 * @api {get} /manuscript/recommend/activities?pageIndex=1&pageSize=10&search=? 获取推荐活动列表
 * @apiDescription Author: 大龙
 * @apiName 获取推荐活动列表(recommend_activities)
 * @apiGroup Manuscript
 * 
 * @apiParam {String} search 模糊查询关键字
 * @apiParam {String} pageIndex 分页：分页索引，从1开始
 * @apiParam {String} pageSize 分页：每页获取多少条(默认10)
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
        "status": 0,
        "message": " Interface response successful ",
        "data":{
            "total": 1,
            "list":[
                {
                    "uuid": "4bccbe51-3953-411d-8f42-a02bc252dca5",
                    "id": "11001180716000000005",
                    "activeStartDate": null,
                    "activeEndDate": null,
                    "url": "11001180716000000005.wap.pro.kma.dev.cn",
                    "type": 3,
                    "name": "iry",
                    "cover": "http://bos-kcmsdesign.iwanqi.cn/00000000-0000-0000-0000-000000000000/KMA/b7550a21-f13c-489d-b997-149feea74fcd.jpg",
                    "createTime": "2018-07-16 18:03:07",
                    "totalJoin": 0,
                    "publishDate": "2018-07-16",
                    "finished": false,
                    "sourceName": "自定义",
                    "stateText": "正常"
                    }
            ]
        }
    }
 */
router.get('/recommend/activities', async (ctx, next) => {
    let params = Object.assign({}, ctx.query);
    ctx.body = dataFormat.success(await manuscriptCtrl.getActivitiesWithRecommended(params))
})

/**
 * @api {get} /manuscript/join/activities?pageIndex=1&pageSize=10&search=? 获取用户参与的活动列表
 * @apiDescription Author: 大龙
 * @apiName 获取用户参与的活动列表(join_activities)
 * @apiGroup Manuscript
 * 
 * @apiParam {String} search 模糊查询关键字
 * @apiParam {String} pageIndex 分页：分页索引，从1开始
 * @apiParam {String} pageSize 分页：每页获取多少条(默认10)
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
        "status": 0,
        "message": " Interface response successful ",
        "data":{
            "total": 1,
            "list":[
                 {
                    "uuid": "4bccbe51-3953-411d-8f42-a02bc252dca5",
                    "id": "11001180716000000005",
                    "activeStartDate": null,
                    "activeEndDate": null,
                    "url": "11001180716000000005.wap.pro.kma.dev.cn",
                    "type": 3,
                    "name": "iry",
                    "cover": "http://bos-kcmsdesign.iwanqi.cn/00000000-0000-0000-0000-000000000000/KMA/b7550a21-f13c-489d-b997-149feea74fcd.jpg",
                    "createTime": "2018-07-16 18:03:07",
                    "totalJoin": 0,
                    "publishDate": "2018-07-16",
                    "finished": false,
                    "sourceName": "自定义",
                    "stateText": "正常"
                    }
            ]
        }
    }
 */
router.get('/join/activities', async (ctx, next) => {
    let params = Object.assign({}, ctx.query);
    params.userUuid = ctx.user.userUuid;
    ctx.body = dataFormat.success(await manuscriptCtrl.getActivitiesWithJoin(params))
})

/**
* @api {get} /manuscript/promotion/activities?pageIndex=1&pageSize=10&search=? 获取用户推广的活动列表
* @apiDescription Author: 大龙
* @apiName 获取用户推广的活动列表(promotion_activities)
* @apiGroup Manuscript
* 
* @apiParam {String} search 模糊查询关键字
* @apiParam {String} pageIndex 分页：分页索引，从1开始
* @apiParam {String} pageSize 分页：每页获取多少条(默认10)
* 
* @apiSuccessExample 成功返回结果:
*  HTTP/1.1 200 OK
*  {
       "status": 0,
       "message": " Interface response successful ",
       "data":{
           "total": 1,
           "list":[
               {
               "uuid": "370f3c32-0ea1-49ff-81d2-b033bcb95934",
               "id": "11001180716000000002",
               "pageStartDate": null,
               "pageEndDate": null,
               "activeStartDate": null,
               "activeEndDate": null,
               "dispatchRange": 0,
               "url": "11001180716000000002.wap.pro.kma.dev.cn",
               "type": 3,
               "name": null,
               "cover": null,
               "enable": 1,
               "createTime": "2018-07-16 15:20:56",
               "modifyTime": "2018-07-16T07:20:56.000Z",
               "businessName": "万商云集",
               "recommend": 0,
               "totalJoin": 35000,
               "publishDate": "2018-07-16",
               "finished": false
               }
           ]
       }
   }
*/
router.get('/promotion/activities', async (ctx, next) => {
    let params = Object.assign({}, ctx.query);
    params.userId = ctx.user.userUuid;
    ctx.body = dataFormat.success(await manuscriptCtrl.getActivitiesWithPromotion(params))
})

/**
* @api {get} /manuscript/publish/setting 获取发布设置
* @apiDescription Author: 高阳
* @apiName 获取发布设置
* @apiGroup Manuscript
* 
* @apiParam {String} relationId 稿件id
* 
* @apiSuccessExample 成功返回结果:
*  HTTP/1.1 200 OK
*  {
       "status": 0,
       "message": " Interface response successful ",
       "data":{
           "name": "",        // 发布名称
           "description": "", // 发布描述
           "keywords": []     // 关键字,数组
       }
   }
*/
router.get('/publish/setting', async (ctx, next) => {
    let params = Object.assign({}, ctx.query);
    ctx.body = dataFormat.success(await manuscriptCtrl.publishSetting(params))
})


/**
 * @api {post} /manuscript/recommend/activitiy 活动推荐
 * @apiDescription Author: 大龙
 * @apiName 活动推荐(recommend_activitiy)
 * @apiGroup Manuscript
 * 
 * @apiParam {String} id 稿件id
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
    {"status":0,
    "message":" Interface response successful ",
    "data":{
        "id":"4bccbe51-3953-411d-8f42-a02bc252dca5",
        "relationId":"11001180716000000005",
        "pageStartDate":null,
        "pageEndDate":null,
        "activeStartDate":null,
        "activeEndDate":null,
        "dispatchRange":0,
        "url":"11001180716000000005.wap.pro.kma.dev.cn",
        "recommend":1
    }
}
 */
router.post('/recommend/activitiy', async (ctx, next) => {
    let params = Object.assign({}, ctx.request.body);
    ctx.body = dataFormat.success(await manuscriptCtrl.recommendActivitiy(params))
})

/**
 * @api {post} /manuscript/create 创建稿件
 * @apiDescription Author: 大龙
 * @apiName 创建稿件(Create)
 * @apiGroup Manuscript
 *
 * @apiParam {String} name 稿件名称
 * @apiParam {String} description 稿件描述
 * @apiParam {String} cover 稿件封面
 * @apiParam {String} refSourceId 引用来源(当该参数有值时，将忽略content参数)
 * @apiParam {String} content 稿件内容
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      name: "稿件名称",
 *      description: "稿件描述",
 *      cover: "//images.example.com/cover.png",
 *      refSourceId: "1001000000001",
 *      content: "longtext content"
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
    let query = Object.assign({}, ctx.request.body);
    query.userId = ctx.user.userUuid;
    ctx.body = dataFormat.success(await manuscriptCtrl.create(query))
})

/**
 * @api {put} /manuscript/update 修改稿件
 * @apiDescription Author: 大龙
 * @apiName 修改稿件(Update)
 * @apiGroup Manuscript
 *
 * @apiParam {String} id 稿件编号
 * @apiParam {String} name 稿件名称
 * @apiParam {String} description 稿件描述
 * @apiParam {String} type 稿件类型： 模板 -> template; 稿件 -> draft; 已发布的稿件 -> release;
 * @apiParam {String} cover 稿件封面
 * @apiParam {String} enable 是否启用： 0.禁用; 1.启动;
 * @apiParam {String} content 稿件内容
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "1001000000001",
 *      name: "稿件名称",
 *      description: "稿件描述",
 *      type: "draft",
 *      cover: "//images.example.com/cover.png",
 *      enable: 1,
 *      content: "longtext content"
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
router.put('/update', async (ctx, next) => {
    let query = Object.assign({}, ctx.request.body);
    query.userId = ctx.user.userUuid;
    ctx.body = dataFormat.success(await manuscriptCtrl.update(query))
})

/**
 * @api {post} /manuscript/generate/template 生成模板
 * @apiDescription Author: 大龙
 * @apiName 生成模板(GenerateTemplate)
 * @apiGroup Manuscript
 *
 * @apiParam {String} id 生成模板的稿件编号
 * @apiParam {String} name 模板名称（可选，默认使用稿件名称）
 * @apiParam {String} description 模板描述（可选，默认使用稿件描述）
 * @apiParam {String} cover 模板封面(可选，默认使用稿件封面)
 * @apiParam {String} score 模板分数(可选， 默认0分)
 * @apiParam {String} content 模板的最新内容（可选，默认从DB拿最新）
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "1001000000001",
 *      name: "模板名称",
 *      description: "模板描述",
 *      cover: "//images.example.com/cover.png",
 *      content: "content"
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
router.post('/generate/template', async (ctx, next) => {
    let query = Object.assign({}, ctx.request.body);
    query.userId = ctx.user.userUuid;
    ctx.body = dataFormat.success(await manuscriptCtrl.genTemplate(query))
})

/**
 * @api {post} /manuscript/generate/preview 预览稿件
 * @apiDescription Author: 大龙
 * @apiName 预览稿件(GeneratePreview)
 * @apiGroup Manuscript
 *
 * @apiParam {String} id 预览稿件的编号（若存在则忽略content，默认从DB中拿稿件数据）
 * @apiParam {String} content 预览稿件的内容
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "1001000000001",
 *      content: "content"
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
router.post('/generate/preview', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, { host: ctx.host });
    query.userId = ctx.user.userUuid;
    ctx.body = dataFormat.success(await manuscriptCtrl.genPreview(query))
})

/**
 * @api {post} /manuscript/generate/release 发布稿件
 * @apiDescription Author: 大龙
 * @apiName 发布稿件(GenerateRelease)
 * @apiGroup Manuscript
 *
 * @apiParam {String} id 发布稿件的编号
 * @apiParam {String} name 发布名称（可选，默认使用稿件名称）
 * @apiParam {String} description 发布描述（可选，默认使用稿件描述）
 * @apiParam {String} cover 发布封面(可选，默认使用稿件封面)
 * @apiParam {String} activeStartDate 活动开始时间（可选，默认立即开始）
 * @apiParam {String} activeEndDate 活动结束时间(可选，默认不过期)
 * @apiParam {String} content 稿件的最新内容（可选，默认从DB拿最新）
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "1001000000001",
 *      name: "发布名称",
 *      description: "发布描述",
 *      cover: "//images.example.com/cover.png",
 *      content: "content"
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
router.post('/generate/release', async (ctx, next) => {
    let query = Object.assign(ctx.request.body, { host: ctx.host });
    query.userId = ctx.user.userUuid;
    ctx.body = dataFormat.success(await manuscriptCtrl.genRelease(query))
})

/**
 * @api {post} /manuscript/distribute/template 分发模板
 * @apiDescription Author: 高阳
 * @apiName 分发模板(DistributeTemplate)
 * @apiGroup Manuscript
 *
 * @apiParam {String} id 模板编号
 * @apiParam {int} type 撤销 0, 分发 1
 * @apiParam {Array} businessIds 商户id数组(当distribution设置为0的时候, 该字段无效)
 * @apiParam {String} [distribution] (选填)设置分发属性(0为公有, 1为私有 默认0)
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "1001000000001",
 *      type: 1, 
 *      distribution: 1,
 *      businessIds:['','','']
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
router.post('/distribute/template', async (ctx, next) => {
    ctx.body = dataFormat.success(await manuscriptCtrl.distTemplate(ctx.request.body));
})


/**
 * @api {post} /manuscript/delete 删除稿件
 * @apiDescription Author: 高阳
 * @apiName 删除稿件(DELETE)
 * @apiGroup Manuscript
 *
 * @apiParam {String} id 模板编号
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "1001000000001"
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
    ctx.body = dataFormat.success(await manuscriptCtrl.delete(ctx.request.body));
})

/**
 * @api {post} /manuscript/enable 启用禁用稿件
 * @apiDescription Author: 高阳
 * @apiName 启用禁用稿件(ENABLE)
 * @apiGroup Manuscript
 *
 * @apiParam {String} id 模板编号
 * @apiParam {Boolean} enable 1启用 0禁用
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "1001000000001",
 *      enable:0
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
router.post('/enable', async (ctx, next) => {
    ctx.body = dataFormat.success(await manuscriptCtrl.enable(ctx.request.body));
})


/**
 * @api {post} /manuscript/wxqrcode/get 生成微信二维码并且上传资源服务器
 * @apiDescription Author: 斗高甲
 * @apiName 微信二维码
 * @apiGroup Manuscript
 *
 * @apiParam {String} scene 最大32个可见字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~，其它字符请自行编码为合法字符（因不支持%，中文无法使用 urlencode 处理，请使用其他编码方式）
 * @apiParam {String} page 必须是已经发布的小程序存在的页面（否则报错），例如 "pages/index/index" ,根路径前不要填加'/',不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
 * @apiParam {int} [width] 二维码的宽度,默认430
 * @apiParam {boolean} [autoColor] 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调
 * @apiParam {Object} [lineColor] autoColor 为 false 时生效，使用 rgb 设置颜色 例如 {"r":"xxx","g":"xxx","b":"xxx"} 十进制表示
 * @apiParam {boolean} [isHyaline] 是否需要透明底色， is_hyaline 为true时，生成透明底色的小程序码
 * 
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "1001000000001",
 *      enable:0
 *  }
 *   
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          "file": "",                                                 //文件路径
 *          "title": "topsecret.jpg",                                   //文件名
 *          "width": 430,
 *          "height": 430,
 *          "size": 114577,
 *          "res_secret_id": "af2e9433-7e87-11e8-9f34-fa163e54bd38",
 *          "extension": "jpg",
 *          "mediaType": "image/jpeg",
 *          "number": "94876be4-a976-4bb4-831d-290f0315d39f",
 *          "etag": "42a5f4cdff95f0d576a2640e7b222ff3",
 *          "cloudStorage": 1,
 *          "filePath": null
 *      }
 *  }
 */
router.post('/wxqrcode/get', async (ctx, next) => {
    var params = ctx.request.body;
    // params.appid = ctx.get('appid');
    // params.secret = ctx.get('secret');

    params.appid = 'wx4226d717697ce3f7'
    params.secret = 'c35ee32e8062e282254861b3d6e4efd9'
    ctx.body = dataFormat.success(await manuscriptCtrl.QRcode(params));
})


module.exports = router