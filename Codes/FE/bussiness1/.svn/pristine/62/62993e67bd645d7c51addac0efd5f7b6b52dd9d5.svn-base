
( function( global, factory ) {

	"use strict";
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				return factory( w );
			};
	} else {
		factory( global );
	}
} )( typeof window !== "undefined" ? window : this, function( window ) {
    
	"use strict";
    //option: { title: '', template: '' }
    var _create = function (option) {
        var dialog = $("<div class=\"lanh-modal\"></div>").append(option.template),
            position = {};

        if ($("#content").length == 0) {
            position = {
                my: "center top",
                at: "center top+10%",
                of: $("body")
            }
        } else {
            position = {
                my: "center top+20px",
                at: "center top+20px",
                of: $("#content")
            }
        }
        var _option = {
            title: "设置",
            resizable: false,
            width: "auto",
            position: position,
            modal: true,
            maxHeight: 680
        };

        var _open = function (event, ui) {
            setTimeout(function () { $(".page-pc-body").css("overflow-y", "hidden"); }, 1000);
            if (!!option.open && typeof (option.open) == "function") {
                option.open();
            }
            //open function
        }

        var _close = function () {
            $(".page-pc-body").css("overflow-y", "auto");
            if (!!option.close && typeof (option.close) == "function") {
                option.close();
            }
            $(this).dialog("destroy");
        }


        _option = $.extend(_option, option);
        if (!!_option.open) {
            var _openFn = _option.open;
            setTimeout(function () {
                var _$parent = _dialog.parent();
                if (_$parent.length > 0) {
                    var _zIndex = _dialog.parent()[0].style.zIndex;
                    if (_dialog.parent().next().hasClass(".ui-widget-overlay")) {
                        _dialog.parent().next().css("z-index", _zIndex - 1);
                        _dialog.parent().parent().find(".ui-icon-closethick").addClass("iconfont icon-close");
                    }
                }
            }, 1000);
            _option.open = function (event, ui) {
                _openFn(event, ui);
                _open(event, ui);
            }
        } else {
            _option.open = _open;
        }

        if (!!_option.close) {
            var _closeFn = angular.copy(_option.close);
            _option.close = function () {
                _closeFn();
                _close()
            }
        } else {
            _option.close = _close;
        }
        var _dialog = dialog.dialog($.extend(_option, option), { closeText: "<i class='iconfont icon-close'></i>" });
        //_dialog.parent().draggable({
        //    handle: _dialog.siblings(),
        //    containment: "#content",
        //})
        dialog.find(".dialog-CustomScrollbar").mCustomScrollbar();
        dialog.find(".dialog-CustomScrollbar .mCustomScrollBox").attr("tabindex", "")
    };

    var _cancelMethod = function ($target) {
        var dialogDom = $target && $($target).parents(".lanh-modal");
        if (!dialogDom.length) dialogDom = $('.lanh-modal');
        //dialogDom.dialog("close");
        dialogDom.dialog("destroy");
    };

    window.Kdo = $.extend(true, window.Kdo || {}, {
        modal: {
            create: _create,
            cancel: _cancelMethod
        }
    });
});
