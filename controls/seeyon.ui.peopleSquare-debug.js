/**
 * @author macj
 */
function ifClose(minL, maxL, minT, maxT,fn) {// 判断是否关闭窗口
	$(document).bind('mouseover',
        function (e) {
            var targ = e.target;
            if (targ.nodeType == 3)
                targ = targ.parentNode // Safari
            var inArea = e.clientX >minL// inArea表示鼠标是否在头像与卡片之间则不关闭窗口
                && e.clientX < maxL
                && e.clientY < maxT
                && e.clientY > minT;
            if (!inArea) {
            	fn();
            	$(document).unbind('mouseover');
            }
        });
}
function MxtPeopleSquare (options){
	this.id = options.id ? options.id : Math.floor(Math.random() * 100000000);
	this.width = options.width == undefined?500:options.width;
	this.height = options.height == undefined?500:options.height;
	this.imgH = options.imgH == undefined?50:options.imgH;
	this.imgW = options.imgW == undefined?50:options.imgW;
	
	this.step1_MimgH=options.step1_MimgH==undefined ? 84: options.step1_MimgH;//10人 鼠标移上去头像的大小
	this.step1_MimgW=options.step1_MimgW==undefined ? 84: options.step1_MimgW;
	
	this.step2_MimgH=options.step1_MimgH==undefined ? 60: options.step2_MimgH;//20人 鼠标移上去头像的大小
	this.step2_MimgW=options.step1_MimgW==undefined ? 60: options.step2_MimgW;
	
	this.defaultPeople = options.defaultPeople;
	
	this.squareR = options.squareR == undefined?200:options.squareR;
	this.peopleItems = options.peopleItems;
	
	this.currentStepInt = 1;					//第一步
	this.currentStep = 'step'+this.currentStepInt; //当前步骤
	
	this.sliderMax = options.sliderMax == undefined?50:options.sliderMax;
	this.squareStep = options.squareStep == undefined?10:options.squareStep;
	
	this.sliderHandle = options.sliderHandle;
	
	this.parentId = options.parentId; 
	
	this.over = options.mouseOver; //鼠标移入的事件Fun
	this.out = options.mouseOut;	//鼠标移出的fun
	
	//不同的分辨率下位置和字体的计算
	this.margin="auto";
	this.left=0;
	
	var zoom=$("#"+this.parentId).height()/this.height;
	if(zoom<1){	
		this.left=($(".layout_center").width()-this.width*zoom)/2/zoom; //计算后位置放置在中心
		this.margin=0; //设置所有浏览器默认居左，保证设置left值后，在所有浏览器下表现一致
		
		if ($.browser.mozilla){
			var _l = -$(".layout_center").width()*(1-zoom)/2;
			var _t = -$(".layout_center").height()*(1-zoom)/2;
			$("#"+this.parentId).css({"-moz-transform":'scale('+zoom+')','left':_l,'top':_t});
			$("#"+this.parentId).attr('zoomAttr',zoom);
		}else{
			$("#"+this.parentId).css({"zoom":zoom});
		}
	}
	
	//头像的位置
	this.sinMath = [
		[[0],[1]],
		[[0,0],[1,-1]],
		[[0,0.866,-0.866],[1,-0.5,-0.5]],
		[[0,1,0,-1],[1,0,-1,0]],
		[[0,0.951,0.588,-0.588,-0.951],[1,0.309,-0.809,-0.809,0.309]],
		[[0,0.866,0.866,0,-0.866,-0.866],[1,0.5,-0.5,-1,-0.5,0.5]],
		[[0,0.782,0.975,0.434,-0.434,-0.975,-0.782],[1,0.623,-0.223,-0.901,-0.901,-0.223,0.623]],
		[[0,0.707,1,0.707,0,-0.707,-1,-0.707],[1,0.707,0,-0.707,-1,-0.707,0,0.707]],
		[[0,0.643,0.985,0.866,0.342,-0.342,-0.866,-0.985,-0.642],[1,0.766,0.174,-0.5,-0.940,-0.940,-0.5,0.174,0.766]],
		[[1.05,0.809,0.309,-0.309,-0.78,-0.96,-0.78,-0.309,0.309,0.809],[0,-0.588,-0.98,-0.951,-0.55,0,0.55,0.951,0.98,0.588]],
		[[1,0.809,0.309,-0.309,-0.809,-1,-0.809,-0.309,0.309,0.809],[0,-0.588,-0.951,-0.951,-0.588,0,0.588,0.951,0.951,0.588]],
		[[1,1,0.6,0.05,-0.55,-0.89,-0.9,-0.55,0.05,0.6],[0.35,-0.25,-0.75,-0.95,-0.72,-0.25,0.35,0.85,1.03,0.85]]	
	]; 
	
	//this.lineArray = [];
	this.initSquare();
}
MxtPeopleSquare.prototype.initSquare = function () {
    var _self = this;
	this.canvasDiv = $("<div id='"+this.id+"' style='width:"+this.width+"px;height:"+this.height+"px;left:"+this.left+"px;margin:"+this.margin+"' class='relative canvasbg'></div>");	
	this.myDiv = $("<div id='"+this.id+"_center' class='absolute myDiv' title='"+this.defaultPeople.defaultName+"'></div>");
	this.myImgDiv = $("<div class='myImgDiv' style='width:"+this.imgW+"px; height:"+this.imgH+"px;background-color:transparent;'><img class='radius' src='"+this.defaultPeople.defaultSrc+"' width='100%' height='100%'></div>");
	this.myName = $("<span class='myName'>"+this.defaultPeople.defaultName+"</span>");
	this.myDiv.css({
		top:(this.width-146)/2,
		left:(this.height-147)/2
	});	
	this.myDiv.append(this.myImgDiv);
	this.myDiv.append(this.myName);
	this.canvasDiv.append(this.myDiv);
	
	this.canvasDiv.prependTo($("#" + this.parentId));//创建的关系图插入到 定义的id内
	
	$("#" + this.id + "_center").bind("click", function () {
	    _self.defaultPeople.click(this.id);
	})
	
	$(".myImgDiv").bind({    //鼠标移入移出改变中心任务的头像大小
		    "mouseenter": function () {			    			    	
		    	$(this).animate({"width":84,"height":84,"margin-top":30},{queue:false});		          
		    },
		    "mouseleave": function () {  
		    	$(this).stop(); //停止动画		    		
		    	$(this).animate({"width":54,"height":54,"margin-top":40},{queue:false});
		    }
		})
	if(this.peopleItems!=undefined && this.peopleItems.step1 && this.peopleItems.step1.length>0){
		
		this.addItems(this.peopleItems.step1,'step1'); //加载 10人的信息
	}
}
MxtPeopleSquare.prototype.setAnimate = function (_value) {
	
    this.currentStep=_value;	
    
    if(this.currentStep=="step2") this.canvasDiv.removeClass("canvasbg").addClass("canvasbg2");//替换背景
    else this.canvasDiv.removeClass("canvasbg2").addClass("canvasbg");//替换背景
    
    //判读是否是第一次加载step2
	if ($('#' + this.currentStep+'_canvasbg').size() == 0) {
		this.addItems(this.peopleItems[this.currentStep], this.currentStep);
	}else if(this.currentStep=="step2") {//展示11-20人		
		
		$("#step2_canvasbg .canvasImgDiv").each(function(){
			var self=$(this);
			$(this).animate({			
				top:self.attr("top"),
				left:self.attr("left"),
				opacity:1
			})			
		})		
	}	
}
MxtPeopleSquare.prototype.updateItems=function(step,width,height,squareR){
	var _self=this;
	var items=this.peopleItems[step];
	if(items == undefined) return;
	var _length = items.length;
	var size= this.currentStep=="step2" && _length==10 ? _length:_length-1
	for (var i = 0; i < items.length; i++) {
		var _imgDiv = $("#"+items[i].id);
		var _left =width/2  - squareR*this.sinMath [size][1][i];
		var _top = height/2  -squareR*this.sinMath[size][0][i];	
			
		//储存默认只有10个人的时候头像的位置
		_imgDiv.attr("left",_left-this.imgW/2)
			   .attr("top",_top-this.imgH/2);

	}
	$("#step1_canvasbg .canvasImgDiv").each(function(){
		var self=$(this);
		$(this).animate({
			top:self.attr("top"),
			left:self.attr("left"),
			opacity:1
		});
		$(this).find(".canvasImg").animate({
			"width":_self.imgW,
			"height":_self.imgH
		});
	})	
	
	//如果再点击10个人， 将step2组的人员头像位置回到中心位置
	if(this.currentStep!="step2") {	
		$("#step2_canvasbg .canvasImgDiv").animate({
			top:(this.width-146)/2+53,
			left:(this.height-147)/2+50,
			opacity:-0.5
		});
	}
}
MxtPeopleSquare.prototype.addItems = function (items, step) {
	if(items == undefined) return;
	var _length = items.length;	
	this.canvasMainBgDiv = $("<div id='"+step+"_canvasbg' style='width:"+this.width+"px;height:"+this.height+"px;' class='canvasMainbg'></div>");
	
	this.canvasMainBgDiv.appendTo(this.canvasDiv);	
	for (var i = 0; i < items.length; i++) {
	    var _self = this;
		var _item = items[i];
		var _imgDiv = $("<div id='"+_item.id+"'  class='absolute canvasImgDiv "+step+"' title='"+_item.name+"'></div>");
		var _imgDiv2 = $("<div class='canvasImg' style='width:"+this.imgW+"px; height:"+this.imgW+"px;background-color:transparent;border:0px;'><img class='radius' src='"+_item.src+"' width='100%' height='100%'></div>");
		var num = step == "step2" ? i+11:i+1; //顺序
		
		if(num<=3) n="<span class='font_bold valign_m' style='font-size:22px;'>"+num+"</span>"; //如果是前3个人，排序加粗，字体加大
		
		else n="<span class='font_bold valign_m margin_r_5 font_size14'>"+num+"</span>"
		
		var _name = $("<span class='canvasName'>"+n+_item.name+"</span>"); //人名
		
		_imgDiv2.appendTo(_imgDiv);
		
		var size=step == "step2"&&_length==10 ?_length:_length;
		_name.appendTo(_imgDiv);
		
		var _left = this.width/2  -  this.squareR*this.sinMath[size-1][1][i];
		var _top = this.height/2  -  this.squareR*this.sinMath[size-1][0][i];		
		_imgDiv.css({ // 头像默认位置放在中心位置
			top:(this.width-146)/2+53,
			left:(this.height-147)/2+50,
			opacity:0
		});
		_imgDiv.sin = this.sinMath[size-1][0][i];
		_imgDiv.con = this.sinMath[size-1][1][i];
		_imgDiv.appendTo(this.canvasMainBgDiv);
		
		_item.left=_left-this.imgW/2;
		_item.top=_top-this.imgH/2;
		
		$("#"+_item.id).animate({left:_item.left,top:_item .top,opacity:1},500) //用动画 设置头像位置
					   .attr("left",_item.left)
					   .attr("top",_item.top);
					   
		var l=(this[this.currentStep+"_MimgW"]-this.imgW)/2;//计算鼠标移上去的位置
		var t=(this[_self.currentStep+"_MimgH"]-this.imgH)/2;
		
		$("#" + _item.id).unbind().bind({//鼠标移入，头像放大
		    "mouseenter": function () {	
		    	var tt=$(this);		    	
		    	tt.animate({left:parseFloat(tt.css("left"))-l,top:parseFloat(tt.css("top"))-t},{queue:false,duration:500,
		    			complete:function(){
		    				_self.over(tt.attr('id'),_self[_self.currentStep+'_MimgW'])
		    				}
		    		});
		    	tt.find(".canvasImg").animate({"width":_self[_self.currentStep+"_MimgW"],"height":_self[_self.currentStep+"_MimgH"]},{queue:false,duration:500});		        		        
		    },
		    "mouseleave": function () { //移出还原
		    	var tt=$(this);
		    	tt.stop(); //停止动画
		    	tt.find(".canvasImg").stop();	//停止动画	    	
		    	tt.animate({left:tt.attr("left"),top:tt.attr("top")},{queue:false});
		    	tt.find(".canvasImg").animate({"width":_self.imgW,"height":_self.imgH},{queue:false});
		    	_self.out(tt.attr("id"),_self[_self.currentStep+'_MimgW']);
		    }
		})
	}
}


