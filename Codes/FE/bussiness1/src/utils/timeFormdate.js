import httpConfig from '../config/http.js';
window.timeFormdate = function (str) {
    if (!str) {
        return '';
    }
    var date = new Date(str);
    var seperator1 = "/";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var time = (date.toTimeString()).split(' ')[0];
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
        + " " + time;
    return currentdate;
}
window.times = function (str) {
    if (!str) {
        return '';
    }
    var tims = str;
    var miao = parseInt(tims % 60);
    var fen = parseInt(tims / 60 % 60);
    var shi = parseInt(tims / 60 / 60 % 24);
    var tian = parseInt(tims / 60 / 60 / 24);
    return (tian ? tian+'天' : '')+(shi ? shi+'时' : '') +(fen ? fen + '分' : '')+(miao ? miao+'秒' : '');
}
window.apiHost = httpConfig.apiHost;