'use strict';

let demoBiz = global.require('./business/biz/demo');

class ctrl {
    static async simple(params) {
        return await demoBiz.simple()
    }

    static async promise(params) {
        return new Promise(async (resolve, reject) => {
            try {
                // throw new Error("error test")
                let result = await demoBiz.promise()
                resolve(result)
            } catch (err) {
                reject(err)
            }
        })
    }

    static async lock(params) {
        return await demoBiz.lock()
    }
}

module.exports = ctrl;