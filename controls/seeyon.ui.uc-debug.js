/**
 * @author macj
 * im聊天窗口
 */

function Mxtchat(options){
	if(options == undefined)options = {};
	this.id = options.id!=undefined ? options.id : Math.floor(Math.random() * 100000000);
	this.zIndex = 500;
	this.width = 514;
	this.height = 510;
	this.bodyHeight = 413;
	this.title = "UC中心"
	this.numberText1 = "您还可以再输入";
	this.numberText2 = "个汉字";
	this.closeTitle = "关闭";
	this.sendTitle = "发送";
	this.minTitle = "最小化";
	this.historyTitle = "消息记录";
	this.groupTitle = "群成员";
	this.defaultLength = 140;
	this.online_msg = "在线消息";
	this.owner = "我",
	
	this.left = options.left!=undefined ? options.left : 100;
	this.top = options.top!=undefined ? options.top : 100;
	
	this.fixRight = options.fixRight!=undefined ? options.fixRight : 100;
	this.fixBottom = options.fixBottom!=undefined ? options.fixBottom : 10;
	
	
	this.isAttach = options.isAttach;
	
	this.currentTabId = null;
	this.lastTabId = null;
	
	this.tabItems = options.tabItems;
	this.isShowHistory = false;
	this.isGroup = false;
	
	if(this.isAttach!=undefined && this.isAttach == true){
		this.createAttach();
	}
	this.initWindow();
	this.dialogtextarea.focus();
	this.addChatTab();
	this.addHistoryTab();
	
	$('#'+this.firstTab).click();
	
	
}
/**
 * 初始化div
 */
