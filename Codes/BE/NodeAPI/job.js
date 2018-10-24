/**
 * 定时任务
 * 1.统计分析
 */

const
    mscore = require('mscore'),
    analysisCtrl = global.require('./business/controller/analysis'),
    moment = require('moment'),
    schedule = require('node-schedule');

var analysis = schedule.scheduleJob('0 */20 * * * *', async () => {
    let start = new Date();
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'), ': 执行Job - analysis');
    try {
        await analysisCtrl.syncAnalysis();
    } catch (error) {
        console.error('执行失败：', error);
    }
    console.log('执行完毕, 耗时：', (new Date() - start), 'ms');
});

console.log(' jobstarted...');
