/// <reference path="../scriptes/jquery.js" />
/**
 * @author macj
 */
/*
 * Flexigrid for jQuery - v1.1
 * 
 * Copyright (c) 2008 Paulo P. Marinas (code.google.com/p/flexigrid/) Dual
 * licensed under the MIT or GPL Version 2 licenses. http://jquery.org/license
 * 
 */
(function ($) {
    $.addFlex = function (t, p) {
        // var startTime = new Date().getTime();
        if (t.grid) 
            return t; // return if already exist
        var initFlag = true;
        var pageSize = ($.ctx && $.ctx._pageSize)?$.ctx._pageSize:20;
        p = $.extend({ // apply default properties
            id: Math.floor(Math.random() * 100000000) + '_grid',
            height: 200, // default height
            width: 'auto', // auto width
            striped: true, // apply odd even stripes
            novstripe: false,
            minwidth: 30, // min width of columns
            minheight: 0, // min height of columns
            resizable: true, // allow table resizing
            method: 'POST', // data sending method
            errormsg: 'Connection Error',
            usepager: true,// 分页
            nowrap: true,
            page: 1, // current page
            total: 1, // total pages
            useRp: true, // use the results per page select box   change input 
			useRpInput: true, // use the results per page select box   change input 
            rp: pageSize, // results per page
            rpMaxSize: 200, // results per page
            rpOptions: [10, 20,30,40,50,100,150,200], // allowed per-page values
            title: false,
            idProperty: 'id',
            pagestat: 'Displaying {from} to {to} of {total} items',
            pagetext: $.i18n('validate.grid.over_page6.js'),//第
            outof: $.i18n('validate.grid.over_page5.js'),//页
            findtext: 'Find ' + $.i18n('validate.grid.over_page5.js'),
            params: {}, // allow optional parameters to be passed around
            procmsg: 'Processing, please wait ...',
            query: '',
            qtype: '',
            nomsg: 'No items',
            minColToggle: 1, // minimum allowed column to be hidden
            showToggleBtn: true, // show or hide column toggle popup
            hideOnSubmit: true,
            autoload: true,
            blockOpacity: 0.5,
            preProcess: false,
            addTitleToCell: false, // add a title attr to cells with truncated
            // contents
            dblClickResize: false, // auto resize column by double clicking
            onDragCol: false,
            onToggleCol: false,
            onChangeSort: false,
            onCurrentPageSort:true,//是否只对当前页的数据进行排序
            onSuccess: false,
			onNoDataSuccess: false,
            onError: false,
            onSubmit: false, // using a custom populate function,
            datas: null,
            click: null,
            dblclick: null,
            render: null,
			callBackTotle:null,
			singleSelect:true,
            managerName: null,
            managerMethod: null,
            isEscapeHTML:true,
            heightSubtract:0,//总体高度减去的值-左右结构toolbar高度
            customize: true,//是否支持个性化信息自动存储，默认支持
            vChangeParam: {
                'changeTar': 'grid_detail',
                overflow: "auto",
                'subHeight': 0,
				'position':'static',
				autoResize:true
            },// 三个参数必须同时存在--拖动下方条更改列表高度，顺带而改变的对象[parentId:父div,changeTar:更改对象,subHeight:自定义减去的高度]{'parentId':'center','changeTar':'form_area','subHeight':90}
            vChange: false,// 三个参数必须同时存在--拖动右方条更改列表宽度，顺带而改变的对象[parentId:父div,changeTar:更改对象,subWidth:自定义减去的宽度]{'parentId':'center','changeTar':'form_area','subWidth':10}
            isHaveIframe: false,//如果detail下部包含iframe，则拖动更改不好拖拽
            hChangeParam: {
                'subHeight': 55
            },
            hChange: false,
            parentId: null,// 用来获取grid的高度，使grid高度自适应
            slideToggleBtn: false, //上下伸缩按钮
			UMD:'down',
            slideToggleUpHandle: function () {
				if(p.UMD == 'down'){
					p.UMD = 'middle';
				}else if(p.UMD == 'middle'){
					 p.UMD = 'up';
				}else if(p.UMD == 'up'){
					g.resizeGridUpDown(p.UMD)
				}
				g.resizeGridUpDown(p.UMD)
            },
            slideToggleDownHandle: function () {
				if(p.UMD == 'down'){
					g.resizeGridUpDown(p.UMD)
				}else if(p.UMD == 'middle'){
					p.UMD='down';
				}else if(p.UMD == 'up'){
					 p.UMD='middle';
				}
				g.resizeGridUpDown(p.UMD)
            },
			dataTable:false
        }, p);
		if(p.vChangeParam.changeTar == undefined){
			p.vChangeParam.changeTar = 'grid_detail';
		}
		if(p.vChangeParam.overflow == undefined){
			p.vChangeParam.overflow = 'auto';
		}
		if(p.vChangeParam.subHeight == undefined){
			p.vChangeParam.subHeight = 0;
		}
		if(p.vChangeParam.autoResize == undefined){
			p.vChangeParam.autoResize = true;
		}
        $(t).show() // show if hidden
        .attr({
            cellPadding: 0,
            cellSpacing: 0,
            border: 0
        }) // remove padding and spacing
        .removeAttr('width'); // remove width properties
        p.gridClassName = p.id + '_classtag';// 添加class--点击表头的复选框不能绑定事件,只能通过onclick的方式[表头]<div
        // type="checkbox"
        // onclick="getGridSetAllCheckBoxSelect123456(this,'flexme3')">[列]<input
        // type="checkbox" value="10006"
        // gridrowcheckbox="flexme3">
        // create grid class
        var timer = null;
        var g = {
            hset: {},
            rePosDrag: function () {
                var hsl = this.hDiv.scrollLeft, cdleft = 0 - hsl;
                if (hsl > 0)
                    cdleft -= Math.floor(p.cgwidth / 2);
                $(g.cDrag).css({
                    top: g.hDiv.offsetTop + 1
                });
                var cdpad = this.cdpad;
                $('div', g.cDrag).hide();
                var arr = $('thead tr:first th:visible', this.hDiv);
                arr.each(function () {
                    var n = arr.index(this);
                    var cdpos = parseInt($('div', this).width());
                    if (cdleft == 0)
                        cdleft -= Math.floor(p.cgwidth / 2);
                    cdpos = cdpos + cdleft + cdpad;
                    if (isNaN(cdpos)) {
                        cdpos = 0;
                    }
                    $('div:eq(' + n + ')', g.cDrag).css({
                        'left': cdpos + 'px'
                    }).show();
                    cdleft = cdpos;
                });
            },
            fixHeight: function (newH) {
                newH = false;
                if (!newH)
                    newH = $(g.bDiv).height();
                var hdHeight = $(this.hDiv).height();
                $('div', this.cDrag).each(function () {
                    $(this).height(newH + hdHeight);
                });
                var nd = parseInt($(g.nDiv).height());
                if (nd > newH)
                    $(g.nDiv).height(newH).width(200);
                else
                    $(g.nDiv).height('auto').width('auto');
                $(g.block).css({
                    height: newH,
                    marginBottom: (newH * -1)
                });
                var hrH = g.bDiv.offsetTop + newH;
                if (p.height != 'auto' && p.resizable)
                    hrH = g.vDiv.offsetTop;
                $(g.rDiv).css({
                    height: hrH
                });

                if (p.vChange) {
                    var tt = $('#' + p.vChangeParam.changeTar);
                    if (tt.length > 0) {
                        var h = $(g.gDiv).parent().height();
                        $('#' + p.vChangeParam.changeTar).css('overflow', p.vChangeParam.overflow).height(
                            h - $(g.gDiv).height() - p.vChangeParam.subHeight);
                    }
                }
            },
            saveCustomize: function () {
                if(p.customize) {
                  var ck = p.customId;
                  if(ck) {
                      var _cols = $('th',g.hDiv);
                      var _modes = {};
                      _cols.each(function(){
                        var $t = $(this), _colmodes = $t.attr('colmode'), v = $t.is(":visible");
                        if(_colmodes && _colmodes != '') {
	                        $.each( p.colModel, function(i, n){
	                          if(n.name == _colmodes){
	                            _modes[n.name] = v ? 1 : 0;
	                          }
	                        });
                        }
                      });

                      var upm = new ctpUserPreferenceManager();
                      upm.saveGridPreference(ck, _modes, {success:function(){}});
                  }
                }
            },
            dragStart: function (dragtype, e, obj) { // default drag function start
                if (dragtype == 'colresize') {// column resize
                    $(g.nDiv).hide();
                    $(g.nBtn).hide();
                    var n = $('div', this.cDrag).index(obj);
                    var ow = $('th:visible div:eq(' + n + ')', this.hDiv).width();
                    $(obj).addClass('dragging').siblings().hide();
                    $(obj).prev().addClass('dragging').show();
                    this.colresize = {
                        startX: e.pageX,
                        ol: parseInt(obj.style.left),
                        ow: ow,
                        n: n
                    };
                    $('body').css('cursor', 'col-resize');
                } else if (dragtype == 'vresize') {// table resize
                    var hgo = false;
                    $('body').css('cursor', 'row-resize');
                    if (obj) {
                        hgo = true;
                        $('body').css('cursor', 'col-resize');
                    }
                    p.height = $(g.bDiv).height();// 重新获取高度,如果点击行，重新设置grid高度，再拖动下面的工具条更改grig高度的时候需要重新获取高度--div
                    if (p.vChange == true && p.isHaveIframe == true) {
                        var gridDetail = $('#' + p.vChangeParam.changeTar);
                        gridDetail.css({
                            'position': 'relative'
                        });
                        $("<div class='grid_mask'></div>").css({
                            'position': 'absolute',
                            'background': 'red',
                            'top': 0,
                            'left': 0,
                            'width': gridDetail.width() + 'px',
                            'height': gridDetail.height() + 'px',
                            'z-index': 20,
                            '-moz-opacity': 0.0,
                            'opacity': 0.0
                        }).appendTo(gridDetail);
                    }
                    this.vresize = {
                        h: p.height,
                        sy: e.pageY,
                        w: p.width,
                        sx: e.pageX,
                        hgo: hgo
                    };
                } else if (dragtype == 'colMove') {// column header drag
                    $(g.nDiv).hide();
                    $(g.nBtn).hide();
                    this.hset = $(this.hDiv).offset();
                    this.hset.right = this.hset.left + $('table', this.hDiv).width();
                    this.hset.bottom = this.hset.top + $('table', this.hDiv).height();
                    this.dcol = obj;
                    this.dcoln = $('th', this.hDiv).index(obj);
                    this.colCopy = document.createElement("div");
                    this.colCopy.className = "colCopy";
                    this.colCopy.innerHTML = obj.innerHTML;
                    if ($.browser.msie) {
                        this.colCopy.className = "colCopy ie";
                    }
                    $(this.colCopy).css({
                        "position": "absolute",
                        "float": "left",
                        "display": "none",
                        "textAlign": obj.align
                    });
                    $('body').append(this.colCopy);
                    $(this.cDrag).hide();
                }
                $('body').noSelect();
            },
            dragMove: function (e) {
                if (this.colresize) {// column resize
                    var n = this.colresize.n;
                    var diff = e.pageX - this.colresize.startX;
                    var nleft = this.colresize.ol + diff;
                    var nw = this.colresize.ow + diff;
                    if (nw > p.minwidth) {
                        $('div:eq(' + n + ')', this.cDrag).css('left', nleft);
                        this.colresize.nw = nw;
                    }
                } else if (this.vresize) {// table resize
                    var v = this.vresize;
                    var y = e.pageY;
                    var diff = y - v.sy;
                    if (!p.defwidth)
                        p.defwidth = p.width;
                    if (p.width != 'auto' && !p.nohresize && v.hgo) {
                        var x = e.pageX;
                        var xdiff = x - v.sx;
                        var newW = v.w + xdiff;
                        if (newW > p.defwidth) {
                            this.gDiv.style.width = newW + 'px';
                            p.width = newW;
                        }
                    }
                    var newH = v.h + diff;
                    if ((newH > p.minheight || p.height < p.minheight) && !v.hgo) {
                        this.bDiv.style.height = newH + 'px';
                        p.height = newH;
                        this.fixHeight(newH);
                    }
                    v = null;
                } else if (this.colCopy) {
                    $(this.dcol).addClass('thMove').removeClass('thOver');
                    if (e.pageX > this.hset.right || e.pageX < this.hset.left
                        || e.pageY > this.hset.bottom || e.pageY < this.hset.top) {
                        // this.dragEnd();
                        $('body').css('cursor', 'move');
                    } else {
                        $('body').css('cursor', 'pointer');
                    }
                    $(this.colCopy).css({
                        top: e.pageY + 10,
                        left: e.pageX + 20,
                        display: 'block'
                    });
                }
            },
            dragEnd: function () {
                if (this.colresize) {
                    var n = this.colresize.n;
                    var nw = this.colresize.nw;
                    $('th:visible div:eq(' + n + ')', this.hDiv).css('width', nw);
                    $('tr', this.bDiv).each(function () {
                        var $tdDiv = $('td:visible div:eq(' + n + ')', this);
                        $tdDiv.css('width', nw);
                        g.addTitleToCell($tdDiv);
                    });
                    this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                    $('div:eq(' + n + ')', this.cDrag).siblings().show();
                    $('.dragging', this.cDrag).removeClass('dragging');
                    this.rePosDrag();
                    this.fixHeight();
                    this.colresize = false;
                    var name = p.colModel[n].name; // Store the widths in the cookies
                } else if (this.vresize) {
                    this.vresize = false;
                    if (p.vChange == true && p.isHaveIframe == true) {
                        var gridDetail = $('#' + p.vChangeParam.changeTar);
						var _position = p.vChangeParam.position;
                        gridDetail.css({
                            'position': _position
                        });
                        var grid_mask = $('.grid_mask');
                        if (grid_mask.size() > 0) {
                            grid_mask.remove();
                        }
                    }
                } else if (this.colCopy) {
                    $(this.colCopy).remove();
                    if (this.dcolt != null) {
                        if (this.dcoln > this.dcolt)
                            $('th:eq(' + this.dcolt + ')', this.hDiv).before(this.dcol);
                        else
                            $('th:eq(' + this.dcolt + ')', this.hDiv).after(this.dcol);
                        this.switchCol(this.dcoln, this.dcolt);
                        $(this.cdropleft).remove();
                        $(this.cdropright).remove();
                        this.rePosDrag();
                        if (p.onDragCol) {
                            p.onDragCol(this.dcoln, this.dcolt);
                        }
                    }
                    this.dcol = null;
                    this.hset = null;
                    this.dcoln = null;
                    this.dcolt = null;
                    this.colCopy = null;
                    $('.thMove', this.hDiv).removeClass('thMove');
                    $(this.cDrag).show();
					
                    var _cols = $('th',g.hDiv);
                    var _modes = [];
                    _cols.each(function(){
                      var _colmodes = $(this).attr('colmode');
                      
                      $.each( p.colModel, function(i, n){
                        if(n.name == _colmodes){
                          _modes.push(n);
                        }
                      });
                    });
                    p.colModel = _modes;
                    this.saveCustomize();
                }
                $('body').css('cursor', 'default');
                $('body').noSelect(false);
            },
            toggleCol: function (cid, visible) {
                var ncol = $("th[axis='col" + cid + "']", this.hDiv)[0];
                var n = $('thead th', g.hDiv).index(ncol);
                var cb = $('input[value=' + cid + ']', g.nDiv)[0];
                if (visible == null) {
                    visible = ncol.hidden;
                }
                if ($('input:checked', g.nDiv).length < p.minColToggle && !visible) {
                    return false;
                }
                if (visible) {
                    ncol.hidden = false;
                    $(ncol).show();
                    cb.checked = true;
                } else {
                    ncol.hidden = true;
                    $(ncol).hide();
                    cb.checked = false;
                }
                $('tbody tr', t).each(function () {
                    if (visible) {
                        $('td:eq(' + n + ')', this).show();
                    } else {
                        $('td:eq(' + n + ')', this).hide();
                    }
                });
                this.rePosDrag();
                if (p.onToggleCol) {
                    p.onToggleCol(cid, visible);
                }
                this.saveCustomize();
                return visible;
            },
            switchCol: function (cdrag, cdrop) { // switch columns
                $('tbody tr', t).each(
                    function () {
                        if (cdrag > cdrop)
                            $('td:eq(' + cdrop + ')', this).before(
                                $('td:eq(' + cdrag + ')', this));
                        else
                            $('td:eq(' + cdrop + ')', this).after(
                                $('td:eq(' + cdrag + ')', this));
                    });
                // switch order in nDiv
                if (cdrag > cdrop) {
                    $('tr:eq(' + cdrop + ')', this.nDiv).before(
                        $('tr:eq(' + cdrag + ')', this.nDiv));
                } else {
                    $('tr:eq(' + cdrop + ')', this.nDiv).after(
                        $('tr:eq(' + cdrag + ')', this.nDiv));
                }
                if ($.browser.msie && $.browser.version < 7.0) {
                    $('tr:eq(' + cdrop + ') input', this.nDiv)[0].checked = true;
                }
                this.hDiv.scrollLeft = this.bDiv.scrollLeft;
            },
            scroll: function () {
                this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                this.rePosDrag();
            },
            //日程列表添加树形结构
            addNewData:function(data,parentId){
                data = $.extend({
                    rows: [],
                    page: 0,
                    total: 0
                }, data);
                if (p.preProcess) {
                    data = p.preProcess(data);
                }
                $('.pReload', this.pDiv).removeClass('loading');
                this.loading = false;
                if (!data) {
                    $('.pPageStat', this.pDiv).html(p.errormsg);
                    return false;
                }

                if(data.params)
                  p.params = data.params;
                    
                tbody=$("#list");
                
                var ttr = document.createElement('tr'), cc = 0;
                $('thead tr:first th', g.hDiv)
                    .each(
                        // create template tr
                        function () {
                            var th = $(this), td = document.createElement('td'), tdDiv = document
                                .createElement('div');
                            var idx = th.attr('axis').substr(3);
                            td.align = this.align;
                            if (p.sortname == th.attr('abbr') && p.sortname) {
                                td.className = 'sorted';
                            }
                            $(tdDiv).css({
                                textAlign: th[0].align,
                                width: $('div:first', th)[0].style.width
                            });
                            if (this.hidden) {
                                $(td).css('display', 'none');
                            }
                            if (p.nowrap == false) {
                                $(tdDiv).css('white-space', 'normal');
                            }
                            if (p.colModel[cc].codecfg) {
                                $(tdDiv).attr("codecfg", p.colModel[cc].codecfg).addClass(
                                    "codecfg");
                            }

                            $(td).append(tdDiv);
                            $(td).attr('abbr', th.attr('abbr'));
                            $(ttr).append(td);
                            td = null;
                            cc++;
                        });

                $.each(data.rows, function (i, row) {
                    var ctr = $(ttr).clone();
                    tr = ctr[0];

                    if (row.name)
                        tr.name = row.name;
                    if (row.color) {
                        $(tr).css('background', row.color);
                    } else {
                        if (i % 2 && p.striped)
                            tr.className = 'erow';
                    }
                    if(row.ishidden){
                        $(tr).addClass("hidden");
                    }
                    if(row.disable)
                        $(tr).addClass("graytr");
                    if (row[p.idProperty]) {
                        tr.id = 'row' + row[p.idProperty];
                    }
                    var ctrc = ctr.children();
                    for (var j = 0; j < cc; j++) {
                        var td = ctrc[j], tdiv = $(td).children()[0], divd,  clm = p.colModel[j];
                        // If each row is the object itself (no 'cell' key)
                        if (typeof row.cell == 'undefined') {
                            divd = row[clm.name];
                            if(divd && typeof divd == 'string' && p.isEscapeHTML){
                                divd = divd.escapeHTML(true,false);
                            }
                        } else {
                            // If the json elements aren't named (which is typical), use
                            // numeric order
                            if (typeof row.cell[j] != "undefined") {
                                divd = (row.cell[j] != null) ? row.cell[j] : '';// null-check
                            } else {
                                divd = row.cell[clm.name];
                            }
                        }
                        if(divd && clm.cutsize)
                          divd = divd.substring(0, clm.cutsize);
                        if (clm.type == 'checkbox') {
                            divd = "<input type=\"checkbox\" gridRowCheckBox=\""
                                + p.gridClassName + "\" class='noClick' row=\"" + i + "\" value=\"" + divd + "\"/>";
                        } else if (clm.type == 'radio') {
                            divd = "<input type=\"radio\" gridRowCheckBox=\""
                              + p.gridClassName + "\" class='noClick' row=\"" + i + "\" value=\"" + divd + "\" name=\"gridradio\"/>";
                        } else if (p.render) {
                            var mj = p._modesMap ? p._modesMap[j] : j;
                            divd = p.render(divd, row, i, mj, clm);
                        }
                        // resolve the bug of IE9, that will consider 0 equals ''
                        if (divd != 0 && (divd === '' || divd === null)) {
                            divd = '&nbsp;';
                        }
                        $(tdiv).addClass('text_overflow');
                        tdiv.innerHTML = divd;
                        //含有input的td，禁止触发click事件
                        $(tdiv).has("input[type='checkbox']").addClass('noClick');
                        $(tdiv).has("input[type='radio']").addClass('noClick');

                        if($.trim($(tdiv).text()).length > 0){
	                        tdiv.setAttribute('title', $(tdiv).text());
						}
                    }
                    if(parentId){
                        $("#"+parentId).after(tr)
                    }
                    else{
                        $(tbody).append(tr);
                    }
                    
                    tr = null;
                });

                $('tr', t).unbind();
                $(t).empty();
                $(t).append(tbody);
                //for(var i=0;i<data.rows.length;i++){
                    //p.datas.rows.push(data.rows[i]);
                    //p.datas.data.push(data.rows[i]);
                //}
               
                if (p.click) {
                    $(t).unbind("click");
                    $(t).click(function (e) {
                        var target = e.target;
                        if (target.className.indexOf("noClick") == -1) {
                            var td = $(target).parents("td").eq(0);
                            var tr = td.parent();
                            if(tr.hasClass("graytr")) return; //如果该行置灰状态，单行事件不可用
                            var col = $('td', tr).index(td);
                            var row = $('tr', t).index(tr);
                            if (row == -1) row = 0;
                            p.click(p.datas.rows[row], row, col, tr.attr("id"));
                        }
                    });
                }

                if (p.dblclick) {
                    $(t).unbind("dblclick");
                    $(t).dblclick(function (e) {
                        var target = e.target;
                        if (target.className.indexOf("noClick") == -1) {
                            var td = $(target).parents("td").eq(0);
                            var tr = td.parent();
                            if (tr.hasClass("graytr")) return; //如果该行置灰状态，单行事件不可用
                            var col = $('td', tr).index(td);
                            var row = $('tr', t).index(tr);
                            if (row == -1) row = 0;
                            p.dblclick(p.datas.rows[row], row, col, tr.attr("id"));
                        }
                    });
                }

                this.addRowProp();
                this.rePosDrag();
                tbody = null;
                data = null;
                i = null;
                if (p.onSuccess) {
                    p.onSuccess(this);
                }
                if (p.hideOnSubmit) {
                    $(g.block).remove();
                }
                this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                if ($.browser.opera) {
                    $(t).css('visibility', 'visible');
                }
                $(t).codetext();
            },
            addData: function (data) { // parse data
				//全选后翻页 全选checkbox 依然勾选
				$('.grid_checkbox input[type=checkbox]' ,this.hDiv).prop('checked', false);
                data = $.extend({
                    rows: [],
                    page: 0,
                    total: 0
                }, data);
                p.datas = data;

                if (p.preProcess) {
                    data = p.preProcess(data);
                }
                $('.pReload', this.pDiv).removeClass('loading');
                this.loading = false;
                if (!data) {
                    $('.pPageStat', this.pDiv).html(p.errormsg);
                    return false;
                }
                if (!data.total)
                    data.total = data.rows.length;
                p.total = data.total;

                if (p.total == 0) {
                    $('tr, a, td, div', t).unbind();
                    $(t).empty();
                    p.pages = 1;
                    p.page = 1;
                    this.buildpager();
                    $('.pPageStat', this.pDiv).html(p.nomsg);
					if($(g.block).size()>0) $(g.block).remove();
					$("<div id='total_0_"+p.id+"'></div>").width($('.hDivBox',this.hDiv).width()).appendTo($(this.bDiv));
					if (p.onNoDataSuccess) {
	                    p.onNoDataSuccess(this);
	                }
					if(p.callBackTotle){
						p.callBackTotle(p.total);
					}
                    return false;
                }else{
					var _totle0 = $('#total_0_'+p.id);
					if(_totle0.size()>0){
						_totle0.remove();
					}
				}
                p.pages = Math.ceil(p.total / p.rp);

                p.page = data.page;

                if(data.params)
                  p.params = data.params;

                this.buildpager();
                // build new body
                var tbody = document.createElement('tbody');
                tbody.id = "list";
                tbody.className = "hand";
                var ttr = document.createElement('tr'), cc = 0;
                $('thead tr:first th', g.hDiv)
                    .each(
                        // create template tr
                        function () {
                            var th = $(this), td = document.createElement('td'), tdDiv = document
                                .createElement('div');
                            var idx = th.attr('axis').substr(3);
                            td.align = this.align;
                            if (p.sortname == th.attr('abbr') && p.sortname) {
                                td.className = 'sorted';
                            }
                            $(tdDiv).css({
                                textAlign: th[0].align,
                                width: $('div:first', th)[0].style.width
                            });
                            if (this.hidden) {
                                $(td).css('display', 'none');
                            }
                            if (p.nowrap == false) {
                                $(tdDiv).css('white-space', 'normal');
                            }
                            if (p.colModel[cc].codecfg) {
                                $(tdDiv).attr("codecfg", p.colModel[cc].codecfg).addClass(
                                    "codecfg");
                            }

                            $(td).append(tdDiv);
                            $(td).attr('abbr', th.attr('abbr'));
                            $(ttr).append(td);
                            td = null;
                            cc++;
                        });

                $.each(data.rows, function (i, row) {
                    var ctr = $(ttr).clone();
                    tr = ctr[0];

                    if (row.name)
                        tr.name = row.name;
                    if (row.color) {
                        $(tr).css('background', row.color);
                    } else {
                        if (i % 2 && p.striped)
                            tr.className = 'erow';
                    }
                    //if(row.ishidden){
                    //$(tr).addClass("hidden");
                    //}
                    if(row.disable)
                    	$(tr).addClass("graytr");
                    if (row[p.idProperty]) {
                        tr.id = 'row' + row[p.idProperty];
                    }
                    var ctrc = ctr.children();
                    for (var j = 0; j < cc; j++) {
                        var td = ctrc[j], tdiv = $(td).children()[0], divd,  clm = p.colModel[j];
                        // If each row is the object itself (no 'cell' key)
                        if (typeof row.cell == 'undefined') {
                            divd = row[clm.name];
                            if(divd && typeof divd == 'string' && p.isEscapeHTML){
                            	divd = divd.escapeHTML(true,false);
                            }
                        } else {
                            // If the json elements aren't named (which is typical), use
                            // numeric order
                            if (typeof row.cell[j] != "undefined") {
                                divd = (row.cell[j] != null) ? row.cell[j] : '';// null-check
                            } else {
                                divd = row.cell[clm.name];
                            }
                        }
                        if(divd && clm.cutsize)
                          divd = divd.substring(0, clm.cutsize);
                        if (clm.type == 'checkbox') {
                            divd = "<input type=\"checkbox\" gridRowCheckBox=\""
                                + p.gridClassName + "\" class='noClick' row=\"" + i + "\" value=\"" + divd + "\"/>";
                        } else if (clm.type == 'radio') {
                            divd = "<input type=\"radio\" gridRowCheckBox=\""
                              + p.gridClassName + "\" class='noClick' row=\"" + i + "\" value=\"" + divd + "\" name=\"gridradio\"/>";
                        } else if (p.render) {
                            var mj = p._modesMap ? p._modesMap[j] : j;
                            divd = p.render(divd, row, i, mj, clm);
                        }
                        // resolve the bug of IE9, that will consider 0 equals ''
                        if (divd != 0 && (divd === '' || divd === null)) {
                            divd = '&nbsp;';
                        }
                        $(tdiv).addClass('text_overflow');
                        tdiv.innerHTML = divd;
                        //含有input的td，禁止触发click事件
                        $(tdiv).has("input[type='checkbox']").addClass('noClick');
                        $(tdiv).has("input[type='radio']").addClass('noClick');

						if($.trim($(tdiv).text()).length > 0){
	                        tdiv.setAttribute('title', $(tdiv).text());
						}
                    }					

                    $(tbody).append(tr);
                    tr = null;
                });

                $('tr', t).unbind();
                $(t).empty();
                $(t).append(tbody);

                if (p.click) {
                    $(t).unbind("click");
                    $(t).click(function (e) {
                        var target = e.target;
                        if (target.className.indexOf("noClick") == -1) {
                            var td = $(target).parents("td").eq(0);
                            var tr = td.parent();
                            if (tr.hasClass("graytr")) return; //如果该行置灰状态，单行事件不可用
                            var col = $('td', tr).index(td);
                            var row = $('tr', t).index(tr);
                            if (row == -1) row = 0;
                            clearTimeout(timer);
                            timer = setTimeout(function() {
                            	p.click(p.datas.rows[row], row, col);
                            }, 200);
                        }
                    });
                }

                if (p.dblclick) {
                    $(t).unbind("dblclick");
                    $(t).dblclick(function (e) {
                        var target = e.target;
                        if (target.className.indexOf("noClick") == -1) {
                            var td = $(target).parents("td").eq(0);
                            var tr = td.parent();
                            if (tr.hasClass("graytr")) return; //如果该行置灰状态，单行事件不可用
                            var col = $('td', tr).index(td);
                            var row = $('tr', t).index(tr);
                            if (row == -1) row = 0;
                            clearTimeout(timer);
                            p.dblclick(p.datas.rows[row], row, col);
                        }
                    });
                }

                this.addRowProp();
                this.rePosDrag();
                tbody = null;
                data = null;
                i = null;
                if (p.onSuccess) {
                    p.onSuccess(this);
                }
				if(p.callBackTotle){
					p.callBackTotle(p.total);
				}
                if (p.hideOnSubmit) {
                    $(g.block).remove();
                }
                this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                if ($.browser.opera) {
                    $(t).css('visibility', 'visible');
                }
                $(t).codetext();
            },
            changeSort: function (th) { // change sortorder
                if (this.loading) {
                    return true;
                }
                $(g.nDiv).hide();
                $(g.nBtn).hide();
                var sortByname;
                p.onCurrentPageSort==true? sortByname=$(th).attr('colmode'):sortByname=$(th).attr('abbr');
                p.sortType=$(th).attr('sortType');      
                if (p.sortname == sortByname) {
                    if (p.sortorder == 'asc') {
                        p.sortorder = 'desc';
                    } else {
                        p.sortorder = 'asc';
                    }
                } else {
                    p.sortorder = 'asc';
                }
                $(th).addClass('sorted').siblings().removeClass('sorted');
                $('.sdesc', this.hDiv).removeClass('sdesc');
                $('.sasc', this.hDiv).removeClass('sasc');
                $('div', th).addClass('s' + p.sortorder);
                p.sortname =sortByname;
				if (p.onCurrentPageSort) {//只对当前页的数据进行排序                   
                    this.setSort(p.sortname, p.sortorder,p.sortType);
                }else {                  
                    this.populate();
                } 
                if (p.onChangeSort) {
                    p.onChangeSort(p.sortname, p.sortorder,p.sortType);
                }
            },
            buildpager: function () { // rebuild pager based on new properties
                $('.pcontrol input', this.pDiv).val(p.page);
                $('span.total_page', this.pDiv).html($.i18n('validate.grid.over_page4.js') + p.pages + $.i18n('validate.grid.over_page5.js'));
                var r1 = (p.page - 1) * p.rp + 1;
                var r2 = r1 + p.rp - 1;
                if (p.total < r2) {
                    r2 = p.total;
                }
                var stat = p.pagestat;
                stat = stat.replace(/{from}/, r1);
                stat = stat.replace(/{to}/, r2);
                stat = stat.replace(/{total}/, p.total);
                $('.pPageStat', this.pDiv).html(stat);
                //$('.total', this.pDiv).html("条/共" + p.total + "条记录");
                $('.total', this.pDiv).html($.i18n('validate.grid.over_page2.js') + p.total + $.i18n('validate.grid.over_page3.js'));
            },
            setSort: function (name, order, type) { //当前页面数据排序 
                if ($.trim(p.datas) == "") {//判断没有数据，直接返回
                    return;
                }
                if(!p.datas.rows.sort){
                	return;
                }
                p.datas.rows.sort(function (a, b) {
                	var valueA=a[name]; //默认按字符串排序
                	var valueB=b[name];
                	if(type=="date"){//日期排序
					    valueA=Date.parse(valueA);
					    valueB=Date.parse(valueB);
                	}
					if(type=='number'){//数字排序
						valueA=Number(valueA);
						valueB=Number(valueB);
					}
					if(type == "string"){
						if(valueA==null){valueA="";}else{valueA=""+valueA;}
						if(valueB==null){valueB="";}else{valueB=""+valueB;}
						var _f = valueA.localeCompare(valueB);
						if (order == "desc") {//降序  
							return  _f;
						}else{
							return _f*-1;
						}
					}else{
	                    if (order == "desc") {//降序                   
	                        if (valueA < valueB) return -1;
	                        if (valueA > valueB) return 1;
	                        return 0;
	                    }
	                    if (order == "asc") {//升序
	                        if (valueA > valueB) return -1;
	                        if (valueA < valueB) return 1;
	                        return 0;
	                    }
					}
					
                });
                this.addData(p.datas);//重新显示排序后的列表;
                },
            populate: function (paras) { // get latest data
                if (this.loading) {
                    return true;
                }
                if (p.onSubmit) {
                    var gh = p.onSubmit();
                    if (!gh) {
                        return false;
                    }
                }
                this.loading = true;

                $('.pPageStat', this.pDiv).html(p.procmsg);
                $('.pReload', this.pDiv).addClass('loading');
                $(g.block).css({
                    top: g.bDiv.offsetTop
                });
                if (p.hideOnSubmit) {
                    $(this.gDiv).prepend(g.block);
                }
                if ($.browser.opera) {
                    $(t).css('visibility', 'hidden');
                }
                if (!p.newp) {
                    p.newp = 1;
                }
                if (p.page > p.pages) {
                    p.page = p.pages;
                }
                if (paras){
                    p.params = paras;
					if(paras.newp){p.newp = paras.newp}
				}

                var fp = {
                    page: p.newp,
                    size: p.rp,
                    sortField: p.sortname,
                    sortOrder: p.sortorder
                };
                if (p.onCurrentPageSort) {//如果只对当页数据排序，翻页的时候不排序
                    fp.sortField = undefined;
                    fp.sortOrder = undefined;
                }
                if (p.managerName && p.managerMethod && window[p.managerName]) {
                    var callerResponder = new CallerResponder();
                    callerResponder.success = function (fpi) {
                        fpi.rows = fpi.data;
                        g.addData(fpi);
                    };
                    var _bs = new window[p.managerName]();
                    _bs[p.managerMethod](fp, p.params, callerResponder);
                } else if (p.datas != null) {
                    g.addData(p.datas);
                }
            },
            doSearch: function () {
                p.query = $('input[name=q]', g.sDiv).val();
                p.qtype = $('select[name=qtype]', g.sDiv).val();
                p.params[p.qtype] = p.query;
                p.newp = 1;
                this.populate();
            },
            changePage: function (ctype, fc) { // change page
            	if(p.total == 0){
                    return false;
                }
                if (this.loading) {
                    return true;
                }
                switch (ctype) {
                    case 'first':
                        p.newp = 1;
                        break;
                    case 'prev':
                        if (p.page > 1) {
                            p.newp = parseInt(p.page) - 1;
                        }
                        break;
                    case 'next':
                        if (p.page < p.pages) {
                            p.newp = parseInt(p.page) + 1;
                        }
                        break;
                    case 'last':
                        p.newp = p.pages;
                        break;
                    case 'input':
                        var nv = parseInt($('.pcontrol input', this.pDiv).val());
                        if (isNaN(nv)) {
                            nv = 1;
                        }
                        if (nv < 1) {
                            nv = 1;
                        } else if (nv > p.pages) {
                            nv = p.pages;
                        }
                        $('.pcontrol input', this.pDiv).val(nv);
                        p.newp = nv;
                        break;
                }
				
				        p.rpNew = $('#rpInputChange', g.pDiv).val();
				        if(p.rpNew > p.rpMaxSize) {
				          p.rpNew = p.rpMaxSize;
				          $('#rpInputChange', g.pDiv).val(p.rpNew);
				        }
                if ((p.newp == p.page) && (p.rp == p.rpNew) && !fc) {
                    return false;
                }
				        p.rp = p.rpNew;
                if (p.onChangePage) {
                    p.onChangePage(p.newp);
                } else {
                    this.populate();
                }
            },
            getCellDim: function (obj) {// get cell prop for editable event
                var ht = parseInt($(obj).height());
                var pht = parseInt($(obj).parent().height());
                var wt = parseInt(obj.style.width);
                var pwt = parseInt($(obj).parent().width());
                var top = obj.offsetParent.offsetTop;
                var left = obj.offsetParent.offsetLeft;
                var pdl = parseInt($(obj).css('paddingLeft'));
                var pdt = parseInt($(obj).css('paddingTop'));
                return {
                    ht: ht,
                    wt: wt,
                    top: top,
                    left: left,
                    pdl: pdl,
                    pdt: pdt,
                    pht: pht,
                    pwt: pwt
                };
            },
            addRowProp: function () {
                var _noClickType = true;
                $('tbody td').find(".noClick").click(function () {
                        _noClickType = false;
                });
                $('tbody tr', g.bDiv).each(function () {
                    var t = $(this);
					$(t).unbind();
                    t.click(function (e) {
                        var obj = (e.target || e.srcElement);
                        if (obj.href || obj.type){
							if(obj.type == 'checkbox' || obj.type == 'radio'){
								var _checked = $(obj).prop('checked'); 
								if(_checked){
									t.siblings().removeClass('trSelected');
									t.addClass('trSelected');
								}else{
									t.removeClass('trSelected');
								}
							}
                            return true;
						}
                        if (p.singleSelect && !g.multisel) {
                            t.siblings().removeClass('trSelected');
                            if ($(obj).find('input[gridrowcheckbox]').size() == 0) {//过滤点击含checkbox的td
                                t.siblings().find("input[gridrowcheckbox]").prop("checked", false);
                            }
                            t.addClass('trSelected');
	                        if (t.hasClass("trSelected")) {
								var _ch = t.find("input[gridrowcheckbox]");
								if(_ch.prop('disabled') == false){
		                            _ch.prop("checked", true);
								}
	                        } else {
								t.find("input[gridrowcheckbox]").prop("checked", false);
	                        }
                        }

                        if (p.vChange) {
                            if (_noClickType) {
                                if ($('#' + p.vChangeParam.changeTar).size() > 0 && p.vChangeParam.autoResize) {
                                    p.UMD = "middle";
									g.resizeGridUpDown(p.UMD)
                                }
                                var tar = t.find("input[type=checkbox]");
                                if (tar.size() > 0) {
                                  try{
                                    tar.focus();
                                  }catch(e){
                                  }
                                }
                                var tar2 = t.find("input[type=radio]");
                                if (tar2.size() > 0) {
                                  try{
                                    tar2.focus();
                                  }catch(e){
                                  }
                                }
                            } else {
                                _noClickType = true;
                            }
                        }

                    }).mousedown(function (e) {
                        if (e.shiftKey) {
                            t.toggleClass('trSelected');
                            g.multisel = true;
                            this.focus();
                            $(g.gDiv).noSelect();
                        }
                        if (e.ctrlKey) {
                            t.toggleClass('trSelected');
                            g.multisel = true;
                            this.focus();
                        }
                    }).mouseup(function (e) {
                        if (g.multisel && !e.ctrlKey) {
                            g.multisel = false;
                            $(g.gDiv).noSelect(false);
                        }
                    }).hover(function (e) {
                        if (g.multisel && e.shiftKey) {
                            t.toggleClass('trSelected');
                        }
                    }, function () {
                    });
                    if ($.browser.msie && $.browser.version < 7.0) {
                        t.hover(function () {
                            t.addClass('trOver');
                        }, function () {
                            t.removeClass('trOver');
                        });
                    }
                });
            },

            combo_flag: true,
            combo_resetIndex: function (selObj) {
                if (this.combo_flag) {
                    selObj.selectedIndex = 0;
                }
                this.combo_flag = true;
            },
            combo_doSelectAction: function (selObj) {
                eval(selObj.options[selObj.selectedIndex].value);
                selObj.selectedIndex = 0;
                this.combo_flag = false;
            },
            // Add title attribute to div if cell contents is truncated
            addTitleToCell: function (tdDiv) {
                if (p.addTitleToCell) {
                    var $span = $('<span />').css('display', 'none'), $div = (tdDiv instanceof jQuery) ? tdDiv
                        : $(tdDiv), div_w = $div.outerWidth(), span_w = 0;

                    $('body').children(':first').before($span);
                    $span.html($div.html());
                    $span.css('font-size', '' + $div.css('font-size'));
                    $span.css('padding-left', '' + $div.css('padding-left'));
                    span_w = $span.innerWidth();
                    $span.remove();

                    if (span_w > div_w) {
                        $div.attr('title', $div.text());
                    } else {
                        $div.removeAttr('title');
                    }
                }
            },
            autoResizeColumn: function (obj) {
                if (!p.dblClickResize) {
                    return;
                }
                var n = $('div', this.cDrag).index(obj), $th = $('th:visible div:eq('
                    + n + ')', this.hDiv), ol = parseInt(obj.style.left), ow = $th
                    .width(), nw = 0, nl = 0, $span = $('<span />');
                $('body').children(':first').before($span);
                $span.html($th.html());
                $span.css('font-size', '' + $th.css('font-size'));
                $span.css('padding-left', '' + $th.css('padding-left'));
                $span.css('padding-right', '' + $th.css('padding-right'));
                nw = $span.width();
                $('tr', this.bDiv).each(function () {
                    var $tdDiv = $('td:visible div:eq(' + n + ')', this), spanW = 0;
                    $span.html($tdDiv.html());
                    $span.css('font-size', '' + $tdDiv.css('font-size'));
                    $span.css('padding-left', '' + $tdDiv.css('padding-left'));
                    $span.css('padding-right', '' + $tdDiv.css('padding-right'));
                    spanW = $span.width();
                    nw = (spanW > nw) ? spanW : nw;
                });
                $span.remove();
                nw = (p.minWidth > nw) ? p.minWidth : nw;
                nl = ol + (nw - ow);
                $('div:eq(' + n + ')', this.cDrag).css('left', nl);
                this.colresize = {
                    nw: nw,
                    n: n
                };
                g.dragEnd();
            },
            getSelectRows: function () {
                var inputs = $(t).find('input[gridRowCheckBox=' + p.gridClassName + ']:checked');
				 if(inputs.length<=0){
                  	 $(t).find('input[gridRowCheckBox=' + p.gridClassName + ']').each(function(){
                  		 var checked = $(this).attr("checked");
                  		 if(checked){
                  			 inputs.push($(this));
                  		 }
                  	 })
                  }
                var rows = [];
                inputs.each(function () {
                    var index = $(this).attr('row');
                    rows.push(p.datas.rows[index]);
                });
                return rows;
            },
            getPageRows: function () {
                var inputs = $(t).find('input[gridRowCheckBox=' + p.gridClassName + ']');
                var rows = [];
                inputs.each(function () {
                    var index = $(this).attr('row');
                    rows.push(p.datas.rows[index]);
                });
                return rows;
            },resizeGrid: function (h) {
                var _orgin = $(g.bDiv).height();
                var sub = _orgin - h;
                $(g.bDiv).css('height', h);
                var ssss = $('#' + p.vChangeParam.changeTar).height();
                $('#' + p.vChangeParam.changeTar).height(ssss + sub);
                $(g.block).css({//g.bock的高度根据bDIV的变化而变化
		            height: h,
		            marginBottom: (h * -1)
		        });
            }, resizeGridAuto: function () {
                if (p.parentId != null) {
                    var userpagerH = 0;
                    p.usepager ? userpagerH += 34 : null;
                    p.resizable ? userpagerH += 11 : null;
                    g.resizeGrid($('#' + p.parentId).height() - userpagerH - 24);
                    $("#" + p.id).width($('#' + p.parentId).width());
                } else {
                    $("#" + p.id).width(p.width);
                    g.resizeGrid(p.height - 24);
                }
            },resizeGridUpDown: function (upDown) {
                var bDivHeight = $(g.bDiv).height();
                var userpagerH = 0;
				var resizableH = 0;
                p.usepager ? userpagerH += 34 : null;
                p.resizable ? resizableH += 10 : null;
                var stepArr = [0, ($('#' + p.parentId).height() - userpagerH -resizableH- 24) /100 * 35, $('#' + p.parentId).height() -resizableH- userpagerH - 24];
                if(upDown == 'up'){
                    g.resizeGrid(stepArr[0]);
	                if (p.vChange) {
	                    var tt = $('#' + p.vChangeParam.changeTar);
	                    if (tt.length > 0 && bDivHeight > 0) {
	                        var _tth = tt.height();
	                        tt.height(_tth + 34)
	                    }
						
						p.addPDivHeight = true;
	                }
					if(p.usepager){
						$(g.pDiv).hide()
					}
					
				}else if(upDown == 'middle'){
					g.resizeGrid(stepArr[1]);
					$(g.pDiv).show()
					if(p.addPDivHeight){
						if (p.vChange) {
		                    var tt = $('#' + p.vChangeParam.changeTar);
		                    if (tt.length > 0) {
								var _tth = tt.height();
								tt.height(_tth - 34) 
		                    }
							
							p.addPDivHeight = false;
		                }
					}
				}else if(upDown == 'down'){
					g.resizeGrid(stepArr[2]);
					$(g.pDiv).show()
				}else{
					return;
				}
				p.UMD = upDown;
            },
            pager: 0
        };
        // init divs
        g.gDiv = document.createElement('div'); // create global container
        g.mDiv = document.createElement('div'); // 列表上方显示的title和收起、展开按钮的容器div
        g.hDiv = document.createElement('div'); // 列头div
        g.bDiv = document.createElement('div'); // 数据div
        g.vDiv = document.createElement('div'); // create grip
        g.rDiv = document.createElement('div'); // create horizontal resizer
        g.cDrag = document.createElement('div'); // 拖动列宽的线容器div
        g.block = document.createElement('div'); // creat blocker
        g.nDiv = document.createElement('div'); // 设置列显示不显示的下拉菜单div
        g.nBtn = document.createElement('div'); // 鼠标移动到列头上右侧显示的下拉图标div
        g.iDiv = document.createElement('div'); // create editable layer
        g.tDiv = document.createElement('div'); // toolbar 工具条div
        g.sDiv = document.createElement('div'); // 查询条件显示的容器div
        g.pDiv = document.createElement('div'); // 分页所在的div
        if (!p.usepager) {
            g.pDiv.style.display = 'none';
        }
        g.hTable = document.createElement('table');
        g.gDiv.className = p.dataTable?'flexigrid dataTable': 'flexigrid';
        g.gDiv.id = p.id;
        if (p.width != 'auto') {
            g.gDiv.style.width = p.width + 'px';
        }
        if (p.parentId != null) {
            var userpagerH = 0;
            p.usepager ? userpagerH += 34 : null;
            p.resizable ? userpagerH += 11 : null;
            p.height = $('#' + p.parentId).height() - userpagerH-p.heightSubtract;
            if (p.vChange) {
                var tt = $('#' + p.vChangeParam.changeTar);
                if (tt.length > 0) {
                    tt.height(0);
                }
            }
        }
        if ($.browser.msie) {
            $(g.gDiv).addClass('ie');
        }
        if (p.novstripe) {
            $(g.gDiv).addClass('novstripe');
        }
        $(t).before(g.gDiv);
        $(g.gDiv).append(t);
        g.hDiv.className = 'hDiv';
        g.hDiv.id = p.id + '_hDiv';

        $(t).before(g.hDiv);
        p.holewidth = $(g.hDiv).width();

        var cpi;
        if ($.ctx) {
            cpi = $.ctx._currentPathId;
        }
        if(cpi && !p.customId)
          p.customId = cpi;
        if (p.colModel) { // create model if any
            if ($.ctx && p.customize && $.ctx.customize) {
                var ugp = $.ctx.customize.grid_pref;
                if (p.customId && ugp) {
                    ugp = $.parseJSON(ugp);
                    ugp = ugp[p.customId];
                    if (ugp && !(ugp instanceof Array)) {
                        var _modes = [], _modesMap = {}, cs = [];
                        for(var u in ugp) {
                          if( u ==="") return;
                          cs.push(u);
                          $.each(p.colModel, function (j, n) {
                              if (n.name == u) {
                                  _modesMap[_modes.length] = j;
                                  if(!(n.hide !== undefined && n.isToggleHideShow !== undefined && n.hide && !n.isToggleHideShow))
                                      n.hide = (ugp[u] === 0 || ugp[u] === '0' )? true : false;
                                  _modes.push(n);
                              }
                          });
                        }
                        $.each(p.colModel, function (j, n) {
                            if (!cs.contains(n.name)) {
                                _modesMap[_modes.length] = j;
                                _modes.push(n);
                            }
                        });
                        p.colModel = _modes;
                        p._modesMap = _modesMap;
                    }
                } else {
                    ugp = null;
                }
            }
            thead = document.createElement('thead');
            var tr = document.createElement('tr');
            for (var i = 0; i < p.colModel.length; i++) {
                var cm = p.colModel[i];
                var th = document.createElement('th');
                $(th).attr('axis', 'col' + i);
                if (cm) { // only use cm if its defined
                    if (cm.display != undefined) {
                        if (cm.type == 'checkbox') {
                            th.innerHTML = "<input type='checkbox' onclick=\"getGridSetAllCheckBoxSelect123456(this,'"
                                + p.gridClassName + "')\"/>";
                            $(th).addClass('grid_checkbox');
                        } else if (cm.type == 'radio') {
                            th.innerHTML = "";
                        } else {
                            th.innerHTML = cm.display;
                        }
                    }
                    cm.sortType=cm.sortType?cm.sortType:"string";
					$(th).attr('colMode', cm.name);
					$(th).attr('sortType', cm.sortType);
					var _isToggleHideShow = cm.isToggleHideShow == undefined?true:cm.isToggleHideShow;
					if(cm.name == 'id' || cm.name == 'name' || cm.name == 'title'){
						_isToggleHideShow = false;
					}
					$(th).attr('isToggleHideShow', _isToggleHideShow);
                    if (cm.name && cm.sortable) {
                        $(th).attr('abbr', cm.sortname ? cm.sortname : cm.name);
                    }
                    if (cm.align == undefined) {
						cm.align = 'left'
                    }
                    th.align = cm.align;
                    if (cm.width) {
                        var ddd = cm.width + "";
                        if (ddd.indexOf('%') > -1) {
                            var _W = (p.holewidth - 10) * parseInt(ddd) / 100;
                            cm.width = _W - 10;
                        }
                        $(th).attr('width', cm.width);
                    }
                    if ($(cm).attr('hide') || cm.hide) {
                        th.hidden = true;
                    }
                    if (cm.process) {
                        th.process = cm.process;
                    }

                } else {
                    th.innerHTML = "";
                    $(th).attr('width', 30);
                }
                $(tr).append(th);
            }
            $(thead).append(tr);
            $(t).prepend(thead);
        } // end if p.colmodel

        g.hTable.cellPadding = 0;
        g.hTable.cellSpacing = 0;
        $(g.hDiv).append('<div class="hDivBox"></div>');
        $('div', g.hDiv).append(g.hTable);
        var thead = $("thead:first", t).get(0);
        if (thead)
            $(g.hTable).append(thead);
        thead = null;
        if (!p.colmodel)
            var ci = 0;
        $('thead tr:first th', g.hDiv).each(
            function () {
                var thdiv = document.createElement('div');
                if ($(this).attr('abbr')) {
                    $(this).click(function (e) {
                        if (!$(this).hasClass('thOver'))
                            return false;
                        var obj = (e.target || e.srcElement);
                        if (obj.href || obj.type)
                            return true;
                        g.changeSort(this);
                    });
                    if ($(this).attr('abbr') == p.sortname) {
                        this.className = 'sorted';
                        thdiv.className = 's' + p.sortorder;
                    }
                }
                if (this.hidden) {
                    $(this).hide();
                }
                if (!p.colmodel) {
                    $(this).attr('axis', 'col' + ci++);
                }
                $(thdiv).css({
                    textAlign: this.align,
                    width: this.width + 'px'
                });
                thdiv.innerHTML = this.innerHTML;
                $(this).empty().append(thdiv).removeAttr('width').mousedown(
                    function (e) {
                        g.dragStart('colMove', e, this);
                    }).hover(
                    function () {
                        if (!g.colresize && !$(this).hasClass('thMove') && !g.colCopy) {
                            $(this).addClass('thOver');
                        }
                        if ($(this).attr('abbr') != p.sortname && !g.colCopy
                            && !g.colresize && $(this).attr('abbr')) {
                            $('div', this).addClass('s' + p.sortorder);
                        } else if ($(this).attr('abbr') == p.sortname && !g.colCopy
                            && !g.colresize && $(this).attr('abbr')) {
                            var no = (p.sortorder == 'asc') ? 'desc' : 'asc';
                            $('div', this).removeClass('s' + p.sortorder).addClass(
                                's' + no);
                        }
                        if (g.colCopy) {
                            var n = $('th', g.hDiv).index(this);
                            if (n == g.dcoln) {
                                return false;
                            }
                            if (n < g.dcoln) {
                                $(this).append(g.cdropleft);
                            } else {
                                $(this).append(g.cdropright);
                            }
                            g.dcolt = n;
                        } else if (!g.colresize) {
                            var nv = $('th:visible', g.hDiv).index(this);
                            var onl = parseInt($('div:eq(' + nv + ')', g.cDrag).css(
                                'left'));
                            var nw = jQuery(g.nBtn).outerWidth();
                            var nl = onl - nw + Math.floor(p.cgwidth / 2);
                            $(g.nDiv).hide();
                            $(g.nBtn).hide();
                            $(g.nBtn).css({
                                'left': nl,
                                top: g.hDiv.offsetTop
                            }).show();
                            var ndw = parseInt($(g.nDiv).width());
                            $(g.nDiv).css({
                                top: g.bDiv.offsetTop
                            });
                            if ((nl + ndw) > $(g.gDiv).width()) {
                                $(g.nDiv).css('left', onl - ndw + 1);
                            } else {
                                $(g.nDiv).css('left', nl);
                            }
                            if ($(this).hasClass('sorted')) {
                                $(g.nBtn).addClass('srtd');
                            } else {
                                $(g.nBtn).removeClass('srtd');
                            }
                        }
                    },
                    function () {
                        $(this).removeClass('thOver');
                        if ($(this).attr('abbr') != p.sortname) {
                            $('div', this).removeClass('s' + p.sortorder);
                        } else if ($(this).attr('abbr') == p.sortname) {
                            var no = (p.sortorder == 'asc') ? 'desc' : 'asc';
                            $('div', this).addClass('s' + p.sortorder).removeClass(
                                's' + no);
                        }
                        if (g.colCopy) {
                            $(g.cdropleft).remove();
                            $(g.cdropright).remove();
                            g.dcolt = null;
                        }
                    }); // wrap content
            });
        // set bDiv
        g.bDiv.className = 'bDiv';
        g.bDiv.id = p.gridClassName + '_bDiv';// 点击列航更改grid高度，在resizeGrig方法中需要获取bDiv
        $(t).before(g.bDiv);
        if (p.hChange) {
            var pObj = $(g.gDiv).parent();
            pObj.css({
                'overflow': 'hidden'
            });
            p.height = pObj.height() - p.hChangeParam.subHeight;
        }
        if(p.height < 50)
          p.height = 'auto';
        $(g.bDiv).css({
            height: (p.height == 'auto') ? 'auto' : p.height - 24 + "px"  //减去翻页的高度
        }).scroll(function (e) {
            g.scroll()
        }).append(t);
        if (p.height == 'auto') {
            $('table', g.bDiv).addClass('autoht');
        }
        // add td & row properties
        g.addRowProp();
        // set cDrag
        var cdcol = $('thead tr:first th:first', g.hDiv).get(0);
        if (cdcol != null) {
            g.cDrag.className = 'cDrag';
            g.cdpad = 0;
            g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderLeftWidth'))) ? 0
                : parseInt($('div', cdcol).css('borderLeftWidth')));
            g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderRightWidth'))) ? 0
                : parseInt($('div', cdcol).css('borderRightWidth')));
            g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingLeft'))) ? 0
                : parseInt($('div', cdcol).css('paddingLeft')));
            g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingRight'))) ? 0
                : parseInt($('div', cdcol).css('paddingRight')));
            g.cdpad += (isNaN(parseInt($(cdcol).css('borderLeftWidth'))) ? 0
                : parseInt($(cdcol).css('borderLeftWidth')));
            g.cdpad += (isNaN(parseInt($(cdcol).css('borderRightWidth'))) ? 0
                : parseInt($(cdcol).css('borderRightWidth')));
            g.cdpad += (isNaN(parseInt($(cdcol).css('paddingLeft'))) ? 0
                : parseInt($(cdcol).css('paddingLeft')));
            g.cdpad += (isNaN(parseInt($(cdcol).css('paddingRight'))) ? 0
                : parseInt($(cdcol).css('paddingRight')));
            $(g.bDiv).before(g.cDrag);
            var cdheight = $(g.bDiv).height();
            var hdheight = $(g.hDiv).height();
            $(g.cDrag).css({
                top: -hdheight + 'px'
            });
            $('thead tr:first th', g.hDiv).each(function () {
                var cgDiv = document.createElement('div');
                $(g.cDrag).append(cgDiv);
                if (!p.cgwidth) {
                    p.cgwidth = $(cgDiv).width();
                }
                $(cgDiv).css({
                    height: cdheight + hdheight
                }).mousedown(function (e) {
                    g.dragStart('colresize', e, this);
                }).dblclick(function (e) {
                    g.autoResizeColumn(this);
                });
                if ($.browser.msie && $.browser.version < 7.0) {
                    g.fixHeight($(g.gDiv).height());
                    $(cgDiv).hover(function () {
                        g.fixHeight();
                        $(this).addClass('dragging')
                    }, function () {
                        if (!g.colresize)
                            $(this).removeClass('dragging')
                    });
                }
            });
        }
        // add strip
        if (p.striped) {
            $('tbody tr:odd', g.bDiv).addClass('erow');
        }
        if (p.resizable && p.height != 'auto') {
            g.vDiv.className = 'vGrip';
            g.vDiv.id = p.id + "vGrip";
            $(g.vDiv).mousedown(function (e) {
                g.dragStart('vresize', e)
            });
            if (p.slideToggleBtn) {//判断上下伸缩按钮
                var _html = "";
                _html += "";
                $(g.vDiv).html("<div class='vGrip_line'><table align='center' border='0' cellpadding='0' cellspacing='0' height='7'><tr><td align='center'><span class='slideUpBtn spiretBarHidden4'><em></em></span><span class='slideDownBtn spiretBarHidden3' style='border-left:0;'><em></em></span></td></tr></table></div>");
            } else {
                $(g.vDiv).html("<span id='dragBtn'></span>");
            }
            $(g.bDiv).after(g.vDiv);
            if (p.slideToggleBtn) {//判断上下伸缩按钮绑定事件
                $("#" + p.id + "vGrip .slideUpBtn").click(p.slideToggleUpHandle);
                $("#" + p.id + "vGrip .slideDownBtn").click(p.slideToggleDownHandle);
            }
        }
        if (p.resizable && p.width != 'auto' && !p.nohresize) {
            g.rDiv.className = 'hGrip';
            $(g.rDiv).mousedown(function (e) {
                g.dragStart('vresize', e, true);
            }).html('<span></span>').css('height', $(g.gDiv).height());
            if ($.browser.msie && $.browser.version < 7.0) {
                $(g.rDiv).hover(function () {
                    $(this).addClass('hgOver');
                }, function () {
                    $(this).removeClass('hgOver');
                });
            }
            $(g.gDiv).append(g.rDiv);
        }
        // add pager
        if (p.usepager) {
            g.pDiv.className = 'pDiv';
            g.pDiv.id = p.id + '_pDiv';
            g.pDiv.innerHTML = '<div class="pDiv2 common_over_page align_right" style="padding-top:2px;padding-bottom:2px;"></div>';
            $(g.bDiv).after(g.pDiv);

            var html = '<a   class="pFirst pButton common_over_page_btn"><span class="pageFirst"></span></a><a  class="pPrev pButton common_over_page_btn"><span class="pagePrev"></span></a><span class="pcontrol margin_l_10">'
          + p.pagetext
          + '<input type="text" size="4" value="1" class="common_over_page_txtbox"/>'
          + p.outof
          + '</span><a  class="pNext pButton common_over_page_btn"><span class="pageNext"></span></a><a  class="pLast pButton common_over_page_btn"><span class="pageLast"></span></a><a  class="common_over_page_btn" style="display:none"><span class="pReload pButton "><span class="ico16 refresh_16 margin_lr_5">&nbsp;</span></span></a><a href="javascript:void(0)" id="grid_go" class="common_button common_button_gray margin_lr_10">go</a><div class="pGroup"><span class="pPageStat"></span></div>';

            //var html = ' <div class="common_over_page align_right">'
            //     + '每页显示<input type="text" class="common_over_page_txtbox"><span class="margin_r_20">条/共6条</span><a  class="common_over_page_btn" title="首页"><em class="pageFirst"></em></a><a  class="common_over_page_btn" title="上一页"><em class="pagePrev"></em></a><span class="margin_l_10">第</span><input type="text" class="common_over_page_txtbox">页/13页<a  class="common_over_page_btn" title="下一页"><em class="pageNext"></em></a><a  class="common_over_page_btn" title="尾页"><em class="pageLast"></em></a>'
            //    + '</div>'
            $('div', g.pDiv).html(html);
            $('.pReload', g.pDiv).click(function () {
                g.populate();
            });
            $('.pFirst', g.pDiv).click(function () {
                g.changePage('first');
            });
            $('.pPrev', g.pDiv).click(function () {
                g.changePage('prev');
            });
            $('.pNext', g.pDiv).click(function () {
                g.changePage('next');
            });
            $('.pLast', g.pDiv).click(function () {
                g.changePage('last');
            });
            $('.pcontrol input', g.pDiv).keydown(function (e) {
                if (e.keyCode == 13)
                    g.changePage('input');
            });
			      $('#grid_go').click(function(){
				        g.changePage('input', true);
			      });
            if ($.browser.msie && $.browser.version < 7)
                $('.pButton', g.pDiv).hover(function () {
                    $(this).addClass('pBtnOver');
                }, function () {
                    $(this).removeClass('pBtnOver');
                });
			/**	
            if (p.useRp) {
                var opt = '', sel = '';
                for (var nx = 0; nx < p.rpOptions.length; nx++) {
                    if (p.rp == p.rpOptions[nx])
                        sel = 'selected="selected"';
                    else
                        sel = '';
                    opt += "<option value='" + p.rpOptions[nx] + "' " + sel + " >"
                        + p.rpOptions[nx] + "&nbsp;&nbsp;</option>";
                }
                $('.pDiv2', g.pDiv).prepend(
                    "每页显示<select name='rp'>" + opt
                        + "</select><span class='margin_r_20 total'>条/共6条</span>");
                $('select', g.pDiv).change(function () {
                    if (p.onRpChange) {
                        p.onRpChange(+this.value);
                    } else {
                        p.newp = 1;
                        p.rp = +this.value;
                        g.populate();
                    }
                });
            }**/
			if(p.useRpInput){
			    $('.pDiv2', g.pDiv).prepend($.i18n('validate.grid.over_page.js') + "<input type='text' id='rpInputChange' name='rp' maxlength='3' value='" + p.rp + "' class='common_over_page_txtbox' style='width:30px;'/><span class='margin_r_10 total'>" + $.i18n('validate.grid.over_page2.js') + "0" + $.i18n('validate.grid.over_page3.js') + "</span><span class='total_page'>1</span>");
				$('#rpInputChange', g.pDiv).blur(function(){
					var _val = $(this).val();
					var _nval = _val.replace(/\D/g,'');
					if(_nval<=0){
						_nval = p.rp;
					}
					$(this).val(_nval);
					$('#grid_go').click();
				});
			}
            // add search button
            if (p.searchitems) {
                $('.pDiv2', g.pDiv)
                    .prepend(
                        "<div class='pGroup'> <div class='pSearch pButton'><span></span></div> </div>  <div class='btnseparator'></div>");
                $('.pSearch', g.pDiv).click(function () {
                    $(g.sDiv).slideToggle('fast', function () {
                        $('.sDiv:visible input:first', g.gDiv).trigger('focus');
                    });
                });
                // add search box
                g.sDiv.className = 'sDiv';
                var sitems = p.searchitems;
                var sopt = '', sel = '';
                for (var s = 0; s < sitems.length; s++) {
                    if (p.qtype == '' && sitems[s].isdefault == true) {
                        p.qtype = sitems[s].name;
                        sel = 'selected="selected"';
                    } else {
                        sel = '';
                    }
                    sopt += "<option value='" + sitems[s].name + "' " + sel + " >"
                        + sitems[s].display + "&nbsp;&nbsp;</option>";
                }
                if (p.qtype == '') {
                    p.qtype = sitems[0].name;
                }
                $(g.sDiv).append(
                    "<div class='sDiv2'>" + p.findtext
                        + " <input type='text' value='" + p.query
                        + "' size='30' name='q' class='qsbox' /> "
                        + " <select name='qtype'>" + sopt + "</select></div>");
                // Split into separate selectors because of bug in jQuery 1.3.2
                $('input[name=q]', g.sDiv).keydown(function (e) {
                    if (e.keyCode == 13) {
                        g.doSearch();
                    }
                });
                $('select[name=qtype]', g.sDiv).keydown(function (e) {
                    if (e.keyCode == 13) {
                        g.doSearch();
                    }
                });
                $('input[value=Clear]', g.sDiv).click(function () {
                    $('input[name=q]', g.sDiv).val('');
                    p.query = '';
                    g.doSearch();
                });

                $(g.bDiv).after(g.sDiv);
            }
        }
        $(g.pDiv, g.sDiv).append("<div style='clear:both'></div>");
        // add title
        if (p.title) {
            g.mDiv.className = 'mDiv';
            g.mDiv.innerHTML = '<div class="ftitle">' + p.title + '</div>';
            $(g.gDiv).prepend(g.mDiv);
            if (p.showTableToggleBtn) {
                $(g.mDiv)
                    .append(
                        '<div class="ptogtitle" title="Minimize/Maximize Table"><span></span></div>');
                $('div.ptogtitle', g.mDiv).click(function () {
                    $(g.gDiv).toggleClass('hideBody');
                    $(this).toggleClass('vsble');
                });
            }
        }
        // setup cdrops
        g.cdropleft = document.createElement('span');
        g.cdropleft.className = 'cdropleft';
        g.cdropright = document.createElement('span');
        g.cdropright.className = 'cdropright';
        // add block
        g.block.className = 'gBlock';
        var gh = $(g.bDiv).height();
        var gtop = g.bDiv.offsetTop;
        $(g.block).css({
            width: g.bDiv.style.width,
            height: gh,
            //background: 'white',
            position: 'relative',
            marginBottom: (gh * -1),
            zIndex: 1,
            top: gtop,
            left: '0px'
        });
        $(g.block).fadeTo(0, p.blockOpacity);
        // add column control
        if ($('th', g.hDiv).length) {
            g.nDiv.className = 'nDiv';
            g.nDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
            $(g.nDiv).css({
                marginBottom: (gh * -1),
                display: 'none',
                top: gtop
            }).noSelect();
            var cn = 0;
            $('th div', g.hDiv).each(
                function () {
                    var kcol = $("th[axis='col" + cn + "']", g.hDiv)[0];
                    var chk = 'checked="checked"';
                    if (kcol.style.display == 'none') {
                        chk = '';
                    }
//					var _innrtHTML = this.innerHTML;
//					if(_innrtHTML.indexOf('getGridSetAllCheckBoxSelect123456')!=-1){
//						_innrtHTML = "<input type='checkbox' disabled='disabled'/>";
//					}
					var _parent = $(this).parent();
					var ishidden = '';
					var _isToggleHideShow = _parent.attr('isToggleHideShow');
					if(_isToggleHideShow == 'false'){
						ishidden = 'none'
					}
                    $('tbody', g.nDiv).append(
                        '<tr style="display:'+ishidden+'"><td class="ndcol1"><input type="checkbox" ' + chk
                            + ' class="togCol" value="' + cn
                            + '" /></td><td class="ndcol2">' + this.innerHTML
                            + '</td></tr>');
                    cn++;
                });
            if ($.browser.msie && $.browser.version < 7.0)
                $('tr', g.nDiv).hover(function () {
                    $(this).addClass('ndcolover');
                }, function () {
                    $(this).removeClass('ndcolover');
                });
            $('td.ndcol2', g.nDiv).click(
                function () {
                    if ($('input:checked', g.nDiv).length <= p.minColToggle
                        && $(this).prev().find('input')[0].checked)
                        return false;
                    return g.toggleCol($(this).prev().find('input').val());
                });
            $('input.togCol', g.nDiv).click(
                function () {
                    if ($('input:checked', g.nDiv).length < p.minColToggle
                        && this.checked == false)
                        return false;
                    $(this).parent().next().trigger('click');
                });
            $(g.gDiv).prepend(g.nDiv);
            $(g.nBtn).addClass('nBtn').html('<div></div>').attr('title',
                $.i18n('grid.togglefield.js')).click(function () {
                    $(g.nBtn).addClass("set_col")
                    $(g.nDiv).toggle();
                    return true;
                });
            if (p.showToggleBtn) {
                $(g.gDiv).prepend(g.nBtn);
            }
        }

        // add date edit layer
        $(g.iDiv).addClass('iDiv').css({
            display: 'none'
        });
        $(g.bDiv).append(g.iDiv);
        // add flexigrid events
        $(g.bDiv).hover(function () {
            $(g.nDiv).hide();
            $(g.nBtn).hide().removeClass("set_col");
        }, function () {
            if (g.multisel) {
                g.multisel = false;
            }
        });
        $(g.gDiv).hover(function () {
        }, function () {
            $(g.nDiv).hide();
            $(g.nBtn).hide();
        });
        // add document events
        $(document).mousemove(function (e) {
            g.dragMove(e)
        }).mouseup(function (e) {
            g.dragEnd()
        }).hover(function () {
        }, function () {
            g.dragEnd()
        });
        // browser adjustments
        if ($.browser.msie && $.browser.version < 7.0) {
            $('.hDiv,.bDiv,.mDiv,.pDiv,.vGrip,.tDiv, .sDiv', g.gDiv).css({
                width: '100%'
            });
            $(g.gDiv).addClass('ie6');
            if (p.width != 'auto') {
                $(g.gDiv).addClass('ie6fullwidthbug');
            }
        }
        g.rePosDrag();
        g.fixHeight();
        // make grid functions accessible
        t.p = p;
        t.grid = g;
        $(t).attrObj("_grid", g);
        if (p.managerName) {
            $("head").append(
                "<script src='" + _ctxPath + "/ajax.do?managerName=" + p.managerName
                    + "' type='text/javascript'></script>");
        }
        if (p.datas && p.autoload) {
            g.populate();
        }
		/**
        $(g.hTable).find('input[type=checkbox]').click(function () {
            if ($(this).prop('checked')) {
                $(t).find('input[type=checkbox]').prop('checked', true);
            } else {
                $(t).find('input[type=checkbox]').prop('checked', false);
            }
        });
		**/
        initFlag = false;
        if ($._autofill) {
            var $af = $._autofill, $afg = $af.filllists;
            if ($afg && $afg[t.id]) {
                $afg[t.id].rows = $afg[t.id].data;
                g.addData($afg[t.id]);
                $afg[t.id] = null;
            }
        }
        return t;
    };
    var docloaded = false;
    $(document).ready(function () {
        docloaded = true
    });
    $.fn.ajaxgrid = function (p) {
        return $.addFlex(this[0], p);
    };
    $.fn.resizeGrid = function (h) {
		return;
//        this.each(function () {
//            var cNstr = this.className;
//            var _body = $('#' + cNstr + '_bDiv');
//            var _orgin = _body.height();
//            var sub = _orgin - h;
//            _body.css('height', h);
//            var ssss = $('#grid_detail').height();
//            $('#grid_detail').height(ssss + sub);
//
//        });
    };
    $.fn.getSelectCheckbox = function () {
        var cNstr = this[0].className;
        var cNstrstr = this[0].className + "_bDiv";
        return $('.' + cNstr).find('input[gridRowCheckBox=' + cNstr + ']:checked');
    };
    $.fn.flexReload = function (p) { // function to reload grid
        return this.each(function () {
            if (this.grid && this.p.managerName)
                this.grid.populate();
        });
    }; // end flexReload
    $.fn.flexOptions = function (p) { // function to update general options
        return this.each(function () {
            if (this.grid)
                $.extend(this.p, p);
        });
    }; // end flexOptions
    $.fn.flexToggleCol = function (cid, visible) { // function to reload grid
        return this.each(function () {
            if (this.grid)
                this.grid.toggleCol(cid, visible);
        });
    }; // end flexToggleCol
    $.fn.ajaxgridLoad = function (para) { // function to add data to grid
        return this.each(function () {
            if (this.grid) {
                //this.p.newp = 1;
                this.grid.populate(para);
            }
        });
    };
    $.fn.ajaxgridData = function (data) { // function to add data to grid
        return this.each(function () {
            if (this.grid) {
                this.grid.addData(data);
            }
        });
    };
    $.fn.noSelect = function (p) { // no select plugin by me :-)
        var prevent = (p == null) ? true : p;
        if (prevent) {
            return this.each(function () {
                if ($.browser.msie || $.browser.safari)
                    $(this).bind('selectstart', function () {
                        return false;
                    });
                else if ($.browser.mozilla) {
                    $(this).css('MozUserSelect', 'none');
                    $('body').trigger('focus');
                } else if ($.browser.opera)
                    $(this).bind('mousedown', function () {
                        return false;
                    });
                else
                    $(this).attr('unselectable', 'on');
            });
        } else {
            return this.each(function () {
                if ($.browser.msie || $.browser.safari)
                    $(this).unbind('selectstart');
                else if ($.browser.mozilla)
                    $(this).css('MozUserSelect', 'inherit');
                else if ($.browser.opera)
                    $(this).unbind('mousedown');
                else
                    $(this).removeAttr('unselectable', 'on');
            });
        }
    }; // end noSelect
    $.fn.flexSearch = function (p) { // function to search grid
        return this.each(function () {
            if (this.grid && this.p.searchitems)
                this.grid.doSearch();
        });
    }; // end flexSearch
})(jQuery);
function getGridSetAllCheckBoxSelect123456(obj, clName) {
    // alert(clName)
    if ($(obj).prop('checked')) {
       $('.flexigrid').find('input[gridRowCheckBox=' + clName + ']').not("input[type=checkbox][disabled]").prop(
            'checked', true);

    } else {
        $('.flexigrid').find('input[gridRowCheckBox=' + clName + ']').prop(
            'checked', false);
    }
	if(typeof(gridSelectAllPersonalFunction) == 'function' ){
		gridSelectAllPersonalFunction($(obj).prop('checked'));
	}
}