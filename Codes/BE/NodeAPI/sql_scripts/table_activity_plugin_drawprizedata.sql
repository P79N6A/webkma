CREATE TABLE `activity_plugin_drawprizedata` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `relation_id` varchar(50) DEFAULT NULL COMMENT '关联ID (Manuscript)',
  `plugin_id` varchar(50) DEFAULT NULL COMMENT '插件ID',
  `userUuid` varchar(50) not null  COMMENT '用户uuid',
  `userNickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci null  COMMENT '用户昵称',
  `createtime` datetime DEFAULT NULL COMMENT '创建时间',
  `state` TINYINT DEFAULT NULL COMMENT '状态 0未中奖 1中奖',
  `rType` TINYINT DEFAULT NULL COMMENT '1:未中奖(算法) 2:用户抽奖次数已经用完 3:用户中奖次数已经用完 4:中奖时间间隔限制中 5:奖品数量不足',
  `prize_name` varchar(50) DEFAULT NULL COMMENT '奖品名称',
  `prize_no` varchar(50) DEFAULT NULL COMMENT '中奖号码',
  `exchange_state` int(11) DEFAULT NULL COMMENT '兑奖状态',
  `exchangetime` datetime DEFAULT NULL COMMENT '兑奖时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 collate utf8mb4_general_ci;

ALTER TABLE `activity_plugin_drawprizedata` ADD INDEX index_drawprizedata_userUuid (`userUuid`);
ALTER TABLE `activity_plugin_drawprizedata` ADD INDEX index_drawprizedata_relation_id (`relation_id`);
ALTER TABLE `activity_plugin_drawprizedata` ADD INDEX index_drawprizedata_plugin_id (`plugin_id`);
ALTER TABLE `activity_plugin_drawprizedata` ADD unique(`prize_no`);