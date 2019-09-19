(function ($element) {
  $(function () {
    var data_phone = $element.find('.call_box').attr('data-phone') || '';
    var telJump_a = $element.find('#telJump_a');
    var isDesign = location.href.indexOf('/design?') != -1;
    
    function _init(){
      if(!!telJump_a){
        var _timer = setInterval(function(){
          if(!!Utils.myforwardKey) {//授完权
            telJump_a.attr('href', 'tel:' + data_phone);
            clearInterval(_timer);
          }
        },100);
      } 
    }
    
    if(!isDesign) _init();
    
    $element.find('.telJump').unbind('click').bind('click', function () {
      try {
        if (!(Utils.getPlatform() !== "pc" || (Utils.getPlatform() === "pc" && Utils.isWX())) && !!Utils.myforwardKey){
          Utils.simpleMsg('尚未进行微信授权，请稍后！');
          return false;
        } 
        var callNum = $element.find('.telJump').attr('href').slice(4);
        if (!!callNum.length && callNum.length > 1) {
          Utils.buryingPoint({indexType: 'user_service', timeStamp: new Date().getTime(), extType: 'call' });
        } else {
          Utils.simpleMsg('未设置手机号!')
          $element.find('.telJump').attr('href', '#');
        }
      } catch (err) {

      }

    })
  })

})($("div[id='_panelId_']"));
