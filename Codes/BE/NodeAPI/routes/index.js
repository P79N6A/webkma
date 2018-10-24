const router = require('koa-router')(),
    mscore = require('mscore'),
    dataFormat = mscore.data;

router.get('/', async (ctx, next) => {
    ctx.body = dataFormat.success('欢迎来到艾泽拉斯大陆');
})

module.exports = router