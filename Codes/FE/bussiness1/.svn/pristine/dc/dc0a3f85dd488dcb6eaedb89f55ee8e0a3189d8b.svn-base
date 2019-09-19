(function ($element) {
    var $img = $element.find("div[data-original-src]"),
        imgOrgSrc = $img.attr("data-original-src"),
        suffix = (imgOrgSrc.match(/\.\w+$/i) || [""])[0].replace(".", "").toLowerCase(),
        // imgSrc,
        cut = $img.attr("data-cut"),
        radix = parseFloat($("html").css("fontSize")),
        width = $element.parent().css("width"),
        height = $element.parent().css("height");
    // imgSrc = ["url('", imgOrgSrc];
    switch (suffix) {
        case "jpg":
        case "png":
        case "bmp":
            if (cut == "1") {
                imgOrgSrc = imgOrgSrc + ["@d_progressive", ",f_" + suffix, ",w_", Math.round(parseFloat(width) * radix), ",h_", Math.round(parseFloat(height) * radix)].join("")
                // imgSrc.push(imgOrgSrc);
            }
            break;
    }
    // imgSrc.push("')");
    // css背景呈现方式
    // $img.css({ "background-image": imgSrc.join("") });
    
    // 图片呈现方式（不兼容裁剪等功能）
    $element.find("img").attr("src", imgOrgSrc);
})($("div[id='_panelId_']"));