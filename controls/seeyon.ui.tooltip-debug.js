/// <reference path="../scriptes/jquery.js" />

/**
 *
 * @author 甄帅
 */
///气泡状提示
function MxtToolTip(options) {
    this.id = options.id ? options.id : "toolTip_" + Math.floor(Math.random() * 1000000000);//生成ID
    this.width = options.width ? options.width : 200;//设置宽度
    this.event = options.event ? options.event : null;//event
    this.targetId = options.targetId ? options.targetId : null;//获取attr("tooltip")的值，定位判断
    this.openPoint = options.openPoint ? options.openPoint : [];
    this.openAuto = options.openAuto ? options.openAuto : false;
    this.direction = options.direction ? options.direction : "TL";
    this.showHtmlID = options.htmlID ? options.htmlID : null;
    this.showMsg = options.msg ? options.msg : null;
    this.targetWindow = options.targetWindow == null ? window : options.targetWindow;//跨iframe显示
    this.z_index = options.z_index == null ? 5000 : options.z_index;
    this.left = 0;
    this.top = 0;
    this.init();
}
///初始化
MxtToolTip.prototype.init = function () {
    var _this = this;
    $(".tooltip").remove();
    //输出到页面
    var _html = "";
    _html += "<div id='" + this.id + "' class='tooltip' style='display:none; position: absolute; width: " + this.width + "px;z-index:" + this.z_index + "'>";
    _html += "<div class='tooltip_border'>";
    _html += "<span><em class='tooltip_em' style=''></em></span>";
    _html += "<div class='tooltip_text'></div>";
    _html += "</div>";
    _html += "</div>";
    $(this.targetWindow.document).find('body').append(_html);
    //设置显示内容，默认优先级
    if (this.showHtmlID != null) {
        $("#" + this.showHtmlID).wrap("<div id='" + this.id + "_area'></div>");
        $(this.targetWindow.document).find("#" + this.id + " .tooltip_text").append($("#" + this.showHtmlID).clone(true));
        $("#" + this.id + "_area").empty();
    } else if (this.showMsg != null) {
        $(this.targetWindow.document).find("#" + this.id + " .tooltip_text").html(this.showMsg);
    } else {
        $(this.targetWindow.document).find("#" + this.id + " .tooltip_text").html($("#" + this.targetId).attr("tooltip"));
    }
    this.setPoint(this.left, this.top);
    if (this.openAuto == true) {
        this.show();
    }
    var _this = this;
    //绑定关闭class
    $(this.targetWindow.document).find("#" + this.id + " .tooltip_close").click(function () {
      _this.hide();
    });
}
///判断position和setDirection
MxtToolTip.prototype.getPD = function () {
    var _X;
    var _Y;
    var _ttWidth = $(this.targetWindow.document).find("#" + this.id).width();
    var _ttHeight = $(this.targetWindow.document).find("#" + this.id).height();
    var _winWidth = $(this.targetWindow).width();
    var _winHeight = $(this.targetWindow).height();
    if (this.event) {
        //根据鼠标判断position
        _X = $("#" + this.targetId).offset().left;
        _Y = $("#" + this.targetId).offset().top + $("#" + this.targetId).height();
    } else {
        //根据openPoint判断position
        _X = this.openPoint[0];
        _Y = this.openPoint[1];
    }
    //尾巴在上下和左右，区分判断
    if ((this.direction.substr(0, 1) == "T") || (this.direction.substr(0, 1) == "B")) {
        if (_X + _ttWidth > _winWidth) {
            this.direction = this.direction.substr(0, 1) + "R";
            this.left = _X - _ttWidth;
        } else {
            this.left = _X;
        }
        if (_Y + _ttHeight > _winHeight - 5) {
            this.direction = "B" + this.direction.substr(1);
            this.top = _Y - _ttHeight;
        } else {
            this.top = _Y + 5;
        }
    } else {
        if (_X + _ttWidth > _winWidth ) {
            this.direction = "R" + this.direction.substr(1);
            this.left = _X - _ttWidth ;
        } else {
            this.left = _X;
        }
        if (_Y + _ttHeight > _winHeight) {
            this.direction = this.direction.substr(0, 1) + "B";
            this.top = _Y - _ttHeight;
        } else {
            this.top = _Y;
        }
    }
    this.setDirection(this.direction);
}
///设置position
MxtToolTip.prototype.setPoint = function (l, t) {
    this.left = l;
    this.top = t;
    this.getPD();
    $(this.targetWindow.document).find("#" + this.id).css({
        left: this.left + "px",
        top: this.top + "px"
    });
}
///设置‘尾巴’位置
MxtToolTip.prototype.setDirection = function (d) {
    var tooltip_em = $(this.targetWindow.document).find("#" + this.id + " .tooltip_em");
    //判断箭头
    var _background_position = "";
    switch (d) {
        case "TL":
            _background_position = "0 -166px";
            tooltip_em.css({ left: "", top: "-5px", right: "", bottom: "" });
            break;
        case "TR":
            _background_position = "0 -166px";
            tooltip_em.css({ left: "", top: "-5px", right: "10px", bottom: "" });
            break;
        case "BL":
            _background_position = "0 -160px";
            tooltip_em.css({ left: "", top: "", right: "", bottom: "-5px" });
            break;
        case "BR":
            _background_position = "0 -160px";
            tooltip_em.css({ left: "", top: "", right: "10px", bottom: "-5px" });
            break;
        case "LT":
            _background_position = "-22px -160px";
            tooltip_em.css({ left: "-5px", top: "", right: "", bottom: "", width: "6px", height: "11px" });
            break;
        case "LB":
            _background_position = "-22px -160px";
            tooltip_em.css({ left: "-5px", top: "", right: "", bottom: "10px", width: "6px", height: "11px" });
            break;
        case "RT":
            _background_position = "-16px -160px";
            tooltip_em.css({ left: "", top: "", right: "-5px", bottom: "", width: "6px", height: "11px" });
            break;
        case "RB":
            _background_position = "-16px -160px";
            tooltip_em.css({ left: "", top: "", right: "-5px", bottom: "10px", width: "6px", height: "11px" });
            break;
    }
    tooltip_em.css({ "background-position": _background_position });
}
///设置显示内容
MxtToolTip.prototype.setHtml = function (json) {
    if (json.id) {
        //showHtmlID还原位置
        if (this.showHtmlID != null) {
            $(this.targetWindow.document).find("#" + this.showHtmlID).clone(true).appendTo("#" + this.id + "_area");
            $("#" + this.showHtmlID).unwrap();
        }
        this.showHtmlID = json.id;
        $("#" + this.showHtmlID).wrap("<div id='" + this.showHtmlID + "_area'></div>");
        $(this.targetWindow.document).find("#" + this.id + " .tooltip_text").empty().append($("#" + this.showHtmlID).clone(true));
        $("#" + this.showHtmlID + "_area").empty();
    }
    if (json.text) {
        $(this.targetWindow.document).find("#" + this.id + " .tooltip_text").html(json.text);
    }
}
///关闭
MxtToolTip.prototype.close = function () {
    $(this.targetWindow.document).find("#" + this.showHtmlID).clone(true).appendTo("#" + this.id + "_area");
    $("#" + this.showHtmlID).unwrap();
    $(this.targetWindow.document).find("#" + this.id).remove();
}
///显示
MxtToolTip.prototype.show = function () {
    $(this.targetWindow.document).find("#" + this.id).show();
}
///显示
MxtToolTip.prototype.hide = function () {
    $(this.targetWindow.document).find("#" + this.id).hide();
}



