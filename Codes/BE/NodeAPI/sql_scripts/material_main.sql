CREATE TABLE `material_main` (
  `mtr_id` VARCHAR(50) NOT NULL COMMENT '编号',
  `user_id` VARCHAR(100) NOT NULL DEFAULT '0'COMMENT '0表示后台上传的图片',
  `mtr_source_name` VARCHAR(100) NOT NULL COMMENT '素材名称',
  `mtr_template_name` VARCHAR(100) DEFAULT NULL COMMENT '素材名称',
  `mtr_source` VARCHAR(255) NOT NULL COMMENT '素材源路径',
  `mtr_template` VARCHAR(255) DEFAULT NULL COMMENT '素材模板路径',
  `mtr_type` VARCHAR(50) DEFAULT NULL COMMENT '素材类型',
  `mtr_class` VARCHAR(50) DEFAULT NULL COMMENT '素材分类',
  `mtr_md5` VARCHAR(50) DEFAULT NULL COMMENT '素材路径MD5加密',
  `mtr_remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `createtime` datetime DEFAULT now() COMMENT '创建时间',
  `is_delete` BOOL NOT NULL DEFAULT FALSE COMMENT '是否删除',
  PRIMARY KEY (`mtr_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
