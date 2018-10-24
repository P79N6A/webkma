'use strict';
let
    mscore = require("mscore"),
    dao = mscore.dao,
    redis = mscore.redis,
    locker = mscore.locker,
    dataFormat = mscore.data,
    Exception = mscore.Exception,
    userDao = require('../dao/user'),
    employeeDao = require('../dao/employee'),
    businessDao = require('../dao/business'),
    USER = global.require('./constant/user'),
    str = require('../../utils/stringHelper'),
    business = require('./business'),
    micser = require('../../utils/microservice');

class userBiz {
    // 简单函数
    static async bindPhone(params) {

        if (!str.isPhone(params.phone))
            return Promise.reject(Exception.BusinessException('手机号不能为空'))

        // var isvali = await micser.valiCaptcha({ phone: params.phone, code: params.code })
        // if (isvali != 'success')
        //     return Promise.reject(Exception.BusinessException('短信验证码错误'))

        return await dao.manageTransactionConnection(async (connection) => {

            // 根据手机查询员工信息
            let employeeInfo = await employeeDao.get(connection, { phone: params.phone });
            if (employeeInfo.length > 0) {
                //更新员工信息
                if (employeeInfo[0].userId)
                    return Promise.reject(Exception.BusinessException('用户已经绑定'))

                await employeeDao.update(connection, {
                    obj: {
                        user_id: params.userId
                    },
                    id: employeeInfo[0].id
                })

            }

            await micser.changePhone(params)
        });
    }

    // 更新绑定数据
    static async updateEmployeeBind(params) {
        return dao.manageConnection(async (connection) => {
            // 查询普通用户 (后期放开该权限, 如果员工换公司了, 可以直接修改)
            let bindInfo = await userDao.searchBind(connection, { bind: params.phone, type: USER.bind.normal, pageIndex: 1, pageSize: 10 });
            // 未绑定
            if (!bindInfo || bindInfo.total == 0) return;
            // if (bindInfo[0].businessId == params.businessId) return;
            // 更改商户id
            await userDao.updateBind(connection, { id: bindInfo.list[0].id, businessId: params.businessId, type: USER.bind.employee });
        });
    }

    //解除绑定
    static async unbindPhone(params) {

        //获取userId
        // var isvali = await micser.valiCaptcha({ phone: params.phone, code: params.code })
        // if (isvali != 'success')
        //     return Promise.reject(Exception.BusinessException('短信验证码错误'))

        return await dao.manageTransactionConnection(async (connection) => {
            // 根据手机查询员工信息
            let employeeInfo = await employeeDao.get(connection, { userId: params.userId });
            if (employeeInfo.length > 0) {
                //更新员工信息
                await employeeDao.update(connection, {
                    obj: {
                        user_id: null
                    },
                    id: employeeInfo[0].id
                })
            }
            await micser.removePhone(params)
        })
    }


    static async search(params) {
        if (!params.userId)
            return Promise.reject(Exception.BusinessException('用户没有登录'))
        if (!params.pageIndex)
            params.pageIndex = 1
        if (!params.pageSize)
            params.pageSize = 10


        return await dao.manageConnection(async (connection) => {

            let employeeInfo = await employeeDao.get(connection, { userId: params.userId });
            if (employeeInfo.length > 0 && employeeInfo[0].state == 0) {
                if (employeeInfo[0].userId) {
                    let business = await businessDao.getBusiness(connection, { businessId: employeeInfo[0].businessId })
                    if (business && business.length > 0)
                        return {
                            state: 0,
                            businessState: business[0].state,
                            employeeId: employeeInfo[0].id
                        }

                }

            }

            return { state: 1 }
        })
    }


    static async saveBind(params) {
        // if (!params.businessId)
        //     return Promise.reject(Exception.BusinessException('商户id不能为空'))
        if (!params.userId)
            return Promise.reject(Exception.BusinessException('用户id为空'))
        if (!params.bind)
            return Promise.reject(Exception.BusinessException('绑定的内容为空'))
        if (params.type == undefined || params.type == null)
            return Promise.reject(Exception.BusinessException('绑定的类型不能为空'))

        return await dao.manageTransactionConnection(async (connection) => {
            return userDao.insertBind(connection, params)
        })
    }

    static async updateBind(params) {
        if (!params.id)
            return Promise.reject(Exception.BusinessException('id不能为空'))

        return dao.manageTransactionConnection(async (connection) => {
            return userDao.updateBind(connection, params)
        })
    }

    static async searchBind(params) {

        if (!params.pageIndex)
            params.pageIndex = 1
        if (!params.pageSize)
            params.pageSize = 10

        return dao.manageConnection(async (connection) => {
            return userDao.searchBind(connection, params)
        })
    }

    static async emplBindPhone(params) {
        if (!params.phone)
            return Promise.reject(Exception.BusinessException('员工手机号不能为空', 1))
        return dao.manageTransactionConnection(async (connection) => {
            var user = await micser.getUserByPhone(params)
            if (user) {
                let employeeInfo = await employeeDao.get(connection, { phone: params.phone });
                if (employeeInfo.length > 0) {

                    await employeeDao.update(connection, {
                        obj: {
                            user_id: user.userUuid
                        },
                        id: employeeInfo[0].id
                    })

                }
            }
        })
    }


}

module.exports = userBiz;