Mxtchat.prototype.initWindow = function(){
	var htmlStr = "";
	htmlStr+="<div id='"+this.id+"_container' class='border_all clearfix' style='position:fixed;'>";
		htmlStr+="<div id='"+this.id+"_content' class='absolute page_color clearfix'>";
			htmlStr+="<div id='"+this.id+"_head' class='hidden padding_t_5 padding_b_5 align_right border_b font_size12 clearfix'></div>";
			htmlStr+="<div id='"+this.id+"_left' class='padding_l_10 padding_t_10 left clearfix'>";
				htmlStr+="<div id='"+this.id+"_dialogcontent' class='border_all clearfix'>";
					htmlStr+="<div id='"+this.id+"_dialogcontenthead' class='border_b clearfix common_tabs'><ul id='"+this.id+"_dialogcontentheadul' class='left'></ul></div>";
					htmlStr += "<div id='" + this.id + "_dialogcontentbody' class='clearfix' style='position:relative'></div>";
				htmlStr+="</div>";
				htmlStr+="<div id='"+this.id+"_dialogbar' class='font_size12 clearfix'></div>";
				htmlStr+="<div id='"+this.id+"_dialogtextarea' contentEditable='true' class='border_all imgLength'></div>";
				htmlStr+="<div id='"+this.id+"_dialogbottom' class='font_size12 clearfix'></div>";
			htmlStr+="</div>";
			htmlStr+="<div id='"+this.id+"_right' class='hidden right  border_l clearfix'>";
			htmlStr+="<div id='"+this.id+"_righthead' class='padding_t_5 padding_b_5 clearfix'>";
			htmlStr+="</div>";
			htmlStr+="<div id='"+this.id+"_rightbody' class='margin_l_10 clearfix'>";
				htmlStr+="<div id='"+this.id+"_rightbodyhead' class='border_t  	border_lr clearfix common_tabs'><ul id='"+this.id+"_rightbodyheadul' class='left'></ul></div>";
				htmlStr+="<div id='"+this.id+"_rightbodybody' class='clearfix'>";
					htmlStr+="<div id='"+this.id+"_historytabbody' class='clearfix hidden'>";
						htmlStr+="<div id='"+this.id+"_historytabbodytop' class='border_all clearfix'></div>";
						htmlStr+="<div id='"+this.id+"_historytabbodybottom' class='clearfix'></div>";
					htmlStr+="</div>";
					htmlStr+="<div id='"+this.id+"_grouptabbody' class='border_all clearfix hidden'></div>";
				htmlStr+="</div>";
			htmlStr+="</div>";
			htmlStr+="</div>";
		htmlStr+="</div>";
		htmlStr+="<iframe id='"+this.id+"_iframe' class='absolute'></iframe>";
	htmlStr+="</div>";
	$("body").prepend(htmlStr);
	
	this.container = $('#'+this.id+'_container');
	this.content = $('#'+this.id+'_content');
	this.head = $('#'+this.id+'_head');
	this.left = $('#'+this.id+'_left');
	this.right = $('#'+this.id+'_right');
	this.iframe = $('#'+this.id+'_iframe');
	
	this.dialogcontent = $('#'+this.id+'_dialogcontent');
	
	this.dialogcontenthead = $('#'+this.id+'_dialogcontenthead');
	this.dialogcontentheadul = $('#'+this.id+'_dialogcontentheadul');
	this.dialogcontentbody = $('#'+this.id+'_dialogcontentbody');
	
	this.dialogbar = $('#'+this.id+'_dialogbar');
	this.dialogtextarea = $('#'+this.id+'_dialogtextarea');
	this.dialogbottom = $('#'+this.id+'_dialogbottom');
	
	this.righthead = $('#'+this.id+'_righthead');
	this.rightbody = $('#'+this.id+'_rightbody');
	
	this.rightbodyhead = $('#'+this.id+'_rightbodyhead');
	this.rightbodyheadul = $('#'+this.id+'_rightbodyheadul');
	
	this.rightbodybody = $('#'+this.id+'_rightbodybody');
	this.grouptabbody = $('#'+this.id+'_grouptabbody');
	this.historytabbody = $('#'+this.id+'_historytabbody');
	
	this.historytabbodytop = $('#'+this.id+'_historytabbodytop');
	this.historytabbodybottom = $('#'+this.id+'_historytabbodybottom');
	
	this.rightbodybottom = $('#'+this.id+'rightbodybottom');
	
	if(this.isAttach){
		var bottom = $("#"+this.id+"_onlineHeight").height()+this.fixBottom-1;
		this.container.css({
			'z-index':this.zIndex,
			'bottom':bottom,
			'right':this.fixRight,
			'width':this.width,
			'height':this.height,
			'overflow':'hidden'
		});
	}else{
		this.container.css({
			'z-index':this.zIndex,
			'top':this.top,
			'left':this.left,
			'width':this.width,
			'height':this.height,
			'overflow':'hidden'
		});
	}
	this.content.css({
		'top':'0px',
		'left':'0px',
		'z-index':2,
		'width':this.width,
		'height':this.height
	});
	this.iframe.css({
		'top':'0px',
		'left':'0px',
		'z-index':1,
		'width':this.width,
		'height':this.height
	});
	this.head.css({
		'width':this.width
	});
	this.left.css({
		'width':this.width-10,
		'height':this.bodyHeight-10
	});
	this.right.css({
		'width':298,
		'height':this.bodyHeight,
		'background':'#d8d8d8',
		'overflow':'hidden'
	});
	
	this.righthead.css({
		'width':298
	});
	this.rightbody.css({
		'width':276,
		'height':this.bodyHeight-40,
		'background':'#ffffff'
	});
	
	this.rightbodyhead.css({
		'width':276,
		'height':24
	});
	
	
	this.rightbodybody.css({
		'width':276,
		'height':this.bodyHeight-100
	});
	
	
	this.grouptabbody.css({
		'width':276,
		'height':this.bodyHeight-66,
		'overflow':'auto'
	});
	this.historytabbody.css({
		'width':276,
		'height':this.bodyHeight-60,
		'overflow':'hidden'
	});
	
	this.historytabbodytop.css({
		'width':276,
		'height':this.bodyHeight-100,
		'overflow':'auto'
	});
	this.historytabbodybottom.css({
		'width':276,
		'height':45,
		'background':'#d8d8d8',
		'overflow':'hidden'
	});
	
	this.dialogcontent.css({
		'width':this.width-22,
		'height':353,
		'background':'#fff'
	});
	this.dialogcontenthead.css({
		'width':this.width-22,
		'height':24,
		'overflow':'hidden'
	});
	this.dialogcontentbody.css({
		'width':this.width-22,
		'height':329,
		'overflow':'auto',
		'overflow-x':'hidden'
	});
	
	this.dialogbar.css({
		'width':this.width-20,
		'height':26
	});
	this.dialogtextarea.css({
		'width':this.width-32,
		'height':64,
		'background':'#fff',
		'overflow':'auto',
		'padding':'5px',
		'word-wrap':'break-word'
	});
	this.dialogbottom.css({
		'width':this.width-20,
		'height':46
	});
	
	var self = this;
	
	$("<a id='"+this.id+"_uc' class='margin_r_10 font_size12 hand'>"+this.title+"</a>").click(function(){
		if(window.opener)window.opener.focus();
	}).appendTo(this.head);
	$("<span id='"+this.id+"_min' class='ico16 minimize_16  margin_r_5'></span>").click(function(){
		self.minChat();
	}).appendTo(this.head);
	$("<span id='"+this.id+"_close' class='ico16 gray_close_16  margin_r_5'></span>").click(function(){
		self.minChat();
	}).appendTo(this.head);	
	
	
	$("<a  id='"+this.id+"_face' class='img-button  left' href='javascript:void(0)' style='padding-left:0;margin-top:2px;'><em class='ico16 face_16  margin_r_5'></em>表情</a>").click(function(){
		new MxtFace({
			'clickFn':function(){
				self.checkNumber();
			},
			'fixObj':self.id+'_face',
			'target':self.id+'_dialogtextarea',
			top:200,
			left:200,
			isUp:true
		});
		
	}).appendTo(this.dialogbar);
	
	$("<a class='img-button  left' href='javascript:void(0)' style='padding-left:0;margin-top:2px;'><em class='ico16 affix_16 margin_r_5'></em>文件</a>").click(function(){
		
	}).appendTo(this.dialogbar);
	$("<span class='ico16 signature_16 left' style='margin-top:5px;'></span>").click(function(){
		
	}).appendTo(this.dialogbar);
	$("<a class='img-button  right' href='javascript:void(0)' style='padding-right:0;margin-top:2px;'><em class='ico16 no_through_ico_16 margin_r_5'></em>消息记录</a>").click(function(){
		self.showHistory();
	}).appendTo(this.dialogbar);
	
	$("<span class='left font_size12 margin_t_5 font_size12' style='color:#888888'>"+this.numberText1+"<span id='"+this.id+"_number'>"+this.defaultLength+"</span>"+this.numberText2+"</span>").appendTo(this.dialogbottom);
	
	
	$("<a id='"+this.id+"_send' class='common_button common_button_gray margin_t_10 right' style='cursor:pointer;'>"+this.sendTitle+"</a>").click(function(){
		self.sendMessage();
	}).appendTo(this.dialogbottom);
	
	$("<a id='"+this.id+"_close' class='common_button common_button_gray margin_t_10 margin_r_10 right' style='cursor:pointer;'>"+this.closeTitle+"</a>").click(function(){
		self.minChat();
	}).appendTo(this.dialogbottom);
	
	
	$("<span class='ico16 gray_close_16 right margin_r_10'></span>").click(function(){
		self.showHistory();
	}).appendTo(this.righthead);
	$("<span class='font_size12'><span class='ico16 month_16 margin_l_10 margin_r_5'></span>查找</span>").appendTo(this.righthead);
	
	this.dialogtextarea.keyup(function(){
		self.checkNumber();
	});
	
}
Mxtchat.prototype.checkNumber = function(){
	var _html = this.dialogtextarea.text();
	var _face = $(".imgLength img").length;
	var newNumber = this.defaultLength-_html.length-_face;
	if(newNumber < 0){
		newNumber = 0;
		var newHtml = _html.substr(0,this.defaultLength);
		this.dialogtextarea.text(newHtml);
	}
	$('#'+this.id+'_number').html(newNumber);
}
/**
 * 最小化div
 */
