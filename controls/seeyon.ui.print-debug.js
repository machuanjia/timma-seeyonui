
/**************************************************   打印   **************************************************/
var plist = null;//定义全局变量（打印内容对象列表）
var styleData = null;//定义样式表全局变量
var printDefaultSelect = null;
var notPrintDefaultSelect = null;
var otherPrarams = null;
var contentType = null;
var viewState = null;
var isFormPrintFlag = false;
/**
 * 初始化打印数据
 * printFragmentList -- 打印内容对象列表
 * styleDatas -- 打印样式
 */
function  printList(printFragmentList,styleDatas){
	if(!printFragmentList) {return;}
	plist = printFragmentList;
    styleData = styleDatas;
    if(arguments[2] != null){printDefaultSelect = arguments[2]}else{printDefaultSelect = null;}
    if(arguments[3] != null){notPrintDefaultSelect = arguments[3]}else{notPrintDefaultSelect = null;}
    //添加参数contentType
    //如果是表单编辑态打印，其中的附件图片关联文档都是以comp形式获取，需要在打印页面初始化这些组件
    //如果不是编辑态表单打印，contentType=editForm,页面中获取的HTML中也有comp组件，此时不需要再次初始化组件。
    if (arguments[4] != null) { contentType = arguments[4]; } else {contentType = null;}
    if(arguments[5] != null){viewState = arguments[5];}else{viewState = null;}
    if(arguments[6] != null){otherPrarams = arguments[6];}else{otherPrarams = null;}
	printButton();
}

/**
 * 弹出打印对话框
 */
function printButton(){
	var url = _ctxPath + "/common/print/print.jsp?jsessionid=" + _sessionid;
	if(contentType){
		url+="&contentType="+contentType;
	}
	if(viewState){
		url+="&viewState="+viewState;
	}
	window.open(url);
	//window.open(url,'','height='+(parseInt(screen.height)-110)+',width='+(parseInt(screen.width)-20));
	//window.open("G:/aptanaWorkspace/seeyonui/controls/html/print.html");
}
function getParentWindow (win){
	win = win || window;
	if(win.dialogArguments){
		return win.dialogArguments;
	}
	else{
		return win.opener || win;
	}
}
/**
 * 打印按钮界面
 * 弹出打印页面onload此方法
 */
   function printLoad(){
   	//try{
   	   //var obj  = v3x.getParentWindow(); 
	   var obj  = getParentWindow(); 
   	   var context = document.getElementById("context");
	   var tlist = obj.plist;//获取打印内容
	   var tlength = tlist.size();
	   for(var i=0; i<tlength; i++){
	 	    var s = tlist.get(i);
	 	   if(typeof(s.dataHtml)==="undefined" || typeof(s.dataHtml)===undefined){
	            context.innerHTML += "<p></p>";
	        }else {
	            context.innerHTML += "<p>"+s.dataHtml+"</p>";
	        }
	   }
	   
	   var klist = obj.styleData;//获取样式表列表    
	   setStyle(klist); 
	   var checkOption = document.getElementById("checkOption");
	   var nlist  = obj.plist;
	   var nlength = tlist.size();
	   var flag = 0;
	  // disabledLink();//这里写这个干什么？
	   //只有一个选项的时候,就没必要出现了,也没必要出现全部选项
	  //if(nlength<=1){disabledLink();return;}//即使只有一个选项，也应该将内容内的可选中动作的元素给禁用掉
	   for(var i=0; i<nlength; i++){
	 	    var s = nlist.get(i);    
	 	    if(s.dataName != null && s.dataName != ""){
	            checkOption.innerHTML +="<label for='dataNameBox"+i+"' class='margin_r_10 hand'><input class='radio_com' type=checkbox checked name='dataNameBoxes' id=dataNameBox"+i+" onclick='printMain(this)'><font style='font-size:12px' color='black'>"+s.dataName+"</font></label>&nbsp;&nbsp;";
	 	        flag ++;
	 	    }
	   } 
	   if(flag >0)//当有多个备选项时显示
	   checkOption.innerHTML +="<font style='font-size:12px' color='black'><label for='printall' class='margin_r_10 hand'><input class='radio_com' type=checkbox id ='printall' checked name=cboxs onclick=printAll(this)>" + $.i18n('print.printall.label.js') + "</label></font>";
	    
	    if(obj.notPrintDefaultSelect != null){
		   	for(var i = 0; i < obj.notPrintDefaultSelect.length; i ++){
		   		if(document.getElementById("dataNameBox"+obj.notPrintDefaultSelect[i])!=null){
					document.getElementById("dataNameBox"+obj.notPrintDefaultSelect[i]).checked = false;
				}
		   	}
	    }
	    document.close();
	    //表单打印签章时不显示签章内容，查看源文件时可以显示，但页面没有相应的值，重新加载一次context就可以显示，在没有找到更好方法之前，暂时这么解决。
	    var context = document.getElementById("context");
	    //context.innerHTML="";
	    creatDataHtml(tlist,context);
	    disabledLink();
   	//}catch(e){}
}
	
   /**
* 响应checked事件 
*/
   function printMain(e){
   	    var  obj = getParentWindow(); 
        var tlist  = obj.plist;
	    var context = document.getElementById("context");
    creatDataHtml(tlist,context);
 	checkCount(e,tlist);
 	disabledLink();
 	initBodyHeight();
 	loadSign();
}
function cleanSpecial(str){
	var position = str.indexOf("<DIV>");
	if(position == -1){
		return str;
	}
	var leftstr = str.substr(0,position-1);
	var rightstr = str.substr(position);
	var nextposition = rightstr.indexOf("</DIV>");
	var laststr = rightstr.substr(nextposition+6);
	return cleanSpecial(leftstr+laststr);
}
/**
 * 创建Html片断
 */
