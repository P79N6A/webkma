'use strict';

let manuscriptBiz = global.require('./business/biz/manuscript'),
    MANUSCRIPT = global.require("./constant/manuscript"),
    businessBiz = global.require('./business/biz/business');

const { Exception } = require('mscore');

class ctrl {
    static async get(params) {
        return await manuscriptBiz.get(params)
    }

    static async getRelease(params) {
        return await manuscriptBiz.getRelease(params)
    }

    static async getListOfDraft(params) {
        return await manuscriptBiz.getList(Object.assign(params, {
            type: MANUSCRIPT.type.draft,
            operator: params.userId
        }))
    }

    static async getListOfTemplate(params) {
        return await manuscriptBiz.getTemplateList(params);
    }

    static async getListOfTemplateBusiness(params) {
        if (parseInt(params.range) == 1 && !params.businessId) {
            params.businessId = (await businessBiz.getBusinessInfoFormRedis({ userId: params.userId })).businessId;
        }
        return await manuscriptBiz.getTemplateListWithBusiness(params);
    }

    static async getListOfRelease(params) {
        return await manuscriptBiz.getList(Object.assign(params, {
            type: MANUSCRIPT.type.release,
            operator: params.userId
        }))
    }

    static async getReleaseList(params) {
        return await manuscriptBiz.getReleaseList(params);
    }

    static async getActivitiesWithRecommended(params) {
        params.recommend = 1;
        params.enable = 1;
        return await manuscriptBiz.getActivitiesWithRecommended(params)
    }
    static async getActivitiesWithJoin(params) {
        // params.recommend = 1;
        return await manuscriptBiz.getActivitiesWithRecommended(params)
    }
    static async getActivitiesWithPromotion(params) {
        return await manuscriptBiz.getActivitiesWithPromotion(params)
    }

    static async recommendActivitiy(params) {
        params.recommend = params.recommend == 0 ? 0 : 1;
        return await manuscriptBiz.recommendActivitiy(params)
    }

    static async create(params) {
        return await manuscriptBiz.create(Object.assign(params, {
            operator: params.userId
        }))
    }

    static async update(params) {
        return await manuscriptBiz.update(Object.assign(params, {
            operator: params.userId
        }))
    }

    static async genTemplate(params) {
        await manuscriptBiz.rechecking({ type: MANUSCRIPT.type.template, name: params.name });
        return await manuscriptBiz.cloneWithLock(Object.assign(params, {
            type: MANUSCRIPT.type.template,
            operator: params.userId
        }))
    }

    static async genPreview(params) {
        return await manuscriptBiz.preview(Object.assign(params, {
            operator: params.userId
        }))
    }

    static async genRelease(params) {
        return await manuscriptBiz.cloneWithLock(Object.assign(params, {
            type: MANUSCRIPT.type.release,
            operator: params.userId
        }))
    }

    static async distTemplate(params) {
        return await manuscriptBiz.distribute(params);
    }

    static async delete(params) {
        return await manuscriptBiz.delete(params);
    }

    static async enable(params) {
        return await manuscriptBiz.enable(params);
    }

    static async publishSetting(params) {
        return await manuscriptBiz.publishSetting(params);
    }

    static async QRcode(params) {
        return await manuscriptBiz.QRcode(params);
    }
}

module.exports = ctrl;