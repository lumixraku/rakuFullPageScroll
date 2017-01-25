//如果css和js打包在一起  加载的时候动画存在问题 //估计是加载顺序导致
//必须分开  故使用了ExtractTextPlugin
require('./simpleH5FullscreenPage.css');
// require('./simple_page-animation.css');
require('./tween/tween.js');
require('./tween/animation.js');
// var animateObj = require('./animateObj.js');

var opt = {
    container: '.H5FullscreenPage-wrap',
    animateType:'Linear',
    pageShow: function() {},
    pageHide: function() {},
    useParallax: true,
    useArrow: true,
    // 'useAnimation': true,
    // 'useMusic' : {
    //     'autoPlay' : true,
    //     'loopPlay' : true,
    //     'src' : 'http://mat1.gtimg.com/news/2015/love/FadeAway.mp3'
    // }
};


var dragThreshold = 0.15; //临界值
var dragStart = null; //开始抓取标志位
var percentage = 0; //拖动量的百分比
var currentItem;

function getElementTop(element) {　　　　
    var actualTop = element.offsetTop;　　　　
    var current = element.offsetParent;　　　　
    while (current !== null) {　　　　　　
        actualTop += current.offsetTop;　　　　　　
        current = current.offsetParent;　　　　
    }　　　　
    return actualTop;　　
}

