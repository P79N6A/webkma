const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
  
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const _toast = (type, options) => {
  switch (type) {
    case "success":
      options.icon = "success";
      options.image = null;
      break;
    case "fail":
      options.icon = "none";
      if (options.title.length<8){
        options.image = "/images/fail.png";
      }
      break;
    case "notify":
      options.icon = "none";
      options.image = "/images/notify.png";
      break;
  } 
  options.mask = true;
  options.duration = 2500;
  wx.showToast(options)
}

const getEnumOption = function(list, value) {
  let node;
  if (list) {
    node = list.find((item) => {
      return item.value == value
    });
  }
  return node;
}
//参与数的数值范围为0到9999，超过9999时记作1w+，超过19999时记作2w+，以此类推，最高99w+；
function convertJoinCount(num) {
  num = Number(num);
  if (isNaN(num)) {
    return 0;
  }
  let w = num / 10000;
  if (w > 99) {
    w = 99;
  }
  if (w >= 1) {
    return w + 'w+';
  }
  return num;
}

function convertPublishDate(date) {
  date = (String(date) || '').substr(0, 10).replace(/-/g, '/');
  return date;
}
function dateString(str, seperator1){
  if (!str) {
    return '';
  }
  var seperator1 = !!seperator1 ? seperator1 : '-';
  var date = new Date(str);
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
//超过999999时记作100w+
function convertCount(num) {
  num = Number(num);
  if (isNaN(num)) {
    return 0;
  }
  if (num > 999999) {
    return '100w+';
  }
  return num;
}

function showModal(opts){
  let options = Object.assign({
    title: '提示',
    content: '',
    cancelText: '取消',
    cancelColor:'#b1bfcd',
    confirmText: '确定',
    confirmColor:'#24d0c6',
  }, opts);
  wx.showModal(options)
}

function toFix(value) {
  return value.toFixed(2) // 此处2为保留两位小数，保留几位小数，这里写几

}

//文字绘制方法
function fillTextFn(ctx, str, fontSize, fontColor, startX, startY, maxWidth, twoLine) {
  let maxLength = Math.floor(maxWidth / fontSize);
  ctx.setTextBaseline('top');
  ctx.setFontSize(fontSize);
  ctx.setTextAlign('left');
  ctx.setFillStyle(fontColor);
  if (str.length <= maxLength) {
    ctx.fillText(str, startX, startY, maxWidth);
  } else {
    if (!!twoLine){
      ctx.fillText(str.substring(0, maxLength-2), startX, startY, maxWidth);
      if (str.length > (maxLength - 2) * 2){
        ctx.fillText(str.substring(maxLength - 2, (maxLength - 2) * 2) + '...', startX, startY + fontSize + 10, maxWidth);
      } else {
        ctx.fillText(str.substring(maxLength - 2, (maxLength - 2) * 2) , startX, startY + fontSize + 10, maxWidth);
      }
      
    } else {
      ctx.fillText(str.substring(0, maxLength - 3) + '...', startX, startY, maxWidth);
    }
    
  }
}
//生成交换名片封面方法
function createExchangeCover(canvasId, userData, wxSelf, callback) {
  new Promise((resolve, rej) => {
    if(!!userData.face){
      wx.getImageInfo({
        src: userData.face,
        success: resolve,
        fail: rej
      })
    } else {
      resolve({ path: '../../images/icon-defaultPhoto.png'});
    }
    
  }).then((result) => {
    const ctx = wx.createCanvasContext(canvasId);
    ctx.drawImage(result.path, 45, 171, 60, 60);
    ctx.drawImage('../../images/exchange-cover.png', 0, 0, 420, 330);

    fillTextFn(ctx, userData.name || '姓名', 14, '#000000', 120, 183, 120);
    fillTextFn(ctx, userData.job || '暂无职位', 12, '#000000', 120, 207, 160);

    ctx.draw(true, function () {
      wx.canvasToTempFilePath({
        fileType: "png",
        width: 420,
        height: 330,
        destWidth: 420 * 750 / wx.getSystemInfoSync().windowWidth,
        destHeight: 330 * 750 / wx.getSystemInfoSync().windowWidth,
        canvasId: canvasId,
        success: (res) => {
          wxSelf.exchangeCoverImg = res.tempFilePath;
          !!callback && callback();
        },
        fail: wxSelf.errMessage
      })
    });
  }).catch(()=>{})
  
}

//生成分享的封面图片
function createShareCover(canvasId, userData, wxSelf, callback) {
  new Promise((resolve, rej) => {
    if (!!userData.face) {
      wx.getImageInfo({
        src: userData.face,
        success: resolve,
        fail: rej
      })
    } else {
      resolve({ path: '../../images/icon-defaultPhoto.png' });
    }

  }).then((result) => {
    const ctx = wx.createCanvasContext(canvasId);
    ctx.drawImage(result.path, 60, 96, 90, 90);
    ctx.drawImage('../../images/share-cover.png', 0, 0, 420, 330);

    fillTextFn(ctx, userData.name || '姓名', 14, '#000000', 170, 110, 120);
    fillTextFn(ctx, userData.job || '暂无职位', 12, '#000000', 170, 145, 160);

    ctx.draw(true, function () {
      wx.canvasToTempFilePath({
        fileType: "png",
        width: 420,
        height: 330,
        destWidth: 420 * 750 / wx.getSystemInfoSync().windowWidth,
        destHeight: 330 * 750 / wx.getSystemInfoSync().windowWidth,
        canvasId: canvasId,
        success: (res) => {
          wxSelf.shareCoverImg = res.tempFilePath;
          !!callback && callback();
        },
        fail: wxSelf.errMessage
      })
    });
  }).catch(()=> {})
  
}
//时间戳转日期时间格式
function add0(m) { return m < 10 ? "0" + m : m }
function format(shijianchuo) {
  //shijianchuo是整数，否则要parseInt转换
  let T = parseInt(shijianchuo)
  var time = new Date(T);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  //年月日
 let tunerObj = {
   y: y,
   m: add0(m),
   d: add0(d),
   h: add0(h),
   mm: add0(mm),
   ss: add0(s)
 }
  return tunerObj;
}

export function timeCount(timers) {
  if (isNaN(timers)) return
  timers = timers/1000
  let oneDay = 86400;
  let oneHour = 3600;
  let oneMinute = 60;
  let sec = timers % 60 //秒
  let day = Math.floor(timers / oneDay) //天
  timers = timers-(day * oneDay)
  let hour = Math.floor(timers / oneHour) //时
  timers = timers - (hour * oneHour)
  let minute = Math.floor(timers / oneMinute) % 60//分
  return {
    day: day,
    hour: hour,
    minute: minute,
    sec: sec
  }
}


module.exports = {
  formatTime: formatTime,
  toast: {
    success: (options) => {
      _toast("success", options);
    },
    fail: (options) => {
      _toast("fail", options);
    },
    notify: (options) => {
      _toast("notify", options);
    }
  },
  showModal: showModal,
  getEnumOption: getEnumOption,
  convertJoinCount: convertJoinCount,
  convertPublishDate: convertPublishDate,
  convertCount: convertCount,
  dateString:dateString,
  toFix: toFix,
  createExchangeCover: createExchangeCover,
  createShareCover: createShareCover,
  fillTextFn: fillTextFn,
  format: format,
  timeCount:timeCount
}