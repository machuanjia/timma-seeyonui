/**
 * 知识中心
 */
$.fn.pagemenu = function (options) {
    var _id = Math.floor(Math.random() * 100000000).toString() + "_menu";
    var _selector = $(this).selector;
    var _data = options.data;
    var _allNumber = options.all_number;
    var _max = options.max ? options.max : 20;
    var _max_item = options.max_item ? options.max_item : 20;
    var _itemHeight = options.item_height ? options.item_height : 26;
    var _handler = options.handler;
    var _isIE6 = function () {
        if ($.browser.msie) {
            if ($.browser.version < 7) {
                return true;
            }
        }
        return false;
    }();
    var _isShowItemMore = false;
    //*********拼html到页面********
    var _htmlA = "";
    var _htmlB = "";
    var _htmlB_2 = "";
    _htmlA += "<div class=\"pagemenu_all\"><div>"+$.i18n('doc.jsp.knowledge.all')+"(" + _allNumber + ")</div></div>";
    _htmlA += "<ul class=\"pagemenu\">";
    for (var i = 0; i < _data[0].length; i++) {
        var _a = _data[0][i];
        var _b = _data[1]["ONE_" + _data[0][i].id];
        _htmlA += "<li id=\"menu_" + i + "\" class=\"item" + (i > _max - 1 ? " hidden" : "") + "\" fid=\"" + _a.id + "\"><span class=\"txt\">" + _a.frName + "</span><span class=\"" + (_b != "" && _b ? "" : "hidden") + "\"><em class=\"ico16 arrow_gray_r\"></em></span></li>";
        //二级菜单html
        //如果有二级
        if (_b != "" && _b) {
            _htmlB += "<div id=\"menu_" + i + "_item\" class=\"pagemenu_item\">";
            _htmlB += "<ul>";
            _htmlB_2 = "";
            for (var j = 0; j < _b.length; j++) {
                j == 0 ? _htmlB += "<li class=\"line\">" : null;
                if (j % 2 == 0) {
                    _htmlB += "<div class=\"" + (j < _max_item - 1 ? "" : "hidden") + "\" fid=\"" + _b[j].id + "\">" + _b[j].frName + "</div>";

                }
                j == _b.length - 1 ? _htmlB += "</li>" : null;
                //_htmlB_2用于暂时存放第2个li里面的内容
                j == 0 ? _htmlB_2 += "<li>" : null;
                if (j % 2 == 1) {
                    _htmlB_2 += "<div class=\"" + (j < _max_item ? "" : "hidden") + "\" fid=\"" + _b[j].id + "\">" + _b[j].frName + "</div>";
                }
                j == _b.length - 1 ? _htmlB_2 += "</li>" : null;
            }
            _htmlB += _htmlB_2;
            _htmlB += "</ul>";
            _b.length > _max_item ? _htmlB += "<div class=\"pagemenu_item_more\">"+$.i18n('doc.jsp.knowledge.view')+$.i18n('doc.jsp.knowledge.more')+"</div>" : null;
            _htmlB += "</div>";
        }
    }
    _htmlA += "</ul>";
    _data[0].length > _max ? _htmlA += "<div class=\"pagemenu_more\">"+$.i18n('doc.jsp.knowledge.view')+$.i18n('doc.jsp.knowledge.more')+$.i18n('doc.jsp.knowledge.category')+"</div>" : null;
    $(_selector).html(_htmlA);
    $("body").append(_htmlB);

    //*********出现滚动条判断 宽度********
    /// 判断超出,减少 宽度
    function resizeScroll() {
        var _menu_li = $(_selector).find(".pagemenu li");
        var _menu_txt = $(_selector).find(".pagemenu li .txt");
        if ($(_selector).height() > $(window).height() - 56) {
            if (_isIE6) {
                _menu_txt.width(76);
                _menu_li.width(110);
            } else {
                _menu_txt.width(79);
                _menu_li.width(110);
            }
        } else {
            if (_isIE6) {
                _menu_txt.width(93);
                _menu_li.width(127);
            } else {
                _menu_txt.width(96);
                _menu_li.width(127);
            }
        }
    }
    resizeScroll();
    $(window).resize(function () {
        resizeScroll();
    });
    //*********隐藏显示 绑定事件********
    var _isLeave = true;
    $(_selector + " li").each(function (index) {
        var _li = $(this);
        var _item = $("#" + $(_li).attr("id") + "_item");
        //一级
        $(this).mouseenter(function () {
            _li.removeClass("current");
            _li.addClass("current");
            _li.find(".ico16").removeClass("arrow_gray_r").removeClass("arrow_white_r").addClass("arrow_white_r");
            var _top = _li.offset().top;
            var _left = _li.offset().left + _li.width();
            //判断二级超出游览器,向下对其显示
            if (_li.offset().top + _item.height() > $(window).height()) {
                _top = _li.offset().top + _li.height() - _item.height() - 4;
            }
            _item.css({ left: _left + "px", top: _top + "px" }).show();
        }).mouseleave(function () {
            setTimeout(function () {
                if (_isLeave) {
                    _li.removeClass("current");
                    _li.find(".ico16").removeClass("arrow_gray_r").removeClass("arrow_white_r").addClass("arrow_gray_r");
                    _item.hide();
                }
            }, 50);
        }).click(function () {
            _handler({ id: $(this).attr("fid"), frName: $(this).find(".txt").text() });
        });
        //二级
        $(_selector + "_" + index + "_item").mouseenter(function () {
            _isLeave = false;
        }).mouseleave(function () {
            _isLeave = true;
            $(this).hide();
            $(_selector + " li").removeClass("current");
            $(this).find("ul div.hidden").hide();
            $(this).find("ul").removeClass("scrollY");
            $(this).find("ul").height("");
            $(this).find(".pagemenu_item_more").text($.i18n('doc.jsp.knowledge.more')+$.i18n('doc.jsp.knowledge.category'));
            $(_selector + "_" + index).find(".ico16").removeClass("arrow_gray_r").removeClass("arrow_white_r").addClass("arrow_gray_r");
        });
        $(_selector + "_" + index + "_item li div").mouseenter(function () {
            $(this).removeClass("current");
            $(this).addClass("current");
        }).mouseleave(function () {
            $(this).removeClass("current");
        }).click(function () {
            _handler({ id: $(this).attr("fid"), frName: $(this).text() });
        });
    });

    //*********伸缩按钮********
    //一级栏目
    $(".pagemenu_more").click(function () {
        if ($(this).data("t")) {
            $(this).data("t", false);
            $(_selector + " .pagemenu li[class='item hidden']").hide();
            $(this).text($.i18n('doc.jsp.knowledge.view')+$.i18n('doc.jsp.knowledge.more')+$.i18n('doc.jsp.knowledge.category'));
            resizeScroll();
        } else {
            $(this).data("t", true);
            $(_selector + " .pagemenu li").show();
            $(this).text($.i18n('doc.jsp.knowledge.less')+$.i18n('doc.jsp.knowledge.category'));
            resizeScroll();
        }
    });
    //二级栏目
    $(".pagemenu_item_more").click(function () {
        if (!_isShowItemMore) {
            _isShowItemMore = true;
            $(this).parent(".pagemenu_item").find("ul").addClass("scrollY");
            $(this).parent(".pagemenu_item").find("ul").height(_itemHeight * _max_item / 2);
            $(this).parent(".pagemenu_item").find("ul div").show();
            $(this).text($.i18n('doc.jsp.knowledge.view')+$.i18n('doc.jsp.knowledge.less'));
        } else {
            _isShowItemMore = false;
            $(this).parent(".pagemenu_item").find("ul").removeClass("scrollY");
            $(this).parent(".pagemenu_item").find("ul").height("");
            $(this).parent(".pagemenu_item").find("ul div.hidden").hide();
            $(this).text($.i18n('doc.jsp.knowledge.view')+$.i18n('doc.jsp.knowledge.more'));
        }
    });
    return this;
}