Mxtchat.prototype.minChat = function(){
	this.container.hide();
}
/**
 * 最大化div
 */
Mxtchat.prototype.maxChat = function(){
	this.container.show();
}
/**
 * 设置是否显示UC中心
 */
Mxtchat.prototype.setUcCenter = function(){
	$('#'+this.id+'_uc').hide();
}

Mxtchat.prototype.addSingleTab = function(item){
	if(item){
		var self = this;
		this.dialogcontentbody.append("<div id='"+item.id+"_body' class='hidden dialogcontentbody_content'></div>");
	    this.dialogcontentheadul.append("<li id='" + item.id + "' class='display_block left'><a hidefocus='true' href='javascript:void(0)' class='last_tab' style='border-top:0px;border-left:0px;border-bottom:0px;width:57px;'><span class='ico16 correlation_form_16'></span>" + item.name + "</a><span class='pageChatTabsClose_box'><span class='pageChatTabsClose'><span class='ico16 for_close_16'></span></span></span></li>");
		//匿名函数 闭包 内部函数
		(function(obj){
			$('#'+obj.id).click(function(){
				self.resetChatContent(obj);
			});
			$('#' + obj.id + " .pageChatTabsClose").unbind().click(function () {
			    self.removeChatTab(obj.id);
			})
		})(item);
	}
}


/**
 * 添加聊天页签
 */
Mxtchat.prototype.addChatTab = function(){
	if(this.tabItems != undefined && this.tabItems.length>0){
		this.moreArray =[];
		var self = this;
		this.firstTab = null;
		for (var i=0; i<this.tabItems.length; i++) {
			var item = this.tabItems[i];
			if(i==0){
				this.firstTab = item.id;
			}
			if(i==2){
				this.lastTabId = item.id;
			}
			this.dialogcontentbody.append("<div id='"+item.id+"_body' class='hidden dialogcontentbody_content'></div>");
			if(i<3){
			    this.dialogcontentheadul.append("<li id='" + item.id + "' class='display_block left'><a hidefocus='true' href='javascript:void(0)' class='last_tab' style='border-top:0px;border-left:0px;border-bottom:0px;width:57px;'><span class='ico16 correlation_form_16'></span>" + item.name + "</a><span class='pageChatTabsClose_box'><span class='pageChatTabsClose'><span class='ico16 for_close_16'></span></span></span></li>");

				//匿名函数 闭包 内部函数
				(function(obj){
					$('#'+obj.id).click(function(){
						self.resetChatContent(obj);
					});
					$('#' + obj.id + " .pageChatTabsClose").unbind().click(function () {
					    self.removeChatTab(obj.id);
					})
				})(item);
			}else{
				this.moreArray.push(item);
			}
		}
        //关闭按钮，隐藏显示
		$("#" + this.id + "_dialogcontenthead li").mouseenter(function () {
		    $(this).find(".pageChatTabsClose").show();
		}).mouseleave(function () {
		    $(this).find(".pageChatTabsClose").hide();
		});
        //关闭按钮操作
		$("#" + this.id + "_dialogcontenthead li .pageChatTabsClose .ico16").mouseenter(function () {
		    $(this).removeClass("for_close_16 hover_close_16").addClass("hover_close_16");
		}).mouseleave(function () {
		    $(this).removeClass("for_close_16 hover_close_16").addClass("for_close_16");
		});
		$('.dialogcontentbody_content').css({
			'width':this.width-52,
			'height':338,
			'padding':'5px'
		});
		if(this.moreArray.length>0){
		    this.dialogcontentheadul.append("<li id='" + this.id + "_more'><a hidefocus='true' id='" + this.id + "_morea' href='javascript:void(0)' class='last_tab' style='border:0px;border-right:solid 1px #b6b6b6; width:21px;padding:0;text-align:center;vertical-align:middle;'><span class='ico16 arrow_1_b'></span></a></li>");
			this.tabMore = $('#'+this.id+'_morea');
			
	        this.tabMore.menuSimple({
				id:this.id+'_moreItems',
				offsetLeft:-143,
				offsetTop:-5,
	            data: this.moreArray
	        });
			for (var h=0; h<this.moreArray.length; h++) {
				var item = this.moreArray[h];
				//匿名函数 闭包 内部函数
				(function(obj){
					$('#'+obj.id).click(function(){
					    self.resetChatTab(obj);
					});
				})(item);
			};
		}
		this.dialogcontentheadul.append("<a class='right' style='border:0;'>>>进入UC中心</a>");
	}
}
/**
 * 删除聊天页签
 */
