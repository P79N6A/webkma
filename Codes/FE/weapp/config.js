/**
 * 小程序配置文件
 */
var config = {
  // Dev
  apiHost: "http://api.kma.dev.cn",
  apiGateway: "http://192.168.1.126:7000/",
  bosHost: "https://resource.ikmark.com/tuixiaobao/weapp/",

  // Beta
  // apiHost: "http://api.kma.biaoxiaoxu.cn",
  // apiGateway: "http://api.kpaas.biaoxiaoxu.cn/",
  // bosHost: "https://resource.ikmark.com/tuixiaobao/weapp/",

  // Production
  // apiHost: "https://api-kma.cloudmarkee.com",
  // apiGateway: "https://api-kpaas.cloudmarkee.com/",
  // bosHost: "https://resource.ikmark.com/tuixiaobao/weapp/",

  appId: "wx72f59a0fa62c46af",
  secretKey:'e00a05cf37305a22ba10fec428b4ab01'
}
config.defaultCover = `${config.bosHost}default-business-card.jpg`;
config.defaultLogo = `${config.bosHost}default-logo.jpg`;

module.exports = config;