'use strict';

let mscore = require("mscore"),
    exception = mscore.Exception,
    str = global.require("./utils/stringHelper"),
    microservice = global.require('./utils/microservice'),
    expression = global.require("./constant/expression"),
    tools = global.require('./utils/tools'),
    BUSINESS = global.require('./constant/business'),
    businessBiz = global.require('./business/biz/business');

class ctrl {
    static async getBusiness(params) {
        if (!params || str.isEmpty(params.businessId)) {
            throw new exception('商家ID不能为空')
        }
        return await businessBiz.getBusiness(params)
    }

    static async saveBusiness(params) {
        if (!expression.phone.test(params.businessPhone)) {
            throw exception.BusinessException('账号格式不正确')
        }
        // 密码强度
        if (!!params.voucher && tools.pwdRating(params.voucher) < 2) {
            throw exception.BusinessException('密码不符合要求，大写+小写+数字+字符（至少包含2种）')
        }

        if (params.businessType == BUSINESS.type.business) {
            if (!expression.businessName.test(params.businessName)) {
                throw exception.BusinessException('公司名称格式不正确')
            }
            return await businessBiz.saveBusiness(params)
        }
        if (params.businessType == BUSINESS.type.designer) {
            if (!expression.name.test(params.businessName)) {
                throw exception.BusinessException('设计师姓名格式不正确')
            }
            return await businessBiz.saveDesigner(params)
        }
        return true;
    }

    static async searchBusiness(params) {
        if (!params) {
            throw new exception('参数不能为空')
        }
        return await businessBiz.searchBusiness(params)
    }

    static async openBusiness(params) {
        if (!params) {
            throw new exception('参数不能为空')
        }
        return await businessBiz.openBusiness(params)
    }

    static async disableBusiness(params) {
        if (!params) {
            throw new exception('参数不能为空')
        }
        return await businessBiz.disableBusiness(params)
    }

    static async saveUnion(params) {
        if (!params) {
            throw new exception('参数不能为空')
        }
        return await businessBiz.saveUnion(params)
    }

    static async logonBusiness(params) {
        if (!params) {
            throw new exception('参数不能为空')
        }
        return await businessBiz.logonBusiness(params);
    }

    static async delete(params) {
        if (!params) {
            throw new exception('参数不能为空')
        }
        return await businessBiz.delete(params)
    }

    /**
     * 登录验证(基本用户验证)
     * @param {*} params { sessionId : '' }
     */
    static async verify(params) {
        if (!params) {
            throw new exception('参数不能为空')
        }
        return await microservice.verify(params)
    }

    /**
     * B端用户登录验证, 带businessInfo
     * @param {*} params { sessionId : '' }
     */
    static async verifyBusiness(params) {
        if (!params) {
            throw new exception('参数不能为空')
        }
        var user = await microservice.verify(params);
        params.userId = user.userUuid;
        user.businessInfo = await businessBiz.getBusinessInfoFormRedis(params);
        return user;
    }

    static async getBusinessInfoFormRedis(params) {
        if (!params) {
            throw new exception('参数不能为空')
        }
        return await businessBiz.getBusinessInfoFormRedis(params);
    }
}

module.exports = ctrl;