Mxtchat.prototype.removeChatTab = function (ttID) {
    for (var i = 0; i < this.tabItems.length; i++) {
        if (this.tabItems[i].id == ttID) {
            this.tabItems.splice(i, 1);
            break;
        }
    }
    this.dialogcontentheadul.empty();
    this.tabMore.empty();
    if (this.tabItems != undefined && this.tabItems.length > 0) {
        this.moreArray = [];
        var self = this;
        this.firstTab = null;
        for (var i = 0; i < this.tabItems.length; i++) {
            var item = this.tabItems[i];
            if (i == 0) {
                this.firstTab = item.id;
            }
            if (i == 5) {
                this.lastTabId = item.id;
            }
            this.dialogcontentbody.append("<div id='" + item.id + "_body' class='hidden dialogcontentbody_content'></div>");
            if (i < 6) {
                this.dialogcontentheadul.append("<li id='" + item.id + "' class='display_block left'><a hidefocus='true' href='javascript:void(0)' class='last_tab' style='border-top:0px;border-left:0px;border-bottom:0px;width:57px;'><span class='ico16 correlation_form_16'></span>" + item.name + "</a><span class='pageChatTabsClose_box'><span class='pageChatTabsClose'><span class='ico16 for_close_16'></span></span></span></li>");
                //匿名函数 闭包 内部函数
                (function (obj) {
                    $('#' + obj.id).click(function () {
                        self.resetChatContent(obj);
                    });
                    $('#' + obj.id + " .pageChatTabsClose").click(function () {
                        self.removeChatTab(obj.id);
                    })
                })(item);
            } else {
                this.moreArray.push(item);
            }
        }
        //关闭按钮，隐藏显示
        $("#" + this.id + "_dialogcontenthead li").mouseenter(function () {
            $(this).find(".pageChatTabsClose").show();
        }).mouseleave(function () {
            $(this).find(".pageChatTabsClose").hide();
        });
        //关闭按钮操作
        $("#" + this.id + "_dialogcontenthead li .pageChatTabsClose .ico16").mouseenter(function () {
            $(this).removeClass("for_close_16 hover_close_16").addClass("hover_close_16");
        }).mouseleave(function () {
            $(this).removeClass("for_close_16 hover_close_16").addClass("for_close_16");
        });
        $('.dialogcontentbody_content').css({
            'width': this.width - 52,
            'height': 338,
            'padding': '5px'
        });
        if (this.moreArray.length > 0) {
            this.dialogcontentheadul.append("<li id='" + this.id + "_more'><a hidefocus='true' id='" + this.id + "_morea' href='javascript:void(0)' class='last_tab' style='border:0px;width:21px;padding:0;text-align:center;vertical-align:middle;'><span class='ico16 arrow_1_b'></span></a></li>");
            this.tabMore = $('#' + this.id + '_morea');

            this.tabMore.menuSimple({
                id: this.id + '_moreItems',
                offsetLeft: -143,
                offsetTop: -5,
                data: this.moreArray
            });
            for (var h = 0; h < this.moreArray.length; h++) {
                var item = this.moreArray[h];
                //匿名函数 闭包 内部函数
                (function (obj) {
                    $('#' + obj.id).click(function () {
                        self.resetChatTab(obj);
                    });
                })(item);
            };
        }
    }
    var _dialogcontentheadulli = this.dialogcontentheadul.find("li");
    if (_dialogcontentheadulli.size() > 0) {
        this.dialogcontentheadul.find("li").eq(0).trigger("click");
    } else {
        this.minChat();
    }
}
/**
 * 重置聊天页签
 */
Mxtchat.prototype.resetChatTab = function (item) {
	var self =this;
	var _id = item.id;
	this.currentTabId = _id;
	var _name = item.name; 
	var _content = item.content;
	var _isGroup = item.isGroup;
	this.isGroup = _isGroup;
	
	var arrayTemp = [];
	for (var i=0; i<this.moreArray.length; i++) {
		var array = this.moreArray[i];
		if(array.id != _id){
			arrayTemp.push(array);
		}
	};
	var _ct = this.getTab(this.lastTabId);
	arrayTemp.push(_ct);
	
	$('#'+this.lastTabId).remove();
	$('#' + this.id + '_more').before("<li id='" + _id + "'><a hidefocus='true' href='javascript:void(0)' class='last_tab' style='border-top:0px;border-left:0px;border-bottom:0px;width:57px;'><span class='ico16 communication_16 margin_r_5'></span>" + _name + "</a><span class='pageChatTabsClose_box'><span class='pageChatTabsClose'><span class='ico16 for_close_16'></span></span></span></li>");
	$('#' + _id + " .pageChatTabsClose").unbind().click(function () {
	    self.removeChatTab(_id);
	})
	this.moreArray = arrayTemp;
    this.tabMore.menuSimple({
		id:this.id+'_moreItems',
		offsetLeft:-143,
		offsetTop:-5,
        data: this.moreArray
    });
	for (var h=0; h<this.moreArray.length; h++) {
		var item2 = this.moreArray[h];
		$('#'+item2.id).unbind();
		//匿名函数 闭包 内部函数
		(function(obj){
			$('#'+obj.id).click(function(){
			    self.resetChatTab(obj);
			});
		})(item2);
	};
	this.lastTabId = _id;
	$('#'+_id).click(function(){
		self.resetChatContent(item);
	});
    //关闭按钮，隐藏显示
	$("#" + this.id + "_dialogcontenthead li").mouseenter(function () {
	    $(this).find(".pageChatTabsClose").show();
	}).mouseleave(function () {
	    $(this).find(".pageChatTabsClose").hide();
	});
    //关闭按钮操作
	$("#" + this.id + "_dialogcontenthead li .pageChatTabsClose .ico16").mouseenter(function () {
	    $(this).removeClass("for_close_16 hover_close_16").addClass("hover_close_16");
	}).mouseleave(function () {
	    $(this).removeClass("for_close_16 hover_close_16").addClass("for_close_16");
	});
}
/**
 * 重置聊天内容
 */
