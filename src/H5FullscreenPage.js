//如果css和js打包在一起  加载的时候动画存在问题 //估计是加载顺序导致
//必须分开  故使用了ExtractTextPlugin
require('./H5FullscreenPage.css');
require('./page-animation.css');
require('./tween/tween.js');
require('./tween/animation.js');
var animateObj = require('./animateObj.js');

var opt = {
    'container': '.H5FullscreenPage-wrap',
    'type': 1,
    'pageShow': function() {},
    'pageHide': function() {},
    'useShakeDevice': {
        'speed': 30,
        'callback': function() {}
    },
    'useParallax': true,
    'useArrow': true,
    'useAnimation': true,
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

window.H5FullscreenPage = function() {};
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
        if (opt.useAnimation) {
            var items = this.$item;
            items.find('.part').addClass('hide');
            that.orderPart(items.first());
        }
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
        console.log('start');
        var that = this;
        if (dragStart !== null) return;
        var item = $(event.target).closest('.item');
        if (!item.length) {
            $('.overlay').hide();
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
        console.log('touchMove');
        var that = this;
        var item = $(event.target).closest('.item');
        if (dragStart === null) return;
        if (!item.length) {
            $('.overlay').hide();
            return;
        }


        var ev0;
        if (event.touches) {
            ev0 = event.touches[0];
        }
        //得到抓取开始时于进行中的差值的百分比
        percentage = (dragStart - ev0.clientY) / window.screen.height; //
        var offset = that.getOffset();
        var scrolled = that.getScrolled();
        if (!that.scrollInScreen) {
            //非全屏  scroll组件没有完全进入
            if(percentage > 0 && (offset > scrolled)){
                event.preventDefault(); //swipeup
            }
            if(percentage < 0 && offset < scrolled){
                event.preventDefault();
            }
            return;//touchMove 要屏蔽才能触发swipeUp
        }


        //percentage > 0 向上滑动
        if (percentage > 0) {
            if (item.index() + 1 !== that.pageCount) {
                var scale = 1 - 0.5 * percentage; //缩放系数，可以微调
                animateObj[opt.type].upDrag(percentage, item);
                event.preventDefault();

            } else {
                //最后一个slide  向上滑动时 采用默认事件
            }

        } else if (item.prev()) {
            if(item.index() !== 0  ){
                animateObj[opt.type].downDrag(percentage, item);
                event.preventDefault();

            }else{
                //第一个向 下拖动  默认

            }
        }
    },
    touchEnd: function(event) {
        console.log('touch end');
        var that = this;
        //防止多次滚动，故增加一个覆盖层
        $('.overlay').show();
        dragStart = null;
        var item = $(event.target).closest('.item');
        if (!item.length) {
            $('.overlay').hide();
            return;
        }
        item.removeClass('no-animation');
        item.next().removeClass('no-animation');
        item.prev().removeClass('no-animation');

        //抓取停止后，根据临界值做相应判断

        if (that.scrollInScreen) {
            if (percentage >= dragThreshold) {
                that.nextSlide(item);
            } else if (Math.abs(percentage) >= dragThreshold) {
                that.prevSlide(item);
            } else {
                that.showSlide(item);
            }
        }
        //重置percentage
        percentage = 0;

    },


    swipeUp: function(event) {
        var that = this;

        console.log('swipeUp', that.scrollInScreen);
        var item = $(event.target).closest('.item');
        if (!item.length) {
            return;
        }
        var offsetToBody = getElementTop(that.$containerElem[0]);
        var scrolled = that.getScrolled();

        if(!that.scrollInScreen){
            Math.animation(scrolled,offsetToBody, Math.abs(scrolled - offsetToBody), 'Linear', function(value, end){
                window.scrollTo(0, value);
            });
        }else{

            //最后一个向上滑  底部吸顶
            if(item.index()+1 === that.pageCount){
                var containerHeight = that.$containerElem.height();
                Math.animation(scrolled, scrolled+containerHeight, containerHeight, 'Linear', function(value, end){
                    window.scrollTo(0, value);
                });
            }
        }
    },

    swipeDown: function(event) {
        var that = this;
        var item = $(event.target).closest('.item');
        if (!item.length) {
            return;
        }
        var offsetToBody = getElementTop(that.$containerElem[0]);
        var scrolled = that.getScrolled();
        if(item.index() !== 0){
            Math.animation(scrolled,offsetToBody, Math.abs(scrolled - offsetToBody), 'Linear', function(value, end){
                window.scrollTo(0, value);
            });

        }else{
            //第一张图下滑  单页组件向下缩起来
            var scrollTo = 0;
            scrollTo = offsetToBody - that.$containerElem.height();
            if(scrollTo < 0) scrollTo = 0;
            Math.animation(scrolled,scrollTo, Math.abs(scrolled - scrollTo), 'Linear', function(value, end){
                window.scrollTo(0, value);
            });
        }
    },

    nextSlide: function(item) {
        var that = this;
        if (item.next().length) {
            item.attr('state', 'prev');
            item.siblings('.item').removeAttr('state');

            currentItem = item.next();
            currentItem.attr('state', 'next');

            that.orderPart(item.next());
            animateObj[opt.type].nextSlide(item);
        } else {
            animateObj[opt.type].showSlide(item);
        }

    },
    prevSlide: function(item) {
        if (item.prev().length) {

            item.attr('state', 'prev');
            item.siblings('.item').removeAttr('state');
            currentItem = item.prev();
            currentItem.attr('state', 'next');
            animateObj[opt.type].prevSlide(item);
        } else {
            animateObj[opt.type].showSlide(item);
        }

    },

    showSlide: function(item) {
        //$(event.target).removeClass('parallax-item');
        animateObj[opt.type].showSlide(item);
    },

    orderPart: function(dom) {
        var parts = $(dom).find('.part');
        parts.forEach(function(item) {
            var time = $(item).attr('data-delay') || 100;
            setTimeout(function() {
                $(item).removeClass('hide');
            }, time);
        });
    },

    initEvent: function(opt) {
        var that = this;

        // 绑定事件
        $(opt.container).on('touchmove', function(e) {
            e.preventDefault();
        });

        this.$item.on({
            'touchstart': that.touchStart.bind(that),
            'touchmove': that.touchMove.bind(that),
            'touchend': that.touchEnd.bind(that),
            'touchcancel': that.touchEnd.bind(that),
            'swipeUp': that.swipeUp.bind(that),
            'swipeDown': that.swipeDown.bind(that)
        });

        this.$item.on('tap', function() {
            //覆盖层隐藏
            $('.overlay').hide();
        });
        $('.overlay').on('tap', function() {
            //覆盖层隐藏
            $('.overlay').hide();
        });

        this.$item.on('transitionend webkitTransitionEnd', function(event) {
            //覆盖层隐藏
            $('.overlay').hide();
            console.log('transitionend overlay hide');
            //console.log($(event.target).attr('state'));
            if ($(event.target).attr('state') == 'next') {
                opt.pageShow(event.target);
            } else {
                opt.pageHide(event.target);
            }
        });
    }
};
