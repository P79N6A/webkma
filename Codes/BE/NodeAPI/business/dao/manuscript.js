let
    MANUSCRIPT = global.require("./constant/manuscript"),
    UUIDTYPE = global.require("./constant/uuid-type"),
    msUtil = global.require("./utils/microservice"),
    uuid = require("uuid");
const { stringHelper } = require('mscore')

const prefix = `
    mm.id,
    mm.name,
    mm.description,
    mm.cover,
    mm.enable,
    mm.modify_time AS operatorDate
`;

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
     * 获取稿件基本信息
     */
    static async get(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                SELECT 
                    mm.type,
                    mm.name,
                    mm.description,
                    mm.cover,
                    mm.ref_source_id as refSourceId,
                    mm.create_time as createTime,
                    mm.enable,
                    mc.content
                FROM manuscript_main AS mm 
                LEFT JOIN manuscript_content AS mc
                ON mm.id = mc.relation_id
                WHERE mm.id = ?
                -- AND mm.enable != 0
                AND mm.deleted = 0
                LIMIT 1`
            let paramater = [params.id];
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        })
    }

    /**
     * 根据属性查询稿件(这里id是去重)
     * @param {*} connection 
     * @param {*} params 
     */
    static async getByProperty(connection, params) {
        let where = [' mm.enable > -1 ', ' mm.deleted = 0 '],
            parameter = [],
            sql = () => `
                SELECT *
                FROM manuscript_main AS mm 
                WHERE 
                    ${where.join(' AND ')}
                LIMIT 1`;
        if (!!params.type) { where.push(' mm.type = ? '); parameter.push(params.type) }
        if (!!params.name) { where.push(' mm.name = ? '); parameter.push(params.name) }
        return (await this.exec(connection, sql(), parameter))[0];
    }

    /**
     * 获取模板的扩展信息
     */
    static async getExtForTemplate(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    SELECT 
                        use_total AS useTotal,
                        score,
                        scheme_detail AS schemeDetail
                    FROM manuscript_ext_template
                    WHERE relation_id = ?
                    LIMIT 1`
            let paramater = [params.id];
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        })
    }

    /**
     * 获取已发布稿件的扩展信息
     */
    static async getExtForRelease(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    SELECT id ,relation_id as relationId ,
                        page_start_date AS pageStartDate,
                        page_end_date AS pageEndDate,
                        active_start_date AS activeStartDate,
                        active_end_date AS activeEndDate,
                        url,recommend
                    FROM manuscript_ext_release
                    WHERE relation_id = ?
                    LIMIT 1`
            let paramater = [params.id];
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        })
    }

    /**
     * 获取模板列表信息(商家)
     */
    static async getTemplateListWithBusiness(connection, params) {
        var pagination = params.pagination,
            where = [' mm.type = 1 AND mm.enable = 1 AND mm.deleted = 0 '],
            sqlParams = [params.businessId],
            order = ' ubm.id desc, mm.create_time desc ';
        if (parseInt(params.templateDistribution) > -1) {
            where.push(' mt.distribution = ? ');
            sqlParams.push(params.templateDistribution);
        }
        if (!!params.search) {
            where.push(`( mm.name like concat('%',?,'%') OR ub.businessName like concat('%',?,'%') )`);
            sqlParams.push(params.search);
            sqlParams.push(params.search);
        }
        if (parseInt(params.range) == 1) {
            where.push(' (mt.distribution = 0 or (mt.distribution = 1 and ubm.id is not null)) ');
            order = ' mm.create_time desc ';
        }
        let countSql = `
                SELECT
                    count(*) as count
                FROM
                    manuscript_main mm
                LEFT JOIN manuscript_ext_template mt ON mm.id = mt.relation_id
                LEFT JOIN union_business_manuscript ubm on (ubm.businessId = ? and mm.id = ubm.manuscriptId)
                LEFT JOIN user_business ub on mm.create_by = ub.userId
                where ${where.join(' and ')}     
            `,
            sql = `
                SELECT
                    ${prefix},
                    mt.use_total AS useTotal,
                    mt.score,
                    mt.url,
                    mt.code_url as codeUrl,
                    mt.distribution as templateDistribution,
                    IF(ubm.id is not null, 1 ,0) as distribution,
                    ub.businessName AS operator
                FROM
                    manuscript_main mm
                LEFT JOIN manuscript_ext_template mt ON mm.id = mt.relation_id
                LEFT JOIN union_business_manuscript ubm on (ubm.businessId = ? and mm.id = ubm.manuscriptId) 
                LEFT JOIN user_business ub on mm.create_by = ub.userId
                where ${where.join(' and ')}   
                order by ${order}
                limit ${parseInt(pagination.skip)}, ${parseInt(pagination.count)}
            `;
        return {
            total: (await dao.exec(connection, countSql, sqlParams))[0].count,
            list: await dao.exec(connection, sql, sqlParams)
        };
    }

    /**
     * 获取模板列表信息
     */
    static async getTemplateList(connection, params) {
        var pagination = params.pagination,
            where = [' mm.type = 1 AND mm.enable = 1 AND mm.deleted = 0'],
            sqlParams = [];
        if (!!params.search) {
            where.push(` ( mm.name like concat('%',?,'%') OR ub.businessName like concat('%',?,'%') ) `);
            sqlParams.push(params.search);
            sqlParams.push(params.search);
        }
        if (!!params.designerId) {
            where.push(` mm.create_by = ? `);
            sqlParams.push(params.designerId);
        }
        if (parseInt(params.range) == 1) {
            where.push(` mm.create_by = ? `);
            sqlParams.push(params.userId);
        }
        let countSql = `
                SELECT
                    count(*) as count
                FROM
                    manuscript_main mm
                LEFT JOIN manuscript_ext_template mt ON mm.id = mt.relation_id
                LEFT JOIN user_business ub ON mm.create_by = ub.userId
                where ${where.join(' and ')}     
            `,
            sql = `
                SELECT
                    ${prefix},
                    ub.businessName AS operator,
                    mt.use_total AS useTotal,
                    mt.score,
                    mt.url,
                    mt.code_url as codeUrl,
                    mt.distribution,
                    (
                        CASE distribution
                        WHEN 1 THEN (SELECT COUNT(*)FROM union_business_manuscript where manuscriptId = mm.id)
                        ELSE (SELECT COUNT(*) FROM user_business )
                        END
                    ) as businessTotal
                FROM
                    manuscript_main mm
                LEFT JOIN manuscript_ext_template mt ON mm.id = mt.relation_id
                LEFT JOIN user_business ub ON mm.create_by = ub.userId
                where ${where.join(' and ')}   
                order by mm.create_time desc
                limit ${pagination.skip}, ${pagination.count}
            `;
        return {
            total: (await dao.exec(connection, countSql, sqlParams))[0].count,
            list: await dao.exec(connection, sql, sqlParams)
        };
    }

    /**
     * 获取活动列表(已发布稿件)信息
     */
    static async getReleaseList(connection, params) {
        let sql = `select count(*) as total 
        from  manuscript_ext_release r 
        inner join manuscript_main m on(r.relation_id=m.id)
        inner join user_business b on (b.userId=m.create_by)
        where m.deleted = 0 and {0}
        ;
        select r.id as uuid,r.relation_id as id , r.page_start_date as pageStartDate,r.page_end_date as pageEndDate, r.active_start_date as activeStartDate,
        r.active_end_date as activeEndDate  ,r.url ,m.type,m.name,m.cover,m.enable,m.create_time as createTime,m.modify_time as modifyTime,
        (case when ar.ar_share is not null then ar.ar_share else 0 end) totalShare,
        (case when ar.ar_access is not null then ar.ar_access else 0 end) totalAccess,
        (case when ar.ar_visitor is not null then ar.ar_visitor else 0 end) totalVisitor,
        b.businessName ,r.recommend , sm.name as sourceName
        from  manuscript_ext_release r 
        inner join manuscript_main m on(r.relation_id=m.id)
        inner join user_business b on (b.userId=m.create_by)
        left join analysis_release ar on (ar.ar_manuscript_id = r.relation_id)
        left join manuscript_main sm on (sm.id=m.ref_source_id)
        where m.deleted = 0 and {0} order by {1} limit {2}
        ;`;

        let sqlParams = [];
        let where = ['1 = 1'];
        if (!!params.search) {
            where.push(` ( b.businessName like concat('%',?,'%') or m.name like concat('%',?,'%')) `);
            sqlParams.push(params.search);
            sqlParams.push(params.search);
        }
        if (!!params.nameSearch) {
            where.push(` m.name like concat('%',?,'%') `);
            sqlParams.push(params.nameSearch);
        }
        if (!!params.businessId) {
            where.push(` b.businessId= ? `);
            sqlParams.push(params.businessId);
        }
        // 推荐的活动
        if (Number(params.recommend) === 1) {
            where.push(` r.recommend = 1 `);
        }
        if (Number(params.enable) === 1) {
            where.push(` m.enable = 1 `);
        }
        // 根据user_uuid 获取用户参与的活动
        if (params.userUuid) {
            where.push(` r.relation_id in (SELECT ad.relation_id FROM activity_plugin_drawprizedata ad  where ad.userUuid = ? ) `);
            sqlParams.push(params.userUuid);
        }
        let sortFieldMap = {
            'totalShare': 'ar.ar_share',
            'totalAccess': 'ar.ar_access',
            'totalVisitor': 'ar.ar_visitor',
            'createTime': 'm.create_time',
        };
        let sortValue = ['desc', 'asc'];
        let sortInfo = params.orderBy || [];
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

        let orderBy = orderBys.join(' , ') || `${sortFieldMap['createTime']} desc`;
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

    /**
    * 获取推荐的活动列表(已发布稿件)信息
    */
    static async getRecommendReleaseList(connection, params) {
        let sql = `select count(*) as total 
        from  manuscript_ext_release r 
        inner join manuscript_main m on(r.relation_id=m.id)
        inner join user_business b on (b.userId=m.create_by)
        where m.deleted = 0 and {0}
        ;
        select r.id as uuid,r.relation_id as id , r.active_start_date as activeStartDate,
        r.active_end_date as activeEndDate  ,r.url ,m.type,m.name,m.cover,m.create_time as createTime
        from  manuscript_ext_release r 
        inner join manuscript_main m on(r.relation_id=m.id)
        inner join user_business b on (b.userId=m.create_by)
        where m.deleted = 0 and {0} order by {1} limit {2}
        ;`;

        let sqlParams = [];
        let where = [' 1 = 1 '];
        if (!!params.search) {
            where.push(` (b.businessName like concat('%',?,'%') or m.name like concat('%',?,'%')) `);
            sqlParams.push(params.search);
            sqlParams.push(params.search);
        }
        if (!!params.nameSearch) {
            where.push(` m.name like concat('%',?,'%') `);
            sqlParams.push(params.nameSearch);
        }
        if (!!params.businessId) {
            where.push(` b.businessId= ? `);
            sqlParams.push(params.businessId);
        }

        // 根据user_uuid 获取用户参与的活动
        if (params.userUuid) {
            where.push(` r.relation_id in (SELECT ad.relation_id FROM activity_plugin_drawprizedata ad  where ad.userUuid = ? ) `);
            sqlParams.push(params.userUuid);
        }
        // 推荐的活动
        if (Number(params.recommend) === 1) {
            where.push(` r.recommend = 1 `);
        }
        if (Number(params.enable) === 1) {
            where.push(` m.enable = 1 `);
        }
        let orderBy = ` m.create_time desc `;
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

    /**
     * 获取我推广的活动列表(已发布稿件)信息
     */
    static async getReleaseListForPromotion(connection, params) {
        let sql = `select count(*) as total 
        from  manuscript_ext_release r 
        inner join union_employee_manuscript ue on (ue.manuscript_id=r.relation_id)
        inner join user_employees e on(ue.employee_id=e.empl_id)
        inner join manuscript_main m on(r.relation_id=m.id)
        where m.deleted = 0 and {0}
        ;
        select r.id as uuid,r.relation_id as id ,  r.active_start_date as activeStartDate,
        r.active_end_date as activeEndDate  ,r.url ,m.type,m.name,m.cover,m.enable,m.create_time as createTime
        from  manuscript_ext_release r 
        inner join union_employee_manuscript ue on (ue.manuscript_id=r.relation_id)
        inner join user_employees e on(ue.employee_id=e.empl_id)
        inner join manuscript_main m on(r.relation_id=m.id)
        where m.deleted = 0 and {0} order by {1} limit {2}
        ;`;

        let where = [` e.user_id= ? `, ` m.enable=? `];
        let sqlParams = [params.userId, 1];
        if (!!params.search) {
            where.push(` m.name like concat('%',?,'%') `);
            sqlParams.push(params.search);
        }

        let orderBy = ` m.create_time desc `;
        let paging = params.pagination
        let limit = ` ${paging.skip}, ${paging.count} `;
        sql = stringHelper.format(sql, where.join(' and '), orderBy, limit);
        return new Promise((resolve, reject) => {
            connection.query(sql, [].concat(sqlParams, sqlParams), (err, result) => {
                if (err) return reject(err);
                let data = {
                    total: result[0][0].total,
                    list: result[1]
                }
                resolve(data);
            });
        })
    }

    /**
    * 获取活动的参与数信息
    */
    static async getJoinCountForRelease(connection, ids) {
        let sql = `select s.relation_id relationId, sum(case when s.draw_count is not null then s.draw_count else 0 end) joinCount from activity_plugin_drawprize_statistics s 
        where s.relation_id in (?) group by s.relation_id  ;`;

        let sqlParams = [ids];
        return new Promise((resolve, reject) => {
            connection.query(sql, [].concat(sqlParams, sqlParams), (err, result) => {
                if (err) return reject(err);
                let data = {};
                result.forEach(r => {
                    data[r.relationId] = data[r.joinCount];
                })
                resolve(data);
            });
        })
    }

    /**
     * 获取稿件/模板列表信息
     */
    static async getList(connection, params) {
        return new Promise(async (success, fail) => {
            (new Promise((resolve, reject) => {
                let select = [
                    "mm.id",
                    "mm.name",
                    "mm.description",
                    "mm.cover",
                    "mm.modify_by AS operator",
                    "mm.modify_time AS operatorDate"
                ];
                let join = "";
                switch (params.type) {
                    case MANUSCRIPT.type.draft: break;
                    case MANUSCRIPT.type.template:
                        join = `LEFT JOIN manuscript_ext_template AS mt ON mm.id = mt.relation_id`
                        select = select.concat([
                            "mt.use_total AS useTotal",
                            "mt.score",
                            "mt.distribution",
                            `(
                                CASE distribution
                                WHEN 1 THEN (SELECT COUNT(*)FROM union_business_manuscript where manuscriptId = mm.id)
                                ELSE (SELECT COUNT(*) FROM user_business )
                                END
                            ) as businessTotal`
                        ])
                        break;
                    case MANUSCRIPT.type.release:
                        join = `LEFT JOIN manuscript_ext_release AS mr ON mm.id = mr.relation_id`
                        select = select.concat([
                            "mr.active_start_date AS activeStartDate",
                            "mr.active_end_date AS activeEndDate",
                            "mr.url",
                        ])
                        break;
                }
                let sql = `
                        SELECT ${select.join(",")}
                        FROM manuscript_main AS mm
                        ${join}
                        WHERE mm.enable = 1
                        AND mm.deleted = 0
                        AND mm.type = ?
                        ${(!!params.operator) ? ` AND mm.create_by = ? ` : ``}
                        ${(!!params.search) ? ` AND mm.name like ? ` : ``}
                        ORDER BY mm.create_time desc
                        LIMIT ?, ?;`
                let paramater = [params.type]
                if (!!params.operator) paramater.push(params.operator)
                if (!!params.search) paramater.push(`%${params.search}%`)
                paramater = paramater.concat([params.skip || 0, params.count || 1000])

                connection.query(sql, paramater, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                })
            })).then(data => {
                return new Promise((resolve, reject) => {
                    let sql = `
                        SELECT COUNT(1) AS total 
                        FROM manuscript_main
                        WHERE enable = 1
                        AND deleted = 0
                        AND type = ?
                        ${(!!params.operator) ? ` AND create_by = ? ` : ``}
                        ${(!!params.search) ? ` AND name like ? ` : ``};`
                    let paramater = [params.type];
                    if (!!params.operator) paramater.push(params.operator)
                    if (!!params.search) paramater.push(`%${params.search}%`)
                    connection.query(sql, paramater, (err, result) => {
                        if (err) return reject(err);
                        resolve({
                            list: data,
                            total: result[0].total
                        });
                    })
                })
            }).then(data => success(data)).catch(err => fail(err))
        })
    }

    /**
     * 创建稿件/模板基本信息
     */
    static async create(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql =
                `INSERT INTO manuscript_main (id, type, terminal, category_id, name, description, cover, ref_source_id, enable, create_by, create_time, modify_by, modify_time)
                VALUES(?, ?, ${MANUSCRIPT.terminal.wap}, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW());`
            let paramater = [
                await msUtil.uuid({ module: UUIDTYPE.manuscript }),
                params.type,        // "type",
                params.categoryId,  // "category_id", 
                params.name,        // "name", 
                params.description, // "description", 
                params.cover,       // "cover", 
                params.refSourceId, // "ref_source_id", 
                params.enable || 1,
                params.operator,    // "create_by", 
                params.operator    // "modify_by"
            ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(paramater[0]);
            })
        })
    }

    /**
     * 修改稿件/模板基本信息
     */
    static async update(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `UPDATE manuscript_main SET ?, modify_time=NOW() WHERE id = ?;`
            let paramater = [
                {
                    category_id: params.categoryId,
                    name: params.name,
                    description: params.description,
                    type: MANUSCRIPT.type[params.type],
                    cover: params.cover,
                    enable: params.enable,
                    deleted: params.deleted,
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
                resolve(true);
            })
        })
    }

    /**
     * 获取稿件/模板内容
     */
    static async getContent(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    SELECT 
                        content
                    FROM manuscript_content
                    WHERE relation_id = ?
                    LIMIT 1`
            let paramater = [params.relationId]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        })
    }

    /**
     * 添加稿件/模板内容
     */
    static async addContent(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `INSERT INTO manuscript_content (id, relation_id, content) VALUES (?, ?, ?);`
            let paramater = [
                uuid(), //Date.now(),         // id,
                params.relationId,  // relation_id,
                params.content      // content
            ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(true);
            })
        })
    }

    /**
     * 修改稿件/模板内容
     */
    static async updateContent(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `UPDATE manuscript_content SET content = ? WHERE relation_id = ?;`
            let paramater = [
                params.content,     // content
                params.relationId   // relation_id,
            ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(true);
            })
        })
    }

    /**
     * 添加模板扩展内容
     */
    static async addExtTemplate(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    INSERT INTO manuscript_ext_template (id, relation_id, use_total, score, scheme_detail, url, code_url)
                    VALUES (?, ?, 0, ?, '', ?, ?);`
            let paramater = [
                uuid(),
                params.relationId,
                params.score || 0,
                params.url,
                params.codeUrl
            ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(true);
            })
        })
    }

    /**
     * 增加模板使用数
     */
    static async increaseExtEmplate(connection, params) {
        let sql = 'UPDATE manuscript_ext_template SET use_total = (use_total + ?) WHERE relation_id = ?;';
        if (!params.increment) params.increment = 1;
        return this.exec(connection, sql, [params.increment, params.relationId]);
    }

    /**
     * 更新模板扩展内容
     */
    static async updateExtTemplate(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `UPDATE manuscript_ext_template SET ? WHERE relation_id = ?;`
            let paramater = [
                {
                    use_total: params.useTotal,
                    score: params.score,
                    scheme_detail: params.schemeDetail,
                    distribution: params.distribution,
                    url: params.url,
                    codeUrl: params.codeUrl
                },
                params.relationId
            ]
            for (const key in paramater[0]) {// TODO 测试值为0是否通过
                if (paramater[0][key] == null) delete paramater[0][key]
            }
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(true);
            })
        })
    }

    /**
     * 增加模板扩展内容
     */
    static async increaseExtTemplate(connection, params) {
        return new Promise(async (resolve, reject) => {
            let set = [], paramater = [];
            if (!!params.useTotal) {
                set.push(' use_total = (use_total + ?)');
                paramater.push(params.useTotal);
            }
            paramater.push(params.relationId);
            let sql = `UPDATE manuscript_ext_template SET ${set.join(' , ')} WHERE relation_id = ?;`
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(true);
            })
        })
    }

    /**
     * 添加已发布稿件扩展内容
     */
    static async addExtRelease(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    INSERT INTO manuscript_ext_release (id, relation_id, page_start_date, page_end_date, active_start_date, active_end_date, url) 
                    VALUES  (?, ?, ?, ?, ?, ?, ?);`
            let paramater = [
                uuid(),
                params.relationId,
                params.pageStartDate || null,
                params.pageEndDate || null,
                params.activeStartDate || null,
                params.activeEndDate || null,
                params.url
            ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(true);
            })
        })
    }

    /**
 * 添加已发布稿件扩展内容
 */
    static async updateExtRelease(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
            UPDATE manuscript_ext_release
            SET page_start_date = ?,page_end_date = ?,active_start_date = ?,active_end_date = ?,url = ?,recommend = ?
            WHERE relation_id = ? ;`
            let paramater = [
                params.pageStartDate,
                params.pageEndDate,
                params.activeStartDate,
                params.activeEndDate,
                params.url,
                params.recommend,
                params.relationId,
            ]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(true);
            })
        })
    }
    /**
     * 添加插件到稿件/模板
     */
    static async addPlugin(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = ``,
                rows = [],
                paramater = []
            params.data.forEach(item => {
                rows.push(`(?, ?, ?, ?)`)
                item.oldId = item.id
                item.id = uuid()
                paramater.push(item.id)
                paramater.push(item.type)
                paramater.push(item.relationId)
                paramater.push(item.controlId)
            })

            sql = `
                INSERT INTO activity_plugin_main (id, type, relation_id, control_id) 
                VALUES ${rows.join(",")};`

            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(params.data);
            })
        })
    }

    /**
     * 获取模板/稿件的插件
     */
    static async getPlugins(connection, params) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    SELECT 
                        id,
                        type,
                        relation_id as relationId,
                        control_id as controlId
                    FROM activity_plugin_main
                    WHERE relation_id = ?`
            let paramater = [params.relationId]
            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    }

    /**
     * 插件复制
     * @param {*} connection 
     * @param {*} params {id：源插件plugin_id, relationId:新稿件id}
     */
    static async copyPlugins(connection, params) {
        let pluginId = uuid.v1();
        // 复制主表
        let mainSql = `
            INSERT INTO \`activity_plugin_main\` (\`id\`, \`type\`, \`relation_id\`, \`control_id\`)
            (   SELECT ?, type, ?, control_id 
                FROM activity_plugin_main 
                WHERE id = ?)`;
        await this.exec(connection, mainSql, [pluginId, params.relationId, params.id]);
        // 复制奖品设置表
        let prizeSql = `
            INSERT INTO \`activity_plugin_prizesetting\` (\`id\`, \`plugin_id\`, \`option_name\`, \`prize_name\`, \`amount_original\`, \`amount\`, \`rate\`) 
            (   SELECT NULL, ?, option_name, prize_name, amount_original, amount, rate 
                FROM activity_plugin_prizesetting 
                WHERE plugin_id = ?)`;
        // 复制每个插件奖项设置：抽取次数，中奖次数
        await this.exec(connection, prizeSql, [pluginId, params.id]);
        let drawPrizeSql = `
            INSERT INTO \`activity_plugin_drawprize_setting\` (\`id\`, \`plugin_id\`, \`drawtime\`, \`wintime\`, \`intervaltime\`, \`intervaltime_type\`) 
            (   SELECT NULL, ?, drawtime, wintime, intervaltime, intervaltime_type 
                FROM activity_plugin_drawprize_setting 
                WHERE plugin_id = ?)`;
        await this.exec(connection, drawPrizeSql, [pluginId, params.id]);
        // 复制收集客户信息的JSON表单
        let collectSql = `
            INSERT INTO \`activity_plugin_collect\` (\`id\`, \`plugin_id\`, \`collect_json\`) 
            (   SELECT NULL, ?, collect_json 
                FROM activity_plugin_collect 
                WHERE plugin_id = ?)`;
        await this.exec(connection, collectSql, [pluginId, params.id]);
    }

    /**
     * 模板是否存在
     */
    static async isExists(connection, relationId) {
        return new Promise(async (resolve, reject) => {
            let paramater = [relationId];
            let sql = `SELECT count(1)as r FROM manuscript_main where id=? limit 1;`

            connection.query(sql, paramater, (err, result) => {
                if (err) return reject(err);
                resolve(!!result[0].r);
            })
        })
    }
}

module.exports = dao