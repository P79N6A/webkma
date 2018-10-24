// 统一微服务调用文件
let request = require('request'),
    _ = require('underscore'),
    mscore = require('mscore'),
    Exception = mscore.Exception,
    tools = global.require('./utils/tools'),
    wxApi = require('../config/system-config').wxApi,
    fs = require('fs'),
    config = global.require('./config/system-config');

const api = {
    // 验证session
    verify: config.host.apiGateway + "api/identify_service/v1/user/token_verify?secret_key=" + config.secret + "&session_id=",
    // 创建uuid
    uuid: config.host.apiGateway + "api/identify_service/v1/uuid/create?secret_key=" + config.secret,
    // 统计分析-记录
    analysisRecord: config.host.apiGateway + "api/analysis_service/v1/analysis/save?secret_key=" + config.secret,
    // 统计分析 - 同步
    analysisTypeAll: config.host.apiGateway + "api/analysis_service/v1/analysis/aggsTypeAll?secret_key=" + config.secret,
    // 统计分析根据所属用户, 类型聚合查询
    analysisTypeByBelongUser: config.host.apiGateway + "api/analysis_service/v1/analysis/aggsTypeByBelongUser?secret_key=" + config.secret,
    // 统计分析根据所属模块, 类型聚合查询
    analysisTypeByBelongModule: config.host.apiGateway + "api/analysis_service/v1/analysis/aggsTypeByBelongModule?secret_key=" + config.secret,
    // 短信验证码验证
    valiCaptcha: config.host.apiGateway + "api/communication_server/v1/sms/vali",
    // 资源购买
    resourcesBuy: config.host.apiGateway + "api/communication_server/v1/resources/buy",
    // 资源赠送
    resourcesGive: config.host.apiGateway + "api/communication_server/v1/resources/give",
    // 资源查询
    resourcesSearch: config.host.apiGateway + "api/communication_server/v1/resources/search",
    // 删除用户
    userDelete: config.host.apiGateway + "api/identify_service/v1/user/delete?secret_key=" + config.secret,
    // 获取商户信息
    business: config.host.apiGateway + "api/identify_service/v1/merchant/secret_verify?secret_key=",
    // 绑定手机号
    changePhone: config.host.apiGateway + "api/identify_service/v1/user/change_mobile?secret_key=" + config.secret,
    // 解除绑定手机号
    removePhone: config.host.apiGateway + "api/identify_service/v1/user/remove_mobile?secret_key=" + config.secret,
    // 文件上传
    fileupload: config.host.apiGateway + "api/assets_service/v1/assets/upload?secret_key=" + config.secret,
    // 通过手机号获取用户信息
    getUserByphone: config.host.apiGateway + "api/identify_service/v1/user/get_userinfo_by_mobile?secret_key=" + config.secret,
    // 批量查询用户信息
    batchUserInfo: config.host.apiGateway + "api/identify_service/v1/user/batch_userinfo?secret_key=" + config.secret,
}

class microservice {

    /**
     * 登录验证 并 返回 当前用户信息
     * @param {*} params "{sessionId:''}"
     */
    // static async verify(params) {
    //     let reqInfo = {
    //         url: api.verify + params.sessionId,
    //         method: "GET",
    //         json: true
    //     }
    //     return new Promise((resolve, reject) => {
    //         request(reqInfo, async (err, res, body) => {
    //             if (err) { return reject(new Error('接口异常')) }
    //             if (res.statusCode != 200) {
    //                 return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
    //             }
    //             // 获取 project_id 为KMA的 用户信息
    //             // TODO 目前只获取第一个, 如果多关联, 后期可能会出现第一个userId 不是KMA数据库中与商户信息绑定的id
    //             var item = _.find(body.data.data, function (i) {
    //                 return i.user_reg_project_id == config.systemCode;
    //             });
    //             if (!item) {
    //                 return reject(Exception.BusinessException('未匹配到属于该项目的用户'));
    //             }
    //             // 用户信息格式转换(对象属性下划线转驼峰)
    //             let itemResult = tools.objToHump(item);
    //             itemResult.sessionId = params.sessionId;
    //             return resolve(itemResult);
    //         });
    //     });
    // }

