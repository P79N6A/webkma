'use strict';
let
    request = require("request"),
    fs = require("fs"),
    mscore = require("mscore"),
    dao = mscore.dao,
    redis = mscore.redis,
    locker = mscore.locker,
    sysconf = global.require("./config/system-config"),
    compression = global.require("./utils/compression"),
    stringHelper = global.require('./utils/stringHelper'),
    manuscriptDAO = global.require('./business/dao/manuscript'),
    businessDAO = global.require('./business/dao/business'),
    MANUSCRIPT = global.require("./constant/manuscript"),
    UUIDTYPE = global.require("./constant/uuid-type"),
    msUtil = global.require("./utils/microservice"),
    _ = require('underscore'),
    wxApi = require('../../config/system-config').wxApi,
    moment = require('moment');
const Exception = mscore.Exception;

class biz {
    // 获取稿件/模板
    static async get(params) {
        return await dao.manageConnection(async (connection) => {
            let result = await manuscriptDAO.get(connection, { id: params.id })
            if (!result) return Promise.reject(Exception.BusinessException('稿件/模板不存在', -1));
            if (result.enable == MANUSCRIPT.enable.disable)
                return Promise.reject(Exception.BusinessException('稿件/模板被禁用', -2));
            switch (result.type) {
                case MANUSCRIPT.type.draft: break;
                case MANUSCRIPT.type.template:
                    Object.assign(result, await manuscriptDAO.getExtForTemplate(connection, { id: params.id }))
                    break;
                case MANUSCRIPT.type.release:
                    Object.assign(result, await manuscriptDAO.getExtForRelease(connection, { id: params.id }))
                    break;
            }
            return result;
        });
    }

    /**
     * 获取活动信息
     * @param {*} params 
     */
    static async getRelease(params) {
        return await dao.manageConnection(async (connection) => {
            let result = await manuscriptDAO.get(connection, { id: params.id })
            if (!result)
                return Promise.reject(Exception.BusinessException('活动不存在', 10001));
            if (result.enable == MANUSCRIPT.enable.disable)
                return Promise.reject(Exception.BusinessException('活动被禁用', 10002));
            Object.assign(result, await manuscriptDAO.getExtForRelease(connection, { id: params.id }))
            let now = new Date();
            if (result.activeStartDate > now)
                return Promise.reject(Exception.BusinessException('活动未开始', 10003));
            // if (result.activeEndDate < now)
            //     return Promise.reject(Exception.BusinessException('活动已过期', 10004));
            // (获取)参与账号信息是否为黑名单 (userId用户id + id稿件id)
            // return Promise.reject(Exception.BusinessException('参与账号异常', 10005));
            return result;
        });
    }

    // 获取稿件/模板列表
    static async getList(params) {
        return await dao.manageConnection(async (connection) => {
            return await manuscriptDAO.getList(connection, {
                type: params.type,
                skip: parseInt(params.pagination.skip),
                count: parseInt(params.pagination.count),
                search: params.search,
                operator: params.operator
            });
        });
    }

    // 获取模板列表
    static async getTemplateList(params) {
        return await dao.manageConnection(async (connection) => {
            let data = await manuscriptDAO.getTemplateList(connection, params);
            // data.list.forEach((i) => {
            //     i.url = stringHelper.format(sysconf.host.midway.pro, i.id);
            // });
            return data;
        });
    }

    // 获取模板列表(商家)
    static async getTemplateListWithBusiness(params) {
        return await dao.manageConnection(async (connection) => {
            let data = await manuscriptDAO.getTemplateListWithBusiness(connection, params);
            return data;
        });
    }

    // 获取活动列表
    static async getReleaseList(params) {
        let data = await dao.manageConnection(async (connection) => {
            let query = Object.assign({}, params);
            let datas = await manuscriptDAO.getReleaseList(connection, query);
            return datas;
        });
        data = await biz._activitiyCompute(data, params);

        return data;
    }

