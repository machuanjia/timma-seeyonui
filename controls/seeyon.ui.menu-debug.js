/// <reference path="../scriptes/jquery.js" />
/**
 * @author macj
 * js生成thml然后初始化菜单
 */
/**
<ul class="sf-menu">
    <li class="current">
        <a href="#a">menu item</a>
        <ul>
            <li>
                <a href="#aa">menu item that is quite long</a>
            </li>
            <li class="current">
                <a href="#ab">menu item</a>
                <ul>
                    <li class="current">
                        <a href="#">menu item</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#">menu item</a>
                <ul>
                    <li>
                        <a href="#">menu item</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#">menu item</a>
                <ul>
                    <li>
                        <a href="#">menu item</a>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
</ul>
 * 
 */
function MxtMenuBar(options) {
    this.allMenus = [];//存储所有的菜单
    this.menuStrBuffer = [];//存储html
    this.maxMenu = options.maxMenu = null ? 4 : options.maxMenu;//最多显示的菜单个数，超过的放入"更多"中
    this.render = options.render;
}
MxtMenuBar.prototype.add = function (menu) {
    this.allMenus[this.allMenus.length] = menu;
}
MxtMenuBar.prototype.show = function (menu) {
    if (this.allMenus.length > 0) {
        this.menuStrBuffer = [];
        this.menuStrBuffer.push("<div class='common_menu_box clearfix'>");
        this.menuStrBuffer.push("<ul class='common_menu'>");
        //最多显示的菜单个数
        this.maxMenu = this.allMenus.length > this.maxMenu ? this.maxMenu : this.allMenus.length;
        for (var i = 0; i < this.maxMenu; i++) {
            var menu = this.allMenus[i];
            if (menu && menu.isShow && menu.isShowForSecurity) {
                menu.toString(this.menuStrBuffer);
            }
        }
        if (this.allMenus.length > this.maxMenu) {
            this.getMoreMenu(this.menuStrBuffer);
        }
        this.menuStrBuffer.push("</ul>");
        this.menuStrBuffer.push("</div>");
    }
    if (this.render == undefined) {
        document.write(this.menuStrBuffer.join(''));
    } else {
        $('#' + this.render).append(this.menuStrBuffer.join(''));
    }
    this.menuStrBuffer = [];
    $('ul.common_menu').superfish();
}
//MxtMenuBar.prototype.disabled = function(menu){

//	if(menu){
//		menu.className="common_menu_dis";

//var id_a = menu.id+'_a';
//var str = "";
//str+="<div style='cursor:default;  position: relative;padding: 0.5em 1em;' style='background:transparent' id='"+menu.id+"_a' >";
//str+="<em id='"+menu.id+"_em' style='opacity: 0.2;-moz-opacity: 0.2;-khtml-opacity: 0.2;opacity: 0.2;' class='"+menu.className+"'></em>";
//str+="<span id='"+menu.id+"_span' class='menu_span' style='color:#ccc'>"+menu.name + "</span>";
//str+="</div>";
//$('#'+menu.id).mouseover(function(){
//	$(this).css({
//		'background':'transparent'
//	});
//});
//$('#'+id_a).replaceWith(str);
//	}
//}
MxtMenuBar.prototype.enabled = function (menu) {
    if (menu) {
        var id_a = menu.id + '_a';
        var str = "";
        str += "<a href='javascript:void(0);'  id='" + menu.id + "_a' onclick='" + menu.click + "' >";
        str += "<em id='" + menu.id + "_em' class='" + menu.className + "'></em>";
        str += "<span id='" + menu.id + "_span' class='menu_span'>" + menu.name + "</span>";
        str += "</a>";
        $('#' + id_a).replaceWith(str);
    }
}
MxtMenuBar.prototype.getMoreMenu = function (menuStrBuffer) {
    menuStrBuffer.push("<li>");
    menuStrBuffer.push("<a href='javascript:void(0);'>");
    menuStrBuffer.push("<span class='menu_span'>&nbsp;</span>");
    menuStrBuffer.push("</a>");
    menuStrBuffer.push("<ul>");

    for (var i = this.maxMenu; i < this.allMenus.length; i++) {
        var menu = this.allMenus[i];
        if (menu && menu.isShow && menu.isShowForSecurity) {
            menu.toString(this.menuStrBuffer);
        }
    }


    menuStrBuffer.push("</ul>");
    menuStrBuffer.push("</li>");
}
function MxtMenu(options) {
    this.id = options.id + "";
    this.name = options.name;
    this.isShow = options.isShow == null ? true : options.isShow;
    this.isShowForSecurity = true;//自定义菜单：如果子菜单都不显示，此菜单也不显示
    this.childItems = [];
    this.className = options.className;
    this.click = options.click;
    this.disable = options.disable;
}
/**
 * 一级菜单toHTML解析----------------more菜单
 */
