const
    random = require('random'),
    moment = require('moment'),
    Decimal = require('decimal.js'),
    _ = require("lodash")

const paramStruct = {
    plugin: {
        // 抽奖插件Id
        pluginId: 1,
        // 每人抽奖次数限制
        Limit_NOFD: 1,
        // 每人中奖次数限制
        Limit_NOFW: 1,
        // 每人中奖间隔时间
        intervalTime: 1,
        // 间隔时间单位，1：分钟；2：小时；3：天
        intervalTimeType: 1,
        // map类型
        prizeSetting: {
            1: {
                // 奖品Id
                id: 1,
                // 奖品数量
                amount: 1,
                // 中奖概率
                odds: 20
            },
            2: {
                // 奖品Id
                id: 2,
                // 奖品数量
                amount: 1,
                // 中奖概率
                odds: 80
            }
        }
    },
    user: {
        // 第三方用户Id
        userId: "111",
        // 抽奖次数
        NOFD: 0,
        // 中奖次数
        NOFW: 0,
        // 最后一次中奖时间
        LWT: null
    }
}

const resultStruct = {
    // 抽奖结果 -1:异常 0:未中奖 1:中奖
    drawStatus: 1,
    // 错误消息:drawStatus=-1
    errorMsg: '',
    // 未中奖原因:drawStatus=0
    // 1:未中奖(算法)
    // 2:用户抽奖次数已经用完
    // 3:用户中奖次数已经用完
    // 4:中奖时间间隔限制中
    // 5:奖品数量不足
    rType: 1,
    // 中奖奖品Id:drawStatus=1
    prizeId: 1,
    // 中奖奖项名称Id:drawStatus=1
    optionName: '',
    // 中奖奖品名称Id:drawStatus=1
    prizeName: '',
    // 兑奖码
    prizeNo: ''
}

const TOTALODDS = 100

