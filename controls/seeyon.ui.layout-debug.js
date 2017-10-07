/// <reference path="../scriptes/jquery.js" />
/**
 * @author macj
 */
function MxtLayout(options) {
    var p = {
		id:options.id,
        spritHeight: options.spritHeight == null ? 7 : options.spritHeight,//间隔条的宽度/高度span
        borderWidth: options.borderWidth == null ? 1 : options.borderWidth,//间隔条的宽度/高度span	
		northArea:options.northArea,
		southArea:options.southArea,
		eastArea:options.eastArea,
		westArea:options.westArea,
		centerArea:options.centerArea,
		successFn: options.successFn,//加载成功回调
		setCallFun: options.setCallFun == null ? function () { } : options.setCallFun,//区域改变回调
		moveCallFun: options.moveCallFun == null ? function () { } : options.moveCallFun,//改变中回调
		isFixLayout: (options.isFixLayout == null || options.isFixLayout == undefined) ? true : options.isFixLayout,
		spiretBarN: function () {
		    if (options.northArea) {
		        if (options.northArea.spiretBar) {
		            if (options.northArea.spiretBar.show) {
		                return options.northArea.spiretBar;
		            }
		        }
		    } 
            return false;
		}(),
		spiretBarS: function () {
		    if (options.southArea) {
		        if (options.southArea.spiretBar) {
		            if (options.southArea.spiretBar.show) {
		                return options.southArea.spiretBar;
		            }
		        }
		    }
		    return false;
		}(),
		spiretBarE: function () {
		    if (options.eastArea) {
		        if (options.eastArea.spiretBar) {
		            if (options.eastArea.spiretBar.show) {
		                return options.eastArea.spiretBar;
		            }
		        }
		    }
		    return false;
		}(),
		spiretBarW: function () {
		    if (options.westArea) {
		        if (options.westArea.spiretBar) {
		            if (options.westArea.spiretBar.show) {
		                return options.westArea.spiretBar;
		            }
                }
            }
		    return false;
		}()
    }
    var g = {
        init: function(){
			
            g.height = g.main.height();
            g.width = g.main.width();
            g._100 = g.width;//100%宽度
            g._m_height = g.height - p.nHeight - p.sHeight - p.spritHeight * g._h_spritSize;//左中右高度div
            g._m_top = p.nHeight + p.spritHeight * (p.northFlag == 2 ? 1 : 0);//左中右top
            g._c_width = g._100 - p.spritHeight * g._w_spritSize - p.eWidth - p.wWidth;//中 width
            g._c_left = p.wWidth + p.spritHeight * (p.westFlag==2 ? 1 : 0);//中left
            if (g.n) {
                if (typeof($("#northSp"+"_"+p.id)) != "undefined") {
                    $("#northSp"+"_"+p.id).remove();
                }
				var str = "";
				var norH = p.nHeight;
				var h = p.northBorder?1:0;
                if(p.northFlag==2){
                    str = "<span id='northSp_" + p.id + "' class='spiret spiret_T align_center' style='cursor:row-resize;z-index:3;width:" + g.width + "px;height:" + p.spritHeight + "px;left:0px;top:" + (p.nHeight) + "px;'><table align='center' border='0' cellpadding='0' cellspacing='0' height='100%' style='display:" + (p.spiretBarN ? "table" : "none") + ";'><tr><td align='center'><span class='spiretBarHidden4'><em></em></span><span class='spiretBarHidden3'><em></em></span></td></tr></table></span>";
					norH = p.northArea.height;
                }
                if (g.n.attr("style") == undefined) {//解决$(window).resize()的时候,北边区域高度被重置，导致层重叠。判断只第一次设置高度
                    g.n.css({'height': (norH-p.borderWidth*(p.northBorder?2:0)) + 'px'});
                }
                g.n.css({
                    'left': '0px',
                    'top': '0px',
					'border-width':h+'px',
                    'width': g._100-p.borderWidth*(p.northBorder?2:0) + 'px',//去掉边框div
                    'z-index': '1'
                }).show().after(str);
                if (p.northFlag == 2) {
					g.northSp = $("#northSp"+"_"+p.id);
					g.northSp.mousedown(function(e){
					    if (e.target == this) {
					        g.dragStart('h', e, this, 'north');
					    }
					});
					if (p.spiretBarN.show) {
					    g.northSpBarB = $("#northSp_" + p.id + " .spiretBarHidden3");
					    g.northSpBarT = $("#northSp_" + p.id + " .spiretBarHidden4");
					    g.northSpBarT.css({ "border-right": "0" });
					    if (p.spiretBarN.type == "1") {//轮流显示
					        g.northSpBarB.hide();
					        g.northSpBarT.css({ "border-right": "" });
					    } 
					    g.northSpBarB.click(function () {
					        if (p.spiretBarN.type == "1") {
					            g.northSpBarT.show();
					            g.northSpBarB.hide();
					        }
					        p.spiretBarN.handlerB();
					    });
					    g.northSpBarT.click(function () {
					        if (p.spiretBarN.type == "1") {
					            g.northSpBarT.hide();
					            g.northSpBarB.show();
					        }
					        p.spiretBarN.handlerT();
					    });
					}
				}
            }
            if (g.e) {
				if (typeof($("#eastSp"+"_"+p.id)) != "undefined") {
                    $("#eastSp"+"_"+p.id).remove();
                }
				var str = "";
				var h =p.eastBorder?1:0;
				if(p.eastFlag == 2){
				    str = "<span class='spiret spiret_R' id='eastSp_" + p.id + "' style='cursor:e-resize;z-index:3;width:" + p.spritHeight + "px;height:" + (g._m_height + p.borderWidth * (p.eastBorder ? 2 : 0)) + "px;left:" + (g.width - p.eWidth - p.spritHeight) + "px;top:" + (g._m_top) + "px;'><table valign='middle' border='0' cellpadding='0' cellspacing='0' width='100%' style='display:" + (p.spiretBarE ? "table" : "none") + ";margin-top:" + ((g._m_height - p.borderWidth * (p.eastBorder ? 2 : 0)) / 2 - 25) + "px'><tr><td><span class='spiretBarHidden'><em></em></span><span class='spiretBarHidden2'><em></em></span></td></tr></table></span>";
				}
                g.e.css({
                    'height': (g._m_height-p.borderWidth * (p.eastBorder?2:0)) + 'px',
                    'left': (g.width - p.eWidth) + 'px',
                    'top': (g._m_top) + 'px',
                    'width': (p.eWidth - p.borderWidth * (p.eastBorder?2:0)) + 'px',
					'border-width':h+'px',
                    'z-index': '1'
                }).show().after(str);
                g.eastSp = $('#eastSp_'+p.id);
                g.eastSp.mousedown(function (e) {
                    if (e.target == this) {
                        g.dragStart('h', e, this, 'east');
                    }
                });
                if (p.spiretBarE.show) {
                    g.eastSpBarR = $("#eastSp_" + p.id + " .spiretBarHidden");
                    g.eastSpBarL = $("#eastSp_" + p.id + " .spiretBarHidden2");
                    if (p.spiretBarE.showItem == "L") {
                        g.eastSpBarR.hide();
                    } else {
                        g.eastSpBarL.hide();
                    }
                    g.eastSpBarR.click(function () {
                        g.eastSpBarR.hide();
                        g.eastSpBarL.show();
                        p.spiretBarE.handlerR();
                    });
                    g.eastSpBarL.click(function () {
                        g.eastSpBarL.hide();
                        g.eastSpBarR.show();
                        p.spiretBarE.handlerL();
                    });

                }
            }
            if (g.c) {
                g.c.css({
                    'height': (g._m_height-p.borderWidth * (p.centerBorder?2:0)) + 'px',
                    'left': g._c_left + 'px',
                    'top': (g._m_top) + 'px',
                    'width': (g._c_width-p.borderWidth * (p.centerBorder?2:0)) + 'px',
					'border-width':p.centerBorder?1:0+'px',
                    'z-index': '1'
                }).show();
            }
            
            if (g.w) {
				if (typeof($("#westSp_"+p.id)) != "undefined") {
                    $("#westSp_"+p.id).remove();
                }
				
				var str = "";
				var h = p.westBorder?1:0;
				if(p.westFlag == 2){
				    str = "<span class='spiret spiret_L' id='westSp_" + p.id + "' style='cursor:e-resize;z-index:3;width:" + p.spritHeight + "px;height:" + (g._m_height + p.borderWidth * (p.westBorder ? 2 : 0)) + "px;left:" + (p.wWidth) + "px;top:" + (g._m_top) + "px;'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='display:" + (p.spiretBarW ? "table" : "none") + ";margin-top:" + ((g._m_height - p.borderWidth * (p.eastBorder ? 2 : 0)) / 2 - 25) + "px'><tr><td valign='middle'><span class='spiretBarHidden hidden'><em></em></span><span class='spiretBarHidden2'><em></em></span></td></tr></table></span>";
				}
				
                g.w.css({
                    'height': (g._m_height-p.borderWidth * (p.westBorder?2:0)) + 'px',
                    'left': '0px',
                    'top': (g._m_top) + 'px',
                    'width': (p.wWidth-p.borderWidth * (p.westBorder?2:0)) + 'px',
					'border-width':h+'px',
                    'z-index': '1'
                }).show().after(str);
                g.westSp = $('#westSp_'+p.id);
                g.westSp.mousedown(function(e){
                    if (e.target == this) {
                        g.dragStart('h', e, this, 'west');
                    }
                });
                if (p.spiretBarW.show) {
                    g.westSpBarR = $("#westSp_" + p.id + " .spiretBarHidden");
                    g.westSpBarL = $("#westSp_" + p.id + " .spiretBarHidden2");
                    g.westSpBarR.click(function () {
                        g.westSpBarL.show();
                        g.westSpBarR.hide();
                        p.spiretBarW.handlerR();
                    });
                    g.westSpBarL.click(function () {
                        g.westSpBarR.show();
                        g.westSpBarL.hide();
                        p.spiretBarW.handlerL();
                    });
                }
            }
            if (g.s) {
				if (typeof($("#southSp_"+p.id)) != "undefined") {
                    $("#southSp_"+p.id).remove();
                }
				
				var str = "";
				var h = p.southBorder?1:0;
                if(p.southFlag==2){
                    str = "<span id='southSp_" + p.id + "' upordown='down' class='spiret spiret_T' style='cursor:row-resize;z-index:3;width:" + g.width + "px;height:" + p.spritHeight + "px;left:0px;top:" + (g.height - p.sHeight - p.spritHeight) + "px;'><table align='center' border='0' cellpadding='0' cellspacing='0' height='100%' style='display:" + (p.spiretBarS ? "table" : "none") + ";'><tr><td align='center'><span class='spiretBarHidden4'><em></em></span><span class='spiretBarHidden3'><em></em></span></td></tr></table></span>";
				}
                g.s.css({
                    'height': (p.sHeight-p.borderWidth*(p.southBorder?2:0)) + 'px',
                    'left': '0px',
                    'top': (g.height - p.sHeight) + 'px',
                    'width': g._100 + 'px',//去掉边框div
                    'border-width':h+'px',
                    'z-index': '1'
                }).show().after(str);
                g.southSp = $('#southSp_'+p.id);
				if(p.southSpritBar != true){
	                g.southSp.mousedown(function(e){
	                    if (e.target == this) {
	                        g.dragStart('h', e, this, 'south');
	                    }
	                });
				}
				if (p.spiretBarS.show) {
				    g.southSpBarB = $("#southSp_" + p.id + " .spiretBarHidden3");
				    g.southSpBarT = $("#southSp_" + p.id + " .spiretBarHidden4");
				    g.southSpBarT.css({ "border-right": "0" });
				        if (p.spiretBarS.type == "1") {//轮流显示
				            g.southSpBarT.hide();
				            g.southSpBarT.css({ "border-right": "" });
				        }
				    g.southSpBarB.click(function () {
				            if (p.spiretBarS.type == "1") {//轮流显示
				                g.southSpBarB.hide();
				                g.southSpBarT.show();
				            }
				        p.spiretBarS.handlerB();
				    });
				    g.southSpBarT.click(function () {
				            if (p.spiretBarS.type == "1") {//轮流显示
				                g.southSpBarT.hide();
				                g.southSpBarB.show();
				            }
				        p.spiretBarS.handlerT();
				    });
				}
				//if (p.southSpritBar == true) {
				//    $("<span class='layout_south_spritbar' id='southSp_" + p.id + "_bar'></span>").appendTo($('#southSp_' + p.id));
				//    $("<span class='left layout_up hand'></span>").click(function () {
				//        g.setUpDown('up');
				//    }).appendTo($('#southSp_' + p.id + '_bar'));
				//    $("<span class='right layout_down hand'></span>").click(function () {
				//        g.setUpDown('down');
				//    }).appendTo($('#southSp_' + p.id + '_bar'));
				//    p.centerHeight = g.c.height();
				//}
            }
        },
        fixLayout: function(_x, _y, direct){
            var sflag = false;
            if (direct == 'north') {
                var _nh = g.n.height()+p.borderWidth*(p.northBorder?2:0) + _y;
				p.northArea.minHeight = p.northArea.minHeight==null?20:p.northArea.minHeight;
				p.northArea.maxHeight = p.northArea.maxHeight==null?100:p.northArea.maxHeight;
                if (_nh < p.northArea.minHeight) {
                    p.nHeight = p.northArea.minHeight;
                    sflag = true;
                }
                else 
                    if (_nh > p.northArea.maxHeight) {
                        p.nHeight = p.northArea.maxHeight;
                        sflag = true;
                    }
                    else {
                        p.nHeight = _nh;
                    }
	            g._m_height = g.height - p.nHeight - p.sHeight - p.spritHeight * g._h_spritSize;//左中右高度div
	            g._m_top = p.nHeight + p.spritHeight * (p.northFlag == 2 ? 1 : 0);//左中右top
            	
                g.n.css({
                    'height': (p.nHeight-p.borderWidth*(p.northBorder?2:0))+"px"
                });
                if (sflag) {
                    g.northSp.css({
                        'top': p.nHeight + 'px'
                    });
                }
                if (g.e!=null) {
                    g.e.css({
                        'height': g._m_height-p.borderWidth * (p.eastBorder?2:0),
                        'top': g._m_top
                    });
                    g.eastSp.css({
                        'height': (g._m_height + p.borderWidth * (p.eastBorder?2:0)) + 'px',
                        'top': g._m_top
                    });
                }
                if (g.c!=null) {
                    g.c.css({
                        'height': g._m_height-p.borderWidth * (p.centerBorder?2:0),
                        'top': g._m_top
                    });
                }
                if (g.w!=null) {
                    g.w.css({
                        'height': g._m_height-p.borderWidth * (p.westBorder?2:0),
                        'top': g._m_top
                    });
                    g.westSp.css({
                        'height': (g._m_height + p.borderWidth * (p.westBorder?2:0)) + 'px',
                        'top': g._m_top
                    });
                }
            }
            else 
                if (direct == 'south') {
                    var _nh = g.s.height()+p.borderWidth*(p.southBorder?2:0) - _y;
					p.southArea.minHeight = p.southArea.minHeight==null?20:p.southArea.minHeight;
					p.southArea.maxHeight = p.southArea.maxHeight==null?100:p.southArea.maxHeight;
                    if (_nh < p.southArea.minHeight) {
                        p.sHeight = p.southArea.minHeight;
                        sflag = true;
                    }
                    else 
                        if (_nh > p.southArea.maxHeight) {
                             p.sHeight = p.southArea.maxHeight;
                            sflag = true;
                        }
                        else {
                            p.sHeight = _nh;
                        }
		            g._m_height = g.height - p.nHeight - p.sHeight - p.spritHeight * g._h_spritSize;//左中右高度div
		            g._m_top = p.nHeight + p.spritHeight * (p.northFlag == 2 ? 1 : 0);//左中右top
                    g.s.css({
                        'height': (p.sHeight - p.borderWidth*(p.southBorder?2:0))+ 'px',
                        'top': (g.height - p.sHeight) + 'px'
                    });
                    if (sflag) {
                        g.southSp.css({
                            'top': (g.height - p.sHeight - p.spritHeight) + 'px'
                        });
                    }
                    if (g.e!=null) {
                        g.e.css({
                            'height': (g._m_height-p.borderWidth*(p.eastBorder?2:0)) + 'px',
                            'top': g._m_top + 'px'
                        });
                        g.eastSp.css({
                            'height': (g._m_height + p.borderWidth * (p.eastBorder?2:0)) + 'px',
                            'top': g._m_top + 'px'
                        });
                    }
                    if (g.c!=null) {
                        g.c.css({
                            'height': g._m_height-p.borderWidth*(p.centerBorder?2:0),
                            'top': g._m_top
                        });
                    }
                    if (g.w!=null) {
                        g.w.css({
                            'height': g._m_height-p.borderWidth*(p.westBorder?2:0),
                            'top': g._m_top
                        });
                        g.westSp.css({
                            'height': (g._m_height + p.borderWidth * (p.westBorder?2:0)) + 'px',
                            'top': g._m_top
                        });
                    }
                }
                else 
                    if (direct == 'west') {
                        var _nh = g.w.width()+ p.borderWidth*(p.westBorder?2:0)+ _x;
						p.westArea.minWidth = p.westArea.minWidth==null?20:p.westArea.minWidth;
						p.westArea.maxWidth = p.westArea.maxWidth==null?250:p.westArea.maxWidth;
                        if (_nh < p.westArea.minWidth) {
							p.wWidth = p.westArea.minWidth;
							sflag = true;
						}else if (_nh > p.westArea.maxWidth) {
							p.wWidth = p.westArea.maxWidth;
							sflag = true;
						}else {
							p.wWidth = _nh;
						}
			            
			            g._c_width = g._100 - p.spritHeight * g._w_spritSize - p.eWidth - p.wWidth;//中 width
			            g._c_left = p.wWidth + p.spritHeight * (p.westFlag==2 ? 1 : 0);//中left
						
                        g.w.css({
                            'width': p.wWidth - p.borderWidth*(p.westBorder?2:0)
                        });
                        if (sflag) {
                            g.westSp.css({
                                'left': p.wWidth  + 'px'
                            });
                        }
                        g.c.css({
                            'width': (g._c_width-p.borderWidth*(p.centerBorder?2:0)) + 'px',
                            'left': g._c_left + 'px'
                        });
                    }
                    else 
                        if (direct == 'east') {
                            var _nh = g.e.width() + p.borderWidth * (p.eastBorder?2:0) - _x;
							p.eastArea.minWidth = p.eastArea.minWidth==null?20:p.eastArea.minWidth;
							p.eastArea.maxWidth = p.eastArea.maxWidth==null?250:p.eastArea.maxWidth;
                            if (_nh < p.eastArea.minWidth) {
                                p.eWidth = p.eastArea.minWidth;
                                sflag = true;
                            }
                            else 
                                if (_nh > p.eastArea.maxWidth) {
                                    p.eWidth = p.eastArea.maxWidth;
                                    sflag = true;
                                }
                                else {
                                    p.eWidth = _nh;
                                }
							
							 g._c_width = g._100 - p.spritHeight * g._w_spritSize - p.eWidth - p.wWidth;//中 width
			           		 g._c_left = p.wWidth + p.spritHeight * (p.westFlag==2 ? 1 : 0);//中left
			            
						
                            g.e.css({
                                'width': p.eWidth-p.borderWidth * (p.eastBorder?2:0),
                                'left': (g.width - p.eWidth) + 'px'
                            });
                            if (sflag) {
                                g.eastSp.css({
                                    'left': (g.width - p.eWidth - p.spritHeight) + 'px'
                                });
                            }
                            g.c.css({
                                'width': (g._c_width-p.borderWidth*(p.centerBorder?2:0)) + 'px',
                                'left': g._c_left + 'px'
                            });
                        }
            
        },
        dragStart: function(dragtype, e, obj, direct){
            if (dragtype == 'h') {
                var hgo = false;
                if (obj) {
                    hgo = true;
                    $('body').css('cursor', 'row-resize');
                }
                p.move = obj;
                this.hresize = {
                    t: parseInt(obj.style.top),
                    l: parseInt(obj.style.left),
                    sy: e.pageY,
                    sx: e.pageX,
                    hgo: hgo,
                    direct: direct
                };
            }
			//if(direct == 'south'){
			$("<div class='layout_mask'></div>").css({
				'position': 'absolute',
				'background':'#ffffff',
				'width':$('#'+p.id).width()+'px',
				'height':$('#'+p.id).height()+'px',
				'z-index':2,
				'top':0,
				'left':0,
				'-moz-opacity': 0.0,
				'opacity': 0.0	
			}).prependTo($('body'));
			//}
            $('body').noSelect();
        },
        dragMove: function(e){
            if (this.hresize) {
                var v = this.hresize;
                var y = e.pageY;
                var diff = y - v.sy;
                if (v.hgo) {
                    var x = e.pageX;
                    this.hresize.xdiff = x - v.sx;
                    this.hresize.ydiff = y - v.sy;
                    if (this.hresize.direct == 'north' || this.hresize.direct == 'south') {
                        $(p.move).css({
                            'top': v.t + this.hresize.ydiff
                        });
                    }
                    else {
                        $(p.move).css({
                            'left': v.l + this.hresize.xdiff
                        });
                    }
                }
                v = null;
            }
            
        },
        dragEnd: function(){
            if (this.hresize) {
                this.fixLayout(this.hresize.xdiff, this.hresize.ydiff, this.hresize.direct);
                p.setCallFun({ offsetX: this.hresize.xdiff, offsetY: this.hresize.ydiff });
                this.hresize = false;
            }
            p.move = null;
			
			var layout_mask = $('.layout_mask');
			if(layout_mask.size()>0){
				layout_mask.remove();
			}
			
            $('body').css('cursor', 'default');
            $('body').noSelect(false);
        }
    }
    //var s = new Date().getTime();
	if(p.isFixLayout){
	    $('html').css({
	        'height': '100%',
	        'overflow': 'hidden'
	    });
	    $('body').css({
	        'height': '100%',
	        'overflow': 'hidden',
	        'padding': '0px',
	        'margin': '0px',
	        'border': '0px'
	    });
	}
    g.main = $('#' + p.id);
    g.main.css({
        'overflow': 'hidden',
        'position': 'relative',
        'padding': '0px',
        'margin': '0px',
        'border': '0px'
    });
	if(p.isFixLayout){
		g.main.css({'height': '100%'});
	}
    g.n = p.northArea == null?null:$('#'+p.northArea.id, g.main);
	g.e = p.eastArea == null?null:$('#'+p.eastArea.id, g.main);
	g.c = p.centerArea == null?null:$('#'+p.centerArea.id, g.main);
	g.w = p.westArea == null?null:$('#'+p.westArea.id, g.main);
	g.s = p.southArea == null?null:$('#'+p.southArea.id, g.main);
    
    g._h_spritSize = 0;
	p.northFlag = 0;//没有north
	p.nHeight = 0;
	p.northBorder = false;
	if(p.northArea!=null){
		p.nHeight = p.northArea.height==null?50:p.northArea.height;
		p.northFlag = 1;//有north但是没有sprit
		if(p.northArea.sprit==null || p.northArea.sprit==true){
			g._h_spritSize+=1;
			p.northFlag = 2;//有区域有sprit
		}
		if (p.northArea.border == null || p.northArea.border == true) {
			p.northBorder = true;
		}
		
	}
	p.southFlag = 0;//没有south
	p.sHeight = 0;
	p.southBorder = false;
	if(p.southArea!=null){
	    //p.southSpritBar = p.southArea.spritBar;
	    //if (p.southSpritBar == true) {
	    //    p.southArea.sprit = true;
	    //}
		p.sHeight = p.southArea.height==null?50:p.southArea.height;
		p.southFlag = 1;
		if(p.southArea.sprit==null || p.southArea.sprit==true){
			g._h_spritSize+=1;
			p.southFlag = 2;
		}
		if (p.southArea.border == null || p.southArea.border == true) {
			p.southBorder = true;
		}
	}
    g._w_spritSize = 0;
	p.eastFlag = 0;//没有east
	p.eWidth = 0;
	p.eastBorder = false;
	if(p.eastArea!=null){
		p.eWidth = p.eastArea.width==null?200:p.eastArea.width;
		p.eastFlag = 1;
		if(p.eastArea.sprit==null || p.eastArea.sprit==true){
			g._w_spritSize+=1;
			p.eastFlag = 2;
		}
		if (p.eastArea.border == null || p.eastArea.border == true) {
			p.eastBorder = true;
		}
	}
	p.westFlag = 0;//没有west
	p.wWidth = 0;
	p.westBorder = false;
	if(p.westArea!=null){
		p.wWidth = p.westArea.width==null?200:p.westArea.width;
		p.westFlag = 1;
		if(p.westArea.sprit==null || p.westArea.sprit==true){
			g._w_spritSize+=1;
			p.westFlag = 2;
		}
		if(p.westArea.border==null || p.westArea.border==true){
			p.westBorder = true;
		}
	}
	
	
	p.centerBorder = false;
	if(p.centerArea!=null){
		if(p.centerArea.border!=null && p.centerArea.border==true){
			p.centerBorder = true;
		}
	}
    g.init();
	
	if(p.successFn!=null){
		p.successFn();
	}
	
    this.params = p;//注册参数
	this.methods  = g;//注册方法
	
    //add document events
    $(document).mousemove(function(e){
        g.dragMove(e)
    }).mouseup(function(e){
        g.dragEnd()
    }).hover(function () {

    }, function(){
        g.dragEnd()
    });
	$(window).resize(function(){
	  g.init();
	});
    //var e = new Date().getTime();
    //alert(e-s)
}
MxtLayout.prototype.setEast = function(_width){
	if(_width == undefined){return;}
	var p = this.params;
	var g = this.methods;
	if (g.e) {
	    var _e_w = parseInt(g.e.width());
	    var _e_l = parseInt(g.e.css('left'));
	    var _sub = _e_w - _width;
	    g.e.width(_width);
	    p.eWidth = _width;
	    var _l_n = _e_l + _sub;
	    g.e.css({ 'left': _l_n });
	}
	
	if (g.eastSp) {
	    var _e_sp_l = parseInt(g.eastSp.css('left'));
	    var _e_sp_l_n = _e_sp_l+_sub;
	    g.eastSp.css({ 'left': _e_sp_l_n });
    }
	
	if (g.c) {
	    var _c_w = parseInt(g.c.width());
	    var _c_w_n = _c_w + _sub;
	    g.c.width(_c_w_n);
	}
	p.setCallFun({ offsetX: _sub });
}
MxtLayout.prototype.setWest = function(_width){
	if(_width == undefined){return;}
	var p = this.params;
	var g = this.methods;
	
	if (g.w) {
	    this._clearScroll({
	        obj: g.w,
	        mode: "hidden"
	    });
	    var _w_w = parseInt(g.w.width());
	    var _sub = _w_w - _width;
	    g.w.width(_width);
	    p.wWidth = _width;
	    this._clearScroll({
	        obj: g.w,
	        mode: "show"
	    });
	}
	
	if (g.westSp) {
	    var _w_sp_l = parseInt(g.westSp.css('left'));
	    var _w_sp_l_n = _w_sp_l - _sub;
	    g.westSp.css({ 'left': _w_sp_l_n });
	}
	
	if (g.c) {
	    var _c_w = parseInt(g.c.width());
	    var _c_w_n = _c_w+_sub;
	    var _c_l = parseInt(g.c.css('left'));
	    var _c_l_n = _c_l-_sub;
	    g.c.width(_c_w_n);
	    g.c.css({'left':_c_l_n});
	}
	p.setCallFun({ offsetX: _sub });
}
MxtLayout.prototype.setSouth = function(_height){
	if(_height == undefined){return;}
	var p = this.params;
	var g = this.methods;
	
	if (g.s) {
	    var _s_h = parseInt(g.s.height());
	    var _s_t = parseInt(g.s.css('top'));
	    var _sub = _s_h - _height;
	    var _s_t_n = _s_t + _sub;
	    g.s.height(_height);
	    p.sHeight = _height;
	    g.s.css({ 'top': _s_t_n });
	}
	
	if (g.southSp) {
	    var _s_sp_t = parseInt(g.southSp.css('top'));
	    var _s_sp_t_n = _s_sp_t + _sub;
	    g.southSp.css({ 'top': _s_sp_t_n });
	}
	
	if (g.c) {
	    var _c_h = parseInt(g.c.height());
	    var _c_h_n = _c_h + _sub;
	    g.c.height(_c_h_n);
	}

	if (g.w) {
	    var _w_h = parseInt(g.w.height());
	    var _w_h_n = _w_h + _sub;
	    g.w.height(_w_h_n);
	}
	
	if (g.e) {
	    var _e_h = parseInt(g.e.height());
	    var _e_h_n = _e_h + _sub;
	    g.e.height(_e_h_n);
	}
	
	if (g.westSp) {
	    var _w_sp_h = parseInt(g.westSp.height());
	    var _w_sp_h_n = _w_sp_h + _sub;
	    g.westSp.css({ 'height': _w_sp_h_n });
	}

	if (g.eastSp) {
	    var _e_sp_h = parseInt(g.eastSp.height());
	    var _e_sp_h_n = _e_sp_h + _sub;
	    g.eastSp.css({ 'height': _e_sp_h_n });
	}
	p.setCallFun({ offsetY: _sub });
}
MxtLayout.prototype.setNorth = function(_height){
	if(_height == undefined){return;}
	var p = this.params;
	var g = this.methods;
	
	if (g.n) {
	    var _n_h = g.n.height();
	    var _sub = _n_h - _height;
	    g.n.height(_height);
	    p.nHeight = _height;
	}

	if (g.northSp) {
	    var _n_sp_t = parseInt(g.northSp.css('top'));
	    var _n_sp_t_n = _n_sp_t - _sub;
	    g.northSp.css({ 'top': _n_sp_t_n });
	}

	if (g.c) {
	    var _c_h = g.c.height();
	    var _c_h_n = _c_h + _sub;
	    g.c.height(_c_h_n);
	}

	if (g.c) {
	    var _c_t = parseInt(g.c.css('top'));
	    var _c_t_n = _c_t - _sub;
	    g.c.css({ 'top': _c_t_n });
	}
	
	if (g.w) {
	    var _w_h = g.w.height();
	    var _w_t = parseInt(g.w.css('top'));
	    var _w_h_n = _w_h + _sub;
	    var _w_t_n = _w_t - _sub;
	    g.w.height(_w_h_n);
	    g.w.css({ 'top': _w_t_n });
	}

	if (g.westSp) {
	    var _w_sp_h = g.westSp.height();
	    var _w_sp_t = parseInt(g.westSp.css('top'));
	    var _w_sp_h_n = _w_sp_h + _sub;
	    var _w_sp_t_n = _w_sp_t - _sub;
	    g.westSp.height(_w_sp_h_n);
	    g.westSp.css({ 'top': _w_sp_t_n });
	}

	if (g.e) {
	    var _e_h = g.e.height();
	    var _e_t = parseInt(g.e.css('top'));
	    var _e_h_n = _e_h + _sub;
	    var _e_t_n = _e_t - _sub;
	    g.e.height(_e_h_n);
	    g.e.css({ 'top': _e_t_n });
	}
	
	if (g.eastSp) {
	    var _e_sp_h = g.eastSp.height();
	    var _e_sp_t = parseInt(g.eastSp.css('top'));
	    var _e_sp_h_n = _e_sp_h + _sub;
	    var _e_sp_t_n = _e_sp_t - _sub;
	    g.eastSp.height(_e_sp_h_n);
	    g.eastSp.css({ 'top': _e_sp_t_n });
	}
	p.setCallFun({ offsetY: _sub });
}

