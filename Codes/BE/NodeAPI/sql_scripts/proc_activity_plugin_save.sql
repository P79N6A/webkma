DROP PROCEDURE IF EXISTS `proc_activity_plugin_save`;
DELIMITER ;;
CREATE PROCEDURE `proc_activity_plugin_save`(
in $relationId varchar(50),
in $controlId varchar(50))
BEGIN
	declare _pluginId varchar(50) default null;
	# 判断活动插件是否存在
	if not exists(select 1 from activity_plugin_main where relation_id=$relationId and control_id=$controlId limit 1)
	then
		select UUID() into _pluginId;
		INSERT INTO `activity_plugin_main`
		(`id`,
		`type`,
		`relation_id`,
		`control_id`)
		VALUES
		(_pluginId,
		2,
		$relationId,
		$controlId);
	else
		select id into _pluginId from activity_plugin_main where relation_id=$relationId and control_id=$controlId limit 1;
	end if;
    select _pluginId as pluginId;
END;
;;
DELIMITER ;