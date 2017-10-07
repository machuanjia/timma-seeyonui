/// <reference path="jquery.min.js" />
function goldFun() {

}
document.onreadystatechange = WrapTopBarFun;//当页面加载状态改变的时候执行这个方法. 
function WrapTopBarFun() {
    if (document.readyState == "complete") { //当页面加载状态 

        var WrapTopBar_data_json = [
            {
                name: "HTML5",
                data: [
                    { name: "Web SQL", href: "api_WebSQL.html" },
                    { name: "Web Storage", href: "tag_WebStorage.html" },
                    { name: "App Cache", href: "tag_AppCache.html" },
                    { name: "Canvas", href: "tag_canvas.html" },
                    { name: "Video", href: "tag_video.html" },
                    { name: "Audio", href: "tag_audio.html" },
                    { name: "API_WebSocket", href: "api_WebSocket.html" },
                    { name: "API_WebRTC", href: "api_WebRTC.html" },
                    { name: "API_Geolocation", href: "api_geolocation.html" },
                    { name: "API_WebWorkers", href: "api_WebWorkers.html" },
                    { name: "Event_Drop", href: "event_drop.html" },
                    { name: "新标签", href: "tag_list.html" },
					{ name: "新事件属性", href: "tag_event_list.html" },
					{ name: "表单元素", href: "tag_form_list.html" }
                ]
            }, {
                name: "CSS3",
                data: [
                    { name: "简介", href: "css3_intro.html" },
                    { name: "选择器", href: "css3_selector.html" },
                    { name: "边框", href: "css3_border.html" },
                    { name: "背景", href: "css3_background.html" },
                    { name: "文本效果", href: "css3_text_effect.html" },
                    { name: "字体", href: "css3_font.html" },
                    { name: "2D 转换", href: "css3_2dtransform.html" },
                    { name: "3D 转换", href: "css3_3dtransform.html" },
					{ name: "过渡", href: "css3_transition.html" },
					{ name: "动画", href: "css3_animation.html" },
					{ name: "多列", href: "css3_multiple_columns.html" }
                ]
            },{
                name:"app",
                data:[
                    {name:"雨滴",href:"app/rain.html"}
                ]
            }
        ];
        //顶部菜单生成 - start
        var WrapTopBar_html = "";
        WrapTopBar_html += '<div class="WrapTopBar_area">';
        WrapTopBar_html += '<div class="WrapTopBar_div_area">';
        for (var i = 0; i < WrapTopBar_data_json.length; i++) {
            WrapTopBar_html += '<ul>';
            WrapTopBar_html += '<li class="title"><a href="javascript:;">' + WrapTopBar_data_json[i].name + '</a></li>';
            for (var k = 0; k < WrapTopBar_data_json[i].data.length; k++) {
                WrapTopBar_html += '<li><a href="' + WrapTopBar_data_json[i].data[k].href + '">' + WrapTopBar_data_json[i].data[k].name + '</a></li>';
            }
            WrapTopBar_html += '</ul>';
        }
        WrapTopBar_html += '</div>';
        WrapTopBar_html += '</div>';
        $("body.demo").prepend(WrapTopBar_html);
        $(".WrapTopBar_div_area").mouseover(function () {
            $(this).find("ul").each(function () {

                if ($(this).attr("defaultWidth") == undefined) {
                    $(this).attr("defaultWidth", $(this).width());
                }
                var defaultWidth = $(this).attr("defaultWidth") * 1 + 10;
                var li_obj = $(this).find("li");
                var n = li_obj.size() - 1;//减去li标题
                var m = Math.ceil(n / 10);
                if (m > 1) {
                    //开始动画
                    var w = defaultWidth * m;
                    $(this).find("li.title").width(w);
                    $(this).stop().animate({
                        width: w
                    }, 200);
                }
            });
        }).mouseout(function () {
            $(this).find("ul").each(function () {
                var w = 120;
                if ($(this).data("defaultWidth") != undefined) {
                    w = $(this).data("defaultWidth");
                }
                $(this).find("li.title").width(w);
                $(this).stop().animate({
                    width: w
                }, 300);
            });
        });
    }
}