function WebFXMenuBar(options){
	this.allMenuBottons = [];//存储所有的菜单html
	this.menuStrBuffer = [];//存储html
	this.render = options.render;
	this.contextPath = options.contextPath==null?"":options.contextPath;
	this.isPager = true;
	if(options.isPager == false){
		this.isPager = false
	}
	this.searchHtml = options.searchHtml;
	this.top = options.top == null?0:options.top;
	this.left = options.left == null?0:options.left;
	this.borderTop = 0;
	if(options.borderTop == true){
		this.borderTop = 1;
	}
	this.borderBottom = 0;
	if(options.borderBottom == true){
		this.borderBottom = 1;
	}
	this.borderRight = 0;
	if(options.borderRight ==true){
		this.borderRight = 1;
	}
	this.borderLeft = 0;
	if(options.borderLeft ==true){
		this.borderLeft = 1;
	}
	this.id = options.id ? options.id : Math.floor(Math.random() * 100000000);
	this.type=options.type;
	this.items = options.items;
	this.disabledItemArr = [];
	this.hideIdArray = [];//二级下拉隐藏
}
WebFXMenuBar.prototype.add = function(menuButton){
	this.allMenuBottons[this.allMenuBottons.length] = menuButton;
}
WebFXMenuBar.prototype.addMenu = function(menuButton){
	this.add(new WebFXMenuButton(menuButton));
	var menubtn = this.allMenuBottons[this.allMenuBottons.length-1];
	    menubtn.toObj($('#toolbar_'+this.id));
}
WebFXMenuBar.prototype.show = function(){
	if(this.allMenuBottons.length>0){
		this.menuStrBuffer=[];
		if(this.isPager){
			this.menuStrBuffer.push("<div id='toolbar_" + this.id + "_box' class='common_toolbar_box clearfix' style='overflow:hidden; border-top-width:"+this.borderTop+"px;border-bottom-width:"+this.borderBottom+"px;border-left-width:"+this.borderLeft+"px;border-right-width:"+this.borderRight+"px;border-color:#b6b6b6;border-style:solid;'>");
			this.menuStrBuffer.push("<div id='toolbar_" + this.id + "_wrap' class='toolbar_l clearfix' style='overflow:hidden'><div id='toolbar_" + this.id + "' style='height:30px;white-space:nowrap;width:auto'>");
			this.menuStrBuffer.push("</div></div><div id='toolbar_m' class='left hidden'><span class=' toolbar_m_l'></span><span class=' toolbar_m_r'></span></div>");
		}else{
			this.menuStrBuffer.push("<div class='common_toolbar_box clearfix' style='_display:inline; border-top-width:"+this.borderTop+"px;border-bottom-width:"+this.borderBottom+"px;border-left-width:"+this.borderLeft+"px;border-right-width:"+this.borderRight+"px;border-color:#b6b6b6;border-style:solid;'>");
			this.menuStrBuffer.push("<div id='toolbar_" + this.id + "' class='toolbar_l clearfix'>");
			this.menuStrBuffer.push("</div>");
		}
		if(this.searchHtml!=null){
			this.menuStrBuffer.push("<div class='toolbar_r clearfix'>");
			this.menuStrBuffer.push($('#'+this.searchHtml).html());
			this.menuStrBuffer.push("</div>");
			$('#'+this.searchHtml).remove();
		}
		this.menuStrBuffer.push("</div>");
	}
	if(this.render == undefined){
		document.write(this.menuStrBuffer.join(''));
	}else{
		$('#'+this.render).append(this.menuStrBuffer.join(''));
	}
	var toolP = $('#toolbar_'+this.id);
	//最多显示的菜单个数
    for(var i = 0; i < this.allMenuBottons.length; i++) {
	    var menubtn = this.allMenuBottons[i];
	    	menubtn.toObj(toolP);
			if(i!=(this.allMenuBottons.length-1)){
				menubtn.toSeparate(toolP);
			}
    }
	var self = this;
	if(this.isPager){
		this.setPage();
	}
	$('.sub_ico').each(function(){
		var idStr = this.id;
		self.initDisabledItem(idStr);
		$('#'+this.id+'_a').mouseover(function(){
			if ($(this).hasClass("common_menu_dis") !== true) {
				self.showMoreMenu(idStr);
			}
		}).mouseout(function(){
			self.hideMoreMenu();
		});
	});
    this.menuStrBuffer=[];	
}
/**toolbar 翻页**/
WebFXMenuBar.prototype.setPage = function(){
	var self = this;
	var _toolP = $('#toolbar_'+this.id);
	var _toolPw = _toolP.width();
	var _box = $("#toolbar_" + this.id + "_box");
	var _box_w = _box.width();
	var _wrap = $("#toolbar_" + this.id + "_wrap");
	var _wrap_w = _wrap.width();
	var _search_w = $('.common_search_condition ').width()+20+32+10;
	
	if((_box_w-170)<_toolPw){
		var _ww = _box_w-_search_w-130;
		var _toolCld = _toolP.children();
		var _toolCldlen = _toolCld.size();
		var _subw = 0
		this._subm = [];
		for(var i = 0;i<_toolCldlen;i++){
			var _temp = _toolCld[i];
			if(_temp){
				var _mmml = parseInt($(_temp).css('margin-left'));
				if(isNaN(_mmml))_mmml = 0;
				var _mmmr = parseInt($(_temp).css('margin-right'));
				if(isNaN(_mmmr))_mmmr = 0;
				var _oofw = parseInt($(_temp)[0].offsetWidth);
				if(isNaN(_oofw))_oofw = 0;
				_subw =_subw+_oofw+_mmml+_mmmr;
				
				if(_subw>_ww){
					_subw = _subw-_oofw-_mmml-_mmmr;
					this._subm[this._subm.length] = _subw;
					_subw = 0;
				}
			}
		}
		if(this._subm.length>0){
			_ww = this._subm[0]
			$('#toolbar_m').attr('move',0);
		}
		_wrap.width(_ww);
		$('#toolbar_m').show();
		$('.toolbar_m_r').click(function(){
			var _ml = parseInt($('#toolbar_'+self.id).css('margin-left'));
			var _move = parseInt($('#toolbar_m').attr('move'));
			if(self._subm[_move]){
				$('#toolbar_'+self.id).animate({'margin-left': _ml-self._subm[_move]}, 200);
				_move = _move+1;
				$('#toolbar_m').attr('move',_move)
			}
		});
		$('.toolbar_m_l').click(function(){
			var _ml = parseInt($('#toolbar_'+self.id).css('margin-left'));
			var _move = parseInt($('#toolbar_m').attr('move'))-1;
			if(self._subm[_move]){
				$('#toolbar_'+self.id).animate({'margin-left':_ml+self._subm[_move]},200)
				_move = _move;
				$('#toolbar_m').attr('move',_move)
			}
		});
	}
}
WebFXMenuBar.prototype.hideMoreMenu = function(id){
	//alert(1);
	this.hiddenFlag = true;
	var self = this;
	setTimeout(function(){
		self.hideMoreMenuAction(id);
	},200);
}
WebFXMenuBar.prototype.hideMoreMenuAction = function(){
	if(this.hiddenFlag == true){
		$('#toolbar_more').remove();
		$('#toolbar_more_iframe').remove();
	}
}
WebFXMenuBar.prototype.getPosition = function(id){
	if(this.top==0 && this.left == 0){
		var obj = document.getElementById(id+"_a");
		var l = obj.getBoundingClientRect().left+'px';
		var t = obj.getBoundingClientRect().top + obj.clientHeight+'px';
		return {'position':'absolute','top':t,'left':l,'width':185,'z-index':500};
	}else{
	    return { 'position': 'absolute', 'top': this.top, 'left': this.left, 'width': 185, 'z-index': 500 };
	}
}
WebFXMenuBar.prototype.initDisabledItem = function(id){
	if (id) {
		var menuButton = this.getMenuButton(id);
		var subMenu = menuButton.subMenu;
		var menus = subMenu.allItems;
		var hideIdArrayStr = this.hideIdArray.join(',');
		for(var i = 0;i<menus.length;i++){
			var menu = menus[i];
			if(menu.disabled != undefined &&  menu.disabled== true){
				this.disabledItemArr.push(menu.id);
			}
		}
		
	}
}
WebFXMenuBar.prototype.showMoreMenu = function(id){
	if (id) {
		this.hiddenFlag = false;
		var menuButton = this.getMenuButton(id);
		var subMenu = menuButton.subMenu;
		
		if($('#toolbar_more').length>0){
			$('#toolbar_more').remove();
			$('#toolbar_more_iframe').remove();
		}
		var cssObj = this.getPosition(id);
		
		$("<div id='toolbar_more' style='background:#ffffff;z-index:10' class='common_order_menu_box clearfix'><ul id='toolbar_more_ul' class='common_order_menu'></ul></div>").css(cssObj).appendTo($('body'));
		var tar = $('#toolbar_more_ul');
		var self= this;
		$('#toolbar_more').mouseover(function(){
			self.hiddenFlag = false;
		}).mouseout(function(){
			self.hiddenFlag = true;
			self.hideMoreMenu();
		});
		
		var menus = subMenu.allItems;
		var hideIdArrayStr = this.hideIdArray.join(',');
		for(var i = 0;i<menus.length;i++){
			var menu = menus[i];
			//<li><a  class="order_menuitem">menu1</a></li>
			if(hideIdArrayStr.indexOf(menu.id)!=-1){
				continue;
			}
			$('<li><a  id="' + menu.id + '_a" class="order_menuitem">' + menu.name + '</a></li>').appendTo(tar);
			$('#' + menu.id + '_a').attr("value",menu.value);
			if (this.disabledItemArr.indexOf(menu.id) == -1) {
			    $('#' + menu.id + '_a').click(menu.click);
			    $('#' + menu.id + '_a').click(function () {
			        setTimeout(function () {//点击后，清除下拉列表
			            $("#toolbar_more").remove();
			            $("#toolbar_more_iframe").remove();
			        }, 100);
			    });
			} else {
			    $('#' + menu.id + '_a').css({ color: "#D2D2D2" });
			}
		}
		$("<iframe id='toolbar_more_iframe' src='about:blank' class='absolute' frameborder='0' style='z-index:9'></iframe>").css({
			top:$('#toolbar_more').css('top'),
			left:$('#toolbar_more').css('left'),
			width:$('#toolbar_more').width(),
			height:$('#toolbar_more').height()
		}).appendTo($('body'));
		
		//二级菜单过多需要出滚动条
		var ___obj = document.getElementById(id+"_a");
		var _ttt = parseInt(___obj.getBoundingClientRect().top) + parseInt(___obj.clientHeight);
		var _hhh = $('#toolbar_more').height();
		//var _bbb = parseInt(document.documentElement.clientHeight);
		var _bbb = parseInt($("body").height());
		//alert(_ttt+"==="+_hhh+"==="+_bbb)
		if((_ttt+_hhh)>_bbb){
		   $('#toolbar_more').height(_bbb - _ttt - $(___obj).height()).css({'overflow':'auto'}).addClass('border_all');
		   $('#toolbar_more_ul').css('border','0')
		   $('#toolbar_more_iframe').height(_bbb - _ttt - $(___obj).height());
		}
		
	}
}