    static async _activitiyCompute(data, params = {}) {
        let ids = data.list.map(r => r.id);
        let results = [];
        if (!!ids && ids.length > 0) {
            // 获取统计数据
            results = await Promise.all([
                //     msUtil.analysisType({
                //     belongModule: ids
                // }, 'belongModule'),
                {},
                dao.manageConnection(async connection => {
                    return manuscriptDAO.getJoinCountForRelease(connection, ids)
                })
            ]);
        }
        let analysisData = results[0] || {};
        let joinCounts = results[1] || {};
        let now = Date();
        //处理统计数据
        data.list.forEach(r => {
            let { id } = r;
            // let ad = analysisData[id];
            // if (!!ad) {
            //     r.totalShare = ad.scan_share; //分享数
            //     r.totalVisitor = ad.scan_visitor; //访客数
            //     r.totalAccess = ad.scan_access; //访问数
            // } else {
            //     r.totalShare = 0; //分享数
            //     r.totalVisitor = 0; //访客数
            //     r.totalAccess = 0; //访问数
            // }
            r.totalJoin = joinCounts[id] || 0;
            r.createTime = moment(r.createTime).format('YYYY-MM-DD HH:mm:ss');
            r.publishDate = r.createTime.substr(0, 10);
            r.finished = r.activeEndDate <= now;
            r.sourceName = r.sourceName || '自定义';
            r.stateText = r.enable == 0 ? '禁用' : '正常';
        });
        if (!!params.sortBy && !!params.sortBy.totalJoin) {
            data.list.sort((f, s) => {
                if (f.publishDate === s.publishDate) {
                    return f.totalJoin > s.totalJoin
                }
                return true;
            });
        }
        return data;
    }
    // 获取用户推广的活动列表
    static async getActivitiesWithPromotion(params) {
        let data = await dao.manageConnection(async (connection) => {
            let query = Object.assign({}, params);
            let datas = await manuscriptDAO.getReleaseListForPromotion(connection, query);
            return datas;
        });
        data = await biz._activitiyCompute(data, params);
        return data;
    }

    // 获取推荐的活动列表
    static async getActivitiesWithRecommended(params) {
        let data = await dao.manageConnection(async (connection) => {
            let query = Object.assign({}, params);
            let datas = await manuscriptDAO.getRecommendReleaseList(connection, query);
            return datas;
        });
        data = await biz._activitiyCompute(data, params);
        return data;
    }
    // 创建稿件
    static async create(params) {
        return await dao.manageTransactionConnection(async (connection) => {
            let manuscriptId = await manuscriptDAO.create(connection, {
                categoryId: params.categoryId,
                type: MANUSCRIPT.type.draft,
                name: params.name || MANUSCRIPT.name.default,
                description: params.description,
                cover: params.cover,
                enable: MANUSCRIPT.enable.temporary,
                refSourceId: params.refSourceId,
                operator: params.operator
            })
            // 优先使用引用资源的内容
            let content;
            if (!!params.refSourceId) {
                content = ((await manuscriptDAO.getContent(connection, { relationId: params.refSourceId })) || {}).content
            } else {
                if (params.content instanceof Object) {
                    content = JSON.stringify(params.content)
                } else {
                    content = params.content
                }
            }
            await manuscriptDAO.addContent(connection, { relationId: manuscriptId, content: content })
            return { id: manuscriptId }
        })
    }

    // 活动推荐
    static async recommendActivitiy(params) {
        return await dao.manageTransactionConnection(async (connection) => {
            let record = await manuscriptDAO.getExtForRelease(connection, {
                id: params.id
            })
            if (!record) {
                throw new Exception("未找到对应的活动", -1, 200);
            }
            record = Object.assign({}, record, { recommend: params.recommend, relationId: record.relationId });
            await manuscriptDAO.updateExtRelease(connection, record);
            return record;
        })
    }
    // 修改稿件/模板
    static async update(params) {
        return await dao.manageTransactionConnection(async (connection) => {
            await manuscriptDAO.update(connection, {
                id: params.id,
                categoryId: params.categoryId,
                name: params.name,
                description: params.description,
                type: params.type,
                cover: params.cover,
                enable: parseInt(params.enable) > -1 ? parseInt(params.enable) : MANUSCRIPT.enable.enable,
                operator: params.operator,
            })
            if (params.content) await manuscriptDAO.updateContent(connection, { relationId: params.id, content: JSON.stringify(params.content) })
            return true;
        })
    }

    static async cloneWithLock(params) {
        if (!params.id) return Promise.reject(Exception.BusinessException('稿件id不能为空', -1));

        return locker.lock(params.id, async () => {
            return await biz.clone(params);
        });
    }

