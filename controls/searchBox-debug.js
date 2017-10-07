 /* 下拉菜单 */
function MxtDropDown(options) {
  this.id = Math.floor(Math.random() * 100000000);
  if (options.id != undefined) {
    this.id = options.id;
  }
  this.onchange = options.onchange;
  if(this.onchange == undefined){
    this.onchange = function(){}
  }
  this.disabled = $('#' + this.id).attr('disabled');
  this.init();
}
MxtDropDown.prototype.init = function() {
  try{
    $('#' + this.id).attrObj("_dropdown", this);
  }catch(e){}
  
  var options = $('#' + this.id + ' option');
  var disabledstr = "";
  if (this.disabled == 'disabled' || this.disabled == 'true') {
    disabledstr = 'common_button_disable';
  }
  var htmlstr = "";
  htmlstr += "<div id='" + this.id
      + "_dropdown' class='common_drop_list common_drop_list_dropdown'>";
  htmlstr += "<div id = '" + this.id
      + "_dropdown_title'class='common_drop_list_title'>";
  htmlstr += "<a href='javascript:void(0)' class='common_drop_list_select common_button common_button_gray "
      + disabledstr + "' style='*margin-top:-1px;'>";
  htmlstr += "<table width='100%' height='100%' cellpadding='0' cellspacing='0' class='ellipsis_table'>";
  htmlstr += "<tbody>";
  htmlstr += "<tr>";
  htmlstr += "<td id = '" + this.id
      + "_dropdown_text' class='common_drop_list_text'>";
  htmlstr += options.eq(0).html();
  htmlstr += "</td>";
  htmlstr += "<td class='align_right' width='20'>";
  htmlstr += "<em></em>";
  htmlstr += "</td>";
  htmlstr += "</tr>";
  htmlstr += "</tbody>";
  htmlstr += "</table>";
  htmlstr += "</a>";
  htmlstr += "</div>";

  htmlstr += "<iframe id='"
      + this.id
      + "_dropdown_content_iframe' frameborder='0' style='position:absolute; z-index:1000;background:#fff;display:none;'>";
  htmlstr += "</iframe>";
  htmlstr += "<div id='"
      + this.id
      + "_dropdown_content' class='common_drop_list_content common_drop_list_content_action' style='position:absolute;z-index:1000;background:#fff;display:none;'>";
  
  var self = this;

  options.each(function() {
    htmlstr += "<a class='text_overflow' tar='" + self.id + "' href='javascript:void(0)' value='";
    htmlstr += $(this).attr('value');
    htmlstr += "' title='" + $(this).html() + "'>";
    htmlstr += $(this).html();
    htmlstr += "</a>";
  });
  htmlstr += "</div>";
  htmlstr += "</div>";
  $('#' + this.id).after($(htmlstr));
  $('#' + this.id + '_dropdown').width("100%");
  $('#' + this.id).hide();

  var self = this;
  $('#' + this.id + '_dropdown').mouseenter(function() {
    if (self.disabled == 'disabled' || self.disabled == 'true') {
      return;
    }
    // var _hh = $('body').height();
    // var _sh = $('#'+self.id+'_dropdown_content').height();
    // var _hm = $('#'+self.id+'_dropdown').height();
    // var _offset = $('#'+self.id+'_dropdown').offset();
    // var _top = _offset.top;
    //    
    // if((_top+_sh+_hm)>_hh){
    // var _contenth = _hh - _top - _hm;
    // $('#'+self.id+'_dropdown_content').css('overflow','auto').height(_contenth);
    // }
    $('#' + self.id + '_dropdown_content').width($(this).width() - 2).show();
    $('#' + self.id + '_dropdown_content_iframe').width($(this).width()).show();
  
  
  var _ttt = $(this).offset().top;
  var _hhh = $('#' + self.id + '_dropdown_content').height();
  var _bbb = $('body').height();
  if(_bbb == 0){
  	_bbb = parseInt(document.documentElement.clientHeight);
  }
   $('#' + self.id + '_dropdown_content_iframe').height(_hhh+3);
  if((_ttt+_hhh)>_bbb){
    $('#' + self.id + '_dropdown_content').height(_bbb - _ttt - $(this).height()).css({'overflow':'auto'});
    $('#' + self.id + '_dropdown_content_iframe').height(_bbb - _ttt - $(this).height());
  }
  
  
  }).mouseleave(function() {
    $('#' + self.id + '_dropdown_content').hide();
    $('#' + self.id + '_dropdown_content_iframe').hide();
  });
  $('#' + this.id + '_dropdown_content a').each(function() {
    var sss = $(this).parent().parent().find('.common_drop_list_text');
    var sssss = $(this).parent();
    $(this).click(function() {
      var text = $(this).attr('title');
      var value = $(this).attr('value');
      var idStrsdsds = $(this).attr('tar');
    text = text.replace(/</g,"&lt;").replace(/>/g,"&gt;");
      sss.html(text);
      $('#' + idStrsdsds).val(value);
      sssss.hide();
      $('#' + self.id + '_dropdown_content_iframe').hide(); 
    self.onchange()
    });
  });
};
MxtDropDown.prototype.setValue = function(val) {
  if (val) {
    $('#' + this.id).val(val);
    var ss = '#' + this.id + '_dropdown_content a[value=' + val + ']';
  var sss = $(ss).parent().parent().find('.common_drop_list_text');
    var sssss = $(ss).parent();
    var text = $(ss).attr('title');
    var value = $(ss).attr('value');
    var idStrsdsds = $(ss).attr('tar');
    sss.html(text);
    $('#' + idStrsdsds).val(value);
    sssss.hide();
  }
};
(function($) {
  $.fn.dropdown = function() {
    this.each(function() {
      var t = this;
      var id = t.id;
      var p = {};
      if (id == '') {
        id = Math.floor(Math.random() * 100000000);
        p.id = id;
        $(t).attr('id', id);
      } else {
        p.id = id;
      }
      new MxtDropDown(p);
    });
  };
  $.dropdown = function(p) {
    if (p && p.id) {
      return new MxtDropDown(p);
    } else {
      return;
    }
  };
  $.fn.searchCondition = function(p) {
    p = $.extend({
      id : Math.floor(Math.random() * 100000000),
    conditionText:$.i18n('searchbox.condition.js'),//查询条件
    conditionDateText:$.i18n('searchbox.conditionDateText.js'),//请输入正确的时间格式!
    conditionSpecText:$.i18n('searchbox.conditionSpecText.js'),//不能输入特殊字符!
    onchange:function(){},
      dialog:null //避免重复弹出窗口
    }, p);
    var g = {
    getReturnValue:function(){
      var _condition = $('#'+p.id).val(); //当前搜索类型，默认为空
      var _result;
      var type;
      var falseFlag = false; //是否验证错误，false表示验证出错
        if (p.conditions && p.conditions.length > 0) {
        for (var i = 0; i < p.conditions.length; i++) {
          var _temp = p.conditions[i];
          var _value = _temp.value;
          var _id = _temp.id;
          var _type = _temp.type;
          var _validate = _temp.validate ? true : false;
          var invalidChar;
          if(_condition == _value){
            if(_type == 'selectPeople'){
              _result = [];
              _result[0] = $('#'+_id+'_txt').val(); 
              _result[1] = $('#'+_id).val();
            }else if(_type == 'datemulti'){
              var format=_temp.ifFormat;
              _result = [];
              _result[0] = $('#from_'+_id).val(); 
              _result[1] = $('#to_'+_id).val();

              if(format=="%Y-%m-%d") var dateReg = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/ 
              else var dateReg = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01]) (0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/
              if((!dateReg.test(_result[0])||!dateReg.test(_result[1]))&&_result[0]!=""&&_result[1]!=""){ 
                falseFlag = true;
                if(p.dialog) p.dialog.close();
                p.dialog=$.alert(p.conditionDateText);
                return null;
                
              }
              if(_result[0] != '' && _result[1] != '' && _result[0]>_result[1]){
                p.dialog=$.alert($.i18n('validate.endDate.early.startDate.js'));
                return null;
              }
            } else if (_type == 'custom') {
              _result = _temp.getValue?_temp.getValue(_id):$('#'+_id).val();
            }else{
              _result = $('#'+_id).val();
              if(_validate){
                invalidChar=/[!@#$%^&*()<>]/ ;//特殊字符验证
                if(invalidChar.test(_result)){
                  falseFlag = true;
                  $('#'+_id).focus();
                } 
              }
              
            }
            type = _type;
            break;
          }
        }
      }
      if(falseFlag){
        if(p.dialog) p.dialog.close();
        p.dialog=$.alert(p.conditionSpecText);
        return null;
      }else{
        return{'type':type,'condition':_condition,'value':_result};
      }
    },
    clearCondition:function(){
      $("#" + p.id + "_dropdown_content a").each(function(){
        var value_str = $(this).attr("value");
        if(value_str == ""){
          $(this).click();
        }
      });
    },
    setCondition:function(id,value1,value2){
        var valueCondition;
        var typeCondition;
        var comCondition;
        for (var i = 0; i < p.conditions.length; i++) {
          var _temp = p.conditions[i];
          var _value = _temp.value;
          var _id = _temp.id;
          var _type = _temp.type;
          if(_id == id){
            valueCondition = _value;
            typeCondition = _type;
            comCondition = _temp;
            break;
          }
        }
        
        $("#" + p.id + "_dropdown_content a").each(function(){
          var value_str = $(this).attr("value");
          if(value_str == valueCondition){
            $(this).click();
          }
        });
        if(typeCondition == "input"){
          $('#'+id).val(value1);
        }else if(typeCondition == "select"){
          $("#"+id+"_dropdown_content a").each(function(){
            var value_str = $(this).attr("value");
            if(value_str == value1){
              $(this).click();
            }
          });
        }else if(typeCondition == 'datemulti'){
          $('#from_'+id).val(value1);
          $('#to_'+id).val(value2);
        }else if(typeCondition == 'selectPeople'){
          $('#'+_id+'_txt').val(value1); 
          $('#'+_id).val(value2);
        }
    },
    hideSearchBox:function(){
      $('#'+p.id+'_ul').hide();
    },
    showSearchBox:function(){
      $('#'+p.id+'_ul').show();
    },
    hideItem: function (itemId, bool) {
        var itemValue;
        for (var i = 0; i < p.conditions.length; i++) {
            if (p.conditions[i].id == itemId) {
                itemValue = p.conditions[i].value;
            }
        }
        $("#" + p.id + "_conditions").find("a[value='" + itemValue + "']").hide();
        if (bool) {
            $("#" + p.id + " option:eq(0)").attr("selected", true);
            $("#" + p.id + "_dropdown_text").text(p.conditionText);
            $("#" + p.id + "_ul li").each(function (i) {
                if (!(i == 0 || i == ($("#" + p.id + "_ul li").size() - 1))) {
                    if (!$(this).hasClass("hidden")) {
                        $(this).addClass("hidden");
                    }
                }
                if (i == ($("#" + p.id + "_ul li").size() - 1)) {
                    $(this).addClass("margin_l_5");
                }
            });
        }
    },
    showItem: function (itemId) {
        var itemValue;
        for (var i = 0; i < p.conditions.length; i++) {
            if (p.conditions[i].id == itemId) {
                itemValue = p.conditions[i].value;
            }
        }
        $("#" + p.id + "_conditions").find("a[value='" + itemValue + "']").show();
    }
  }
    $(this)
        .append(
            "<ul id='"
                + p.id
                + "_ul' class='common_search common_search_condition clearfix' style='_display:inline'><li id='"
                + p.id + "_conditions' style='width:120px'><select id='" + p.id
                + "' class='common_drop_down w100b'><option id='" + p.id
                + "_default' value=''>"+p.conditionText+"</option></select></li></ul>");
    p.ul = $('#' + p.id + '_ul');
    p.firstli = $('#' + p.id + '_conditions');
    p.select = $('#' + p.id);

    p.inputs = [];
    p.selects=[];
    if (p.conditions && p.conditions.length > 0) {
      for ( var i = 0; i < p.conditions.length; i++) {
        var showsTimeFlag = false;
        var con = p.conditions[i];
        var dateId = null;
        var _type = con.type;
        var _value = con.value;
        var _text = con.text;
        var id = con.id;
        var name = con.name;
        var _selectobj = null;
    var _click = con.click;

    
        p.select.append($("<option value='" + _value + "'>" + _text
            + "</option>"));
        var conobj;
    if(_type == 'selectPeople') {
            conobj = $("<li id='"
                + _value
                + "_container' class='common_search_input condition_text hidden'><input id='"
                + id + "' name='" + name + "' value='' class='search_input searchInputComp comp' comp=\""+con.comp+"\" type='text'></li>");
      p.inputs.push(con);
        }else if (_type == 'input') {
            if (con.maxLength) {
                var _maxLengthHtml = " maxlength='" + con.maxLength + "'";
            } else {
                var _maxLengthHtml = "";
            }
            conobj = $("<li id='"
                + _value
                + "_container' class='common_search_input condition_text hidden'><input id='"
                + id + "' name='" + name + "' value='' class='search_input' style='*margin-top:-1px;' type='text' " + _maxLengthHtml + "></li>");
            p.inputs.push(con);
        } else if (_type == 'datemulti') {
         var ifFormat=con.ifFormat!=undefined ? con.ifFormat:"%Y-%m-%d %H:%M";//获取时间类型
          conobj = $("<li id='"
              + _value
              + "_container' class='condition_text hidden margin_lr_5'><input id='from_"
              + id + "' type='text' class='comp input_date' style='width:135px' readonly='readonly'/><span class='padding_lr_5'>-</span><input id='to_"
              + id + "' type='text' class='comp input_date' style='width:135px' readonly='readonly'/></li>");
          if (con.dateTime && con.dateTime == true) {
            showsTimeFlag = true;
          }
          dateId = id;
        } else if (_type == 'select') {
          conobj = $("<li style='width: 100px;' id='" + _value
              + "_container' class='condition_text margin_lr_5 hidden'></li>");
          var _select = "";
          _select += "<select id='" + id + "' name='" + name
              + "' class='w100b common_drop_down'>";
          if (con.items) {
            for ( var j = 0; j < con.items.length; j++) {
              var _item = con.items[j];
              _select += "<option value='" + _item.value + "'>" + _item.text
                  + "</option>";
            }
          }
          _select += "</select>";
           p.selects.push(con);
           _selectobj = $(_select);
          if (con.codecfg) {
            _selectobj.attr("codecfg", con.codecfg);
          }
          conobj.append(_selectobj);
        } else if (_type == 'custom') {
              conobj = $("<li style='width: 120px' id='"
                + _value
                + "_container' class='common_search_input condition_text hidden'>"+con.customHtml+"</li>");
              //p.inputs.push(con);
        }
       
        if (conobj) {
          p.ul.append(conobj);
      if(_click!=undefined){
          //目前只扩展input和select类型时间类型不扩展
        $('#'+id).click(_click);
      }
          if (_selectobj){
             _selectobj.codeoption();
          }
            
        }
        if(dateId!=null){
       $('#from_' + dateId).calendar({
          ifFormat : ifFormat,
          showsTime : showsTimeFlag,
        cache:false
        });
        $('#to_' + dateId).calendar({
          ifFormat : ifFormat,
          showsTime : showsTimeFlag
        });
    }
    if($('.searchInputComp').size()>0){
      $('.searchInputComp').comp();
    }
      }     
    }
    p.ul.append($("<li class='margin_l_5 search_btn' ><a class='common_button common_button_gray search_buttonHand' style='*margin-top:2px;' href='javascript:void(0)'><em></em></a></li>"));
    $('.common_drop_down').dropdown();
  
  $(".common_search *").bind('keydown', 'return',function (evt){//绑定enter快捷键
    $('.search_btn').click();
    return false;
      
   });
    $("#" + p.id + "_dropdown_content a").click(function() {
      var value_str = $(this).attr("value");
      $(p.selects).each(function(){
        var id=$(this).attr("id");
          $("#"+id+"_dropdown_content a").eq(0).trigger("click");//slect恢复默认设置
        })
       
      for(var i=0;i<p.inputs.length;i++){
        var _B = p.inputs[i];
        $("#"+_B.id).attr("value",'');
    //如果是选人$("#"+_B.id)元素是hidden的input
    if($("#"+_B.id).attr("type") == 'hidden'){
      $("#"+_B.id+'_txt').attr("value",'');
    }
      }
      $('#from_' + dateId).val("");//清空日期
      $('#to_' + dateId).val("");//清空日期
      $('.condition_text').addClass("hidden");     
      $('#' + value_str + '_container').removeClass("hidden");
       
      
      // 默认状态按钮与选择条件之间有5px间距
      if (value_str != "") {
        $(".search_btn").eq(0).removeClass("margin_l_5");
      } else {
        $(".search_btn").eq(0).addClass("margin_l_5");
      }
    }).click(p.onchange);
    $(".search_btn").click(p.searchHandler);
    this.p = p;
    this.g = g;
    return this;
  };
  $.searchCondition = function(p) {
    p = $.extend({
      id : Math.floor(Math.random() * 100000000),
    conditionText:$.i18n('searchbox.condition.js'),
    conditionDateText:$.i18n('searchbox.conditionDateText.js'),//请输入正确的时间格式!
    conditionSpecText:$.i18n('searchbox.conditionSpecText.js'),//不能输入特殊字符!
    onchange:function(){},
	isExpand:false,
	expandValue:null,
    top:null,
    left:null,
    right:null,
    bottom:null,
    dialog:null //避免重复弹出窗口
    }, p);
    var g = {
    getReturnValue:function(){
      var _condition = $('#'+p.id).val();
      var _result;
      var type;
      var falseFlag = false;
      
        if (p.conditions && p.conditions.length > 0) {
        for (var i = 0; i < p.conditions.length; i++) {
          var _temp = p.conditions[i];
          var _value = _temp.value;
          var _id = _temp.id;
          var _validate= _temp.validate? true:false;
          var invalidChar;
          var _type = _temp.type;
          if(_condition == _value){
            if(_type == 'selectPeople'){
              _result = [];
              _result[0] = $('#'+_id+'_txt').val(); 
              _result[1] = $('#'+_id).val();
            }else if(_type == 'datemulti'){
              var format=_temp.ifFormat;
              _result = [];
              _result[0] = $('#from_'+_id).val(); 
              _result[1] = $('#to_'+_id).val();

              if(format=="%Y-%m-%d") var dateReg = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/ 
              else var dateReg = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01]) (0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/
              if((!dateReg.test(_result[0])||!dateReg.test(_result[1]))&&_result[0]!=""&&_result[1]!=""){ 
                falseFlag = true;
                if(p.dialog) p.dialog.close();
                p.dialog=$.alert(p.conditionDateText);
                return null;
                
              }
//              if(_result[0] == ''){
//                p.dialog=$.alert("开始时间不能为空!");
//                return null;
//              }
//              if(_result[1] == ''){
//                p.dialog=$.alert("结束时间不能为空!");
//                return null;
//              }
              if(_result[0] != '' && _result[1] != '' && _result[0]>_result[1]){
                p.dialog=$.alert($.i18n('validate.endDate.early.startDate.js'));
                return null;
              }
            } else if (_type == 'custom'||_type == 'customPanel') {
              _result = _temp.getValue?_temp.getValue(_id):$('#'+_id).val();
            }else{
              _result = $('#'+_id).val();
              if(_validate){
                invalidChar=/[!@#$%^&*()<>]/;//特殊字符验证
                if(invalidChar.test(_result)){
                  falseFlag = true;
                  $('#'+_id).focus();
                }
              }
            }
            type = _type;
            break;
          }
        }
      }
      if(falseFlag){
        if(p.dialog) p.dialog.close();
        p.dialog=$.alert(p.conditionSpecText);
        return null;
      }else{
        return{'type':type,'condition':_condition,'value':_result};
      }
    },
    clearCondition:function(){
      $("#" + p.id + "_dropdown_content a").each(function(){
        var value_str = $(this).attr("value");
        if(value_str == ""){
          $(this).click();
        }
      });
    },
    setCondition:function(id,value1,value2){
        var valueCondition;
        var typeCondition;
        var comCondition;
        for (var i = 0; i < p.conditions.length; i++) {
          var _temp = p.conditions[i];
          var _value = _temp.value;
          var _id = _temp.id;
          var _type = _temp.type;
          if(_id == id){
            valueCondition = _value;
            typeCondition = _type;
            comCondition = _temp;
            break;
          }
        }
        
        $("#" + p.id + "_dropdown_content a").each(function(){
          var value_str = $(this).attr("value");
          if(value_str == valueCondition){
            $(this).click();
          }
        });
        if(typeCondition == "input"){
          $('#'+id).val(value1);
        }else if(typeCondition == "select"){
          $("#"+id+"_dropdown_content a").each(function(){
            var value_str = $(this).attr("value");
            if(value_str == value1){
              $(this).click();
            }
          });
        }else if(typeCondition == 'datemulti'){
          $('#from_'+id).val(value1);
          $('#to_'+id).val(value2);
        }else if(typeCondition == 'selectPeople'){
          $('#'+_id+'_txt').val(value1); 
          $('#'+_id).val(value2);
        }
    },
    hideSearchBox:function(){
      $('#'+p.id+'_ul').hide();
    },
    showSearchBox:function(){
      $('#'+p.id+'_ul').show();
    },
    hideItem: function (itemId, bool) {
        var itemValue;
        for (var i = 0; i < p.conditions.length; i++) {
            if (p.conditions[i].id == itemId) {
                itemValue = p.conditions[i].value;
            }
        }
        $("#" + p.id + "_conditions").find("a[value='" + itemValue + "']").hide();
        if (bool) {
            $("#" + p.id + " option:eq(0)").attr("selected", true);
            $("#" + p.id + "_dropdown_text").text(p.conditionText);
            $("#" + p.id + "_ul li").each(function (i) {
                if (!(i == 0 || i == ($("#" + p.id + "_ul li").size() - 1))) {
                    if (!$(this).hasClass("hidden")) {
                        $(this).addClass("hidden");
                    }
                }
                if (i == ($("#" + p.id + "_ul li").size() - 1)) {
                    $(this).addClass("margin_l_5");
                }
            });
        }
    },
    showItem: function (itemId) {
        var itemValue;
        for (var i = 0; i < p.conditions.length; i++) {
            if (p.conditions[i].id == itemId) {
                itemValue = p.conditions[i].value;
            }
        }
        $("#" + p.id + "_conditions").find("a[value='" + itemValue + "']").show();
    }
  }
  var styleText="position: absolute;z-index:900;";
  if(p.top!=null){
    styleText+="top:"+p.top+"px;";
  }
  if(p.left!=null){
    styleText+="left:"+p.left+"px;";
  }
  if(p.right!=null){
    styleText+="right:"+p.right+"px;";
  }
  if(p.bottom!=null){
    styleText+="bottom:"+p.bottom+"px;";
  }
  
    $('body')
        .prepend(
            "<ul id='"
                + p.id
                + "_ul' class='common_search common_search_condition clearfix' style='"+styleText+"_display:inline;'><li id='"
                + p.id + "_conditions' style='width:120px'><select id='" + p.id
                + "' class='common_drop_down w100b'><option id='" + p.id
                + "_default' value=''>"+p.conditionText+"</option></select></li></ul>");
    p.ul = $('#' + p.id + '_ul');
    p.firstli = $('#' + p.id + '_conditions');
    p.select = $('#' + p.id);

    p.inputs = [];
    p.selects=[];
    
    if (p.conditions && p.conditions.length > 0) {
      for ( var i = 0; i < p.conditions.length; i++) {
        var showsTimeFlag = false;
        var con = p.conditions[i];
        var _type = con.type;
        var dateId = null;
        var _value = con.value;
        var _text = con.text;
        var id = con.id;
        var name = con.name;
        var _selectobj = null;
    var _click = con.click;
    var _readonly = con.readonly;

        p.select.append($("<option value='" + _value + "'>" + _text
            + "</option>"));
        var conobj;
    if(_type == 'selectPeople') {
            conobj = $("<li id='"
                + _value
                + "_container' class='common_search_input condition_text hidden'><input id='"
                + id + "' name='" + name + "' value='' class='search_input searchInputComp comp' comp=\""+con.comp+"\" type='text'></li>");
      p.inputs.push(con);
        }else if (_type == 'input') {
            if (con.maxLength) {
                var _maxLengthHtml = " maxlength='" + con.maxLength + "'";
            } else {
                var _maxLengthHtml = "";
            }
            conobj = $("<li id='"
                + _value
                + "_container' class='common_search_input condition_text hidden'><input id='"
                + id + "' name='" + name + "' value='' class='search_input' style='*margin-top:-1px;' type='text' " + _maxLengthHtml + "></li>");
            p.inputs.push(con);
        } else if (_type == 'datemulti') {
         var ifFormat=con.ifFormat!=undefined ? con.ifFormat:"%Y-%m-%d %H:%M";//获取时间类型
          conobj = $("<li id='"
              + _value
              + "_container' class='condition_text hidden margin_lr_5'><input id='from_"
              + id + "' type='text' class='comp input_date' style='width:135px' readonly='readonly'/><span class='padding_lr_5'>-</span><input id='to_"
              + id + "' type='text' class='comp input_date' style='width:135px' readonly='readonly'/></li>");
          if (con.dateTime && con.dateTime == true) {
            showsTimeFlag = true;
          }
          dateId = id;
        } else if (_type == 'select') {
          conobj = $("<li style='width: 100px;' id='" + _value
              + "_container' class='condition_text margin_lr_5 hidden'></li>");
          var _select = "";
          _select += "<select id='" + id + "' name='" + name
              + "' class='w100b common_drop_down'>";
          if (con.items) {
            for ( var j = 0; j < con.items.length; j++) {
              var _item = con.items[j];
              _select += "<option value='" + _item.value + "'>" + _item.text
                  + "</option>";
            }
          }
          _select += "</select>";
          p.selects.push(con);
          _selectobj = $(_select);
          if (con.codecfg) {
            _selectobj.attr("codecfg", con.codecfg);
          }
          conobj.append(_selectobj);
        } else if (_type == 'custom') {
              conobj = $("<li style='width: 120px' id='"
                + _value
                + "_container' class='common_search_input condition_text hidden'>"+con.customHtml+"</li>");
              //p.inputs.push(con);
        }else if(_type == 'customPanel'){
        conobj = $("<li style='width: 120px' id='"
                + _value
                + "_container' class='common_search_input condition_text hidden'><div class='common_txtbox_wrap'><input id='"+id+"_ids' type='hidden'><input id='" + id + "' name='" + name + "' "+(_readonly == undefined?'':_readonly)+" value='' class='search_input' style='*margin-top:-1px;' type='text'></div></li>");
    }
        if (conobj) {
          p.ul.append(conobj);
      if(_click!=undefined){
          //目前只扩展input和select类型时间类型不扩展
        $('#'+id).click(_click);
      }
          if (_selectobj)
            _selectobj.codeoption();
        }
        if(dateId!=null){
        $('#from_' + dateId).calendar({
          ifFormat :ifFormat,
          showsTime : showsTimeFlag,
        cache:false
        });
        $('#to_' + dateId).calendar({
          ifFormat :ifFormat,
          showsTime : showsTimeFlag
        });
    }
    if($('.searchInputComp').size()>0){
      $('.searchInputComp').comp();
    }
    
    if (_type == 'customPanel'){
      (function(obj){
      $('#'+obj.id).click(function(){
        var panel = $.dialog({
          id:obj.id+'_panel',
            width: obj.panelWidth,
            height: obj.panelHeight,
            type: 'panel',
            html: obj.customHtml,
            targetId: obj.id,
          shadow:false,
          panelParam:{
            'show':false,
            'margins':true
          },
          buttons:[{
            id:'wewew',
            text:'ok',
            handler:obj.customHandler
          }]
        });
        if(obj.customLoadHandler!=null){
        	obj.customLoadHandler(obj.id);
        }
      });
      })(con);
    }
    
      }
    }
    p.ul
        .append($("<li class='margin_l_5 search_btn' style='*margin-top:-1px;'><a class='common_button common_button_gray search_buttonHand' href='javascript:void(0)'><em></em></a></li>"));

    $('.common_drop_down').dropdown();
  
  $(".common_search *").bind('keydown', 'return',function (evt){//绑定enter快捷键
    $('.search_btn').click();
    return false;
      
   });
    $("#" + p.id + "_dropdown_content a").click(function() {
      var value_str = $(this).attr("value");
      $(p.selects).each(function(){
        var id=$(this).attr("id");
          $("#"+id+"_dropdown_content a").eq(0).trigger("click");//slect恢复默认设置
        })
       
      for(var i=0;i<p.inputs.length;i++){
        var _B = p.inputs[i];
        $("#"+_B.id).attr("value",'');
    //如果是选人$("#"+_B.id)元素是hidden的input
    if($("#"+_B.id).attr("type") == 'hidden'){
      $("#"+_B.id+'_txt').attr("value",'');
    }
      }
    if (dateId != null) {
        $('#from_' + dateId).val("");//清空日期
      $('#to_' + dateId).val("");//清空日期
    }
      $('.condition_text').addClass("hidden");
      $('#' + value_str + '_container').removeClass("hidden");
      // 默认状态按钮与选择条件之间有5px间距
      if (value_str != "") {
        $(".search_btn").eq(0).removeClass("margin_l_5");
      } else {
        $(".search_btn").eq(0).addClass("margin_l_5");
      }
    }).click(p.onchange);
    $(".search_btn").click(p.searchHandler);
	
	if(p.isExpand){
		setTimeout(function(){
			
			$('.common_drop_list_dropdown').mouseenter();
			if(p.expandValue!=null){
				$(".common_drop_list_content_action a[value="+p.expandValue+"]").click();
			}else{
				$(".common_drop_list_content_action a").eq(1).click();
			}
			$('.common_drop_list_dropdown').mouseleave();
		},1000)
	}
	
    this.p = p;
    this.g = g;
    return this;
  };
})(jQuery);