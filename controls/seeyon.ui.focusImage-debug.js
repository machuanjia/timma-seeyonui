/**
* @author zs
*/
jQuery.fn.focusImage = function (options) {
    var _id = this.selector;
    var _animateStatc = "go";
    var _intervalTime = options.time ? options.time : 5000;
    var _action = options.action ? options.action : "click";
    var _imgNum = 3;
    var _imgNumNow = 0;
    var _imgGroupNum = 0;
    var _imgListOutWidth = $(_id + " .imgList ul li").outerWidth();
    var _imgListWidth = $(_id + " .imgList ul li").width();
    var _imgListHeight = $(_id + " .imgList ul li").height();
    var _imgBtnWidth = $(_id + " .imgBtn ul li").outerWidth();
    var _imgBtnHeight = $(_id + " .imgBtn ul li").outerHeight();

    //设置html
    function setHtml() {
        $(_id + " .imgBtn li").each(function (index) {
            $(this).html(getHtml(index, 0));
        });
        $(_id + " .imgList li").each(function (index) {
            $(this).html(getHtml(index, 1));
        });
    }

    //拼凑html        type=0:imgBtn小图显示，:imgList1大图显示
    function getHtml(n, type) {
        var _url = options.data[n + 3 * _imgGroupNum].img_url;
        var _href = options.data[n + 3 * _imgGroupNum].img_href;
        var _txt = options.data[n + 3 * _imgGroupNum].img_txt;
        var _width = "";
        var _height = "";
        var _dateWidth = options.data[n + 3 * _imgGroupNum].img_w;
        var _dateHeight = options.data[n + 3 * _imgGroupNum].img_h;

        if (type == 0) {
            if (_dateWidth / _dateHeight >= _imgBtnWidth / _imgBtnHeight) {
                _dateWidth >= _imgBtnWidth ? _width = _imgBtnWidth : null;
            } else {
                _dateHeight >= _imgBtnHeight ? _height = _imgBtnHeight : null;
            }
        }
        if (type == 1) {
            if (_dateWidth / _dateHeight >= _imgListWidth / _imgListHeight) {
                _dateWidth >= _imgListWidth ? _width = _imgListWidth : null;
            } else {
                _dateHeight >= _imgListHeight ? _height = _imgListHeight : null;
            }
        }

        var _html = "";
        type == 1 ? _html += "<a href='" + _href + "' target='_blank'>" : "";
        _html += "<img src='" + _url + "'" + (_width == "" ? "" : " width='" + _width + "'") + (_height == "" ? "" : " height='" + _height + "'") + " border='0'/>";
        type == 1 ? _html += "<a/>" : "";
        //alert(_html);
        return _html;
    }
    setHtml();

    //切换显示组
    $(_id + " .btnLeft").click(function () {
        _imgGroupNum--;
        _imgGroupNum < 0 ? _imgGroupNum = 3 : null;
        setHtml();
    });
    $(_id + " .btnRight").click(function () {
        _imgGroupNum++;
        _imgGroupNum >= 3 ? _imgGroupNum = 0 : null;
        setHtml();
    });

    //鼠标悬停，停止滚动
    $(_id + " .imgBtn li").mouseover(function () {
        _animateStatc = "stop";
    }).mouseleave(function () {
        _animateStatc = "go";
    });

    //绑定鼠标切换事件
    $(_id + " .imgBtn li").each(function (index) {
        $(this).bind(_action, function () {
            $(_id + " .imgList ul").stop(true);
            _imgNumNow = 0;
            $(_id + " .imgList ul").animate({ "left": "-" + _imgListOutWidth * index + "px" }, "fast");
            $(_id + " .imgBtn li").removeClass("imgBtn_over");
            $(_id + " .imgBtn li:eq(" + index + ")").addClass("imgBtn_over");
        });
    });

    //自动滚动效果function
    function _animate() {
        if (_animateStatc == "go") {
            _imgNumNow++;
            $(_id + " .imgList ul").animate({ "left": "-" + _imgListOutWidth * _imgNumNow + "px" }, "fast");
            $(_id + " .imgBtn li").removeClass("imgBtn_over");
            $(_id + " .imgBtn li:eq(" + _imgNumNow + ")").addClass("imgBtn_over");
            if ((_imgNumNow + 1) == _imgNum) {
                _imgNumNow = -1;
            }
        }
    }
    setInterval(_animate, _intervalTime);
};