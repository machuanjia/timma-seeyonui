/// <reference path="../scriptes/jquery.js" />

/**
 * @author macj
 */
function setDialogFocusDom(id){
	try{
		var _win = document.getElementById(id);
		if(_win){
			var _con = _win.contentWindow;
			var _body = _con.document.getElementsByTagName('body')[0];
			var _style = _body.style.display;
			if(_style == '' || _style == 'block'){
				_body.focus();
			}
		}
	}catch(e){}
}
/**
$(document).keydown(function(e){
	var target = e.target ;
	var tag = e.target.tagName.toUpperCase();
	if(e.keyCode == 8){
		if((tag == 'INPUT' && !$(target).attr("readonly"))||(tag == 'TEXTAREA' && !$(target).attr("readonly")) || (tag == 'DIV' && $(target).attr("contenteditable") == 'true') ){
			if((target.type.toUpperCase() == "RADIO") || (target.type.toUpperCase() == "CHECKBOX")){
				return false ;
			}else{
				return true ; 
			}
		}else{
			return false ;
		}
	}
}); **/
function MxtDialog(options){
    this.id = options.id ? options.id : Math.floor(Math.random() * 100000000);
    this.title = options.title ? options.title : 'Dialog';
    this.html = options.html ? options.html : '';
    this.url = options.url ? options.url : '';
    this.width = options.width ? parseInt(options.width) : 400;
    this.height = options.height ? parseInt(options.height) : 350;
    this.buttons = options.buttons ? options.buttons : [];
    this.isDrag = options.isDrag == undefined ? true : options.isDrag;
    this.showMask = options.showMask == undefined ? false : options.showMask;
    this.borderSize = 1;//边框尺寸(像素)
    
	this.shadow = options.shadow == undefined? true : false;

	this.checkMax = options.checkMax == undefined ? true : options.checkMax;//是否验证超出最大宽高
    this.closeTitle = options.closeTitle ? options.closeTitle : $.i18n('common.button.close.label');//鼠标移上去时的提示文字
    this.minTitle = options.minTitle ? options.minTitle : 'min';//鼠标移上去时的提示文字
    this.maxTitle = options.maxTitle ? options.maxTitle : 'max';//鼠标移上去时的提示文字
	this.autoTitle = options.autoTitle ? options.autoTitle : 'auto';//鼠标移上去时的提示文字
	this.isClear = false;//是否清空内存
	
    this.headerHeight = 32;
    this.footerHeight = 44;
    
	this.isFrountEvent = options.isFrountEvent ? options.isFrountEvent : false;//点击详情后执行的函数;
	this.targetWindow = options.targetWindow == null ? window : options.targetWindow;
	
	this.isHead = options.isHead ==undefined?true: options.isHead;//点击详情后执行的函数;
	
	this.minParam = options.minParam;
	this.maxParam = options.maxParam;
	this.closeParam = options.closeParam;
	this.panelParam = options.panelParam;
	this.bottomHTML = options.bottomHTML;
	this.overflow = options.overflow == undefined?'auto':options.overflow;
	this.formSubmitBtn = options.formSubmitBtn ? options.formSubmitBtn : false;
	this.w_space=options.w_space?options.w_space:0; //计算panel位置时使用，场景：时间视图日历展示
	//if(options.checkMax==true)
    this.ifMax();//判断定义高度和宽度不超过浏览器可是区域
	if(this.minParam == undefined){
		this.minParam = {'show':false,handler:function(){}};
	}
	if(this.maxParam == undefined){
		this.maxParam = {'show':false,handler:function(){}};
	}
	if(this.closeParam == undefined){
		this.closeParam = {'show':true,handler:function(){}};
	}
	
	this.left = options.left;
	this.top = options.top;
	
	this.type = options.type == null?'dialog':'panel';
	this.targetId = options.targetId;
	this.htmlId = options.htmlId;
	this.htmlObj=null;
	this.buttonAlign =  options.buttonAlign?options.buttonAlign:'align_right';
	
	
	this.transParamsCopy = null;
	this.emphasizeIndex = 0;
	
	this.zIndex = 1000;
	this.transParams = options.transParams;//从父页面传入到子页面的js变量div
	this.isFromModle = options.isFromModle == undefined?false:options.isFromModle;//在模态对话框中弹出dialig div
	this.isFormItem = options.isFormItem ? options.isFormItem : false;
	this.isHide = options.isHide == undefined?false:options.isHide;//点击关闭按钮(X),不调用close,调用hideDialog
	this._zoomParam = 1;
	if(this._zoomParam == null || this._zoomParam == undefined)this._zooParam=1;
	if ($('#' + this.id,this.targetWindow.document).size() > 0) {
	    var _client_width = document.body.clientWidth;
	    var _client_height = (document.documentElement.scrollHeight > document.documentElement.clientHeight ? document.documentElement.scrollHeight : document.documentElement.clientHeight);
	    if (this.targetId != null) {
	        var tarobj = document.getElementById(this.targetId);
	        var leftTemp = tarobj.getBoundingClientRect().left;
	        if ((leftTemp + this.width) > _client_width) {
	            leftTemp = leftTemp + tarobj.clientWidth - this.width;
	            shadowLeft = "left:-3px;"
	        }
	        this.left = leftTemp;
			var _scrollTop = document.documentElement.scrollTop;
			if($.browser.chrome){
				_scrollTop = $('body').scrollTop()
			}
	        this.top = tarobj.getBoundingClientRect().top + tarobj.offsetHeight + _scrollTop;
	        this.left = this.left+this.width<_client_width? this.left : this.left-this.width-tarobj.offsetWidth;
			this.top = this.top+this.height<_client_height? this.top : (this.top-this.height-tarobj.offsetHeight<0 ? 0:this.top-this.height-tarobj.offsetHeight);
	    }
	    else{

			this.left = this.left+this.width<_client_width? this.left+this.w_space : this.left-this.width-options.w_space;
			this.top = this.top+this.height<_client_height? this.top : (this.top-this.height<0 ? 0:this.top-this.height);
			if (this.left < 0) 
			{
				this.left = 0;
			};
		}
	    this.targetWindow.$("#" + this.id).css({"left":this.left,"top":this.top});
	  	this.showDialog();
	  //this.reloadUrl(this.url);
	  return;
	}
	if(this.type == 'dialog'){
		if (typeof($("#" + this.id)[0]) == "undefined") {
		    this.getDialog();
		    this.drag();
		}else{
			if (typeof($("#" + this.id+'_min')[0]) != "undefined") {
				$("#" + this.id+'_auto_min').click();
			}
		}
	}else{
		this.getPanel();
	}
	var _this = this;
	this.targetWindow.$(document).bind("keyup", function (e) {
	    if ($('#' + _this.id)) {
	        if (e.keyCode == 27) {//ESC
	            _this.close();
	        }
	    }
		var target = e.target ;
		var tag = e.target.tagName.toUpperCase();
		if(e.keyCode == 8){
		    if ((tag == 'INPUT' && !$(target).attr("readonly")) || (tag == 'TEXTAREA' && !$(target).attr("readonly")) || (tag == 'DIV' && $(target).attr("contenteditable") == 'true')) {
		        if (target.type) {
		            if ((target.type.toUpperCase() == "RADIO") || (target.type.toUpperCase() == "CHECKBOX")) {
		                return false;
		            } else {
		                return true;
		            }
		        }
			}else{
				return false ;
			}
		}
	});
	//隐藏office插件
	this.officeAction(false)

}
MxtDialog.prototype.getPanel = function(){
    
    //遮罩id
    var maskId = this.id + "_mask";
    
    //获取客户端页面宽高
    var _client_width = document.body.clientWidth;
    var _client_height = (document.documentElement.scrollHeight>document.documentElement.clientHeight?document.documentElement.scrollHeight:document.documentElement.clientHeight);
    
	//dialog层级叠加
	var masks =  this.targetWindow.$('.mask,.shield,.projectTask_detailDialog_box');
	if(masks.size()>0){
		this.zIndex = parseInt(masks.eq(0).css('z-index'));
		this.zIndex = this.zIndex+2;
	}
	
    //遮罩
	if (this.showMask && typeof ($("#" + maskId)[0]) == "undefined") {
        this.targetWindow.$('body').prepend("<div id='" + maskId + "' class='mask' style='width:100%;height:" + _client_height + "px;z-index:"+this.zIndex+"'>&nbsp;</div>");
    }
    
    //判断是否存在.存在就先移处
    if (typeof($("#" + this.id)[0]) != "undefined") {
        return;
    }
    //制作dialog
    var htmlStr = "";
    var _left = (_client_width - (this.width + this.borderSize * 2 + 5)) / 2;
    var _top = (document.documentElement.clientHeight - (this.height + this.borderSize * 2 + 15 + 5)) / 2;
    
	if(this.left==null)this.left = _left;
	if(this.top==null)this.top = _top;
	var shadowLeft = "";
	if(this.targetId!=null){
		var tarobj = document.getElementById(this.targetId);
		var leftTemp  = tarobj.getBoundingClientRect().left;
		if((leftTemp+this.width)>_client_width){
			leftTemp = leftTemp+tarobj.clientWidth-this.width;
			//OA-34362应用检查：待办会议，浮动Tips样式与需求不符，回复人数统计应该是斜杠，不是方框
			//shadowLeft = "left:-3px;"
		}
		 	this.left = leftTemp;
	        this.top = tarobj.getBoundingClientRect().top + tarobj.offsetHeight +  document.documentElement.scrollTop;
	        this.left = this.left+this.width<_client_width? this.left : this.left-this.width-tarobj.offsetWidth;
			this.top = this.top+this.height<_client_height? this.top: (this.top-this.height-tarobj.offsetHeight<0 ? 0:this.top-this.height-tarobj.offsetHeight);
	}
	else{
		this.left = this.left+this.width<_client_width? this.left+this.w_space : this.left-this.width-this.w_space;
		this.top = this.top+this.height<_client_height? this.top : (this.top-this.height<0 ? 0:this.top-this.height);
	}
	var closeHeight = 15;
	var margins = this.borderSize * 2;
	if (this.panelParam!=undefined && !this.panelParam.show) {
		closeHeight = 0;
	}
	if (this.panelParam!=undefined && !this.panelParam.margins) {
		margins = 0;
	}
	
    //left 边框*2 阴影5
    //top 边框*2 阴影5 header30 bottom50
	htmlStr += "<div id='" + this.id + "' class='dialog_box absolute' style='z-index:"+(this.zIndex+1)+";left:" + (parseInt(this.left < 0 ? 0 : this.left) + document.documentElement.scrollLeft)+ "px;top:" + (parseInt(this.top < 0 ? 0 : this.top)) + "px;'>";
    //阴影
	if(this.shadow){
	    htmlStr += "<div id='" + this.id + "_shadow' class='dialog_shadow absolute' style='"+shadowLeft+"width:" + (this.width + this.borderSize * 2) + "px;height:" + (this.height + margins + closeHeight) + "px;'>&nbsp;</div>"
	}
    //iframe 遮挡office插件
    htmlStr += "<iframe id='" + this.id + "_iframe_shadow' class='absolute' style='"+shadowLeft+"width:" + this.width+ "px;height:" + (this.height + margins) + "px;border:0'></iframe>"

	    //main
	    htmlStr += "<div id='" + this.id + "_main' class='dialog_main absolute' style='width:" + this.width + "px'>";
		    //header
		    htmlStr += "<div id='" + this.id + "_main_head' >";
		    htmlStr += "</div>";//header
		    //body
		    htmlStr += "<div id='" + this.id + "_main_body' class='dialog_main_body left' style='width:" + this.width + "px;height:" + this.height + "px;'>";
			    //iframe 遮罩层
			    htmlStr += "<div id='" + this.id + "_main_iframe' class='dialog_main_iframe absolute' style='top:" + this.headerHeight + "px;width:" + this.width + "px;height:" + this.height + "px;display:none;'>&nbsp;</div>";
			    
			    //iframe 容器
			    htmlStr += "<div id='" + this.id + "_main_content' class='dialog_main_content absolute'>";
					if(this.url!=''){
				    	htmlStr += "<iframe id='" + this.id + "_main_iframe_content' name='" + this.id + "_main_iframe' class='dialog_main_content_html "+(margins==0?'':' ')+"' src='" + this.url + "' scrolling='no' frameborder='0' width='" + (this.width-(margins==0?0:22)) + "' height='" + (this.height-(margins==0?0:22)) + "' />";
					}else{
						//12:[上下内外边距各10(5+5) 左右内外边距各10(5+5) 上下边框 1+1 左右边框 1+1]
						htmlStr+="<div id='" + this.id + "_main_iframe_div' class='dialog_main_content_html "+(margins==0?'':' ')+"' style='width:"+(this.width-(margins==0?0:22))+"px;height:"+(this.height-(margins==0?0:22))+"px;border-width:"+(margins==0?0:1)+"px;background:#fff;'>"+(this.htmlId==undefined?this.html:'')+"</div>";
					}
			    htmlStr += "</div>";
				
		    htmlStr += "</div>";
		    //body
		    
		    //bottom
			if (this.buttons.length > 0) {
				htmlStr += "<div id='" + this.id + "_main_footer' class='dialog_main_footer left padding_t_5 w100b'>";
				htmlStr += "<div class='left over_hidden margin_l_5 padding_t_5 padding_b_5'  style='font-size:12px;'>";
				if(this.bottomHTML != undefined){
					htmlStr+=this.bottomHTML;
				}
				htmlStr += "</div>";
				htmlStr += "<div class='right "+this.buttonAlign+"' >";
				if (this.buttons.length > 0) {
					for (var i = 0; i < this.buttons.length; i++) {
						var jsonTemp = this.buttons[i];
						if(jsonTemp.id == undefined){
							jsonTemp.id = Math.floor(Math.random() * 100000000)+'_btn';
						}
						if(!this.isFrountEvent){
							//href='javascript:void(0)'
							if(jsonTemp.id == 'btnok') $.hotkeys.returnKeys.push(jsonTemp.id+this.id);
						  if(jsonTemp.id == 'btncancel') $.hotkeys.cancelKeys.push(jsonTemp.id+this.id);
							htmlStr+="<a id='"+jsonTemp.id+this.id+"' class='common_button "+(jsonTemp.disabled?'common_button_disable':'common_button_gray')+" margin_r_10' style='cursor:pointer;display:"+(jsonTemp.hide?'none':'')+"'>"+jsonTemp.text+"</a>";
						}
					};
				}
				htmlStr += "</div>";
				htmlStr += "</div>";
				//bottom
			}
			
			
	    htmlStr += "</div>";
	    //main
	    htmlStr += "</div>";
	    this.targetWindow.$('body').prepend(htmlStr);

	    var temp = $('#'+this.id+'_main_iframe_content',this.targetWindow.document);
		if(temp.size()>0 && temp[0].contentWindow){
			try{
		        if(temp[0].contentWindow.parentDialogObj == undefined)temp[0].contentWindow.parentDialogObj = new Object();
		        eval("temp[0].contentWindow.parentDialogObj['" + this.id + "'] = this;");
			}catch(e){}
	    }

	    if (this.htmlId != null) {
	        this.htmlObj = $('#' + this.htmlId).clone(true);
	        $("#" + this.htmlId).after("<div id=\"" + this.htmlId + "_area\"></div>");
	        this.targetWindow.$("#" + this.id + "_main_iframe_div").append($('#' + this.htmlId).show());
	}
	//关闭按钮
	var self = this;
	if (this.panelParam == undefined || this.panelParam.show) {
	    if (this.panelParam && this.panelParam.inside)
	        $("#" + this.id + "_main_head", this.targetWindow.document).css({
	        "position": "absolute",
	        "z-index": "9999",
            "right":5
	    })
		$("<span id='" + this.id + "_close' class='dialog_close right margin_t_0' title='" + this.closeTitle + "'></span>").click(function(){
			self.close();
		}).appendTo($("#" + this.id + "_main_head", this.targetWindow.document));
	}
	
	if (this.buttons.length > 0) {
		for (var i = 0; i < this.buttons.length; i++) {
			var jsonTemp = this.buttons[i];
			if(!this.isFrountEvent){
				if(jsonTemp.disabled){
					continue;
				}else{
					this.targetWindow.$("#"+jsonTemp.id+this.id).click(jsonTemp.handler).click(function(){
						self.close();
					});
				}
			}
		};
		this.targetWindow.$("#"+this.buttons[0].id+this.id).focus();
	}else{
		this.targetWindow.$("#"+this.id).focus();
	}
}
MxtDialog.prototype.getDialog = function(){
    //遮罩id
    var maskId = this.id + "_mask";
    
    //获取客户端页面宽高
    var _client_width = (this.targetWindow.document.documentElement.scrollWidth>this.targetWindow.document.documentElement.clientWidth?this.targetWindow.document.documentElement.scrollWidth:this.targetWindow.document.documentElement.clientWidth);
    var _client_height = (this.targetWindow.document.documentElement.scrollHeight>this.targetWindow.document.documentElement.clientHeight?this.targetWindow.document.documentElement.scrollHeight:this.targetWindow.document.documentElement.clientHeight);
    
	//dialog层级叠加
	var masks =  this.targetWindow.$('.mask,.shield,.projectTask_detailDialog_box');
	if(masks.size()>0){
		this.zIndex = parseInt(masks.eq(0).css('z-index'));
		this.zIndex = this.zIndex+2;
	}
	
    //遮罩
    if (typeof($("#" + maskId)[0]) == "undefined") {
        this.targetWindow.$('body').prepend("<div id='" + maskId + "' class='mask' style='width:100%;height:" + _client_height + "px;z-index:"+this.zIndex+";zoom:"+(this._zoomParam==null?1:this._zoomParam)+"'>&nbsp;</div>");
    }
    //判断是否存在.存在就先移处
    if (typeof($("#" + this.id)[0]) != "undefined") {
		return;
       // this.targetWindow.$("#" + this.id).remove();
    }
    //制作dialog
    var htmlStr = "";
    var _left = (_client_width - (this.width + this.borderSize * 2 + 5)) / 2;
    var _top = (this.targetWindow.document.documentElement.clientHeight - (this.height + this.borderSize * 2 + this.headerHeight + this.footerHeight + 5)) / 2;
    
	if(this.left==undefined)this.left = _left;
	if(this.top==undefined)this.top = _top;
	
    //left 边框*2 阴影5
    //top 边框*2 阴影5 header30 bottom50
    htmlStr += "<div id='" + this.id + "' class='dialog_box absolute' style='z-index:"+(this.zIndex+1)+";left:" + ((this.left < 0 ? 0 : this.left) + this.targetWindow.document.documentElement.scrollLeft) + "px;top:" + ((this.top < 0 ? 0 : this.top) + this.targetWindow.document.documentElement.scrollTop) + "px;zoom:"+(this._zoomParam==null?1:this._zoomParam)+";'>";
    //阴影
	if(this.shadow){
    	htmlStr += "<div id='" + this.id + "_shadow' class='dialog_shadow absolute' style='top:0px;left:0px;width:" + (this.width + this.borderSize) + "px;height:" + (this.height + this.borderSize  + this.headerHeight + (this.buttons.length > 0?this.footerHeight:0)) + "px;'>&nbsp;</div>"
	}
    //iframe 遮挡office插件
    htmlStr += "<iframe id='" + this.id + "_iframe_shadow' class='absolute' style='width:" + this.width+ "px;height:" + (this.height +  this.headerHeight + (this.buttons.length > 0?this.footerHeight:0)) + "px;border:0'></iframe>"
	    //main
	    htmlStr += "<div id='" + this.id + "_main' class='dialog_main absolute' style='width:" + this.width + "px;border:0px;'>";
		    //header
			
			if(this.isHead){
			    htmlStr += "<div id='" + this.id + "_main_head' class='dialog_main_head' style='height:"+this.headerHeight+"px'>";
				    htmlStr += "<span id='" + this.id + "_title' class='dialog_title left' style='width:"+(this.width-100)+"px;  white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color:#fff;'>" + this.title + "</span>";
					if (this.closeParam && this.closeParam.show) {
						htmlStr += "<span id='" + this.id + "_close' class='dialog_close right' title='" + this.closeTitle + "'></span>";
					}
					if(this.maxParam && this.maxParam.show){
						htmlStr+="<span id='" + this.id + "_max' class='dialog_max right' title='" + this.maxTitle + "'></span>";
					}
					if(this.minParam && this.minParam.show){
						htmlStr+="<span id='" + this.id + "_min' class='dialog_min right' title='" + this.minTitle + "'></span>";
					}
			    htmlStr += "</div>";//header
			}
		    
			
			
		    //body
		    htmlStr += "<div id='" + this.id + "_main_body' class='dialog_main_body left' style='width:" + this.width + "px;height:" + this.height + "px'>";
			    //iframe 遮罩层
			    htmlStr += "<div id='" + this.id + "_main_iframe' class='dialog_main_iframe absolute' style='left:5px;top:" + (this.headerHeight+5) + "px;width:" + (this.width-10) + "px;height:" + (this.height-10) + "px;display:none;'>&nbsp;</div>";
			    
			    //iframe 容器
			    htmlStr += "<div id='" + this.id + "_main_content' class='dialog_main_content absolute'>";
					if(this.url!=''){
				    	htmlStr += "<iframe id='" + this.id + "_main_iframe_content' name='" + this.id + "_main_iframe' class='dialog_main_content_html ' src='" + this.url + "' scrolling='auto' frameborder='0' width='" + (this.width) + "' height='" + (this.height) + "' />";
					}else{
						//12:[上下内外边距各10(5+5) 左右内外边距各10(5+5) 上下边框 1+1 左右边框 1+1]
						htmlStr+="<div id='" + this.id + "_main_iframe_div' class='dialog_main_content_html  ' style='width:"+(this.width)+"px;height:"+(this.height)+"px;overflow:"+this.overflow+";'>"+(this.htmlId==undefined?this.html:'')+"</div>";
					}
			    htmlStr += "</div>";
				
		    htmlStr += "</div>";
		    //body
		    
		    //bottom
			if (this.buttons.length > 0) {
				htmlStr += "<div id='" + this.id + "_main_footer' class='dialog_main_footer left padding_t_5 w100b' style='background:#4d4d4d;color:#fff;height:"+this.footerHeight+"px;'>";
				htmlStr += "<div class='left over_hidden margin_l_5 padding_t_5 padding_b_5'  style='font-size:12px;margin-top:7px;'>";
				if(this.bottomHTML != undefined){
					htmlStr+=this.bottomHTML;
				}
				htmlStr += "</div>";
				htmlStr += "<div class='right "+this.buttonAlign+"' style='margin-top:4px;'>";
				if (this.buttons.length > 0) {
					for (var j = 0; j < this.buttons.length; j++) {
						var jsonTemp = this.buttons[j];
						if(jsonTemp.isEmphasize == true){
							// this.emphasizeIndex = j;
							this.buttons[j].btnType = 1;
						}
					}
					for (var i = 0; i < this.buttons.length; i++) {
						var jsonTemp = this.buttons[i];
						if(jsonTemp.id == undefined){
							jsonTemp.id = Math.floor(Math.random() * 100000000)+'_btn';
						}
						if(!this.isFrountEvent){
						  //href='javascript:void(0)'
						  if(jsonTemp.id == 'btnok') $.hotkeys.returnKeys.push(jsonTemp.id+this.id);
						  if(jsonTemp.id == 'btncancel') $.hotkeys.cancelKeys.push(jsonTemp.id+this.id);
						  if(jsonTemp.btnType == 1){
						  	htmlStr+="<a id='"+jsonTemp.id+this.id+"' class='common_button "+(jsonTemp.disabled?'common_button_disable':'common_button_emphasize')+" margin_r_10' style='cursor:pointer;display:"+(jsonTemp.hide?'none':'')+"'>"+jsonTemp.text+"</a>";
						  }else{
							htmlStr+="<a id='"+jsonTemp.id+this.id+"' class='common_button "+(jsonTemp.disabled?'common_button_disable':'common_button_gray')+" margin_r_10' style='cursor:pointer;display:"+(jsonTemp.hide?'none':'')+"'>"+jsonTemp.text+"</a>";
						  }
						}
					};
				}
				htmlStr += "</div>";
				htmlStr += "</div>";
				//bottom
			}
	    htmlStr += "</div>";
	    //main
    htmlStr += "</div>";
    this.targetWindow.$('body').prepend(htmlStr);
    var temp = $('#'+this.id+'_main_iframe_content',this.targetWindow.document);
	if(temp.size()>0 && temp[0].contentWindow){
		try{
	        if(temp[0].contentWindow.parentDialogObj == undefined)temp[0].contentWindow.parentDialogObj = new Object();
	        eval("temp[0].contentWindow.parentDialogObj['" + this.id + "'] = this;");
		}catch(e){}
    }
    if(temp.size()>0 && this.transParams!=undefined){
		try{
			if(!this.isFromModle){
				this.transParamsCopy = this.transParams;
				temp[0].contentWindow.dialogArguments = this.transParams;
				temp[0].contentWindow.transParams = this.transParams;
			}else{
				this.transParamsCopy = this.transParams;
				temp[0].contentWindow.transParams = this.transParams;
			}
		}catch(e){
			this.transParamsCopy = this.transParams;
			temp[0].contentWindow.transParams = this.transParams;
		}
    }
    if (this.htmlId != null) {
        this.htmlObj = $('#' + this.htmlId).clone(true);
        $("#" + this.htmlId).after("<div id=\"" + this.htmlId + "_area\"></div>");
        this.targetWindow.$("#" + this.id + "_main_iframe_div").append($('#' + this.htmlId).show());
	}
	
	//关闭按钮
	var self = this;
	if (this.closeParam && this.closeParam.show) {
		if(this.closeParam.autoClose == false){
			this.targetWindow.$('#' + this.id + '_close').click(this.closeParam.handler);
		}else{
			this.targetWindow.$('#' + this.id + '_close').click(this.closeParam.handler).click(function(){
				self.close();
			});
		}
	}
	if(this.maxParam && this.maxParam.show){
		this.targetWindow.$('#'+this.id+'_max').click(function(){
			self.maxfn();
		}).click(this.maxParam.handler);
	}
	
	if(this.minParam && this.minParam.show){
		this.targetWindow.$('#'+this.id+'_min').click(function(){
			self.minfn();
		}).click(this.minParam.handler);
	}
	if (this.buttons.length > 0) {
		for (var i = 0; i < this.buttons.length; i++) {
			var jsonTemp = this.buttons[i];
			if(!this.isFrountEvent){
				if(jsonTemp.disabled){
					continue;
				}else{
					this.targetWindow.$("#"+jsonTemp.id+this.id).click(jsonTemp.handler);
				}
			}
		};
		this.targetWindow.$("#"+this.buttons[0].id+this.id).parent().focus();
	}else{
		this.targetWindow.$("#"+this.id).parent().focus();
	}
	$(window).scroll(function(){
	    //获取客户端页面宽高
	    var _client_width2 = document.documentElement.scrollWidth;
	    var _client_height2 = document.documentElement.scrollHeight;
	    $('.mask').css({
			'width':_client_width2,
			'height':_client_height2
		});
	}); 
}
MxtDialog.prototype.setBtnEmphasize = function(id){
    this.targetWindow.$('.common_button_emphasize').removeClass('common_button_emphasize').addClass('common_button_gray');
    this.targetWindow.$('#'+id+this.id).removeClass('common_button_gray').addClass('common_button_emphasize');
}
MxtDialog.prototype.getBtn = function(id){
	for (var i = 0; i < this.buttons.length; i++) {
		var jsonTemp = this.buttons[i];
		if(jsonTemp.id == id){
			return this.targetWindow.$("#"+jsonTemp.id+this.id);
		}
	};
	return null;
}
MxtDialog.prototype.hideBtn = function(id){
	for (var i = 0; i < this.buttons.length; i++) {
		var jsonTemp = this.buttons[i];
		if(jsonTemp.id == id){
			this.targetWindow.$("#"+jsonTemp.id+this.id).hide();
		}
	};
}
MxtDialog.prototype.showBtn = function(id){
	for (var i = 0; i < this.buttons.length; i++) {
		var jsonTemp = this.buttons[i];
		if(jsonTemp.id == id){
			var $btn = this.targetWindow.$("#"+jsonTemp.id+this.id).show();
			var __btnType = "";
			if (jsonTemp.btnType != undefined) {
				switch(jsonTemp.btnType * 1){
					case 0: __btnType = "common_button_gray"; break;
					case 1: __btnType = "common_button_emphasize"; break;
				}
				$btn.removeClass('common_button_disable common_button_gray common_button_emphasize').addClass(__btnType);
			};
			return $btn;
		}
	};
}
MxtDialog.prototype.enabledBtn = function(id){
	for (var i = 0; i < this.buttons.length; i++) {
		var jsonTemp = this.buttons[i];
		if(jsonTemp.id == id){
			var $btn = this.targetWindow.$("#"+jsonTemp.id+this.id).show();
			var $btnType;
			switch($btn.attr("btnType")){
				case "0": $btnType = "common_button_gray";break;
				case "1": $btnType = "common_button_emphasize";break;
			}
			$btn.removeClass('common_button_disable').addClass($btnType).unbind('click').click(jsonTemp.handler);
		}
	};
}
MxtDialog.prototype.disabledBtn = function(id){
	//common_button_gray        btnType = 0
	//common_button_emphasize   btnType = 1
	for (var i = 0; i < this.buttons.length; i++) {
		var jsonTemp = this.buttons[i];
		if(jsonTemp.id == id){
			var $btn = this.targetWindow.$("#"+jsonTemp.id+this.id).show();
			
			if($btn.hasClass("common_button_gray")){
				$btn.attr("btnType","0");
			}else{
				$btn.attr("btnType","1");	
			}
			$btn.removeClass('common_button_gray common_button_emphasize').addClass('common_button_disable').unbind('click');
			
		}
	};
}
MxtDialog.prototype.drag = function(){
    if (this.isDrag) {
        var _dialog = this.targetWindow.$("#" + this.id);
        var _dialog_m_h = this.targetWindow.$("#" + this.id + "_main_head");
        //if (this.isDrag && this.targetWindow.DragDiv) {
		//OA-35405弹出窗口拖动到右侧后，该页面内可以操作，但是该窗口焦点丢失，无法拖动，只能通过关闭IE解决。
			this.targetWindow.$( "#"+this.id ).draggable({cancel:".dialog_main_body,.dialog_main_content_html,.dialog_main_footer",handle:'.dialog_main_head',containment:'body',scroll:false,delay:150,distance:10,iframeFix:true});
            //this.targetWindow.DragDiv.Register(_dialog[0], _dialog_m_h[0]);
        //}
    }
}
MxtDialog.prototype.close = function (json) {
	try{
		this.targetWindow.$("#" + this.id + '_main_iframe_content')[0].contentWindow.document.getElementById('docOpenBodyFrame').contentWindow.document.getElementById('officeEditorFrame').contentWindow.pdfOcxUnLoad();
	}catch(e){
	}
	try{
		this.targetWindow.$("#" + this.id + '_main_iframe_content')[0].contentWindow.document.getElementById('docOpenBodyFrame').contentWindow.document.getElementById('officeEditorFrame').contentWindow.OcxUnLoad();
	}catch(e){
	}
    /*判断隐藏处理，直接返回*/
    if (this.isHide) {
        this.hideDialog();
        return;
    }
    /*判断是否保存操作记录*/
    var _isFormItem = this.isFormItem;
    var _hasSelect = false;
    var json = json;
    json ? null : json = [];
    if (json.isFormItem != undefined) {
        _isFormItem = json.isFormItem;
    }
    if (this.htmlId != undefined) {
        //默认还原操作记录
        if (_isFormItem) {
            //由于克隆不到select值的特殊处理,循环取值
            var _selectObj = this.targetWindow.$("#" + this.htmlId).find("select");
            if (_selectObj.size() > 0) {
                _hasSelect = true;
                var _select_val = [];
                _selectObj.each(function () {
                    _select_val.push($(this).find("option:selected").val());
                });
            }
            //克隆
            this.htmlObj = this.targetWindow.$("#" + this.htmlId).clone(true);
        }
        //把内容抓回原页面,放回原位
        if (this.htmlObj!=null) {
            this.htmlObj.hide();
        }
        $("#" + this.htmlId + "_area").after(this.htmlObj);
        $("#" + this.htmlId + "_area").remove();
    }
    /*删除遮罩层，dialog*/
    this.targetWindow.$("#" + this.id + "_mask").remove();
	try{
		if(this.isClear){
			var _frame = this.targetWindow.$("#" + this.id + '_main_iframe_content');
			if(_frame.size()>0){
			    //_frame[0].contentWindow.document.body.innerHTML = "";//清空iframe的内容
				_frame[0].contentWindow.document.write('');//清空iframe的内容
				var if0 = _frame[0];
				_frame.contents().find("body").empty();
		      	$(if0.document).find('*').unbind().die();
		      	if0.src='about:blank';
		        
				if0.contentWindow.document.write('');//清空iframe的内容
				if0.contentWindow.close();//避免iframe内存泄漏
				$.gc();
				
				if (_frame[0].contentWindow.location.href!=window.location.href) {//OA-48764 登录精灵后，右键精灵图标-新建协同，进入协同新建页面，关闭dialog，弹出离开当前页面的提示
					if(getCtpTop().dialogArguments == undefined || getCtpTop().dialogArguments == null){
						_frame[0].contentWindow.close();//避免iframe内存泄漏
					}
				};
   				
				_frame.remove();//删除iframe
			}
		}else{
			this.targetWindow.$("#" + this.id + '_main_iframe_content').attr('src', '');
		}
	}
	catch(e){
    	this.targetWindow.$("#" + this.id + '_main_iframe_content').attr('src', '');
	}
	
    this.targetWindow.$("#" + this.id).remove();

    this.officeAction(true);
    //由于克隆不到select值的特殊处理,循环赋值
    if (_hasSelect) {
        $("#" + this.htmlId + " select").each(function (j) {
            var _this=$(this);
            $(this).find("option").each(function (i) {
                if ($(this).val() == _select_val[j]) {
                    _this.find("option").eq(i).attr("selected", "selected");
                }
            });
        });
    }
    // 关闭方法回调
    if (json.handler != undefined) {
        json.handler();
    }
}
MxtDialog.prototype.officeAction = function(flag){
	/**
	this.officeIframe = null;
	var officeFrameDiv = $('#officeFrameDiv');
	if(officeFrameDiv.size()>0){
		var _ww = officeFrameDiv.width();
		var _hh = officeFrameDiv.height();
		var _off = officeFrameDiv.offset();
		this.officeIframe = $("<iframe allowtransparency=true src='about:blank' frameborder='0' class='absolute'></iframe> ");
		this.officeIframe.css({
			'width':_ww,
			'height':_hh,
			'top':_off.top,
			'left':_off.left,
			'z-index':900
		}).appendTo($('body'));
	}**/
	var _officeIframeId = ['officeFrameDiv','zwIframe','mainbodyFrame'];
	var _findWindow = window;
	if($('#componentDiv').size()>0){
		try{
			_findWindow = $('#componentDiv')[0].contentWindow.$('#zwIframe')[0].contentWindow;
		}catch(e){}
	}
	for (var i=0; i<_officeIframeId.length; i++) {
		var _tempid = _officeIframeId[i];
		var _obj = _findWindow.$('#'+_tempid);
		if(_obj.size()>0){
			this.officeIframe = _obj;
			break;
		}
	};
	
	this.qianzhangIframe = $("[classid='clsid:2294689C-9EDF-40BC-86AE-0438112CA439']");
	if(!flag){
		if(this.officeIframe && this.officeIframe.size()>0){
			this.officeIframe.css({
				'visibility':'hidden'
			})
		}
		if(this.qianzhangIframe.size()>0){
			this.qianzhangIframe.css({
				'visibility':'hidden'
			})
		}
	}else{
		if(this.officeIframe && this.officeIframe.size()>0){
			this.officeIframe.css({
				'visibility':'visible'
			})
		}
		if(this.qianzhangIframe.size()>0){
			this.qianzhangIframe.css({
				'visibility':'visible'
			})
		}
	}
}
MxtDialog.prototype.closeMin = function(){
    this.targetWindow.$("#" + this.id + "_mask").remove();
	this.targetWindow.$("#" + this.id+'_main_iframe_content').attr('src','');
    this.targetWindow.$("#" + this.id).remove();
	this.targetWindow.$("#" + this.id+"_div_min").remove();
	if(this.targetWindow.$('#min-divs .dialog_box_min').length == 0){
		this.targetWindow.$('#min-divs').remove();
	}
	
}
MxtDialog.prototype.minfn = function(){
	this.targetWindow.$('#'+this.id).hide();
	this.targetWindow.$('#'+this.id+'_mask').hide();
	 
	var htmlStr = ""; 
	var minDivs = this.targetWindow.$('#min-divs');
	var _w = 0;
	if(minDivs.length<=0){
		htmlStr +="<div id='min-divs' class='absolute' style='left:10px;bottom:33px;z-index:"+(this.zIndex+1)+";'>";
	}else{
		_w = minDivs.children().length;
	}
    htmlStr += "<div id='" + this.id + "_div_min' class='dialog_box_min absolute' style='left:"+_w*150+"px'>";
	    //main
	    htmlStr += "<div id='" + this.id + "_main_min' class='dialog_main absolute' style='width:150px'>";
		    //header
		    htmlStr += "<div id='" + this.id + "_main_head_min' class='dialog_main_head'>";
			    htmlStr += "<span id='" + this.id + "_title_min' class='dialog_title left' style='width:50px;  white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>" + this.title + "</span>";
				htmlStr+="<span id='" + this.id + "_close_min' class='dialog_close right' title='" + this.closeTitle + "'></span>";
				
				if(this.maxParam){
					htmlStr+="<span id='" + this.id + "_auto_min' class='dialog_auto right' title='" + this.autoTitle + "'></span>";
				}
				
		    htmlStr += "</div>";//header
	    htmlStr += "</div>";
	    //main
    htmlStr += "</div>";
	if (minDivs.length <= 0) {
		htmlStr += "</div>";
		this.targetWindow.$("body").prepend(htmlStr);
	}else{
		minDivs.append(htmlStr);
	}
	
	//关闭按钮
	var self = this;
	this.targetWindow.$("#"+this.id+"_close_min").click(function(){
		self.closeMin();
	});
	if(this.maxParam){
		this.targetWindow.$("#"+this.id+"_auto_min").click(function(){
			self.autoMinfn();
		});
	}
}
MxtDialog.prototype.ifMax = function () {//弹出窗口高度和宽度不超过浏览器窗口的可视宽度和高度
    if (this.checkMax == false) {
        return;
    }
	var _w_window = this.targetWindow.document.body.clientWidth-40;
	var _h_window = this.targetWindow.document.documentElement.clientHeight-80;
	var _w_temp = this.width;
	var _h_temp = this.height;
	this.width= _w_temp > _w_window ? _w_window : _w_temp;
	this.height= _h_temp > _h_window ? _h_window : _h_temp;
}
MxtDialog.prototype.maxfn = function(){
	var _w = this.targetWindow.$(window).width();
	var _h = this.targetWindow.document.documentElement.clientHeight-(this.isHead?70:40);
	
	this.targetWindow.$('#'+this.id+'_main').width(_w);
	this.targetWindow.$('#'+this.id+'_shadow').width(_w+ this.borderSize * 2).height(_h + this.borderSize * 2 + this.headerHeight + this.footerHeight);
	this.targetWindow.$('#'+this.id+'_main_body').width(_w).height(_h);
	this.targetWindow.$('#'+this.id+'_main_iframe').width(_w).height(_h);

	if (this.url != '') {
		this.targetWindow.$('#'+this.id+'_main_iframe_content').css({
			'width':(_w-22)+'px',
			'height':(_h-22)+'px'
		});
	}else{
		this.targetWindow.$('#'+this.id+'_main_iframe_div').width(_w-22).height(_h-22);
	}
	
	this.targetWindow.$('#'+this.id).css({
		'top':'0px',
		'left':'0px'
	});
	
	var self = this;
	this.targetWindow.$('#'+this.id+'_max').addClass("dialog_auto").unbind('click').click(function(){
		self.autofn();
	}).click(this.maxParam.handler);
}
MxtDialog.prototype.autofn = function(){
	var _w = this.width;
	var _h = this.height;
	
	this.targetWindow.$('#'+this.id+'_main').width(_w);
	this.targetWindow.$('#'+this.id+'_shadow').width(_w+ this.borderSize * 2).height(_h + this.borderSize * 2 + this.headerHeight + this.footerHeight);
	this.targetWindow.$('#'+this.id+'_main_body').width(_w).height(_h);
	this.targetWindow.$('#'+this.id+'_main_iframe').width(_w).height(_h);
	
	if (this.url != '') {
		this.targetWindow.$('#'+this.id+'_main_iframe_content').width(_w-22).height(_h-22);
	}else{
		this.targetWindow.$('#'+this.id+'_main_iframe_div').width(_w-22).height(_h-22);
	}
	
	this.targetWindow.$('#'+this.id).css({
		'top':this.top+'px',
		'left':this.left+'px'
	});
	
	var self = this;
	this.targetWindow.$('#'+this.id+'_max').removeClass("dialog_auto").unbind('click').click(function(){
		self.maxfn();
	}).click(this.maxParam.handler);
}
MxtDialog.prototype.removeMinDiv = function(){
	var minDivs = $('#min-divs');
	if(minDivs.length>0){
		if(minDivs.children().length == 0){
			minDivs.remove();
		}
	}
}
MxtDialog.prototype.autoMinfn = function(){
	this.targetWindow.$('#'+this.id+'_div_min').remove();
	this.targetWindow.$('#'+this.id).show();
	this.targetWindow.$('#'+this.id+'_mask').show();
	this.removeMinDiv();
}
MxtDialog.prototype.reSize = function (json) {
    var _client_width = this.targetWindow.document.body.clientWidth;
	var _client_Height =  document.documentElement.clientHeight;
	if(json.cHeight){
		_client_Height = json.cHeight;
	}
	if(json.cWidth){
		_client_width = json.cWidth;
	}
    var _w = json.width;
    var _h = json.height;
    var _left = (_client_width - (_w + this.borderSize * 2 + 5)) / 2;
    var _top = (_client_Height - (_h + this.borderSize * 2 + 15 + 5)) / 2;
    if(_top<0)_top=0;
	if(this.buttons.length == 0){this.footerHeight = 0};
	//防止resize超出屏幕
	if ((_h + _top) > this.targetWindow.$(window).height()*1) {
		_h = this.targetWindow.$(window).height()*1 - _top - 30;
	};

    this.targetWindow.$('#' + this.id + '_main').width(_w);
    this.targetWindow.$('#' + this.id + '_shadow').width(_w + this.borderSize * 2).height(_h + this.borderSize * 2 + this.headerHeight + this.footerHeight);
    this.targetWindow.$('#' + this.id + '_main_body').width(_w).height(_h);
    this.targetWindow.$('#' + this.id + '_main_iframe').width(_w).height(_h);
	this.targetWindow.$('#' + this.id + '_iframe_shadow').width(_w).height(_h);
	
	
    if (this.url != '') {
        this.targetWindow.$('#' + this.id + '_main_iframe_content').css({
            'width': _w + 'px',
            'height': _h + 'px'
        });
    } else {
        this.targetWindow.$('#' + this.id + '_main_iframe_div').width(_w).height(_h);
    }
    this.targetWindow.$(".dialog_title").width(_w - 100);
    if(json.positionFix != true) {
	    this.targetWindow.$('#' + this.id).css({
	        left: _left + "px",
	        top: _top + "px"
	    });
    };
}
MxtDialog.prototype.getReturnValue = function(json){
	if(json == null){json = {};}
	var iframeId = this.id+"_main_iframe_content";
	var index = null;
	var topWindow = this.targetWindow;
	var win = topWindow.document.getElementById(iframeId);
	if(win!=null){
		var returnValues = null;
		if(win.contentWindow && typeof(win.contentWindow.OK) == "function"){
			returnValues = win.contentWindow.OK(json); 
		}else{
			return null;
		}
		return returnValues;
	}else{
		return null;
	}
}
MxtDialog.prototype.getMin = function(json){
	if(json == null){json = {};}
	var iframeId = this.id+"_main_iframe_content";
	var index = null;
	var topWindow = this.targetWindow;
	var win = topWindow.document.getElementById(iframeId);
	if(win!=null){
		var returnValues = null;
		if(win.contentWindow){
			returnValues = win.contentWindow.MIN(json); 
		}else{
			returnValues = win.MIN(json); 
		}
		return returnValues;
	}else{
		return null;
	}
}
MxtDialog.prototype.getMax = function(json){
	if(json == null){json = {};}
	var iframeId = this.id+"_main_iframe_content";
	var index = null;
	var topWindow = this.targetWindow;
	var win = topWindow.document.getElementById(iframeId);
	if(win!=null){
		var returnValues = null;
		if(win.contentWindow){
			returnValues = win.contentWindow.MAX(json); 
		}else{
			returnValues = win.MAX(json); 
		}
		return returnValues;
	}else{
		return null;
	}
}
MxtDialog.prototype.getClose = function(json){
	if(json == null){json = {};}
	var iframeId = this.id+"_main_iframe_content";
	var index = null;
	var topWindow = this.targetWindow;
	var win = topWindow.document.getElementById(iframeId);
	if(win!=null){
		var returnValues = null;
		if(win.contentWindow){
			returnValues = win.contentWindow.CLOSE(json); 
		}else{
			returnValues = win.CLOSE(json); 
		}
		return returnValues;
	}else{
		return null;
	}
}

