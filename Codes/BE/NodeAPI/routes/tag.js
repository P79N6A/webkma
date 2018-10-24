const
    router = require('koa-router')(),
    dataFormat = require('mscore').data;

let tagCtrl = global.require("./business/controller/tag")

router.prefix('/tag')

/**
 * @api {get} /tag/:id 获取标签
 * @apiDescription Author: 大龙
 * @apiName 获取标签(get)
 * @apiGroup Tag
 *
 * @apiParam {String} id 标签编号
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
router.get('/:id', async (ctx, next) => {
    ctx.body = dataFormat.success(await tagCtrl.get(ctx.params))
})

/**
 * @api {get} /tag/list/material?sortby=sort&sequence=asc&search= 获取素材标签列表
 * @apiDescription Author: 大龙
 * @apiName 获取素材标签列表(getlistmaterial)
 * @apiGroup Tag
 *
 * @apiParam {String} search 搜索关键字
 * @apiParam {String} sortby 排序字段: sort | total | null
 * @apiParam {String} sequence 排序方式: asc | desc
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": [
 *          {
 *              "id": "b9d087f9-0b84-41cf-8e83-d320cf4347bd",   //标签ID
 *              "name": "kk",                                   //标签名称
 *              "sort": 9,                                      //标签排序索引
 *              "useTotal": 6,                                  //标签引用次数
 *              "operator": "UserName",                         //最后操作人
 *              "operatorTime": "2018-07-02T06:26:12.000Z",     //最后操作时间
 *          }
 *      ]
 *  }
 */
router.get('/list/material', async (ctx, next) => {
    ctx.body = dataFormat.success(await tagCtrl.getListOfMaterial(ctx.query))
})

/**
 * @api {get} /tag/list/usematerial?sortby=sort&sequence=asc&search=&pageIndex=1&pageSize=10 获取关联了素材的标签列表
 * @apiDescription Author: 斗高甲
 * @apiName 获取关联了素材的标签列表(tagListUserMaterial)
 * @apiGroup Tag
 *
 * @apiParam {String} search 搜索关键字
 * @apiParam {String} sortby 排序字段: sort | total | null 默认sort
 * @apiParam {String} sequence 排序方式: asc | desc 默认desc
 * @apiParam {String} mtrClass 素材分类
 * @apiParam {String} pageIndex 分页号，默认1
 * @apiParam {String} pageSize 分页数量，默认10
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": 
 *          list:[
 *              {
 *                  "id": "b9d087f9-0b84-41cf-8e83-d320cf4347bd",   //标签ID
 *                  "name": "kk",                                   //标签名称
 *                  "sort": 9,                                      //标签排序索引
 *                  "useTotal": 6,                                  //标签引用次数
 *                  "operator": "UserName",                         //最后操作人
 *                  "operatorTime": "2018-07-02T06:26:12.000Z",     //最后操作时间
 *              },
 *          ],
 *          total:2,
 *          pageIndex:1
 *          pageSize:10
 *  }
 * 
 */

router.get('/list/usematerial', async (ctx, next) => {
    ctx.body = dataFormat.success(await tagCtrl.getListOfUseMaterial(ctx.query))
})

/**
 * @api {get} /tag/list/template?sortby=sort&sequence=asc&search= 获取模板标签列表
 * @apiDescription Author: 大龙
 * @apiName 获取模板标签列表(getlisttemplate)
 * @apiGroup Tag
 * 
 * @apiParam {String} search 搜索关键字
 * @apiParam {String} sortby 排序字段: sort | null
 * @apiParam {String} sequence 排序方式: asc | desc
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": [
 *          {
 *              "id": "b9d087f9-0b84-41cf-8e83-d320cf4347bd",   //标签ID
 *              "name": "kk",                                   //标签名称
 *              "sort": 9,                                      //标签排序索引
 *              "useTotal": 6,                                  //标签引用次数
 *              "operator": "UserName",                         //最后操作人
 *              "operatorTime": "2018-07-02T06:26:12.000Z",     //最后操作时间
 *          }
 *      ]
 *  }
 */
router.get('/list/template', async (ctx, next) => {
    ctx.body = dataFormat.success(await tagCtrl.getListOfTemplate(ctx.params))
})