    // 克隆稿件并修改保存
    static async clone(params) {
        return await dao.manageTransactionConnection(async (connection) => {
            // 保存最新内容
            if (params.id && params.content) await manuscriptDAO.updateContent(connection, { relationId: params.id, content: JSON.stringify(params.content) })

            // 获取稿件基本信息
            let data = await manuscriptDAO.get(connection, { id: params.id })

            // 修改克隆对象数据
            data.type = params.type;
            data.name = params.name;
            data.description = params.description;
            data.cover = params.cover;

            // 获取稿件内容（克隆目的主要copy内容，所以这里不允许被覆盖，将获取内容的流程放在修改对象后面）
            Object.assign(data, await manuscriptDAO.getContent(connection, { relationId: params.id }))

            // 获取稿件插件
            let plugins = await manuscriptDAO.getPlugins(connection, { relationId: params.id })

            // 设置系统属性
            data.operator = params.operator;
            // 将克隆对象写入DB
            let result = {
                id: await manuscriptDAO.create(connection, data)
            }
            await manuscriptDAO.addContent(connection, { relationId: result.id, content: data.content })

            // let copyPlugins = await manuscriptDAO.addPlugin(connection, { data: data.plugins })
            //todo: 通过copyPlugins的oldId获取插件设置、奖项等数据，并做复制动作。
            if (plugins.length > 0) {
                let copyList = [];
                plugins.forEach(i => {
                    copyList.push((async (sqlParams) => {
                        await manuscriptDAO.copyPlugins(connection, sqlParams);
                    })({ id: i.id, relationId: result.id }));
                });
                await Promise.all(copyList);
            }

            switch (params.type) {
                case MANUSCRIPT.type.draft:
                    // result.url = await biz.uploadForMidway(sysconf.host.midway.pre, { id: result.id, content: data.content, host: params.host })
                    break;
                case MANUSCRIPT.type.template:
                    result.url = await biz.uploadForMidway(sysconf.host.midway.pro, { id: result.id, content: data.content, host: params.host })
                    result.codeUrl = (await biz.QRcode({ scene: 'id=' + result.id, page: 'pages/index/index' })).file;
                    await manuscriptDAO.addExtTemplate(connection, {
                        relationId: result.id,
                        score: params.score,
                        url: result.url,
                        codeUrl: result.codeUrl
                    })
                    // 更新源素材
                    await manuscriptDAO.update(connection, {
                        id: params.id,
                        name: params.name,
                        description: params.description,
                        cover: params.cover,
                        enable: MANUSCRIPT.enable.enable
                    });
                    break;
                case MANUSCRIPT.type.release:
                    result.url = await biz.uploadForMidway(sysconf.host.midway.pro, { id: result.id, content: data.content, host: params.host })
                    await manuscriptDAO.addExtRelease(connection, {
                        relationId: result.id,
                        pageStartDate: null,
                        pageEndDate: null,
                        activeStartDate: params.activeStartDate,
                        activeEndDate: params.activeEndDate,
                        url: result.url
                    })
                    // 更新源素材
                    await manuscriptDAO.update(connection, {
                        id: params.id,
                        name: params.name,
                        description: params.description,
                        cover: params.cover,
                        enable: MANUSCRIPT.enable.enable
                    });
                    // 更新模板使用数
                    await manuscriptDAO.increaseExtEmplate(connection, { relationId: data.refSourceId });
                    break;
            }
            return result;
        });
    }

    // 预览模板
    static async preview(params) {
        let id = params.id || null;
        let content = params.content || ""
        if (id) {
            // 根据id获取content
            content = await dao.manageTransactionConnection(async (connection) => {
                return ((await manuscriptDAO.getContent(connection, { relationId: params.id })) || {}).content
            });
        } else {
            id = await msUtil.uuid({ module: UUIDTYPE.manuscript });
        }
        return await biz.uploadForMidway(sysconf.host.midway.pre, { id: id, content: content, host: params.host })
    }

    // 打包文件上传到Midway
    static async uploadForMidway(host, params) {
        if (_.isString(params.content)) params.content = JSON.parse(params.content);
        return await new Promise(async (resolve, reject) => {
            let pageInfo = {
                id: params.id,
                url: host.replace("{0}", `${params.id}.wap`),
                apiHost: sysconf.host.api
            }, htmlData;
            try {
                htmlData = params.content.pages[0].htmlData;
            } catch (error) {
                return reject(Exception.BusinessException('稿件内容已损坏', -1));
            }
            // 替换main_id
            htmlData = htmlData.replace(new RegExp("{{{%main_id%}}}", "gm"), params.id);
            let filePath = await compression.zip({ files: [{ content: htmlData, name: "views/index.html" }] });
            await biz.writeHostMapping(pageInfo)
            request.post({
                url: `http://${host.replace("{0}", "api")}/api/tpl/${pageInfo.id}?type=wap`,
                formData: {
                    file: fs.createReadStream(filePath)
                }
            }, (err, httpResponse, body) => {
                if (err) return reject(err);
                if (httpResponse.statusCode != 200) return reject(httpResponse);
                resolve(pageInfo.url);
            })
        })
    }

    // 写发布后的模板信息配置(Midway使用)
    static async writeHostMapping(params) {
        return await new Promise(async (resolve, reject) => {
            console.log('redis:', JSON.stringify(params));
            await redis.set(`host:${params.id}`, {
                "mobile_host": params.url,
                "main_domain": "",
                "api_host": params.apiHost,
                "kid": params.id
            })
            resolve()
        })
    }

