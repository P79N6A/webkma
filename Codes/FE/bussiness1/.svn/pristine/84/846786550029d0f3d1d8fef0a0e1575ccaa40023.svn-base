(function ($element) {
    $(function () {
        var goodsId = $element.find(".js-data-value").data("id"),
            kid = $element.find(".js-data-value").data("kid"),
            style = $element.find(".js-data-value").data("style"),
            btnText = $element.find(".js-data-value").data("btntext"),
            btnColor = $element.find(".js-data-value").data("btncolor"),
            btnBColor = $element.find(".js-data-value").data("btnbcolor"),
            titleColor = $element.find(".js-data-value").data("titlecolor"),
            priceColor = $element.find(".js-data-value").data("pricecolor");

        var getManuscriptId = function () {
            var q = {};
            location.href.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => q[k] = v);
            return q.id;
        }

        var _renderData = function (data) {
            var _goodsData = data.goodsList[0];
            var _goodsImg = $element.find('.goods_img'),
                _goodsPrice = $element.find('.goods-price'),
                _goodsName = $element.find('.goods-name'),
                _btn = $element.find('.btn-submit');

            _goodsImg.attr('src', _goodsData.goods_original_img_thumb);
            _goodsName.text(_goodsData.goods_name);
            _goodsPrice.text('￥' + _goodsData.goods_price);
            _btn.html(btnText);

            $element.find('.btn-submit').unbind('click').bind('click', function () {
                try {
                    if (!(Utils.getPlatform() !== "pc" || (Utils.getPlatform() === "pc" && Utils.isWX())) && !!Utils.myforwardKey) return false;
                    if (!Utils.getQueryString('userId') && !Utils.myforwardKey) {
                        Utils.simpleMsg('尚未进行微信授权，请稍后！');
                        return false;
                    }
                    Utils.isWxMini(function (matched) {     //----   获取客户端类型方法
                        var clientType = matched ? 'weapp' : (!!Utils.isWX() ? 'wx' : 'pc');
                        var param = [
                            'rootUserId=' + (Utils.myrootUserId || Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')),
                            'relationId=' + lanh.kid,
                            'clientType=' + clientType,
                            'forwardKey=' + Utils.myforwardKey,
                            'session_id=' + (Utils.getQueryString('session_id') || sessionStorage.getItem('session_id')),
                            'extId=' + goodsId,
                            'activityName=' + encodeURIComponent((Utils.getQueryString('activityName') || sessionStorage.getItem('acitivityName'))),
                            'extType=' + 'goods',
                            'returnUrl=' + encodeURIComponent(location.href),
                            'kid=' + kid
                        ];

                        var _path = Utils.shopHost + kid + '/kma/productDetail?' + param.join('&');

                        // _goodsName.html(_path)
                        window.location.href = _path;
                    })
                } catch (err) {

                }

            })

        }

        if (!!goodsId) {
            $.ajax({
                type: "GET",
                url: (lanh.apiHost || lanh.httpConfig.apiHost).replace(/:\d+/g, '') + "/shop/goods/search?goodsIds=" + goodsId + "&manuscriptId=" + (lanh.kid || getManuscriptId()) + "&kid=" + kid,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.status == 0 && result.data.goodsList.length > 0) {
                        _renderData(result.data);
                    } else {
                        // $element.find(".goodsAppBox").addClass("initBg");
                    }
                }
            });
        }
    })
})($("div[id='_panelId_']"));
