'use strict';
let
    mscore = require("mscore"),
    dao = mscore.dao,
    redis = mscore.redis,
    locker = mscore.locker,
    exception = mscore.Exception,
    _ = require('underscore'),
    UUID = require('uuid'),
    request = require('request'),
    tools = global.require('./utils/tools'),
    BUSINESS = global.require("./constant/business"),
    businessDao = global.require('./business/dao/business'),
    microservice = global.require('./utils/microservice'),
    config = global.require('./config/system-config');

class biz {
    //获取商家详细信息
    static async getBusiness(params) {
        return await dao.manageConnection(async (connection) => {
            //获取商家主要业务信息
            var result = await businessDao.getBusiness(connection, params);
            if (result && result.length > 0) {
                result[0].items = [];
                if (!!result[0].secret) {
                    //数据来源 短信微服务
                    let sms = await microservice.businessSearchSms({ secret: result[0].secret, userId: result[0].userId });
                    if (!!sms) {
                        result[0].smsCount = sms.resGiveTotal;
                        result[0].smsUsed = (sms.resGiveTotal - sms.resGiveRemainder);
                    } else {
                        result[0].smsCount = 0;
                        result[0].smsUsed = 0;
                    }
                }
                let count = await businessDao.getBusinessManuscriptCount(connection, result[0].userId)
                result[0].extensionCount = count[0].count;
                //获取商家方案信息 遍历封装 （前台需要这个数据结构，暂时丢在服务器端，如后期需要优化可考虑前端进行该操作）
                // var resultItem = await businessDao.getUnionBusinessManuscript(connection, params)
                // resultItem.forEach(async (item) => {
                //     result[0].items.push(item.manuscriptId);
                // });
            }
            return result;
        })
    }

    //登录
    static async logonBusiness(params) {
        let reqInfo = {
            url: BUSINESS.userapi.logon,
            method: "POST",
            json: true,
            body: {
                user_account: params.user_account,
                user_password: params.user_password,
            }
        }
        return new Promise(async (resolve, reject) => {
            request(reqInfo, async (err, response, result) => {
                if (err) {
                    reject(err)
                    return;
                }
                if (result.status != 0) {
                    return reject(exception.InterfaceException(result.message, result.status, response.statusCode))
                }
                let sessionID = result.data.session_id;
                return await dao.manageConnection(async (connection) => {
                    result.data.data.forEach(async (item) => {
                        //获取 本系统B端用户
                        let itemResult = {};
                        if (item.user_reg_project_id == config.systemCode) {
                            params.userId = item.user_uuid;
                            itemResult.sessionId = sessionID;
                            itemResult.userUuid = item.user_uuid
                            itemResult.userLoginTimes = item.user_login_times
                            itemResult.userLastLoginTime = item.user_last_login_time
                            itemResult.userId = item.user_id
                            itemResult.userFace = item.user_face
                            itemResult.userMerchantId = item.user_merchant_id
                            itemResult.userNickname = item.user_nickname
                            itemResult.userRegClienttype = item.user_reg_clienttype
                            itemResult.userRegProjectId = item.user_reg_project_id
                            itemResult.userSalt = item.user_salt
                            itemResult.userAccount = item.user_account
                            itemResult.userAsAnswer = item.user_as_answer
                            itemResult.userAsQuestion = item.user_as_question

                            itemResult.userBirthday = item.user_birthday
                            itemResult.userMail = item.user_mail
                            itemResult.userMobile = item.user_mobile
                            itemResult.userName = item.user_name
                            itemResult.userSex = item.user_sex

                            params.businessType = params.user_type;
                            var result = await businessDao.getBusiness(connection, params);
                            if (!result || result.length <= 0) {
                                return reject(exception.BusinessException('该用户不存在'));
                            }
                            if (BUSINESS.state.disable == result[0].state) {
                                return reject(exception.BusinessException('该用户已禁用'));
                            }
                            itemResult.businessInfo = result[0];
                            // 存储商户数据到redis中
                            await redis.set('business:' + sessionID, itemResult.businessInfo, 60 * 60 * 2);
                            resolve(itemResult);
                            return;
                        }
                    });
                })
            })
        })
    }

    /**
     * 从redis中获取商户信息，如果不存在，从数据库中重新获取
     * @param {*} params{ sessionId:'', userId:''} 
     */
    static async getBusinessInfoFormRedis(params) {
        let key = 'business:' + params.userId;
        return dao.manageConnection(async (connection) => {
            if (!!await redis.keyExist(key)) {
                return JSON.parse(await redis.get(key));
            } else {
                var result = await businessDao.getBusiness(connection, params);
                if (!result || result.length <= 0) {
                    return Promise.reject(exception.BusinessException('该用户不存在'));
                }
                if (BUSINESS.state.disable == result[0].state) {
                    return Promise.reject(exception.BusinessException('该用户已禁用'));
                }
                await redis.set(key, result[0], 60 * 60 * 2);
                return result[0];
            }
        });
    }

