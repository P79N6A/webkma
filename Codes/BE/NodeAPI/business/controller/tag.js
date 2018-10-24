'use strict';

let mscore = require("mscore"),
    tagBiz = global.require('./business/biz/tag'),
    TAG = global.require('./constant/tag')

class ctrl {
    // 获取单个标签
    static async get(params) {
        return await tagBiz.get(params)
    }
    // 获取素材标签列表
    static async getListOfMaterial(params) {
        return await tagBiz.getList(Object.assign(params, {
            type: TAG.type.material
        }))
    }
    // 获取模板标签列表
    static async getListOfTemplate(params) {
        return await tagBiz.getList(Object.assign(params, {
            type: TAG.type.template
        }))
    }
    static async getListOfUseMaterial(params) {
        return await tagBiz.getUseList(Object.assign(params, {
            type: TAG.type.material
        }))
    }
    // 创建标签
    static async create(params) {
        return await tagBiz.create(Object.assign(params, {
            type: TAG.type[params.type],
            operator: "SessionUserId"
        }))
    }
    // 修改标签
    static async update(params) {
        return await tagBiz.update(Object.assign(params, {
            type: TAG.type[params.type],
            operator: "SessionUserId"
        }))
    }
    // 排序
    static async sort(params) {
        if(params.data.length == 0) return;
        return await tagBiz.sort(Object.assign(params, {
            operator: "SessionUserId"
        }))
    }
    // 删除标签
    static async delete(params) {
        return await tagBiz.delete(params)
    }
    // 添加标签与素材的关联关系
    static async relation(params) {
        return await tagBiz.relation(params)
    }
    // 通过记录ID解除标签与资源的关联关系
    static async relieveById(params) {
        return await tagBiz.relieve({ id: params.id })
    }
    // 通过标签ID解除该标签关联的所有资源关系
    static async relieveByTag(params) {
        return await tagBiz.relieve({ tagId: params.id })
    }
    // 通过关联ID解除该资源关联的所有标签关系
    static async relieveByRelation(params) {
        return await tagBiz.relieve({ relationId: params.id })
    }
    // 重置素材与标签的关联关系（解除该资源的全部标签关系，再建立新的标签关系）
    static async resetByMaterial(params) {
        return await tagBiz.resetByMaterial(Object.assign(params, {
            operator: "SessionUserId"
        }))
    }
}

module.exports = ctrl;