WebFXMenuBar.prototype.disabledAll = function(){
	var self=this;
	$.each(this.allMenuBottons,function(){
		var id=$(this).attr("id");	
		self.disabled(id);
	})
}
WebFXMenuBar.prototype.selected = function(id){
	var self=this;
	if(id){			
		var id_a =id+'_a';
		$('#'+id_a).addClass("selected");
	}
}
WebFXMenuBar.prototype.unselected = function(id){
	var self=this;
	if(id){			
		var id_a =id+'_a';
		$('#'+id_a).removeClass("selected");
	}
	else{
		$('#toolbar_'+this.id+" a").removeClass("selected");

	}
}

WebFXMenuBar.prototype.disabled = function(id){
	var self=this;
	if(id){			
		var id_a =id+'_a';
		$('#'+id_a).addClass("common_menu_dis");
		var str = "";		
		$('#'+id_a).mouseover(function(){
		    $(".common_order_menu_box").addClass("hidden");
		    $('#toolbar_more_iframe').remove();
		});
		$('#' + id_a).unbind('click');
		this.disabledItemArr.push(id);
	}
}

WebFXMenuBar.prototype.enabledAll = function(){
	var self=this;
	$.each(this.allMenuBottons,function(){
		var id=$(this).attr("id");	
		self.enabled(id);
	})
}