function  creatDataHtml(tlist,context){
	var tlength = tlist.size();
	var html = new StringBuffer();
	html.append("");
    for(var i=0; i<tlength; i++){
 	    var s = tlist.get(i);
 	    if(s.dataName != null && s.dataName != ""){
     	    var thisCheckBox = document.getElementById("dataNameBox"+i);//取得每一个按钮
     	    if(thisCheckBox.checked){//判断当前按钮是否选中 
         	    if(typeof(s.dataHtml)==="undefined" || typeof(s.dataHtml)===undefined){
         	    	html.append("<p></p>");
                }else {
                   html.append("<p>"+s.dataHtml+"</p>");
                }
	        }else{
	        	//有一个按钮没有选  则全部打印按钮不能选中
	        	var thisAllCheckBox =document.getElementById("printall");
	        	thisAllCheckBox.checked = false;
	        }
	    }
	    //由于正文传入了空值，所以做判断
	    if(s.dataName == ""){
	        if(typeof(s.dataHtml)==="undefined" || typeof(s.dataHtml)===undefined){
                 html.append("<p></p>");
             }else {
                 html.append("<p>"+s.dataHtml+"</p>");  
             }
	    }
	}
    $(context).html(html.toString());
 	if(contentType==20){
 		replaceFormCompField();//替换获取的HTML中附件等单元格的内容
 		initFormContent(true);
 	}
// 	$(":checkbox","#context").add(":radio")
//		.removeProp("disabled")
//		.removeAttr("name")
//		.removeAttr("id")
//		.attr("onclick","return false;");
}
/*
 * 表单编辑时打印， 附件、图片和关联文档的HTML代码在后台无法获取，用编辑页面的内容替换当前页面对应的单元格。
 */