window.H5FullscreenPage = function(option) {
    this.option = option;
    this.init(option);
};
window.H5FullscreenPage.prototype = {

    init: function(option) {
        var that = this;
        $.extend(opt, option);
        this.$containerElem = $(opt.container);
        this.$item = this.$containerElem.children();
        this.initDom(opt);
        this.initEvent(opt);
    },

    initDom: function(opt) {
        var that = this;
        that.pageCount = that.$containerElem.children().length;
        this.scrollInScreen = false;
        // $('body').addClass('H5FullscreenPage');
        currentItem = this.$item.first();
        currentItem.attr('state', 'next');
        // $('body').append('<div class="overlay"></div>');
        if (opt.useArrow) {
            this.$item.slice(0, this.$item.length - 1).append('<span class="arrow"></span>');
        }
        if (opt.useMusic) {
            var autoplay = opt.useMusic.autoPlay ? 'autoplay="autoplay"' : '';
            var loopPlay = opt.useMusic.loopPlay ? 'loop="loop"' : '';
            var src = opt.useMusic.src;
            $('body').append('<span class="music play"><audio id="audio" src=' + src + ' ' + autoplay + ' ' + loopPlay + '></audio></span>');
        }
    },
    getOffset: function(element){
        var that =this;
        element = element || that.$containerElem[0];
        var actualTop = element.offsetTop;　　　　
        var current = element.offsetParent;　　　　
        while (current !== null) {　　　　　　
            actualTop += current.offsetTop;　　　　　　
            current = current.offsetParent;　　　　
        }　　　　
        return actualTop;　　
    },
    getScrolled: function(){
         return document.body.scrollTop;
    },
    touchStart: function(event) {
        var that = this;
        if (dragStart !== null) return;
        var item = $(event.target).closest('.item');
        if (!item.length) {
            // $('.overlay').hide();
            return;
        }
        if (event.touches) {
            event = event.touches[0];
        }
        //抓取时的所在位置
        dragStart = event.clientY;

        //分别关闭item的动画效果,动画效果只在松开抓取时出现
        item.addClass('no-animation');
        item.next().addClass('no-animation');
        item.prev().addClass('no-animation');

        var scrolledTop = document.body.scrollTop;
        var offsetBody = getElementTop(that.$containerElem[0]);

        that.scrollInScreen = scrolledTop === offsetBody;
        console.log('scrollInScreen', that.scrollInScreen);


    },

    touchMove: function(event) {
        console.log('touch move');
        var that = this;
        var item = $(event.target).closest('.item');
        if (dragStart === null) return;
        // if (!item.length) {
        //     // $('.overlay').hide();
        //     return;
        // }

        var ev0;
        if (event.touches) {
            ev0 = event.touches[0];
        }
        //得到抓取开始时于进行中的差值的百分比
        percentage = (dragStart - ev0.clientY) / window.screen.height; //
        // var offset = that.getOffset();
        // var scrolled = that.getScrolled();
        // if (!that.scrollInScreen) {
        //     //非全屏  scroll组件没有完全进入
        //     if(percentage > 0 && (offset > scrolled)){
        //         event.preventDefault(); //swipeup
        //     }
        //     if(percentage < 0 && offset < scrolled){
        //         event.preventDefault();
        //     }
        //     return;//touchMove 要屏蔽才能触发swipeUp
        // }
        //
        //
        // //percentage > 0 向上滑动
        // if (percentage > 0) {
        //     if (item.index() + 1 !== that.pageCount) {
        //         var scale = 1 - 0.5 * percentage; //缩放系数，可以微调
        //         animateObj[opt.type].upDrag(percentage, item);
        //         event.preventDefault();
        //
        //     } else {
        //         //最后一个slide  向上滑动时 采用默认事件
        //     }
        //
        // } else if (item.prev()) {
        //     if(item.index() !== 0  ){
        //         animateObj[opt.type].downDrag(percentage, item);
        //         event.preventDefault();
        //
        //     }else{
        //         //第一个向 下拖动  默认
        //
        //     }
        // }
    },
    touchEnd: function(event) {
        var that = this;
        console.log('touch end');
        //防止多次滚动，故增加一个覆盖层
        // $('.overlay').show();
        dragStart = null;
        var item = $(event.target).closest('.item');
        if (!item.length) {
            // $('.overlay').hide();
            return;
        }
        // item.removeClass('no-animation');
        // item.next().removeClass('no-animation');
        // item.prev().removeClass('no-animation');

        //抓取停止后，根据临界值做相应判断
        var offsetToBody = that.getOffset();
        var scrolled = that.getScrolled();
        if(Math.abs(percentage) >= dragThreshold){
            if(offsetToBody < scrolled  && percentage > 0){
                that.moveoutslide_up();
            }
            if(offsetToBody > scrolled && percentage > 0){
                that.moveintoslide();
            }
            if(offsetToBody < scrolled && percentage < 0){
                that.moveintoslide();
            }
            if(offsetToBody > scrolled && percentage < 0){
                that.moveoutslide_down();
            }
            if(offsetToBody === scrolled && percentage > 0){
                that.moveoutslide_up();
            }
            if(offsetToBody === scrolled && percentage < 0){
                that.moveoutslide_down();
            }
        }


        //重置percentage
        percentage = 0;

    },
    // swipeUp: function(event) {
    //     var that = this;
    //
    //     console.log('swipeUp', that.scrollInScreen);
    //     var item = $(event.target).closest('.item');
    //     if (!item.length) {
    //         return;
    //     }
    //     var offsetToBody = getElementTop(that.$containerElem[0]);
    //     var scrolled = that.getScrolled();
    //
    //     if(!that.scrollInScreen){
    //         Math.animation(scrolled,offsetToBody, Math.abs(scrolled - offsetToBody), that.animateType, function(value, end){
    //             window.scrollTo(0, value);
    //         });
    //     }else{
    //
    //         //最后一个向上滑  底部吸顶
    //         if(item.index()+1 === that.pageCount){
    //             var containerHeight = that.$containerElem.height();
    //             Math.animation(scrolled, scrolled+containerHeight, containerHeight, that.animateType, function(value, end){
    //                 window.scrollTo(0, value);
    //             });
    //         }
    //     }
    // },
    //
    // swipeDown: function(event) {
    //     var that = this;
    //     var item = $(event.target).closest('.item');
    //     if (!item.length) {
    //         return;
    //     }
    //     var offsetToBody = getElementTop(that.$containerElem[0]);
    //     var scrolled = that.getScrolled();
    //     if(item.index() !== 0){
    //         Math.animation(scrolled,offsetToBody, Math.abs(scrolled - offsetToBody), that.animateType, function(value, end){
    //             window.scrollTo(0, value);
    //         });
    //
    //     }else{
    //         //第一张图下滑  单页组件向下缩起来
    //         var scrollTo = 0;
    //         scrollTo = offsetToBody - that.$containerElem.height();
    //         if(scrollTo < 0) scrollTo = 0;
    //         Math.animation(scrolled,scrollTo, Math.abs(scrolled - scrollTo), that.animateType, function(value, end){
    //             window.scrollTo(0, value);
    //         });
    //     }
    // },

    moveoutslide_up: function(item) {
        var that = this;
        var scrollTo = 0;
        var scrolled = that.getScrolled();
        var offsetToBody = getElementTop(that.$containerElem[0]);

        scrollTo = offsetToBody + that.$containerElem.height();
        Math.animation(scrolled,scrollTo, Math.abs(scrolled - scrollTo), that.animateType, function(value, end){
            window.scrollTo(0, value);
        });
    },
    moveintoslide: function(){
        var that = this;
        var scrollTo = 0;
        var scrolled = that.getScrolled();
        var offsetToBody = getElementTop(that.$containerElem[0]);

        scrollTo = offsetToBody;
        Math.animation(scrolled,scrollTo, Math.abs(scrolled - scrollTo), that.animateType, function(value, end){
            window.scrollTo(0, value);
        });
    },
    moveoutslide_down: function(){
        var that = this;
        var scrollTo = 0;
        var scrolled = that.getScrolled();
        var offsetToBody = getElementTop(that.$containerElem[0]);

        scrollTo = offsetToBody - that.$containerElem.height();
        if(scrollTo < 0) scrollTo = 0;
        Math.animation(scrolled,scrollTo, Math.abs(scrolled - scrollTo), that.animateType, function(value, end){
            window.scrollTo(0, value);
        });
    },
    initEvent: function(opt) {
        var that = this;
        if (opt.useParallax) {

            var orginData = {
                x: 0,
                y: 0
            };
            window.addEventListener('deviceorientation', function(event) {
                var gamma = event.gamma;
                var beta = event.beta;

                var x = -gamma;
                var y = -beta;

                if (Math.abs(Math.abs(x) - Math.abs(orginData.x)) < 0.1 || Math.abs(Math.abs(y) - Math.abs(orginData.y)) < 0.1) {
                    orginData.x = x;
                    orginData.y = y;
                    return;
                } else {
                    orginData.x = x;
                    orginData.y = y;
                }

                var halfWidth = window.innerWidth / 2;
                var halfHeight = window.innerHeight / 2;


                var max = 5;
                var items = $('.parallax');
                items.forEach(function(item) {
                    var dx = (item.getBoundingClientRect().width / max) * (x / halfWidth);
                    var dy = (item.getBoundingClientRect().width / max) * (y / halfHeight);

                    if ($(item).hasClass('item')) {
                        //$(item).addClass('parallax-item');
                        dx = -dx / 1 + 50;
                        dy = -dy / 1 + 50;
                        item.style['background-position'] = '' + dx + '% ' + dy + '%';
                        //$(item).removeClass('parallax-item');
                    } else {
                        item.style.transform = item.style['-webkit-transform'] = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
                    }


                });


            }, false);
        }

        // 绑定事件
        $(opt.container).on('touchmove', function(e) {
            e.preventDefault();
        });

        this.$item.on({
            'touchstart': that.touchStart.bind(that),
            'touchmove': that.touchMove.bind(that),
            'touchend': that.touchEnd.bind(that),
            'touchcancel': that.touchEnd.bind(that),
        });
    }
};
