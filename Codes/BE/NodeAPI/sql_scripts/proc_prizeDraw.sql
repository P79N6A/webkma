DROP PROCEDURE IF EXISTS `proc_prizeDraw`;
DELIMITER ;;
CREATE PROCEDURE `proc_prizeDraw`(
in $pluginId varchar(50),
in $userUuid varchar(50))
BEGIN
    declare _totalRate double DEFAULT 0; 
	# 判断活动插件是否存在
	if not exists(select 1 from activity_plugin_main where id=$pluginId and `type`=2)
    then
		select 400 as `status`,'活动插件不存在' as msg;
	else
		# 判断活动插件配置是否存在
		if not exists(select 1 from activity_plugin_prizesetting where plugin_id=$pluginId)
		then
			select 400 as `status`,'活动插件配置不存在' as msg;
		else
			# 读取活动插件配置
            
		end if;
    end if;
END;
;;
DELIMITER ;