    /**
     * 登录验证 并 返回 当前用户信息
     * @param {Object} params "{}"
     * @param {Object} ctx
     */
    static async verify(params, ctx) {
        const userInfo = ctx.session.data;
        if (!userInfo || userInfo.length <= 0) {
            throw new Exception('登录超时', 401, 401)
        }
        // 获取 project_id 为KMA的 用户信息
        // TODO 目前只获取第一个, 如果多关联, 后期可能会出现第一个userId 不是KMA数据库中与商户信息绑定的id
        let item = userInfo.find(u => u.user_reg_project_id == config.systemCode);
        if (!item) {
            throw Exception.BusinessException('该用户没有在推小宝注册');
        }
        // 用户信息格式转换(对象属性下划线转驼峰)
        let itemResult = tools.objToHump(item);
        itemResult.sessionId = ctx.session_id;
        return itemResult;
    }
    /**
     * 创建uuid
     * @param {*} params 
     * demo1:{ module: UUIDTYPE.manuscript } return 1180702000000003
     */
    static async uuid(params) {
        params.count || (params.count = 1)
        let reqInfo = {
            url: api.uuid,
            method: "POST",
            json: true,
            body: {
                module: params.module,
                everyday: params.everyday != null ? params.everyday : true,
                count: params.count,
                format: "{env}{module}{date}{id}",
            }
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                let result = body.data;
                if (params.count == 1) result = body.data[0]
                return resolve(result);
            });
        });
    }

    /**
     * 统计分析记录
     * @param {*} params 
     * type:ANALYSIS.TYPE.VISITOR // 访问数据类型
     * user // 用户信息
     */
    static async analysisRecord(params) {
        let reqInfo = {
            url: api.analysisRecord,
            method: "POST",
            json: true,
            headers: { projectId: config.systemCode },
            body: {
                as_type: params.type,
                as_user: params.user,
                as_address: params.address,
                as_url: params.url,
                as_belong_id: params.belongId,
                as_belong_user: params.belongUser,
                as_belong_module: params.belongModule
            }
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                return resolve(body.data);
            });
        });
    }

    /**
     * 查询统计分析，根据类型聚合
     * @param {*} params 
     */
    static async analysisType(params, type) {
        let reqInfo = {
            url: type == 'belongModule' ? api.analysisTypeByBelongModule : api.analysisTypeByBelongUser,
            method: "POST",
            json: true,
            headers: { projectId: config.systemCode },
            body: {
                as_type: params.type,
                as_belong_id: params.belongId,
                as_belong_user: params.belongUser,
                as_belong_module: params.belongModule,
                start_time: params.start_time,
                end_time: params.end_time
            }
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                // 返回列表
                if (params.list) {
                    return resolve(body.data);
                }
                // 返回对象(默认)
                var obj = { total: body.data.total }
                _.each(body.data.group, (i) => {
                    obj[i.key] = i;
                });
                return resolve(obj);
            });
        });
    }

    static async analysisTypeAll(params, type) {
        let reqInfo = {
            url: api.analysisTypeAll,
            method: "POST",
            json: true,
            headers: { projectId: config.systemCode },
            body: {
                as_belong_module: params.belongModule
            }
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                return resolve(body.data);
            });
        });
    }

    /**
     * 短信验证码验证
     * @param {*} params 
     */
    static async valiCaptcha(params) {
        let reqInfo = {
            url: api.valiCaptcha,
            method: "POST",
            json: true,
            body: {
                phone: params.phone,
                code: params.code
            }
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                return resolve(body.data);
            });
        });
    }

    /**
     * 商家购买短信 {businessId:'', userId:'', count:''}
     */
    static async businessGiveSms(params) {
        params.projectId = config.systemCode;
        params.type = 1; // 短信
        params.identity = 'business'; // 商家
        return await microservice.resourcesGive(params);
    }

    /**
     * 资源购买
     * @param {*} params 
     */
    static async resourcesGive(params) {
        // 资源为0时, 不作购买操作
        if (params.count == 0) return;
        let reqInfo = {
            url: api.resourcesGive,
            method: "POST",
            json: true,
            body: {
                "projectId": params.projectId,
                "secretKey": params.secret,
                "userId": params.userId,
                "count": params.count,
                "type": params.type, // 1短信 2邮件
                "identity": params.identity
            }
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                return resolve(body.data);
            });
        });
    }

    /**
     * 商家购买短信 {businessId:'', userId:'', count:''}
     */
    static async businessBuySms(params) {
        params.projectId = config.systemCode;
        params.type = 1; // 短信
        params.identity = 'business'; // 商家
        return await microservice.resourcesBuy(params);
    }

    /**
     * 资源购买
     * @param {*} params 
     */
    static async resourcesBuy(params) {
        // 资源为0时, 不作购买操作
        if (params.count == 0) return;
        let reqInfo = {
            url: api.resourcesBuy,
            method: "POST",
            json: true,
            body: {
                "projectId": params.projectId,
                "secretKey": params.secret,
                "userId": params.userId,
                "count": params.count,
                "type": params.type, // 1短信 2邮件
                "identity": params.identity
            }
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                return resolve(body.data);
            });
        });
    }

    /**
     * 商家查询短信
     * @param {*} params {userId:''}
     */
    static async businessSearchSms(params) {
        params.projectId = config.systemCode;
        params.type = 1; // 短信
        params.identity = 'business'; // 商家
        return await microservice.resourcesSearch(params);
    }

    /**
     * 资源查询
     * @param {*} params 
     */
    static async resourcesSearch(params) {
        let url = api.resourcesSearch + '?',
            urlParams = [];
        if (!!params.projectId) urlParams.push('projectId=' + params.projectId);
        // if (!!params.businessId) urlParams.push('businessId=' + params.businessId);
        if (!!params.secret) urlParams.push('secretKey=' + params.secret);
        if (!!params.userId) urlParams.push('userId=' + params.userId);
        if (parseInt(params.type) >= 0) urlParams.push('type=' + parseInt(params.type));
        if (!!params.identity) urlParams.push('identity=' + params.identity);

        let reqInfo = {
            url: api.resourcesSearch + '?' + urlParams.join('&'),
            method: "GET",
            json: true
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                if (body.data == '用户没有资源') body.data = null;
                return resolve(body.data);
            });
        });
    }

    /**
     * 删除用户
     * @param {*} params{user_uuid:''} 
     */
    static async userDelete(params) {
        let reqInfo = {
            url: api.userDelete + '&user_uuid=' + params.user_uuid,
            method: "GET",
            json: true
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                return resolve(body.data);
            });
        });
    }

    /**
     * 获取商户信息
     * @param {*} params 
     */
    static async getBusiness(params) {
        let reqInfo = {
            url: api.business + params.secretKey,
            method: "GET",
            json: true
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }

                var item = body.data
                if (!item) {
                    return reject(Exception.BusinessException('未匹配到属于该项目的商户'));
                }
                // 用户信息格式转换(对象属性下划线转驼峰)
                let itemResult = tools.objToHump(item);
                return resolve(itemResult);
            });
        });
    }

    /**
     * 修改手机号
     * 
     * @param {*} params 
     */
    static async changePhone(params) {
        let reqInfo = {
            url: api.changePhone,
            method: "POST",
            json: true,
            headers: {
                session_id: params.sessionId
            },
            body: {
                user_mobile: params.phone,
                user_uuid: params.userId,
                sms_code: params.code
            }
        }
        console.log('sessionId:' + params.sessionId)
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }

                var item = body.data
                if (!item) {
                    return reject(Exception.BusinessException('未匹配到属于该项目的商户'));
                }
                // 用户信息格式转换(对象属性下划线转驼峰)
                let itemResult = tools.objToHump(item);
                return resolve(itemResult);
            });
        });
    }

    /**
     * 手机号
     * 
     * @param {*} params 
     */
    static async removePhone(params) {
        let reqInfo = {
            url: api.removePhone,
            method: "POST",
            json: true,
            headers: {
                session_id: params.sessionId
            },
            body: {
                user_mobile: params.phone,
                user_uuid: params.userId,
                sms_code: params.code
            }
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }

                var item = body.data
                if (!item) {
                    return reject(Exception.BusinessException('未匹配到属于该项目的商户'));
                }
                // 用户信息格式转换(对象属性下划线转驼峰)
                let itemResult = tools.objToHump(item);
                return resolve(itemResult);
            });
        });
    }

    static async getQRcode(params) {
        let reqInfo = {
            url: wxApi.getWxacodeUnLimit.replace('{0}', params.token),
            method: "POST",
            json: true,
            body: {
                scene: params.scene,
                page: params.page
            }
        }
        if (params.width)
            reqInfo.body.width = params.width
        if (params.autoColor)
            reqInfo.body.auto_color = params.autoColor
        if (params.lineColor)
            reqInfo.body.line_color = params.lineColor
        if (params.isHyaline)
            reqInfo.body.is_hyaline = params.isHyaline
        return new Promise((resolve, reject) => {
            request.post(reqInfo).on('response', async function (response) {
                console.log(response.statusCode) // 200
                console.log(response.headers['content-type']) // 'image/png'
                return resolve(await microservice.upload({ file: response, fileName: 'gggg.jpg' }));
            })
        })
    }

    /**
     * 上传文件
     * 
     * @param {*} params 
     */
    static async upload(params) {
        let reqInfo = {
            url: api.fileupload,
            method: "POST",
            json: true,
            formData: {
                fileName: params.fileName,
                file: {
                    value: params.file,
                    options: {
                        filename: 'topsecret.jpg',
                        contentType: params.file.headers['content-type']
                    }
                }
            }
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }

                var item = body.data
                if (!item) {
                    return reject(Exception.BusinessException('未匹配到属于该项目的商户'));
                }
                // 用户信息格式转换(对象属性下划线转驼峰)
                let itemResult = tools.objToHump(item);
                return resolve(itemResult[0]);
            });
        });
    }

    /**
     * 通过手机号获取用户
     * 
     * @param {*} params 
     */
    static async getUserByPhone(params) {
        let reqInfo = {
            url: api.getUserByphone + '&mobile=' + params.phone,
            method: "GET",
            json: true,
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                var item = body.data
                // 用户信息格式转换(对象属性下划线转驼峰)
                let itemResult = tools.objToHump(item);
                return resolve(itemResult);
            });
        });
    }

    /**
     * 通过手机号获取用户
     * 
     * @param {*} params 
     */
    static async batchUserInfo(params) {
        let reqInfo = {
            url: api.batchUserInfo,
            method: "POST",
            json: true,
            body: {
                user_uuids: params.ids
            }
        }
        return new Promise((resolve, reject) => {
            request(reqInfo, async (err, res, body) => {
                if (err) { return reject(new Error('接口异常')) }
                if (res.statusCode != 200) {
                    return reject(Exception.NetWorkException(body.message, body.status, res.statusCode))
                }
                // 转对象
                let obj = {};
                body.data.forEach(i => {
                    obj[i.user_uuid] = i;
                });
                return resolve(obj);
            });
        });
    }
}

module.exports = microservice;