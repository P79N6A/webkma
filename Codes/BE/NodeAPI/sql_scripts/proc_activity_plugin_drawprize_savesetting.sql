DROP PROCEDURE IF EXISTS `proc_activity_plugin_drawprize_savesetting`;
DELIMITER ;;
CREATE PROCEDURE `proc_activity_plugin_drawprize_savesetting`(
in $pluginId varchar(50),
in $drawtime int(11),
in $wintime int(11),
in $intervaltime int(11),
in $intervaltime_type int(11)) 
BEGIN
	declare _id int(11);
	if not exists(select 1 from activity_plugin_drawprize_setting where plugin_id=$pluginId limit 1)
	then
		INSERT INTO `activity_plugin_drawprize_setting`
		(`plugin_id`,
		`drawtime`,
		`wintime`,
		`intervaltime`,
		`intervaltime_type`)
		VALUES
		($pluginId,
		$drawtime,
		$wintime,
        $intervaltime,
		$intervaltime_type);
	else
		select id into _id from activity_plugin_drawprize_setting where plugin_id=$pluginId limit 1;
		UPDATE `activity_plugin_drawprize_setting`
		SET
		`plugin_id` = $pluginId,
		`drawtime` = $drawtime,
		`wintime` = $wintime,
		`intervaltime` = $intervaltime,
		`intervaltime_type` = $intervaltime_type
		WHERE `id` = _id;
    end if;
END;
;;
DELIMITER ;