CREATE TABLE `user_bind` (
  `id` INT(11) AUTO_INCREMENT NOT NULL COMMENT '编号',
  `business_id` VARCHAR(50) DEFAULT NULL COMMENT '商户id',
  `user_id` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `bind` VARCHAR(255) NOT NULL COMMENT '绑定的内容',
  `type` INT(4) DEFAULT 0 COMMENT '分类标识 0 普通用户绑定 1 员工',
  `createtime` datetime DEFAULT now() COMMENT '创建时间',
  `is_delete` BOOL NOT NULL DEFAULT FALSE COMMENT '是否删除',
  PRIMARY KEY (`id`,`bind`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
