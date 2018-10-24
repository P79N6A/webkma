
const prefix = `

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
     * 查询所有商户列表(未删除)
     */
    static async getBusinessList(connection, params) {
        let sql = `
            SELECT businessId, userId FROM user_business where isDelete = 0
        `;
        return dao.exec(connection, sql, []);
    }

    /**
     * 查询商户下的活动列表(未删除)
     */
    static async getManuscriptList(connection, params) {
        let sql = `
            SELECT m.id FROM manuscript_main m where m.type = 3 and m.deleted = 0 and m.create_by = ?
        `;
        return dao.exec(connection, sql, [params.userId]);
    }

    /**
     * 查询商户下的员工列表(未删除)
     */
    static async getEmployeeList(connection, params) {
        let sql = `
            SELECT empl_id, user_id FROM user_employees WHERE empl_delete = 0 and empl_business_id = ?
        `;
        return dao.exec(connection, sql, [params.businessId]);
    }

    /**
     * 插入数据(所有)
     */
    static async insertAll(connection, params) {
        let values = [],
            sqlParams = [],
            sql = () => `
            INSERT INTO analysis_all (
                aa_manuscript_id,
                aa_share_user_id,
                aa_share,
                aa_access,
                aa_visitor,
                aa_create_time
            )
            VALUES ${values.join(' , ')}
            ON DUPLICATE KEY UPDATE 
                aa_share = VALUES(aa_share),
                aa_access = VALUES(aa_access),
                aa_visitor = VALUES(aa_visitor),
                aa_update_time = now();  
            `;

        params.forEach(i => {
            values.push(` (?, ?, ?, ?, ?, now()) `);
            sqlParams.push(i.manuscriptId);
            sqlParams.push(i.shareUserId);
            sqlParams.push(i.share);
            sqlParams.push(i.access);
            sqlParams.push(i.visitor);
        });
        return dao.exec(connection, sql(), sqlParams);
    }

    /**
     * 插入数据(所有)
     */
    static async insertRelease(connection, params) {
        let values = [],
            sqlParams = [],
            sql = () => `
            INSERT INTO analysis_release (
                ar_manuscript_id,
                ar_share,
                ar_access,
                ar_visitor,
                ar_create_time
            )
            VALUES ${values.join(' , ')}
            ON DUPLICATE KEY UPDATE 
                ar_share = VALUES(ar_share),
                ar_access = VALUES(ar_access),
                ar_visitor = VALUES(ar_visitor),
                ar_update_time = now();  
            `;

        params.forEach(i => {
            values.push(` (?, ?, ?, ?, now()) `);
            sqlParams.push(i.manuscriptId);
            sqlParams.push(i.share);
            sqlParams.push(i.access);
            sqlParams.push(i.visitor);
        });
        return dao.exec(connection, sql(), sqlParams);
    }

    /**
     * 插入数据(所有)
     */
    static async insertEmployee(connection, params) {
        let values = [],
            sqlParams = [],
            sql = () => `
            INSERT INTO analysis_employee (
                ae_share_user_id,
                ae_share,
                ae_access,
                ae_visitor,
                ae_create_time
            )
            VALUES ${values.join(' , ')}
            ON DUPLICATE KEY UPDATE 
                ae_share = VALUES(ae_share),
                ae_access = VALUES(ae_access),
                ae_visitor = VALUES(ae_visitor),
                ae_update_time = now();  
            `;

        params.forEach(i => {
            values.push(` (?, ?, ?, ?, now()) `);
            sqlParams.push(i.shareUserId);
            sqlParams.push(i.share);
            sqlParams.push(i.access);
            sqlParams.push(i.visitor);
        });
        return dao.exec(connection, sql(), sqlParams);
    }
}

module.exports = dao