    /**
     * 查重
     * @param {*} params {type, name}
     */
    static async rechecking(params) {
        return await dao.manageConnection(async (connection) => {
            let info = await manuscriptDAO.getByProperty(connection, { type: params.type, name: params.name });
            if (info) {
                let title = '';
                switch (params.type) {
                    case MANUSCRIPT.type.draft: title = '素材'; break;
                    case MANUSCRIPT.type.template: title = '模板'; break;
                    case MANUSCRIPT.type.release: title = '活动'; break;
                }
                return Promise.reject(Exception.BusinessException(title + '名称重复', -1));
            }
            return true;
        });
    }

    // 分发
    static async distribute(params) {
        return await dao.manageTransactionConnection(async (connection) => {
            /*
                分发操作：分发，撤销
                分发属性：公有，私有
             */
            params.type = parseInt(params.type);
            params.distribution = parseInt(params.distribution);

            // 分发属性:公有(注意：这里return了, 设置公有，后续再无分发操作)
            if (params.distribution === MANUSCRIPT.distribution.public) {
                // 修改模板分发状态
                await manuscriptDAO.updateExtTemplate(connection, { relationId: params.id, distribution: params.distribution })
                // 删除操作, 原来可能在私有的时候关联过商家
                return await businessDAO.deleteUnionBusinessManuscript(connection, {
                    manuscriptId: params.id
                });
            }

            // 分发属性:私有
            if (params.distribution === MANUSCRIPT.distribution.private) {
                // 修改模板分发状态
                await manuscriptDAO.updateExtTemplate(connection, { relationId: params.id, distribution: params.distribution })
            }

            // 分发操作:分发
            if (params.type === MANUSCRIPT.distributionType.dispatch) {
                // 批量导入
                var batch = []
                    , list = []
                    , l = params.businessIds.length;
                params.businessIds.forEach((item, i) => {
                    batch.push({ businessId: item, manuscriptId: params.id });
                    if ((i + 1) % 20 == 0 || (i + 1) == l) {
                        list.push((async (arg) => {
                            await businessDAO.batchUnionBusinessManuscript(connection, { batch: arg });
                        })(batch));
                        batch = new Array();
                    }
                });
                await Promise.all(list);
            }

            // 分发操作:撤销
            if (params.type === MANUSCRIPT.distributionType.undo) {
                if (params.businessIds instanceof Array && params.businessIds.length > 0) {
                    await businessDAO.deleteUnionBusinessManuscript(connection, {
                        manuscriptId: params.id,
                        businessBatch: params.businessIds
                    });
                }
            }
        });
    }

    // 删除
    static async delete(params) {
        return await dao.manageTransactionConnection(async (connection) => {
            return await manuscriptDAO.update(connection, { id: params.id, deleted: MANUSCRIPT.delete.isDelete });
        });
    }


    // 启用禁用
    static async enable(params) {
        return await dao.manageTransactionConnection(async (connection) => {
            return await manuscriptDAO.update(connection, { id: params.id, enable: params.enable });
        });
    }

    /**
     * 获取发布设置
     * @param {*} params {relationId:''}
     */
    static async publishSetting(params) {
        return await dao.manageConnection(async (connection) => {
            let result = (await manuscriptDAO.get(connection, { id: params.relationId })) || {}
            return {
                name: result.name,
                description: result.description,
                keywords: []
            };
        });
    }

    static async QRcode(params) {

        params.appid = 'wx4226d717697ce3f7'
        params.secret = 'c35ee32e8062e282254861b3d6e4efd9'
        if (!params.appid)
            return Promise.reject(Exception.BusinessException('appid不能为空', 1))
        if (!params.secret)
            return Promise.reject(Exception.BusinessException('secret不能为空', 2))
        if (!params.scene)
            return Promise.reject(Exception.BusinessException('scene不能为空', 3))
        if (params.scene.length > 32)
            return Promise.reject(Exception.BusinessException('scene字符长度不能超过32位', 3))
        if (!params.page)
            return Promise.reject(Exception.BusinessException('页面路径不能为空', 4))
        if (params.page.indexOf('/') == 0)
            params.page = params.page.substring(1, params.page.length - 1)
        var key = 'token:' + params.appid
        var token = await redis.get(key)
        if (!token)
            token = await this.getToken(params)

        redis.set(key, token, 2 * 60 * 60)
        params.token = token
        // var data = await this.getQRcode(params)


        return await msUtil.getQRcode(params)
    }


    static async getToken(params) {
        let reqInfo = {
            url: wxApi.getToken.replace('{0}', params.appid).replace('{1}', params.secret),
            method: "GET",
            json: true,
        }

        return new Promise((resolve, reject) => {
            request(reqInfo, (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                var access_token = body.access_token

                return resolve(access_token)
            })
        })
    }

}

module.exports = biz;