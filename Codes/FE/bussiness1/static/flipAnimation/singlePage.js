// 页面准备就绪，启动动画和特效
Utils.ready(function ready() {
    console.log(Utils.containerOptions);
    var viewport = Utils.getViewport();
    var options = $.extend(true, {
        height: viewport.height,
        width: viewport.width,
        direction: 'vertical',
        mousewheel: true,
        slidesPerView: 'auto',
        freeMode: true,
        nested: true,
        // noSwiping : true,//单页时不让鼠标拖动看到编辑框外素材，主要是为海报修改  Mars 19.7.2
        freeModeMomentumBounce: false,
        scrollbar: {
            el: '#page-panel > .swiper-scrollbar',
            hide:true,
        },
        on: {
            init: function () {
                swiperAnimateCache(this); //隐藏动画元素 
                swiperAnimate(this); //初始化完成开始动画
            },
            slideChangeTransitionEnd: function () {
                swiperAnimate(this);
            }
        }
    }); // 默认为单页自由滚动模式
    var swiper = new Swiper('#page-panel.swiper-container', options);

    // $('#page-panel.swiper-container .swiper-slide').addClass('swiper-no-swiping')//单页时不让鼠标拖动看到编辑框外素材，主要是为海报修改  Mars 19.7.2
});
