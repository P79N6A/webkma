let TAG = global.require("./constant/tag"),
    uuid = require("uuid");

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
     * 获取单个标签
     */
    static async get(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    SELECT 
                        id,
                        name,
                        type,
                        sort,
                        modify_by AS operator,
                        modify_time AS operatorTime 
                    FROM tags
                    WHERE id = ?`
            let paramater = [params.id];
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        })
    }

    /**
     * 获取标签列表
     */
    static async getList(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    SELECT 
                        id,
                        name,
                        sort,
                        modify_by AS operator,
                        modify_time AS operatorTime 
                    FROM tags
                    WHERE type = ?`
            let paramater = [params.type];
            if (params.search != null) {
                sql += ` AND name like ?;`
                paramater.push(`%${params.search}%`)
            }
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    }

    /**
     * 获取标签列表
     */
    static async getUseList(connection, params) {

        let where = [` WHERE type = ?`],
            sql = () => `
            SELECT
                t.id,
                t.name,
                t.sort,
                t.modify_by AS operator,
                t.modify_time AS operatorTime 
            FROM
                tags t
            INNER JOIN tag_with_material twm ON twm.tag_id = t.id
            LEFT JOIN material_main mm ON mm.mtr_id = twm.relation_id
            ${where.join(' ')}
            GROUP BY t.id
            ORDER BY ${params.sortby} ${params.sequence},t.create_time desc
                `,
            sqlCount = () => ` 
            SELECT
            COUNT(DISTINCT t.id) as count
            FROM
                tags t
            INNER JOIN tag_with_material twm ON twm.tag_id = t.id
            LEFT JOIN material_main mm ON mm.mtr_id = twm.relation_id
                ${where.join(' ')}`

        let paramater = [params.type];
        if (params.search != null) {
            where.push(`AND name like '%${params.search}%'`)
        }
        if (params.mtrClass)
            where.push(`AND mm.mtr_class = '${params.mtrClass}'`)
        return {
            list: await this.exec(connection, sql(), paramater),
            total: (await dao.exec(connection, sqlCount(), paramater))[0].count,
            pageIndex: params.pageIndex,
            pageSize: params.pageSize
        }
    }

    /**
     * 获取标签使用数
     */
    static async getUseTotal(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    SELECT 
                        tag_id AS id,
                        COUNT(1) AS useTotal
                    FROM tag_with_material 
                    WHERE tag_id in (?)
                    GROUP BY tag_id`
            let paramater = [[""].concat(params.ids)];
            for (const key in paramater[0]) {
                if (paramater[0][key] == null) {
                    delete paramater[0][key]
                }
            }
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    }

    /**
     * 创建标签
     */
    static async create(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    INSERT INTO tags (id, NAME, TYPE, sort, create_by, create_time, modify_by, modify_time)
                    SELECT ?, ?, ?, MAX(t2.sort) + 1, ?, NOW(), ?, NOW()
                    FROM tags AS t2
                    WHERE t2.type = ?`
            let paramater = [
                uuid(),
                params.name,
                params.type,
                params.operator,
                params.operator,
                params.type
            ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(paramater[0]);
            })
        })
    }

    /**
     * 修改标签
     */
    static async update(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    UPDATE tags
                    SET ?,
                    modify_time = NOW()
                    WHERE id = ? ;`
            let paramater = [
                {
                    name: params.name,
                    modify_by: params.operator
                },
                params.id
            ]
            for (const key in paramater[0]) {
                if (paramater[0][key] == null) {
                    delete paramater[0][key]
                }
            }
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    }

    /**
     * 排序
     */
    static async sort(connection, params) {
        return new Promise(async (resolve, reject) => {
            let cases = [];
            let paramater = []
            params.data.forEach(item => {
                cases.push(`WHEN ? THEN ?`)
                paramater.push(item.id)
                paramater.push(item.sort)
            })

            let sql = `
                    UPDATE tags
                        SET sort = CASE id
                           ${cases.join("\r\n")}
                        END
                    WHERE id IN (?)`
            paramater.push(params.data.map(item => { return item.id }))
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(true);
            })
        })
    }

    /**
     * 判断标签名称是否存在
     */
    static async exist(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    SELECT 
                        COUNT(1) AS exist
                    FROM tags
                    WHERE name = ?`
            let paramater = [params.name]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result[0].exist > 0);
            })
        })
    }

    /**
     * 删除标签
     */
    static async delete(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `delete from tags where id in (?);`
            let ids = (params.id || "").split(",")
            let paramater = [ids.join(",")]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(true);
            })
        })
    }

    // 查询已关联的标签关联关系
    static async searchRelation(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    SELECT 
                        tag_id as tagId,
                        relation_id as relationId
                    FROM tag_with_material
                    WHERE tag_id IN (?)
                    AND relation_id IN (?)`,
                paramater = [
                    params.tagId.split(","),
                    params.relationId.split(",")
                ];
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    }

    // 添加标签与资源的关联关系
    static async relation(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = ``,
                rows = [],
                paramater = [];
            params.data.forEach(item => {
                rows.push(`(UUID(), ?, ?)`)
                paramater.push(item.tagId);
                paramater.push(item.relationId);
            })
            sql = `
                INSERT INTO tag_with_material (id, tag_id, relation_id) 
                VALUES ${rows.join(",")};`
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(true);
            })
        })

    }

    // 解除标签与资源的关联关系
    static async relieve(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = "",
                where = [],
                paramater = [],
                ids = params.id ? (params.id || "").split(",") : null,
                tag_ids = params.tagId ? (params.tagId || "").split(",") : null,
                relation_ids = params.relationId ? (params.relationId || "").split(",") : null;

            if (ids) {
                where.push("id in (?)");
                paramater.push(ids.join(","))
            }
            if (tag_ids) {
                where.push("tag_id in (?)");
                paramater.push(tag_ids.join(","))
            }
            if (relation_ids) {
                where.push("relation_id in (?)");
                paramater.push(relation_ids.join(","))
            }
            sql = `
                DELETE 
                FROM tag_with_material
                WHERE ${where.join(" AND ")};`;

            console.log(connection.format(sql, paramater));
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(true);
            })
        })
    }
}

module.exports = dao