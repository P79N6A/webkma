const
    router = require('koa-router')(),
    dataFormat = require('mscore').data,
    materialCtrl = require('../business/controller/material');


/**
 * @api {get} /material/search 素材查询
 * @apiDescription Author：斗高甲
 * @apiName /material/search
 * @apiGroup material
 *
 * @apiParam {String} [mtrid] 素材id
 * @apiParam {String} [mtrClass] 素材分类
 * @apiParam {String} [mtrSourceName] 素材名称，模糊匹配
 * @apiParam {String} [tagId] 标签id
 * @apiParam {String} [startTime] 开始日期
 * @apiParam {String} [endTime] 结束日期
 * @apiParam {String} [sort] 时间排序 desc时间倒叙，asc时间正序，默认desc
 * @apiParam {String} [identity] 身份，own,sys,默认sys
 * @apiParam {number} [pageIndex] 分页 默认1
 * @apiParam {number} [pageSize] 分页数 默认10
 * 
 * 
 *@apiParamExample {json} 请求参数:
 *  
 * ?mtrid=&mtrClass=&mtrSourceName=&startTime=&endTime=&sort=&pageIndex=1&pageSize=10
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          "list": [                   //返回的数据
 *          {
 *              "mtrId": "",            //素材id
 *              "mtrName": "gsdtg",     //素材名称
 *               "mtrSource": "",       //素材源路径
 *               "mtrTemplate": "",     //素材模板路径
 *               "mtrType": "mtr",      //素材类型 img 图片和svg
 *               "mtrClass": "bround",  //素材分类
 *               "mtrRemark": ""        //素材备注
 *               "tagIds": ""           //素材标签id，多个逗号隔开
 *               "tags": [{"id":"","tagName":""}]             //素材标签,
 *               "createtime": ""       //素材创建时间
 *              }
 *          ],
 *       "total": 1,                    
 *       "pageIndex": 1,
 *       "pageSize": 10
 *      }
 *  }
 */
router.get('/material/search', async (ctx, next) => {
    var options = ctx.query
    options.userId = ctx.session.data[0].user_uuid
    ctx.body = dataFormat.success(await materialCtrl.searchMaterial(options))
})


/**
 * @api {post} /material/save 素材保存
 * @apiDescription Author：斗高甲 如果分类下已存在，则报错
 * @apiName /material/save
 * @apiGroup material
 *
 * @apiParam {String} mtrSource 素材源路径,如果是上传图片可以的数组，保存多个图片
 * @apiParam {String} mtrTemplate 素材模板路径
 * @apiParam {String} mtrSourceName 素材源名称
 * @apiParam {String} mtrTemplateName 素材模板名称
 * @apiParam {String} mtrClass 素材分类
 * @apiParam {String} mtrType 素材类型，img 图片和svg
 * @apiParam {String} [mtrRemark] 素材备注
 * 
 * @apiParam {Array} [list] 批量上传包含以上参数
 * 
 *  
 *@apiParamExample {json} 请求参数:
 *  //保存单个素材 
 * {
 *      mtrSource:""
 *      mtrTemplate: '',
 *      mtrSourceName:'',
 *      mtrTemplateName:'',
 *      mtrClass:'',
 *      mtrType:'',
 *      mtrRemark:''
 *  }
 * //保存多个素材
 * [
 * {
 *      mtrSource:""
 *      mtrTemplate: '',
 *      mtrSourceName:'',
 *      mtrTemplateName:'',
 *      mtrClass:'',
 *      mtrType:'',
 *      mtrRemark:''
 *  },
 * ...
 * ]
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": ''      //素材id
 *  }
 */
router.post('/material/save', async (ctx, next) => {
    ctx.body = dataFormat.success(await materialCtrl.saveMaterial(ctx.request.body))
})

