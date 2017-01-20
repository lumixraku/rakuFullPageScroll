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
