/**
* @author zs
* 常用语div
*/
/*<div class="comlanguage"> 
    <div class="comlanguage_list">
        <a href="#">content</a>
        <a href="#">content</a>
        <a href="#">content</a>
    </div>
    <div class="clearfix comlanguage_btn">
        <span class="left"><a href="javascript:void(0)" class="common_button common_button_gray">新建</a></span>
        <span class="right"><a href="javascript:void(0)" class="common_button common_button_gray">关闭</a></span>
    </div>
</div>*/
jQuery.fn.comLanguage = function (options) {
    var _sID = $(this).selector;//绑定的对象div
    var _textboxID = options.textboxID ? "#" + options.textboxID : alert("error:常用语 - 未指定 txtboxID");//指定ID 或 自动生成ID
    var _newBtnHandler = options.newBtnHandler ? options.newBtnHandler : alert("error:常用语 - 未指定 newBtnHandler");//指定ID 或 自动生成ID
    var _showID = options.id ? "#" + options.id : "#comLanguage_" + Math.floor(Math.random() * 1000000000);//指定ID 或 自动生成ID
    var _showIDWidth = options.width ? options.width : 200;//指定ID 或 自动生成ID
    var _html = "";
    var _data = options.data ? options.data : null;//json数据div
    var _point = { left: 0, top: 0 };
    var _phraseper = options.phraseper ? options.phraseper : null;
    var _posLeftRight = options.posLeftRight ? options.posLeftRight : "left";
    //判断定位
    function setOffset(posLR) {
        if (posLR == "left") {
            _point.top = $(_sID).offset().top;
            _point.left = $(_sID).offset().left - _showIDWidth - 10;
            if (_point.top < 0) {
                _point.top = 0;
            };
            if (_point.left < 0) {
                _point.left = 0;
            };
        };
        if (posLR == "right") {
            _point.top = $(_sID).offset().top;
            _point.left = $(_sID).offset().left + $(_sID).outerWidth() + 2;
            if (_point.top < 0) {
                _point.top = 0;
            };
            if (_point.left + _showIDWidth > $(window).width()) {
                _point.left = $(window).width() - _showIDWidth;
            };
        };
        $(_showID).css({left:_point.left,top:_point.top});
    }
    /*生成html*/
    _html += "<div id='" + _showID.replace("#", "") + "' class='comlanguage' style='width:" + _showIDWidth + "px;top:" + _point.top + "px;left:" + _point.left + "px;'>";
    _html += "<div class='comlanguage_list'>";
    var num = 1;
    for (var i = 0; i < _data.length; i++) {
        _html += "<a>"+ num+".  <span title='"+tranCharacter(_data[i])+"'>"+ tranCharacter(_data[i]) + "</span></a>";
        num ++ ;
    }
    _html += "</div>";
    _html += "<div class='clearfix comlanguage_btn'>";
    _html += "<span class='left'><a class='common_button common_button_gray comLanguage_new left'>" + $.i18n('phrase.sys.js.neworupdate') + "</a></span>";
    _html += "<span class='right'><a class='common_button common_button_gray comLanguage_close right'>" + $.i18n('phrase.sys.js.close') + "</a></span>";
    _html += "</div>";
    _html += "</div>";
    $("body").append(_html);
    setOffset(_posLeftRight);
    $(_showID).show();
    /*绑定事件*/
    //$(_sID).click(function () {
    //});
    $(_showID).mouseleave(function () {
        $(this).remove();
    });
    $(_showID + " .comLanguage_close").click(function () {
        $(_showID).remove();
    });
    $(_showID + " .comLanguage_new").click(function () {
        $(_showID).remove();
        _newBtnHandler();
    });
    //选择,赋值div
    $(_showID + " .comlanguage_list a").click(function () {
        $(_showID).remove();
        var _brHTML = $(_textboxID).val().trim() == "" ? "" : "\r\n";//如果当前不为空，换行追加显示
        $(_textboxID).val($(_textboxID).val().trim() + _brHTML + $(this).find("span").text());
    });
}

//转换特殊字符
function tranCharacter(str){
	if(!str){
		return "";
	}
	if(str.indexOf('"') >-1){
		str = str.replace(/"/g,'&quot;');
	}
	if(str.indexOf('<') >-1){
		str= str.replace(/</g,'&lt;');
	}
	if(str.indexOf('>') >-1){
		str= str.replace(/>/g,'&gt;');
	}
	return str;
}
