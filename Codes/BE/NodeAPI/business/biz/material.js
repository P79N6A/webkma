'use strict';
let
    request = require("request"),
    fs = require("fs"),
    mscore = require("mscore"),
    dao = mscore.dao,
    redis = mscore.redis,
    Exception = mscore.Exception,
    str = require('../../utils/stringHelper'),
    UUID = require('uuid'),
    materialDao = require('../dao/material'),
    md5 = require('md5'),
    uuidType = require('../../constant/uuid-type'),
    micser = require('../../utils/microservice'),
    _ = require('lodash'),
    moment = require('moment')


class materialBiz {


    static async saveMaterials(list) {
        var returnData = { fail: [], success: [] }
        for (var i = 0; i < list.length; i++) {
            let element = list[i]
            try {
                element.userId = list.userId
                var result = await this.saveMaterial(element)
                returnData.success.push(element.mtrSourceName + ':' + result)
            } catch (error) {

                var message = error instanceof Error ? error.message : error
                returnData.fail.push(element.mtrSourceName + ':' + message)
            }
        }
        return returnData
    }

    static async saveMaterial(params) {
        if (str.isNullOrWhiteSpace(params.mtrSource))
            return Promise.reject(Exception.BusinessException('素材源路径为空'))
        if (str.isNullOrWhiteSpace(params.mtrType))
            return Promise.reject(Exception.BusinessException('素材类型不能为空'))
        if (str.isNullOrWhiteSpace(params.mtrClass))
            return Promise.reject(Exception.BusinessException('素材分类不能为空'))
        if (str.isNullOrWhiteSpace(params.mtrSourceName))
            return Promise.reject(Exception.BusinessException('素材源名称不能为空'))
        if (params.mtrRemark && params.mtrRemark.length > 200)
            return Promise.reject(Exception.BusinessException('素材备注长度不能超过200'))

        let md5Str = ''
        if (params.mtrType == 'svg') {
            if (str.isNullOrWhiteSpace(params.mtrTemplate))
                return Promise.reject(Exception.BusinessException('svg模板文件路径不能为空'))
            if (str.isNullOrWhiteSpace(params.mtrTemplateName))
                return Promise.reject(Exception.BusinessException('svg模板文件名称不能为空'))
            params.mtrId = (await micser.uuid({ module: uuidType.mtrSvg }))
            md5Str = params.mtrSource + params.mtrTemplate
        } else if (params.mtrType == 'img') {
            md5Str = params.mtrSource
            params.mtrId = (await micser.uuid({ module: uuidType.mtrImg }))
        } else {
            return Promise.reject(Exception.BusinessException('素材类型错误'))
        }

        params.mtrMd5 = md5(md5Str)

        return await dao.manageTransactionConnection(async (connection) => {
            return materialDao.searchMaterial(connection, { mtrMd5: params.mtrMd5, mtrClass: params.mtrClass, userId: params.userId, pageIndex: 1, pageSize: 1, sort: 'desc' })
                .then(async data => {
                    if (data.total > 0)
                        return Promise.reject(Exception.BusinessException('该素材资源已上传'))
                    return await materialDao.saveMaterial(connection, params)
                })
        })
    }


    static async searchMaterial(params) {

        if (!params.pageIndex)
            params.pageIndex = 1
        if (!params.pageSize)
            params.pageSize = 10
        if (str.isNullOrWhiteSpace(params.sort))
            params.sort = 'DESC'
        if (params.endTime) {
            params.endTime = moment(params.endTime, 'YYYY-MM-DD').add('day', 1).format().toString()
        }
        params.userId = params.identity == 'own' ? params.userId : '0'


        return await dao.manageConnection(async (connection) => {
            return await materialDao.searchMaterial(connection, params)
        })
    }

    static async updateMaterial(params) {

        if (params.mtrRemark && params.mtrRemark.length > 200)
            return Promise.reject(Exception.BusinessException('素材备注长度不能超过200'))
        return await dao.manageTransactionConnection(async (connection) => {
            if (params.mtrPath) {
                return materialDao.searchMaterial(connection, { mtrMd5: md5(params.mtrPath), mtrClass: params.mtrClass, exitemtrId: params.mtrId, pageIndex: 1, pageSize: 1, sort: 'desc' })
                    .then(async data => {
                        if (data.total > 0)
                            return Promise.reject(Exception.BusinessException('该分类下已存在该图片'))
                        return await materialDao.updateMaterial(connection, params)
                    })
            } else {
                return await materialDao.updateMaterial(connection, params)
            }

        })
    }

    static async deleteMaterial(params) {
        if (params.mtrIds == undefined || params.mtrIds.length <= 0)
            return Promise.reject(Exception.BusinessException('图片id不能为空'))
        if (params.isDelete == undefined)
            params.isDelete = 1
        return await dao.manageTransactionConnection(async (connection) => {
            return await materialDao.deleteMaterial(connection, { isDelete: params.isDelete, mtrIds: params.mtrIds })
        })
    }



    static async searchClass(params) {

        if (!params.pageIndex)
            params.pageIndex = 1
        if (!params.pageSize)
            params.pageSize = 10

        return await dao.manageConnection(async (connection) => {
            return await materialDao.searchClass(connection, params)
        })
    }

}

module.exports = materialBiz