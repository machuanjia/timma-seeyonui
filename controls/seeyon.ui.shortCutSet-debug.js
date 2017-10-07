var Bord=({
	//返回选中的option数组；
	base:function(current){
		var preoption=current.find("option:selected");
		if(preoption.length==0) {$.alert($.i18n("assistantSetup.select.label"));return false;}
		return preoption;
	},
	//选择
	add:function(){
		with(this){
			var addList=base(addObj);
			if(addList==false) return false;
			for(var i=0;i<addList.length;i++){
				if(maxLength!=false&&(i>maxLength-1||removeObj.find("option").length>=maxLength)){$.alert($.i18n("portal.select.max.label", maxLength));return};	//是否超过最大设置条数			
				if(isKeep==true){
					if(!addObj.find($(addList[i])).hasClass("color_gray")){
						removeObj.append($(addList[i]).clone(true));	
					}
					else {$.alert($.i18n("portal.select.repeat.label"));return false;}
					addObj.find($(addList[i])).addClass("color_gray");
				}
				else{
					addObj.find($(addList[i])).remove();
					removeObj.append($(addList[i]).clone(true));	
				}
				
			}	
		}	
		return true;		
	},
	//删除选择
	remove:function(){
		with(this){
			var removeList=base(removeObj);
			if(removeList==false) return false;
			for(var i=0;i<removeList.length;i++){
				removeObj.find($(removeList[i])).remove();
				var selectId = $(removeList[i]).attr("type");
				if(isKeep==true){
					var val=$(removeList[i]).val();
					$("#" + selectId).find("option[value='"+val+"']").removeClass("color_gray");
				}
				else{
					
					$("#" + selectId).append(removeList[i]);
				}
			}
		}
		return true;
	},
	//上移
	moveT:function(obj){
		var moveList=this.base(obj);
		for(var i=0;i<moveList.length;i++){
			var option=$(moveList[i]);
			var ele=obj.find("option").eq(i);
			var temp=option.prev("option");	
					
			//if(option.attr("value")!=ele.attr("value")) 
			option.after(temp); //连选
		}
	},
	//下移
	moveB:function(obj){
		var moveList=this.base(obj);
		var moveLength=moveList.length;//需要下移的项
		var objLength=obj.find("option").length;//所有已选中的项数
		for(var i=0;i<moveList.length;i++){
			var option=$(moveList[moveLength-i-1]);
			var ele=obj.find("option").eq(objLength-i-1);
			var temp=option.next("option");
			if(option.attr("value")!=ele.attr("value")) option.before(temp);
		}
	},
	refreash:function(){
		with(this){
			var options=removeObj.find("option");
			$.each(options,function(i,n){
				var selectId = $(n).attr("type"); //备选框
				var val=$(n).val(); 
				if(isKeep==true){
				//var val=$(removeList[i]).val();
				$("#" + selectId).find("option[value='"+val+"']").addClass("color_gray");
			}
			else{
				
				$("#" + selectId).find("option[value='"+val+"']").remove();
			}	
				//alert(selectId)
			})
			
		}
	}
})
//构造函数
function setBord(option){
	this.maxLength=option.maxLength; // 最多能选中多少条
	this.isKeep=option.isKeep;       //是否在备选中保留值
	this.addObj=option.addObj;       //备选框（可能存在多个）
	this.removeObj=option.removeObj; //(已选框)
	if(option.dbbinds){              // 绑定双击事件
		$.each(option.dbbinds,function(i,n){
			$(i).bind("dblclick",n);
		});	
	}
}
setBord.prototype=Bord;