Mxtchat.prototype.resetChatContent = function(item){
	this.hideHistory();
	$('.dialogcontentbody_content').hide();
	var _id = item.id;
	this.currentTabId = _id;
	var _name = item.name; 
	var _content = item.content;
	var _isGroup = item.isGroup;
	this.isGroup = _isGroup;
	$('#'+_id).siblings().removeClass('current');
	$('#'+_id).addClass('current');
	var htmlStr = "";
	for (var i=0; i<_content.length; i++) {
		var _c = _content[i];
		var _ismy = _c.isMy;
		var _left = 'left';
		if(_ismy){
			_left = "right"; 
		}
		
		htmlStr+="<ul class='pageChatArea2 margin_t_10' id='"+_id+"_ul'>";
               htmlStr+=" <li class='pageChatAreaMy'>";
                    htmlStr+="<img class='pageChatAreaMy_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225'' />";
                    htmlStr+="<span class='pageChatAreaArrowRight'></span>";
                    htmlStr+="<div class='pageChatAreaMy_content'>";
						htmlStr+="<span class='ico16 cancel_track_16 pageChatAreaListClose'></span>";
                       	htmlStr+="<p>";
                       	htmlStr += "<span class='color_gray2'>" + _c.name + "</span><span class='margin_l_10 color_gray2'>今天 09-05 10:12</span><br />";
                        htmlStr+="</p>";
                        htmlStr += "<p>" + _c.context + "</p>";
					htmlStr+="</div>";
                htmlStr+="</li>";
                htmlStr+="<li class='pageChatAreaOther'>";
                    htmlStr+="<img class='pageChatAreaOther_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225'' />";
                    htmlStr+="<span class='pageChatAreaArrowLeft'></span>";
                    htmlStr+="<div class='pageChatAreaOther_content'>";
                        htmlStr+="<span class='ico16 cancel_track_16 pageChatAreaListClose'></span>";
                        htmlStr+="<p>";
                        htmlStr += "<span class='color_blue'><a href='javascript:void(0)'>" + _c.name + "</a></span><span class='margin_l_10 color_gray2'>今天 09-05 10:12</span><br />";
                        htmlStr+="</p>";
                        htmlStr += "<p>" + _c.context + "</p>";
                    htmlStr+="</div>";
                htmlStr+="</li>";
	    //语音-气泡消息

                htmlStr += "<li class='pageChatAreaOther'>";
                htmlStr += "<img class='pageChatAreaOther_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                htmlStr += "<span class='pageChatAreaArrowLeft'></span>";
                htmlStr += "<div class='pageChatAreaOther_content speech_w_1'>";
                htmlStr += "<p class='speech_height'>";
                htmlStr += "<span class='left'><span class='color_blue'><a href='javascript:void(0)'>乔立：</a></span><span class='ico16 speech_read_16'></span></span>";
                htmlStr += "<span class='right font_size12 color_gray2'>09-05&nbsp;10:12</span>";
                htmlStr += "</p>";
                htmlStr += "</div>";
                htmlStr += "<span class='speech_time_box'><span class='speech_time_1 color_gray2'>5\"</span></span>";
                htmlStr += "<span class='speech_time_box'></span>";
                htmlStr += "</li>";

                htmlStr += "<li class='pageChatAreaOther'>";
                htmlStr += "<img class='pageChatAreaOther_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                htmlStr += "<span class='pageChatAreaArrowLeft'></span>";
                htmlStr += "<div class='pageChatAreaOther_content speech_w_2'>";
                htmlStr += "<p class='speech_height'>";
                htmlStr += "<span class='left'><span class='color_blue'><a href='javascript:void(0)'>乔立：</a></span><span class='ico16 speech_read_16'></span></span>";
                htmlStr += "<span class='right font_size12 color_gray2 '>09-05&nbsp;10:12</span>";
                htmlStr += "</p>";
                htmlStr += "</div>";
                htmlStr += "<span class='speech_time_box'><span class='speech_time_2 color_gray2'>10\"</span></span>";
                htmlStr += "</li>";

                htmlStr += "<li class='pageChatAreaOther'>";
                htmlStr += "<img class='pageChatAreaOther_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                htmlStr += "<span class='pageChatAreaArrowLeft'></span>";
                htmlStr += "<div class='pageChatAreaOther_content speech_w_3'>";
                htmlStr += "<p class='speech_height'>";
                htmlStr += "<span class='left'><span class='color_blue'><a href='javascript:void(0)'>乔立：</a></span><span class='ico16 speech_read_16'></span></span>";
                htmlStr += "<span class='right font_size12 color_gray2 '>09-05&nbsp;10:12</span>";
                htmlStr += "</p>";
                htmlStr += "</div>";
                htmlStr += "<span class='speech_time_box'><span class='speech_time_3 color_gray2'>20\"</span></span>";
                htmlStr += "</li>";

                htmlStr += "<li class='pageChatAreaOther'>";
                htmlStr += "<img class='pageChatAreaOther_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                htmlStr += "<span class='pageChatAreaArrowLeft'></span>";
                htmlStr += "<div class='pageChatAreaOther_content speech_w_4'>";
                htmlStr += "<p class='speech_height'>";
                htmlStr += "<span class='left'><span class='color_blue'><a href='javascript:void(0)'>乔立：</a></span><span class='ico16 speech_read_16'></span></span>";
                htmlStr += "<span class='right font_size12 color_gray2 '>09-05&nbsp;10:12</span>";
                htmlStr += "</p>";
                htmlStr += "</div>";
                htmlStr += "<span class='speech_time_box'><span class='speech_time_4 color_gray2'>60\"</span></span>";
                htmlStr += "</li>";

                //htmlStr += "<li class='pageChatAreaOther'>";
                //htmlStr += "<img class='pageChatAreaOther_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                //htmlStr += "<span class='pageChatAreaArrowLeft'></span>";
                //htmlStr += "<div class='pageChatAreaOther_content speech_w_5'>";
                //htmlStr += "<p class='speech_height'>";
                //htmlStr += "<span class='left'><span class='color_blue'><a href='javascript:void(0)'>乔立：</a></span><span class='ico16 speech_read_16'></span></span>";
                //htmlStr += "<span class='right font_size12 color_gray2 '>09-05&nbsp;10:12</span>";
                //htmlStr += "</p>";
                //htmlStr += "</div>";
                //htmlStr += "<span class='speech_time_box'><span class='speech_time_5 color_gray2'>50\"</span></span>";
                //htmlStr += "</li>";

                //htmlStr += "<li class='pageChatAreaOther'>";
                //htmlStr += "<img class='pageChatAreaOther_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                //htmlStr += "<span class='pageChatAreaArrowLeft'></span>";
                //htmlStr += "<div class='pageChatAreaOther_content speech_w_6'>";
                //htmlStr += "<p class='speech_height'>";
                //htmlStr += "<span class='left'><span class='color_blue'><a href='javascript:void(0)'>乔立：</a></span><span class='ico16 speech_read_16'></span></span>";
                //htmlStr += "<span class='right font_size12 color_gray2 '>09-05&nbsp;10:12</span>";
                //htmlStr += "</p>";
                //htmlStr += "</div>";
                //htmlStr += "<span class='speech_time_box'><span class='speech_time_6 color_gray2'>60\"</span></span>";
                //htmlStr += "</li>";
        
                htmlStr += "<li class='pageChatAreaMy'>";
                htmlStr += "<img class='pageChatAreaMy_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                htmlStr += "<span class='pageChatAreaArrowRight'></span>";
                htmlStr += "<span class='speech_time_1 color_gray2'>5\"</span>";
                htmlStr += "<div class='pageChatAreaMy_content speech_w_1'>";
                htmlStr += "<p class='speech_height clearFlow'>";
                htmlStr += "<span class='left font_size12 color_gray2'>09-05&nbsp;10:12</span>";
                htmlStr += "<span class='right'><span class='ico16 speech_gif2_16'></span><span class='color_blue margin_l_5'>我</span></span>";
                htmlStr += "</p>";
                htmlStr += "</div>";
                htmlStr += "</li>";

                htmlStr += "</li>";
                htmlStr += "<li class='pageChatAreaMy'>";
                htmlStr += "<img class='pageChatAreaMy_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                htmlStr += "<span class='pageChatAreaArrowRight'></span>";
                htmlStr += "<span class='speech_time_2 color_gray2'>10\"</span>";
                htmlStr += "<div class='pageChatAreaMy_content speech_w_2'>";
                htmlStr += "<p class='speech_height clearFlow'>";
                htmlStr += "<span class='left font_size12 color_gray2'>09-05&nbsp;10:12</span>";
                htmlStr += "<span class='right'><span class='ico16 speech_gif2_16'></span><span class='color_blue margin_l_5'>我</span></span>";
                htmlStr += "</p>";
                htmlStr += "</div>";
                htmlStr += "</li>";

                htmlStr += "</li>";
                htmlStr += "<li class='pageChatAreaMy'>";
                htmlStr += "<img class='pageChatAreaMy_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                htmlStr += "<span class='pageChatAreaArrowRight'></span>";
                htmlStr += "<span class='speech_time_3 color_gray2'>20\"</span>";
                htmlStr += "<div class='pageChatAreaMy_content speech_w_3'>";
                htmlStr += "<p class='speech_height clearFlow'>";
                htmlStr += "<span class='left font_size12 color_gray2'>09-05&nbsp;10:12</span>";
                htmlStr += "<span class='right'><span class='ico16 speech_gif2_16'></span><span class='color_blue margin_l_5'>我</span></span>";
                htmlStr += "</p>";
                htmlStr += "</div>";
                htmlStr += "</li>";

                htmlStr += "</li>";
                htmlStr += "<li class='pageChatAreaMy'>";
                htmlStr += "<img class='pageChatAreaMy_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                htmlStr += "<span class='pageChatAreaArrowRight'></span>";
                htmlStr += "<span class='speech_time_4 color_gray2'>60\"</span>";
                htmlStr += "<div class='pageChatAreaMy_content speech_w_4'>";
                htmlStr += "<p class='speech_height clearFlow'>";
                htmlStr += "<span class='left font_size12 color_gray2'>09-05&nbsp;10:12</span>";
                htmlStr += "<span class='right'><span class='ico16 speech_gif2_16'></span><span class='color_blue margin_l_5'>我</span></span>";
                htmlStr += "</p>";
                htmlStr += "</div>";
                htmlStr += "</li>";
        

                //htmlStr += "</li>";
                //htmlStr += "<li class='pageChatAreaMy'>";
                //htmlStr += "<img class='pageChatAreaMy_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                //htmlStr += "<span class='pageChatAreaArrowRight'></span>";
                //htmlStr += "<span class='speech_time_5 color_gray2'>50\"</span>";
                //htmlStr += "<div class='pageChatAreaMy_content speech_w_5'>";
                //htmlStr += "<p class='speech_height clearFlow'>";
                //htmlStr += "<span class='left font_size12 color_gray2'>09-05&nbsp;10:12</span>";
                //htmlStr += "<span class='right'><span class='ico16 speech_gif2_16'></span><span class='color_blue margin_l_5'>我</span></span>";
                //htmlStr += "</p>";
                //htmlStr += "</div>";
                //htmlStr += "</li>";
                //htmlStr += "</li>";

                //htmlStr += "<li class='pageChatAreaMy'>";
                //htmlStr += "<img class='pageChatAreaMy_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225' />";
                //htmlStr += "<span class='pageChatAreaArrowRight'></span>";
                //htmlStr += "<span class='speech_time_6 color_gray2'>60\"</span>";
                //htmlStr += "<div class='pageChatAreaMy_content speech_w_6'>";
                //htmlStr += "<p class='speech_height clearFlow'>";
                //htmlStr += "<span class='left font_size12 color_gray2'>09-05&nbsp;10:12</span>";
                //htmlStr += "<span class='right'><span class='ico16 speech_gif2_16'></span><span class='color_blue margin_l_5'>我</span></span>";
                //htmlStr += "</p>";
                //htmlStr += "</div>";
                //htmlStr += "</li>";

            htmlStr+="</ul>";
		
	};
    //关闭按钮，隐藏显示
    $("#" + this.id + "_dialogcontenthead li[class!='"+this.id+"_more']").mouseenter(function () {
	    $(this).find(".pageChatTabsClose").show();
	}).mouseleave(function () {
	    $(this).find(".pageChatTabsClose").hide();
	});
	$('#' + _id + '_body').html(htmlStr).show();
}