function replaceFormCompField(){
	var form = null;
	var sps = $("span[id$='_span']",$("#context"));
	var spanHtml = getParentWindow().otherPrarams;
	if(spanHtml){
		if(spanHtml["formObj"]){
			//初始化 Form对象，用于getRecordIdByJqueryField中获取重复项的recordId
			form =  spanHtml["formObj"];
		}
	}
	
	for(var i=0;i<sps.length;i++){
		var jqField = $(sps[i]);
		var fieldVal =jqField.attr("fieldVal");
        if(fieldVal==undefined){
        	continue;
        }else{
            fieldVal = $.parseJSON(fieldVal);
        }
        var idStr = jqField.attr("id").split("_")[0];
        if(fieldVal.inputType=='attachment'||fieldVal.inputType=='document'||fieldVal.inputType=='image'){
            if(20==contentType&&form!=null){
            	jqField.html(spanHtml[getRecordIdByJqueryField(jqField)+"_"+idStr]);
            	jqField.find("div[id^=attachment2Area]").css("background-color","white");
                jqField.find("div[id^=attachmentArea]").css("background-color","white");
            }
            jqField.find(".ico16").each(function(){
                if($(this).hasClass("affix_del_16")
                		||$(this).hasClass("affix_16")
                		||$(this).hasClass("associated_document_16")
                		||$(this).hasClass("insert_pic_16")
                		||$(this).hasClass("editor_16")){
                    $(this).hide();
                }
                if($(this).hasClass("collection_16")){
                    $(this).attr("title","");
                }
            });
            jqField.find("a").each(function(){
            	$(this).attr("title","");
            });
        }
	}
}
 /**
  * 检查按钮checked个数是否合法
  */
function  checkCount(e,tlist){
	   var tlistSize = tlist.size();
	   var tlistSizeTemp = 0;
	   for(var i =0;i<tlistSize;i++){
	 	    var s = tlist.get(i);
	 	    if(s.dataName== undefined){
	 	        tlistSizeTemp=tlistSizeTemp+1;
	 	    }
	   }
	   tlistSizeTemp = tlistSize - tlistSizeTemp;
	  if(e.checked == false){
 		var count= 0;
 		for(var i =0;i<tlistSize;i++){
 	        var s = tlist.get(i);
 	        if(s.dataName !=null && s.dataName != ""){
     	        var thisCheckBox = document.getElementById("dataNameBox"+i);//取得每一个按钮
     	         if(thisCheckBox.checked==false){//判断当前按钮是否选中  
     	              count ++;	
     	         }
     	    }
 		}
 		if(count == tlistSizeTemp){
 			//alert(_('printLang.print_least_select_one'));
			alert("打印内容不能为空");
 			if(e.id=='printall'){
 				var obj  = parent.getParentWindow();
 				if(obj.printDefaultSelect!=null){
 					if(document.getElementById("dataNameBox"+obj.printDefaultSelect[0])!=null){
 						document.getElementById("dataNameBox"+obj.printDefaultSelect[0]).checked = true;
 					}else{
 						document.getElementById("dataNameBox0").checked = true;
 					}
 				}else{
 					document.getElementById("dataNameBox0").checked = true;
 				}
 				
 			}else{
 				e.checked = true;
 			}
 			printMain(e);
 			return false;
 		}
 	}   
}
/**
 * 打印对象
 */
function PrintFragment(dataName,dataHtml){
	this.dataName = dataName;//按钮名称
	this.dataHtml  = dataHtml;//代码片断	
}

/**
 * 取消链接及不需要的事件
 * [ 310SP1将TextInput和TextArea恢复，置为diasble，不用SPAN替换，避免各种布局问题。
 * 用SPAN替换具体原因无法查明，可能有打印隐患。] Mazc 2009-12-08
 */
