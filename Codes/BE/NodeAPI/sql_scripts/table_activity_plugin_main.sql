CREATE TABLE `activity_plugin_main` (
  `id` varchar(50) NOT NULL COMMENT '唯一编号',
  `type` tinyint(4) DEFAULT NULL COMMENT '插件类型：1：表单插件；2：活动插件',
  `relation_id` varchar(50) DEFAULT NULL COMMENT '关联ID (Manuscript)',
  `control_id` varchar(50) DEFAULT NULL COMMENT '插件编号(关联前端生成的插件编号）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `activity_plugin_main` ADD unique(relation_id,control_id); 