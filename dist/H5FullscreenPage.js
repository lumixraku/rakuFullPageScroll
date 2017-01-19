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
	var animateObj = __webpack_require__(8);

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
	        $('body').append('<div class="overlay"></div>');
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

	    touchStart: function(event) {
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
	        console.log(scrolledTop, offsetBody);

	        that.scrollInScreen = scrolledTop === offsetBody;
	        console.log('scrollInScreen', that.scrollInScreen);

	        function getElementTop(element) {　　　　
	            var actualTop = element.offsetTop;　　　　
	            var current = element.offsetParent;　　　　
	            while (current !== null) {　　　　　　
	                actualTop += current.offsetTop;　　　　　　
	                current = current.offsetParent;　　　　
	            }　　　　
	            return actualTop;　　
	        }

	    },

	    touchMove: function(event) {
	        var that = this;
	        var item = $(event.target).closest('.item');
	        if (dragStart === null) return;
	        if (!item.length) {
	            $('.overlay').hide();
	            return;
	        }

	        if (!that.scrollInScreen) {
	            return;
	        }

	        var ev0;
	        if (event.touches) {
	            ev0 = event.touches[0];
	        }
	        //得到抓取开始时于进行中的差值的百分比
	        percentage = (dragStart - ev0.clientY) / window.screen.height; //

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
	            //向下拖动
	            console.log('move', that.scrollInScreen);
	            animateObj[opt.type].downDrag(percentage, item);
	            event.preventDefault();
	        }


	    },

	    touchEnd: function(event) {
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
	        var item = $(event.target).closest('.item');
	        if (!item.length) {
	            return;
	        }
	        that.nextSlide(item);
	        //$(event.target).css('-webkit-transform', 'translateY(-101%)');
	        //$(event.target).next().css('-webkit-transform', 'translateY(0)');
	    },

	    swipeDown: function(event) {
	        var that = this;
	        var item = $(event.target).closest('.item');
	        if (!item.length) {
	            return;
	        }
	        that.prevSlide(item);
	        //$(event.target).css('-webkit-transform', 'translateY(101%)');
	        //$(event.target).prev().css('-webkit-transform', 'translateY(0)');
	    },

	    nextSlide: function(item) {
	        var that = this;
	        //$(event.target).removeClass('parallax-item');
	        //恢复到原样，或者展示下一item
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
	        //$(event.target).removeClass('parallax-item');
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
	        if (opt.useShakeDevice && opt.useShakeDevice.speed) {
	            var x = y = z = lastX = lastY = lastZ = 0;
	            if (window.DeviceMotionEvent) {
	                window.addEventListener('devicemotion', function(eventData) {
	                    var acceleration = event.accelerationIncludingGravity;
	                    x = acceleration.x;
	                    y = acceleration.y;
	                    z = acceleration.z;
	                    if (Math.abs(x - lastX) > opt.useShakeDevicespeed || Math.abs(y - lastY) > opt.useShakeDevicespeed || Math.abs(z - lastZ) > opt.useShakeDevicespeed) {
	                        //shake
	                        if (opt.useShakeDevice.callback) {
	                            opt.useShakeDevice.callback(currentItem);
	                        }


	                    }
	                    lastX = x;
	                    lastY = y;
	                    lastZ = z;
	                }, false);
	            }
	        }
	        $('.music').on('tap', function() {
	            $(this).toggleClass('play');
	            var audio = document.getElementById('audio');
	            if (audio.paused) {
	                audio.play();
	            } else {
	                audio.pause();
	            }
	        });
	        // 绑定事件
	        $(opt.container).on('touchmove', function(e) {
	            // e.preventDefault();
	        });
	        if (opt.type > 4) {
	            opt.type = opt.type - 4;
	            this.$item.on({
	                'swipeUp': that.swipeUp.bind(that),
	                'swipeDown': that.swipeDown.bind(that)
	            });
	        } else {
	            this.$item.on({
	                'touchstart': that.touchStart.bind(that),
	                'touchmove': that.touchMove.bind(that),
	                'touchend': that.touchEnd.bind(that),
	                'touchcancel': that.touchEnd.bind(that)
	            });
	        }

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
	            //console.log($(event.target).attr('state'));
	            if ($(event.target).attr('state') == 'next') {
	                opt.pageShow(event.target);
	            } else {
	                opt.pageHide(event.target);
	            }
	            // opt.pageComplete(event.target);
	            // debugger;
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