function disabledLink(){
	var aaa = document.body.getElementsByTagName("a");
	var sk = document.body.getElementsByTagName("span");
	var uuu = document.body.getElementsByTagName("u");
	var tables = document.body.getElementsByTagName("table");
	var inputs = document.body.getElementsByTagName("INPUT");
	var imgs = document.body.getElementsByTagName("img");
	var selects=document.body.getElementsByTagName("select");
	var textareas=document.body.getElementsByTagName("TEXTAREA");
	var tds = document.body.getElementsByTagName("td");
	var trs = document.body.getElementsByTagName("tr");
	var objects = document.body.getElementsByTagName("OBJECT");
	var divs = $(".xdRepeatingSection");//重复节
	var hidenBoderStyle = "border-left:0px;border-top:0px;border-right:0px;border-bottom:0px solid #ff0000";
	   for(var i=0;i<aaa.length;i++){
	   	  aaa[i].target="_self";
	      aaa[i].style.color = "#000000";
	      aaa[i].onclick="";
		  aaa[i].href="###";
		  //aaa[i].style.display = "none";
		  aaa[i].style.textDecoration="none";
		  aaa[i].style.cursor="default";
	   }
	   for(var i=0;i<sk.length;i++){
		   //不需要对表单样式进行修改，样式定义都在form.css.jsp中统一设置
//		   var styleText = sk[i].style.cssText;
//		   if(styleText == ""){
//			   styleText = hidenBoderStyle;
//		   }else{
//			   styleText = styleText + ";" + hidenBoderStyle;
//		   }
//		   sk[i].style.cssText = styleText;
		   sk[i].onmouseout = "";
		   sk[i].onmouseover = "";
		   sk[i].onclick="";
		   sk[i].style.cursor="default";
	   }
	   for(var i=0;i<uuu.length;i++){
	      uuu[i].onclick= function(){
	      	//alert(_('printLang.print_preview_link_alert'));
	      }
	   }
	   for(var i=0;i<tables.length;i++){
		  tables[i].onclick="";
	   }
	   
	   for(var i = inputs.length -1; i >= 0;i--){
	   	 if(inputs[i].type == 'checkbox'){
	   	  	if(inputs[i].parentNode.parentNode.id == "checkOption" || inputs[i].id == "printall") {//保留上方可选的按钮
	   	  		continue;
	   	  	}
	   	  }
		  else if(inputs[i].type=="text"){
		  	if(inputs[i].id != "print8"){
		  		var styleText = inputs[i].style.cssText;
		  		var breakStyle="WORD-WRAP: break-word;TABLE-LAYOUT: fixed;word-break:break-all;";
			    if(styleText == ""){
					styleText = breakStyle+"display:inline-block";
				}else{
					if(styleText.toLowerCase().indexOf('display') ==-1){
						breakStyle = breakStyle + "display:inline-block";
					}
					styleText = styleText + ";" + breakStyle;
				}
		  		inputs[i].outerHTML= "<span type=\"text\" id=\""+inputs[i].id+"\" class=\"" + inputs[i].className +  "\" style=\"" + styleText +  "\">" + inputs[i].value.escapeSameWidthSpace() + "</span>" ;
		  		continue;
		  	}  
		  }
		  var isStr = "print1 print2 print3 print4 print5 print6 print7 print8 dataNameBox0 dataNameBox1 dataNameBox2 dataNameBox3 dataNameBox4 dataNameBox5 printall";
		  if(isStr.indexOf(inputs[i].id)==-1){
			  inputs[i].disabled = "disabled";
			  inputs[i].onkeypress="";
			  inputs[i].onchange="";
			  inputs[i].onclick="";
			  inputs[i].onmouseout = "";
			  inputs[i].onmouseover = "";
			  inputs[i].onfocus="" ;
			  inputs[i].onblur="" ;	
			  if(!v3x.isMSIE){
			  	 inputs[i].disabled = "disabled";
			  }
		  }
	  }
		//如果打印内容为表单时，去掉表单中控件的图片
	  for(var i=0;i<imgs.length;i++){
		  imgs[i].onkeypress="";
		  imgs[i].onchange="";
		  imgs[i].onclick="";
		  imgs[i].style.cursor="default";
		  imgs[i].alt = "" ;
		  imgs[i].title = "" ;
		  try{
			  var imgsrc = imgs[i].src.toString();
		
			  if(imgsrc.indexOf("form/image/selecetUser.gif") !=-1 || imgsrc.indexOf("form/image/date.gif") !=-1 || imgsrc.indexOf("form/image/add.gif") !=-1 || imgsrc.indexOf("form/image/addEmpty.gif") !=-1 || imgsrc.indexOf("form/image/delete.gif") !=-1 || imgsrc.indexOf("handwrite.gif") !=-1  || imgsrc.indexOf("seeyon/apps_res/v3xmain/images/message/16/attachment.gif")!= -1 || imgsrc.indexOf("seeyon/apps_res/form/image/quoteform.gif")!=-1 ){
			  	 imgs[i].outerHTML = "&nbsp;&nbsp;&nbsp;";
			  	 i--;
			  }
			  //签章在打印时不能修改
			 if(imgsrc.indexOf("handwrite.gif") !=-1){		 	
			   	 for(var a=0;a<objects.length;a++){
			   	 if(objects[a].innerHTML.indexOf("Enabled")!=-1) 
			   	    objects[a].Enabled = false;
			   }
			  }
		  }	catch(e){
		  	 // ie8 取base64的src报无效指针，忽略
		  }     
		}
		for(var j = selects.length -1; j >= 0; j--)
		{
			var styleText = selects[j].style.cssText;
			try{
				var childs = selects[j].parentNode.childNodes;
				for(var c=0;c<childs.length;c++){
					//针对表单中 用input模拟下拉框导致父节点隐藏的问题
					//用input模拟框的样式
					if(childs[c].id == selects[j].id+"_autocomplete"){
						styleText = childs[c].style.cssText;
						break;
					}
				}
			}catch(e){}
			//  $(selects[j].parentNode).replaceWith();
			$(selects[j].parentNode).replaceWith("<span class=\"" + selects[j].className + "\" style=\"" + styleText +  "\">" + selects[j].options[selects[j].selectedIndex].text + "</span>");
		}
		for(var i=0;i<textareas.length;i++)
		{
			try{
				var disBorderStyle="overflow-y:visible;overflow-x:visible;";
			  var styleText = textareas[i].style.cssText;
			  if(styleText == ""){
				styleText = disBorderStyle;
			  }else{
				styleText = styleText + ";" + disBorderStyle;
			  }
			  textareas[i].style.cssText = styleText;
			  textareas[i].onclick="";
			  textareas[i].onkeypress="";
			  textareas[i].onchange="";
			  textareas[i].onmouseout = "";
			  textareas[i].onmouseover = "";
			  textareas[i].onfocus="" ;
			  textareas[i].onblur="" ;	
			}catch(e){}
			textareas[i].readOnly = "readOnly";
		}
		for(var i=0;i<tds.length;i++){
		   tds[i].onclick="";
	   }
		for(var i=0;i<trs.length;i++){
			trs[i].onclick="";
			$(trs[i]).unbind("click").attr("onclick","");
		}
		divs.each(function(){
		    this.onclick="";
		    $(this).unbind("click").attr("onclick","");
		});
	}

   /**
* 打印内容界面
*/
  function printInnerLoad(){
  	   var context = document.getElementById("context");
   var obj  = parent.getParentWindow();
   var tlist = obj.plist;//获取打印内容
   var tlength = tlist.size();
   for(var i =0;i<tlength;i++){
 	    var s = tlist.get(i);
 	    if(typeof(s.dataHtml)==="undefined" || typeof(s.dataHtml)===undefined){
 	        context.innerHTML += "<p></p>";
 	    }else {
 	        context.innerHTML += "<p>"+s.dataHtml+"</p>";
 	    }
   }
   var klist = obj.styleData;//获取样式表列表
       if(!klist){
           setStyle(klist) ;
       }
  }

/**
 * 设置样式表
 */
function setStyle(klist){
	if(klist.size() > 0){
		var linkList = document.getElementById("linkList");
		if(linkList==null) return;
		for(var j = 0; j < klist.size(); j++){//引入样式表
			var linkChild = document.createElement("link");
            linkChild.setAttribute("rel", "stylesheet");
            linkChild.setAttribute("href", klist.get(j));
            linkChild.setAttribute("type", "text/css");
            linkList.appendChild(linkChild);
		}
	}
}

  /**
   * 选择打印全部
   */
function printAll(e){
	var boxs = document.getElementsByName("dataNameBoxes");
	if(e.checked){
		for(var j=0;j<boxs.length;j++){
			boxs[j].checked = true;
		}
		printMain(e);
	}else{
		for(var j=0;j<boxs.length;j++){
			boxs[j].checked = false;
		}
		printMain(e);
	}
	loadSign();
}
  
function onbeforeprint(){
	document.getElementById("checkOption").style.display="none";
}
  
function onafterprint(){
	document.getElementById("checkOption").style.display="";
}
