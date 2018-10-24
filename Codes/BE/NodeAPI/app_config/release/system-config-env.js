// 用于存放不同环境需要变化的配置项（例如数据库地址等）
const config = {
    http: {
        port: 6000,
    },
    apidoc: {
        port: 6001
    },
    host: {
        midway: {
            pre: "{0}.pre.kma.dev.cn",
            pro: "{0}.pro.kma.dev.cn"
        },
        api: '172.16.0.36:6000', // KMA接口访问地址
        apiGateway: "http://192.168.1.115:8092/",
    },
    db: {
        host: '192.168.1.126',
        user: 'root',
        password: '123456',
        database: 'kma_dev',
    },
    redis: {
        port: 6379,
        host: '192.168.1.228',
        password: '',  // 密码
        db: 0,
        family: 4, // ip地址族
        keepAlive: 0.1 * (1000 * 60 * 60), //保持连接24h
        connectTimeout: 1000 * 5, //连接超时
        readOnly: false
    },
    materailUrl: 'http://192.168.1.126:7000/',
    session: {
        endAddress: ''
    }
}
// http session 的终结点地址
config.session.endAddress = `${config.host.apiGateway}api/identify_service/v1/user/token_verify`;
module.exports = Object.freeze(config);