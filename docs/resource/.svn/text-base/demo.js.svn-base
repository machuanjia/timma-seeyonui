/**
 * @author macj
 */
//隐藏/显示内容；
function Dev(){
	type="dev";
	$(".dev_hide").hide();
}
function Design(){
	type="design";
	$(".design_hide").hide();
	$(".sorce_code").css("display","none");
}
$(function () {
    $(".code").each(function () {
        var _self = $(this);
      //  _self.append("<a href='javascript:void(0)' class='view_source' title='查看源代码' style='clear:both;'>View Source</a>");
        _self.append("<div class='sorce_code over_auto'><pre  class=\"prettyprint\">111</pre></div>");
        var tempObj = _self.clone(true);
        tempObj.find(".view_source").remove();
        tempObj.find(".sorce_code").remove();
        _self.find(".sorce_code").find("pre").text(tempObj.html()).end();
        //_self.find(".view_source").click(function () {
          //  _self.find(".sorce_code").toggle();
       // })
    })
    //切换显示内容
	$("#ver_dev").toggle(function(){
		ver="dev"; //开发使用版
		$(this).html("完整版");
		window.parent.frames['leftFrame'].getVer(ver);
		window.parent.frames['rightFrame'].getVer(ver);
	},
	function(){
		ver="common"; //开发使用版
		$(this).html("开发精简版");
		window.parent.frames['leftFrame'].getVer();
		window.parent.frames['rightFrame'].getVer(ver);
	}
	)
	

	
})