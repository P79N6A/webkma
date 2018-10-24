let
    BUSINESS = global.require("./constant/business");

class dao {
    static async getConfig(connection, query) {
        var where = []
        var params = [];
        let sql = () => `
            SELECT
                *
            FROM
            sys_config
            where isDelete = ${BUSINESS.delete.notDelete} and ${where.join(' and ')}
        `;
        if (query.config_id_type) {
            where.push(' config_id_type = ? ');
            params.push(query.config_id_type);
        }
        if (query.type) {
            where.push(' type = ? ');
            params.push(query.type);
        }

        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    static async insertConfig(connection, query) {
        let sql = () => `
        INSERT INTO sys_config (
            sys_key,
            sys_value,
            \`describe\`,
            type,
            config_id_type
        )
        VALUES
            (
                ?, ?, ?, ?, ?
            );
        `;
        var params = [];
        params.push(query.sys_key);
        params.push(query.sys_value);
        params.push(query.describe);
        params.push(query.type);
        params.push(query.config_id_type);
        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    static async updateConfig(connection, query) {
        let sql = () => `
        UPDATE sys_config
            SET 
                sys_key = ?,
                sys_value = ?,
                \`describe\`= ?,
                type = ?,
                config_id_type = ?
            WHERE
	            id = ?;
        `;
        var params = [];
        params.push(query.sys_key);
        params.push(query.sys_value);
        params.push(query.describe);
        params.push(query.type);
        params.push(query.config_id_type);
        params.push(query.id);
        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    static async deleteConfig(connection, query) {
        let sql = () => `
        UPDATE sys_config
            SET 
                isDelete = ${BUSINESS.delete.isDelete}
            WHERE
	            id = ?;
        `;
        var params = [];
        params.push(query.id);
        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }
}

module.exports = dao