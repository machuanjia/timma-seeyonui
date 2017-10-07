/**
 * @author macj
 */
function showDemo(obj,tarId){
	if(obj && tarId){
		var codeObj = document.getElementById(tarId);
		if(codeObj.nodeType == 1 && codeObj.className == 'hidden' ){
			codeObj.className = 'table-row';
			obj.innerHTML = "-";
		}else{
			codeObj.className = 'hidden';
			obj.innerHTML = "+";
		}
	}
}
$(function(){
	(function(){
	$(".code_list").each(function(){
		var _self=$(this);
		_self.append("<a  href='javascript:void(0)' class='view_source' title='查看源代码' style='display:block;clear:both;'>View Source</a>");
		_self.after("<div class='sorce_code' style='background:#e8f8ff;border:1px solid #ccc'><pre></pre></div>");
		var tempObj=_self.clone(true);
		tempObj.find(".view_source").remove();
		_self.next(".sorce_code").find("pre").text(tempObj.html()).end().hide();
		_self.find(".view_source").click(function(){
			$(this).toggleClass("view_source_hidden");
			$(this).parent().next(".sorce_code").toggle();
		})
	})
})();

})


