// 这是一个例子，在这里存放常量对象
let config = global.require('./config/system-config')

module.exports = Object.freeze({
    // 删除
    delete: {
        //已删除
        isDelete: -1,
        //未删除
        notDelete: 0
    },
    //  用户类型
    type: {
        //商家
        business: 1,
        //设计师
        designer: 2
    },
    // 状态
    state: {
        // 禁用
        disable: 1,
        // 正常
        normal: 0
    },
    userapi: {
        register: config.host.apiGateway + "api/identify_service/v1/merchant/create?secret_key=" + config.secret,
        update: config.host.apiGateway + "api/identify_service/v1/merchant/update?secret_key=" + config.secret,
        logon: config.host.apiGateway + "api/identify_service/v1/user/logon?secret_key=" + config.secret,
        verify: config.host.apiGateway + "api/identify_service/v1/user/token_verify?secret_key=" + config.secret + "&session_id=",
        signup: config.host.apiGateway + "api/identify_service/v1/register/signup?client_type=pc&secret_key=" + config.secret,
        changeAccount: config.host.apiGateway + "api/identify_service/v1/user/change_account?client_type=pc&secret_key=" + config.secret
    },
})