/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	//如果css和js打包在一起  加载的时候动画存在问题 //估计是加载顺序导致
	//必须分开  故使用了ExtractTextPlugin
	__webpack_require__(2);
	__webpack_require__(6);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	var animateObj = __webpack_require__(11);

	var opt = {
	    'container': '',
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

	window.H5FullscreenPage = function(option) {
	    $.extend(opt, option);
	    this.$containerElem = $(opt.container);
	    this.$item = this.$containerElem.children();
	    this.init();
	};
	window.H5FullscreenPage.prototype = {
	    init: function(option) {
	        // var that = this;
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
	                event.preventDefault();//touchMove 要屏蔽才能触发swipeUp
	            }
	        }else{
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
	        }
	    },
	    touchEnd: function(event) {
	        console.log('touch end');
	        var that = this;
	        //防止多次滚动，故增加一个覆盖层
	        // $('.overlay').show();
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
	        console.log('swipe down');
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
	        // this.$item.on('touchstart', function(e) {
	        //     e.preventDefault();
	        // });
	        // this.$item.on('touchmove', function(e) {
	        //     e.preventDefault();
	        // });

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
	        $('.overlay').on('tap', function(e) {
	            //覆盖层隐藏
	            $('.overlay').hide();
	            e.preventDefault();
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	/*
	 * Tween.js
	 * t: current time（当前时间）；
	 * b: beginning value（初始值）；
	 * c: change in value（变化量）；
	 * d: duration（持续时间）。
	 * you can visit 'http://easings.net/zh-cn' to get effect
	*/
	var Tween = {
	    Linear: function(t, b, c, d) { return c*t/d + b; },
	    Quad: {
	        easeIn: function(t, b, c, d) {
	            return c * (t /= d) * t + b;
	        },
	        easeOut: function(t, b, c, d) {
	            return -c *(t /= d)*(t-2) + b;
	        },
	        easeInOut: function(t, b, c, d) {
	            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
	            return -c / 2 * ((--t) * (t-2) - 1) + b;
	        }
	    },
	    Cubic: {
	        easeIn: function(t, b, c, d) {
	            return c * (t /= d) * t * t + b;
	        },
	        easeOut: function(t, b, c, d) {
	            return c * ((t = t/d - 1) * t * t + 1) + b;
	        },
	        easeInOut: function(t, b, c, d) {
	            if ((t /= d / 2) < 1) return c / 2 * t * t*t + b;
	            return c / 2*((t -= 2) * t * t + 2) + b;
	        }
	    },
	    Quart: {
	        easeIn: function(t, b, c, d) {
	            return c * (t /= d) * t * t*t + b;
	        },
	        easeOut: function(t, b, c, d) {
	            return -c * ((t = t/d - 1) * t * t*t - 1) + b;
	        },
	        easeInOut: function(t, b, c, d) {
	            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
	            return -c / 2 * ((t -= 2) * t * t*t - 2) + b;
	        }
	    },
	    Quint: {
	        easeIn: function(t, b, c, d) {
	            return c * (t /= d) * t * t * t * t + b;
	        },
	        easeOut: function(t, b, c, d) {
	            return c * ((t = t/d - 1) * t * t * t * t + 1) + b;
	        },
	        easeInOut: function(t, b, c, d) {
	            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
	            return c / 2*((t -= 2) * t * t * t * t + 2) + b;
	        }
	    },
	    Sine: {
	        easeIn: function(t, b, c, d) {
	            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	        },
	        easeOut: function(t, b, c, d) {
	            return c * Math.sin(t/d * (Math.PI/2)) + b;
	        },
	        easeInOut: function(t, b, c, d) {
	            return -c / 2 * (Math.cos(Math.PI * t/d) - 1) + b;
	        }
	    },
	    Expo: {
	        easeIn: function(t, b, c, d) {
	            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	        },
	        easeOut: function(t, b, c, d) {
	            return (t==d) ? b + c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	        },
	        easeInOut: function(t, b, c, d) {
	            if (t==0) return b;
	            if (t==d) return b+c;
	            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
	            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	        }
	    },
	    Circ: {
	        easeIn: function(t, b, c, d) {
	            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	        },
	        easeOut: function(t, b, c, d) {
	            return c * Math.sqrt(1 - (t = t/d - 1) * t) + b;
	        },
	        easeInOut: function(t, b, c, d) {
	            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
	            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	        }
	    },
	    Elastic: {
	        easeIn: function(t, b, c, d, a, p) {
	            var s;
	            if (t==0) return b;
	            if ((t /= d) == 1) return b + c;
	            if (typeof p == "undefined") p = d * .3;
	            if (!a || a < Math.abs(c)) {
	                s = p / 4;
	                a = c;
	            } else {
	                s = p / (2 * Math.PI) * Math.asin(c / a);
	            }
	            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	        },
	        easeOut: function(t, b, c, d, a, p) {
	            var s;
	            if (t==0) return b;
	            if ((t /= d) == 1) return b + c;
	            if (typeof p == "undefined") p = d * .3;
	            if (!a || a < Math.abs(c)) {
	                a = c;
	                s = p / 4;
	            } else {
	                s = p/(2*Math.PI) * Math.asin(c/a);
	            }
	            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
	        },
	        easeInOut: function(t, b, c, d, a, p) {
	            var s;
	            if (t==0) return b;
	            if ((t /= d / 2) == 2) return b+c;
	            if (typeof p == "undefined") p = d * (.3 * 1.5);
	            if (!a || a < Math.abs(c)) {
	                a = c;
	                s = p / 4;
	            } else {
	                s = p / (2  *Math.PI) * Math.asin(c / a);
	            }
	            if (t < 1) return -.5 * (a * Math.pow(2, 10* (t -=1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
	        }
	    },
	    Back: {
	        easeIn: function(t, b, c, d, s) {
	            if (typeof s == "undefined") s = 1.70158;
	            return c * (t /= d) * t * ((s + 1) * t - s) + b;
	        },
	        easeOut: function(t, b, c, d, s) {
	            if (typeof s == "undefined") s = 1.70158;
	            return c * ((t = t/d - 1) * t * ((s + 1) * t + s) + 1) + b;
	        },
	        easeInOut: function(t, b, c, d, s) {
	            if (typeof s == "undefined") s = 1.70158;
	            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
	            return c / 2*((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	        }
	    },
	    Bounce: {
	        easeIn: function(t, b, c, d) {
	            return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
	        },
	        easeOut: function(t, b, c, d) {
	            if ((t /= d) < (1 / 2.75)) {
	                return c * (7.5625 * t * t) + b;
	            } else if (t < (2 / 2.75)) {
	                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
	            } else if (t < (2.5 / 2.75)) {
	                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
	            } else {
	                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
	            }
	        },
	        easeInOut: function(t, b, c, d) {
	            if (t < d / 2) {
	                return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
	            } else {
	                return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	            }
	        }
	    }
	}
	Math.tween = Tween;


/***/ },
/* 9 */
/***/ function(module, exports) {

	Math.animation = function (from, to, duration, easing, callback) {
	    var isUndefined = function (obj) {
	        return typeof obj == 'undefined';
	    };
	    var isFunction = function (obj) {
	        return typeof obj == 'function';
	    };
	    var isNumber = function(obj) {
	        return typeof obj == 'number';
	    };
	    var isString = function(obj) {
	        return typeof obj == 'string';
	    };

	    // 转换成毫秒
	    var toMillisecond = function(obj) {
	        if (isNumber(obj)) {
	            return     obj;
	        } else if (isString(obj)) {
	            if (/\d+m?s$/.test(obj)) {
	                if (/ms/.test(obj)) {
	                    return 1 * obj.replace('ms', '');
	                }
	                return 1000 * obj.replace('s', '');
	            } else if (/^\d+$/.test(obj)) {
	                return +obj;
	            }
	        }
	        return -1;
	    };

	    if (!isNumber(from) || !isNumber(to)) {
	        if (window.console) {
	            console.error('from和to两个参数必须且为数值');
	        }
	        return 0;
	    }

	    // 缓动算法
	    var tween = Math.tween || window.Tween;

	    if (!tween) {
	        if (window.console) {
	            console.error('缓动算法函数缺失');
	        }
	        return 0;
	    }

	    // duration, easing, callback均为可选参数
	    // 而且顺序可以任意
	    var options = {
	        duration: 300,
	        easing: 'Linear',
	        callback: function() {}
	    };

	    var setOptions = function(obj) {
	        if (isFunction(obj)) {
	            options.callback = obj;
	        } else if (toMillisecond(obj) != -1) {
	            options.duration = toMillisecond(obj);
	        } else if (isString(obj)) {
	            options.easing = obj;
	        }
	    };
	    setOptions(duration);
	    setOptions(easing);
	    setOptions(callback);

	    // requestAnimationFrame的兼容处理
	    if (!window.requestAnimationFrame) {
	        requestAnimationFrame = function(fn) {
	            setTimeout(fn, 17);
	        };
	    }

	    // 算法需要的几个变量
	    var start = 0;
	    // during根据设置的总时间计算
	    var during = Math.ceil(options.duration / 17);

	    // 当前动画算法
	    var arrKeyTween = options.easing.split('.');
	    var fnGetValue;

	    if (arrKeyTween.length == 1) {
	        fnGetValue = tween[arrKeyTween[0]];
	    } else if (arrKeyTween.length == 2) {
	        fnGetValue = tween[arrKeyTween[0]][arrKeyTween[1]];
	    }

	    // 运动
	    var step = function() {
	        // 当前的运动位置
	        var value = fnGetValue(start, from, to - from, during);

	        // 时间递增
	        start++;
	        // 如果还没有运动到位，继续
	        if (start <= during) {
	            options.callback(value);
	            requestAnimationFrame(step);
	        } else {
	            // 动画结束，这里可以插入回调...
	            options.callback(to, true);
	        }
	    };
	    // 开始执行动画
	    step();
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	;(function($){
	  var touch = {},
	    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
	    longTapDelay = 750,
	    gesture

	  function swipeDirection(x1, x2, y1, y2) {
	    return Math.abs(x1 - x2) >=
	      Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
	  }

	  function longTap() {
	    longTapTimeout = null
	    if (touch.last) {
	      touch.el.trigger('longTap')
	      touch = {}
	    }
	  }

	  function cancelLongTap() {
	    if (longTapTimeout) clearTimeout(longTapTimeout)
	    longTapTimeout = null
	  }

	  function cancelAll() {
	    if (touchTimeout) clearTimeout(touchTimeout)
	    if (tapTimeout) clearTimeout(tapTimeout)
	    if (swipeTimeout) clearTimeout(swipeTimeout)
	    if (longTapTimeout) clearTimeout(longTapTimeout)
	    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
	    touch = {}
	  }

	  function isPrimaryTouch(event){
	    return (event.pointerType == 'touch' ||
	      event.pointerType == event.MSPOINTER_TYPE_TOUCH)
	      && event.isPrimary
	  }

	  function isPointerEventType(e, type){
	    return (e.type == 'pointer'+type ||
	      e.type.toLowerCase() == 'mspointer'+type)
	  }

	  $(document).ready(function(){
	    var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

	    if ('MSGesture' in window) {
	      gesture = new MSGesture()
	      gesture.target = document.body
	    }

	    $(document)
	      .bind('MSGestureEnd', function(e){
	        var swipeDirectionFromVelocity =
	          e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null
	        if (swipeDirectionFromVelocity) {
	          touch.el.trigger('swipe')
	          touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
	        }
	      })
	      .on('touchstart MSPointerDown pointerdown', function(e){
	        if((_isPointerType = isPointerEventType(e, 'down')) &&
	          !isPrimaryTouch(e)) return
	        firstTouch = _isPointerType ? e : e.touches[0]
	        if (e.touches && e.touches.length === 1 && touch.x2) {
	          // Clear out touch movement data if we have it sticking around
	          // This can occur if touchcancel doesn't fire due to preventDefault, etc.
	          touch.x2 = undefined
	          touch.y2 = undefined
	        }
	        now = Date.now()
	        delta = now - (touch.last || now)
	        touch.el = $('tagName' in firstTouch.target ?
	          firstTouch.target : firstTouch.target.parentNode)
	        touchTimeout && clearTimeout(touchTimeout)
	        touch.x1 = firstTouch.pageX
	        touch.y1 = firstTouch.pageY
	        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
	        touch.last = now
	        longTapTimeout = setTimeout(longTap, longTapDelay)
	        // adds the current touch contact for IE gesture recognition
	        if (gesture && _isPointerType) gesture.addPointer(e.pointerId)
	      })
	      .on('touchmove MSPointerMove pointermove', function(e){
	        if((_isPointerType = isPointerEventType(e, 'move')) &&
	          !isPrimaryTouch(e)) return
	        firstTouch = _isPointerType ? e : e.touches[0]
	        cancelLongTap()
	        touch.x2 = firstTouch.pageX
	        touch.y2 = firstTouch.pageY

	        deltaX += Math.abs(touch.x1 - touch.x2)
	        deltaY += Math.abs(touch.y1 - touch.y2)
	      })
	      .on('touchend MSPointerUp pointerup', function(e){
	        if((_isPointerType = isPointerEventType(e, 'up')) &&
	          !isPrimaryTouch(e)) return
	        cancelLongTap()

	        // swipe
	        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
	            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

	          swipeTimeout = setTimeout(function() {
	            if (touch.el){
	              touch.el.trigger('swipe')
	              touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
	            }
	            touch = {}
	          }, 0)

	        // normal tap
	        else if ('last' in touch)
	          // don't fire tap when delta position changed by more than 30 pixels,
	          // for instance when moving to a point and back to origin
	          if (deltaX < 30 && deltaY < 30) {
	            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
	            // ('tap' fires before 'scroll')
	            tapTimeout = setTimeout(function() {

	              // trigger universal 'tap' with the option to cancelTouch()
	              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
	              var event = $.Event('tap')
	              event.cancelTouch = cancelAll
	              // [by paper] fix -> "TypeError: 'undefined' is not an object (evaluating 'touch.el.trigger'), when double tap
	              if (touch.el) touch.el.trigger(event)

	              // trigger double tap immediately
	              if (touch.isDoubleTap) {
	                if (touch.el) touch.el.trigger('doubleTap')
	                touch = {}
	              }

	              // trigger single tap after 250ms of inactivity
	              else {
	                touchTimeout = setTimeout(function(){
	                  touchTimeout = null
	                  if (touch.el) touch.el.trigger('singleTap')
	                  touch = {}
	                }, 250)
	              }
	            }, 0)
	          } else {
	            touch = {}
	          }
	          deltaX = deltaY = 0

	      })
	      // when the browser window loses focus,
	      // for example when a modal dialog is shown,
	      // cancel all ongoing events
	      .on('touchcancel MSPointerCancel pointercancel', cancelAll)

	    // scrolling the window indicates intention of the user
	    // to scroll, not tap or swipe, so cancel all ongoing events
	    $(window).on('scroll', cancelAll)
	  })

	  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
	    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
	    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
	  })
	})(Zepto)


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = {
	    '1': {
	        'upDrag': function(percentage, item) {
	            var translateY = 1 - 0.7 * percentage; //位置系数，可以微调
	            item.next().css('-webkit-transform', 'translate3d(0,' + translateY * 100 + '%,0)'); //下一个item上移动
	        },
	        'downDrag': function(percentage, item) {

	            var translateY = -(0.7 * percentage);
	            item.prev().css('-webkit-transform', 'translate3d(0,' + (translateY * 100 - 100) + '%,0)');
	            item.css('-webkit-transform', 'translate3d(0,' + translateY * 100 + '%,0)'); //当前item下移动
	        },
	        'nextSlide': function(item) {
	            item.css('-webkit-transform', 'translate3d(0,-100%,0)');
	            item.next().css('-webkit-transform', 'translate3d(0,0,0)');
	        },
	        'prevSlide': function(item) {
	            item.prev().css('-webkit-transform', 'scale(1)');
	            item.css('-webkit-transform', 'translate3d(0,100%,0)');
	        },
	        'showSlide': function(item) {
	            item.css('-webkit-transform', 'scale(1)');
	            item.next().css('-webkit-transform', 'translate3d(0,100%,0)');
	        }
	    },
	    '2': {
	        'upDrag': function(percentage, item) {
	            var scale = 1 - 0.2 * percentage; //缩放系数，可以微调
	            var translateY = 1 - 0.7 * percentage; //位置系数，可以微调
	            item.css('-webkit-transform', 'scale(' + scale + ')'); //当前item缩小
	            item.next().css('-webkit-transform', 'translate3d(0,' + translateY * 100 + '%,0)'); //下一个item上移动
	        },
	        'downDrag': function(percentage, item) {
	            console.log('down drag');

	            var scale = 0.8 - 0.2 * percentage;
	            var translateY = -(0.7 * percentage);
	            item.css('-webkit-transform', 'translate3d(0,' + translateY * 100 + '%,0)'); //当前item下移动
	            item.prev().css('-webkit-transform', 'scale(' + scale + ')'); //前一个item放大
	        },
	        'nextSlide': function(item) {
	            item.css('-webkit-transform', 'scale(.8)');
	            item.next().css('-webkit-transform', 'translate3d(0,0,0)');
	        },
	        'prevSlide': function(item) {
	            item.prev().css('-webkit-transform', 'scale(1)');
	            item.css('-webkit-transform', 'translate3d(0,100%,0)');
	        },
	        'showSlide': function(item) {
	            item.css('-webkit-transform', 'scale(1)');
	            item.next().css('-webkit-transform', 'translate3d(0,100%,0)');
	        }
	    },
	    '3': {
	        'upDrag': function(percentage, item) {
	            var translateY = 1 - 0.4 * percentage; //位置系数，可以微调
	            item.css('-webkit-transform', 'translate3d(0,' + (translateY * 100 - 100) + '%,0)');
	            item.next().css('-webkit-transform', 'translate3d(0,' + translateY * 100 + '%,0)'); //下一个item上移动
	        },
	        'downDrag': function(percentage, item) {
	            var translateY = -(0.4 * percentage);
	            item.prev().css('-webkit-transform', 'translate3d(0,' + (translateY * 100 - 100) + '%,0)');
	            item.css('-webkit-transform', 'translate3d(0,' + translateY * 100 + '%,0)'); //当前item下移动
	        },
	        'nextSlide': function(item) {
	            item.css('-webkit-transform', 'translate3d(0,-100%,0)');
	            item.next().css('-webkit-transform', 'translate3d(0,0,0)');
	        },
	        'prevSlide': function(item) {
	            item.prev().css('-webkit-transform', 'scale(1)');
	            item.css('-webkit-transform', 'translate3d(0,100%,0)');
	        },
	        'showSlide': function(item) {
	            item.css('-webkit-transform', 'scale(1)');
	            item.next().css('-webkit-transform', 'translate3d(0,100%,0)');
	        }
	    },
	    '4': {
	        'upDrag': function(percentage, item) {
	            var translateY = 1 - 0.4 * percentage; //位置系数，可以微调
	            item.css('-webkit-transform', 'translate3d(0,' + (translateY * 100 - 100) + '%,0)');
	            item.next().css('-webkit-transform', 'translate3d(0,' + translateY * 100 + '%,0)'); //下一个item上移动
	        },
	        'downDrag': function(percentage, item) {

	            var translateY = -(0.4 * percentage);
	            item.prev().css('-webkit-transform', 'translate3d(0,' + (translateY * 100 - 100) + '%,0)');
	            item.css('-webkit-transform', 'translate3d(0,' + translateY * 100 + '%,0)'); //当前item下移动
	        },
	        'nextSlide': function(item) {
	            item.addClass('zindex');
	            setTimeout(function() {
	                item.removeClass('no-animation').css('-webkit-transform', 'translate3d(0,-100%,0)');
	                item.next().removeClass('zindex').addClass('no-animation').css('-webkit-transform', 'translate3d(0,0,0)');
	            }, 100);

	        },
	        'prevSlide': function(item) {

	            item.prev().css('-webkit-transform', 'translate3d(0,0,0)');
	            item.next().css('-webkit-transform', 'translate3d(0,100%,0)');
	            item.removeClass('zindex');
	        },
	        'showSlide': function(item) {
	            item.css('-webkit-transform', 'scale(1)');
	            item.next().css('-webkit-transform', 'translate3d(0,100%,0)');
	        }
	    }
	};


/***/ }
/******/ ]);