MxtDialog.prototype.getWidth = function(){
	return this.targetWindow.$('#'+this.id+'_main_iframe_content').css('width');
}		
MxtDialog.prototype.getHeight = function(){
	return this.targetWindow.$('#'+this.id+'_main_iframe_content').css('height');
}	

MxtDialog.prototype.getTransParams = function(){
	return this.transParamsCopy;
}	


MxtDialog.prototype.reloadUrl = function (url) {
    var _url = url;
    _url ? null : _url = this.url;
    this.targetWindow.$('#' + this.id + '_main_iframe_content').attr("src", _url);
    var temp = $('#'+this.id+'_main_iframe_content',this.targetWindow.document);
	if(temp.size()>0 && temp[0].contentWindow){
		try{
	        if(temp[0].contentWindow.parentDialogObj == undefined)temp[0].contentWindow.parentDialogObj = new Object();
	        eval("temp[0].contentWindow.parentDialogObj['" + this.id + "'] = this;");
		}catch(e){}
    }
    if(temp.size()>0 && this.transParams!=undefined){
		try{
			if(!this.isFromModle){
				this.transParamsCopy = this.transParams;
				temp[0].contentWindow.dialogArguments = this.transParams;
			}else{
				this.transParamsCopy = this.transParams;
				temp[0].contentWindow.transParams = this.transParams;
			}
		}catch(e){
			this.transParamsCopy = this.transParams;
			temp[0].contentWindow.transParams = this.transParams;
		}
    }
}
MxtDialog.prototype.setTitle = function(newtitle){
    this.targetWindow.$('#' + this.id + '_title').html(newtitle);
}	
MxtDialog.prototype.hideDialog = function(){
  this.targetWindow.$("#" + this.id + "_main_iframe_content").attr('src','');
  this.targetWindow.$("#" + this.id + "_mask").hide();
  this.targetWindow.$("#" + this.id).hide();
  this.officeAction(true);
} 
MxtDialog.prototype.showDialog = function(){
  this.targetWindow.$("#" + this.id + "_main_iframe_content").attr('src',this.url);
  this.targetWindow.$("#" + this.id + "_mask").show();
  this.targetWindow.$("#" + this.id).show();
  this.officeAction(false);
} 
MxtDialog.prototype.getObjectById = function(id){
    return this.targetWindow?this.targetWindow.$('#'+id):null;
}  
MxtDialog.prototype.getObjectByClass = function(className){
  return this.targetWindow?this.targetWindow.$('.'+className):null;
}
MxtDialog.prototype.startLoading = function(options){
	if(this.targetWindow) this.targetWindow.$("#" + this.id+"_main_iframe").show();
} 
MxtDialog.prototype.endLoading = function(){
    if(this.targetWindow) this.targetWindow.$("#" + this.id+"_main_iframe").hide();
} 
/**消息窗口**/
function MxtMsgBox(options){
    this.id = options.id ? options.id : Math.floor(Math.random() * 100000000);
    this.title = options.title ? options.title : 'MessageBox';
	this.type = options.type ? options.type : 0;
    this.msg = options.msg ? options.msg : '';
    this.buttons = options.buttons ? options.buttons : [];
    this.width = options.width ? options.width : 350;
    this.height = options.height ? options.height : 120;
    this.isDrag = options.isDrag ? options.isDrag : true;
    this.borderSize = 1;//边框尺寸(像素)
    //this.closeTitle = options.closeTitle ? options.closeTitle : 'close';//鼠标移上去时的提示文字
    this.closeTitle = options.closeTitle ? options.closeTitle : $.i18n('common.button.close.label');//鼠标移上去时的提示文字
    this.submitText = options.submitText ? options.submitText : 'submit';
	
	this.headerHeight = 32;
    this.footerHeight = 40;
	
	this.imgType = options.imgType==null ? null :options.imgType;
	
	//$.i18n('validate.notJson.js')
    this.okText = options.okText ? options.okText : $.i18n('message.ok.js');
    this.cancelText = options.cancelText ? options.cancelText : $.i18n('message.cancel.js');
	this.yesText = options.yesText ? options.yesText : $.i18n('message.yes.js');
	this.noText = options.noText ? options.noText : $.i18n('message.no.js');
	this.retryText = options.retryText ? options.retryText : $.i18n('message.retry.js');
	this.detailText = options.detailText ? options.detailText : $.i18n('message.detail.js');
	
	
	this.ok_fn = options.ok_fn ? options.ok_fn : null;//点击确定后执行的函数
	this.cancel_fn = options.cancel_fn ? options.cancel_fn : null;//点击取消后执行的函数
	this.yes_fn = options.yes_fn ? options.yes_fn : null;//点击是后执行的函数
	this.no_fn = options.no_fn ? options.no_fn : null;//点击否后执行的函数
	this.retry_fn = options.retry_fn ? options.retry_fn : null;//点击重试后执行的函数
	this.detail_fn = options.detail_fn ? options.detail_fn : null;//点击详情后执行的函数
	this.close_fn = options.close_fn ? options.close_fn : null;//点击右上角X后执行的函数
	this.close_show = options.close_show ? options.close_show : true;//右上角X,显示
	this.zIndex = 5000;
	this.isFrountEvent = options.isFrountEvent ? options.isFrountEvent : false;//点击详情后执行的函数;
	this.targetWindow = options.targetWindow == null ? getCtpTop() : options.targetWindow;
	this.bottomHTML = options.bottomHTML;
	this._zoomParam = 1;//getCtpTop()._zoomParam;
	if(this._zoomParam == null || this._zoomParam == undefined)this._zooParam=1;
	//this.targetWindow = window.top;
	//var mainobj = window.top.document.getElementById('main');
	//if(mainobj){
	//    this.targetWindow = window.top.document.getElementById('main').contentWindow;
	//	this.isDrag = false;
	//}else{
		//this.targetWindow = window; //修改targetWindow:window.parent无效 byxiexp
	//	this.isDrag = true;
	//}
    this.init();
    this.drag();

    var _this = this;
    $(document).keyup(function (e) {
        if ($('#' + _this.id)) {
            if (e.keyCode == 27) {//ESC
                _this.close();
            }
        }
    })
}

