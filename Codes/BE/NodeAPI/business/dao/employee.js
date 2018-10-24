
const prefix = `
    u.empl_id as id,
    u.user_id as userId,
    u.empl_business_id as businessId,
    u.empl_name as 'name',
    u.empl_phone as phone,
    u.empl_state as 'state',
    u.empl_delete as 'delete',
    DATE_FORMAT(u.empl_create_time,'%Y-%m-%d %T') as createTime
`
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
     * 获取员工基本信息
     */
    static async get(connection, params) {
        let where = [' u.empl_delete = 0 ']
            , sqlParams = []
            , sql = () => `
                SELECT ${prefix} FROM user_employees u
                where ${where.join(' and ')}
            `
        if (!!params.id) {
            where.push(' u.empl_id = ? ');
            sqlParams.push(params.id);
        }
        if (!!params.phone) {
            where.push(' u.empl_phone = ? ');
            sqlParams.push(params.phone);
        }
        if (!!params.userId) {
            where.push(' u.user_id = ? ');
            sqlParams.push(params.userId);
        }
        return dao.exec(connection, sql(), sqlParams);
    }

    /**
     * 根据商铺id获取商铺信息
     * @param {*} businessId 商铺id
     */
    static async getBusiness(connection, businessId) {
        let sql = `
            SELECT * FROM user_business 
            where businessId = ? limit 1
        `
        let sqlParams = [businessId];
        return (await dao.exec(connection, sql, sqlParams))[0];
    }

    /**
     * 获取当前商铺下已有的员工数量
     * @param {*} businessId 
     */
    static async getEmployeesCount(connection, businessId) {
        let sql = `
            SELECT count(*) as count FROM user_employees 
            where empl_business_id = ? and empl_delete = 0
        `
        let sqlParams = [businessId];
        return (await dao.exec(connection, sql, sqlParams))[0].count;
    }

    /**
     * 查询重复
     * @param {*} params{phone, id, businessId}  
     */
    static async checkInfo(connection, params) {
        let sql = `
            SELECT count(*) as count FROM user_employees 
            where empl_delete = 0 and  empl_business_id = ? and empl_phone = ? and empl_id != ?
        `
        let sqlParams = [params.businessId, params.phone, params.id];
        return (await dao.exec(connection, sql, sqlParams))[0].count;
    }

    /**
     * 查询列表(普通列表)
     */
    static async search(connection, params) {
        var where = [' u.empl_business_id = ? and u.empl_delete = 0 '],
            sqlParams = [],
            leftJoin = [],
            order = [];
        sqlParams.push(params.businessId);
        if (!!params.keyWords) {
            where.push(` ( u.empl_name like concat('%',?,'%') or u.empl_phone like concat('%',?,'%') )`);
            sqlParams.push(params.keyWords);
            sqlParams.push(params.keyWords);
        }
        if (params.state != undefined && params.state != null) {
            where.push(` u.empl_state = ? `);
            sqlParams.push(params.state);
        }
        // 排序规则
        let sortFieldMap = {
            'totalShare': 'ae.ae_share',
            'totalAccess': 'ae.ae_access',
            'totalVisitor': 'ae.ae_visitor',
            'createTime': 'u.empl_create_time'
        };
        let sortValue = ['desc', 'asc'];
        let sortInfo = params.orderBy || [{ createTime: 'desc' }];
        let orderBys = [];
        sortInfo.forEach((order) => {
            for (const key in order) {
                let orderField = void 0;
                let orderValue = void 0;
                if (order.hasOwnProperty(key) && (orderField = sortFieldMap[key]) && (orderValue = order[key])) {
                    if (sortValue.includes(orderValue.toLowerCase())) {
                        orderBys.push(` ${orderField} ${orderValue} `);
                    }
                }
            }
        });
        let countSql = `
                SELECT count(*) as count 
                FROM user_employees u
                LEFT JOIN analysis_employee ae on u.empl_id = ae.ae_share_user_id
                where ${where.join(' and ')};
            `
        let sql = `
                SELECT 
                    ${prefix},
                    IFNULL(ae.ae_share, 0) as totalShare,
                    IFNULL(ae.ae_access, 0) as totalAccess,
                    IFNULL(ae.ae_visitor, 0) as totalVisitor,
                    DATE_FORMAT(ae.ae_create_time,'%Y-%m-%d %T') as firstShare
                FROM user_employees u
                LEFT JOIN analysis_employee ae on u.empl_id = ae.ae_share_user_id
                where ${where.join(' and ')}
                ${orderBys.length > 0 ? ' order by ' + orderBys.join(' ,') : ''}
                limit ${(params.pageIndex - 1) * params.pageSize}, ${params.pageSize};
            `;
        return {
            total: (await dao.exec(connection, countSql, sqlParams))[0].count,
            list: await dao.exec(connection, sql, sqlParams)
        };
    }

    /**
     * 查询列表(活动关联)
     */
    static async searchWithActivity(connection, params) {
        var where = [' u.empl_business_id = ? and u.empl_delete = 0 '],
            sqlParams = [],
            order = [];
        sqlParams.push(params.manuscriptId);
        sqlParams.push(params.businessId);
        if (!!params.keyWords) {
            where.push(` ( u.empl_name like concat('%',?,'%') or u.empl_phone like concat('%',?,'%') )`);
            sqlParams.push(params.keyWords);
            sqlParams.push(params.keyWords);
        }
        if (params.state != undefined && params.state != null) {
            where.push(` u.empl_state = ? `);
            sqlParams.push(params.state);
        }

        // 排序规则
        let sortFieldMap = {
            'totalShare': 'aa.aa_share',
            'totalAccess': 'aa.aa_access',
            'totalVisitor': 'aa.aa_visitor',
            'createTime': 'u.empl_create_time',
            'manuscript': 'uem.manuscript_id'
        };
        let sortValue = ['desc', 'asc'];
        let sortInfo = params.orderBy || [{ manuscript: 'desc' }];
        let orderBys = [];
        sortInfo.forEach((order) => {
            for (const key in order) {
                let orderField = void 0;
                let orderValue = void 0;
                if (order.hasOwnProperty(key) && (orderField = sortFieldMap[key]) && (orderValue = order[key])) {
                    if (sortValue.includes(orderValue.toLowerCase())) {
                        orderBys.push(` ${orderField} ${orderValue} `);
                    }
                }
            }
        });
        let countSql = `
                SELECT count(*) as count 
                FROM user_employees u
                LEFT JOIN union_employee_manuscript uem on (uem.manuscript_id = ? and uem.employee_id = u.empl_id ) 
                LEFT JOIN analysis_all aa on (u.empl_id = aa.aa_share_user_id and uem.manuscript_id = aa.aa_manuscript_id)
                where ${where.join(' and ')};
            `
        let sql = `
                SELECT 
                    ${prefix},
                    IF (LENGTH(uem.manuscript_id) > 0,1,0) as distribution,
                    IFNULL(aa.aa_share, 0) as totalShare,
                    IFNULL(aa.aa_access, 0) as totalAccess,
                    IFNULL(aa.aa_visitor, 0) as totalVisitor,
                    aa.aa_create_time as firstShare 
                FROM user_employees u
                LEFT JOIN union_employee_manuscript uem on (uem.manuscript_id = ? and uem.employee_id = u.empl_id ) 
                LEFT JOIN analysis_all aa on (u.empl_id = aa.aa_share_user_id and uem.manuscript_id = aa.aa_manuscript_id)
                WHERE ${where.join(' and ')}
                order by ${orderBys.join(' ,')}
                limit ${(params.pageIndex - 1) * params.pageSize}, ${params.pageSize};
            `;
        return {
            total: (await dao.exec(connection, countSql, sqlParams))[0].count,
            list: await dao.exec(connection, sql, sqlParams)
        };
    }

    /**
     * 查询所有员工
     * @param {*} connection 
     * @param {*} params 
     */
    static async getList(connection, params) {
        var where = [' u.empl_delete = 0 '],
            sqlParams = [];
        if (!!params.businessId) {
            where.push(' u.empl_business_id = ? ');
            sqlParams.push(params.businessId);
        }
        if (params.state != undefined && params.state != null) {
            where.push(' u.empl_state = ? ');
            sqlParams.push(params.state);
        }
        let sql = `
            SELECT
                ${prefix}
            FROM
                user_employees u
            WHERE ${where.join(' and ')}
            `
        return dao.exec(connection, sql, sqlParams);
    }

    /**
     * 新增员工
     */
    static async insert(connection, params) {
        let sql = `
                INSERT INTO  user_employees SET ?, empl_create_time = now()
            `
        return dao.exec(connection, sql, params);
    }

    // 单一更新
    static async update(connection, params) {
        let sql = `
            UPDATE user_employees SET ?, empl_update_time = now() WHERE empl_id = ?
        `
        let sqlParams = [params.obj, params.id];
        return dao.exec(connection, sql, sqlParams);
    }

    // 批量更新
    static async batchUpdate(connection, params) {
        let sql = `
            UPDATE user_employees SET ?, empl_update_time = now() WHERE empl_id in (?)
        `
        let sqlParams = [params.obj, params.ids];
        return dao.exec(connection, sql, sqlParams);
    }

    /**
     * 批量添加员工商户
     * @param {*} connection 
     * @param {*} query {batch:[]}
     */
    static async batchUnionEmployeeManuscript(connection, query) {
        var values = []
            , params = []
            , sql = () => `
        INSERT INTO union_employee_manuscript (
            business_id,
            employee_id,
            manuscript_id
        )
        VALUES
            ${values.join(' , ')}
        ON DUPLICATE KEY UPDATE update_time = now();  
        ;`;
        query.batch.forEach(i => {
            values.push('( ?, ?, ? )');
            params.push(i.businessId, i.employeeId, i.manuscriptId);
        });
        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    static async deleteUnionEmployeeManuscript(connection, query) {
        let sql = () => `
        DELETE FROM union_employee_manuscript
            WHERE
            business_id = ? and manuscript_id = ? and employee_id in (?) 
        `;
        let parameter = [
            query.businessId,
            query.manuscriptId,
            query.employeeId
        ];
        return new Promise(async (resolve, reject) => {
            connection.query(sql(), parameter, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }
}

module.exports = dao