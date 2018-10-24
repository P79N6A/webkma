DROP PROCEDURE IF EXISTS `proc_getDrawprizeConfig`;
DELIMITER ;;
CREATE PROCEDURE `proc_getDrawprizeConfig`(
in $relationId varchar(50),
in $controlId varchar(50),
in $userUuid varchar(50))
BEGIN
    declare _pluginId varchar(50); 
    declare _createtime datetime;
	# 判断活动插件是否存在
	if not exists(select 1 from activity_plugin_main where relation_id=$relationId and control_id=$controlId and `type`=2 limit 1)
    then
		select 400 as `status`,'活动插件不存在' as msg;
	else
		select id into _pluginId from activity_plugin_main where relation_id=$relationId and control_id=$controlId and `type`=2 limit 1;
		# 判断活动插件抽奖配置是否存在
		if not exists(select 1 from activity_plugin_drawprize_setting where plugin_id=_pluginId limit 1)
		then
			select 400 as `status`,'动插件抽奖配置不存在' as msg;
		else
			# 判断奖品配置是否存在
			if not exists(select 1 from activity_plugin_prizesetting where plugin_id=_pluginId limit 1)
			then
				select 400 as `status`,'奖品配置不存' as msg;
			else
				# 读取抽奖配置
					select 
					`id`,
					`plugin_id`,
					`drawtime`,
					`wintime`,
					`intervaltime`,
					`intervaltime_type`
					from activity_plugin_drawprize_setting
					where plugin_id=_pluginId;
				# 读取奖品配置
				select 
					`id`,
					`plugin_id`,
					`option_name`,
					`prize_name`,
					`amount`,
					`rate`            
				from activity_plugin_prizesetting 
				where plugin_id=_pluginId and amount>0;
                # 创建抽奖记录临时表
				CREATE TEMPORARY TABLE tmp_drawprizedata (
				  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
				  `createtime` datetime DEFAULT NULL COMMENT '创建时间',
				  `state` tinyint(4) DEFAULT NULL COMMENT '状态 0未中奖 1中奖',
				  PRIMARY KEY (`id`)
				);

				# 读取用户抽奖记录
                insert into tmp_drawprizedata (
				select 
                  `id`,
				  `createtime`,
				  `state`
				from activity_plugin_drawprizedata 
				where userUuid=$userUuid and relation_id=$relationId and plugin_id=_pluginId);
                
                select createtime into _createtime from tmp_drawprizedata order by createtime desc limit 1;
                select count(1) as NOFD,ifnull(sum(ifnull(state,0)),0) as NOFW,
                _createtime as LWT
                from tmp_drawprizedata;
                
                DROP TABLE tmp_drawprizedata;
			end if;
		end if;
    end if;
END;
;;
DELIMITER ;