MxtMenu.prototype.toString = function (menuStrBuffer) {
    var nameStr = this.name;
    var menuClassName = this.disable ? 'common_menu_dis' : '';
    menuStrBuffer.push("<li id='" + this.id + "' class='" + menuClassName + "'>");
    menuStrBuffer.push("<a href='javascript:void(0);'  id='" + this.id + "_a' ");
    if (this.click != null) {
        menuStrBuffer.push("onclick = \"" + this.click + "\"");
    }
    menuStrBuffer.push(" >");
    if (this.className != null) {
        menuStrBuffer.push("<em id='" + this.id + "_em' class='" + this.className + "'></em>");
    }
    menuStrBuffer.push("<span id='" + this.id + "_span' class='menu_span'>" + nameStr + "</span></a>");
    if (this.childItems.length > 0) {
        menuStrBuffer.push("<ul>");
        for (var i = 0; i < this.childItems.length; i++) {
            var menuItem = this.childItems[i];
            if (menuItem && menuItem.isShow) {
                menuItem.toString(menuStrBuffer);
            }
        }
        menuStrBuffer.push("</ul>");
    }
    menuStrBuffer.push("</li>");
    return menuStrBuffer;
}

/**向菜单中插入item**/
MxtMenu.prototype.add = function (menuItem) {
    this.childItems[this.childItems.length] = menuItem;
    menuItem.parentMenu = this;
    menuItem.index = this.childItems.length - 1;
    //如果子菜单中有显示的二级子菜单则一级菜单显示
    if (menuItem.isShow) {
        this.isShowForSecurity = true;
    }
}
/**
 * 二级菜单项定义
 */
function MxtMenuItem(options) {
    //id, name, action, target, icon, description, isShow
    this.id = options.uId + "";
    this.name = options.name;
    this.action = options.action;
    this.target = options.target;
    this.icon = options.icon;
    this.description = options.description;
    this.parentMenu = null;
    this.subMenu = null;
    this.isShow = options.isShow == null ? true : options.isShow;
    this.disable = options.disable;
}
/**
 * 二级下拉菜单toHTML解析
 */
MxtMenuItem.prototype.toString = function (menuStrBuffer) {
    var nameT = this.name;
    var menuClassName = this.disable ? 'common_menu_dis' : '';
    menuStrBuffer.push("<li class='" + menuClassName + "'>");
    //action为方法
    //menuStrBuffer.push("<a href='javascript:void(0);' onclick='"+this.action+"();'>");
    //action为url
    if (this.action == null) {
        this.action = "javascript:void(0);";
    }
    menuStrBuffer.push("<a href='" + this.action + "'>");
    menuStrBuffer.push(this.name);
    menuStrBuffer.push("</a>");
    if (this.subMenu != null) {
        menuStrBuffer.push("<ul>");
        this.subMenu.toString(menuStrBuffer);
        menuStrBuffer.push("</ul>");
    }
    menuStrBuffer.push("</li>");
    return menuStrBuffer;
}
MxtMenuItem.prototype.add = function (subMenu) {
    subMenu.parentMenu = this;
    this.subMenu = subMenu;

}

/**
 * 子菜单
 * id:唯一 name isShow step:2或3 是二级菜单还是三级菜单
 * */
function MxtSubMenu(options) {
    //id, name, isShow
    this.id = options.id;
    this.name = options.name;
    this.isShow = options.isShow == null ? true : options.isShow;
    this.subChildItems = [];
    this.parentMenu = null;
}
/**
 * 添加item
 * */
MxtSubMenu.prototype.add = function (subMenuItem) {
    this.subChildItems[this.subChildItems.length] = subMenuItem;
    subMenuItem.parentMenu = this;
}
/**
 * toString
 * */
