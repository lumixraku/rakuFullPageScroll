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
    useArrow: true,
};

var WINDOW_HEIGHT = window.screen.height;
var NO_ANIMATION_CLASS = 'no-animation';


var $body = $(document.body);

var dragThreshold = 0.05; //临界值
var dragStart = null; //开始抓取标志位
var percentage = 0; //拖动量的百分比
var startScrolled = 0; // 开始时已经滚动距离
var currentItem;

var dragStartBody = null;
var dragStartBodyThrehold = 300; //WINDOW_HEIGHT/3;
var animationSpeed = 1.1;

var animateEndScrollTo = 0;

var PART_UP = 'partUp';
var PART_DOWN = 'partDown';
var PART_FIT = 'fit';
var PART_OUT_UP = 'partOutUp';
var PART_OUT_DOWN = 'partOutDown';

function getElementTop(element) {　　　　
    var actualTop = element.offsetTop;　　　　
    var current = element.offsetParent;　　　　
    while (current !== null) {　　　　　　
        actualTop += current.offsetTop;　　　　　　
        current = current.offsetParent;　　　　
    }　　　　
    return actualTop;　　
}

function getElementBottom(element) {
    var actualBottom = element.offsetBottom;　　　　
    var current = element.offsetParent;　　　　
    while (current !== null) {　　　　　　
        actualBottom += current.offsetBottom;　　　　　　
        current = current.offsetParent;　　　　
    }　　　　
    return actualBottom;　　
}

function getScrolled() {
    return document.body.scrollTop;
}

// $(window).scroll(function() {
//     document.webkitExitFullscreen && document.webkitExitFullscreen();
//     document.exitFullscreen && document.exitFullscreen();
// });

