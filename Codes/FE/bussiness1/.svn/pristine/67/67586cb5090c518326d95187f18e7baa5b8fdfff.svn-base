(function ($, win) {
// 调用方法如下，
// $('#phoneListWrap').isScroll({
//     container: "#phoneListWrap",
//     sections: ".innerWrap",
//     cb: function (data) {
//         具体要处理的分页逻辑
//         if( _this.dialogData.pagination._lock || !_this.dialogData.pagination.dataMore ) return false;
//         _this.dialogData.pagination.pageIndex++;
//         //此处分页上锁
//         _this.dialogData.pagination._lock = true;
//         _this.getLeavePhoneList(()=> {
//             _this.dialogData.pagination._lock = false;
//         }, 'more');
//     }
// })
    var defaults = {
        'container': '#container', //容器
        'sections': '.section', //子容器
        'cb': function (d) {
        }
    };
    //容器与最后一个子容器,状态
    var container, innerWrap;
    $.fn.isScroll = function (options) {
        opts = $.extend({}, defaults, options || {});
        container = $(opts.container);

        container.scroll(function () {
            innerWrap = container.find(opts.sections);
            if (container.outerHeight() + container.scrollTop() > (innerWrap.outerHeight() - 10)) {
                opts.cb && opts.cb();
            }
        })
    }
})(jQuery, window)