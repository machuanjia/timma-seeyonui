jQuery.extend({
    portalChannel:function(ob,liWidth){
		var isChangeSize=false;
		
		initPortalChannel(ob,liWidth);
		
		return isChangeSize;
		
		function initPortalChannel(obj,liWidth){
			//var liWidth=$(obj).width()-1;//一行的整体宽度
			$(obj).width(liWidth);
			//>>>发起人计算
			var senderArr=[];
			var sender_w=0;
			$(obj).find(".hasIconSpan").each(function(){
				var w=$(this).width()*1;
				if (w>60) {
					w=60;
				};
				if($(this).parent().find(".ico16").size()>0){//如果显示图标
					w+=16;
				}
				senderArr.push(w);
			});
			
			senderArr.sort(function (a, b) { return a < b ? 1 : -1 });
			sender_w=senderArr[0];
			
			$(obj).find(".senderflag").width(sender_w);
			$(obj).find(".hasIconSpan").each(function(){
				var w=$(this).parent().width();
				if($(this).parent().find(".ico16").size()>0){//如果显示图标
					w-=17;
				}
				$(this).width(w+1);
			});
			//<<<发起人计算
			//>>>节点权限
			var pendingNodeNameArr=[];
			$(obj).find(".pendingNodeName").each(function(){
				var w=$(this).width()*1;
				if (w>55) {
					w=55;
				};
				pendingNodeNameArr.push(w);
			});
			pendingNodeNameArr.sort(function (a, b) { return a < b ? 1 : -1 })
			$(obj).find(".pendingNodeName").width(pendingNodeNameArr[0]);
			//<<<节点权限
			
			
			
			$(obj).find("li").each(function(){
				//.channel_title控制宽度，其他列都是固定宽度
				var liObj=$(this);//一行的jquery对象
				var titleObj=liObj.find(".channel_title");//标题jquery对象
				//var liWidth=liObj.parents(".channel_content").width()-1;//一行的整体宽度
				var titleWidth=0;//标题宽度
				var flagWidth=0;//所有其他固定列的总宽度
				liObj.find(".flagClass").each(function(){
					flagWidth+=$(this).outerWidth();
				});
				titleWidth=liWidth-flagWidth;//计算标题宽度
				var titleIconWidth=0;//标题里面，图标的宽度
				titleObj.find(".ico16").each(function() {
					var iconMargin=$(this).css("margin-left").replace("px","")*1+$(this).css("margin-right").replace("px","")*1;//图标的margin
					titleIconWidth+=$(this).width()+iconMargin;
				});
				var ulWidth=0;
				
				if (titleWidth<80) {
					ulWidth=liWidth+(80-titleWidth);
					titleWidth=80;
				}
				
				titleObj.width(titleWidth);
				
				var titleAObj=titleObj.find("a");
				var titleAWidth=titleAObj.width();
				if (titleAWidth>titleWidth-titleIconWidth) {
					var w=titleWidth-titleIconWidth;
					titleAObj.width(w-5);//设置标题里面的a宽度 ,减去5px为了适应特殊数据
				}
				//宽度不足的时候，出现滚动条
				if(ulWidth>liWidth){
					$("#leftListDiv").css("width",ulWidth);
					$("#rightListDiv").css("width",ulWidth);
					isChangeSize=true;
				}
			});
		}
	}
});