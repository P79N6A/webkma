const
    materialBiz = require('../biz/material')

class materialCtrl {
    //后台上传接口
    static async saveMaterial(params) {
        params.userId = '0'
        if (params && params instanceof Array) {
            return await materialBiz.saveMaterials(params)
        } else {
            return await materialBiz.saveMaterial(params)
        }

    }

    static async saveUserMaterial(params) {
        if (params && params instanceof Array) {
            return await materialBiz.saveMaterials(params)
        } else {
            return await materialBiz.saveMaterial(params)
        }

    }

    static async searchMaterial(params) {
        return await materialBiz.searchMaterial(params)
    }

    static async updateMaterial(params) {
        return await materialBiz.updateMaterial(params)
    }

    static async deleteMaterial(params) {
        return await materialBiz.deleteMaterial(params)
    }


    //class
    static async searchClass(params) {
        return await materialBiz.searchClass(params)
    }
}





module.exports = materialCtrl