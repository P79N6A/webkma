CREATE TABLE `activity_plugin_collect` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键记录',
  `plugin_id` varchar(50) NOT NULL COMMENT '插件Id',
  `collect_json` Text COMMENT 'json字符串',	
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `activity_plugin_collect` ADD unique(plugin_id); 