WebFXMenuBar.prototype.enabled = function(id){
	var self=this;
	if(id){
		var id_a = id+'_a';
		$('#'+id_a).removeClass("common_menu_dis");
		$('#'+id_a).mouseover(function(){
			if($('#'+id_a+" .sub_ico").length!=0) {
				$(".common_order_menu_box").removeClass("hidden");
			}			
		});	
		var menuButton = this.getMenuButton(id);
		if (menuButton) {
		    $('#' + id_a).unbind('click').click(menuButton.click);
		}
		if(this.disabledItemArr.length>0){
			var arrayTemp = [];
			for (var i=0; i<this.disabledItemArr.length; i++) {
				var temp = this.disabledItemArr[i];
				if(temp!=id){
					arrayTemp.push(temp);
				}
			};
			this.disabledItemArr = arrayTemp;
		}
		$('#' + id_a).attr("style","");
	}
}
WebFXMenuBar.prototype.hideBtn = function(id){
	var self=this;
	if(id){
		this.hideIdArray.push(id);
		var id_a = id+'_a';
		var tar = $('#'+id_a);
		if(tar.length>0){
			tar.hide();
			var sp = tar.next();
			if(sp.hasClass('seperate')){
				sp.hide();
			}
		}
	}
}
WebFXMenuBar.prototype.showBtn = function(id){
	var self=this;
	if(id){
		if(this.hideIdArray.length>0){
			var arrayTemp = [];
			for (var i=0; i<this.hideIdArray.length; i++) {
				var _item = this.hideIdArray[i];
				if(_item != id){
					arrayTemp.push(_item)
				}
			};
			this.hideIdArray = arrayTemp;
		}
		var id_a = id+'_a';
		var tar = $('#'+id_a);
		tar.show();
		var sp = tar.next();
		if(sp.hasClass('seperate')){
			sp.show();
		}
	}
}
WebFXMenuBar.prototype.getMenuButton = function(id){
	if(id && this.allMenuBottons.length>0){
		for(var i = 0;i<this.allMenuBottons.length;i++){
			var ss = this.allMenuBottons[i];
			if(ss.id == id){
				return ss;
			}
		}
	}
}

