/**
 *
 * @author xiexp
 */
//输入框文字改变div
/*obj:jquery对象div*/
/*color:输入框默认提示文字div*/
/*color:输入框默认颜色div*/
function inputChange(obj,text,color){
    this.obj=obj;
    this.color=color;
    //判断非空的时候，不添加
    if (obj.val() == "") {
        if(!(this.color)) {
            this.color="color_gray"
        };
    };  
    this.text=text;
    if(!(this.text)){
        this.text="请输入内容";
    }
    this.change();  
}
//change:修改值
inputChange.prototype.change=function(){
	with(this){
		check();
		obj.focus(function(){  //获取焦点div
			if(obj.hasClass(color)){				
				obj.removeClass(color).val("");
			}
		});
		obj.blur(function(){ //失去焦点div
			if(obj.val() == ""){							
			  obj.addClass(color).val(text);	
			}
		});	
	}
	
}
//check:检查是否去掉color
inputChange.prototype.check=function(){
	with(this){
		if(obj.val()==""||obj.val()==text) {obj.addClass(color).val(text);}	
		else{obj.removeClass(color);}	
	}
}
//老的搜索框div
 $(function(){
	$('#condition').change(function(){  
		var value_str = $(this).val();
		$('.condition_text').hide();
		$('#'+value_str+'Div').show();
	}); 
});

//新建页面 ，show/hide
function showHide(obj,targetObj){
	obj.click(function(){
		targetObj.toggle();
	})
}
///向上滚动条按钮
function GoTo_Top(json) {
    if (json == null) {
        var json = {};
    }
    var _id = json.id ? json.id : "GoTo_Top_" + Math.floor(Math.random() * 100000000);;
    var _obj = $(window);
    var _btnClass = json.btnClass ? json.btnClass : "GoTo_Top";
    var _showHeight = json.showHeight ? json.showHeight : _obj.height();
    var _marginLeft = json.marginLeft ? json.marginLeft : 798;
    var _nGoToHeight = json.nGoToHeight ? json.nGoToHeight : 0;
    var _title = json.sTitle ? json.sTitle : "";

    $("body").prepend("<a id='"+ _id +"' href=\"javascript:void(0)\" class=\"" + _btnClass + "\" title='" + _title + "'></a>");
    $("." + _btnClass).css({ "margin-left": _marginLeft / 2 + "px" });
    _obj.scroll(function () {
        if (_obj.scrollTop() >= _showHeight) {
            $("." + _btnClass).show();
        } else {
            $("." + _btnClass).hide();
        }
    });
    $("." + _btnClass).click(function () {
        $('html,body').stop().animate({ scrollTop: _nGoToHeight },"fast");
    });
}

//getfirstDay of current week
function getFirstDateOfWeek(theDate) {
    var firstDateOfWeek;
    theDate.setDate(theDate.getDate() - theDate.getDay()+1); //	 
    firstDateOfWeek = theDate;
    return firstDateOfWeek;
}
//get lastDay of current week
function getLastDateOfWeek(theDate) {
    var lastDateOfWeek;
    theDate.setDate(theDate.getDate() + 6 - theDate.getDay()+1); //	 
    lastDateOfWeek = theDate;
    return lastDateOfWeek;
}
//get lastDay of current month
var MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
 function getLastDateOfMonth(year , month) {
     var n = MonHead[month-1];
     if (month == 2 && IsPinYear(year)) {
        n++;
    }
    return n;
}
function IsPinYear(year) {
    return (0 == year % 4 && (year % 100 != 0 || year % 400 == 0))
}
function mouseBind(detail, _this, cardMini, pId) {// 判断是否关闭窗口
    $(document).bind(
        'mouseover',
        function (e) {
            var targ = e.target;
            if (targ.nodeType == 3)
                targ = targ.parentNode // Safari
            var _set = detail.offset();
            if (_set != null) {
                // 鼠标进入按钮与panle之间的间隙默认不隐藏，不然鼠标不能进入div区域。
                var inArea = e.clientX > _set.left// inArea表示鼠标是否在按钮与panel之间则不关闭窗口
                    && e.clientX < (_set.left + cardMini.width)
                    && e.clientY < (_set.top + cardMini.height)
                    && e.clientY > (_set.top - $(_this).height());
            }
            if (targ != _this && !inArea && targ.id != pId) {
                cardMini.hideDialog();
                // 隐藏pannel并且取消document的mouseover监听。
                $(document).unbind('mouseover');
            }
        });
}
///根据附件和关联文档的数量，设置上下静态布局的样式
function setAttachmentsLayoutHeight(json) {
    //ie6兼容设置
    if ($.browser.msie) {
        if ($.browser.version < 7) {
            if ($(".affix_area").height() > 34) {
                $(".affix_area").height(34);
            }
        }
    }

    var _fj_id = $("#" + json.fj_id);
    var _wd_id = $("#" + json.wd_id);
    var _layout_h = $("#" + json.layout_head_id);
    var _layout_b = $("#" + json.layout_body_id);
    var _height = 0, _rowNum = 0, _w1 = 0, _w2 = 0, _attachment_block_number_w = 20;
    //累加各个附件显示的宽度
    _w1 += $("#" + json.fj_id + " .attachment_block_number").width();
    $("#" + json.fj_id + " .attachment_block").each(function () {
        _w1 += $(this).width();
    });
    _w2 += $("#" + json.wd_id + " .attachment_block_number").width();
    $("#" + json.wd_id + " .attachment_block").each(function () {
        _w2 += $(this).width();
    });
    //判断宽度，得到显示的行数
    if (_w1 > _fj_id.width()) {
        _rowNum += 2;
    } else if (_w1 > _attachment_block_number_w) {
        _rowNum += 1;
    }
    if (_w2 > _wd_id.width()) {
        _rowNum += 2;
    } else if (_w2 > _attachment_block_number_w) {
        _rowNum += 1;
    }
    //设置静态布局css
    _layout_h.height(_layout_b.height() + _rowNum * 17);
    _layout_b.css("top", Number(_layout_b.css("top").replace("px", "")) + _rowNum * 17 + "px");
}
function set_select_val(sel, val) {
    if($.browser.msie && $.browser.version=="6.0") { 
        setTimeout(function(){ 
            sel.val(val); 
        },1); 
    }else { 
    	try{
            sel.val(val); 
    	}catch(e){
    		setTimeout(function(){ 
                sel.val(val); 
            },1); 
    	}
    } 
}