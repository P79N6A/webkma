(function ($element) {
    var $img = $element.find("div[data-original-src]"),
        imgOrgSrc = $img.attr("data-original-src"),
        suffix = (imgOrgSrc.match(/\.\w+$/i) || [""])[0].replace(".", ""),
        imgSrc,
        cut = $img.attr("data-cut"),
        radix = parseFloat($("html").css("fontSize")),
        width = $element.parent().css("width"),
        height = $element.parent().css("height");
    imgSrc = ["url('", imgOrgSrc];
    switch (suffix) {
        case "jpg":
        case "png":
        case "bmp":
            if (cut == "1") {
                imgSrc = imgSrc.concat(["@d_progressive", ",f_" + suffix, ",w_", Math.round(parseFloat(width) * radix), ",h_", Math.round(parseFloat(height) * radix)]);
            }
            break;
    }
    imgSrc.push("')");
    $img.css({ "background-image": imgSrc.join("") });
})($("div[id='_panelId_']"));