CREATE TABLE `activity_plugin_prizesetting` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `plugin_id` varchar(50) DEFAULT NULL COMMENT '插件ID',
  `option_name` varchar(50) DEFAULT NULL COMMENT '奖项名称',
  `prize_name` varchar(50) DEFAULT NULL COMMENT '奖品名称',
  `amount_original` int(11) DEFAULT NULL COMMENT '奖品原始数量',
  `amount` int(11) DEFAULT NULL COMMENT '奖品原始数量',
  `rate` float(5,2) DEFAULT NULL COMMENT '获奖概率，0到100的小数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8;

ALTER TABLE `activity_plugin_prizesetting` ADD INDEX index_plugin_id (`plugin_id`);