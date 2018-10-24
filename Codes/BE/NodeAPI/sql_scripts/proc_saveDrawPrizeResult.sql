DROP PROCEDURE IF EXISTS `proc_saveDrawPrizeResult`;
DELIMITER ;;
CREATE PROCEDURE `proc_saveDrawPrizeResult`(
in $drawStatus varchar(50),
in $rType TINYINT,
in $relationId varchar(50),
in $userUuid varchar(50),
in $userNickname varchar(50),
in $pluginId varchar(50),
in $prizeId int(11),
in $prize_no varchar(50))
BEGIN
  declare _option_name varchar(50);
  declare _prize_name varchar(50);
  declare _amount int(11);
  declare _sid int(11);
  declare _win_count int(11);
	# 判断活动插件是否存在
	if $drawStatus=1 and not exists(select 1 from activity_plugin_prizesetting where id=$prizeId limit 1) 
    then
		select -1 as `drawStatus`,'奖品不存在' as errorMsg;
	else
    
		select option_name,prize_name,amount into _option_name,_prize_name,_amount  
		from activity_plugin_prizesetting where id=$prizeId limit 1;
            
		# 如果数量不足就未中奖
		if(_amount=0)
		then
			select 0,5 into $drawStatus,$rType;
		end if;
        
		if($drawStatus=1)
        then     
			update activity_plugin_prizesetting
			set amount=amount-1 
			where id=$prizeId;
			
			INSERT INTO `activity_plugin_drawprizedata`
			(`relation_id`,
			`plugin_id`,
			`userUuid`,
            `userNickname`,
			`createtime`,
			`state`,
            `rType`,
			`prize_name`,
			`prize_no`,
			`exchange_state`,
			`exchangetime`)
			VALUES
			($relationId,
			$pluginId,
			$userUuid,
            $userNickname,
			now(),
			1,
            null,
			_prize_name,
			$prize_no,
			0,
			null);
		else
			INSERT INTO `activity_plugin_drawprizedata`
			(`relation_id`,
			`plugin_id`,
			`userUuid`,
            `userNickname`,
			`createtime`,
			`state`,
            `rType`,
			`prize_name`,
			`prize_no`,
			`exchange_state`,
			`exchangetime`)
			VALUES
			($relationId,
			$pluginId,
			$userUuid,
			$userNickname,
			now(),
			0,
            $rType,
			null,
			null,
			0,
			null);        
        end if;
    


		# 如果数量不足就未中奖
		if($drawStatus=1)
		then
			select 1 into _win_count;
		else
            select 0 into _win_count;
		end if;
		
        if not exists(select 1 from activity_plugin_drawprize_statistics where relation_id=$relationId and plugin_id=$pluginId limit 1)
        then
			INSERT INTO activity_plugin_drawprize_statistics
			(`relation_id`,
			`plugin_id`,
			`draw_count`,
			`win_count`)
			VALUES
			($relationId,
			$pluginId,
			1,
			_win_count);	
		else
			select id into _sid from activity_plugin_drawprize_statistics where relation_id=$relationId and plugin_id=$pluginId limit 1;
			UPDATE activity_plugin_drawprize_statistics
			SET
			`draw_count` = `draw_count`+1,
			`win_count` = `win_count`+_win_count 
			WHERE `id` = _sid;
        end if;
        
		select $drawStatus as drawStatus,$rType as rType,$prizeId as prizeId,_option_name as optionName, _prize_name as prizeName,$prize_no as prizeNo;
    end if;
END;
;;
DELIMITER ;