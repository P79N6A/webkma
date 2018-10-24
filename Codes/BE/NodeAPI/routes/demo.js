const router = require('koa-router')()

let
    CONST_DEMO = global.require("./constant/demo"),
    demoCtrl = global.require("./business/controller/demo")

router.prefix('/demo')

router.get('/simple', async (ctx, next) => {
    ctx.body = {
        title: 'simple',
        const: CONST_DEMO,
        body: await demoCtrl.simple()
    }
})

router.get('/promise', async (ctx, next) => {
    ctx.body = {
        title: 'promise',
        const: CONST_DEMO,
        body: await demoCtrl.promise()
    }
})

router.get('/lock', async (ctx, next) => {
    ctx.body = {
        title: 'lock',
        const: CONST_DEMO,
        body: await demoCtrl.lock()
    }
})

module.exports = router