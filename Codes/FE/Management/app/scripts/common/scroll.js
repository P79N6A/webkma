(function($, win) {
    var defaults = {
        'container': '#container', //容器
        'sections': '.section', //子容器
        'cb': function(d) {

        }
    };
    //容器与最后一个子容器,状态
    var container, sections, opts;
    $.fn.isScroll = function(options) {
        opts = $.extend({}, defaults, options || {});
        container = $(opts.container);
        sections = container.find(opts.sections);

        container.scroll(function() {
           var lastdom=container.find(opts.sections).last();
            if(container.outerHeight() + container.scrollTop() > (lastdom.outerHeight() * container.find(opts.sections).length - 10) ) {
                opts.cb && opts.cb();
            }
        })
    }
})(jQuery, window)