/**
 * @api {post} /user/material/save 用户素材保存
 * @apiDescription Author：斗高甲 如果分类下已存在，则报错
 * @apiName /user/material/save
 * @apiGroup material
 *
 * @apiParam {String} mtrSource 素材源路径,如果是上传图片可以的数组，保存多个图片
 * @apiParam {String} mtrTemplate 素材模板路径
 * @apiParam {String} mtrSourceName 素材源名称
 * @apiParam {String} mtrTemplateName 素材模板名称
 * @apiParam {String} mtrClass 素材分类
 * @apiParam {String} mtrType 素材类型，img 图片和svg
 * @apiParam {String} [mtrRemark] 素材备注
 * 
 * @apiParam {Array} [list] 批量上传包含以上参数
 * 
 * @apiHeader {String} session_id 用户登录的session_id
 *  
 *@apiParamExample {json} 请求参数:
 *  //保存单个素材 
 * {
 *      mtrSource:""
 *      mtrTemplate: '',
 *      mtrSourceName:'',
 *      mtrTemplateName:'',
 *      mtrClass:'',
 *      mtrType:'',
 *      mtrRemark:''
 *  }
 * //保存多个素材
 * [
 * {
 *      mtrSource:""
 *      mtrTemplate: '',
 *      mtrSourceName:'',
 *      mtrTemplateName:'',
 *      mtrClass:'',
 *      mtrType:'',
 *      mtrRemark:''
 *  },
 * ...
 * ]
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": ''      //素材id
 *  }
 */
router.post('/user/material/save', async (ctx, next) => {
    var options = ctx.request.body
    options.userId = ctx.session.data[0].user_uuid
    ctx.body = dataFormat.success(await materialCtrl.saveUserMaterial(options))
})

/**
 * @api {post} /material/update 素材更新
 * @apiDescription Author：斗高甲
 * @apiName 更新素材的信息
 * @apiGroup material
 *
 * @apiParam {String} mtrId 素材id
 * @apiParam {String} mtrSource 素材源路径
 * @apiParam {String} mtrTemplate 素材模板路径
 * @apiParam {String} mtrSourceName 素材源名称
 * @apiParam {String} mtrTemplateName 素材模板名称
 * @apiParam {String} mtrClass 素材分类 如果要改变素材路径则必填
 * @apiParam {String} [mtrRemark] 素材备注
 * 
 *  
 *@apiParamExample {json} 请求参数:
 *  {
 *      mtrId:""
 *      mtrSource:""
 *      mtrTemplate: '',
 *      mtrSourceName:'',
 *      mtrTemplateName:'',
 *      mtrClass:'',
 *      mtrRemark:''
 *  }
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": 'success'      
 *  }
 */
router.post('/material/update', async (ctx, next) => {
    ctx.body = dataFormat.success(await materialCtrl.updateMaterial(ctx.request.body))
})

/**
 * @api {post} /material/delete 素材删除
 * @apiDescription Author：斗高甲
 * @apiName 删除素材
 * @apiGroup material
 *
 * @apiParam {Array} mtrIds 素材id数组
 * 
 *  
 *@apiParamExample {json} 请求参数:
 *  {
 *      mtrIds:[]
 *  }
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": 'success'      
 *  }
 */
router.post('/material/delete', async (ctx, next) => {
    ctx.body = dataFormat.success(await materialCtrl.deleteMaterial(ctx.request.body))
})


/**
 * @api {get} /class/search 分类查询
 * @apiDescription Author：斗高甲
 * @apiName 查询素材分类
 * @apiGroup material
 *
 * @apiParam {String} [classKey] 分类标识
 * @apiParam {String} [className] 分类名称，模糊匹配
 * @apiParam {number} [pageIndex] 分页 默认1
 * @apiParam {number} [pageSize] 分页数 默认10
 * 
 *  
 *@apiParamExample {json} 请求参数:
 *  
 *  ?classKey=&className=&pageIndex=1&pageSize=10
 * 
 * @apiSuccessExample 成功返回结果:
 *  HTTP/1.1 200 OK
 *  {
 *      "status": 0,
 *      "message": " Interface response successful ",
 *      "data": {
 *          "list": [                   //返回的数据
 *          {
 *              "id": "",                   //分类id
 *              "className": "gsdtg",       //分类名称
 *              "classPath": "",            //分类源
 *              "classKey": "",             //分类标识
 *              "classRemark": ""           //分类备注
 *              "createtime": ""            //分类创建时间
 *              }
 *          ],
 *       "total": 1,
 *       "pageIndex": 1,
 *       "pageSize": 10
 *      }
 *  }
 */
router.get('/class/search', async (ctx, next) => {
    ctx.body = dataFormat.success(await materialCtrl.searchClass(ctx.query))
})


module.exports = router