const
    mscore = require('mscore'),
    redis = mscore.redis,
    _ = require('underscore'),
    Exception = mscore.Exception,
    microservice = global.require('./utils/microservice');

// 无需验证的url
const urls = [
    '/business/logonbusiness',
    '/manuscript/publish/setting'
];

mscore.server((app) => {
    app.use(async (ctx, next) => {
        // 无需验证
        if (_.contains(urls, ctx.path)) return await next();

        // 登录验证
        var key;
        if (!!ctx.get('session_id')) {
            // key = 'user:' + ctx.get('session_id');
            // if (await redis.keyExist(key)) {
            //     ctx.user = JSON.parse(await redis.get(key));
            // } else {
            ctx.user = await microservice.verify({ sessionId: ctx.get('session_id') }, ctx);
            //     await redis.set(key, JSON.stringify(ctx.user), 60); // 1分钟
            // }
        } else {
            throw new Exception('登录超时', 401, 401);
        }
        let data = await next();
        if (!!ctx.clear) {// 是否需要清除redis
            await redis.delete(key);
        }
        return data;
    });
});