const lotteryDraw = param => {

    let checkResult = checkParam(param)
    if (checkResult !== true) {
        return checkResult
    }

    // 检查是否超过抽奖次数限制
    if (param.user.NOFD >= param.plugin.Limit_NOFD)
        return {
            // 抽奖结果 -1:异常 0:未中奖 1:中奖
            drawStatus: 0,
            // 未中奖原因:drawStatus=0
            // 1:未中奖(算法)
            // 2:用户抽奖次数已经用完
            // 3:用户中奖次数已经用完
            // 4:中奖时间间隔限制中
            // 5:奖品数量不足
            rType: 2,
        }

    // 检查中奖次数限制(超过直接返回未中奖)
    if (param.user.NOFW >= param.plugin.Limit_NOFW)
        return {
            // 抽奖结果 -1:异常 0:未中奖 1:中奖
            drawStatus: 0,
            // 未中奖原因:drawStatus=0
            // 1:未中奖(算法)
            // 2:用户抽奖次数已经用完
            // 3:用户中奖次数已经用完
            // 4:中奖时间间隔限制中
            // 5:奖品数量不足
            rType: 3,
        }

    // 设置了中奖天数间隔
    if (param.plugin.intervalTime != void 0 &&
        param.plugin.intervalTime != null &&
        param.plugin.intervalTime > 0 &&
        param.user.LWT != void 0 &&
        param.user.LWT != null) {
        // 上次中奖间隔时间
        let now = moment().utcOffset(-8)
        let lwtDate = moment(param.user.LWT).utcOffset(-8)
        // 间隔时间单位，1：分钟；2：小时；3：天
        // intervalTimeType: 1

        let diffUnit = null
        switch (param.plugin.intervalTimeType) {
            case 1:
                diffUnit = 'minutes'
                break;
            case 2:
                diffUnit = 'hours'
                break;
            case 3:
                diffUnit = 'days'
                break;
        }
        let lwtDiff = now.diff(lwtDate, diffUnit)
        // 检查上次中奖时间(时间限制内直接返回未中奖)
        if (lwtDiff < param.plugin.intervalTime) {
            return {
                // 抽奖结果 -1:异常 0:未中奖 1:中奖
                drawStatus: 0,
                // 未中奖原因:drawStatus=0
                // 1:未中奖(算法)
                // 2:用户抽奖次数已经用完
                // 3:用户中奖次数已经用完
                // 4:中奖时间间隔限制中
                // 5:奖品数量不足
                rType: 4,
            }
        }
    }

    // 只有一个奖品
    let prizeSettingKeys = _.keys(param.plugin.prizeSetting);
    if (prizeSettingKeys.length == 1) {
        let setting = param.plugin.prizeSetting[prizeSettingKeys[0]]
        if (setting.amount <= 0) {
            // 奖品数量不足，返回未中奖
            return {
                // 抽奖结果 -1:异常 0:未中奖 1:中奖
                drawStatus: 0,
                // 未中奖原因:drawStatus=0
                // 1:未中奖(算法)
                // 2:用户抽奖次数已经用完
                // 3:用户中奖次数已经用完
                // 4:中奖时间间隔限制中
                // 5:奖品数量不足
                rType: 5,
            }
        }

        if (setting.odds == 100) {
            return {
                // 抽奖结果 -1:异常 0:未中奖 1:中奖
                drawStatus: 1,
                prizeId: setting.id,
            }
        }
    }

    let TOTALODDS1 = _.reduce(param.plugin.prizeSetting, (sum, setting) => setting.amount <= 0 ? 0 : +Decimal.add(sum, setting.odds).toFixed(2), 0);
    if (TOTALODDS1 === 0)
        return {
            // 抽奖结果 -1:异常 0:未中奖 1:中奖
            drawStatus: 0,
            // 未中奖原因:drawStatus=0
            // 1:未中奖(算法)
            // 2:用户抽奖次数已经用完
            // 3:用户中奖次数已经用完
            // 4:中奖时间间隔限制中
            // 5:奖品数量不足
            rType: 1,
        }

    let normalWTP = 0
    let isLuck = false
    //let p1 = Decimal.div(param.user.NOFD + 1, 2)
    let p1 = 1
    if (TOTALODDS1 < 100) {
        let p = +Decimal.div(TOTALODDS, TOTALODDS1).toFixed(2)
        let u = p
        let a = 1

        let divP = 0
        let NOFDLimit = 3
        if (p >= 0 && p <= 1)
            divP = 10
        else if (p > 1 && p <= 1.25)
            divP = 9
        else if (p > 1.25 && p <= 1.5)
            divP = 8
        else if (p > 1.5 && p <= 1.75)
            divP = 7
        else if (p > 1.75 && p <= 2.0)
            divP = 6
        else if (p > 2.0 && p <= 2.25)
            divP = 5
        else if (p > 2.25 && p <= 2.5)
            divP = 4
        else if (p > 2.5 && p <= 2.75)
            divP = 3
        else if (p > 2.75 && p <= 3.0) {
            divP = 2.5
            NOFDLimit = 4
        }
        else if (p > 3.0 && p <= 3.25) {
            divP = 2
            NOFDLimit = 5
        }
        else {
            divP = 1.5
            a = 1.5
            NOFDLimit = 6
        }

        p1 = Decimal.add(param.user.NOFD > NOFDLimit ? NOFDLimit : param.user.NOFD, 1).div(divP).plus(1)

        if (p > 0 && p <= 2) {
            // 超高中奖率
            p1 = +p1.plus(0.99).toFixed(2)
        }
        else if (p > 2 && p <= 2.25) {
            // 高中奖率
            p1 = +p1.plus(0.95).toFixed(2)
        }
        else if (p > 2.25 && p <= 2.5) {
            // 高中奖率
            p1 = +p1.plus(0.92).toFixed(2)
        }
        else if (p > 2.5 && p <= 2.75) {
            // 中等中奖率
            p1 = +p1.plus(0.90).toFixed(2)
        }
        else if (p > 2.75 && p <= 3.0) {
            // 中等中奖率
            p1 = +p1.plus(0.89).toFixed(2)
        }
        else if (p > 3.0 && p < 4) {
            // 低中奖率
            p1 = +p1.plus(0.99).toFixed(2)
        }
        else {
            // 超低中奖率
            p1 = +p1.plus(1.0).toFixed(2)
        }

        if (p >= 5 && param.user.NOFD <= 1) {
            p1 = Decimal.add(p1, 0.5).toFixed(2)
            a = 1.5
        }
        normalWTP = +new Decimal(random.normal(u, a)()).toFixed(2)
    }
    else
        isLuck = true

    p1 = (+p1)
    if (normalWTP <= p1 || isLuck) {
        let prizeSetting = _.orderBy(param.plugin.prizeSetting, ['odds'], ['desc']);
        let sumodds = 0
        let r = random.float(0, TOTALODDS1)
        for (var i = 0; i < prizeSetting.length; i++) {
            if (i == 0) {
                sumodds = prizeSetting[i].odds
                if (0 <= r && r < prizeSetting[i].odds)
                    return {
                        // 抽奖结果 -1:异常 0:未中奖 1:中奖
                        drawStatus: 1,
                        prizeId: prizeSetting[i].id,
                    }
            }
            else {
                let endOdds = +Decimal.add(sumodds, prizeSetting[i].odds).toFixed(2)
                if (sumodds <= r && r < endOdds)
                    return {
                        // 抽奖结果 -1:异常 0:未中奖 1:中奖
                        drawStatus: 1,
                        prizeId: prizeSetting[i].id,
                    }
                sumodds = endOdds
            }
        }
    }

    // 未中奖
    return {
        // 抽奖结果 -1:异常 0:未中奖 1:中奖
        drawStatus: 0,
        // 未中奖原因:drawStatus=0
        // 1:未中奖(算法)
        // 2:用户抽奖次数已经用完
        // 3:用户中奖次数已经用完
        // 4:中奖时间间隔限制中
        // 5:奖品数量不足
        rType: 1,
    }
}