$(window).on('resize', function(e) {
    // console.log(e, $(window).height());
    console.log('resize');
    $(document.body).height($(window).height());
    WINDOW_HEIGHT = window.screen.height;
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

        this.$containerElem.height(WINDOW_HEIGHT);
        this.containerHeight = this.$containerElem.height();

        this.offsetToBodyTop = getElementTop(this.$containerElem[0]);
        this.offsetToBodyBottom = getElementBottom(this.$containerElem[0]);

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

        // this.$overlay = $('<div class="overlay hide"></div>');
        // $('body').append(this.$overlay);


        if (opt.useArrow) {
            if (this.$item.parent().next().hasClass('H5FullscreenPage-wrap')) {
                this.$item.append('<span class="arrow"></span>');
            }
        }
    },


    touchStart: function(event) {
        var that = this;
        if (dragStart !== null) return;
        // $('.overlay').hide();
        // that.$overlay.removeClass('hide');

        // var item = $(event.target).closest('.item');
        // if (!item.length) {
        //     $('.overlay').hide();
        //     return;
        // }
        if (event.touches) {
            ev0 = event.touches[0];
        }
        if (event.originalEvent.touches) {
            ev0 = event.originalEvent.touches[0];
        }
        //抓取时的所在位置
        dragStart = ev0.clientY;
        // startScrolled = getScrolled();

        //分别关闭item的动画效果,动画效果只在松开抓取时出现
        // $body.addClass(NO_ANIMATION_CLASS);

        // var scrolledTop = getScrolled();
        // var offsetBody = that.offsetToBodyTop;

        // that.scrollInScreen = scrolledTop === offsetBody;
        // that.touchInRange = true; //表示进入到了指定的滑动区域  //单页组件以及单页组件附近




        // that.touchInPage = true;
        console.log('scrollInScreen', that.scrollInScreen);

        // event.stopPropagation();


    },
    touchMove: function(event) {
        var that = this;
        var ev0;
        if (event.touches) {
            ev0 = event.touches[0];
        }
        if (event.originalEvent.touches) {
            ev0 = event.originalEvent.touches[0];
        }

        //得到抓取开始时于进行中的差值的百分比
        percentage = (dragStart - ev0.clientY) / WINDOW_HEIGHT;


        // var inScreenInfo = that._inScreen();

        // if(!inScreenInfo.partup && !inScreenInfo.partdown && !inScreenInfo.fit){

        // }else{
        //     event.preventDefault();

        //     if (percentage > 0) {
        //         window.scrollTo(0, startScrolled + Math.abs(dragStart - ev0.clientY));

        //     } else {
        //         window.scrollTo(0, startScrolled - Math.abs(dragStart - ev0.clientY));
        //     }
        // }




    },

    _inScreen: function() {
        var $content = $('.content');
        var $h5fullItem = $content.find('.H5FullscreenPage-wrap');
        var inScreenElem = [];
        var inScreenInfo = {
            partup: null,
            partdown: null,
            fit: null,
            inScreenElem: inScreenElem
        };
        $.each($h5fullItem, function(idx, h5fullItem) {
            var posInfo = h5fullItem.getBoundingClientRect();
            var elemInfo = {};
            if (posInfo.bottom > 0) {


                if (posInfo.top < 0) {
                    elemInfo.pos = PART_UP;
                    inScreenInfo.partup = h5fullItem;
                } else if (posInfo.top > 0) {

                    if (posInfo.top > WINDOW_HEIGHT) {
                        elemInfo.pos = PART_OUT_DOWN;
                    } else {
                        elemInfo.pos = PART_DOWN;
                        inScreenInfo.partdown = h5fullItem;
                    }

                } else if (posInfo.top == 0) {
                    elemInfo.pos = PART_FIT;
                    inScreenInfo.fit = h5fullItem;
                }
            } else {
                elemInfo.pos = PART_OUT_UP;
            }
            elemInfo.elem = h5fullItem;
            if ([PART_DOWN, PART_UP, PART_FIT].indexOf(elemInfo.pos) > -1) {
                inScreenElem.push(elemInfo);
            }
        });
        console.log(inScreenInfo);
        return inScreenInfo;
    },
    touchEnd: function(event) {
        var that = this;
        var inScreenInfo = that._inScreen();
        console.log(inScreenInfo)

        dragStart = null;
        dragStartBody = null;

        //抓取停止后，根据临界值做相应判断
        var offsetToBody = that.offsetToBodyTop;
        var scrolled = getScrolled();



        if (Math.abs(percentage) >= dragThreshold) {


            //这种情况一般是多个连续的单页组件
            if (inScreenInfo.partup && inScreenInfo.partdown) {
                if (percentage < 0) {
                    that.moveoutslide_down(inScreenInfo.partdown);
                }
                if(percentage > 0){
                    that.moveoutslide_up(inScreenInfo.partup);

                }


            } else if (inScreenInfo.fit) {
                var elem = inScreenInfo.fit;
                if (percentage < 0) {
                    that.moveoutslide_down(elem, 'fit');
                }

                if (percentage > 0) {
                    that.moveoutslide_up(elem, 'fit');
                }

            } else if (inScreenInfo.partup || inScreenInfo.partdown) {
                var elem = inScreenInfo.partup || inScreenInfo.partdown;
                if (percentage < 0) {
                    that.moveintoslide(elem);
                }

                if (percentage > 0) {
                    that.moveintoslide(elem);
                }

            } else { //单页组件不再可视区域

            }

        } else {
            console.log('scrolled too little to trigger next step');
        }


        //重置percentage
        percentage = 0;
        that.touchInRange = null;
        that.touchInRangeAbove = null;
        that.touchInRangeBelow = null;
        that.touchInPage = null;
        console.log('touch end');

    },
    moveoutslide_up: function(elem, fit) {
        console.log('moveout slide up');
        var that = this;
        var offsetToBody = getElementTop(elem);
        var scrolled = getScrolled();
        var scrollTo = offsetToBody + WINDOW_HEIGHT;;


        Math.animation(scrolled, scrollTo, Math.abs(scrolled - scrollTo) * animationSpeed, that.animateType, function(value, end) {
            console.log('move out up');
            window.scrollTo(0, value.toFixed(3), end);
            if (end) {
                console.log('end true');
                // that.$overlay.addClass('hide');
            }
        });
    },
    moveoutslide_down: function(elem) {
        console.log('moveout slide down');


        var that = this;
        var scrollTo = 0;
        var scrolled = getScrolled();
        var offsetToBody = getElementTop(elem);

        scrollTo = offsetToBody - that.containerHeight;
        // scrollTo = Math.min(scrollTo, offsetToBody);
        // if (scrollTo < 0) scrollTo = 0;
        Math.animation(scrolled, scrollTo, Math.abs(scrolled - scrollTo) * animationSpeed, that.animateType, function(value, end) {
            value = value.toFixed(3);
            console.log('moveslide down');
            window.scrollTo(0, value);
            if (end) {
                console.log('end true');
                // debugger
                // that.$overlay.addClass('hide');
            }
        });

        //使用transform
        // animateEndScrollTo = scrollTo;
        // var translateY = WINDOW_HEIGHT + scrolled - offsetToBody;
        // translateY  = Math.min(translateY, scrolled);
        // if(document.body.scrollTop === 0) translateY = 0;
        // $body.css({
        //     '-webkit-transform': 'translate3d(0, ' + (translateY)  + 'px, 0)',
        //     // '-webkit-transition': 'all 700ms cubic-bezier(0.550, 0.085, 0.000, 0.990)',
        // });
    },

    moveintoslide: function(elem) {
        var that = this;
        var scrolled = getScrolled();
        var scrollTo = getElementTop(elem) || 0;
        Math.animation(scrolled, scrollTo, Math.abs(scrolled - scrollTo) * animationSpeed, that.animateType, function(value, end) {
            console.log('move into ');
            window.scrollTo(0, value.toFixed(3));
            if (end) {
                console.log('end true');

                // that.$overlay.addClass('hide');
            }

        });
        // console.log('move into end-------------', scrollTo);
    },
    //在单页组件附近区域的滚动  同样显示单页组件
    //只要单页组件进入了可视区域

    touchStartBody: function(event) {
        console.log('touch start body');
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
        var offsetToBody = that.offsetToBodyTop;
        var offsetToBodyWithHeight = offsetToBody + that.containerHeight;

        //单页组件 已经进入到可视区域

        //这样太麻烦
        // if ((offsetToBody - dragStartBody) > 0 && Math.abs(offsetToBody - dragStartBody) < dragStartBodyThrehold) {
        //     //在单页组件附近的上方滑动
        //     this.touchInRange = true;
        //     this.touchInRangeAbove = true;
        //     console.log('touch in range above');
        //     // event.preventDefault();
        // } else if ((dragStartBody - offsetToBodyWithHeight) > 0 && Math.abs(dragStartBody - offsetToBodyWithHeight) < dragStartBodyThrehold) {
        //     //在单页组件附近的下方滑动
        //     this.touchInRange = true;
        //     this.touchInRangeBelow = true;
        //     console.log('touch in range below');
        //     // event.preventDefault();
        // }
        // startScrolled = getScrolled();
        // event.stopPropagation();

    },
    bodyTransitionEnd: function() {
        $body.addClass(NO_ANIMATION_CLASS);
        $body.css({
            '-webkit-transform': 'translate3d(0,0,0)'
        });
        window.scrollTo(0, animateEndScrollTo);
    },

    initEvent: function(opt) {
        var that = this;
        // 绑定事件
        $(opt.container).on('touchmove', function(e) {
            e.preventDefault();
        });

        // this.$item.on({
        //     'touchstart': that.touchStart.bind(that),
        //     'touchmove': that.touchMove.bind(that),
        //     'touchend': that.touchEnd.bind(that),
        //     'touchcancel': that.touchEnd.bind(that),
        // });
        if (!$body.attr('single-page-event')) {
            $body.attr('single-page-event', 'bind');
            $('.content').on({
                'touchstart': that.touchStartBody.bind(that),
                'touchmove': that.touchMove.bind(that),
                'touchend': that.touchEnd.bind(that),
                'touchcancel': that.touchEnd.bind(that),
                'transitionend': that.bodyTransitionEnd.bind(that),
            });
        }
    }
};