Mxtchat.prototype.getTab = function(id){
	for (var i=0; i<this.tabItems.length; i++) {
		var tt = this.tabItems[i];
		if(this.tabItems[i].id == id){
			return tt;
		}
	};
}
Mxtchat.prototype.setCurrentTab = function(id){
	$('#'+id).click();
}
/**
 * 显示聊天记录
 */
Mxtchat.prototype.showHistory = function(){
	if(!this.isShowHistory){
		this.isShowHistory = true;
		this.width = 814;
		
		this.container.css({
			'width':this.width
		});
		this.content.css({
			'width':this.width
		});
		this.iframe.css({
			'width':this.width
		});
		this.head.css({
			'width':this.width
		});
		this.setGroup();
		this.addHistory();
		this.right.removeClass('hidden');
	}else{
		this.hideHistory();
	}

}
/**
 * 设置群成员
 */
Mxtchat.prototype.setGroup = function(){
	if(this.isGroup){
		$('#'+this.id+'_historytaba').css({
			'width':117,
			'max-width':117
		});
		
		$('#'+this.id+'_grouptab').css({
			'display':''
		});
		this.addPeople();
		this.grouptaba.click();
	}else{
		$('#'+this.id+'_historytaba').css({
			'width':256,
			'max-width':256
		});
		$('#'+this.id+'_grouptab').css({
			'display':'none'
		});
		this.historytaba.click();
	}
}
/**
 * 隐藏聊天记录
 */
