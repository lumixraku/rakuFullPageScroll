//如果css和js打包在一起  加载的时候动画存在问题 //估计是加载顺序导致
//必须分开  故使用了ExtractTextPlugin
require('./simpleH5FullscreenPage.css');
// require('./simple_page-animation.css');
require('./tween/tween.js');
require('./tween/animation.js');
// var animateObj = require('./animateObj.js');

var opt = {
    container: '.H5FullscreenPage-wrap',
    animateType: 'Linear',
    pageShow: function() {},
    pageHide: function() {},
    // useParallax: true,
    useArrow: true,
    // 'useAnimation': true,
    // 'useMusic' : {
    //     'autoPlay' : true,
    //     'loopPlay' : true,
    //     'src' : 'http://mat1.gtimg.com/news/2015/love/FadeAway.mp3'
    // }
};

var $body = $(document.body);

var dragThreshold = 0.01; //临界值
var dragStart = null; //开始抓取标志位
var percentage = 0; //拖动量的百分比
var startScrolled = 0; // 开始时已经滚动距离
var currentItem;

var dragStartBody = null;


function getElementTop(element) {　　　　
    var actualTop = element.offsetTop;　　　　
    var current = element.offsetParent;　　　　
    while (current !== null) {　　　　　　
        actualTop += current.offsetTop;　　　　　　
        current = current.offsetParent;　　　　
    }　　　　
    return actualTop;　　
}
//
// $(window).scroll(function() {
//     document.webkitExitFullscreen && document.webkitExitFullscreen();
//     document.exitFullscreen && document.exitFullscreen();
// });

$(window).on('resize', function(e) {
    // console.log(e, $(window).height());
    console.log('resize');
    $(document.body).height($(window).height());
});


