'use strict'
// 用于存放系统固定配置项（所有环境通用的配置，例如缓存过期时间等）

const config = {
    system: 'kma_node_api',             //系统名称，商城、在线制作，多屏可以配置不同的名称
    systemCode: "KMA",
    merchantId: "00000000-0000-0000-0000-000000000000",
    secret: "e00a05cf37305a22ba10fec428b4ab01",
    log4js: {
        fileName: "./logs/kshop.log",   //日志文件路径和文件名
        level: "debug",                 //记录日志文件的日志级别 (trace, debug, info, warn, error, fatal)
        replaceConsole: true,           //是否将console.log替换为log4js (替换后console.log的level为"INFO")
        maxLogSize: 512000              //日志文件最大容量(byte)
    },
    wxApi:{
        getToken:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}',
        getWxacodeUnLimit:'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token={0}'
    },
    debug: false
}

//组合global_config_env对象
Object.assign(config, require('./system-config-env'))

module.exports = Object.freeze(config);
