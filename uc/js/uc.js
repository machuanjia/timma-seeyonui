/**
 * @author macj
 */
//uc命名空间
var UcObject;  

if(!UcObject) UcObject = {};

//存储全局变量方式
//UcObject.xxx = xxx;//变量

//存储函数方式
//UcObject.函数名1=function(){} 

//主面板数据
UcObject.user_infos_data={
        photo:"css/images/mine.jpg",
        name:"丹丹丹",
        sign:"最幸福的事就是在你无助的时候还有人惦记着你",
        online:"0"//0为在线 1为忙碌     
}
UcObject.friends_list_data = {
    list:[{
        photo:"css/images/person.jpg",
        online:"1",//1为手机 0为忙碌
        state:"1",//1为置顶
        name:"丹丹",
        sign:"最幸福的事就是在你无助的时候还有人惦记着你。。。",
        time:"16:40",
        msg:"99+"
    },{
        photo:"css/images/mail.png",
        online:"",
        state:"",
        name:"致信邮箱",
        sign:"发件人:Jerry",
        time:"14:40",
        msg:"2"
    },{
        photo:"css/images/person_img.jpg",
        online:"0",
        state:"",
        name:"Jerry",
        sign:"稍后联系。。。",
        time:"14:40",
        msg:"3"
    },{
        photo:"css/images/msg.png",
        online:"",
        state:"",
        name:"协同消息",
        sign:"Jerry发起协同:协同1",
        time:"14:40",
        msg:"3"
    },{
        photo:"css/images/person.jpg",
        online:"",
        state:"",
        name:"协同消息",
        sign:"Jerry发起协同:协同1",
        time:"14:40",
        msg:""
    }]
}
UcObject.news_list_data = {
    news_list:[{
        title:"致远社区致远社区致远社区致远社区致远社区致远社区致远社区致远社区致远社区"
    }]
}
UcObject.personal_data={
    photo:"css/images/mine.jpg",
    job:"用户体验部Jerry",
    department:"用户体验部",
    position:"UI设计师",
    telphone:"010-98748745",
    handphone:"15998501517",
    mail:"lxy@seeyon.com"  
}
UcObject.init = {
    personal_data:function(){
        var personal_data= UcObject.personal_data;

    },
    user_infos:function(){
        var user_infos = UcObject.user_infos_data;
        $(".person_logo").append("<img src="+user_infos.photo+">");
        if(user_infos.online=="0"){
            $(".user_name").append(user_infos.name+"<span><div class='icon16 online_16'></div></span>");
        }
        $(".user_sign").text(user_infos.sign);
        
    },
    friends_list:function(){
        var list = UcObject.friends_list_data.list;
           // $(".list-info").empty();                          
                                    
        $.each(list,function(i,val){
            if(list[i].state=="1"){
                    list[i].state = list[i].state+" class='list_top'";
            }
                if(list[i].msg==""){
                    var msg = "";
                }else{
                    msg ="<p><i class='read margin_t_5 margin_l_5'>"+list[i].msg+"</i></p>"; 
                }
            if(list[i].online == "1"){
                //手机在线

                $(".list-info").append("<li state="+list[i].state+">"+
                "<div class='avatar'>"+
                    "<img src="+list[i].photo+" class='avatar_img'>"+
                    "<div class='icon16 mobile_16 relative tl20'></div>"+
                "</div>"+
                "<div class='infos'>"+
                    "<div class='name font_size18'>"+list[i].name+"</div>"+
                    "<div class='sign'>"+list[i].sign+"</div>"+
                "</div>"+
                "<div class='meta'>"+
                    "<time>"+list[i].time+"</time>"+
                    msg+
                "</div>"+
                "</li>");

            }else if(list[i].online == "0"){
                //忙碌
               $(".list-info").append("<li state="+list[i].state+">"+
                "<div class='avatar'>"+
                    "<img src="+list[i].photo+" class='avatar_img'>"+
                    "<div class='icon16 busy_16 relative tl20'></div>"+
                "</div>"+
                "<div class='infos'>"+
                    "<div class='name font_size18'>"+list[i].name+"</div>"+
                    "<div class='sign'>"+list[i].sign+"</div>"+
                "</div>"+
                "<div class='meta'>"+
                    "<time>"+list[i].time+"</time>"+
                    msg+
                "</div>"+
                "</li>"); 
           }else{
            //正常
            $(".list-info").append("<li state="+list[i].state+">"+
                "<div class='avatar'>"+
                    "<img src="+list[i].photo+" class='avatar_img'>"+
                "</div>"+
                "<div class='infos'>"+
                    "<div class='name font_size18'>"+list[i].name+"</div>"+
                    "<div class='sign'>"+list[i].sign+"</div>"+
                "</div>"+
                "<div class='meta'>"+
                    "<time>"+list[i].time+"</time>"+
                    msg+
                "</div>"+
                "</li>");
           }
            
        })
        
    },
    news_list:function(){
        var news_list = UcObject.news_list_data.news_list;
        $.each(news_list,function(i,val){
            $(".news_list>ul").append("<li class='news_infos'>"+
                    "<p class='news font_size14'>"+news_list[i].title+"</p>"+        
                "</li>")
        })
        
    }
    

}


