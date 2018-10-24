let
    BUSINESS = global.require("./constant/business"),
    str = global.require("./utils/stringHelper");

class dao {
    static async isExistBusiness(connection, query) {
        var where = [];
        var where2 = [];
        var params = [];
        let sql = () => `
            SELECT
            businessId,businessName,businessPhone,businessCover,businessLogo,createtime,state,businessType,secret
            FROM
            user_business
            where isDelete = ${BUSINESS.delete.notDelete} and (${where.join(' or ')}) ${where2.join(' ')}
        `;

        where.push(' businessPhone = ? ');
        params.push(query.businessPhone);

        if (!str.isEmpty(query.businessId)) {
            where2.push('and businessId <> ? ');
            params.push(query.businessId);
        }

        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    static async getBusiness(connection, query) {
        var where = []
        var params = [];

        let sql = () => `
            SELECT
                businessId,userId,businessName,businessCover,
                businessLogo,businessPhone,createtime,state,
                businessType,smsCount,staffCount,secret,
                (SELECT COUNT(*) FROM user_employees u where u.empl_delete=0 and u.empl_business_id = businessId) as staffCreated
            FROM
            user_business
            where isDelete = ${BUSINESS.delete.notDelete} and ${where.join(' and ')}
            ;
        `;

        if (query.businessId) {
            where.push(' businessId = ? ');
            params.push(query.businessId);
        }

        if (query.userId) {
            where.push(' userId = ? ');
            params.push(query.userId);
        }

        if (query.businessName) {
            where.push(' businessName = ? ');
            params.push(query.businessName);
        }

        if (query.businessType) {
            where.push(' businessType = ? ');
            params.push(query.businessType);
        }

        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    static async getBusinessManuscriptCount(connection, query) {
        var where = []
        var params = [];

        let sql = () => `
            SELECT
            count(distinct id) as count
            FROM
            manuscript_main
            where create_by = ?
            ;
        `;
        params.push(query);

        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }



    static async searchBusiness(connection, query) {
        var where = [` isDelete = ${BUSINESS.delete.notDelete} `],
            params = [],
            prefix = [' u.businessId, u.userId, u.businessName,u.businessPhone,u.businessCover,u.businessLogo,u.createtime,u.state,u.businessType,u.secret '],
            leftJoin = [],
            limit = "LIMIT ";
        let sql = () => `
            SELECT
                ${prefix.join(' , ')}
            FROM
            user_business u
            ${leftJoin.join(' ')}
            where  ${where.join(' and ')}
            order by u.createtime desc
            ${limit};
        `;

        if (!!query.manuscriptId) {
            prefix.push(` IF(LENGTH(ubm.id) > 0 , 1, 0) as distribution `);
            leftJoin.push(' LEFT JOIN union_business_manuscript ubm on (u.businessId = ubm.businessId and ubm.manuscriptId = ?)');
            params.push(query.manuscriptId);
            if (query.distribution != undefined && query.distribution != null) {
                where.push(` ubm.id is ${query.distribution == 1 ? 'not ' : ''} null`);
            }
        }

        if (query.businessType) {
            where.push(' u.businessType = ? ');
            params.push(query.businessType);
        }

        if (!str.isEmpty(query.businessName)) {
            where.push(' u.businessName = ? ');
            params.push(query.businessName);
        }
        if (!str.isEmpty(query.businessPhone)) {
            where.push(' u.businessPhone = ? ');
            params.push(query.businessPhone);
        }
        if (!str.isEmpty(query.businesskeyword)) {
            where.push('(u.businessPhone like ? or u.businessName like ?)  ');
            params.push("%" + query.businesskeyword + "%");
            params.push("%" + query.businesskeyword + "%");
        }

        limit += `${(query.pageIndex - 1) * query.pageSize}, ${query.pageSize}`;

        return new Promise(async (resolve, reject) => {
            connection.query(sql(),
                params, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
        })
    }


    static async searchBusinessCount(connection, query) {
        var where = [`isDelete = ${BUSINESS.delete.notDelete} `],
            leftJoin = [],
            params = [],
            limit = "LIMIT ";
        let countSql = () => `
        SELECT
        count(u.businessId) as total
        FROM
        user_business u
        ${leftJoin.join(' ')}
        where ${where.join(' and ')};`;

        if (!!query.manuscriptId) {
            leftJoin.push(' LEFT JOIN union_business_manuscript ubm on (u.businessId = ubm.businessId and ubm.manuscriptId = ?)');
            params.push(query.manuscriptId);
            if (query.distribution != undefined && query.distribution != null) {
                where.push(` ubm.id is ${query.distribution == 1 ? 'not ' : ''} null`);
            }
        }

        if (query.businessType) {
            where.push(' u.businessType = ? ');
            params.push(query.businessType);
        }

        if (!str.isEmpty(query.businessName)) {
            where.push(' u.businessName like ? ');
            params.push("%" + query.businessName + "%");
        }
        if (!str.isEmpty(query.businessPhone)) {
            where.push(' u.businessPhone like ? ');
            params.push("%" + query.businessPhone + "%");
        }

        if (!str.isEmpty(query.businesskeyword)) {
            where.push('(u.businessPhone like ? or u.businessName like ?)  ');
            params.push("%" + query.businesskeyword + "%");
            params.push("%" + query.businesskeyword + "%");
        }
        return new Promise(async (resolve, reject) => {
            connection.query(countSql(),
                params, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
        })
    }

    static async insertBusiness(connection, query) {
        let sql = () => `
        INSERT INTO user_business (
            businessId,
            businessName,
            businessPhone,
            businessCover,
            businessLogo,
            voucher,
            businessType,
            smsCount,
            staffCount,
            userId,
            secret
        )
        VALUES
            (
                ?, ?, ?,?, ?,?,?,?,?,?,?
            );
        `;
        var params = [];
        if (str.isEmpty(query.staffCount)) {
            query.staffCount = 0
        }
        params.push(query.businessId);
        params.push(query.businessName);
        params.push(query.businessPhone);
        params.push(query.businessCover);
        params.push(query.businessLogo);
        params.push(query.voucher);
        params.push(query.businessType);
        params.push(query.smsCount);
        params.push(query.staffCount);
        params.push(query.userId);
        params.push(query.secret);
        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    static async updateBusiness(connection, query) {
        var SET = [];
        var params = [];
        var where = []
        let sql = () => `
        UPDATE user_business
            SET updatetime = now(),
                ${SET.join(' , ')}
            WHERE
                businessId = ?;
        `;
        if (query.businessName) {
            SET.push(' businessName = ? ');
            params.push(query.businessName);
        }

        if (query.businessPhone) {
            SET.push(' businessPhone = ? ');
            params.push(query.businessPhone);
        }

        if (query.businessCover) {
            SET.push(' businessCover = ? ');
            params.push(query.businessCover);
        }

        if (query.businessLogo) {
            SET.push(' businessLogo = ? ');
            params.push(query.businessLogo);
        }

        if (query.voucher) {
            SET.push(' voucher = ? ');
            params.push(query.voucher);
        }

        if (!str.isEmpty(query.state)) {
            SET.push(' state = ? ');
            params.push(query.state);
        }

        if (!str.isEmpty(query.businessType)) {
            SET.push(' businessType = ? ');
            params.push(query.businessType);
        }
        if (!str.isEmpty(query.smsCount)) {
            SET.push(' smsCount = ? ');
            params.push(query.smsCount);
        }
        if (!str.isEmpty(query.staffCount)) {
            SET.push(' staffCount = ? ');
            params.push(query.staffCount);
        }

        params.push(query.businessId);
        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    static async deleteBusiness(connection, query) {
        var where = [];
        let sql = () => `
        UPDATE user_business
            SET 
                isDelete = ${BUSINESS.delete.isDelete}
            WHERE
                ${where.join(' and ')};
        `;
        var params = [];
        if (!!query.businessId) {
            where.push(' businessId = ? ');
            params.push(query.businessId);
        }
        if (!!query.userId) {
            where.push(' userId = ? ');
            params.push(query.userId);
        }
        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    static async getUnionBusinessManuscript(connection, query) {
        var where = []
        var params = [];
        let sql = () => `
            SELECT
            manuscriptId
            FROM
            union_business_manuscript
            where businessId = ?
        `;

        params.push(query.businessId);

        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    static async insertUnionBusinessManuscript(connection, query) {
        let sql = () => `
        INSERT INTO union_business_manuscript (
            businessId,
            manuscriptId
        )
        VALUES
            (
                ?, ?
            );
        `;
        var params = [];
        params.push(query.businessId);
        params.push(query.manuscriptId);
        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    /**
     * batchInsertUnionBusinessManuscript
     * @param {*} connection 
     * @param {*} query {batch:[]}
     */
    static async batchUnionBusinessManuscript(connection, query) {
        var values = []
            , params = []
            , sql = () => `
        INSERT INTO union_business_manuscript (
            businessId,
            manuscriptId,
            create_time
        )
        VALUES
            ${values.join(' , ')}
        ON DUPLICATE KEY UPDATE update_time = now();  
        `;
        query.batch.forEach(i => {
            values.push('( ?, ?, now() )');
            params.push(i.businessId, i.manuscriptId);
        });
        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }

    static async deleteUnionBusinessManuscript(connection, query) {
        var where = [];
        var params = [];
        let sql = () => `
        DELETE FROM union_business_manuscript
            WHERE
            1 =1 and ${where.join(' and ')};
        `;
        if (query.businessId) {
            where.push(' businessId = ? ');
            params.push(query.businessId);
        }
        if (query.manuscriptId) {
            where.push(' manuscriptId = ? ');
            params.push(query.manuscriptId);
        }
        if (query.businessBatch instanceof Array) {
            where.push(' businessId in (?) ');
            params.push(query.businessBatch);
        }
        if (query.manuscriptBatch instanceof Array) {
            where.push(' manuscriptId in (?) ');
            params.push(query.manuscriptBatch);
        }
        return new Promise(async (resolve, reject) => {
            connection.query(sql(), params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }


}

module.exports = dao