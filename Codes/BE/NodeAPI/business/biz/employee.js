'use strict';
let
    mscore = require("mscore"),
    dao = mscore.dao,
    redis = mscore.redis,
    Exception = mscore.Exception,
    UUID = require('uuid'),
    employeeDAO = global.require('./business/dao/employee'),
    businessDao = require('../dao/business'),
    _ = require('lodash'),
    microservice = global.require('./utils/microservice'),
    EMPLOYEE = global.require("./constant/employee");

class biz {

    // 获取员工信息
    static async get(params) {
        return await dao.manageConnection(async (connection) => {
            let result = await employeeDAO.get(connection, { id: params.id, phone: params.phone })
            return result;
        });
    }

    static async search(params) {
        return await dao.manageConnection(async (connection) => {
            let options = {
                businessId: params.businessId,
                pageIndex: params.pageIndex ? params.pageIndex : 1,
                pageSize: params.pageSize ? params.pageSize : 10,
                keyWords: params.keyWords,
                state: params.state,
                orderBy: params.orderBy
            };
            if (!!params.manuscriptId) {
                options.manuscriptId = params.manuscriptId;
                return await employeeDAO.searchWithActivity(connection, options)
            } else {
                let result, ids = [], infos;
                // 查询，并获取用户头像信息
                result = await employeeDAO.search(connection, options)
                result.list.forEach((i) => {
                    if (!!i.userId) ids.push(i.userId);
                });
                if (ids.length > 0) {
                    infos = await microservice.batchUserInfo({ ids: ids })
                    result.list.forEach((i) => {
                        if (infos[i.userId])
                            i.userFace = infos[i.userId].user_face;
                    });
                }
                return result;
            }
        });
    }

    static async create(params) {
        return await dao.manageTransactionConnection(async (connection) => {
            // 商铺信息
            let businessInfo = await employeeDAO.getBusiness(connection, params.businessId);
            // 该商铺下现有的员工数量
            let count = await employeeDAO.getEmployeesCount(connection, params.businessId);

            if (!businessInfo) return Promise.reject(Exception.BusinessException('商铺信息不存在'));
            if (count >= businessInfo.staffCount) return Promise.reject(Exception.BusinessException('该商铺可创建员工数已满'));

            // 校验手机号是否重复
            params.id = UUID.v1();
            let repeat = await employeeDAO.checkInfo(connection, params);
            if (repeat > 0) return Promise.reject(Exception.BusinessException('该手机号已绑定其他商家, 请尝试更换其他手机号', -1001));

            var obj = {
                empl_id: params.id,
                empl_business_id: params.businessId,
                empl_name: params.name,
                empl_phone: params.phone,
                empl_state: params.state ? params.state : 0
            }
            return await employeeDAO.insert(connection, obj);
        });
    }

    static async update(params) {
        return await dao.manageTransactionConnection(async (connection) => {
            // 检验修改后的手机号是否存在
            let repeat = await employeeDAO.checkInfo(connection, params);
            if (repeat > 0) return Promise.reject(Exception.BusinessException('该手机号已绑定其他商家, 请尝试更换其他手机号', -1001));

            var obj = {
                empl_business_id: params.businessId,
                empl_name: params.name,
                empl_phone: params.phone,
                empl_state: params.state ? params.state : 0
            }
            return await employeeDAO.update(connection, { id: params.id, obj: obj });
        });
    }

    static async modify(params) {
        return await dao.manageTransactionConnection(async (connection) => {
            var options = { ids: params.ids, obj: {} };
            switch (params.field) {
                case "state":
                    options.obj.empl_state = params.value;
                    break;
                case "delete":
                    options.obj.empl_delete = params.value;
                    break;
            }
            let result = await employeeDAO.batchUpdate(connection, options)
            return result;
        });
    }

    /**
     * 分派
     * @param {*} params 
     */
    static async distribute(params) {
        return await dao.manageTransactionConnection(async (connection) => {

            // 如果指派范围为全部(查询当前启用中的所有员工)
            if (parseInt(params.range) === EMPLOYEE.range.all) {
                let list = await employeeDAO.getList(connection, { businessId: params.businessId, state: EMPLOYEE.state.normal });
                params.employeeId = list.map(i => i.id);
            }

            switch (params.distribution) {
                // 撤销：
                case EMPLOYEE.distribution.undo:
                    await employeeDAO.deleteUnionEmployeeManuscript(connection, params);
                    break;
                // 分派
                case EMPLOYEE.distribution.dispatch:
                    var batch = [];
                    if (params.employeeId instanceof Array) {
                        params.employeeId.forEach(i => {
                            batch.push({
                                businessId: params.businessId,
                                manuscriptId: params.manuscriptId,
                                employeeId: i
                            });
                        });
                    } else {
                        batch.push({
                            businessId: params.businessId,
                            manuscriptId: params.manuscriptId,
                            employeeId: [params.employeeId]
                        });
                    }
                    if (batch.length > 0) {
                        await employeeDAO.batchUnionEmployeeManuscript(connection, { batch: batch });
                    }
                    break;
                default:
                    break;
            }
        })
    }

    static async getInfo(params) {


        return await dao.manageConnection(async (connection) => {
            let retData = {}
            return employeeDAO.get(connection, { id: params.employeeId })
                .then(result => {
                    if (result.length <= 0)
                        return Promise.reject(Exception.BusinessException('没有查询到员工', 1))
                    var emplData = result[0]
                    if (emplData.state == 1)
                        return Promise.reject(Exception.businessId('员工已经被禁用', 2))
                    if (emplData.userId == undefined || emplData.userId != params.userId)
                        return Promise.reject(Exception.BusinessException('用户只能查询和自己绑定的员工信息', 5))
                    retData = _.extend(emplData)
                    delete retData.userId
                    return businessDao.getBusiness(connection, { businessId: emplData.businessId })
                })
                .then(result => {
                    if (result.length <= 0)
                        return Promise.reject(Exception.BusinessException('数据异常，没有查询到该员工的公司信息', 3))
                    var businessData = result[0]
                    if (businessData.state == 1)
                        return Promise.reject(Exception.BusinessException('商家已经被禁用', 4))
                    // *         "totalShare": 0, // 累计分享
                    // *         "totalVisitor": 0,// 累计访客
                    // *         "totalAccess": 0, // 累计浏览
                    retData.businessName = businessData.businessName
                    retData.businessCover = businessData.businessCover
                    retData.businessLogo = businessData.businessLogo
                    retData.totalShare = 100
                    retData.totalVisitor = 101
                    retData.totalAccess = 102
                    return retData
                })
        })
    }
}

module.exports = biz;