//获取 宽度|高度
MxtLayout.prototype.getNorthHeight = function(){
    var p = this.params;
    return p.nHeight;
}
MxtLayout.prototype.getSouthHeight = function(){
    var p = this.params;
    return p.sHeight;
}
MxtLayout.prototype.getWestWidth = function(){
    var p = this.params;
    return p.wWidth;
}
MxtLayout.prototype.getEastWidth = function(){
    var p = this.params;
    return p.eWidth;
}


//有滚动条导致计算错误
MxtLayout.prototype._clearScroll = function (j) {
    if (j.mode == "hidden") {
        j.obj.css("overflow", "hidden");
    } else {
        j.obj.css("overflow", "");
    }
}

MxtLayout.prototype.setEastSp = function (b) {
    var p = this.params;
    var g = this.methods;
    if (b) {
        p.eastFlag = 2;
    } else {
        p.eastFlag = 1;
    }
    g.init();
}
MxtLayout.prototype.setWestSp = function (b) {
    var p = this.params;
    var g = this.methods;
    if (b) {
        p.westFlag = 2;
    } else {
        p.westFlag = 1;
    }
    g.init();
}
MxtLayout.prototype.setSouthSp = function (b) {
    var p = this.params;
    var g = this.methods;
    if (b) {
        p.southFlag = 2;
    } else {
        p.southFlag = 1;
    }
    g.init();
}
MxtLayout.prototype.setNorthSp = function (b) {
    var p = this.params;
    var g = this.methods;
    if (b) {
        p.northFlag = 2;
    } else {
        p.northFlag = 1;
    }
    g.init();
}

