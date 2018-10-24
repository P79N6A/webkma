CREATE TABLE `activity_plugin_drawprize_setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `plugin_id` varchar(50) DEFAULT NULL COMMENT '插件ID',
  `drawtime` int(11) DEFAULT NULL COMMENT '抽奖次数',
  `wintime` int(11) DEFAULT NULL COMMENT '得奖次数',
  `intervaltime` int(11) DEFAULT NULL COMMENT '间隔时间',
  `intervaltime_type` int(11) DEFAULT NULL COMMENT '间隔时间单位，1：分钟；2：小时；3：天',
  PRIMARY KEY (`id`),
  KEY `index_plugin_id` (`plugin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8;
