(function ($element) {
  $(function () {
    setTimeout(function () {
      $element.children().css({
        "width": "100%",
        "height": "100%"
      });

      var _html = '';
      function _init(){
        _html = $element.find('div').attr('data-html');
        if (!_html && ((window.ActiveXObject || "ActiveXObject" in window) && (/\#\/design/g.test(window.location.href)))) {
          _html = '<div style="width: 100%;height: 100%;background: url(/public/images/video_errIE_bg.png) no-repeat;background-size: 100% 100%;"></div>';
        }
        $element.find('div').html(_html);
      }
      _init();

      try{
        window.Utils.on('pagechangStart', function(){
          _init();
        });
        window.Utils.on('pagechanged', function(evt, json){
          var swiperArr = $('.swiper-slide');
          var curSwiper = $.grep(swiperArr, function(item){
              return $(item).attr('data-page') == json.pageIndex;
          })[0];
          if($(curSwiper).find('.video-box').length == 0){
            $element.find('div').html('');
          }
        });
      }catch(err) {
        console.log('err');
      }

    });
  });
})($("div[id='_panelId_']"));
