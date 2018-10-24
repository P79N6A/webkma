CREATE TABLE `activity_plugin_drawprize_statistics` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `relation_id` varchar(50) DEFAULT NULL COMMENT '关联ID (Manuscript)',
  `plugin_id` varchar(50) DEFAULT NULL COMMENT '插件ID',
  `draw_count` int(11) DEFAULT NULL COMMENT '抽奖总次数',
  `win_count` int(11) DEFAULT NULL COMMENT '得奖总次数',
  PRIMARY KEY (`id`),
  KEY `index_drawprize_statistics_relation_id` (`relation_id`),
  KEY `index_drawprize_statistics_plugin_id` (`plugin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8;
