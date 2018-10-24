'use strict';
let
    mscore = require("mscore"),
    dao = mscore.dao,
    Exception = mscore.Exception,
    sysconf = global.require("./config/system-config"),
    constantUtil = global.require("./utils/constant"),
    tagDAO = global.require('./business/dao/tag'),
    TAG = global.require("./constant/tag");

class biz {
    // 获取单个标签
    static async get(params) {
        return await dao.manageConnection(async (connection) => {
            let result = await tagDAO.get(connection, { id: params.id })
            Object.assign(result, {
                type: constantUtil.getEnumKey(TAG.type, result.type),
                useTotal: ((await tagDAO.getUseTotal(connection, { ids: [params.id] }))[0] || {}).useTotal || 0
            })
            return result;
        });
    }

    // 获取标签列表
    static async getList(params) {
        return await dao.manageConnection(async (connection) => {
            let result = await tagDAO.getList(connection, {
                type: params.type,
                search: params.search,
                sortby: params.sortby,
                sequence: params.sequence
            })
            if (result.length > 0) {
                let useTotals = await tagDAO.getUseTotal(connection, { ids: result.map(item => { return item.id }) })
                result.forEach(item => {
                    item.useTotal = (useTotals.filter(row => { return item.id == row.id })[0] || {}).useTotal || 0
                });

                // 排序规则
                let sortBy = "sort",
                    sequence = params.sequence == "asc" ? "asc" : "desc";
                switch (params.sortby) {
                    case "sort": sortBy = "sort"; break;
                    case "total": sortBy = "useTotal"; break;
                }
                result = result.sort((item1, item2) => {
                    if (sequence == "asc") {
                        return item1[sortBy] > item2[sortBy] ? 1 : -1
                    }
                    if (sequence == "desc") {
                        return item1[sortBy] > item2[sortBy] ? -1 : 1
                    }
                })

            }
            return result;
        });
    }

    /**
     * 查询有关联的标签
     * @param {*} params 
     */
    static async getUseList(params) {
        if (!params.sortby)
            params.sortby = 'sort'
        if (!params.sortby == 'total')
            params.sortby = 'useTotal'
        if (!params.sequence)
            params.sequence = 'desc'
        if (!params.pageIndex)
            params.pageIndex = 1
        if (!params.pageSize)
            params.pageSize = 10


        return await dao.manageConnection(async (connection) => {
            return await tagDAO.getUseList(connection, params)
        })
    }

    // 创建标签
    static async create(params) {
        return await dao.manageConnection(async (connection) => {
            let isExist = await tagDAO.exist(connection, { name: params.name });
            if (isExist) throw new Exception("标签名称已存在", -1, 200);
            return await tagDAO.create(connection, {
                name: params.name,
                type: params.type,
                operator: params.operator
            });
        });
    }

    // 修改标签
    static async update(params) {
        return await dao.manageConnection(async (connection) => {
            return await tagDAO.update(connection, {
                id: params.id,
                name: params.name,
                operator: params.operator
            });
        });
    }

    // 排序
    static async sort(params) {
        return await dao.manageConnection(async (connection) => {
            return await tagDAO.sort(connection, { data: params.data, operator: params.operator });
        });
    }

    // 删除标签
    static async delete(params) {
        return await dao.manageConnection(async (connection) => {
            await tagDAO.delete(connection, { id: params.id })
            await tagDAO.relieve(connection, { tagId: params.id })
            return true
        });
    }

    // 添加标签与素材的关联关系
    static async relation(params) {
        return await dao.manageConnection(async (connection) => {
            let tagIds = params.tagId.split(","),
                relationIds = params.relationId.split(","),
                withs = [],
                appends = []
            tagIds.forEach(tagId => {
                relationIds.forEach(relationId => {
                    withs.push({ tagId: tagId, relationId: relationId });
                })
            });
            // 过滤已关联的标签
            let existRelations = await tagDAO.searchRelation(connection, { tagId: params.tagId, relationId: params.relationId })
            withs.forEach(row => {
                if (existRelations.filter(item => { return item.tagId == row.tagId && item.relationId == row.relationId }).length == 0) {
                    appends.push(row);
                }
            })
            // 添加未关联的标签
            if (appends.length > 0) await tagDAO.relation(connection, { data: appends })

            return true;
        });
    }

    // 解除标签与素材的关联关系
    static async relieve(params) {
        return await dao.manageConnection(async (connection) => {
            return await tagDAO.relieve(connection, { id: params.id, tagId: params.tagId, relationId: params.relationId })
        });
    }

    // 重置素材与标签的关联关系（解除该资源的全部标签关系，再建立新的标签关系）
    static async resetByMaterial(params) {
        return await dao.manageConnection(async (connection) => {
            await tagDAO.relieve(connection, { relationId: params.relationId })

            let tagIds = params.tagId.split(","),
                relationIds = params.relationId.split(","),
                withs = []
            tagIds.forEach(tagId => {
                relationIds.forEach(relationId => {
                    withs.push({ tagId: tagId, relationId: relationId });
                })
            });
            return await tagDAO.relation(connection, { data: withs })
        });
    }
}

module.exports = biz;