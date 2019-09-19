(function ($element) {
  return map_init();
  function map_init() {
    var mapDiv = $('#_panelId_ #_map_box')[0];
    var zoom = $element.find('#_map_box').attr('data-zoom');
    var center = ($element.find('#_map_box').attr('data-center')).split(',');
    // var map = null;
    var currTime = null;
    var lastTime = null;
    if (!!mapDiv) {
      var _init = function () {
        if (!lastTime) {
          lastTime = new Date().getTime();
        }
        currTime = new Date().getTime();
        if (!!lastTime && currTime - lastTime == 100) {

        }
      };

      window.setTimeout(function () {
        $(mapDiv).css({
          width: $(mapDiv).width(),
          height: $(mapDiv).height()
        });

        var map = new AMap.Map(mapDiv);
        map.setZoom(zoom);
        map.setCenter(center);

        var SetInterval = window.setInterval(function () {
          if (!!map) {
            var marker = new AMap.Marker({
              position: center,
              map: map
            });
            window.clearInterval(SetInterval);
          }
        }, 1000);


      }, 100)
    }
  }
})($("div[id='_panelId_']"));
