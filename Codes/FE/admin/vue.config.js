module.exports={
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    outputDir: "dist",
    assetsDir: "assets",
    lintOnSave: false,
    devServer: {
        port: 8016, // 端口号
        host: 'localhost',
        open: true, //配置自动启动浏览器
    }

}