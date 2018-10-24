import Vue from 'vue';

let httpConfig = { apiHost: "", kpaasApiHost: "" }

switch (process.env.NODE_ENV) {
    case "development"://本地调试环境
    case "bata_development"://开发环境
        httpConfig.apiHost = "http://api.kma.dev.cn/";
        httpConfig.kpaasApiHost = "http://192.168.1.126:7000/";
        break;
    case "bata_production"://测试环境
        httpConfig.apiHost = "http://api.kma.biaoxiaoxu.cn/";
        httpConfig.kpaasApiHost = "http://api.kpaas.biaoxiaoxu.cn/";
        break;
    case "production"://正式环境
        httpConfig.apiHost = "https://api-kma.cloudmarkee.com/";
        httpConfig.kpaasApiHost = "https://api-kpaas.cloudmarkee.com/";
        break;
}

export default httpConfig