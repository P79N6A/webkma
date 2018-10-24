'use strict';

let employeeBiz = global.require('./business/biz/employee'),
    userBiz = global.require('./business/biz/user'),
    microservice = global.require('./utils/microservice'),
    EMPLOYEE = global.require("./constant/employee"),
    _ = require('underscore');

class ctrl {

    static async get(params) {
        return await employeeBiz.get(params)
    }

    /**
     * 即时获取最新统计信息的接口
     * @param {*} user 
     * @param {*} params 
     */
    static async searchInstant(user, params) {
        let data, ids, group, list;
        params.businessId = user.businessInfo.businessId;
        // 调用本地数据
        data = await employeeBiz.search(params);
        // 调用微服务(获取统计数据)
        ids = data.list.map(r => r.id);
        group = await microservice.analysisType({
            belongUser: ids,
            belongModule: params.manuscriptId
        });
        // 获取第一次分享时间, 依旧根据用户聚合(统一查询一次)。

        // 遍历获取
        list = [];
        _.each(data.list, (i) => {
            if (group[i.id]) {
                i.totalShare = group[i.id].scan_share;
                i.totalVisitor = group[i.id].scan_visitor;
                i.totalAccess = group[i.id].scan_access;
                i.firstShare = null;
            } else {
                i.totalShare = 0;
                i.totalVisitor = 0;
                i.totalAccess = 0;
                i.firstShare = null;
            }
            list.push(i);
        });
        return data;
    }

    static async search(user, params) {
        params.businessId = user.businessInfo.businessId;
        return await employeeBiz.search(params);
    }

    static async create(user, params) {
        params.businessId = user.businessInfo.businessId;
        let result;
        if (!!params.id) {
            result = await employeeBiz.update(params)
        } else {
            result = await employeeBiz.create(params)
        }
        // 修改绑定表的关联关系
        await userBiz.emplBindPhone({ phone: params.phone });
        return result;
    }

    static async modify(params) {
        return await employeeBiz.modify(params)
    }

    static async delete(params) {
        params.field = 'delete';
        params.value = -1;
        return await employeeBiz.modify(params)
    }

    static async distribute(user, params) {
        params.businessId = user.businessInfo.businessId;
        return await employeeBiz.distribute(params)
    }

    static async getInfo(params) {
        return await employeeBiz.getInfo(params)
    }
}

module.exports = ctrl;