Mxtchat.prototype.hideHistory = function(){
	this.isShowHistory = false;
	this.width = 514;
	this.container.css({
		'width':this.width
	});
	this.content.css({
		'width':this.width
	});
	this.iframe.css({
		'width':this.width
	});
	this.head.css({
		'width':this.width
	});
	this.right.addClass('hidden');
}
/**
 * 设置聊天信息
 */
Mxtchat.prototype.setMessage = function(){
	
}
/**
 * 获取聊天信息
 */
Mxtchat.prototype.getMessage = function(){
	
}
/**
 * 设置聊天消息记录
 */
Mxtchat.prototype.addHistory = function(){
	var items = [{
		id:'p1',
		name:'胡丽',
		dateTime:"15:00",
		attachments:[{
			'id':'att1',
			'name':'attName.png'
		},{
			'id':'att2',
			'name':'attName.png'
		},{
			'id':'att3',
			'name':'attName.png'
		}],
		content:'饱嗝，打了一个饱嗝!'
	},{
		id:'p2',
		name:'胡丽',
		dateTime:"15:00",
		attachments:[{
			'id':'att21',
			'name':'attName.png'
		},{
			'id':'att22',
			'name':'attName.png'
		},{
			'id':'att23',
			'name':'attName.png'
		}],
		content:'饱嗝，打了一个饱嗝!'
	},{
		id:'p3',
		name:'胡丽',
		dateTime:"15:00",
		attachments:[{
			'id':'att21',
			'name':'attName.png'
		},{
			'id':'att22',
			'name':'attName.png'
		},{
			'id':'att23',
			'name':'attName.png'
		}],
		content:'饱嗝，打了一个饱嗝!'
	},{
		id:'p4',
		name:'胡丽',
		dateTime:"15:00",
		attachments:[{
			'id':'att21',
			'name':'attName.png'
		},{
			'id':'att22',
			'name':'attName.png'
		},{
			'id':'att23',
			'name':'attName.png'
		}],
		content:'饱嗝，打了一个饱嗝!'
	},{
		id:'p5',
		name:'胡丽',
		dateTime:"15:00",
		attachments:[{
			'id':'att21',
			'name':'attName.png'
		},{
			'id':'att22',
			'name':'attName.png'
		},{
			'id':'att23',
			'name':'attName.png'
		}],
		content:'饱嗝，打了一个饱嗝!'
	},{
		id:'p6',
		name:'胡丽',
		dateTime:"15:00",
		attachments:[{
			'id':'att21',
			'name':'attName.png'
		},{
			'id':'att22',
			'name':'attName.png'
		},{
			'id':'att23',
			'name':'attName.png'
		}],
		content:'饱嗝，打了一个饱嗝!'
	}]
	this.historytabbodytop.empty();
	for (var i=0; i<items.length; i++) {
		var item = items[i];
		var strTemp = "";
		var htmlstr = "";
		strTemp+="<div class='border_b padding_b_5 padding_t_5 font_size12 clearfix'>";
			strTemp+="<ul>";
				strTemp+="<li class='left padding_0'>";
					//strTemp+="<img class='left margin_l_10 margin_t_5' width='20' height='20' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225''>";
					//strTemp+="<span class='ico16 ppt_16  margin_l_10 margin_r_10' style='width:20px;height:20px;border:1px silid #6d6d6d'></span>";
				strTemp+="</li>";
				strTemp+="<li class='padding_0'>";
					strTemp+="<div><span class='color_gray2 margin_l_5'>"+item.name+"</span><span class='color_gray2 margin_r_5 margin_l_5'>"+item.dateTime+"</span>";
					for (var g=0; g<item.attachments.length; g++) {
						strTemp+= "<span class='display_inline-block color_gray2 margin_l_5'><span class='ico16 affix_16'></span>"+item.attachments[g].name+"</span>";
					}
					strTemp+="</div>"
					strTemp+="<div class='margin_t_10 margin_l_10'><span class=''>"+item.content+"</span></div>";
				strTemp+="</li>";
			strTemp+="</ul>";			
		strTemp+="</div>";

		strTemp += "<div class='border_b padding_b_5 padding_t_5 font_size12 clearfix'>";
		    strTemp += "<ul>";
		        strTemp += "<li class='left padding_0'>";
		            //strTemp += "<img class='left margin_l_10 margin_t_5' width='20' height='20' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225''>";
		        strTemp += "</li>";
		        strTemp += "<li class='padding_0'>";
		            strTemp += "<span class='color_gray2 margin_l_5'>" + item.name + "</span><span class='color_gray2 margin_r_5 margin_l_5'>" + item.dateTime + "</span>";
		            strTemp += "<div class='im_talk6'><span class='ico16 speech_read_16 left'></span><span class='color_gray2 right'>60\"</span></div>";
		        strTemp += "</li>";
		    strTemp += "</ul>";
		strTemp += "</div>";
		
		this.historytabbodytop.append(strTemp);
	};
	
	//分页
		htmlstr+="<div class='common_over_page right margin_r_10 padding_t_10 padding_r_5'>";
		htmlstr += "<a href='#' class='common_over_page_btn' title='上一页'><em class='pagePrev'></em></a>";
		htmlstr += "<a href='#' class='margin_l_5' title=''>1</a>";
		htmlstr += "<a href='#' class='margin_l_5' title=''>2</a>";
		htmlstr+="</div>";
		this.historytabbodybottom.append(htmlstr);
	
}
/**
 * 添加聊天成员
 */
