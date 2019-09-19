Utils.ready(function ready() {
    var viewport = Utils.getViewport();
    var direction='down';
    var options = $.extend(true, {
        height: viewport.height,
        width: viewport.width,
        direction: 'vertical',
        mousewheel: true,
        slidesPerView: 'auto',
        nested: false,
        on: {
            init: function () {
                var self = this;
                createChildSwiper(self, self.activeIndex);
                swiperAnimateCache(self); //隐藏动画元素 
                swiperAnimate(self); //初始化完成开始动画
                self.prevIndex = self.activeIndex;
                // 多页需要初始化页面数据
                Utils.emit('pageinit',{total:self.slides.length,pageIndex:self.activeIndex});
            },
            slideChangeTransitionStart: function(){
                Utils.emit('pagechangStart');
            },
            slideChangeTransitionEnd: function () {
                var self = this;
                createChildSwiper(self, self.activeIndex);
                swiperAnimate(self);
                self.prevIndex = self.activeIndex;
                // 页面改变时需要更新页面数据
                Utils.emit('pagechanged',{total:self.slides.length,pageIndex:self.activeIndex});
            },
            transitionEnd: function () {
                var self = this,
                    prevIndex = self.prevIndex;
                if (prevIndex >= 0 && prevIndex !== self.activeIndex) {
                    setTimeout(function () {
                        var prevSwiper = self['childSwiper-' + prevIndex];
                        if (!!prevSwiper) {
                            prevSwiper.setTranslate(0);
                        }
                    }, 100);
                }
            },
        }
    }); // 默认为单页自由滚动模式
    var swiper = new Swiper('#page-panel.swiper-container', options);
    var eventType = Utils.getPlatform() == "pc" ? 'click' : 'touchend';
    Utils.on('flip',flipPage);
    $('#flip-arrow').on(eventType,flipPage);   
    function flipPage(evt,index){
        if(!!index){
            return swiper.slideTo(--index, 1000,true);
        }
        index = swiper.activeIndex;
        if(index+1 >= swiper.slides.length){
            direction='up';
        }else if(index===0){
            direction='down'
        }
        swiper.slideTo(direction==='up'? --index: ++index, 1000,true);
    }
    function createChildSwiper(self, index) {
        var childSwiper = 'childSwiper-' + index;
        if (!self[childSwiper]) {
            console.log('create childSwiper');
            setTimeout(function () {
                self[childSwiper] = new Swiper('.swiper-slide[data-page="' + index + '"] .swiper-container', {
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    freeMode: true,
                    nested: true,
                    freeModeMomentumBounce: false,
                    resistanceRatio:0,
                    scrollbar: {
                        el: '.swiper-slide[data-page="' + index + '"] .swiper-scrollbar',
                        hide:true,
                    },
                    mousewheel: true,
                });
            }, 0);
        }
    }
});