function MxtLayoutIe6(options){
    this.init();
}
MxtLayoutIe6.prototype.init = function(){
	this.layout = $('.stadic_layout');
	if(this.layout.length == 0){return;}
	this.type=""
	this.layout_head = $('.stadic_layout_head');
	if(this.layout_head.length != 0){this.type+='h'}
	
	this.layout_body = $('.stadic_layout_body');
	if(this.layout_body.length != 0){this.type+='_b'}
	
	this.layout_footer = $('.stadic_layout_footer');
	if(this.layout_footer.length != 0){this.type+='_f'}
	
	this.layout_left = $('.stadic_layout_left');
	if(this.layout_left.length != 0){this.type+='_l'}
	
	this.layout_right = $('.stadic_layout_right');
	if(this.layout_right.length != 0){this.type+='_r'}
	
	
    this.layoutBorder = this.layout.eq(0);
	this.layoutBorder.css('overflow','hidden');
    this.height = $(this.layoutBorder).height();
    this.width = $(this.layoutBorder).width();
	if($('html')[0].style.height != '100%'){
		if(this.layoutBorder.parent()[0].tagName == 'BODY'){
		    $('html').css({
		        'height': '100%',
		        'overflow': 'hidden'
		    });
		    $('body').css({
		        'height': '100%',
		        'overflow': 'hidden',
		        'padding': '0px',
		        'margin': '0px',
		        'border': '0px'
		    });
		    this.height = $(this.layoutBorder).height();
		    this.width = $(this.layoutBorder).width();
		}else{
			this.height = $(this.layoutBorder).parent().height();
		    this.width = $(this.layoutBorder).parent().width();
		}
	}
	
	
//    //左右布局初始化
//    if (this.type == 'l_r') {
//        $('.left').eq(0).height(this.height);
//        $('.right').eq(0).height(this.height);
//    }
//    //上-左(小)-右
//    if (this.type == 'h_minl_r') {
//        this.header = $('.layout_head').eq(0);
//        this.height = this.height - this.header.height();
//        $('.left').eq(0).height(this.height);
//        $('.right').eq(0).height(this.height);
//    }
    //上，中
    if (this.type == 'h_b') {
        this.header = this.layout_head.eq(0);
        this.height = this.height - this.header.height();
        this.layout_body.eq(0).height(this.height);
    }
    //上中下
    if (this.type == 'h_b_f') {
        this.header = this.layout_head.eq(0);
        this.footer = this.layout_footer.eq(0);
        this.height = this.height - this.header.height() - this.footer.height();
        this.layout_body.eq(0).height(this.height);
    }
}
$(document).ready(function(){	
    if ($.browser.msie) {
        if ($.browser.version == '6.0') {
            new MxtLayoutIe6();
        }
    }
});
(function($){
	$.extend({
		init_stadic_layout:function(){
		    $('html').css({
		        'height': '100%',
		        'overflow': 'hidden'
		    });
		    $('body').css({
		        'height': '100%',
		        'overflow': 'hidden',
		        'padding': '0px',
		        'margin': '0px',
		        'border': '0px'
		    });
		}
	});
    $.fn.noSelect = function(p){ //no select plugin by me :-)
        var prevent = (p == null) ? true : p;
        if (prevent) {
            return this.each(function(){
                if ($.browser.msie || $.browser.safari) 
                    $(this).bind('selectstart', function(){
                        return false;
                    });
                else 
                    if ($.browser.mozilla) {
                        $(this).css('MozUserSelect', 'none');
                        $('body').trigger('focus');
                    }
                    else 
                        if ($.browser.opera) 
                            $(this).bind('mousedown', function(){
                                return false;
                            });
                        else 
                            $(this).attr('unselectable', 'on');
            });
        }
        else {
            return this.each(function(){
                if ($.browser.msie || $.browser.safari) 
                    $(this).unbind('selectstart');
                else 
                    if ($.browser.mozilla) 
                        $(this).css('MozUserSelect', 'inherit');
                    else 
                        if ($.browser.opera) 
                            $(this).unbind('mousedown');
                        else 
                            $(this).removeAttr('unselectable', 'on');
            });
        }
    }; //end noSelect
})(jQuery);