MxtSubMenu.prototype.toString = function (menuStrBuffer) {
    if (this.isShow) {
        if (this.subChildItems.length > 0) {
            for (var i = 0; i < this.subChildItems.length; i++) {
                var subItem = this.subChildItems[i];
                subItem.toString(menuStrBuffer);
            }
        }
    }
    return menuStrBuffer;
}
/**
 * subitem
 * */
function MxtSubMenuItem(options) {
    //uId, name, action, target, icon, description, isShow
    this.id = 0;
    this.uId = options.uId + '';
    this.name = options.name;
    this.action = options.action;
    this.target = options.target;
    this.icon = options.icon;
    this.description = options.description;
    this.parentMenu = null;
    this.isShow = options.isShow == null ? true : options.isShow;
    this.index = null;
    this.disable = options.disable;
}
MxtSubMenuItem.prototype.toString = function (menuStrBuffer) {
    if (this.isShow) {
        var menuClassName = this.disable ? 'common_menu_dis' : '';
        menuStrBuffer.push("<li class='" + menuClassName + "'>");
        if (this.action == null) {
            this.action = "javascript:void(0);";
        }
        menuStrBuffer.push("<a href='" + this.action + "'>");
        menuStrBuffer.push(this.name);
        menuStrBuffer.push("</a>");
        menuStrBuffer.push("</li>");
    }
    return menuStrBuffer;
}
/*
 * Superfish v1.4.8 - jQuery menu widget
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 * CHANGELOG: http://users.tpg.com.au/j_birch/plugins/superfish/changelog.txt
 */

; (function ($) {
    $.fn.superfish = function (op) {

        var sf = $.fn.superfish,
			c = sf.c,
			$arrow = $(['<span class="', c.arrowClass, '"> &#187;</span>'].join('')),
			over = function () {
			    var $$ = $(this), menu = getMenu($$);
			    clearTimeout(menu.sfTimer);

			    if (!$$.hasClass("common_menu_dis")) {
			        $$.showSuperfishUl().siblings().hideSuperfishUl()
			    };
			},
			out = function () {
			    var $$ = $(this), menu = getMenu($$), o = sf.op;
			    clearTimeout(menu.sfTimer);
			    menu.sfTimer = setTimeout(function () {
			        o.retainPath = ($.inArray($$[0], o.$path) > -1);
			        $$.hideSuperfishUl();
			        if (o.$path.length && $$.parents(['li.', o.hoverClass].join('')).length < 1) { over.call(o.$path); }
			    }, o.delay);
			},
			getMenu = function ($menu) {
			    var menu = $menu.parents(['ul.', c.menuClass, ':first'].join(''))[0];
			    sf.op = sf.o[menu.serial];
			    return menu;
			},
			addArrow = function ($a) { $a.addClass(c.anchorClass).append($arrow.clone()); };

        return this.each(function () {
            var s = this.serial = sf.o.length;
            var o = $.extend({}, sf.defaults, op);
            o.$path = $('li.' + o.pathClass, this).slice(0, o.pathLevels).each(function () {
                $(this).addClass([o.hoverClass, c.bcClass].join(' '))
					.filter('li:has(ul)').removeClass(o.pathClass);
            });
            sf.o[s] = sf.op = o;

            $('li:has(ul)', this)[($.fn.hoverIntent && !o.disableHI) ? 'hoverIntent' : 'hover'](over, out).each(function () {
                if (o.autoArrows) addArrow($('>a:first-child', this));
            })
			.not('.' + c.bcClass)
				.hideSuperfishUl();

            var $a = $('a', this);
            $a.each(function (i) {
                var $li = $a.eq(i).parents('li');
                $a.eq(i).focus(function () { over.call($li); }).blur(function () { out.call($li); });
            });
            o.onInit.call(this);

        }).each(function () {
            var menuClasses = [c.menuClass];
            if (sf.op.dropShadows && !($.browser.msie && $.browser.version < 7)) menuClasses.push(c.shadowClass);
            $(this).addClass(menuClasses.join(' '));
        });
    };

    var sf = $.fn.superfish;
    sf.o = [];
    sf.op = {};
    sf.IE7fix = function () {
        var o = sf.op;
        if ($.browser.msie && $.browser.version > 6 && o.dropShadows && o.animation.opacity != undefined)
            this.toggleClass(sf.c.shadowClass + '-off');
    };
    sf.c = {
        bcClass: 'common_menu_breadcrumb',
        menuClass: 'common_menu_js-enabled',
        anchorClass: 'common_menu_with-ul',
        arrowClass: 'common_menu_sub-indicator',
        shadowClass: 'common_menu_shadow'
    };
    sf.defaults = {
        hoverClass: 'sfHover',
        pathClass: 'overideThisToUse',
        pathLevels: 1,
        delay: 800,
        animation: { opacity: 'show' },
        speed: 'normal',
        autoArrows: true,
        dropShadows: true,
        disableHI: false,		// true disables hoverIntent detection
        onInit: function () { }, // callback functions
        onBeforeShow: function () { },
        onShow: function () { },
        onHide: function () { }
    };
    $.fn.extend({
        hideSuperfishUl: function () {
            var o = sf.op,
				not = (o.retainPath === true) ? o.$path : '';
            o.retainPath = false;
            var $ul = $(['li.', o.hoverClass].join(''), this).add(this).not(not).removeClass(o.hoverClass)
					.find('>ul').hide().css('visibility', 'hidden');
            o.onHide.call($ul);
            return this;
        },
        showSuperfishUl: function () {
            var o = sf.op,
				sh = sf.c.shadowClass + '-off',
				$ul = this.addClass(o.hoverClass)
					.find('>ul:hidden').css('visibility', 'visible');

            sf.IE7fix.call($ul);
            o.onBeforeShow.call($ul);
            $ul.animate(o.animation, o.speed, function () { sf.IE7fix.call($ul); o.onShow.call($ul); });
            return this;
        }
    });

})(jQuery);
/**
 * @author zhens
 * 简易菜单
 */
