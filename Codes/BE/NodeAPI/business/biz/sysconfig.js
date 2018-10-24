'use strict';
let mscore = require("mscore"),
    dao = mscore.dao,
    redis = mscore.redis,
    locker = mscore.locker,
    _ = require('underscore'),
    sysconfigDao = global.require('./business/dao/sysconfig');

class biz {
    // 简单函数
    static async getConfig(params) {
        return await dao.manageConnection(async (connection) => {
            return sysconfigDao.getConfig(connection, params)
        })
    }

    // 简单函数
    static async saveConfig(params) {
        return await dao.manageConnection(async (connection) => {
            if (params && params.length > 1) {
                params.forEach(async (item) => {
                    if (item.id) {
                        await sysconfigDao.updateConfig(connection, item)
                    } else {
                        await sysconfigDao.insertConfig(connection, item)
                    }
                });
                // _.each(params, async (item) => {

                // });
            } else {
                if (params.id) {
                    sysconfigDao.updateConfig(connection, params)
                } else {
                    sysconfigDao.insertConfig(connection, params)
                }
            }

        })
    }
    // 简单函数
    static async deleteConfig(params) {
        return await dao.manageConnection(async (connection) => {
            if (params && params.length > 1) {
                params.forEach(async (item) => {
                    if (item.id) {
                        await sysconfigDao.deleteConfig(connection, item)
                    }
                })
                // _.each(params, async (item) => {

                // });
            } else {
                if (params.id) {
                    sysconfigDao.deleteConfig(connection, params)
                }
            }
        })
    }
}

module.exports = biz;