(function($) {
// 数据源。存储原始下拉数据并匹配。
function ACDatasource(options){
    var setting = $.extend({data:[],value:null},options);
    this.data = setting.data;
    this.value = setting.value;
    this.onChange = setting.onChange;
    this.originValue = this.value;

    function escapeRegex( value ) {
        return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    this.filter = function(array, term) {
        var matcher = new RegExp( escapeRegex(term), "i" );
        return $.grep( array, function(value) {
            return matcher.test( value.label || value.value || value );
        });
    };
    return this;
};
// 按文本模糊匹配数据项
ACDatasource.prototype.search = function(value,event){
        //value = value != null ? value : this.element.val();

        // always save the actual value, not the one passed as an argument
        //this.term = this.element.val();
/*
        if ( value.length < this.options.minLength ) {
            return this.close( event );
        }

        clearTimeout( this.closing );
        if ( this._trigger( "search", event ) === false ) {
            return;
        }
*/
        return this.filter( this.data,value );
};
// 按值查找数据项
ACDatasource.prototype.get = function(value){
    var v = $.grep( this.data, function(item) {
        return item.value == value;
    });
    if(v.length>0){
        return v[0];
    }
    return null;
};
ACDatasource.prototype.getAll = function(value){
    return this.data;
};
ACDatasource.prototype.val = function(value){
    if(value){
        this.value = value;
        $(this).trigger('change',value);
    }
    return this.value;
}
// 恢复上一次有效值
ACDatasource.prototype.restore= function(){
    this.val(this.originValue);
}

ACDatasource.prototype.destroy = function(event){
    this.data = null;
    this.value = null;
    $(this).unbind('change');
}
//==================================================================================
// 管理弹出显示，数据渲染。
function ACPopup(options){
    this.id = Math.random()*10000;
    this.setting = $.extend({autoSize:false},options);
    this.onSelect = options.onSelect;
    this.ui = options.ui;
    this._cursor = null; 
    this.cursor = function(cursor){
        if(cursor===null || cursor){
            this._cursor = cursor;
        };
        return this._cursor;
    }
    // if(options.container) this.container = $(options.container);
    this.ds = options.ds;
    this.data = options.ds.getAll();
    var _this = this;
    function create(){
        var id = 'autocomplete_popup';
        var popup = $('#' + id);
        if(popup.length==0){
            popup = $('<div></div>')
                .attr('id',id)
                .addClass('autocomplete-popup')
                .append($('<div></div>').addClass('menu'))
                .appendTo($('body'));
            popup.hide();
            popup.mousedown(function(evt){
                var onScrollbar = $( evt.target ).closest( ".item" ).length==0;
                if(!onScrollbar){
                    _this.close();
                }else{
                    setTimeout(function() {
                        $( document ).one( 'mousedown', function( event ) {
                            //console.log(event.target.html());
                            if(popup[0]!=event.target && !$.contains(popup,event.target)){
                                _this.close();
                            }

                        });
                    }, 1 );                    
                }
                // use another timeout to make sure the blur-event-handler on the input was already triggered
                setTimeout(function() {
                    clearTimeout( popup.closing );
                }, 13);
                // 先触发popup的mousedown，才触发input的blur
                $(_this).trigger('clicked');
            });
        }
        // 创建遮罩iframe，避免IE下被ActiveX遮住
        if($('#' + id + '_mask').length==0){
            $('<iframe></iframe>')
                .attr('id',id + '_mask')
                .addClass('autocomplete-popup-mask')
                .appendTo($('body'));
        };
        // event
        $(this).unbind('moveFirst').bind('moveFirst',function(e,item){
           _this.moveFirst();
        }).unbind('moveNext').bind('moveNext',function(e,item){
           _this.moveNext();
        }).bind('movePrevious',function(e,item){
           _this.movePrevious();
        });

        return popup;
    };
    this.container = create();
    this.moveFirst = function(){
        _this.cursor($(_this.container).find('div.menu div:first-child'));
        _this.highlight();
    }
    this.moveNext = function(){
        if(_this.cursor()==null){
            _this.moveFirst();
            return;
        }
        var next = _this.cursor().next()
        if(next.length>0){
            _this.cursor( next);
            _this.highlight();
        }
    }
    this.movePrevious = function(){
        if(_this.cursor()==null){
            _this.moveFirst();
            return;
        }
        var previous = _this.cursor().prev();
        if(previous.length>0){
            _this.cursor (previous);
            _this.highlight();
        }       
    }
    this.highlight = function (){
        $('.item-selected').removeClass('item-selected');
        _this.cursor().addClass('item-selected');
        // _this.cursor()[0].scrollIntoView();
    };
    this.calcPosition = function(){
        var maxHeight = 300;
        var viewWidth = document.documentElement.clientWidth + $(document).scrollLeft();
        var viewHeight = document.documentElement.clientHeight + $(document).scrollTop();
        
        if(maxHeight>viewHeight){
            maxHeight = viewHeight;
        }        
        var input = $(_this.ui);
        var inputTop = input.offset().top-1;
        var inputHeight = input.outerHeight();

        var pos = {left:0,top:0,width:0,height:0};
        pos.left = input.offset().left;
        pos.width = input.width();//.outerWidth();
        var hasButton = input.next('input[name="acToggle"]').length>0;
        if(hasButton){
            pos.width = pos.width + input.next('input[name="acToggle"]').outerWidth() - 3;
        }
        // jQuery ui flip模式top校正
        var popup = _this.container;
        var uiTop = inputTop + inputHeight;
        var uiHeight = popup.height('').outerHeight();
        var height = uiHeight;

        if(uiHeight>maxHeight){
            uiHeight=maxHeight;
        }    

        // 改为在input上面显示
        if(( uiTop + uiHeight > viewHeight)&&(uiTop>(viewHeight/2))){
            uiTop = inputTop - uiHeight - 2;
        }

        if(uiTop<0){
            uiTop = 0;
            if(uiHeight<inputTop){
                uiTop = inputTop - uiHeight;
            }
            uiHeight = inputTop-uiTop;
        }
        // 飘在上方
        if(uiTop + uiHeight + 5 < inputTop){
            uiTop = inputTop - uiHeight - 5;
        }
        //console.log(uiTop+' ' + uiHeight + ' ' + inputTop+ ' ' +inputHeight);
        // 遮住了Input
        if(uiTop+uiHeight>inputTop+inputHeight){
            uiTop = inputTop + inputHeight;
        }
        // 在下面显示，但太高
        if(uiTop+uiHeight>viewHeight){
            uiHeight = viewHeight - uiTop - 10;
        }
        if(height>uiHeight){
            pos.scroll = true;
        }
        pos.height = uiHeight;
        pos.top = uiTop;

        // 计算宽度
        if(_this.setting.autoSize){
            var maxLen = 0;
            $.each(_this.data,function(i,item){
                var len = item.label.length;
                if(len>maxLen) maxLen = len; 
            });
            var width = maxLen*8 + 24
            pos.width = pos.width>width ? pos.width:width;
        }
        return pos;
    }

};
ACPopup.prototype.refresh= function(){
    var menu = this.container.find('div.menu');
    menu.empty();
    var _this = this;
    var selectedItem = this.ds.value;
    $.each( this.data, function( index, item ) {
        var selected = selectedItem && (item.value == selectedItem.value)?' item-selected':'';
        var l = $('<div></div>').html(item.label)
            .data('item',item)
            .attr('title',item.label)
            .addClass('item' + selected)
            .hover(function(event){
                _this.cursor($(this));
                _this.highlight();
            })
            .mousedown(function(event){
                _this.select(event);
            })
            .appendTo(menu);
        if(selected) _this.cursor(l);
    });
    if(this.cursor()==null){
        this.moveFirst();
    }
    this.highlight();
    if(this.data.length==0){
        menu.addClass('empty-menu');
    }else{
        menu.removeClass('empty-menu');
    }
    // this.container.html(html.join(''));
}
ACPopup.prototype.search= function(value){
    this.data = this.ds.search(value);
    this.cursor(null);
    this.refresh();
}
ACPopup.prototype.hide= function(event){
    $('#autocomplete_popup_mask').hide();
    this.container.hide();
}
ACPopup.prototype.show= function(){
    var _this = this;
    var pos = this.calcPosition();
    var container = this.container;
    if(pos.scroll){
        container.css('overflow-y', 'auto')
            .css('overflow-x', 'hidden')
            .css('height',pos.height +'px');
    }else{
        container.css('height','auto');
    }
    container.css({width:pos.width - 1 + 'px',
        top : pos.top + 1 + 'px',
        left : pos.left + 1 + 'px' });
    var height = container.height();
    $('#autocomplete_popup_mask').css({width:pos.width + 2 + 'px',
        top : pos.top - 0 + 'px',
        left : pos.left - 0 + 'px',
        height: height +'px'}).show();   
    // 滚动则隐藏,避免父容器height:100% + overflow:auto 时下拉面板不跟随滚动
    $(container.parents()).scroll(function() {
        _this.hide();
    });
    var inputTop = $(_this.ui).offset().top;

    setTimeout(function(){var newTop = $(_this.ui).offset().top;if(newTop!=inputTop){_this.hide();}}, 500);
    this.container.show();
}
ACPopup.prototype.toggle= function(){
    this.container.toggle();
}
ACPopup.prototype.close= function(event){
    this.hide();
    //$(this).trigger( "close", event );
}
ACPopup.prototype.visible= function(){
    return $(this.container).is(':visible')
}

ACPopup.prototype.select= function(event){
    var c = this.cursor();
    if(c != null){
        this.ds.val(c.data('item'));
    }
    $(this.ui.ui).focus();
}
ACPopup.prototype.destroy= function(event){
    $(this).unbind('moveFirst')
        .unbind('movePrevious')
        .unbind('moveNext');
}
// 保存状态信息，相当于全局变量。
var autocompleteStatus = {isClickPopup:false};
//====================================================================================
// 渲染录入控件；组装调度Popup、DataSource
function GenericAutocomplete(options){
    var autoSelect = true;
    var keyCode = this.keyCode;
    var ui = $(options.ui);
    var _this = this;
    var value = options.value ;
    this.ds = new ACDatasource({data:options.data,value:value});
    $(this.ds).unbind('change')
        .bind('change',function(e,item){
        if(item){
            var noselectChanged = ui.data("value")==item.value;
            GenericAutocomplete.updateUi(ui,item,noselectChanged);
            if(options.onSelect){
                options.onSelect(item);
            };
        };
    });
    var popup = new ACPopup($.extend(options,{ds:this.ds,input:this}));
    var suppressKeyPress;
    ui.unbind('keyup').bind('keyup',function(event){
        switch( event.keyCode ) {
            case keyCode.PAGE_UP:
                // self._move( "previousPage", event );
                break;
            case keyCode.PAGE_DOWN:
                // self._move( "nextPage", event );
                break;
            case keyCode.UP:
                if(_this.popup.visible()){
                    $(popup).trigger('movePrevious');
                }else{
                    _this.popup.show();
                }                
                // prevent moving cursor to beginning of text field in some browsers
                event.preventDefault();
                break;
            case keyCode.DOWN:
                if(_this.popup.visible()){
                    $(popup).trigger('moveNext');
                }else{
                    _this.popup.show();
                }
                // prevent moving cursor to end of text field in some browsers
                event.preventDefault();
                break;
            case keyCode.ENTER:
            case keyCode.NUMPAD_ENTER:
                // when menu is open and has focus
                if ( _this.popup.visible()) {
                    // #6055 - Opera still allows the keypress to occur
                    // which causes forms to submit
                    suppressKeyPress = true;
                    popup.select();
                    popup.close();
                    event.preventDefault();
                }
                //passthrough - ENTER and TAB both select the current element
            case keyCode.TAB:
/*                if ( !self.menu.active ) {
                    return;
                }
                self.menu.select( event );*/
                break;
            case keyCode.ESCAPE:
                // self.element.val( self.term );
                // self.close( event );
                popup.close(event);
                break;
            default:
                // keypress is triggered before the input value is changed
                clearTimeout( _this.searching );
                var value = $(this).val();
                _this.searching = setTimeout(function() {
                    // only search if the value has changed
/*                    if ( self.term != self.element.val() ) {
                        self.selectedItem = null;
                        self.search( null, event );
                    }*/
                    popup.search(value);
                    popup.show();
                }, 150 );
                break;
        };

    }).keypress(function(event){
        if ( suppressKeyPress ) {
            suppressKeyPress = false;
            event.preventDefault();
        }
    }).unbind('click').bind('click',function(event){
        popup.refresh();
        popup.show();
    }).unbind('blur').bind('blur',function( event ) {
        
        // 输入无效值时需要恢复
        $(this).val($(this).data('label'));
        // clearTimeout( _this.searching );
        // clicks on the menu (or a button to trigger a search) will cause a blur event
        // popup.closing = setTimeout(function() {
            //console.log('blur closing' + autocompleteStatus.isClickPopup);
            if(autocompleteStatus.isClickPopup){
                autocompleteStatus.isClickPopup = false;
                return;
            }
            autocompleteStatus.isClickPopup = false;
            popup.close();

	        if(autoSelect){
	            popup.select();
	        }
            _this.destroy();
        // }, 150 );

    });
    $(popup).unbind('clicked').bind('clicked',function(event){
        //console.log('click menu');
        autocompleteStatus.isClickPopup = true;
    })
    // 滚动则隐藏,避免父容器height:100% + overflow:auto 时下拉面板不跟随滚动
    $(ui.parents()).scroll(function() {
        popup.close();
    });
    this.ui = ui;
    this.popup = popup;
}
GenericAutocomplete.prototype.destroy = function(event){
    this.popup.destroy(event);
    this.ds.destroy(event);
}
// 静态方法，设置Autocomplete UI的值
GenericAutocomplete.updateUi = function(input,item, notInitChange){
    input.val(item.label)
        .attr('title',item.label)
        .data('value',item.value)
        .data('label',item.label);
    if(!notInitChange)
      input.trigger('changed',item);
}
GenericAutocomplete.prototype.keyCode={
    ALT: 18,
    BACKSPACE: 8,
    CAPS_LOCK: 20,
    COMMA: 188,
    COMMAND: 91,
    COMMAND_LEFT: 91, // COMMAND
    COMMAND_RIGHT: 93,
    CONTROL: 17,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    INSERT: 45,
    LEFT: 37,
    MENU: 93, // COMMAND_RIGHT
    NUMPAD_ADD: 107,
    NUMPAD_DECIMAL: 110,
    NUMPAD_DIVIDE: 111,
    NUMPAD_ENTER: 108,
    NUMPAD_MULTIPLY: 106,
    NUMPAD_SUBTRACT: 109,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SHIFT: 16,
    SPACE: 32,
    TAB: 9,
    UP: 38,
    WINDOWS: 91 // COMMAND
};
// 必须足够轻，只做两件事：绑定focus事件；如果是Select，生成Input。
$.fn.autocomplete = function(options){
    // 为提高性能，在初始化时屏蔽触发事件，避免级联触发。
    var preventTrigger = false;
    if(this.length==0) return;
    var nullValue = {value:'',label:''};
    var tagName=this[0].nodeName.toLowerCase();

    function _trigger(object,event,param){
        if(!preventTrigger) object.trigger(event,param);
    }
    function toggle(input){
        // 无数据停用，否则可用
        if(data&&data.length>0){
            input.removeAttr('disabled');
        }else{
            input.attr('disabled',true);
        };
    }
    // 从Select提取数据
    function select2Data(select){
      var data = [];
        select.find('option').each(function() {
            var option = $(this);
            data.push({value:option.val(),label:option.text()});
        });
        return data;
    }
    // 取select的选中值，无选中项返回第一项
    function getSelectedItem(select){
        var selected = select.find('option:selected');
        selected = (selected.length > 0) ? selected : select.find('option:first');
        if( selected.length > 0){
            return {value:selected.val(),label:selected.text()};
        }else{
            return {value:'',label:''};
        }
    }
    if(tagName == 'select'){
        var binding = this;
        // 建立影子Input，隐藏Select
        var input = this.data('binding');
        if(!input){
            var width = this.width();
            input = $('<input type="text" width="'+width+'"/>').insertAfter(this);
            input.width(width);
            // TODO 性能点
            input.data('binding',binding);
            binding.data('binding',input);
            binding.change(function(event,item){
                // 自己发起的事件，忽略
                if(item) return;
                // 手动或代码改变Select值时，更新Input的显示
                // 但不能触发事件，避免循环往复
                var select = $(this);
                var selectedItem = getSelectedItem(select);
                var noSelectChanged = input.data("value")==selectedItem.value;
                GenericAutocomplete.updateUi(input,selectedItem,noSelectChanged);
                input.autocomplete({data:select2Data(select),
                    value:getSelectedItem(select)
                });
            });

            // select跟随input改变
            input.bind('changed',function(event,item){
            binding.val(item.value);
            _trigger(binding,'change', item);
        });
        }
        // input.data('data',select2Data(this));
        var item = getSelectedItem(this);
        // if( item!=null){
        //     input.data('value',item.value);
        //     input.val(item.label);
        //     _trigger(input,'change', item);
        // }else{
        //     input.data('value',null);
        //     input.val('');
        //     _trigger(input,'change', nullValue);
        // }
        // input.data('value',item.value);
        // input.val(item.label);
        this.hide();
        _trigger(input,'change', item);
        GenericAutocomplete.updateUi(input,item,true);
        var op = $.extend({data : select2Data(this)},options);
        return input.autocomplete(op);
    }
    // 目前只支持input
    if(tagName != 'input') return;
    var _this = $(this);
    this.showButton = true;
    var data = this.data('data');
    if(options){
        if(options.data) data = options.data;
        if(options.value) {
            this.data('value', options.value);
        }
    }
    if(this.showButton){
      var hasButton = this.next('input[name="acToggle"]').length>0;
      if(!hasButton){
        var ctxPath = _ctxPath;
        if(!ctxPath) ctxPath = '';
        //var style = "background-image:url('"+ctxPath+"/common/images/desc.gif');background-repeat:no-repeat;background-color: #ececec;background-position:center;width:"+13+"px;height:"+ this.outerHeight() +"px;border:1px #d1d1d1 solid;vertical-align:middle";
        var style = "background-image:url('"+ctxPath+"/common/images/desc.gif');background-repeat:no-repeat;background-color: #ececec;background-position:center;width:"+13+"px;height:22px;border:1px #d1d1d1 solid;vertical-align:middle";
        var button = $('<input type="button" name="acToggle" tabindex="-1" onclick="$(this.previousSibling).trigger(\'focus\').trigger(\'click\');" style="'+style+'"/>');
        this.after(button);
        //不知道为啥这个宽度算的不准确导致button折行显示了，所以再减7px
        this.width(this.width() - button.outerWidth() - 1);
      }
    }   
    toggle(this);
    var setting = $.extend({data:data,
            ui : _this,
            value : _this.data('value'),
            autoSize : false
        },
        options);
    this.focus(function(){
        this.select();
        new GenericAutocomplete(setting);         
    });    
}    
})(jQuery);