function commonMenuSimple(options, _selector) {
    var _id = options.id ? options.id : "menuSimple_" + Math.floor(Math.random() * 1000000000);
    var _data = options.data ? options.data : [];//数据
    var _width = options.width ? options.width : 150;//设置宽度
    var _height = options.height ? options.height : "";//设置高度，自动出滚动条
    var _maxHeight = options.maxHeight ? options.maxHeight : "";//设置最大高度，自动出滚动条
    var _event = options.event ? options.event : "click";//触发事件
    var _direction = options.direction ? options.direction : "BL";//定位
    var _offsetLeft = options.offsetLeft ? options.offsetLeft : 0;//左偏移量
    var _offsetTop = options.offsetTop ? options.offsetTop : 0;//上偏移量
    var _mRow = options.mRow ? options.mRow : false;//每个选项的内容是否多行显示
    //判断如果已经绑定过,删除原来的
    if (_selector == null) {
        var _dataID = $("body").data("isMenuSimple");
        if (_dataID != _id) {
            $("#" + _dataID).remove();
            $("#" + _dataID + "_iframe_mask").remove();
            $("body").data("isMenuSimple", _id);
        }
    } else {
        var _dataID = $(_selector).data("isMenuSimple");
        if (_dataID != _id) {
            $("#" + _dataID).remove();
            $("#" + _dataID + "_iframe_mask").remove();
            $(_selector).data("isMenuSimple", _id);
        }
    }
    if ($("#" + _id).size() != 0) {
        $("#" + _id).remove();
        $("#" + _id + "_iframe_mask").remove();
    }
    var _html = "";
    if (_selector == null) {
        var _left = options.left ? options.left : alert("ERROR:$.menuSimple缺少必须参数left");
        var _top = options.top ? options.top : alert("ERROR:$.menuSimple缺少必须参数top");
    } else {
		if($(_selector).size()>0){
	        var _left = function () {
	            switch (_direction) {
	                case "BL":
	                    return $(_selector).offset().left + _offsetLeft;
	                    break;
	                case "BR":
	                    return $(_selector).offset().left + $(_selector).width() - _width - 12 + _offsetLeft;
	                    break;
	            }
	        }();
	        var _top = function () {
	            return $(_selector).offset().top + $(_selector).height() + 5 + _offsetTop;
	        }();
		}
    }
    var _heightHTML = "";
    if (_height!="") {
        _heightHTML = "height:" + _height + "px;overflow-y:auto;";
    }
    if (_maxHeight!="") {
        _heightHTML = "max-height:" + _maxHeight + "px;overflow-y:auto;";
    }
    _html += "<div id=\"" + _id + "\" class=\"menu_simple_box\" style=\"z-index:20001;left:" + _left + "px;top:" + _top + "px;" + _heightHTML + "\"><div class=\"menu_simple\">";
    var _mRowHtml = "";
    _mRow != true ? _mRowHtml = " text_overflow" : null;
    for (var i = 0; i < _data.length; i++) {
		if(_data[i].isShow == false){
			continue;
		}
        if (_data[i].type == "line") {
            _html += "<div class=\"line\"></div>";
        } else {
            _data[i].id != null ? "" : _data[i].id = "menuSimple_item" + Math.floor(Math.random() * 1000000000);
            var _iconHtml = "";//图标
            _data[i].className != null ? _iconHtml = "<span class='ico16 margin_r_5 " + _data[i].className + "'></span>" : null;
            var _customAttrHtml = "";//自定义属性
            _data[i].customAttr != null ? _customAttrHtml = _data[i].customAttr : null;
            var _disabledHtml = "";//禁用
            _data[i].disabled == true ? _disabledHtml = "disabled" : null;
            var _title = "";//title
            _name = $("<div>" + _data[i].name + "</div>").text();
            //HTML
            _html += "<a id=\"" + _data[i].id + "\" title='" + _title + "'" + _customAttrHtml + " class='" + _disabledHtml + " " + _mRowHtml + "'>" + _iconHtml + _data[i].name + "</a>";
        }
    }
    _html += "</div></div>";
    _html += "<iframe id=\"" + _id + "_iframe_mask\" frameborder=\"0\"></iframe>";
    $("body").append(_html);
    $("#" + _id + "_iframe_mask").css({
        display: "none",
        "z-index": 20000,
        position: "absolute",
        top: _top+"px",
        left: _left + "px",
        width: $("#"+_id).width() + "px",
        height: $("#" + _id).height() + "px"
    });
    if (_selector == null) {
        $("#" + _id).show();
        $("#" + _id + "_iframe_mask").show();
    }
    if (_width != 150) {
        $("#" + _id).find("a").width(_width);
        $("#" + _id).find(".line").width(_width + 10);
    }
    $("#" + _id + " .menu_simple").children().each(function (i) {
        if (_data[i].type != "line" && _data[i].handle) {
            $(this).click(function () {
                if (_data[i].disabled != true) {
                    _data[i].handle({ id: _data[i].id, name: _data[i].name, obj: $(this) });
                }
            });
        }
    });
    $(_selector).unbind().bind(_event, function () {
        setTimeout(function () {
            if ($(_selector).attr("disable") != "disable") {
                var _left = function () {
                    switch (_direction) {
                        case "BL":
                            return $(_selector).offset().left + _offsetLeft;
                            break;
                        case "BR":
                            return $(_selector).offset().left + $(_selector).width() - _width - 12 + _offsetLeft;
                            break;
                    }
                }();
                var _top = function () {
                    return $(_selector).offset().top + $(_selector).height() + 5 + _offsetTop;
                }();
                $("#" + _id).css({ left: _left + "px", top: _top + "px" });
                $("#" + _id).show();
                $("#" + _id + "_iframe_mask").css({ width: (_width * 1 + 16) + "px", top: _top + "px", left: _left + "px" });
                $("#" + _id + "_iframe_mask").show();
            }
        }, 100);
    });
    var _leave = true;
    $(_selector).mouseleave(function () {
        setTimeout(function () {
            if (_leave) {
                if (_height!="") {
                    $("#" + _id).scrollTop(0);
                }
                $("#" + _id).hide();
                $("#" + _id + "_iframe_mask").hide();
            }
        }, 100);
    });
    $("#" + _id).click(function () {
        if (_height != "") {
            $("#" + _id).scrollTop(0);
        }
        $(this).hide();
        $("#" + _id + "_iframe_mask").hide();
    }).mouseleave(function () {
        if (_height != "") {
            $("#" + _id).scrollTop(0);
        }
        $(this).hide();
        $("#" + _id + "_iframe_mask").hide();
        _leave = true;
    }).mouseenter(function () {
        _leave = false;
    });
}
$.fn.menuSimple = function (options) { commonMenuSimple(options, $(this).selector) };
$.menuSimple = function (options) { commonMenuSimple(options, null); };