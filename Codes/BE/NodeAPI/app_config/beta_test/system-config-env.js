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
            pre: "{0}.pre.kma.iwanqi.cn",
            pro: "{0}.pro.kma.iwanqi.cn"
        },
        api: '182.61.45.171:6000', // KMA接口访问地址
        apiGateway: "http://182.61.45.171:7000/",
    },
    db: {
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database: 'kma',
    },
    redis: {
        port: 6375,
        host: '172.16.0.36',
        password: 'ftxrrgFjsbmFQn0Z',  // 密码
        db: 0,
        family: 4, // ip地址族
        keepAlive: 0.1 * (1000 * 60 * 60), //保持连接24h
        connectTimeout: 1000 * 5, //连接超时
        readOnly: false
    },
    materailUrl: 'http://bos-kcmsdesign.iwanqi.cn/',
    session: {
        endAddress: ''
    }
}
// http session 的终结点地址
config.session.endAddress = `${config.host.apiGateway}api/identify_service/v1/user/token_verify`;

module.exports = Object.freeze(config);