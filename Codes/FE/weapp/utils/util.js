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
  dateString:dateString
}