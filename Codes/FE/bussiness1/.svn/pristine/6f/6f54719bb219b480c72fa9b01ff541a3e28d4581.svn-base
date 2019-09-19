import api from "api";
import { resolve } from "url";
import { rejects } from "assert";
(function (global, factory) {

    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                return factory(w);
            };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (window) {
    'use strict';
    /*
        图片生成
    */
    $.extend(true, window.Kdo, {
        domToImage: {
            getImageUrl: function (dom, callback, imgType) {
                //只支持Chrome和Firefox
                if (!Kdo.utils.browserVersion.isChrome && !Kdo.utils.browserVersion.isFirefox) return callback("");
                let toImage = null;
                switch (imgType) {
                    case "jpeg":
                        toImage = domtoimage.toJpeg($(dom)[0], { cacheBust: true, bgcolor: '#fff' });
                        break;
                    case "png":
                    default:
                        toImage = domtoimage.toPng($(dom)[0], { cacheBust: true });
                        break;

                }
                toImage.then(function (base64) {
                    api.request("uploadImageForBase64", { base64Files: [{ content: base64 }] }, result => {
                        callback(result.status == 0 ? result.data[0].file : "");
                    });
                }).catch(function (error) {
                    console.error('domToImage.getImageUrl error');
                    console.log(error);
                    callback("");
                });
            }
        }
    });
});