
(function ($element) {
  var d = '00';
  var h = '00';
  var m = '00';
  var s = '00';

  var NowTime = {};
  var dateTime = $element.find('._count_down').attr('data-dateTime');
  dateTime=dateTime.replace(/\//g,':').replace(' ',':');
  dateTime=dateTime.split(':');
  var timeSend = function () {
    var EndTime = new Date(dateTime[0],(dateTime[1]-1),dateTime[2],dateTime[3],dateTime[4],dateTime[5]); //截止时间
    var t = EndTime.getTime() - NowTime.getTime();
    if (t > 0) {
      d = Math.floor(t / 1000 / 60 / 60 / 24);
      h = Math.floor(t / 1000 / 60 / 60 % 24);
      m = Math.floor(t / 1000 / 60 % 60);
      s = Math.floor(t / 1000 % 60);

      if (d < 10) {
        $element.find('.day_Ten').text(0);
        $element.find('.day_ABit').text(d.toString().substr(0, 1));
        $element.find('.day_ABit2Box').hide();
      }else {
        if(d > 99){
          d = 99;
          // h = 23;
          // m = 59;
          // s = 59;
        }
        $element.find('.day_Ten').text(d.toString().substr(0, 1));
        $element.find('.day_ABit').text(d.toString().substr(1, 1));
        $element.find('.day_ABit2Box').hide();
      }
      if (h < 10) {
        $element.find('.hour_Ten').text(0);
        $element.find('.hour_ABit').text(h.toString().substr(0, 1));
      } else {
        $element.find('.hour_Ten').text(h.toString().substr(0, 1));
        $element.find('.hour_ABit').text(h.toString().substr(1, 1));
      }
      if (m < 10) {
        $element.find('.minute_Ten').text(0);
        $element.find('.minute_ABit').text(m.toString().substr(0, 1));
      } else {
        $element.find('.minute_Ten').text(m.toString().substr(0, 1));
        $element.find('.minute_ABit').text(m.toString().substr(1, 1));
      }
      if (s < 10) {
        $element.find('.second_Ten').text(0);
        $element.find('.second_ABit').text(s.toString().substr(0, 1));
      } else {
        $element.find('.second_Ten').text(s.toString().substr(0, 1));
        $element.find('.second_ABit').text(s.toString().substr(1, 1));
      }
    }
  };

  function interValFn() {
    if (!!dateTime[0]) {
      NowTime.setSeconds(NowTime.getSeconds() +1);
      timeSend();
      setTimeout(function () {
        interValFn();
      }, 1000);
    }
  }
  
  function getSysTime(sessionId, apiHost){
    $.ajax({
      url: apiHost.replace(/:\d+/g,'') + "sysconfig/time?session_id=" + sessionId,
      type: "GET",
      contentType: "application/json",
      async: true,
      dataType: "json",
      headers: {session_id: sessionId},
      data: '',
      success: function (result) {
        if(result.status == 0){
          NowTime = new Date(result.data.currentTimeMillis);
          interValFn();
        }else {
          try{
            Utils.simpleMsg('服务器时间获取失败');
          }catch(err) {
            console.log('服务器时间获取失败');
          }
        }
      },
      error: function(result){
        try{
          Utils.simpleMsg('服务器时间获取错误err');
        }catch(err) {
          console.log('服务器时间获取错误err');
        }
      }
      
    })
  }
  if(!!dateTime){
    if(!!localStorage.sessionId){
      getSysTime(localStorage.sessionId, lanh.apiHost || apiHost);
    }else{
      Utils.getToken(function(result){ 
        getSysTime(result.session_id, lanh.apiHost || apiHost);  
      })
    }
  }
  
  
})($("div[id='_panelId_']"));
