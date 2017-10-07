/**
 * @author macj
 */
function MxtFace(options){
    this.id = options.id ? options.id : Math.floor(Math.random() * 100000000);
    this.width = options.width ? options.width : 288;
    this.height = options.height ? options.height : 160;
    this.borderSize = 1;//边框尺寸(像素)
    this.target =  options.target;//必须参数
	this.fixObj =  options.fixObj;//必须参数
	
	if(this.target == null || this.fixObj == null){return;}
    this.left = options.left==undefined ?  200:options.left;
	this.top = options.top==undefined ?  200:options.top;
	
	this.isUp = options.isUp==undefined ?  false:options.isUp;
	
	this.clickFn  = options.clickFn;
	if(this.clickFn == undefined){
		this.clickFn = function(){}
	}
    
    this.init();
		
}
MxtFace.prototype.init = function(){
    //判断是否存在.存在就先移处
    if (typeof($("#" + this.id)[0]) != "undefined") {
        $("#" + this.id).remove();
    }
	var fixObj = document.getElementById(this.fixObj);
	if(!this.isUp){
		this.top = fixObj.getBoundingClientRect().top+fixObj.clientHeight+10;
	}else{
		this.top = fixObj.getBoundingClientRect().top-this.height-20;
	}
	//+fixObj.clientHeight+10
	this.left = fixObj.getBoundingClientRect().left-10;
	
    var htmlStr = "";
    htmlStr += "<div id='" + this.id + "' class='dialog_box absolute' style='left:" + this.left+ "px;top:"+this.top+"px'>";
    //阴影   style='left:700px;top:220px'
    htmlStr += "<div id='" + this.id + "_shadow' class='dialog_shadow absolute' style='width:" + (this.width + this.borderSize * 2) + "px;height:" + (this.height + this.borderSize * 2) + "px;'>&nbsp;</div>"
	    //main
	    htmlStr += "<div id='" + this.id + "_main' class='dialog_main absolute' style='width:" + this.width + "px'>";
		    //header
		    htmlStr += "<div id='" + this.id + "_main_head' class='clearfix'>";
		    htmlStr += "</div>";
			//header
			//body
		    htmlStr += "<div id='" + this.id + "_main_body' class='dialog_main_body left' style='width:" + this.width + "px;height:" + this.height + "px'>";
			    //iframe 遮罩层
			    htmlStr += "<div id='" + this.id + "_main_iframe' class='dialog_main_iframe absolute' style='top:" + this.headerHeight + "px;width:" + this.width + "px;height:" + this.height + "px;display:none;'>&nbsp;</div>";
			    //iframe 容器
			    htmlStr += "<div id='" + this.id + "_main_content' class='dialog_main_content absolute'>";
					htmlStr+="<div id='" + this.id + "_main_iframe_div' class='dialog_main_content_html padding_5 margin_5' style='margin-top:0px;width:"+(this.width-22)+"px;height:"+(this.height-22)+"px;'>";
			        htmlStr+="</div>";
				htmlStr += "</div>";
				
		    htmlStr += "</div>";
		    //body
	    htmlStr += "</div>";
	    //main
    htmlStr += "</div>";
    $("body").prepend(htmlStr);
	
	var self = this;
	$("<span id='" + this.id + "_close' class='dialog_close right' title='" + this.closeTitle + "'></span>").css('margin-top','0px').click(function(){
		self.close();
	}).appendTo($("#"+this.id+"_main_head"));
	//循环增加样式表情
	
	for(var i=1;i<51;i++){
		$("<img id='"+this.id+"_img"+i+"' src='../../skin/default/images/face/"+i+".gif'/>").appendTo($("#"+this.id+"_main_iframe_div"));
 		(function(g,id){
			$('#'+id+'_img'+g).click(function(){
				$('#'+self.target).append("<img src='../../skin/default/images/face/"+g+".gif'/>");
				$('#'+self.id).remove();
			}).click(self.clickFn);
		})(i,this.id)
	}
		
}

MxtFace.prototype.close = function(){
	$('#'+this.id).remove();
	
}
