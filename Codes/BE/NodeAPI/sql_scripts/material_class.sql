CREATE TABLE `material_class` (
  `id` INT(11) AUTO_INCREMENT NOT NULL COMMENT '编号',
  `class_name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `class_path` VARCHAR(255) NOT NULL COMMENT '分类路径',
  `class_key` VARCHAR(50) DEFAULT NULL COMMENT '分类标识',
  `class_md5` VARCHAR(50) DEFAULT NULL COMMENT '分类路径MD5加密',
  `class_remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `createtime` datetime DEFAULT now() COMMENT '创建时间',
  `is_delete` BOOL NOT NULL DEFAULT FALSE COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;


INSERT INTO `material_class`(
	`class_name` ,
	`class_path` ,
	`class_key` ,
	`class_md5` ,
	`class_remark` ,
	`createtime` ,
	`is_delete`
)
VALUES
	(
		'文本' ,
		'' ,
		'controls_text' ,
		NULL ,
		NULL ,
		'2018-07-02 10:36:22' ,
		'0'
	) ,
	(
		'背景' ,
		'' ,
		'controls_background' ,
		NULL ,
		NULL ,
		'2018-07-02 10:42:54' ,
		'0'
	) ,
	(
		'图片' ,
		'' ,
		'controls_image' ,
		NULL ,
		NULL ,
		'2018-07-02 10:43:38' ,
		'0'
	) ,
	(
		'形状' ,
		'' ,
		'controls_shape' ,
		NULL ,
		NULL ,
		'2018-07-02 10:44:26' ,
		'0'
	);