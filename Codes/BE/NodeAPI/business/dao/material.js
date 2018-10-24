const
    materialUrl = require('../../config/system-config-env').materailUrl



class materialDao {

    static async exec(connection, sql, params) {
        return new Promise((resolve, reject) => {
            connection.query(sql, params, (err, result) => {
                if (err) return reject(err)
                return resolve(result)
            });
        });
    }

    static async saveMaterial(connection, params) {
        var sql = `INSERT INTO material_main SET ?;`,
            sqlParams = {
                mtr_id: params.mtrId,
                user_id: params.userId,
                mtr_source_name: params.mtrSourceName,
                mtr_template_name: params.mtrTemplateName,
                mtr_source: params.mtrSource,
                mtr_template: params.mtrTemplate,
                mtr_type: params.mtrType,
                mtr_md5: params.mtrMd5
            }
        if (params.mtrClass)
            sqlParams.mtr_class = params.mtrClass
        if (params.mtrRemark)
            sqlParams.mtr_remark = params.mtrRemark

        return (await materialDao.exec(connection, sql, sqlParams)).affectedRows > 0 ? params.mtrId : Promise.reject('保存失败')
    }

    static async searchMaterial(connection, params) {
        var where = ["WHERE 1 = 1 AND is_delete = 0"],
            sql = () => `SELECT
            mtrm.mtr_id AS mtrId,
            mtrm.mtr_source_name mtrSourceName,
            mtrm.mtr_template_name mtrTemplateName,
            mtrm.mtr_source AS mtrSource,
            mtrm.mtr_template AS mtrTemplate,
            mtrm.mtr_type AS mtrType,
            mtrm.mtr_class AS mtrClass,
            mtrm.mtr_remark AS mtrRemark,
            DATE_FORMAT(mtrm.createtime,'%Y-%m-%d %T') as createtime,
            GROUP_CONCAT(t.id) as tagIds,
            GROUP_CONCAT(t.\`name\`) as tagNames
        FROM
            material_main mtrm
    LEFT JOIN tag_with_material twm ON twm.relation_id = mtrm.mtr_id 
    LEFT JOIN tags AS t ON t.id = twm.tag_id 
    
    ${where.join(' ')}
    GROUP BY
         mtrm.mtr_id 
    ORDER BY
         mtrm.createtime ${params.sort}

    limit ${(params.pageIndex - 1) * params.pageSize}, ${params.pageSize}
    ;`,
            sqlCount = () => `SELECT COUNT(*) AS count FROM (SELECT
                mtrm.mtr_id 
            FROM
                material_main mtrm
        LEFT JOIN tag_with_material twm ON twm.relation_id = mtrm.mtr_id 
        LEFT JOIN tags AS t ON t.id = twm.tag_id 
        
        ${where.join(' ')}
        GROUP BY
             mtrm.mtr_id 
        ) as a
        `,

            sqlParams = []

        if (params.userId)
            where.push(`AND mtrm.user_id = '${params.userId}'`)
        if (params.mtrType)
            where.push(` AND mtrm.mtr_type = '${params.mtrType}'`)
        if (params.mtrClass)
            where.push(`AND mtrm.mtr_class = '${params.mtrClass}'`)
        if (params.mtrMd5)
            where.push(`AND mtrm.mtr_md5 = '${params.mtrMd5}'`)
        if (params.exitemtrId)
            where.push(`AND mtrm.mtr_id <> '${params.exitemtrId}'`)
        if (params.startTime)
            where.push(`AND mtrm.createtime > '${params.startTime}'`)
        if (params.endTime)
            where.push(`AND mtrm.createtime < '${params.endTime}'`)
        if (params.mtrId)
            where.push(`AND mtrm.mtr_id like '%${params.mtrId}%'`)
        if (params.mtrSourceName)
            where.push(`AND mtrm.mtr_source_name like '%${params.mtrSourceName}%'`)
        if (params.tagId)
            where.push(`AND t.id = '${params.tagId}'`)


        var data = await materialDao.exec(connection, sql(), sqlParams)
        data.forEach(element => {
            if (element.tagIds) {
                let tagIds = element.tagIds.split(','),
                    tagNames = element.tagNames.split(','),
                    tags = []
                for (var i = 0; i < tagIds.length; i++) {
                    tags.push({ id: tagIds[i], tagName: tagNames[i] })
                }
                element.tags = tags
            } else {
                element.tags = []
            }

        });
        return {
            list: data,
            total: (await materialDao.exec(connection, sqlCount(), sqlParams))[0].count,
            pageIndex: params.pageIndex,
            pageSize: params.pageSize
        }
    }


    static async updateMaterial(connection, params) {
        var sql = `UPDATE material_main SET ? where mtr_id = ?;`,
            obj = {},
            sqlParams = []
        if (params.mtrClass)
            obj.mtr_class = params.mtrClass
        if (params.mtrSource)
            obj.mtr_source = params.mtrSource
        if (params.mtrTemplate)
            obj.mtr_template = params.mtrTemplate
        if (params.mtrType)
            obj.mtr_type = params.mtrType
        if (params.mtrSourceName)
            obj.mtr_source_name = params.mtrSourceName
        if (params.mtrTemplateName)
            obj.mtr_template_name = params.mtrTemplateName
        if (params.isDelete)
            obj.is_delete = params.isDelete
        if (params.mtrRemark)
            obj.mtr_remark = params.mtrRemark

        sqlParams.push(obj)
        sqlParams.push(params.mtrId)

        return (await materialDao.exec(connection, sql, sqlParams)).affectedRows > 0 ? 'success' : Promise.reject('更新失败')
    }

    static async deleteMaterial(connection, params) {
        var sql = `UPDATE material_main SET ? where mtr_id in (?);`,
            obj = {},
            sqlParams = []
        if (params.isDelete)
            obj.is_delete = params.isDelete

        sqlParams.push(obj)
        sqlParams.push(params.mtrIds)

        return (await materialDao.exec(connection, sql, sqlParams)).affectedRows > 0 ? 'success' : Promise.reject('更新失败')
    }

    //class 

    static async searchClass(connection, params) {
        let where = ["WHERE 1 = 1 AND is_delete = 0"],
            sql = () => `SELECT
            id,
            class_name className,
            class_path classPath,
            class_key classKey,
            class_remark classRemark,
            DATE_FORMAT(createtime,'%Y-%m-%d %T') as createtime
        FROM
            material_class
        ${where.join(' ')}
        ORDER BY
            createtime DESC
        LIMIT ${(params.pageIndex - 1) * params.pageSize}, ${params.pageSize}`,
            sqlCount = () => `SELECT COUNT(*) AS count FROM (SELECT
            id
        FROM
            material_class
        ${where.join(' ')}) AS a`,
            sqlParams = []

        if (params.classMd5)
            where.push(`AND class_md5 = '${params.classMd5}'`)
        if (params.className)
            where.push(`AND class_name like '%${params.className}%'`)
        if (params.classKey)
            where.push(`AND class_type = '${params.classKey}'`)

        return {
            list: await materialDao.exec(connection, sql(), sqlParams),
            total: (await materialDao.exec(connection, sqlCount(), sqlParams))[0].count,
            pageIndex: params.pageIndex,
            pageSize: params.pageSize
        }
    }

}

module.exports = materialDao