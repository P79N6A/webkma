class userDao {

    static async exec(connection, sql, params) {
        return new Promise((resolve, reject) => {
            connection.query(sql, params, (err, result) => {
                if (err) return reject(err)
                return resolve(result)
            });
        });
    }


    static async insertBind(connection, params) {
        let sql = () => `INSERT INTO user_bind SET ?;`,
            obj = {
                business_id: params.businessId,
                user_id: params.userId,
                bind: params.bind,
                type: params.type
            },
            sqlParams = [obj]
        let result = await this.exec(connection, sql(), sqlParams)
        return result.affectedRows > 0 ? result.insertId : Promise.reject('新增失败');

    }
    static async updateBind(connection, params) {
        let where = [`where 1=1`],
            sql = () => `UPDATE user_bind SET ? ${where.join(' ')};`,
            obj = {},
            sqlParams = []

        if (params.bind)
            obj.bind = params.bind
        if (params.businessId)
            obj.business_id = params.businessId
        if (parseInt(params.type) >= 0)
            obj.type = params.type
        if (params.isDelete)
            obj.is_delete = params.isDelete

        if (params.id)
            where.push(`AND id = ${params.id}`)

        sqlParams.push(obj)
        let result = await this.exec(connection, sql(), sqlParams)
        return result.affectedRows > 0 ? '更新成功' : Promise.reject('更新失败');

    }


    static async searchBind(connection, params) {
        let where = [`where 1=1 AND is_delete = 0`],
            sql = () => `SELECT id,
            business_id businessId,
            user_id userId,
            bind phone,
            type ,
            DATE_FORMAT(createtime,'%Y-%m-%d %T') as createtime
        FROM
            user_bind
         ${where.join(' ')};`,
            sqlCount = () => `SELECT
        COUNT(*) as count
     FROM
         user_bind
      ${where.join(' ')}
      LIMIT ${(params.pageIndex - 1) * params.pageSize}, ${params.pageSize};`


        if (params.id)
            where.push(`AND id = '${params.id}'`)
        if (params.businessId)
            where.push(`AND business_id = '${params.businessId}'`)
        if (params.bind)
            where.push(`AND bind = '${params.bind}'`)
        if (params.type)
            where.push(`AND type ='${params.type}'`)
        if (params.userId)
            where.push(`AND user_id = '${params.userId}'`)

        return {
            list: await userDao.exec(connection, sql(), []),
            total: (await userDao.exec(connection, sqlCount(), []))[0].count,
            pageIndex: params.pageIndex,
            pageSize: params.pageSize
        }

    }

    static async search(connection, params) {
        let where = [`where 1=1 AND ub.is_delete = 0`],
            sql = () => `SELECT
            ub.id ,
            ub.bind phone ,
            DATE_FORMAT(ub.createtime,'%Y-%m-%d %T') as createtime,
            IFNULL(ue.empl_state , 0) AS state
        FROM
            user_bind ub
        LEFT JOIN user_employees ue ON ue.empl_phone = ub.bind AND ue.empl_delete = 0
         ${where.join(' ')};`,
            sqlCount = () => `SELECT
        COUNT(*) as count
        FROM
        user_bind ub
    LEFT JOIN user_employees ue ON ue.empl_phone = ub.bind AND ue.empl_delete = 0
      ${where.join(' ')}
      LIMIT ${(params.pageIndex - 1) * params.pageSize}, ${params.pageSize};`


        if (params.id)
            where.push(`AND ub.id = '${params.id}'`)
        if (params.businessId)
            where.push(`AND ub.business_id = '${params.businessId}'`)
        if (params.bind)
            where.push(`AND ub.bind = '${params.bind}'`)
        if (params.type)
            where.push(`AND ub.type ='${params.type}'`)
        if (params.userId)
            where.push(`AND ub.user_id = '${params.userId}'`)

        return {
            list: await userDao.exec(connection, sql(), []),
            total: (await userDao.exec(connection, sqlCount(), []))[0].count,
            pageIndex: params.pageIndex,
            pageSize: params.pageSize
        }

    }



}

module.exports = userDao