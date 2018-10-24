const
    config = require("Config"),
    request = require("Request");

module.exports = {
    /**
     * 获取游戏配置
     * @param {JSON} { relationId: "稿件ID", controlId: "控件ID"} 
     * @param {function} callback 回调函数 (err, result)
     */
    getGameSettings(params, callback) {
        request.get({
            url: `${config.apiHost}activity/plugin/prize?relationId=${params.relationId}&controlId=${params.controlId}`
        }, (res) => {
            callback(null, {
                actStartDate: res.data.setting.actStartTime,
                actEndDate: res.data.setting.actEndTime,
                drawTotal: res.data.setting.drawTime,
                drawCount: res.data.setting.userDrawTime,
                status: res.data.setting.status,
                prizeList: res.data.prizes
            });
        });
    },
    /**
     * 执行抽奖并返回抽奖结果
     * @param {JSON} params { relationId: "稿件ID", controlId: "控件ID"}
     * @param {function} callback 回调函数 (err, result)
     */
    drawPrize(params, callback) {
        request.post({
            url: `${config.apiHost}activity/plugin/drawprize`,
            data: {
                "relationId": params.relationId,
                "controlId": params.controlId
            }
        }, (res) => {
            let result, err;
            if (res instanceof Error) {
                err = new Error("操作异常");
            } else {
                switch (res.data.code) {
                    // --- 系统错误(弱提示) ---
                    case 0: // 找不到活动插件
                    case 2: // 找不到活动插件配置
                    case 3: // 找不到奖品配置
                    case 7: // 奖品概率不正确
                        err = new Error("活动异常，请稍后再试。");
                        console.log(`活动异常，请稍后再试。 Code: ${res.data.code}`);
                        break;
                    // --- 业务限制(提示) ---
                    case 1: // 用户正在参与抽奖
                        err = new Error("正在参与抽奖，请勿反复执行");
                        break;
                    case 5: // 用户抽奖次数已用完
                        err = new Error("您的抽奖次数已经用完了");
                        break;
                    case 10:// 不在活动时间
                        err = new Error("活动尚未开始，请稍后再来");
                        break;
                    // --- 未中奖（页面流程） ---
                    case 4: // 奖品数量不足
                    case 6: // 用户中奖次数已用完
                    case 8: // 未抽到
                    case 9: // 中奖时间限制
                        result = { status: false };
                        break;
                    // --- 已中奖（页面流程） ---
                    case 200:
                        // result = { status: true, level: res.data.optionName, name: res.data.prizeName }
                        result = { status: true, level: "一等奖", name: "Apple iPhone X 256GB 黑色一部" }
                        break;
                }
            }
            // test
            // result = { status: true, level: "一等奖", name: "Apple iPhone X 256GB 黑色一部" }
            callback(err, result);
        });
    },
    /**
     * 根据主题获取结果层预制件(Prefab)
     * @param {string} theme 主题名称
     * @param {function} callback 回调函数 (err, prefab)
     */
    getLayerResultPrefab(theme, callback) {
        let themeName;
        switch (theme) {
            case "red":
                themeName = "LayerResult_Red";
                break;
        }
        cc.loader.loadRes(`LayerResult/Themes/${themeName}`, function (err, prefab) {
            if (!err && !(prefab instanceof cc.Prefab)) err = new Error("主题预制件不存在");
            callback(err, prefab);
        });
    }
}