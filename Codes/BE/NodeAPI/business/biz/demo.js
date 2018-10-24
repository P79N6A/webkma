'use strict';
let
    mscore = require("mscore"),
    dao = mscore.dao,
    redis = mscore.redis,
    locker = mscore.locker,
    demoDAO = global.require('./business/dao/demo');

class biz {
    // 简单函数
    static async simple(params) {
        return await dao.manageConnection(async (connection) => {
            return demoDAO.getDemo(connection, {})
        })
    }

    // 利用Promise组合业务
    static async promise(params) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await dao.manageConnection(async (connection) => {
                    return demoDAO.getDemo(connection, {})
                })
                // Redis操作
                console.log("redis set data")
                await redis.set("KMA:DemoTest", JSON.stringify(result))

                console.log("redis get data")
                console.log(await redis.get("KMA:DemoTest"))

                console.log("redis update expire")
                await redis.updateExpire("KMA:DemoTest", 600)

                console.log(await redis.keyExist("KMA:DemoTest") ? "redis key is exist" : "redis key is not exist")

                console.log("redis delete key")
                await redis.delete("KMA:DemoTest")

                console.log(await redis.keyExist("KMA:DemoTest") ? "redis key is exist" : "redis key is not exist")

                // 返回数据
                resolve(result)
            } catch (err) {
                reject(err)
            }
        })
    }

    // 利用locker组件包装业务
    static async lock(params) {
        return new Promise(async (resolve, reject) => {
            try {

                let result = await locker.lock({ key: 'lock:demo', ttl: 1000 }, async () => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            // DB操作
                            let result = await dao.manageConnection(async (connection) => {
                                return demoDAO.getDemo(connection, {})
                            })

                            // Redis操作
                            await redis.set("KMA:DemoTest", JSON.stringify(result))
                            console.log(await redis.get("KMA:DemoTest"))
                            await redis.delete("KMA:DemoTest")

                            // 返回数据
                            resolve(result)
                        } catch (err) {
                            reject(err)
                        }
                    })
                })

                resolve(result);
            } catch (err) {
                reject(err);
            }
        })
    }
}

module.exports = biz;