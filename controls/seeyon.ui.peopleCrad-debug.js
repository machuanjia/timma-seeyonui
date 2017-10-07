
/**
 * @author xiexp
 */
function insertScript(options) {//像页面中插入 script代码，并获得 人员信息
    if ($('#script_people').size() == 0) {
    	$('head').append("<div id='script_people' class='hidden'></div><script src='" + _ctxPath + "/ajax.do?managerName=peopleCardManager,orgManager'></script>")
        .append("<script type='text/javascript' src='" + _ctxPath + "/common/collaboration/collFacade.js'></script>")
        .append("<script type='text/javascript' src='" + _ctxPath + "/apps_res/webmail/js/webmail.js'></script>")
        .append("<script type='text/javascript' src='" + _ctxPath + "/apps_res/sms/js/sms.js'></script>")
        .append("<script>var dialog;</script>");
    }
    var memberid = options.memberId;
    var pManager = new peopleCardManager();
    var _options = options;
    
    var memberinfo = pManager.showPeoPleCardMini(memberid); //人员消息
    _options["data"] = memberinfo;
    return _options;
}
function insertScriptP() {//像页面中插入 script代码，并获得 人员信息
    if ($('#script_people').size() == 0) {
    	$('head').append("<div id='script_people' class='hidden'></div><script src='" + _ctxPath + "/ajax.do?managerName=peopleCardManager,orgManager'></script>")
    }
   
}
function createPanel(options) {// 创建获取html对象
	var top = getA8Top();
	var i = 0;
	while ($(top.document).find("#main").length == 0 && i < 5) {
		top = top.v3x.getParentWindow().getA8Top();
		i++;
	}
	var isme = false;
	var _currentUser = $.ctx.CurrentUser;
	if(_currentUser == null || _currentUser == undefined){
		_currentUser = getCtpTop().$.ctx.CurrentUser;
	}
	var userid = _currentUser.id;
	var email = options.data.emailaddress;
	if(options.memberId==userid){
		isme=true;
	}else{
		isme=false;
	}
    var showClose = false;
    if (!options.id) showClose = true; //show close btn
    var panelFrame = $("#miniCrad");
    var accountShortName="";
    if(options.accountShortName && options.accountShortName!='' && options.accountShortName!='null' && options.accountShortName!='undefined'){
      accountShortName= "("+options.accountShortName+")";
    }  
    
    var content="<div class='left'style='width:90px;height:139px;margin-top:10px;'><div class=' align_center'><span class='people_img relative display_inline-block  over_hidden margin_t_5'><img class='radius' id='memberimg' src='"+options.data.imgurl+"' width='70'height='70'></span></div><div class=' align_center'>" ;
    if(!isme){
    	content=content+"<a class='common_button common_button_gray'id='addcorrelation'href='javascript:void(0)'>"+$.i18n('people.add.correlation')+"</a>" ;
    }
     content=content+"</div></div><form name='peoplecardminiform'id='peoplecardminiform'method='post'><div style='height:127px;padding-top:10px;' class='over_hidden adapt_w font_size12 form_area people_msg'><table cellpadding='0'cellspacing='0'width='100%'class='padding_5 margin_l_10'><caption class='align_left font_size18'><label id='name'/><div class='cut_string margin_5'>"+options.data.name+accountShortName+"</div></caption><tr><td width='100%'colspan='2'class='font_bold'style='font-size:14px;'><label id='orgDepartmentId'/><div class='cut_string'>"+options.data.orgDepartmentId+"</div></td></tr><tr><th nowrap='nowrap'>"+$.i18n('org.account_form.telephone.label')+"&nbsp;:&nbsp;</th><td width='400'><label id='officenumber'>"+options.data.officenumber+"</label></td></tr><tr><th nowrap='nowrap'>"+$.i18n('member.mobile')+"&nbsp;:&nbsp;</th><td><label id='telnumber'>"+options.data.telnumber+"</label></td></tr><tr><th nowrap='nowrap'>"+$.i18n('member.email')+"&nbsp;:&nbsp;</th><td><label  id='emailaddress'>"+options.data.emailaddress+"</label></td></tr></table></div></form><ul class='font_size12 align_center card_operate ul_bg clear'>" ;
    content=content+"<li class='margin_t_5 left'class='left'><a class='img-button img-button-change'href='javascript:void(0)' id='sendcollaboration'><em class='ico16 send_seeyon_16'></em>"+$.i18n('people.send.collaborative')+"</a></li>" ;
    if(!isme){
    	content=content+"<li class='margin_t_5 left'><a class='img-button img-button-change'href='javascript:void(0)' id='sendmsg'><em class='ico16 send_msg_16'></em>"+$.i18n('people.send.msg')+"</a></li>" ;
    }
    if(email!=""){
    	content=content+"<li class='margin_t_5 left'><a class='img-button img-button-change'href='javascript:void(0)' id='sendemail'><em class='ico16 send_mail_16'></em>"+$.i18n('people.send.email')+"</a></li>" ;
    }content=content+"<li class='margin_t_5 left'><a class='img-button img-button-change'href='javascript:void(0)' id='sendSMS'><em class='ico16 send_smsg_16'></em>"+$.i18n('people.send.SMS')+"</a></li></ul>";
    if (panelFrame.length == 0) {// 如果没有panel,则新建panel;     
        var panel = "<div class='cardmini h100b hidden' id='miniCrad'></div>";
        panelFrame = $(panel);
        panelFrame.append($(content));
        $("body").append(panelFrame);
    }
    else {
        panelFrame.html($(content));
    }
    if(''==options.data.relateType){
      $("#addcorrelation").unbind().bind("click",function() {
  		dialog = $.dialog({
  		    id: 'url',
  		    url: _ctxPath+'/relateMember.do?method=addRelativePeople&receiverId='+options.data.id,
  		    width: 420,
  		    height: 200,
  		    targetWindow:getCtpTop(),
  		    title: $.i18n('peoplecard.addrelpeple.js')
  		});
  
      });
    }else{
      $("#addcorrelation").text(options.data.relateType);
  }
	$("#sendemail").unbind().bind("click",function() {
		if($("#emailaddress").html()!=""){
		
			sendMail($("#emailaddress").html());
		}
	});
	$("#sendcollaboration").unbind().bind("click",function() {
		appToColl4DialogMode('peopleCard',options.data.id);
	});
	$("#sendmsg").unbind().bind("click",function() {
		top.sendUCMessage(options.data.name, options.data.id);
	});
	$("#sendSMS").unbind().bind("click",function() {
		sendSMS(options.data.id);
	});
	var _resources = $.ctx.resources;
	if(_resources == null || _resources == undefined){
		_resources = getCtpTop().$.ctx.resources;
	}
    try{
        if(!_resources.contains("F01_newColl")){
            $("#sendcollaboration").hide();
        }
        if(!_resources.contains("F12_mailcreate")){
            $("#sendemail").hide();
        }
    }catch(e){

    }
	if(!_currentUser.canSendSMS){
		$("#sendSMS").hide();
	}
	var _plugins = $.ctx.plugins;
	if(_plugins == null || _plugins == undefined){
		_plugins = getCtpTop().$.ctx.plugins;
	}
	if(_currentUser.admin||!_plugins.contains('uc')){
		$("#sendmsg").hide();
	}
   var cardMini = $.dialog({
        id: 'dialog_cardMini',
        width: 366,
        height: 184,
        type: 'panel',
        htmlId: "miniCrad",//miniCard
        targetId: options.id,
        left: options.left,
        
        top: options.top,
        shadow: false,
        panelParam: {
            'show': showClose,
            'margins': false,
            "inside": showClose
        }
    });
   return cardMini;// 返回panel
}
function createPanelWithOutButton(options) {// 创建获取html对象
	var top = getA8Top();
	var i=0;
	while($(top.document).find("#main").length==0&&i<5) {
            top = getA8Top().v3x.getParentWindow().getA8Top();
			i++;
        }
	var isme = false;
	var _currentUser = $.ctx.CurrentUser;
	if(_currentUser == null || _currentUser == undefined){
		_currentUser = getCtpTop().$.ctx.CurrentUser;
	}
	var userid = _currentUser.id;
	var email = options.data.emailaddress;
	if(options.memberId==userid){
		isme=true;
	}else{
		isme=false;
	}
    var showClose = false;
    if (!options.id) showClose = true; //show close btn
    var panelFrame = $("#miniCrad");
    var accountShortName="";
    if(options.accountShortName && options.accountShortName!='' && options.accountShortName!='null' && options.accountShortName!='undefined'){
      accountShortName= "("+options.accountShortName+")";
    }  
    
    var content="<div class='left'style='width:90px;'><div class=' align_center'><span class='people_img relative display_inline-block  over_hidden margin_t_5'><img class='radius' id='memberimg' src='"+options.data.imgurl+"' width='70'height='70'></span></div><div class=' align_center'>" ;
    content=content+"</div></div><form name='peoplecardminiform'id='peoplecardminiform'method='post'><div style='height:127px;' class='over_hidden adapt_w font_size12 form_area people_msg'><table cellpadding='0'cellspacing='0'width='100%'class='padding_5 margin_l_10'><caption class='align_left font_bold font_size14'><label id='name'/><div class='cut_string margin_5'>"+options.data.name+accountShortName+"</div></caption><tr><td width='100%'colspan='2'class='font_bold'style='font-size:14px;'><label id='orgDepartmentId'/><div class='cut_string'>"+options.data.orgDepartmentId+"</div></td></tr><tr><th nowrap='nowrap'>"+$.i18n('org.account_form.telephone.label')+":</th><td width='400'><label id='officenumber'/>"+options.data.officenumber+"</td></tr><tr><th nowrap='nowrap'>"+$.i18n('member.mobile')+":</th><td><label id='telnumber'/>"+options.data.telnumber+"</td></tr><tr><th nowrap='nowrap'>"+$.i18n('member.email')+":</th><td><label  id='emailaddress'/>"+options.data.emailaddress+"</td></tr></table></div></form><ul class='font_size12 align_center card_operate border_t clear'>" ;
    content=content+"</ul>";
    if (panelFrame.length == 0) {// 如果没有panel,则新建panel;     
        var panel = "<div class='cardmini h100b hidden' id='miniCrad'></div>";
        panelFrame = $(panel);
        panelFrame.append($(content));
        $("body").append(panelFrame);
    }
    else {
        panelFrame.html($(content));
    }
    if(''==options.data.relateType){
      $("#addcorrelation").unbind().bind("click",function() {
  		dialog = $.dialog({
  		    id: 'url',
  		    url: _ctxPath+'/relateMember.do?method=addRelativePeople&receiverId='+options.data.id,
  		    width: 420,
  		    height: 200,
  		    targetWindow: getCtpTop(),
  		    title: $.i18n('peoplecard.addrelpeple.js')
  		});
  
      });
    }else{
      $("#addcorrelation").text(options.data.relateType);
  }
	$("#sendemail").unbind().bind("click",function() {
		if($("#emailaddress").html()!=""){
		
			sendMail($("#emailaddress").html());
		}
	});
	$("#sendcollaboration").unbind().bind("click",function() {
		appToColl4DialogMode('peopleCard',options.data.id);
	});
	$("#sendmsg").unbind().bind("click",function() {
		top.sendUCMessage(options.data.name, options.data.id);
	});
	$("#sendSMS").unbind().bind("click",function() {
		sendSMS(options.data.id);
	});
	
	var _resources = $.ctx.resources;
	if(_resources == null || _resources == undefined){
		_resources = getCtpTop().$.ctx.resources;
	}
    try{
        if(!_resources.contains("F01_newColl")){
            $("#sendcollaboration").hide();
        }
        if(!_resources.contains("F12_mailcreate")){
            $("#sendemail").hide();
        }
    }catch(e){

    }

	if(!_currentUser.canSendSMS){
		$("#sendSMS").hide();
	}
	var _plugins = $.ctx.plugins;
	if(_plugins == null || _plugins == undefined){
		_plugins = getCtpTop().$.ctx.plugins;
	}
	if(_currentUser.admin||!_plugins.contains('uc')){
		$("#sendmsg").hide();
	}
	
   var cardMini = $.dialog({
        id: 'dialog_cardMini',
        width: 330,
        height: 161,
        type: 'panel',
        htmlId: "miniCrad",//miniCard
        targetId: options.id,
        left: options.left,
        
        top: options.top,
        shadow: false,
        panelParam: {
            'show': showClose,
            'margins': false,
            "inside": showClose
        }
    });
   return cardMini;// 返回panel
}
function PeopleCard(options) {// 显示人员卡片详细信息
	var o = new orgManager();
	var _currentUser = $.ctx.CurrentUser;
	if(_currentUser == null || _currentUser == undefined){
		_currentUser = getCtpTop().$.ctx.CurrentUser;
	}
	if(!o.canShowPeopleCard(_currentUser.id,options.memberId)){
		return;
	}
    var url = _ctxPath
        + '/organization/peopleCard.do?method=showPeoPleCard&type=withbutton&memberId='
        + options.memberId;
    var card = $.dialog({
        url: url,
        width: 500,
        height: 350,
        title: $.i18n('org.external.member.info.js'),
        targetWindow: getCtpTop(),
        targetWindow: options.targetWindow == undefined ? getCtpTop() : options.targetWindow,
		top:options.top,
		left:options.left,
        buttons: [{
            text: $.i18n('label.close.js'),
            handler: function () {
                card.close();
            }
        }]
    });
    return card;
}
function PeopleCardWithOutButton(options) {// 显示人员卡片详细信息
	var o = new orgManager();
	var _currentUser = $.ctx.CurrentUser;
	if(_currentUser == null || _currentUser == undefined){
		_currentUser = getCtpTop().$.ctx.CurrentUser;
	}
	if(!o.canShowPeopleCard(_currentUser.id,options.memberId)){
		return;
	}
    var url = _ctxPath
        + '/organization/peopleCard.do?method=showPeoPleCard&type=withoutbutton&memberId='
        + options.memberId;
    var card = $.dialog({
        url: url,
        width: 500,
        height: 350,
        title: $.i18n('org.external.member.info.js'),
        targetWindow: getCtpTop(),
        targetWindow: options.targetWindow == undefined ? getCtpTop() : options.targetWindow,
		top:options.top,
		left:options.left,
        buttons: [{
            text: $.i18n('label.close.js'),
            handler: function () {
                card.close();
            }
        }]
    });
    return card;
}
function PeopleCardMini_flash(options) { //flash调用人员基本信息
	var o = new orgManager();
	var _currentUser = $.ctx.CurrentUser;
	if(_currentUser == null || _currentUser == undefined){
		_currentUser = getCtpTop().$.ctx.CurrentUser;
	}
	if(!o.canShowPeopleCard(_currentUser.id,options.memberId)){
		return;
	}
    this.memberId = options.memberId; //人员id
    this.data = options.data;
    this.left = options.left; //坐标值
    this.top = options.top;
    this.accountShortName= options.accountShortName;
    this.id = null; //设置id为null，即不使用页面中的元素定位/
    var _self = this;
    var cardMini = createPanel(_self);// 获取dialog对象
    return cardMini;
}
function PeopleCardMini_flashWithOutButton(options) { //flash调用人员基本信息
	var o = new orgManager();
	var _currentUser = $.ctx.CurrentUser;
	if(_currentUser == null || _currentUser == undefined){
		_currentUser = getCtpTop().$.ctx.CurrentUser;
	}
	if(!o.canShowPeopleCard(_currentUser.id,options.memberId)){
		return;
	}
    this.memberId = options.memberId; //人员id
    this.data = options.data;
    this.left = options.left; //坐标值
    this.top = options.top;
    this.accountShortName= options.accountShortName;
    this.id = null; //设置id为null，即不使用页面中的元素定位/
    var _self = this;
    var cardMini = createPanelWithOutButton(_self);// 获取dialog对象
    return cardMini;
}
function PeopleCardMini(options,obj) {//人员卡片基本信息
	var o = new orgManager();
	var _currentUser = $.ctx.CurrentUser;
	if(_currentUser == null || _currentUser == undefined){
		_currentUser = getCtpTop().$.ctx.CurrentUser;
	}
	if(!o.canShowPeopleCard(_currentUser.id,options.memberId)){
		return;
	}
    this.memberId = options.memberId;
    this.obj = obj;
	this.data=options.data;
    this.id = obj.attr("id");
    var cardMini; //dialog 对象
    var _self = this;
    var mouse_type = true;
    this.obj.bind({
        mouseenter: function () {
            cardMini = createPanel(_self);// 获取dialog对象    
            $("#" + cardMini.id).unbind().mouseenter(function () {
                mouse_type = false;
            }).mouseleave(function () {
                cardMini.hideDialog();
            })
        },
        mouseleave: function () {
            setTimeout(function () {
                if (mouse_type) {
                    try {
                        cardMini.hideDialog();
                    } catch (e) {
                        //首页关联人员栏目peopleCrad捕获异常
                    }
                }
            }, 200)
        }
    });
    
    return cardMini;
}
function PeopleCardMiniWithOutButton(options,obj) {//人员卡片基本信息
	var o = new orgManager();
	var _currentUser = $.ctx.CurrentUser;
	if(_currentUser == null || _currentUser == undefined){
		_currentUser = getCtpTop().$.ctx.CurrentUser;
	}
	if(!o.canShowPeopleCard(_currentUser.id,options.memberId)){
		return;
	}
	
    this.memberId = options.memberId;
    this.obj = obj;
	this.data=options.data;
    this.id = obj.attr("id");
    var cardMini; //dialog 对象
    var _self = this;
    var mouse_type = true;
    this.obj.bind({
        mouseenter: function () {
            cardMini = createPanelWithOutButton(_self);// 获取dialog对象    
            $("#" + cardMini.id).unbind().mouseenter(function () {
                mouse_type = false;
            }).mouseleave(function () {
                cardMini.hideDialog();
            })
        },
        mouseleave: function () {
            setTimeout(function () {
                if (mouse_type) {
                    try {
                        cardMini.hideDialog();
                    } catch (e) {
                        //首页关联人员栏目peopleCrad捕获异常
                    }
                }
            }, 200)
        }
    });
    
    return cardMini;
}
//-->
