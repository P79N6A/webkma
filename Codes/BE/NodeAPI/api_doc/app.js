const
    Koa = require('koa'),
    app = new Koa(),
    static = require("koa-static"),
    exec = require('child_process').exec,
    sysconf = require('../config/system-config')

if (sysconf.apidoc && sysconf.apidoc.port) {
    exec(' apidoc -i ../routes -o ./dist ', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            console.error('APIDoc生成失败');
            return;
        }
        console.log('APIDoc生成成功');
        app.use(static(__dirname + '/dist'));
        app.listen(sysconf.apidoc.port, () => {
            console.log('APIDoc启动成功');
        });
    });
} else {
    console.warn("APIDoc服务终止启动: Config中缺少APIDoc端口配置");
}