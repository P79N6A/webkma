'use strict';
let
    mscore = require("mscore"),
    dao = mscore.dao,
    exception = mscore.Exception,
    _ = require('underscore'),
    analysisDao = global.require('./business/dao/analysis'),
    microservice = global.require('./utils/microservice'),
    config = global.require('./config/system-config');

class biz {

    /**
     * 同步所有数据
     * @param {*} params {}
     */
    static async syncAnalysis(params) {
        let list = await dao.manageConnection(async (connection) => {
            return await analysisDao.getBusinessList(connection);
        });
        let arr = [];
        list.forEach((i) => {
            arr.push((async (arg) => {
                await this.syncAnalysisBusiness(arg);
            })(i));
        });
        await Promise.all(arr);
        return true;
    }

    /**
     * 同步某个店铺数据
     * @param {*} params {businessId: '', userId: ''}
     */
    static async syncAnalysisBusiness(params) {
        return dao.manageTransactionConnection(async (connection) => {
            // 查询活动列表
            let activitys = await analysisDao.getManuscriptList(connection, params);
            if (activitys.length > 0) {
                let arg = { ids: activitys.map(i => i.id) };
                await biz.insertAll(arg, connection);
                await biz.insertRelease(arg, connection)
            }

            // 查询员工列表
            let employees = await analysisDao.getEmployeeList(connection, params);
            if (employees.length > 0) {
                await biz.insertEmployee({ ids: employees.map(i => i.empl_id) }, connection)
            }
            return true;
        });
    }

    /**
     * 批量导入数据(总)
     * @param {*} params {ids:[]}
     */
    static async insertAll(params, connection) {
        // 调用微服务获取数据
        let data = await microservice.analysisTypeAll({ belongModule: params.ids });
        // 遍历组合数据
        let batch = [];
        data.group.forEach(i => {
            batch.push({
                manuscriptId: i.as_belong_module,
                shareUserId: i.as_belong_user,
                visitor: i.scan_visitor,
                access: i.scan_access,
                share: i.scan_share
            });
        });
        if (batch.length > 0) {
            // 批量插入数据
            if (!!connection) return await analysisDao.insertAll(connection, batch);
            return await dao.manageTransactionConnection(async (connection) => {
                return await analysisDao.insertAll(connection, batch);
            })
        }
        return true;
    }

    /**
     * 批量导入数据(活动)
     * @param {*} params {ids:[]}
     */
    static async insertRelease(params, connection) {
        // 调用微服务获取数据
        let data = await microservice.analysisType({ belongModule: params.ids, list: true }, 'belongModule');
        // 遍历组合数据
        let batch = [];
        data.group.forEach(i => {
            if (!!i.key) {
                batch.push({
                    manuscriptId: i.key,
                    visitor: i.scan_visitor,
                    access: i.scan_access,
                    share: i.scan_share
                });
            }
        });
        if (batch.length > 0) {
            // 批量插入数据
            if (!!connection) return await analysisDao.insertRelease(connection, batch);
            return await dao.manageTransactionConnection(async (connection) => {
                return await analysisDao.insertRelease(connection, batch);
            });
        }
        return true;
    }

    /**
     * 批量导入数据(员工)
     * @param {*} params {ids:[]}
     */
    static async insertEmployee(params, connection) {
        // 调用微服务获取数据
        let data = await microservice.analysisType({ belongUser: params.ids, list: true });
        // 遍历组合数据
        let batch = [];
        data.group.forEach(i => {
            if (!!i.key) {
                batch.push({
                    shareUserId: i.key,
                    visitor: i.scan_visitor,
                    access: i.scan_access,
                    share: i.scan_share
                });
            }
        });
        if (batch.length > 0) {
            // 批量插入数据
            if (!!connection) return await analysisDao.insertEmployee(connection, batch);
            return await dao.manageTransactionConnection(async (connection) => {
                return await analysisDao.insertEmployee(connection, batch);
            })
        }
        return true;
    }

}

module.exports = biz;