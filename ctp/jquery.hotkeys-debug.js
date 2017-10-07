/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function(jQuery){
  
  jQuery.hotkeys = {
    version: "0.8",

    specialKeys: {
      8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
      20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
      37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
      96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
      104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
      112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
      120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
    },
  
    shiftNums: {
      "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
      "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
      ".": ">",  "/": "?",  "\\": "|"
    },
    
    returnKeys: [],
    cancelKeys: []
  };

  function keyHandler( handleObj ) {
    // Only care when a possible input has been specified
    if ( typeof handleObj.data !== "string" ) {
      return;
    }
    
    var origHandler = handleObj.handler,
      keys = handleObj.data.toLowerCase().split(" ");
  
    handleObj.handler = function( event ) {
      // Don't fire in text-accepting inputs that we didn't directly bind to
      if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
         event.target.type === "text") ) {
        return;
      }
      
      // Keypress represents characters, not special keys
      var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
        character,
        key, modif = "", possible = {};
      // avoid String undefined exception in IE9
      try {
        character = String.fromCharCode( event.which ).toLowerCase();
      }catch(e){
        character = event.which;
      }

      // check combinations (alt|ctrl|shift+anything)
      if ( event.altKey && special !== "alt" ) {
        modif += "alt+";
      }

      if ( event.ctrlKey && special !== "ctrl" ) {
        modif += "ctrl+";
      }
      
      // TODO: Need to make sure this works consistently across platforms
      if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
        modif += "meta+";
      }

      if ( event.shiftKey && special !== "shift" ) {
        modif += "shift+";
      }

      if ( special ) {
        possible[ modif + special ] = true;

      } else {
        possible[ modif + character ] = true;
        possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

        // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
        if ( modif === "shift+" ) {
          possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
        }
      }

      for ( var i = 0, l = keys.length; i < l; i++ ) {
        if ( possible[ keys[i] ] ) {
          return origHandler.apply( this, arguments );
        }
      }
    };
  }

  $.each([ "keydown", "keyup", "keypress" ], function() {
    jQuery.event.special[ this ] = { add: keyHandler };
  });
  //add short cut
  $(document).bind('keydown', 'esc',function (evt){
    jQuery._fireKeydown_esc(evt);
    return false; 
  }).bind('keydown', 'return',function (evt){
    jQuery._fireKeydown_return(evt);
    return true; 
  });
  function isNeedClick(obj){
  	//var _className = obj.Attr('class');
    if(!obj || obj.length==0 || obj.hasClass('common_button_disable') || obj.css('display') == 'none' || obj.css('visibility') == 'hidden' || obj.parents('.button_container').css('display') == 'none' ||obj.parents('.button_container').css('visibility') == 'hidden'){
		return false;
	}
	return true;
  }
  $._fireKeydown_return = function(evt) {
    var f = false;
    $($.hotkeys.returnKeys).each(function(k,j) {
      var b = $('#'+j);
      if (isNeedClick(b)) {
        b.click();
        f = true;
        return false;
      }
    });
    if(f)
      return;
    if($('#ok_msg_btn_first').size()>0){
      if(isNeedClick($('#ok_msg_btn_first'))){
         $('#ok_msg_btn_first').click(); 
      }
     }else if($('#btnsave').size()>0){
	   if(isNeedClick($('#btnsave'))){
	      $('#btnsave').click(); 
	   }
	  
    }else if($('#btnok').size()>0){
		if (isNeedClick($('#btnok'))) {
			$('#btnok').click();
		}
    }else if($('#btnsubmit').size()>0){
		if (isNeedClick($('#btnsubmit'))) {
			$('#btnsubmit').click();
		}
    }else if($('#btnsearch').size()>0){
	   if (isNeedClick($('#btnsearch'))) {
	     $('#btnsearch').click();
	   }
    }else if($('#btnreset').size()>0){
	  if (isNeedClick($('#btnreset'))) {
      	$('#btnreset').click();
	  }
    }else if($('#btnmodify').size()>0){
	  if (isNeedClick($('#btnmodify'))) {
      	$('#btnmodify').click();
	  }
    }else if($('#ok_msg_btn').size()>0){
	  if (isNeedClick($('#ok_msg_btn'))) {
      	$('#ok_msg_btn').click();
	  }
    }else if($('#yes_msg_btn').size()>0){
	  if (isNeedClick($('#yes_msg_btn'))) {
      	$('#yes_msg_btn').click();
	  }
    }else if($('#retry_msg_btn').size()>0){
	  if (isNeedClick($('#retry_msg_btn'))) {
      	$('#retry_msg_btn').click();
	  }
    }else if(parent && parent != window) {
        //parent hotkey button search, useless currently
        if(parent.jQuery)parent.jQuery._fireKeydown_return(evt);
    }
  };
  $._fireKeydown_esc = function(evt) {
    var f = false;
    $($.hotkeys.cancelKeys).each(function(k,j) {
      var b = $('#'+j);
      if (isNeedClick(b)) {
        b.click();
        f = true;
        return false;
      }
    });
    if(f)
      return;
    if($('#btncancel').size()>0){
      $('#btncancel').click(); 
    }else if($('#btnclose').size()>0){
      $('#btnclose').click();
    }else if(parent && parent != window) {
      //parent hotkey button search, useless currently
      parent.jQuery._fireKeydown_esc(evt);
    }
  };
})( jQuery );
$(function(){
  $("input,select").bind('keydown', 'esc',function (evt){
    $._fireKeydown_esc(evt);
    return false; 
  }).bind('keydown', 'return',function (evt){
    $._fireKeydown_return(evt);
    return false; 
  });
});