/**
 * 检查抽奖参数
 *
 * @function
 * @param {Object} param 抽奖参数
 * @return {Boolean}
 */
const checkParam = param => {

    if (param == void 0 || param == null)
        return {
            // 抽奖结果 -1:异常 0:未中奖 1:中奖
            drawStatus: -1,
            // 错误消息:drawStatus=-1
            errorMsg: '参数不正确'
        }

    if (param.plugin == void 0 || param.plugin == null)
        return {
            // 抽奖结果 -1:异常 0:未中奖 1:中奖
            drawStatus: -1,
            // 错误消息:drawStatus=-1
            errorMsg: '参数不正确'
        }

    if (param.plugin.prizeSetting == void 0 || param.plugin.prizeSetting == null || param.plugin.prizeSetting.length == 0)
        return {
            // 抽奖结果 -1:异常 0:未中奖 1:中奖
            drawStatus: -1,
            // 错误消息:drawStatus=-1
            errorMsg: '参数不正确'
        }

    let oddsSum = new Decimal(0)
    let amountSum = new Decimal(0)
    for (var key in param.plugin.prizeSetting) {
        var setting = param.plugin.prizeSetting[key]
        if (setting.amount < 0)
            return {
                // 抽奖结果 -1:异常 0:未中奖 1:中奖
                drawStatus: -1,
                // 错误消息:drawStatus=-1
                errorMsg: '奖品数量不正确'
            }

        if (setting.odds <= 0 || setting.odds > 100)
            return {
                // 抽奖结果 -1:异常 0:未中奖 1:中奖
                drawStatus: -1,
                // 错误消息:drawStatus=-1
                errorMsg: '奖品概率不正确'
            }

        oddsSum = oddsSum.plus(setting.odds)
        amountSum = amountSum.plus(setting.amount)
    }

    let _oddsSum = +oddsSum.toFixed(2)
    if (_oddsSum <= 0 || _oddsSum > 100)
        return {
            // 抽奖结果 -1:异常 0:未中奖 1:中奖
            drawStatus: -1,
            // 错误消息:drawStatus=-1
            errorMsg: '概率总和不正确'
        }

    let _amountSum = +amountSum.toFixed(2)
    if (_amountSum <= 0)
        return {
            // 抽奖结果 -1:异常 0:未中奖 1:中奖
            drawStatus: 0,
            // 5:奖品数量不足
            rType: 5
        }

    if (param.user == void 0 || param.user == null)
        return {
            // 抽奖结果 -1:异常 0:未中奖 1:中奖
            drawStatus: -1,
            // 错误消息:drawStatus=-1
            errorMsg: '参数不正确'
        }

    return true
}

module.exports = {
    lotteryDraw: lotteryDraw,
    checkParam: checkParam
}