MxtMsgBox.prototype.init = function(){
    //遮罩id
    var maskId = this.id + "_mask";
    
    //获取客户端页面宽高
    var _client_width = this.targetWindow.document.body.clientWidth;
    var _client_height = (this.targetWindow.document.documentElement.scrollHeight>this.targetWindow.document.documentElement.clientHeight?this.targetWindow.document.documentElement.scrollHeight:this.targetWindow.document.documentElement.clientHeight);
    
	//dialog层级叠加
	var masks =  this.targetWindow.$('.mask,.shield,.projectTask_detailDialog_box');
	if(masks.size()>0){
		this.zIndex = parseInt(masks.eq(0).css('z-index'));
		this.zIndex = this.zIndex+2;
	}
	
    //遮罩
    if (typeof($("#" + maskId)[0]) == "undefined") {
        this.targetWindow.$('body').prepend("<div id='" + maskId + "' class='mask' style='width:" + _client_width + "px;height:" + _client_height + "px;z-index:"+this.zIndex+";zoom:"+(this._zoomParam==null?1:this._zoomParam)+";'>&nbsp;</div>");
    }
    //判断是否存在.存在就先移处
    if (typeof($("#" + this.id)[0]) != "undefined") {
        this.targetWindow.$("#" + this.id).remove();
    }
	
    //制作dialog
    var htmlStr = "";
    var _left = (_client_width - (this.width + this.borderSize * 2 + 5)) / 2;
    var _top = (this.targetWindow.document.documentElement.clientHeight - (this.height + this.borderSize * 2 + this.headerHeight + this.footerHeight + 5)) / 2;
    
	if(_top<=0){
      _top = ($(document.body).height() - (this.height + this.borderSize * 2 + this.headerHeight + this.footerHeight + 5)) / 2;
    }
	
    //left 边框*2 阴影5
    //top 边框*2 阴影5 header30 bottom50
    htmlStr += "<div id='" + this.id + "' class='dialog_box absolute' style='z-index:"+(this.zIndex+2)+";left:" + ((_left < 0 ? 0 : _left) + this.targetWindow.document.documentElement.scrollLeft) + "px;top:" + ((_top < 0 ? 0 : _top) + this.targetWindow.document.documentElement.scrollTop) + "px;zoom:"+(this._zoomParam==null?1:this._zoomParam)+";'>";
    //阴影
    htmlStr += "<div id='" + this.id + "_shadow' class='dialog_shadow absolute' style='width:" + (this.width + this.borderSize * 0) + "px;height:" + (this.height + this.borderSize * 0  + this.footerHeight) + "px;top:0px;left:0px;'>&nbsp;</div>"
    //iframe 遮挡office插件
    htmlStr += "<iframe id='" + this.id + "_iframe_shadow' class='absolute' style='width:" + this.width+ "px;height:" + (this.height + this.headerHeight + this.footerHeight) + "px;border:0'></iframe>"
	
	    //main
	    htmlStr += "<div id='" + this.id + "_main' class='dialog_main absolute' style='width:" + this.width + "px;border:0px;background:#fff;'>";
		    //header
		    htmlStr += "<div id='" + this.id + "_main_head' class='dialog_main_head' style='background:#fff;'>";
		    //htmlStr += "<span id='" + this.id + "_title' class='dialog_title left'>" + this.title + "</span>";
		        if (this.close_show) {
		            //htmlStr += "<span id='" + this.id + "_close' class='dialog_close right' title='" + this.closeTitle + "'></span>";
		        }
			    //htmlStr += "<div class='clear'></div>";
		    htmlStr += "</div>";//header
		   
		   
	   		if (this.close_show) {
	            htmlStr += "<span id='" + this.id + "_close' class='dialog_close_msg' title='" + this.closeTitle + "'></span>";
	        }
		   
		    //body
		    htmlStr += "<div id='" + this.id + "_main_body' class='dialog_main_body left' style='width:" + this.width + "px;height:" + this.height + "px'>";
			    //iframe 遮罩层
			    htmlStr += "<div id='" + this.id + "_main_iframe' class='dialog_main_iframe absolute' style='top:" + this.headerHeight + "px;width:" + this.width + "px;height:" + this.height + "px;display:none;'>&nbsp;</div>";
			    
			    //iframe 容器
			    htmlStr += "<div id='" + this.id + "_main_content' class='dialog_main_content absolute'>";
					//12:[上下内外边距各10(5+5) 左右内外边距各10(5+5) 上下边框 1+1 左右边框 1+1]
					htmlStr+="<div class='dialog_main_content_html ' style='width:"+(this.width)+"px;height:"+(this.height)+"px;overflow:auto;border:0px;'>";
						htmlStr+="<table width='90%' class='margin_t_20' style='font-size:12px;'><tr>";
						
						//显示提示信息图片
						if(this.imgType!= null){
						    htmlStr += "<td valign='top' width='24' class='padding_l_20'><span class='msgbox_img_" + this.imgType + "'></span>";
							htmlStr += "</td>";
						}
						//显示提示信息内容
						htmlStr += "<td class='msgbox_content padding_l_10' style='padding-right:15px;'>";
						htmlStr += this.msg;
						htmlStr += "</td>";
						
						htmlStr+="</tr></table>";
					htmlStr+="</div>";
			    htmlStr += "</div>";
				
		    htmlStr += "</div>";
		    //body
		    
		    //bottom
			htmlStr += "<div id='" + this.id + "_main_footer' class='dialog_main_footer left align_right padding_t_10 w100b' style='background:#4d4d4d'>";
			if (this.bottomHTML != undefined) {
				htmlStr += '<span class="left margin_l_10 margin_t_5 font_size12">' + this.bottomHTML + '</span>';
			};
			htmlStr += '<span class="right">';
			switch(this.type){
			   case 0:
				 htmlStr+="<a  id='ok_msg_btn_first'  class='common_button common_button_emphasize margin_r_10 hand'>"+this.okText+"</a>";
			     break
			   case 1:
				 htmlStr+="<a  id='ok_msg_btn_first'   class='common_button common_button_emphasize margin_r_10 hand'>"+this.okText+"</a>";
				 htmlStr+="<a  id='cancel_msg_btn'  class='common_button common_button_gray margin_r_10 hand'>"+this.cancelText+"</a>";
			     break
			   case 2:
				 htmlStr+="<a  id='yes_msg_btn'   class='common_button common_button_emphasize margin_r_10 hand'>"+this.yesText+"</a>";
				 htmlStr+="<a  id='no_msg_btn'   class='common_button common_button_gray margin_r_10 hand'>"+this.noText+"</a>";
				 htmlStr+="<a  id='cancel_msg_btn'   class='common_button common_button_gray margin_r_10 hand'>"+this.cancelText+"</a>";
			     break
			   case 3:
				 htmlStr+="<a  id='yes_msg_btn'   class='common_button common_button_emphasize margin_r_10 hand'>"+this.yesText+"</a>";
				 htmlStr+="<a  id='no_msg_btn'  class='common_button common_button_gray margin_r_10 hand'>"+this.noText+"</a>";
			     break 
			   case 4:
				 htmlStr+="<a  id='retry_msg_btn'   class='common_button common_button_emphasize margin_r_10 hand'>"+this.retryText+"</a>";
				 htmlStr+="<a  id='cancel_msg_btn'  class='common_button common_button_gray margin_r_10 hand'>"+this.cancelText+"</a>";				 
			     break
			   case 5:
				 htmlStr+="<a  id='ok_msg_btn_first'  class='common_button common_button_emphasize margin_r_10 hand'>"+this.okText+"</a>";
				 htmlStr+="<a  id='detail_msg_btn'   class='common_button common_button_gray margin_r_10 hand'>"+this.detailText+"</a>";
			     break
				case 100:
				  //自定义按钮
				  if (this.buttons.length > 0) {
				  	for (var i = 0; i < this.buttons.length; i++) {
				  		var jsonTemp = this.buttons[i];
				  		if(i == 0){
							htmlStr+="<a  id='"+jsonTemp.id+"_btn'   class='common_button common_button_emphasize margin_r_10 hand' title='"+jsonTemp.text+"'>"+jsonTemp.text+"</a>";
				  		}else{
				  			htmlStr+="<a  id='"+jsonTemp.id+"_btn'   class='common_button common_button_gray margin_r_10 hand' title='"+jsonTemp.text+"'>"+jsonTemp.text+"</a>";
				  		}
					}
				}
				break
			   default:
			   	 htmlStr+="<a  id='ok_msg_btn_first'   class='common_button common_button_gray margin_r_10 hand'>"+this.okText+"</a>";
		    }
		    htmlStr += '</span>';
			htmlStr += "</div>";
			//bottom
	    htmlStr += "</div>";
	    //main
    htmlStr += "</div>";
	this.officeAction(false);
    this.targetWindow.$("body").prepend(htmlStr);	
	
	//关闭按钮
	var self = this;
	this.targetWindow.$('#' + this.id + '_close').click(function(){
		self.close();
	}).click(this.close_fn);

	switch(this.type){
	   case 0:
	   	 if(!this.isFrountEvent){
		 	 this.targetWindow.$('#ok_msg_btn_first').click(function(){self.close()}).click(this.ok_fn);
		 }else{
		 	 this.targetWindow.$('#ok_msg_btn_first').click(this.ok_fn).click(function(){self.close()});
		 }	
	     break
	   case 1:
	     if (!this.isFrountEvent) {
			 this.targetWindow.$('#ok_msg_btn_first').click(function(){self.close()}).click(this.ok_fn);
			 this.targetWindow.$('#cancel_msg_btn').click(function(){self.close()}).click(this.cancel_fn);
		 }else{
			 this.targetWindow.$('#ok_msg_btn_first').click(this.ok_fn).click(function(){self.close()});
			 this.targetWindow.$('#cancel_msg_btn').click(this.cancel_fn).click(function(){self.close()});
		 }
	     break
	   case 2:
	   	 if (!this.isFrountEvent) {
		 	  this.targetWindow.$('#yes_msg_btn').click(function(){self.close()}).click(this.yes_fn);
			  this.targetWindow.$('#no_msg_btn').click(function(){self.close()}).click(this.no_fn);
			  this.targetWindow.$('#cancel_msg_btn').click(function(){self.close()}).click(this.cancel_fn);
		 }else{
		 	  this.targetWindow.$('#yes_msg_btn').click(this.yes_fn).click(function(){self.close()});
			  this.targetWindow.$('#no_msg_btn').click(this.no_fn).click(function(){self.close()});
			  this.targetWindow.$('#cancel_msg_btn').click(this.cancel_fn).click(function(){self.close()});
		 }	
	     break
	   case 3:
	   	 if (!this.isFrountEvent) {
		 	  this.targetWindow.$('#yes_msg_btn').click(function(){self.close()}).click(this.yes_fn);
			  this.targetWindow.$('#no_msg_btn').click(function(){self.close()}).click(this.no_fn);
		 }else{
		 	  this.targetWindow.$('#yes_msg_btn').click(this.yes_fn).click(function(){self.close()});
			  this.targetWindow.$('#no_msg_btn').click(this.no_fn).click(function(){self.close()});
		 }	
	     break 
	   case 4:
	     if (!this.isFrountEvent) {
		 	 this.targetWindow.$('#retry_msg_btn').click(function(){self.close()}).click(this.retry_fn);
			 this.targetWindow.$('#cancel_msg_btn').click(function(){self.close()}).click(this.cancel_fn);
		 }else{
		 	 this.targetWindow.$('#retry_msg_btn').click(this.retry_fn).click(function(){self.close()});
			 this.targetWindow.$('#cancel_msg_btn').click(this.cancel_fn).click(function(){self.close()});
		 }
	     break
	   case 5:
	     if (!this.isFrountEvent) {
			 this.targetWindow.$('#ok_msg_btn_first').click(function(){self.close()}).click(this.ok_fn);
			 this.targetWindow.$('#detail_msg_btn').click(function(){self.close()}).click(this.detail_fn);
		 }else{
			 this.targetWindow.$('#ok_msg_btn_first').click(this.ok_fn).click(function(){self.close()});
			 this.targetWindow.$('#detail_msg_btn').click(this.detail_fn).click(function(){self.close()});
		 }
	     break
		case 100:
		  //自定义按钮
		  if (this.buttons.length > 0) {
		  	for (var i = 0; i < this.buttons.length; i++) {
		  		var jsonTemp = this.buttons[i];
		  		if (!this.isFrountEvent) {
		  			//关闭窗口后执行自定义方法 	
					this.targetWindow.$('#'+jsonTemp.id+'_btn').click(function(){self.close()}).click(jsonTemp.handler);
				}else {
					//执行自定义方法后关闭窗口
					this.targetWindow.$('#'+jsonTemp.id+'_btn').click(jsonTemp.handler).click(function(){self.close()});
				}
			};
		}
		break
	   default:
	   	 if(!this.isFrountEvent){
		 	 //关闭窗口后执行自定义方法 	
		   	 this.targetWindow.$('#ok_msg_btn_first').click(function(){self.close()}).click(this.ok_fn);
		 }else{
		 	 //执行自定义方法 	后 关闭窗口
			 this.targetWindow.$('#ok_msg_btn_first').click(this.ok_fn).click(function(){self.close()});
		 }
    }
	if(this.targetWindow.$('#ok_msg_btn_first').size()>0){
		this.targetWindow.$('#ok_msg_btn_first').parent().focus();
	}
}
MxtMsgBox.prototype.drag = function(){
    if (this.isDrag) {
        //var _dialog = this.targetWindow.$("#" + this.id);
        //var _dialog_m_h = this.targetWindow.$("#" + this.id + "_main_head");
        //if (this.isDrag && this.targetWindow.DragDiv) {
			this.targetWindow.$( "#"+this.id ).draggable({cancel:".dialog_main_content_html,.dialog_main_footer",containment:'body',scroll:false});
            //this.targetWindow.DragDiv.Register(_dialog[0], _dialog_m_h[0]);
        //}
    }
}
MxtMsgBox.prototype.close = function(){
    this.targetWindow.$("#" + this.id + "_mask").remove();
    this.targetWindow.$("#" + this.id).remove();
	this.officeAction(true);
}
MxtMsgBox.prototype.officeAction = function(flag){
	var _officeIframeId = ['officeFrameDiv','zwIframe','mainbodyFrame'];
	var _findWindow = window;
	if($('#componentDiv').size()>0){
		try{
			_findWindow = $('#componentDiv')[0].contentWindow.$('#zwIframe')[0].contentWindow;
		}catch(e){}
	}
	for (var i=0; i<_officeIframeId.length; i++) {
		var _tempid = _officeIframeId[i];
		var _obj = _findWindow.$('#'+_tempid);
		if(_obj.size()>0){
			this.officeIframe = _obj;
			break;
		}
	};
	
	this.qianzhangIframe = $("[classid='clsid:2294689C-9EDF-40BC-86AE-0438112CA439']");
	if(!flag){
		if(this.officeIframe && this.officeIframe.size()>0){
			this.officeIframe.css({
				'visibility':'hidden'
			})
		}
		if(this.qianzhangIframe.size()>0){
			this.qianzhangIframe.css({
				'visibility':'hidden'
			})
		}
		if(getCtpTop().isCtpTop){
			getCtpTop().$.setOffice('hidden');
		}
	}else{
		if(this.officeIframe && this.officeIframe.size()>0){
			this.officeIframe.css({
				'visibility':'visible'
			})
		}
		if(this.qianzhangIframe.size()>0){
			this.qianzhangIframe.css({
				'visibility':'visible'
			})
		}
		if(getCtpTop().isCtpTop){
			getCtpTop().$.setOffice('visible');
		}
	}
}
//
//var DragDiv = function(){
//    
//    //客户端当前屏幕尺寸(忽略滚动条)
//    var _clientWidth;
//    var _clientHeight;
//    
//    //拖拽控制区
//    var _controlObj;
//    //拖拽对象
//    var _dragObj;
//    //拖动状态
//    var _flag = false;
//    
//    //拖拽对象的当前位置
//    var _dragObjCurrentLocation;
//    
//    //鼠标最后位置
//    var _mouseLastLocation;
//    
//    //使用异步的Javascript使拖拽效果更为流畅
//    //var _timer;
//    
//    //定时移动，由_timer定时调用
//    //var intervalMove = function(){
//    //	$(_dragObj).css("left", _dragObjCurrentLocation.x + "px");
//    //	$(_dragObj).css("top", _dragObjCurrentLocation.y + "px");
//    //};
//    
//    var getElementDocument = function(element){
//    	
//        return element.ownerDocument || element.document;
//    };
//    //鼠标按下
//    var dragMouseDownHandler = function(evt){
//    
//        if (_dragObj) {
//        
//            evt = evt || window.event;
//            
//            //获取客户端屏幕尺寸
//            _clientWidth = document.body.clientWidth;
//            _clientHeight = document.documentElement.scrollHeight;
//            
//            //iframe遮罩
//            $("#jd_dialog_m_b_1").css("display", "");
//            
//            //标记
//            _flag = true;
//            
//            //拖拽对象位置初始化
//            _dragObjCurrentLocation = {
//                x: $(_dragObj).offset().left,
//                y: $(_dragObj).offset().top
//            };
//            
//            //鼠标最后位置初始化
//            _mouseLastLocation = {
//                x: evt.screenX,
//                y: evt.screenY
//            };
//            
//            //注：mousemove与mouseup下件均针对document注册，以解决鼠标离开_controlObj时事件丢失问题
//            //注册事件(鼠标移动)			
//            $(document).bind("mousemove", dragMouseMoveHandler);
//            //注册事件(鼠标松开)
//            $(document).bind("mouseup", dragMouseUpHandler);
//            
//            //取消事件的默认动作
//            if (evt.preventDefault) 
//                evt.preventDefault();
//            else 
//                evt.returnValue = false;
//            
//            //开启异步移动
//            //_timer = setInterval(intervalMove, 10);
//        }
//    };
//    
//    //鼠标移动
//    var dragMouseMoveHandler = function(evt){
//        if (_flag) {
//        
//            evt = evt || window.event;
//            
//            //当前鼠标的x,y座标
//            var _mouseCurrentLocation = {
//                x: evt.screenX,
//                y: evt.screenY
//            };
//            
//            //拖拽对象座标更新(变量)
//            _dragObjCurrentLocation.x = _dragObjCurrentLocation.x + (_mouseCurrentLocation.x - _mouseLastLocation.x);
//            _dragObjCurrentLocation.y = _dragObjCurrentLocation.y + (_mouseCurrentLocation.y - _mouseLastLocation.y);
//            
//            //将鼠标最后位置赋值为当前位置
//            _mouseLastLocation = _mouseCurrentLocation;
//            
//            //拖拽对象座标更新(位置)
//            $(_dragObj).css("left", _dragObjCurrentLocation.x + "px");
//            $(_dragObj).css("top", _dragObjCurrentLocation.y + "px");
//            
//            //取消事件的默认动作
//            if (evt.preventDefault) 
//                evt.preventDefault();
//            else 
//                evt.returnValue = false;
//        }
//    };
//    
//    //鼠标松开
//    var dragMouseUpHandler = function(evt){
//        if (_flag) {
//            evt = evt || window.event;
//            
//            //取消iframe遮罩
//            $("#jd_dialog_m_b_1").css("display", "none");
//            
//            //注销鼠标事件(mousemove mouseup)
//            cleanMouseHandlers();
//            
//            //标记
//            _flag = false;
//            
//            //清除异步移动
//            //if(_timer){
//            //	clearInterval(_timer);
//            //	_timer = null;
//            //}
//        }
//    };
//    
//    //注销鼠标事件(mousemove mouseup)
//    var cleanMouseHandlers = function(){
//        if (_controlObj) {
//            $(_controlObj.document).unbind("mousemove");
//            $(_controlObj.document).unbind("mouseup");
//        }
//    };
//    
//    return {
//        //注册拖拽(参数为dom对象)
//        Register: function(dragObj, controlObj){
//            //赋值
//            _dragObj = dragObj;
//            _controlObj = controlObj;
//            //注册事件(鼠标按下)
//            $(_controlObj).bind("mousedown", dragMouseDownHandler);
//        }
//    }
//    
//}();
////-->