Mxtchat.prototype.addPeople = function(){
	var peoples = [{
		id:'p1',
		name:'胡丽(用户体验部)'
	},{
		id:'p2',
		name:'胡丽(用户体验部)'
	},{
		id:'p3',
		name:'胡丽(用户体验部)'
	},{
		id:'p4',
		name:'胡丽(用户体验部)'
	},{
		id:'p5',
		name:'胡丽(用户体验部)'
	},{
		id:'p6',
		name:'胡丽(用户体验部)'
	},{
		id:'p7',
		name:'胡丽(用户体验部)'
	},{
		id:'p8',
		name:'胡丽(用户体验部)'
	},{
		id:'p9',
		name:'胡丽(用户体验部)'
	},{
		id:'p10',
		name:'胡丽(用户体验部)'
	}]
	this.grouptabbody.empty();
	for (var i=0; i<peoples.length; i++) {
		var people = peoples[i];
		this.grouptabbody.append("<div class='border_b padding_b_5 padding_t_5 font_size12'><span class='ico32 pdf_32 margin_r_10 margin_l_10'></span> "+people.name+"</div>");
	};
}
/**
 * 发送消息
 */
Mxtchat.prototype.sendMessage = function(){
	var htmlStr = "";
	var msg = this.dialogtextarea.html();
	if(msg!=''){
			htmlStr+="<li class='pageChatAreaMy' id='show_msg'>";
                    htmlStr+="<img class='pageChatAreaMy_img' width='42' height='42' src='http://img.baidu.com/img/image/liulanimage/w_quweigaoxiao.jpg?0225'' />";
                    htmlStr+="<span class='pageChatAreaArrowRight'></span>";
                    htmlStr+="<div class='pageChatAreaMy_content'>";
						htmlStr+="<span class='ico16 cancel_track_16 pageChatAreaListClose'></span>";
                       	htmlStr+="<p>";
                       		htmlStr+="<span class='color_blue'><a href='javascript:void(0)'>"+this.owner+":</a></span>"+msg+"<br />"; 
                        htmlStr+="</p>";
                        htmlStr+="<p class='font_size12 color_gray2'>09-05&nbsp;10:12</p>";
					htmlStr+="</div>";
            htmlStr+="</li>";
			$('#'+this.currentTabId+'_ul').append(htmlStr);		
	}
	this.dialogtextarea.empty().focus();
}
/**
 * 添加聊天历史记录
 */
Mxtchat.prototype.addHistoryTab = function(){
	this.rightbodyheadul.append("<li id='"+this.id+"_grouptab' style='display:none'><a hidefocus='true' id='"+this.id+"_grouptaba' href='javascript:void(0)' class='last_tab' style='border-top:0px;border-left:0px;border-bottom:0px;width:118px;max-width:118px;text-align:center'>"+this.groupTitle+"</a></li>");
	this.rightbodyheadul.append("<li id='"+this.id+"_historytab'><a hidefocus='true' id='"+this.id+"_historytaba' href='javascript:void(0)' class='' style='border-top:0px;border-left:0px;border-bottom:0px;width:117px;max-width:117px;text-align:center'>"+this.historyTitle+"</a></li>");
	
	this.grouptaba = $('#'+this.id+'_grouptaba');
	this.historytaba = $('#'+this.id+'_historytaba');
	
	var self = this;
	this.grouptaba.click(function(){
		self.grouptabbody.show();
		self.historytabbody.hide();
		
		$('#'+self.id+'_grouptab').removeClass('current');
		$('#'+self.id+'_historytab').removeClass('current');
		$('#'+self.id+'_grouptab').addClass('current');
		
	});
	this.historytaba.click(function(){
		self.grouptabbody.hide();
		self.historytabbody.show();
		$('#'+self.id+'_grouptab').removeClass('current');
		$('#'+self.id+'_historytab').removeClass('current');
		$('#'+self.id+'_historytab').addClass('current');
	});
	
}
/**
 * 在线消息
 */
Mxtchat.prototype.createAttach = function(){
	var htmlstr = ""
	//
	htmlstr +="<div id='"+this.id+"_onlineHeight' style='position:fixed;right:"+this.fixRight+"px;bottom:"+this.fixBottom+"px;'>";
		//htmlstr +="<span class='ico16 online_news_16'></span>";
		htmlstr +="<a id='"+this.id+"_online' href='javascript:void(0)' class='common_button common_button_icon'>";
			htmlstr +="<em class='ico16 online_news_16'></em>"+this.online_msg+"";
		htmlstr +="</a>";
		//htmlstr +="<a>"+this.online_msg+"</a>";
	htmlstr +="</div>";
	$('body').prepend(htmlstr);
	
	var self = this;
	$('#'+this.id+'_online').click(function(){
		self.maxChat();
	});
}