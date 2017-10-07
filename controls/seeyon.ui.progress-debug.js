/**
 * @author macj
 */
function MxtProgressBar(options){
	if(options == undefined){options = {}}
	this.id = options.id ? options.id : Math.floor(Math.random() * 100000000);
    this.text = options.text ? options.text : '';
    this.progress = options.progress ? options.progress : '';
	this.width = options.width ? options.width : 600;
	this.height = options.height ? options.height : 70;
	this.isMode = options.isMode == undefined ? true : options.isMode;
	this.buttons = options.buttons;
	if(this.buttons!=null){
		this.height+=30;
	}
	this.borderSize = 1;
	this.init();
}
MxtProgressBar.prototype.init = function (){
	
    //遮罩id
    var maskId = this.id + "_mask";
    
    //获取客户端页面宽高
    var _client_width = document.body.clientWidth;
    var _client_height = (document.documentElement.scrollHeight>document.documentElement.clientHeight?document.documentElement.scrollHeight:document.documentElement.clientHeight);
    
	
    //遮罩
    if (typeof($("#" + maskId)[0]) == "undefined" && this.isMode ==  true) {
        $("body").prepend("<div id='" + maskId + "' class='mask' style='width:" + _client_width + "px;height:" + _client_height + "px;'>&nbsp;</div>");
    }
    //判断是否存在.存在就先移处
    if (typeof($("#" + this.id)[0]) != "undefined") {
        $("#" + this.id).remove();
    }
    //progressBar
    var htmlStr = "";
	if(this.progress == ''){
		//简单的加载进度
		var _left = (_client_width - 66) / 2;
	    var _top = (document.documentElement.clientHeight - 66) / 2;
		htmlStr +="<div id='" + this.id + "' class='common_loading_progress_box absolute clearfix' style='left:" + (_left + document.documentElement.scrollLeft) + "px;top:" + (_top + document.documentElement.scrollTop) + "px;'></div>";
		if(this.text!='' && this.text!=undefined){
			htmlStr +="<div id='" + this.id + "_text' class='absolute clearfix' style='width:auto;overflow:hidden;border:0px #286fbf solid;background:#f8f8f8;z-index:1001;font-size:12px;padding:5px;left:" + (_left + document.documentElement.scrollLeft-76) + "px;top:" + (_top + document.documentElement.scrollTop+66) + "px;'>"+this.text+"</div>";
		}
	}else{
		//包含进度的
	    var _left = (_client_width - (this.width + 5)) / 2;
	    var _top = (document.documentElement.clientHeight - (this.height + 5)) / 2;
		htmlStr +="<div id='" + this.id + "' class='common_progress_box absolute clearfix' style='left:" + ((_left < 0 ? 0 : _left) + document.documentElement.scrollLeft) + "px;top:" + ((_top < 0 ? 0 : _top) + document.documentElement.scrollTop) + "px;'>";
	    	//阴影
	    	htmlStr +="<div id='" + this.id + "_shadow' class='common_progress_shadow absolute' style='width:" + (this.width + this.borderSize * 2) + "px;height:" + (this.height + this.borderSize * 2) + "px;'>&nbsp;</div>"
			htmlStr +="<div class='common_progress_strip absolute padding_5' style='width:" + (this.width-10) + "px;height:" + (this.height-10) + "px;'>";
				if(this.text!=''){
					htmlStr +="<dl id='"+this.id+"_title' class='common_progress_strip_title margin_b_5 margin_t_5 '>"+this.text+"</dl>";
				}
				htmlStr +="<dl id='"+this.id+"_text' class='common_progress_strip_per margin_l_10 right margin_r_5'>"+this.progress+"%</dl>";
				htmlStr +="<dl class='common_progress_strip_content'>";
					htmlStr +="<dt id='"+this.id+"_progress' class='common_progress_strip_bg' style='width:"+this.progress+"%'></dt>";
				htmlStr +="</dl>";
				htmlStr +="<div class='padding_10'><table class='common_right'><tr><td class='clearfix' id='"+this.id+"_buttons'>";
						//<a  href="javascript:void(0)" class="common_button common_button_gray">关注</a>
				htmlStr +="</td></tr></table></div>";
			htmlStr +="</div>";
		htmlStr +="</div>";
	}
	$("body").prepend(htmlStr);
	if(this.buttons!=null){
		for(var i = 0;i<this.buttons.length;i++){
			var btnTemp = this.buttons[i];
			$("<a id='"+btnTemp.id+"' href='javascript:void(0)' class='common_button common_button_gray margin_r_10'>"+btnTemp.text+"</a>\n").click(btnTemp.handler).appendTo($('#'+this.id+'_buttons'));
		}
	}

	var fontBoxWidth = $("#" + this.id + "_text").width();
	$("#" + this.id + "_text").css("left", _left + document.documentElement.scrollLeft-((fontBoxWidth-56)/2) + "px");
	
}
MxtProgressBar.prototype.setProgress = function(prog){
	$('#'+this.id+"_progress").css('width',prog+'%');
	$('#'+this.id+"_text").html(prog+"%");
}
MxtProgressBar.prototype.setTitle = function(title){
	$('#'+this.id+"_title").html(title);
}
MxtProgressBar.prototype.close = function(){
    $("#" + this.id + "_mask").remove();
    $("#" + this.id).remove();
	if(this.text!='' && this.text!=undefined){
		$('#'+this.id + '_text').remove();
	}
}
MxtProgressBar.prototype.start = function(){
    $("#" + this.id + "_mask").show();
    $("#" + this.id).show();
	if(this.text!='' && this.text!=undefined){
		$('#'+this.id + '_text').show();
	}
}