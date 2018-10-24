const stringHelper = require('./stringHelper');

// 常用工具

class tools {
    // 对象属性下划线转驼峰
    static objToHump(obj) {
        var fresh = Object.create({});
        for (let key in obj) {
            fresh[stringHelper.toHump(key)] = obj[key];
        }
        return fresh;
    }

    // 密码复杂度评级  弱 - 强 1 2 3 4
    static pwdRating(val) {
        var modes = 0;
        if (/\d/.test(val)) modes++; //数字
        if (/[a-z]/.test(val)) modes++; //小写
        if (/[A-Z]/.test(val)) modes++; //大写  
        if (/\W/.test(val)) modes++; //特殊字符
        return modes;
    }
}

module.exports = tools;