window.H5FullscreenPage = function(option) {
    this.option = option;
    this.init(option);
};
window.H5FullscreenPage.prototype = {

    init: function(option) {
        var that = this;
        $.extend(opt, option);
        this.animateType = opt.animateType;
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
    getOffset: function(element) {
        var that = this;
        element = element || that.$containerElem[0];
        var actualTop = element.offsetTop;　　　　
        var current = element.offsetParent;　　　　
        while (current !== null) {　　　　　　
            actualTop += current.offsetTop;　　　　　　
            current = current.offsetParent;　　　　
        }　　　　
        return actualTop;　　
    },
    getScrolled: function() {
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
            ev0 = event.touches[0];
        }
        if (event.originalEvent.touches) {
            ev0 = event.originalEvent.touches[0];
        }
        //抓取时的所在位置
        dragStart = ev0.clientY;
        startScrolled = this.getScrolled();

        //分别关闭item的动画效果,动画效果只在松开抓取时出现
        // item.addClass('no-animation');
        // item.next().addClass('no-animation');
        // item.prev().addClass('no-animation');

        var scrolledTop = document.body.scrollTop;
        var offsetBody = getElementTop(that.$containerElem[0]);

        that.scrollInScreen = scrolledTop === offsetBody;
        that.touchInRange = true; //表示进入到了指定的滑动区域  //单页组件以及单页组件附近




        that.touchInPage = true;
        console.log('scrollInScreen', that.scrollInScreen);

        event.stopPropagation();


    },
    touchMove: function(event) {
        console.log('touch move');
        var that = this;
        if (dragStart === null) return;

        //body的touchmove事件也到这里
        if (!that.touchInRange) return;

        // event.preventDefault();
        var ev0;
        if (event.touches) {
            ev0 = event.touches[0];
        }
        if (event.originalEvent.touches) {
            ev0 = event.originalEvent.touches[0];
        }

        //得到抓取开始时于进行中的差值的百分比
        percentage = (dragStart - ev0.clientY) / window.screen.height;
        console.log('touch move in page ', percentage);


        if (percentage > 0) {
            window.scrollTo(0, startScrolled + Math.abs(dragStart - ev0.clientY));
        } else {
            window.scrollTo(0, startScrolled - Math.abs(dragStart - ev0.clientY));
        }
    },
    touchEnd: function(event) {
        var that = this;
        //防止多次滚动，故增加一个覆盖层
        // $('.overlay').show();
        dragStart = null;
        dragStartBody = null;

        //在非单页组件上滑动了
        // var item = $(event.target).closest('.item');
        // if (!item.length) {
        //     return;
        // }


        // item.removeClass('no-animation');
        // item.next().removeClass('no-animation');
        // item.prev().removeClass('no-animation');

        //抓取停止后，根据临界值做相应判断
        var offsetToBody = that.getOffset();
        var scrolled = that.getScrolled();
        console.log('touchend percentage', percentage);

        if (that.touchInRange) {
            // console.log('touchend in range');

        } else {
            return;
        }
        if (Math.abs(percentage) >= dragThreshold) {
            if (offsetToBody < scrolled && percentage > 0) {
                that.moveoutslide_up();
            }
            if (offsetToBody > scrolled && percentage > 0) {
                that.moveintoslide();
            }
            if (offsetToBody < scrolled && percentage < 0) {
                that.moveintoslide();
            }
            if (offsetToBody > scrolled && percentage < 0) {
                that.moveoutslide_down();
            }
            if (offsetToBody === scrolled && percentage > 0) {
                that.moveoutslide_up();
            }
            if (offsetToBody === scrolled && percentage < 0) {
                that.moveoutslide_down();
            }
        } else {
            console.log('scrolled too little to trigger next step');
        }


        //重置percentage
        percentage = 0;
        that.touchInRange = null;
        that.touchInPage = null;
        console.log('touch end');


    },
    moveoutslide_up: function(item) {
        console.log('moveout slide up');
        var that = this;
        var scrollTo = 0;
        var scrolled = that.getScrolled();

        //that.$containerElem[0] 指的是当前被拖动的item  此时此item 顶部已有一部分被遮住
        var offsetToBody = getElementTop(that.$containerElem[0]);

        scrollTo = offsetToBody + that.$containerElem.height();
        Math.animation(scrolled, scrollTo, Math.abs(scrolled - scrollTo) * 1.5, that.animateType, function(value, end) {
            console.log(value.toFixed(3) + '...............');
            window.scrollTo(0, value.toFixed(3));
        });

        //使用transform改变
        // var winHeight = window.screen.height;
        // var translateY = winHeight - (scrolled - offsetToBody);
        //
        // window.scrollTo(0, scrollTo);
        //
        // $body.css({
        //     transform: 'translateY(' +translateY+ 'px)'
        // });
        // Math.animation(translateY, 0, Math.abs(winHeight) * 1.5, that.animateType, function(value, end) {
        //     value = value.toFixed(3);
        //     console.log(value, '...............', end);
        //     $body.css({
        //         transform: 'translate3d(0, ' +value+ 'px, 0)'
        //     });
        //     if(end){
        //         $body.css({
        //             transform: ''
        //         });
        //     }
        // });

        console.log('move up end-------------', scrollTo);

    },
    moveintoslide: function() {
        console.log('moveinto slide');

        var that = this;
        var scrolled = that.getScrolled();
        var scrollTo = getElementTop(that.$containerElem[0]) || 0;
        Math.animation(scrolled, scrollTo, Math.abs(scrolled - scrollTo) * 2, that.animateType, function(value, end) {
            console.log(value.toFixed(3));
            window.scrollTo(0, value.toFixed(3));
        });
        console.log('move into end-------------', scrollTo);
    },
    moveoutslide_down: function() {
        console.log('moveout slide down');


        var that = this;
        var scrollTo = 0;
        var scrolled = that.getScrolled();
        var offsetToBody = getElementTop(that.$containerElem[0]);

        scrollTo = offsetToBody - that.$containerElem.height();
        if (scrollTo < 0) scrollTo = 0;
        Math.animation(scrolled, scrollTo, Math.abs(scrolled - scrollTo) * 2, that.animateType, function(value, end) {
            window.scrollTo(0, value.toFixed(3));
        });
    },
    touchStartBody: function(event) {
        var that = this;
        // if (dragStartBody !== null) return;
        if (event.touches) {
            ev0 = event.touches[0];
        }
        if (event.originalEvent.touches) {
            ev0 = event.originalEvent.touches[0];
        }
        //抓取时的所在位置
        dragStart = ev0.clientY;
        dragStartBody = ev0.pageY;
        var offsetToBody = that.getOffset();
        var offsetToBodyWithHeight = offsetToBody + that.$containerElem.height();
        var dragStartBodyThrehold = 150;

        //这样太麻烦
        if ((offsetToBody - dragStartBody) > 0 && Math.abs(offsetToBody - dragStartBody) < 150) {
            this.touchInRange = true;
            console.log('touch in range above');
        }
        else if (( dragStartBody - offsetToBodyWithHeight) > 0 && Math.abs(dragStartBody - offsetToBodyWithHeight) < 150 ){
            this.touchInRange = true;
            console.log('touch in range below');
        }
        startScrolled = this.getScrolled();
        event.stopPropagation();

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
        });
        // if (!$body.attr('single-page-event')) {
        //     $body.attr('single-page-event', 'bind');
            $body.on({
                'touchstart': that.touchStartBody.bind(that),
                'touchmove': that.touchMove.bind(that),
                'touchend': that.touchEnd.bind(that),
                'touchcancel': that.touchEnd.bind(that),
            });
        // }
    }
};
