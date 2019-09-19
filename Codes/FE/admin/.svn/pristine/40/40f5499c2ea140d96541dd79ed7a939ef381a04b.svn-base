let httpConfig = { apiHost: "", kpaasApiHost: "" }

switch (process.env.NODE_ENV) {
    case "development"://本地调试环境
    case "bata_development"://开发环境
        httpConfig.apiHost = "http://api.kma.dev.cn/";
        // httpConfig.kpaasApiHost = "http://192.168.1.126:7000/";
        httpConfig.kpaasApiHost = "http://api.kpaas.dev.cn/";
        break;
    case "bata_production"://测试环境
        httpConfig.apiHost = "http://api.kma.biaoxiaoxu.cn/";
        httpConfig.kpaasApiHost = "http://api.kpaas.biaoxiaoxu.cn/";
        break;
    case "production"://正式环境
        // httpConfig.apiHost = "http://api.tuixb.cn/";
        // httpConfig.kpaasApiHost = "http://api-kpaas.cloudmarkee.com/";
        httpConfig.apiHost = "http://api.kma.biaoxiaoxu.cn/";
        httpConfig.kpaasApiHost = "http://api.kpaas.biaoxiaoxu.cn/";
        break;
}

export default httpConfig;