    // 保存/更新 设计师信息
    static async saveDesigner(params) {
        return await dao.manageTransactionConnection(async (connection) => {

            // 如果包含ID 则为修改
            if (params.businessId) {
                var businessResult = await businessDao.getBusiness(connection, { businessId: params.businessId });
                if (!businessResult || businessResult.length <= 0) {
                    return Promise.reject(exception.BusinessException('该用户不存在'));
                }
                params.businessId = businessResult[0].businessId;
                params.userId = businessResult[0].userId;
                // 如果手机号修改了,调用微服务修改账号
                if (params.businessPhone != businessResult[0].businessPhone || !!params.voucher) {
                    await biz.apiUpdateAccount(params);
                }
                await businessDao.updateBusiness(connection, params);
            } else {
                // 调用微服务创建商家以及默认关联的账号
                let result = await biz.apiCreateAccount(params);
                params.businessId = UUID.v1();
                params.userId = result.data.user_uuid;
                // 数据存储
                await businessDao.insertBusiness(connection, params);
            }
            return true;
        })
    }

    // 保存/修改 商家信息
    static async saveBusiness(params) {
        return await dao.manageTransactionConnection(async (connection) => {

            // 如果包含ID 则为修改
            if (params.businessId) {
                var businessResult = await businessDao.getBusiness(connection, { businessId: params.businessId });
                if (!businessResult || businessResult.length <= 0) {
                    return Promise.reject(exception.BusinessException('该用户不存在'));
                }
                if (businessResult[0].smsCount > params.smsCount) {
                    return Promise.reject(exception.BusinessException('短信不能小于现有数量'));
                }
                if (businessResult[0].staffCreated > params.staffCount) {
                    return Promise.reject(exception.BusinessException('人员数量不能小于已创建的人员数量'));
                }

                if (!!businessResult[0].secret) {
                    // 增量短信
                    await microservice.businessGiveSms({
                        secret: businessResult[0].secret,
                        userId: businessResult[0].userId,
                        count: (params.smsCount - businessResult[0].smsCount)
                    });
                }

                params.businessId = businessResult[0].businessId;
                params.userId = businessResult[0].userId;
                // 如果手机号修改了,调用微服务修改账号
                if (params.businessPhone != businessResult[0].businessPhone || !!params.voucher) {
                    await biz.apiUpdateBusiness(params);
                }
                await businessDao.updateBusiness(connection, params);

                // 修改时候遍历distribution为0的模板，执行删除操作
                if (params.items instanceof Array && params.items.length > 0) {
                    // 需要删除的方案
                    let delIds = _.filter(params.items, (i) => { return i.distribution == 0 });
                    if (delIds.length > 0)
                        await businessDao.deleteUnionBusinessManuscript(connection, {
                            businessId: params.businessId,
                            manuscriptBatch: delIds.map(r => r.id)
                        });
                }
            } else {
                // 验证公司名称是否存在
                let check = await businessDao.getBusiness(connection, {
                    businessName: params.businessName,
                    businessType: BUSINESS.type.business
                });
                if (check && check.length > 0) {
                    return Promise.reject(exception.BusinessException('公司名称已存在'));
                }

                // 调用微服务创建商家以及默认关联的账号
                let result = await biz.apiCreateBusiness(params);
                params.businessId = result.data.merchant_id;
                params.userId = result.data.user.user_uuid;
                params.secret = result.data.secrets[0].secret;

                if (!!params.secret) {
                    // 增量短信
                    await microservice.businessGiveSms({
                        secret: params.secret,
                        userId: params.userId,
                        count: params.smsCount ? params.smsCount : 0
                    });
                }

                // 数据存储
                await businessDao.insertBusiness(connection, params);
            }

            //遍历方案信息 写入数据库
            if (params.items instanceof Array && params.items.length > 0) {
                // 需要添加的方案
                let insertIds = _.filter(params.items, (i) => { return i.distribution == 1 });
                // 批量导入
                var batch = []
                    , list = []
                    , l = insertIds.length;
                insertIds.forEach((item, i) => {
                    batch.push({ businessId: params.businessId, manuscriptId: item.id });
                    if ((i + 1) % 20 == 0 || (i + 1) == l) {
                        list.push((async (arg) => {
                            await businessDao.batchUnionBusinessManuscript(connection, { batch: arg });
                        })(batch));
                        batch = new Array();
                    }
                });
                await Promise.all(list);
            }
            return true;
        })
    }