//小提示
function MxtTip(options) {
    //参数
    this.settings = {
        id: "MxtTip" + Math.floor(Math.random() * 100000000),
        targetId: null,
        top: 0,
        left: 0,
        keepTime: 2000,
        autoShow: true,
        autoClose: true,
        offsetTop: 0,
        offsetLeft: 0,
        checkPosition: true,
        color: "#463900",
        background: "#FDF0A4",
        content: "需要你给我指定内容,亲~",
        beforeShowCallBack: function () { },//显示前,回调函数
        callBack: function () { }//关闭后,回调函数
    };
    $.extend(this.settings, options);

    //初始化
    this.init();
}

MxtTip.prototype.init = function () {
    var _this = this;

    //生成html
    var _html = "";
    _html += "<div id='" + _this.settings.id + "' class='MxtTip' style='display:none;position:absolute;z-index:10000;left:0;top:0; background:" + _this.settings.background + ";color:" + _this.settings.color + ";'><div class='MxtTip_content' style='padding: 5px 10px;font-size:12px;'>" + _this.settings.content + "<em class='close ico16 close_16' style='display:none;'></em></div></div>";
    $("body").append(_html);
    _this.myObj = $("#" + _this.settings.id);

    //定位计算
    if (_this.settings.targetId) {
        var _myWidth = _this.myObj.width();
        var _targetIdObj = $("#" + _this.settings.targetId);
        var _targetIdWidth = _targetIdObj.width();
        var _top, _left;
        _top = _targetIdObj.offset().top;
        _left = _targetIdObj.offset().left * 1 + (_targetIdWidth - _myWidth) / 2;
        _this.setPosition({ top: _top, left: _left });
    }
    else if (_this.settings.top && _this.settings.left) {
        _this.setPosition({ top: _this.settings.top, left: _this.settings.left });
    }

    //鼠标事件
    this.mouserHander();

    //自动显示
    if (_this.settings.autoShow) {
        _this.show();
    }
};
//定位
MxtTip.prototype.setPosition = function (j) {
    var _this = this;
    var _top = j.top * 1 + _this.settings.offsetTop;
    var _left = j.left * 1 + _this.settings.offsetLeft
    if (_this.settings.checkPosition) {
        _top = _top >= 0 ? _top : 0;
        _left = _left >= 0 ? _left : 0;
    }
    _this.myObj.css({ top: _top + "px", left: _left + "px" });
}
//
MxtTip.prototype.mouserHander = function () {
    // var _this =  this;
    // _this.myObj.mouseenter(function() {
    //     if (_this.showClose == true) {
    //         $(this).find(".close").show();
    //     };
    //     _this.settings.autoClose = false;
    // }).find(".close").click(function(){
    //     _this.close();
    // });
}
//显示
MxtTip.prototype.show = function () {
    var _this = this;
    _this.settings.beforeShowCallBack();
    //定时器
    _this.myObj.fadeIn("fast");
    setTimeout(function () {
        // if (_this.settings.autoClose) {
            _this.close();
        // };
    }, _this.settings.keepTime);
};
//隐藏
MxtTip.prototype.close = function () {
    var _this = this;
    _this.myObj.fadeOut("fast", function () {
        _this.myObj.remove();
        _this.settings.callBack();
    });
};