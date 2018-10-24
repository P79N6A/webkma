DROP PROCEDURE IF EXISTS `proc_activity_plugin_savecollect`;
DELIMITER ;;
CREATE PROCEDURE `proc_activity_plugin_savecollect`(
in $pluginId varchar(50),
in $collect_json text)
BEGIN
	declare _id int(11);
	if not exists(select 1 from activity_plugin_collect where plugin_id=$pluginId limit 1)
	then
		INSERT INTO `activity_plugin_collect`
		(`plugin_id`,
		`collect_json`)
		VALUES
		($pluginId,
		$collect_json);
	else
		select id into _id from activity_plugin_collect where plugin_id=$pluginId limit 1;
		UPDATE `activity_plugin_collect`
		SET
		`plugin_id` = $pluginId,
		`collect_json` = $collect_json
		WHERE `id` =_id;
    end if;
END;
;;
DELIMITER ;