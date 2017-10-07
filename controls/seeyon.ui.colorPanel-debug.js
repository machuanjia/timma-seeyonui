/**
* 颜色面板
* @author zhenshuai
* @date 2014-01-06
*/
function MxtColorPanel(options) {
    this.p = {
        id: "MxtColorPanel_"+ Math.floor(Math.random() * 100000000),
        targetId: "",
        colorData: [{
        'model':  "#303030",
        'list' :[ "#071111", "#1f2627", "#353c3d", "#4b5354", "#636b6c", "#7c8485",
                  "#0a1011", "#1e2223", "#323637", "#454b4c", "#5c6162", "#727878",
                  "#000000", "#1d1d1d", "#252525", "#3c3c3c", "#525252", "#6b6b6b" ]
        }, {
        'model':  "#d7dae0",
        'list' :[ "#e9ecf2", "#f2e5fc", "#cbe6dd", "#c7e9fb", "#e3e0ca", "#f8e5e1",
                  "#d7dae0", "#d3e1ff", "#9fd6c4", "#95cce8", "#c8c49e", "#dac4bf",
                  "#cccccc", "#d0c4da", "#d0c4da", "#d0c4da", "#d0c4da", "#cea69d" ]
        }, {
        'model':  "#da0025",
        'list' :[ "#6e0012", "#8d0017", "#ad001d", "#cf0023", "#f10025", "#ff2c37",
                  "#54001d", "#710025", "#8e0032", "#ad2a3f", "#cd484a", "#eb6360", 
                  "#43001c", "#5e1129", "#792a38", "#964449", "#b45d59", "#d17670" ]
        }, {
        'model':  "#f01800",
        'list' :[ "#4f0006", "#6d0004", "#8c0001", "#ac0000", "#cd0000", "#ef0000",
                  "#380003", "#510000", "#6e0000", "#8b1202", "#a9331a", "#c84e31",
                  "#290002", "#3f0200", "#591b0b", "#733220", "#8f4a37", "#ac634e" ]
        }, {
        'model':  "#ff4300",
        'list' :[ "#660003", "#850000", "#a40000", "#c50000", "#e61f00", "#ff4608",
                  "#500000", "#6c0000", "#891700", "#a73511", "#c65129", "#e56b41",
                  "#3c0600", "#561e0a", "#703420", "#8c4c36", "#a8654d", "#c57f65" ]
        }, {
        'model':  "#fd6c05",
        'list' :[ "#740000", "#920000", "#b22600", "#d34500", "#f26000", "#ff7c1c",
                  "#5f1300", "#7b2c00", "#984512", "#b65e2b", "#d37742", "#f2925c",
                  "#4f2307", "#69391e", "#845134", "#a06a4c", "#bc8363", "#d99e7d" ]
        }, {
        'model':  "#feab07",
        'list' :[ "#713400", "#8f4c00", "#ad6500", "#cb7e00", "#eb9900", "#ffb317",
                  "#4d2600", "#683b00", "#835300", "#a06c13", "#bc852f", "#da9f49",
                  "#472900", "#5f3f0b", "#7a5723", "#96703b", "#b18952", "#cea36c" ]
        }, {
        'model':  "#ffc91e",
        'list' :[ "#653d00", "#825400", "#a06d00", "#bd8600", "#dca000", "#ffbf00",
                  "#452a00", "#5f4000", "#7a5800", "#977008", "#b38928", "#d0a444", 
                  "#412c00", "#5a4206", "#745a20", "#8f7338", "#aa8c50", "#c7a669" ]
        }, {
        'model':  "#93c900",
        'list' :[ "#002800", "#003c00", "#005500", "#1f6e00", "#418700", "#5ea200",
                  "#002300", "#173800", "#304f00", "#496700", "#638118", "#7d9b34",
                  "#122000", "#273503", "#3d4b1b", "#556332", "#6f7d49", "#889661" ]
        }, {
        'model':  "#54c300",
        'list' :[ "#003f00", "#005700", "#007200", "#008c00", "#18a110", "#54c300",
                  "#003a00", "#1d5100", "#386a00", "#52841b", "#6c9e36", "#87ba51",
                  "#1f3605", "#354d1c", "#4d6533", "#667f4b", "#7f9863", "#9ab47c" ]
        }, {
        'model':  "#00ab62",
        'list' :[ "#002900", "#004117", "#00592c", "#007443", "#00905b", "#00ab60",
                  "#00270e", "#003c23", "#005338", "#006d4f", "#266a6d", "#44a177",
                  "#002215", "#0a3829", "#234e3f", "#3b6756", "#54816f", "#6d9b83" ]
        }, {
        'model':  "#00c3c4",
        'list' :[ "#002a2f", "#0c404c", "#00585c", "#007275", "#008d8f", "#00a8a9", 
                  "#002526", "#003a3c", "#005252", "#006b6b", "#258584", "#449f9e", 
                  "#002122", "#0a3736", "#244d4d", "#3c6665", "#557f7e", "#6e9998" ]
        }, {
        'model':  "#009bf0",
        'list' :[ "#002568", "#003981", "#00509b", "#105dbd", "#45a6d0", "#15a4fa",
                  "#002149", "#003661", "#004c7a", "#1e6494", "#407eaf", "#5c97ca",
                  "#001f36", "#12334d", "#2b4964", "#53718b", "#5e7b98", "#7794b3" ]
        }, {
        'model':  "#006afe",
        'list' :[ "#000079", "#001b95", "#002db0", "#0041cb", "#0058e9", "#006aff",
                  "#00004a", "#001963", "#002d7c", "#234296", "#435ab2", "#596cc7",
                  "#00002e", "#091a45", "#022c55", "#3b4475", "#555b8f", "#686ea3" ]
        }, {
        'model':  "#3f00dd",
        'list' :[ "#00006f", "#000084", "#1e0098", "#3b0dad", "#5424c3", "#6c39d9",
                  "#0f003e", "#180052", "#2f1763", "#422776", "#56398a", "#6b4b9f",
                  "#100025", "#1d1035", "#2e1f47", "#3f2f59", "#52416c", "#655380" ]
        }, {
        'model':  "#9025ff",
        'list' :[ "#2a0075", "#490090", "#6700ab", "#8500c7", "#a400e4", "#bf00ff",
                  "#260048", "#3d0060", "#57007a", "#711993", "#8d37af", "#a74fc8",
                  "#20002d", "#432847", "#491d5b", "#412845", "#7c4c8e", "#9462a6" ]
        }, {
        'model':  "#ff3ec2",
        'list' :[ "#7f0023", "#9e0038", "#bd004d", "#dd0065", "#ff007f", "#ff3e98",
                  "#5f0023", "#7c0039", "#98204f", "#b53e67", "#d45b81", "#f1759a",
                  "#4a0c24", "#64263a", "#7e3d50", "#995668", "#b76a8b", "#d1899b" ]
        }, {
        'model':  "#fe0b6b",
        'list' :[ "#6f0036", "#8d004d", "#ab0064", "#ca007e", "#ea0098", "#ff21b3",
                  "#55002d", "#700043", "#8c005a", "#a92673", "#c6468d", "#e461a7",
                  "#430027", "#5d0d3d", "#762953", "#92426c", "#ae5c86", "#ca75a0" ]
        }],
        modelIndex: 9,
        listIndex: null,
        top: null,
        left: null,
        onSuccess: function(){},
        onChange: function(p){
            console.log("大类: "+ p.modelColor +", 小类: "+ p.listColor +", modelIndex: "+ p.modelIndex +", listIndex: "+ p.listIndex)
        },
        onClose: function(){}
    };
    $.extend(this.p, options);
    this.init();
}
// 初始化
MxtColorPanel.prototype.init = function() {
    $(".MxtColorPanel").remove();

    this.createColorGroup();
    this.setPosition();
    this.bindClose();
    this.show();
};
// 生成大类列表
MxtColorPanel.prototype.createColorGroup = function() {
    var _this = this;
    var _html = "";
    _html += '<div id="'+ this.p.id +'" class="MxtColorPanel">';
    _html += '<ul class="group_list clearfix">';
    var _arr = this.p.colorData;
    for (var i = 0; i < _arr.length; i++) {
        _html += '<li data-index="'+ i +'" style="background:'+ _arr[i].model +';"></li>';
    };
    _html += '</ul>';
    _html += '</div>';

    var _htmlObj = $(_html);
    _htmlObj.find("li").click(function(){
      _htmlObj.find("li").removeClass('current');
      $(this).addClass('current');
      _this.createColorGroupList($(this).attr("data-index"));
    }).mouseenter(function() {
        $(this).addClass('hover');
    }).mouseleave(function(){
        $(this).removeClass('hover');
    }).eq(_this.p.modelIndex).addClass('current');
    $("body").append(_htmlObj);

    this.createColorGroupList(this.p.modelIndex, true);
};
// 生成大类下小类列表
MxtColorPanel.prototype.createColorGroupList = function(j, selected) {
    var _this = this;
    var _obj = $("#"+ this.p.id);
    var _html = "";
    var _arr = this.p.colorData[j].list;
    _html += '<ul class="groupItem_list clearfix">';
    for (var i = 0; i < _arr.length; i++) {
        _html += '<li data-modelIndex="'+ j +'" data-listIndex="'+ i +'" style="background:'+ _arr[i] +';"></li>';
    };
    _html += '</ul>';

    var _htmlObj = $(_html);
    _htmlObj.find("li").click(function(){
        var _modelIndex = $(this).attr('data-modelIndex');
        var _listIndex = $(this).attr('data-listIndex');
        _obj.find(".ok").remove();
        $(this).append("<div class='ok'></div>");
        _this.p.onChange({
          modelIndex: _modelIndex,
          listIndex: _listIndex,
          modelColor: _this.p.colorData[_modelIndex].model,
          listColor: _this.p.colorData[_modelIndex].list[_listIndex]
        });
    });
    if (selected && this.p.listIndex != null) {
        _htmlObj.find("li").eq(_this.p.listIndex).append("<div class='ok'></div>")
    };

    _obj.find(".groupItem_list").remove();
    _obj.prepend(_htmlObj);
};
MxtColorPanel.prototype.setPosition = function() {
    var _obj = $("#"+ this.p.id);
    var _obj_width = 300;
    var _obj_height = 200;
    var _targetObj = $("#"+ this.p.targetId);
    var _tgt_top = _targetObj.offset().top;
    var _tgt_left = _targetObj.offset().left;
    var _tgt_width = _targetObj.width();
    var _tgt_height = _targetObj.height();
    var _top = 0;
    var _left = 0;
    //定位计算
    _top = _tgt_top - _tgt_height - _obj_height;
    _left = _tgt_left + _tgt_width/2 - _obj_width/2;
    //参数控制
    this.p.top != null ? _top = this.p.top : null;
    this.p.left != null ? _left = this.p.left : null;
    //右侧不能超出
    (_left + _obj_width) > $(window).width() ? _left = $(window).width() - _obj_width - 10 : null;
    (_top + _obj_height) > $(window).height() ? _top = $(window).height() - _obj_height - 10 : null;
    //左上不能超出
    _top < 0 ? _top = 10 : null;
    _left < 0 ? _left = 10 : null;
    _obj.css({
        left: _left,
        top: _top
    });
};
MxtColorPanel.prototype.show = function() {
    $("#"+ this.p.id).show();
    this.p.onSuccess();
};
// 关闭
MxtColorPanel.prototype.bindClose = function() {
    var _this = this;
    var _leaveStatc = false;
    $("#"+ this.p.id).mouseenter(function() {
        _leaveStatc = false;
    }).mouseleave(function() {
        _leaveStatc = true;
    });
    $("#"+ this.p.targetId).mouseenter(function() {
        _leaveStatc = false;
    }).mouseleave(function() {
        _leaveStatc = true;
    });
    $(document).click(function() {
        if (_leaveStatc) {
            $("#"+ _this.p.id).remove();
            _this.p.onClose();
        };
    });
};