/**
 * @api {post} /tag/create 创建标签
 * @apiDescription Author: 大龙
 * @apiName 创建标签(Create)
 * @apiGroup Tag
 *
 * @apiParam {String} name 标签名称
 * @apiParam {String} type 稿件类型：素材 -> material; 模板 -> template;
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      name: "标签名称",
 *      type: "material"
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
    ctx.body = dataFormat.success(await tagCtrl.create(ctx.request.body))
})

/**
 * @api {put} /tag/update 修改标签
 * @apiDescription Author: 大龙
 * @apiName 修改标签(Update)
 * @apiGroup Tag
 *
 * @apiParam {String} id 标签编号
 * @apiParam {String} name 标签名称
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "0000",
 *      name: "标签名称"
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
    ctx.body = dataFormat.success(await tagCtrl.update(ctx.request.body))
})

/**
 * @api {put} /tag/sort 标签排序
 * @apiDescription Author: 大龙
 * @apiName 标签排序(sort)
 * @apiGroup Tag
 *
 * @apiParam {String} id 标签编号
 * @apiParam {String} sort 标签索引
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      data: [
 *          {
 *              id: "0000",
 *              sort: 1
 *          },
 *          {
 *              id: "0001",
 *              sort: 2
 *          }
 *      ]
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
router.put('/sort', async (ctx, next) => {
    ctx.body = dataFormat.success(await tagCtrl.sort(ctx.request.body))
})

/**
 * @api {post} /tag/delete 删除标签
 * @apiDescription Author: 大龙
 * @apiName 删除标签(Delete)
 * @apiGroup Tag
 *
 * @apiParam {String} id 标签编号(多个id以逗号隔开)
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "0000,0001,0002"
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
    ctx.body = dataFormat.success(await tagCtrl.delete(ctx.request.body))
})

/**
 * @api {post} /tag/relation 添加标签与资源的关联关系
 * @apiDescription Author: 大龙
 * @apiName 添加标签与资源的关联关系(relation)
 * @apiGroup Tag
 *
 * @apiParam {String} tagId 标签编号(多个tagId以逗号隔开)
 * @apiParam {String} relationId 资源编号(多个id以逗号隔开)
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      tagId: "0000,0001,0002",
 *      relationId: "1001,1002,1003"
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
router.post('/relation', async (ctx, next) => {
    ctx.body = dataFormat.success(await tagCtrl.relation(ctx.request.body))
})

/**
 * @api {post} /tag/relieve/id 通过记录ID解除标签与资源的关联关系
 * @apiDescription Author: 大龙
 * @apiName 通过记录ID解除标签与资源的关联关系(relieveById)
 * @apiGroup Tag
 *
 * @apiParam {String} id 关联id(多个id以逗号隔开)
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "0000,0001,0002"
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
router.post('/relieve/id', async (ctx, next) => {
    ctx.body = dataFormat.success(await tagCtrl.relieveById(ctx.request.body))
})

/**
 * @api {post} /tag/relieve/tag 通过标签ID解除该标签关联的所有资源关系
 * @apiDescription Author: 大龙
 * @apiName 通过标签ID解除该标签关联的所有资源关系(relieveByTag)
 * @apiGroup Tag
 *
 * @apiParam {String} id 标签id(多个id以逗号隔开)
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "0000,0001,0002"
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
router.post('/relieve/tag', async (ctx, next) => {
    ctx.body = dataFormat.success(await tagCtrl.relieveByTag(ctx.request.body))
})

/**
 * @api {post} /tag/relieve/relation 通过关联ID解除该资源关联的所有标签关系
 * @apiName 通过关联ID解除该资源关联的所有标签关系(relieveByRelation)
 * @apiDescription Author: 大龙
 * @apiGroup Tag
 *
 * @apiParam {String} id 标签id(多个id以逗号隔开)
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      id: "0000,0001,0002"
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
router.post('/relieve/relation', async (ctx, next) => {
    ctx.body = dataFormat.success(await tagCtrl.relieveByRelation(ctx.request.body))
})

/**
 * @api {put} /tag/reset/material 重置素材与标签的关联关系
 * @apiName 重置素材与标签的关联关系(resetByMaterial)
 * @apiDescription Author: 大龙
 * @apiGroup Tag
 *
 * @apiParam {String} relationId 资源编号(多个id以逗号隔开)
 * @apiParam {String} tagId 标签编号(多个tagId以逗号隔开)
 * 
 * @apiParamExample {json} 请求参数:
 *  {
 *      relationId: "1001,1002,1003",
 *      tagId: "0000,0001,0002"
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
router.put('/reset/material', async (ctx, next) => {
    ctx.body = dataFormat.success(await tagCtrl.resetByMaterial(ctx.request.body))
})




module.exports = router