function WebFXMenuButton(options){
	//{'id':'transmit','name':'转发','handler':'test()','class':'ico16'}		
	this.id = options.id;
	this.name = options.name;
	this.click = options.click;
	this.className = options.className;
	this.subMenu = options.subMenu;
	this.selected = options.selected;
	this.type = options.type;
	this.text = options.text;
	this.items = options.items;
	this.onchange = options.onchange;
	this.disabled = options.disabled;
	this.value=options.value;
	this.checked=options.checked;
}

WebFXMenuButton.prototype.toObj = function(toolP){
	var tempMenuStrBuffer = [];
	var nameStr = this.name;
	if(this.type == "select"){//构造select
		var text=this.text;
		tempMenuStrBuffer.push("<select id='"+this.id+"'");
		if(this.disabled==true) tempMenuStrBuffer.push(" disabled='true'");
		tempMenuStrBuffer.push("class='valign_m "+this.className+"' ><option value='"+this.value+"'>"+text+"</option>");
		if(this.items!=null){
			$.each(this.items,function(i,n){
				tempMenuStrBuffer.push("<option value='"+n.value+"'>"+n.text+"</option>")
			})
		}
		
		tempMenuStrBuffer.push("</select>");
		$(tempMenuStrBuffer.join('')).appendTo(toolP);
		$("#"+this.id).bind("change",this.onchange);//绑定onchange事件
	} else if (this.type == "checkbox") {
		tempMenuStrBuffer.push('<label for="' + this.id + '" class="margin_r_10 hand"><input type="checkbox" id="' + this.id + '" value="' + this.value + '" ');
		if (this.checked == true) {
			tempMenuStrBuffer.push(' checked="checked" ');
		};
		tempMenuStrBuffer.push(' class="radio_com">' + this.text + '</label>');
		$(tempMenuStrBuffer.join('')).appendTo(toolP).find("input").click(this.click);

	} else {
		tempMenuStrBuffer.push("<a   id='"+this.id+"_a' ");
		if(this.selected!=undefined && this.selected == true){
			tempMenuStrBuffer.push(" class='selected'");
		}
		tempMenuStrBuffer.push(" >");
		if(this.className!=null){
			tempMenuStrBuffer.push("<em id='"+this.id+"_em' class='"+this.className+"'></em>");
		}
		if(_locale && _locale == 'en'){
			tempMenuStrBuffer.push("<span id='"+this.id+"_span' class='menu_span' title='"+nameStr+"'>"+nameStr.substr(0,5) + "..</span>");
		}else{
			tempMenuStrBuffer.push("<span id='"+this.id+"_span' class='menu_span' title='"+nameStr+"'>"+nameStr + "</span>");
		}
		if(this.subMenu!=null){
		    tempMenuStrBuffer.push("<em id='" + this.id + "'  class='sub_ico' style='margin-right:-5px;margin-left:5px;'></em>");
		}
		tempMenuStrBuffer.push("</a>");
		//tempMenuStrBuffer.push("<em class='seperate margin_lr_5'></em>");
	    $(tempMenuStrBuffer.join('')).click(this.click).appendTo(toolP);
	}
	
}
WebFXMenuButton.prototype.toSeparate = function(toolP){
	var className="seperate margin_lr_5";
	//如果slect或者按钮隐藏，也同时隐藏分割线
	if(this.className&&this.className.indexOf("hidden")!=-1) className="seperate margin_lr_5 hidden";
	$("<em class='"+className+"'></em>").appendTo(toolP);
}  
/*
WebFXMenuButton.prototype.toString = function(menuStrBuffer){
	var nameStr = this.name;
	menuStrBuffer.push("<a href='#'  id='"+this.id+"_a' ");
	if(this.click!=null && this.subMenu == null){
		menuStrBuffer.push("onclick = \""+this.click+"\"");
	}
	menuStrBuffer.push(" >");
	if(this.className!=null){
		menuStrBuffer.push("<em id='"+this.id+"_em' class='"+this.className+"'></em>");
	}
	menuStrBuffer.push("<span id='"+this.id+"_span' class='menu_span'>"+nameStr + "</span>");
	if(this.subMenu!=null){
		menuStrBuffer.push("<em id='"+this.id+"'  class='sub_ico'></em>");
	}
	menuStrBuffer.push("</a>");
	
	return menuStrBuffer;
} 
*/


function WebFXMenu(){
	this.allItems = [];
}
WebFXMenu.prototype.add = function(item){
	this.allItems[this.allItems.length] = item;
}
function WebFXMenuItem(options){
	//{'id':'transmit','name':'转发','handler':'test()','class':'ico16'}
	this.id = options.id;
	this.name = options.name;
	this.click = options.click;
	this.className = options.className;
	this.value = options.value;
	this.disabled = options.disabled;
}