    /**
     * 调用微服务创建商户账号
     */
    static async apiCreateBusiness(params) {
        let reqInfo = {
            url: BUSINESS.userapi.register,
            method: "POST",
            json: true,
            body: {
                company_name: params.businessName,
                contact: params.businessName,
                logo: params.businessLogo,
                phone: params.businessPhone,
                account: params.businessPhone,
                password: params.voucher,
                projects: [{ project_id: config.systemCode, project_name: config.systemCode }]
            }
        }
        return new Promise(async (resolve, reject) => {
            request(reqInfo, async (err, response, result) => {
                if (err) return reject(err)
                if (result.status != 0) {
                    return reject(exception.InterfaceException(result.message, result.status, response.statusCode))
                }
                resolve(result);
            })
        })
    }

    /**
     * 调用微服务修改商户信息
     */
    static async apiUpdateBusiness(params) {
        let reqInfo = {
            url: BUSINESS.userapi.update,
            method: "POST",
            json: true,
            body: {
                userId: params.userId,
                account: params.businessPhone,
                phone: params.businessPhone,
                logo: params.businessLogo,
                password: params.voucher,
                merchant_id: params.businessId
            }
        }
        return new Promise(async (resolve, reject) => {
            request(reqInfo, async (err, response, result) => {
                if (err) return reject(err)
                if (result.status != 0) {
                    return reject(exception.InterfaceException(result.message, result.status, response.statusCode))
                }
                resolve(result);
            })
        })
    }

    /**
     * 调用微服务创建普通账号
     */
    static async apiCreateAccount(params) {
        let reqInfo = {
            url: BUSINESS.userapi.signup,
            method: "POST",
            json: true,
            body: {
                user_account: params.businessPhone,
                user_password: params.voucher
            }
        }
        return new Promise(async (resolve, reject) => {
            request(reqInfo, async (err, response, result) => {
                if (err) return reject(err)
                if (result.status != 0) {
                    return reject(exception.InterfaceException(result.message, result.status, response.statusCode))
                }
                resolve(result);
            })
        })
    }

    /**
     * 调用微服务创建普通账号
     */
    static async apiUpdateAccount(params) {
        let reqInfo = {
            url: BUSINESS.userapi.changeAccount,
            method: "POST",
            json: true,
            body: {
                user_uuid: params.userId,
                user_account: params.businessPhone,
                user_password: params.voucher
            }
        }
        return new Promise(async (resolve, reject) => {
            request(reqInfo, async (err, response, result) => {
                if (err) return reject(err)
                if (result.status != 0) {
                    return reject(exception.InterfaceException(result.message, result.status, response.statusCode))
                }
                resolve(result);
            })
        })
    }

    // 简单函数
    static async searchBusiness(params) {
        return await dao.manageConnection(async (connection) => {
            var res = await businessDao.searchBusinessCount(connection, params);
            let data = {
                total: res[0]["total"],
                data: await businessDao.searchBusiness(connection, params)
            };
            return data;

        })
    }

    // 简单函数
    static async disableBusiness(params) {
        return await dao.manageConnection(async (connection) => {
            if (params && params.businessId) {
                let param = {
                    state: BUSINESS.state.disable,
                    businessId: params.businessId
                }
                //更新商家信息
                await businessDao.updateBusiness(connection, param);
            }
        })
    }

    static async openBusiness(params) {
        return await dao.manageConnection(async (connection) => {
            if (params && params.businessId) {
                let param = {
                    state: BUSINESS.state.normal,
                    businessId: params.businessId
                }
                //更新商家信息
                await businessDao.updateBusiness(connection, param);
            }
        })
    }

    static async saveUnion(params) {
        return await dao.manageConnection(async (connection) => {
            if (params.items && params.items.length > 1) {
                params.items.forEach(async (item) => {
                    let itemparam = { manuscriptId: item, businessId: params.businessId };
                    await businessDao.insertUnionBusinessManuscript(connection, itemparam);
                });
            }
        })
    }

    /**
     * 删除
     * @param {*} params 
     */
    static async delete(params) {
        return await dao.manageConnection(async (connection) => {
            // 查询
            var info = await businessDao.getBusiness(connection, params);
            if (!info || info.length == 0) return false; // 账号信息不存在
            if (info[0].businessType === BUSINESS.type.designer) {
                // 调用接口 info[0].userId
                await microservice.userDelete({ user_uuid: info[0].userId });
                await businessDao.deleteBusiness(connection, params);
            }
            return true;
        })
    }

    /**
     * 是否存在商户
     * @param {*} params 
     */
    static async isExistBusiness(params) {
        return await dao.manageConnection(async (connection) => {
            return await businessDao.isExistBusiness(connection, { businessId: params.businessId })
        })
    }

}

module.exports = biz;