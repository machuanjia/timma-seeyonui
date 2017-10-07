/**
 * @author macj
 */
function MxtTimeLine(options){
	this.id = options.id != undefined ? options.id : Math.floor(Math.random() * 100000000);
	this.height = options.height == undefined ? 500 : options.height;
	this.render = options.render;
	this.timeStep = options.timeStep == undefined ? ['8:00','18:00'] : options.timeStep;
	this.date = options.date;
	if(this.date == undefined){
		var _ymd = new Date();
		this.date[0] = _ymd.getFullYear();
		this.date[1] = _ymd.getMonth()+1;
		this.date[2] = _ymd.getDate();
	}
	
	this.autoHeight = 0;//首页banner收起绽开时候用到
	this.dateHeight = 20;
	this.editHeight = 10;
	this.boxPadding = 10;//time_line_box底部内边距，用来存放
	
	this.isHasMaxEvent = false;//判断最后一个时间点是否有事件
	this.hideFlag = true;
	
	this.items = options.items;
	this.action = options.action;
	this.searchClick = options.searchClick == undefined?function(){}:options.searchClick;
	this.editClick = options.editClick == undefined?function(){}:options.editClick;
	this.maxClick = options.maxClick == undefined?function(){}:options.maxClick;
	
	
	this.MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	this.scaleArray = new Object();
	this.scaleHourArray = new Object();
	
	this.initTimeLine();
	this.initType();
}
MxtTimeLine.prototype.initTimeLine = function(){
	this.isHasMax();
	if(this.isHasMaxEvent){
		this.boxPadding = 25;
	}
	this.timeLineHeight = this.height-this.dateHeight-this.editHeight-this.boxPadding-this.autoHeight;
	this.time_line_box = $("<div class='time_line_box' id='"+this.id+"_box' style='padding-bottom:"+this.boxPadding+"px'></div>");
	this.time_line_edit = $("<div class='clearfix'><span id='"+this.id+"_editor' class='ico16 editor_16 left'></span><span id='"+this.id+"_maximize' class='ico16 maximize_16 right'></span> </div>");
	this.time_line_edit_div = $("<div class='time_line_edit hidden over_hidden'></div>");
	this.time_line_date = $("<div class='time_line_date' style='height:30px;letter-spacing:1px;'><span id='"+this.id+"_date'>"+(this.date[1].length == 1?'0'+this.date[1]:this.date[1])+"-"+(this.date[2].length == 1?'0'+this.date[2]:this.date[2])+"</span></div>");
	
	
	this.time_line_date_set = $("<div id='"+this.id+"_time_line_date_set' class='hidden' style='height:20px'></div>");
	
	this.time_line_date_set_mouth = $("<select class='left "+this.id+"_time_line_date_set_mouth' id='"+this.id+"_time_line_date_set_mouth'></select>");
	this.time_line_date_set_day = $("<select class='left "+this.id+"_time_line_date_set_day' id='"+this.id+"_time_line_date_set_day'></select>");
	
	this.time_line_date_set_ok = $("<a class='tooltip_close font_size12 right margin_r_10 margin_t_5 hand color_blue'>" + $.i18n('common.button.ok.label') + "</a>");
	this.time_line_date_set_cancel = $("<a class='tooltip_close font_size12 right margin_t_5 hand color_blue'>" + $.i18n('common.button.cancel.label') + "</a>");
	
	this.time_line_date_set.append(this.time_line_date_set_mouth);
	this.time_line_date_set.append("<span class='left font_size12' style='margin-top:2px;margin-right:10px;'>"+$.i18n('calendar_month')+"</span>");
	this.time_line_date_set.append(this.time_line_date_set_day);
	this.time_line_date_set.append("<span class='left font_size12 ' style='margin-top:2px;margin-right:2px;'>"+$.i18n('calendar_day')+"</span>");
	this.time_line_date_set.append(this.time_line_date_set_cancel);
	this.time_line_date_set.append(this.time_line_date_set_ok);
	
	this.time_line_date.append(this.time_line_date_set);
	this.time_line_edit_div.append(this.time_line_edit);
	
	$('body').append(this.time_line_edit_div);
	
	//this.time_line_box.append(this.time_line_edit_div);
	
	this.time_line_box.append(this.time_line_date);
	
	this.time_line_main = $("<div class='time_line_main relative' style='height:"+this.timeLineHeight+"px' id='"+this.id+"_main'></div>");
	
	this.timeStepInt = parseInt(this.timeStep[1],10)-parseInt(this.timeStep[0],10);
	this.subTime = this.timeLineHeight/(this.timeStepInt*2);
	for (var i=0; i<this.timeStepInt*2; i++) {
		if(i == 0){
				//整点刻度
				var time_hour_scale = $("<div class='time_hour_scale absolute'></div>");
					time_hour_scale.css({
					top:i*this.subTime-1
				});
				this.time_line_main.append(time_hour_scale);
				//整点时间
				var time_hour = $("<div class='time_hour absolute clearfix'><div class='time_hour_number' style='width:13px;'>"+(parseInt(this.timeStep[0],10)+i/2)+"</div><div class='time_hour_number_00' style='width:17px;'>:00</div></div>");
					time_hour.css({
						top:(i*this.subTime-6)-7
					});
				this.time_line_main.append(time_hour);
				this.scaleArray[parseInt(this.timeStep[0],10)+i/2] = i*this.subTime;
				this.scaleHourArray[parseInt(this.timeStep[0],10)+i/2] = time_hour;
		}else{
			if(i%2 == 0){
				//整点刻度
				var time_hour_scale = $("<div class='time_hour_scale absolute'></div>");
					time_hour_scale.css({
					top:i*this.subTime-1
				});
				this.time_line_main.append(time_hour_scale);
				//整点时间
				var time_hour = $("<div class='time_hour absolute clearfix'><div class='time_hour_number'>"+(parseInt(this.timeStep[0],10)+i/2)+"</div><div class='time_hour_number_00'>00</div></div>");
					time_hour.css({
						top:(i*this.subTime-6)-7
					});
				this.time_line_main.append(time_hour);
				this.scaleArray[parseInt(this.timeStep[0],10)+i/2] = i*this.subTime;
				this.scaleHourArray[parseInt(this.timeStep[0],10)+i/2] = time_hour;
			}else{
				//半点刻度
				var time_harf_hour_scale = $("<div class='time_harf_hour_scale absolute'></div>");
				time_harf_hour_scale.css({
					top:i*this.subTime
				});
				this.time_line_main.append(time_harf_hour_scale);
			}
		}
	}
	
	//最后一个时间刻度
	var time_harf_hour_scale = $("<div class='time_hour_scale absolute'></div>");
		time_harf_hour_scale.css({
		top:this.timeStepInt*2*this.subTime-1
	});
	//最后一个时间
	var time_hour = $("<div class='time_hour absolute clearfix'><div class='time_hour_number'>"+parseInt(this.timeStep[1],10)+"</div><div class='time_hour_number_00'>00</div></div>")
		time_hour.css({
			top:(this.timeStepInt*2*this.subTime-6)-7
		});
	this.time_line_main.append(time_hour);
	this.scaleArray[parseInt(this.timeStep[1],10)] = this.timeStepInt*2*this.subTime;
	this.scaleHourArray[parseInt(this.timeStep[1],10)] = time_hour;
	
	this.time_line_main.append(time_harf_hour_scale);
	this.time_line_box.append(this.time_line_main);
	 
	if(this.render == undefined){
		$('body').append(this.time_line_box);
	}else{
		$('#'+this.render).append(this.time_line_box);
	}
	this.year = this.date[0];
	this.month = parseInt(this.date[1],10);
	this.day = this.date[2];

	for (var g=1; g<13; g++) {
		this.time_line_date_set_mouth.append($("<option "+(g==this.month?"selected":'')+">"+g+"</option>"));
	};
	
	this.changeDate(parseInt(this.year,10),parseInt(this.month,10));
	var self =this;
	$('#'+this.id+'_editor').click(this.editClick);
	$('#'+this.id+'_maximize').click(this.maxClick);
	
	this.time_line_date_set_ok.click(this.searchClick);
	this.time_line_date_set_mouth.change(function(){
		//self.changeDate(self.date.getFullYear(),$(this).val());
		self.changeDate(parseInt(self.date[0],10),parseInt($(this).val(),10));
	})
	
	var time_line_edit_div_flag = true;
	this.time_line_box.mouseenter(function(){
		var _offset = $(this).offset();
		self.time_line_edit_div.css({
			left:_offset.left,
			top:_offset.top-16
		}).show();
		time_line_edit_div_flag = true;
	}).mouseleave(function(){
		setTimeout(function(){
			if(time_line_edit_div_flag)self.time_line_edit_div.hide();
		},10);
		
	});
	
	this.time_line_edit_div.mouseenter(function(){
		$('#'+self.id+'_time_line_date_set_tooltip').hide();
		$(this).show();
		time_line_edit_div_flag = false;
	}).mouseleave(function(){
		$(this).hide();
		time_line_edit_div_flag = true;
	});
	
	

	this.time_line_date.click(function () {
		if(self.setDateTooltip == undefined){
			var _left = self.time_line_date.offset().left-230;
			var _top = self.time_line_date.offset().top;
			self.setDateTooltip = $.tooltip({
				id:self.id+'_time_line_date_set_tooltip',
			    width:230,
				openAuto:false,
			    openPoint: [_left, _top],
			    htmlID: self.id+'_time_line_date_set',
			    direction: "RT",
		        z_index:900
			});
		}
		$('#'+self.id+'_time_line_date_set').show();
		self.setDateTooltip.show();
		if ($.browser.msie) {
			//协同V5.0 OA-35723 IE8下。已经做了防护的时间线js，月和日对应的那个tip锚定不到对应时间线上显示的月和日
			if ($.browser.version == '8.0' || $.browser.version == '7.0' || $.browser.version == '9.0') {
				$('.'+self.id+'_time_line_date_set_mouth').val(parseInt(self.month,10));
				$('.'+self.id+'_time_line_date_set_day').val(parseInt(self.day,10));
			}
		}
	});
}
MxtTimeLine.prototype.isHasMax = function(){
	for (var i=0; i<this.items.length; i++) {
		var _item = this.items[i];
		var _dateTime = parseInt(_item.dateTime,10);
		var _childItems = _item.childItems;
		if(_dateTime == parseInt(this.timeStep[1],10) && _childItems.length>0){
			this.isHasMaxEvent = true;
		}
	}
}
MxtTimeLine.prototype.initType = function(){
	var self = this;
	if(this.items && this.items.length>0){
		for (var i=0; i<this.items.length; i++) {
			var _item = this.items[i];
			var _type = _item.type;
			var _dateTime = parseInt(_item.dateTime,10);
			var _childItems = _item.childItems;
			
			if(_dateTime<parseInt(this.timeStep[0],10) || _dateTime>parseInt(this.timeStep[1],10)){
				continue;
			}
			
			var _contentIcon = $("<span class='time_line_icon "+_type+"'></span>");
			_contentIcon.css({
				top:this.scaleArray[_dateTime]+5
			});
			
			(function(obj,_type){
				obj.mouseenter(function(){
					$(this).addClass(_type+'_over');
				}).mouseleave(function(){
					$(this).removeClass(_type+'_over');
				});
			})(_contentIcon,_type);
			
			
			this.time_line_main.append(_contentIcon);
			var _contentDiv = "<div id='"+this.id+"_contentDiv"+i+"' class='"+this.id+"_time_dialog hidden'>"+"<ul class='time_dialog'>";
			for(var j = 0;j<_childItems.length;j++){
				var temp= _childItems[j];
				if(j == 0){
					_contentDiv+="<li style='border:0px;padding-top:0px;' onclick="+this.action+"('"+temp.id+"','"+(temp.type == undefined?_type:temp.type)+"')>";
				}else if(j == (_childItems.length-1)){
					_contentDiv+="<li style='padding-bottom:0px' onclick="+this.action+"('"+temp.id+"','"+(temp.type == undefined?_type:temp.type)+"')>";
				}else{
					_contentDiv+="<li onclick="+this.action+"('"+temp.id+"','"+(temp.type == undefined?_type:temp.type)+"')>";
				}
	                _contentDiv+="<div class='title'><em class='time_type_icon "+temp.type+"_ico  margin_r_5' style='position: static;display: inline-block;'></em><span style='display:inline-block;line-height:16px;height:16px;vertical-align:2px;'>"+temp.title+"</span></div>";
	                _contentDiv+="<div class='content'>"+temp.content+"</div>";
	                _contentDiv+="<div class='clearfix'>";
					
					var _widthAccount = 90;
					var _widthTime = 90;
					var _displayCSS="";
					if(temp.type == 'task'){
						_widthTime = 200;
						_widthAccount=0;
						_displayCSS="display:none;";
					}else if(temp.type == 'meeting'){
						_widthTime = 200;
						_widthAccount=0;
						_displayCSS="display:none;";
					}else if(temp.type == 'plan'){
						_widthTime = 220;
						_widthAccount=0;
						_displayCSS="display:none;";
					}else if(temp.type == 'event'){
						_widthTime = 200;
						_widthAccount=0;
						_displayCSS="display:none;";
					}else if(temp.type == 'collaboration'){
						_widthAccount=70;
						_widthTime = 130;
					}else if(temp.type == 'edoc'){
						_widthAccount=130;
						_widthTime = 70;
					}
					if(temp.account!=undefined){
						_contentDiv+="<span class='left account' style='"+_displayCSS+"width:"+_widthAccount+"px; text-align:left;font-size:12px;' title='"+temp.account+"'>"+temp.account+"</span>";
					}
					if (temp.type == 'meeting') {
						_contentDiv+="<span class='right' style='width:"+_widthTime+"px; text-align:right;font-size:12px;'>";
						if(temp.account!=undefined){
							_contentDiv+="<span class='margin_r_10'>"+temp.account+"</span>";
						}
						_contentDiv+=temp.dateTime+"</span></div>";
					}else{
						_contentDiv+="<span class='right' style='width:"+_widthTime+"px; text-align:right;font-size:12px;'>"+temp.dateTime+"</span></div>";
					}
					
                _contentDiv+="</li>";
			}
            _contentDiv+="</ul>"
			_contentDiv+="</div>"
			_contentIcon.append($(_contentDiv));
			
			var __left = _contentIcon.offset().left-260-6;
			var __top = _contentIcon.offset().top-8;
			var _tooltipHtmlId = self.id+'_contentDiv'+i;
			var _tooltipId = self.id+'_tooltip_'+i;
		    (function (_contentIcon, _tooltipId, self,_tooltipHtmlId,_left, _top) {
		        var sto;//延时启动，计时器
		        var _ttttt;
				$(_contentIcon).mouseenter(function(){
					//alert(_left+"=="+ _top)
					$('#'+_tooltipHtmlId).removeClass('hidden');
					if(_ttttt == undefined){
						_ttttt = $.tooltip({
							id:_tooltipId,
						    width:260,
							openAuto:false,
						    openPoint: [_left, _top],
						    htmlID: _tooltipHtmlId,
						    direction: "RT",
						    z_index: 900
						});
					}
					(function(_tooltipId,self){
						$('#'+_tooltipId).mouseenter(function(){
							self.hideFlag = false;
							$(this).show();
						}).mouseleave(function(){
							self.hideFlag = true;
							$(this).hide();
						});
					})(_tooltipId,self);
					
				    sto = setTimeout(function () {
				        self.hideFlag = true;
				        $("div.tooltip").hide();
				        $('#' + _tooltipId).show();
				        if ($.browser.msie) {
				            if ($.browser.version == '6.0') {
				                var _time_dialog = $('#' + _tooltipId).find('.time_dialog').eq(0);
				                var _time_dialog_h = _time_dialog.height();
				                if (_time_dialog_h > 300) {
				                    _time_dialog.height(300);
				                }
				            }
				        }
				    }, 500);
				}).mouseleave(function () {
				    clearTimeout(sto);
					setTimeout(function(){
						if(self.hideFlag){
							_ttttt.hide();
							$('#'+_tooltipHtmlId).addClass('hidden');
							self.hideFlag = false;
						}
					},100);
					
				});
			})(_contentIcon,_tooltipId,self,_tooltipHtmlId,__left, __top);
		}
	}
}
MxtTimeLine.prototype.clearLine = function(){
	this.scaleArray = new Object();
	this.scaleHourArray = new Object();
	this.boxPadding = 10;
	this.isHasMaxEvent = false;
	this.setDateTooltip = undefined;
	$('#'+this.id+'_editor').remove();
	$('#'+this.id+'_maximize').remove();
	$('#'+this.id+'_box').remove();
	$('#'+this.id+'_time_line_date_set').remove();
	$('#'+this.id+'_time_line_date_set_tooltip').remove();
	$('.'+this.id+'_time_dialog').remove();
}
MxtTimeLine.prototype.reset = function(options){
	this.timeStep = options.timeStep == undefined ? this.timeStep:options.timeStep;
	this.date = options.date == undefined ? this.date:options.date;
	this.autoHeight = options.autoHeight == undefined ? this.autoHeight:options.autoHeight;
	this.editClick = options.editClick == undefined ? this.editClick:options.editClick;
	this.maxClick = options.maxClick == undefined ? this.maxClick:options.maxClick;
	this.items = options.items == undefined ? this.items:options.items;
	this.clearLine();
	this.initTimeLine();
	this.initType();
}
MxtTimeLine.prototype.getDate = function(){
	var _year = this.date[0];
	var _mounth = $('#'+this.id+'_time_line_date_set_mouth').val();
	var _day = $('#'+this.id+'_time_line_date_set_day').val();
	
	var _ftime = this.timeStep[0];
	var _ttime = this.timeStep[1];
	return {'year':_year,'mounth':_mounth,'day':_day,'fromTime':_ftime,'toTime':_ttime};
}
MxtTimeLine.prototype.setTimeLineDate = function(dateObj){
	this.year = dateObj.year;
	this.mounth = dateObj.mounth;
	this.day = dateObj.day;
	if(this.mounth == undefined){
		this.mounth = dateObj.date.getMonth()+1;
	}
	if(this.day == undefined){
		this.day = dateObj.date.getDate();
	}
	$('#'+this.id+'_date').empty().html(this.mounth+"-"+this.day);
	
	$('#'+this.id+'_time_line_date_set_mouth').empty();
	for (var g=1; g<13; g++) {
		$('#'+this.id+'_time_line_date_set_mouth').append($("<option "+(g==this.mounth?"selected":'')+">"+g+"</option>"));
	};
	this.changeDate(parseInt(this.year,10),parseInt(this.mounth,10));
}
MxtTimeLine.prototype.changeDate = function(year,mounth){
    var n = this.MonHead[mounth - 1];
    if (mounth == 2 && this.IsPinYear(year)) {
        n++;
	}
    this.writeDay(n)
}
MxtTimeLine.prototype.writeDay = function(n){
	var str = "";
	for (var i = 1; i < (n + 1); i++){
	   str += "<option "+(i==parseInt(this.day,10)?'selected':'')+" value='" + i + "'> " + i + "</option>";
	} 
	$('#'+this.id+'_time_line_date_set_day').replaceWith("<select class='left "+this.id+"_time_line_date_set_day' id='"+this.id+"_time_line_date_set_day'>"+str+"</select>");
}
MxtTimeLine.prototype.IsPinYear = function(year){
	return (0 == year % 4 && (year % 100 != 0 || year % 400 == 0))
}
MxtTimeLine.prototype.getDateObj = function(id){
	var _items = this.items;
	var _obj = null;
	if(_items && _items.length>0){
		for (var i=0; i<_items.length; i++) {
			var _item = _items[i];
			var _chield = _item.childItems;
			if(_chield && _chield.length>0){
				for (var j=0; j<_chield.length; j++) {
					var _ch = _chield[j];
					var _chId = _ch.id;
					if(_chId && _chId==id){
						_obj = _ch;
						break;
					}
				}
			}
		}
	}
	return _obj;
}