(function ($element) {
    $(function () {
        var manuscriptId = "",
            uuids = $element.find(".js-data-value").data("uuid").split(','),
            style = $element.find(".js-data-value").data("style"),
            url = window.location.href;
        url = url.replace(/^http[s]?:\/\//i, "");
        if (url.substr(url.length - 1, 1) == '/') {
            url = url.substr(0, url.length - 1);
        }

        if (location.href.indexOf("design") > 0 && location.href.indexOf("?") > 0 && location.href.indexOf("templateId") > 0) {
            $.each(location.href.split('?')[1].split('&'), function (i, item) {
                if (item.indexOf("templateId") >= 0) {
                    manuscriptId = item.split('=')[1];
                }
            })
        } else {
            if (isNaN(parseInt(url.split('.')[0]))) {
                if (url.indexOf("?") > 0) {//分享时会在url后面自动添加参数 去掉参数获取id
                    manuscriptId = url.split('/_')[1].split('?')[0];
                } else {
                    manuscriptId = url.split('/_')[1];
                }
                url = url.split('/_')[0] + '/_default';
            } else {
                manuscriptId = url.split('.')[0];
            }
        }

        if (uuids.length == 1 && uuids[0] == "") {
            $element.find(".goodsAppBox").addClass("initBg");
        } else {
            $element.find(".goodsAppBox").removeClass("initBg");
        }

        var _renderData = function (data) {
            $element.find('.s_goods_list ul').empty();
            var html = '';
            switch (style) {
                case 1:
                    $.each(data.data.list, function (i, item) {
                        html += ' <a href="' + url + '/goods-detail?id=' + item.goodsId + '_' + manuscriptId + '"><li>'
                                       + ' <div class="pull-left goods-img"><img src="' + item.imgCover + '"  onerror="this.src=\'/public/images/goods_img_error.png\'"/></div>'
                                       + ' <div class="pull-left goods-des">'
                                       + ' <div class="goods-name">' + item.name + '</div>'
                                       + ' <div class="price-div">'
                                       + ' <span class="goods-price">￥' + item.specPrice + '</span>'
                                       // + ' <span class="market-price pull-right">￥' + item.specMarketPrice + '</span>'
                                       + ' </div></div></li></a>';
                    });
                    $element.find(".js-goods-div").addClass("s_goods_list");
                    break;
                case 2:
                    $.each(data.data.list, function (i, item) {
                        html += ' <a href="' + url + '/goods-detail?id=' + item.goodsId + '_' + manuscriptId + '"><li class="pull-left">'
                                    + ' <div class="goods-img"><img src="' + item.imgCover + '"   onerror="this.src=\'/public/images/goods_img_error.png\'"/></div>'
                                    + ' <div class="goods-des">'
                                    + ' <div class="goods-name">' + item.name + '</div>'
                                    // + ' <div class="market-price">￥' + item.specMarketPrice + '</div>'
                                    + ' <div class="goods-price">￥' + item.specPrice + '</div>'
                                    + ' </div></li></a>';
                    });
                    $element.find(".js-goods-div").addClass("h_goods_list");
                    break;
            }
            $element.find('.js-goods-div ul').html(html);
        }
        url = 'http://' + url;

        // if (!!window._shop_plugin_data && !!$element.find(".js-data-value").data("uuid")) {
        //     _renderData({ data: { list: window._shop_plugin_data['list'] } });
        // } else {
        $.ajax({
            type: "POST",
            url: lanh.apiHost + "httpserver/kem/goodsmanu/list",
            contentType: "application/json",
            data: JSON.stringify({
                'manuscriptId': manuscriptId,
                'uuids': uuids
            }),
            dataType: "json",
            success: function (data) {
                if (data.code == 0 && data.data.list.length > 0) {
                    _renderData(data);
                } else {
                    $element.find(".goodsAppBox").addClass("initBg");
                }
            }
        });
        // }

    })
})($("div[id='_panelId_']"));
