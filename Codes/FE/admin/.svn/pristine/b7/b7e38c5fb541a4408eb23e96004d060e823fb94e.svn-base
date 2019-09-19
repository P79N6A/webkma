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