$(document).ready(function(){
/*-------------------------------主面板-----------------------------------------------------*/
	if(UcObject.page == 'main'){
	    //动态添加数据
	     UcObject.init.user_infos();
	     UcObject.init.friends_list();
	     UcObject.init.news_list();
	     zTreeNodes();
	        
		//屏蔽右键菜单
		// $(document).bind("contextmenu",function(e){   
	 //          return false;   
	 //    });
	    //搜索交互
	    $("#search").click(function(){
            $(this).focus();
            $(".search_opacity").css("opacity","1");
	        $(".search_opacity").css("background-color","#f4fbfe");
	        $(".search_icon").hide();
	        $(".close_search").show();
	    })
	    $(".close_search").click(function(){
            $(".search_opacity").css("opacity","0.4");
	        $(".search_opacity").css("background-color","#fff");
	        $(this).hide();
	        $(".search_icon").show();
	    })
	    $("#search").blur(function(){
            $(".search_opacity").css("opacity","0.4");
	       $(".search_opacity").css("background-color","#fff");
            $(".search_icon").show();
            $(".close_search").hide();
	    });
        $("#search").keydown(function (e) {
            var key = e.which; //e.which是按键的值
            if (key == 8) {
                if($("#search").val()==""){
                    (".search").css("background-color","#e8f5fc");
                    $(".search_icon").show();
                    $(".close_search").hide();
                }
            }
        });
		//初始化自定义右键菜单
        $(".user_name>span").contextMenu('myMenu3',{
                        bindings: {
                            'online': function(t){
                              alert("online");
                              
                            },
                            'busy': function(t){
                                alert("busy");
                            },
                            'leave':function(t){
                                alert("leave");
                            }
                        }
                    });
	    $(".list-info>li").mousedown(function(e){
	        if(3 == e.which){ 
	            if($(this).hasClass("list_top")){
	                $(this).contextMenu('myMenu2',{
	                    bindings: {
	                        'cancel_top': function(t){
	                           var _this = $(t);
	                            _this.removeAttr("state");
	                            _this.removeClass("list_top");
	                        },
	                        'top_remove': function(t){
	                            var _this = t; 
	                            _this.remove();
	                        }
	                    }
	                });
	            }else{
	                $(this).contextMenu('myMenu1',{
	                    bindings: {
	                        'top': function(t){
	                            var _this = $(t);
	                            _this.attr("state","1");
	                            _this.addClass("list_top");
	                            $(".list-info").prepend(_this);
	                           
	                        },
	                        'remove': function(t){
	                            var _this = t; 
	                            _this.remove(); 
	                        }
	                    }
	                });
	            }
	        }
	    })
	    //个性签名修改
	    $(".user_sign").click(function(){
	        var user_sign = $(this).text();
	        $(this).html("<input type='text' class='user_sign_edit' value="+user_sign+">");
	        $(".user_sign_edit").focus();
	        $(".user_sign_edit").blur(function(){
	            if($(this).val()==""){
	               $(".user_sign").empty();
	               $(".user_sign").text("编辑个性签名");
	                
	            }else{
	                var user_sign_edit = $(this).val();
	                $(".user_sign").empty();
	                $(".user_sign").text(user_sign_edit);
	            }
	        })
	    });
	
	    //鼠标悬浮朋友列表
	    var before_data ="";
	    $(".list-info>li").mouseenter(function(){
	        before_data = $(this).children(".meta").html();
            if($(this).children(".meta").has("p").length!="0"){
                $(this).children(".meta").html("<i class='icon_center'><em class='icon24 msg_24' title='消息记录'></em></i><i class='icon_center'><em class='icon24 ignore_24' title='忽略'></em></i>");
            }else{
                $(this).children(".meta").html("<i class='icon_center'><em class='icon24 msg_24' title='消息记录'></em></i>");
            }
	        
	    });
        // $(".meta .msg_24,meta .ignore_24").mouseout(function(){
        //     $(this).parent().parent().html(before_data);
        // })
        // $(".list-info>li>.msg_24").mouseover(function(){
        //     $(this).css("border","1px #ccc solid");
        // })
	    // $(".ignore_24").mouseover(function(){
	    //     $(this).css("border","1px #fff solid");
	    // })
	    //鼠标离开朋友列表
	    $(".list-info>li").mouseleave(function(){
	        $(this).children(".meta").html(before_data);
	        before_data ="";
	    });
	    //鼠标单击朋友列表事件
	    $(".list-info>li").click(function(){
	        if($(this).hasClass("list_click")==false){
	            $(this).addClass("list_click");
	            $(this).siblings().removeClass("list_click");
	        }
	        
	    });
	    function unit(){
	        for(var i=1;i<5;i++){
	                $("#list_handle"+i).click(function(){
	                    $(this).siblings().removeClass("current");
	                    $(this).addClass("current");
	                    $(".list_handle"+i).siblings().hide();
	                    $(".list_handle"+i).show();
	
	                });
	        }
	            
	    }
	    //鼠标点击列表头部图标
	    $(".list_handle>li").click(function(){
	        var _id = $(this).attr("id");
	        $(this).siblings().removeClass("current");
	        $(this).addClass("current");
	        $("."+_id).siblings().hide("slow");
	        // $("."+_id).siblings().removeAttr("anclass");
	        // $("."+_id).fadeOut("slow",function(){
	            $("."+_id).show("slow");
	        // });
	        // $("."+_id).attr("anclass","slideLeft");
	
	    });
	   // //鼠标悬浮头像 显示个人资料
       $(".person_logo").mouseover(function(){
            var _thisMsg = $(".personal_msg");
            _thisMsg.show("normal");
            $(".personal_msg").mouseover(function(){
                $(this).show();
            }).mouseout(function(){
                $(this).hide();
            })
       });
       $(".person_logo").mouseout(function(){
           $(".personal_msg").hide();
       });
    //    //显示个人详细信息
    //    function showPersonMsg(){

    //    }
       // function showMsg(obj,class) { 
       //      var objDiv = $("."+class+""); 
       //      $(objDiv).css("display","block"); 
       //      $(objDiv).css("left", event.clientX); 
       //      $(objDiv).css("top", event.clientY + 10); 
       //  } 
       //  function hideMsg(obj,class) { 
       //      var objDiv = $("."+class+""); 
       //      $(objDiv).css("display", "none"); 
       //  }
	    /*组织结构开始*/
       
	    function zTreeNodes(){
            // var rMenu=$("#myMenu3");
            var zTree1;
	        var setting = {
                checkable : true,
	            view: {
	                showLine: false
	            },
	            data: {
	                simpleData: {
	                    enable: true
	                }
	            },
                callBack:{
                    // onRightClick: fzTreeOnRightClick
                } 
	        };

	       
	        var nodes = [
	          { id:1, pId:0, name:"致远软件 - 展开", open:true,iconSkin:"icon16 company_16",noR:true},
	            { id:11, pId:1, name:"北京致远软件协创有限公司 - 展开",open:true,iconSkin:"icon16 unit_16",noR:true},
	            { id:111, pId:11, name:"总裁会",iconSkin:"icon16 department_16",noR:true},
	            { id:112, pId:11, name:"运营体系",iconSkin:"icon16 department_16",noR:true},
	            { id:113, pId:11, name:"客户体系",iconSkin:"icon16 department_16",noR:true},
	            { id:114, pId:11, name:"研发体系",open:true,iconSkin:"icon16 department_16",noR:true},
	            { id:1111, pId:114, name:"v5研发事业群 - 展开",open:true,iconSkin:"icon16 department_16",noR:true},
	            { id:11111, pId:1111, name:"产品管理部",open:true,iconSkin:"icon16 department_16",noR:true},
	            { id:11112, pId:1111, name:"用户体验部",isParent:true,iconSkin:"icon16 department_16",noR:true},
	            { id:111111, pId:11111, name:"王海蓉",iconSkin:"icon16 women_16",type:"1",newrole:true},
	            { id:111112, pId:11111, name:"李洪泽",iconSkin:"icon16 men_16",type:"2",newrole:true},
	            { id:111113, pId:11111, name:"李洋",iconSkin:"icon16 women_16",type:"1",newrole:true},
	            
	            { id:11113, pId:1111, name:"内容传播部",iconSkin:"icon16 department_16",noR:true},
	            { id:11114, pId:1111, name:"Jerry",iconSkin:"icon16 women_16",type:"1",newrole:true},
	            { id:11115, pId:1111, name:"甄帅",iconSkin:"icon16 men_16",type:"2",newrole:true}
	        ]
	        $.fn.zTree.init($("#treeDemo"), setting, nodes); 
	    }
	}
    
 

   /*----------------------------------主面板结束--------------------------------------------*/



   /*-----------------------------------login start ----------------------------------------*/

    if (UcObject.page == 'login') {
        $(".button_ok").live("click",function(){
            $(".login_form_setting").hide();
            $(".login_form").show("normal");
        });
        $(".set_login_16").click(function(){
            $(".login_form").hide();
            $(".login_form_setting").show("normal");
        })
    }




   /*-----------------------------------login end ----------------------------------------*/




	/*-------------------------------------聊天窗口js--------------------------------------*/
	if (UcObject.page == 'dialog') {
		//左侧导航搜索按钮
		$('#dialog_nav_search_close').click(function(){
			$('#dialog_nav_search').removeClass('dialog_nav_search_focus');
			$(this).hide();
			$('#nav_ul').show();
			$('#nav_ul_search').hide();
		});
		//左侧导航搜索框
		$('#dialog_nav_search').blur(function(){
			$('#dialog_nav_search_close').hide();
			$('#nav_ul').show();
			$('#nav_ul_search').hide();
			$('#dialog_nav_search').removeClass('dialog_nav_search_focus').val('');
		}).focus(function(){
				$('#dialog_nav_search_close').show();
				$(this).addClass('dialog_nav_search_focus');
				$('#nav_ul').hide();
				$('#nav_ul_search').show();
		}).keyup(function(){
			
		});
		//历史消息
		$('#history_show_btn').toggle(
		  function () {
		    $('#dialog_history').show().css('display','flex');
		  },
		  function () {
		    $('#dialog_history').hide();
		  }
		);
		//历史消息
		$('#dialog_button_set').click(function(){
			$('#dialog_button_set_ul').show();
		});
		//发送下拉箭头
		$('#enter_select').click(function(){
			alert('enter_select')
			$('#dialog_button_set_ul').hide();
		});
		$('#ctrl_enter_select').click(function(){
			alert('ctrl_enter_select')
			$('#dialog_button_set_ul').hide();
		});
		//历史消息关闭图标
		$('#dialog_history_close_16').click(function(){
			$('#dialog_history').hide();
		});
		
		
		
	}
	
});
