let
    MANUSCRIPT = global.require("./constant/manuscript"),
    UUIDTYPE = global.require("./constant/uuid-type"),
    msUtil = global.require("./utils/microservice"),
    uuid = require("uuid"),
    mscore = require("mscore"),
    Exception = mscore.Exception,
    stringHelper = mscore.stringHelper

class dao {

    static async exec(connection, sql, params) {
        return new Promise((resolve, reject) => {
            connection.query(sql, params, (err, result) => {
                if (err) return reject(err)
                return resolve(result)
            });
        });
    }

    /**
     * 创建活动插件
     */
    static async create(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    INSERT INTO activity_plugin_main (id, TYPE, relation_id, control_id) 
                    VALUES (UUID(), ?, ?, ?);`
            let paramater = [params.id];
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        })
    }

    /**
     * 活动插件是否存在
     */
    static async isExists(connection, params) {
        if (params == void 0 || params == null || params.pluginId == void 0 || params.pluginId == null)
            return Promise.reject("参数不正确")

        return new Promise(async (resolve, reject) => {
            let paramater = [params.pluginId];
            let sql = `SELECT count(1)as r FROM activity_plugin_main where id=?`
            if (params.type != void 0 && params.type != null) {
                sql += " and type=?"
                paramater.push(params.type)
            }
            sql += " limit 1;";

            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(!!result[0].r);
            })
        })
    }

    // 保存活动插件配置
    static async saveDrawprizedata(connection, params) {
        var sql = `INSERT INTO activity_plugin_drawprizedata SET ?;`,
            sqlParams = {
                plugin_id: params.pluginId,
                phone_no: params.phoneNo,
                name: params.name,
                address: params.address,
                qq: params.qq,
                createtime: params.createtime,
                prize_name: params.prizeName,
                prize_no: params.prizeNo,
                exchange_state: params.exchangeState,
                exchangetime: params.exchangetime
            }
        return (await lotteryDao.exec(connection, sql, sqlParams)).affectedRows > 0 ? params.mtrId : Promise.reject('保存失败')
    }

    static async savePlugin(connection, params) {
        return new Promise(async (resolve, reject) => {
            var sql = `CALL proc_activity_plugin_save(?, ?);`,
                paramater = [
                    params.relationId,
                    params.controlId
                ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result[0][0].pluginId);
            })
        })
    }

    static async saveCollect(connection, params) {
        return new Promise(async (resolve, reject) => {
            var sql = `CALL proc_activity_plugin_savecollect(?, ?);`,
                paramater = [
                    params.pluginId,
                    params.collect_json
                ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    }

    static async savePrizedrawSetting(connection, params) {
        return new Promise(async (resolve, reject) => {
            var sql = `CALL proc_activity_plugin_drawprize_savesetting(?, ?, ?, ?, ?);`,
                paramater = [
                    params.pluginId,
                    params.drawtime,
                    params.wintime,
                    params.intervaltime,
                    params.intervaltime_type
                ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    }

    static async deletePrizeSetting(connection, pluginId) {
        return new Promise(async (resolve, reject) => {
            var sql = 'delete from `activity_plugin_prizesetting` where `plugin_id`=?;',
                paramater = [pluginId]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows);
            })
        })
    }

    static async savePrizeSetting(connection, params) {
        return new Promise(async (resolve, reject) => {
            var sql = 'INSERT INTO `activity_plugin_prizesetting`(`plugin_id`,`option_name`,`prize_name`,`amount_original`,`amount`,`rate`)VALUES(?,?,?,?,?,?);',
                paramater = [
                    params.pluginId,
                    params.optionName,
                    params.prizeName,
                    params.amount,
                    params.amount,
                    params.rate
                ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        })
    }

    static async getDrawprizeConfig(connection, params) {
        return new Promise(async (resolve, reject) => {
            var sql = `CALL proc_getDrawprizeConfig(?, ?, ?);`,
                paramater = [
                    params.relationId,
                    params.controlId,
                    params.userUuid
                ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);

                if (result[0][0].status === 400) {
                    return reject(new Exception(result[0][0].msg, null, 400))
                }

                resolve({
                    drawPrizeSetting: result[0][0],
                    prizeSetting: result[1],
                    drawPrizeData: result[2][0]
                });
            })
        })
    }

    static async saveDrawPrizeResult(connection, params) {
        return new Promise(async (resolve, reject) => {
            var sql = `CALL proc_saveDrawPrizeResult(?, ?, ?, ?, ?, ?, ?,?);`,
                paramater = [
                    params.drawStatus,
                    params.rType,
                    params.relationId,
                    params.userUuid,
                    params.userNickname,
                    params.pluginId,
                    params.prizeId,
                    params.prize_no
                ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result[0][0]);
            })
        })
    }

    /**
 * 获取抽奖信息
 */
    static async getDrawPrizeDataList(connection, params) {
        let sql = `select count(1) as total         
        FROM activity_plugin_drawprizedata as d 
        inner join manuscript_main as m 
        on d.relation_id=m.id  where {0};
        SELECT d.id,
        d.relation_id as relationId,
        d.plugin_id as pluginId,
        d.userUuid,
        d.createtime,
        d.state,
        d.prize_name as prizeName,
        d.prize_no as prizeNo,
        d.exchange_state as exchangeState,
        d.exchangetime,
        d.userNickname,
        '' as phone 
        FROM activity_plugin_drawprizedata as d 
        inner join manuscript_main as m 
        on d.relation_id=m.id 
        where {0} order by {1} limit {2};`;

        let sqlParams = [];
        let where = ['1 = 1'];

        if (params.userUuid != void 0 && params.userUuid != null) {
            where.push(` m.create_by =? `);
            sqlParams.push(params.userUuid)
        }

        if (params.relationId != void 0 && params.relationId != null) {
            where.push(` d.relation_id =? `);
            sqlParams.push(params.relationId)
        }

        if (params.keyword != void 0 && params.keyword != null) {
            where.push(` (d.userNickname like concat('%',?,'%') or d.prize_no like concat('%',?,'%')) `);
            sqlParams.push(params.keyword)
            sqlParams.push(params.keyword)
        }
        let orderBy = ` d.createtime desc `;
        let paging = params.pagination
        let limit = ` ${paging.skip}, ${paging.count} `;

        sql = stringHelper.format(sql, where.join(' and '), orderBy, limit);
        return new Promise((resolve, reject) => {
            let sql1 = connection.query(sql, [].concat(sqlParams, sqlParams), (err, result) => {
                if (err) return reject(err);
                let data = {
                    total: result[0][0].total,
                    list: result[1]
                }
                resolve(data);
            });
        })
    }

}

module.exports = dao