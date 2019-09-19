let httpConfig = { apiHost: "", kpaasApiHost: "" }

switch (process.env.NODE_ENV) {
    case "development"://本地调试环境
    case "bata_development"://开发环境

        // httpConfig.apiHost = "http://api.kma.dev.cn/";
        // httpConfig.kpaasApiHost = "http://api.kpaas.dev.cn/";
        // httpConfig.posterQrcodeUrl = "http://{0}.wap.pro.kma.dev.cn";
        // httpConfig.msFontHost = "http://192.168.1.13:10001/";

        httpConfig.apiHost = "http://api.kma.biaoxiaoxu.cn/";
        httpConfig.kpaasApiHost = "http://api.kpaas.biaoxiaoxu.cn/";
        httpConfig.posterQrcodeUrl = "http://{0}.wap.pro.kma.biaoxiaoxu.cn";
        httpConfig.msFontHost = "http://182.61.13.131:10001/";
        break;
    case "bata_production"://测试环境
        httpConfig.apiHost = "http://api.kma.biaoxiaoxu.cn/";
        httpConfig.kpaasApiHost = "http://api.kpaas.biaoxiaoxu.cn/";
        httpConfig.posterQrcodeUrl = "http://{0}.wap.pro.kma.biaoxiaoxu.cn";
        httpConfig.msFontHost = "http://182.61.13.131:10001/";
        break;
    case "production"://正式环境
        httpConfig.apiHost = "https://api.tuixb.cn/";
        httpConfig.kpaasApiHost = "https://api-kpaas.cloudmarkee.com/";
        httpConfig.posterQrcodeUrl = "http://midway-kma.biaoxiaoxu.cn/_{0}";
        httpConfig.msFontHost = "http://microservices.cloudmarkee.com/ms-fontface-services/";
        break;
}

export default httpConfig
