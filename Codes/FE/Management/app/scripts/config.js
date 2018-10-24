'use strict';

//Global Configs
if (!window.lanh) window.lanh = {};

var bosHost ='https://resource.ikmark.com/tuixiaobao/weapp/';
//-----------基础信息配置 START-----------
var lanh = {
    version: "2.3",
    //kdesignHost: ""
    secret_key: "e00a05cf37305a22ba10fec428b4ab01", 
    defaultHeadImg:'http://bos-kcmsdesign.iwanqi.cn/00000000-0000-0000-0000-000000000000/KMA/5de9c874-8f93-4017-9f00-84176122491c.png',
    defaultBusinessCard:bosHost+'default-business-card.jpg',
    defaultLogo:bosHost+'default-logo.jpg'

}
//-----------基础信息配置 END-----------

//-----------环境配置 START-----------
; (function (env) {
    switch (env) {
        default:
        case "dev": //开发环境
            lanh.apiHost = "http://service.kem.dev.cn:8666/httpserver/kem/";
            lanh.apiHostNode = "http://api.kem.dev.cn/";
            lanh.kmaApiHost = "http://api.kma.dev.cn/";
            lanh.kpaasApiHost = "http://192.168.1.126:7000/";
            // lanh.previewHost="http://kma.dev.cn/#/preview?url=";
            break;
        case "test": //测试环境
            break;
        case "beta_test": //外网测试环境
            lanh.apiHost = "https://servicebeta.cloudmarkee.com/httpserver/kem/";
            lanh.apiHostNode = "https://apibeta.cloudmarkee.com/"
            lanh.kmaApiHost = "http://api.kma.biaoxiaoxu.cn/";
            lanh.kpaasApiHost = "http://182.61.45.171:7000/";
            // lanh.previewHost="http://www.kma.biaoxiaoxu.cn/#/preview?url=";
            break;
        case "release": //正式环境
            lanh.apiHost = "https://service.cloudmarkee.com/httpserver/kem/";
            lanh.apiHostNode = "https://api.cloudmarkee.com/";
            lanh.kmaApiHost = "http://api-kma.cloudmarkee.com/";
            lanh.kpaasApiHost = "http://api-kpaas.cloudmarkee.com/";
            break;
    }
})("{{{{- envirnment }}}}");  //设置当前环境参数: dev, test, beta_test, release
//-----------环境配置 END-----------
// 上传资源的地址
lanh.assets_upload=lanh.kpaasApiHost+'api/assets_service/v1/assets/upload?secret_key='+lanh.secret_key;
// lanh.assets_upload='http://127.0.0.1:10002/api/assets/upload?secret_key='+lanh.secret_key;