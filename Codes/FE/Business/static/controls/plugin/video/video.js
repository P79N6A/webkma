(function ($element) {
  $(function () {
    setTimeout(function () {
      $element.children().css({
        "width": "100%",
        "height": "100%"
      });

      if(!$element.hasClass('no-resources')){
        if ((window.ActiveXObject || "ActiveXObject" in window) && (/\#\/design/g.test(window.location.href))) {
          $element.html('<div style="width: 100%;height: 100%;background: url(/public/images/video_errIE_bg.png) no-repeat;background-size: 100% 100%;"></div>');
        }
      }


    });
  });
})($("div[id='_panelId_']"));
