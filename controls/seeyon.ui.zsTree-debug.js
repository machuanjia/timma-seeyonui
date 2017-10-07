/**
 * 项目任务 － 树
 * @author zhenshuai
 * Date: 2015-01-19
 */
function zsTree (option) {
    this.p = {
        id: "zsTree" + Math.floor(Math.random() * 100000000),
        targetId: '', //显示DOM的ID
        data: [], //数据
        onlyText: true, //判断?节点只包含文本
        computeWidth: false, //计算node name的宽度
        nodeWidth: 120,
        asynAddData: function(){}, //异步加载方法
        onAddCallback:function(){}, //回调，添加完成后
        onNodeSelected: function(){} //回调，选择节点后
    };
    this.p.width = $("#"+ this.p.targetId).width();
    $.extend(this.p, option);

    this.init();
}
zsTree.prototype.init = function() {
    var t = this;
    var p = this.p;
    var treeHtml = '';
    treeHtml += '<div id="'+ p.id +'" class="zsTree" style="{0}">';
    treeHtml += '</div>';
    //设置tree整体宽度，来显示滚动条
    if (p.computeWidth == false) {
        treeHtml = treeHtml.replace("{0}", "display:inline-block;");
    } else {
        treeHtml = treeHtml.replace("{0}", "");
    };
    //DOM插入
    $("#"+ p.targetId).append(treeHtml);
    //绑定事件
    $("#"+ p.id).delegate(".node_icon", "click", function () {
        var _this = $(this);
        if (_this.hasClass('node_icon_open')) {
            _this.removeClass('node_icon_open').addClass('node_icon_close');
            _this.parent().nextAll("ul").slideUp('fast');
            _this.find(".node_line_child").fadeOut('fast');
        } else if (_this.hasClass('node_icon_close')) {
            _this.removeClass('node_icon_close').addClass('node_icon_open');
            _this.parent().nextAll("ul").slideDown('fast');
            _this.find(".node_line_child").fadeIn('fast');
            //判断?异步加载数据
            var parentObj = _this.parents("ul").eq(0);
            if (!parentObj.hasClass('asynEnd')) {
                //判断?异步加载成功，防止二次加载数据
                var success = p.asynAddData(parentObj.attr('id'));
                if (success == true) {
                    parentObj.addClass('asynEnd');
                };
            };
        };
    });
    if (p.onlyText == true) {
        $("#"+ p.id).delegate('.nodeTextArea', 'click', function(event) {
            $("#"+ p.id).find(".nodeTextArea").removeClass("node_selected");
            $(this).addClass("node_selected");
            p.onNodeSelected($(this).parents("ul").eq(0).attr("id"));
        });
    };
    //加载数据
    this.addData(p.data, true);
};
//加载数据
zsTree.prototype.addData = function(d, isNoAnimate) {
    var t = this;
    var p = this.p;
    var data = d;
    
    for (var i = 0; i < data.length; i++) {
        var html = '';
        html += '<ul id="{0}" class="{7} level{2} {1} {5} {11}">';
            html += '<li class="{8}">';
                html += '<div class="nodeArea {3}">';
                    html += '<em class="node_icon {4}">{9}</em>';
                    html += '<span class="nodeTextArea" style="{10} {12}">{6}</span>';
                html += '</div>';
            html += '</li>';
        html += '</ul>';
        html = html.replace("{0}", data[i].id); //id
        if (data[i].hasChild == true) { //图标
            html = html.replace("{4}", "node_icon_close");
            html = html.replace("{5}", "");
        } else {
            html = html.replace("{4}", "node_icon_end");
            html = html.replace("{5}", "asynEnd");
        };
        if (data[i].level != 0) {
            html = html.replace("{1}", 'node_last');
            html = html.replace("{2}", data[i].level);//level
            html = html.replace("{3}", '');
            html = html.replace("{7}", 'node_ul');
            html = html.replace("{8}", 'node_li');
            html = html.replace("{9}", '<em class="node_line_parent"></em>');
        } else {
            html = html.replace("{1}", '');
            html = html.replace("{2}", '0');
            html = html.replace("{3}", 'node_root');
            html = html.replace("{7}", '');
            html = html.replace("{8}", '');
            html = html.replace("{9}", '');
        };
        if (isNoAnimate == true) {
            html = html.replace("{11}", '')
        } else {
            html = html.replace("{11}", 'hidden');
        };
        if (p.computeWidth == true) {
            html = html.replace("{10}", ' overflow:hidden;'); //计算宽度
        } else {
            html = html.replace("{10}", ''); //计算宽度
        };
        html = html.replace("{6}", data[i].name); //节点名称
        if (p.onlyText == true) {
            html = html.replace("{12}", 'overflow:hidden;max-width:'+ p.nodeWidth +'px;'); //节点宽度
        } else {
            html = html.replace("{12}", '');
        };

        //判断?同级最后一项
        var levelAllItem = $("#"+ p.id).find(".level"+ data[i].level);
        if (levelAllItem.size() >= 1 && data[i].level != 0) {
            levelAllItem.removeClass('node_last').addClass('node_parent_line');
        };
        //添加子级，父级添加连线
        $("#"+ data[i].pId).find(".node_icon:eq(0)").find(".node_line_child").remove().end().append('<em class="node_line_child"></em>').removeClass('node_icon_end node_icon_close').addClass("node_icon_open").show();

        //DOM插入
        if (data[i].pId == undefined || data[i].pId == "-1") {
            $("#"+ p.id).append(html);
        } else {
            $("#"+ data[i].pId +" > li").append(html);
        };
        //设置tree整体宽度，来显示滚动条
        if (p.computeWidth === false) {
            var oldAllWidth = $("#"+ p.id).width() == null ? 0 : $("#"+ p.id).width();
            var newAllwidth = (data[i].level*1 + 1) * 24 + ($("#"+ data[i].id).find(".nodeTextArea:eq(0)").width() * 1) + 20;
            if (newAllwidth >= oldAllWidth) {
                $("#"+ p.id).width(newAllwidth);
            };
        };
        //插入展开动画
        if (isNoAnimate != false) {
            $("#"+ data[i].id).slideDown("fast");
        };
        if (p.computeWidth == true) {
            var itemObj = $("#"+ data[i].id);
            var iconWidth = 24;
            //顶级没有子集？不显示图标
            if (data[i].level == 0 && data[i].hasChild != true) {
                iconWidth = 0;
                $("#"+ data[i].id).find(".node_icon:eq(0)").hide();
            };
            var nodeTextArea_width = itemObj.find('.nodeArea:eq(0)').width() - iconWidth - 20;
            itemObj.find('.nodeTextArea:eq(0)').width(nodeTextArea_width);
        };
    };
    p.onAddCallback(data);
};