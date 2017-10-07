/**
 * @author macj
 * jQuery UI Core 1.9.2
 * jQuery UI Widget 1.9.2
 * jQuery UI Mouse 1.9.2
 * jQuery UI Slider 1.9.2
 */
/*!
 * jQuery UI Core 1.9.2
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
(function( $, undefined ) {

var uuid = 0,
  runiqueId = /^ui-id-\d+$/;

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
  return;
}

$.extend( $.ui, {
  version: "1.9.2",

  keyCode: {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
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
    SPACE: 32,
    TAB: 9,
    UP: 38
  }
});

// plugins
$.fn.extend({
  _focus: $.fn.focus,
  focus: function( delay, fn ) {
    return typeof delay === "number" ?
      this.each(function() {
        var elem = this;
        setTimeout(function() {
          $( elem ).focus();
          if ( fn ) {
            fn.call( elem );
          }
        }, delay );
      }) :
      this._focus.apply( this, arguments );
  },

  scrollParent: function() {
    var scrollParent;
    if (($.ui.ie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
      scrollParent = this.parents().filter(function() {
        return (/(relative|absolute|fixed)/).test($.css(this,'position')) && (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
      }).eq(0);
    } else {
      scrollParent = this.parents().filter(function() {
        return (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
      }).eq(0);
    }

    return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
  },

  zIndex: function( zIndex ) {
    if ( zIndex !== undefined ) {
      return this.css( "zIndex", zIndex );
    }

    if ( this.length ) {
      var elem = $( this[ 0 ] ), position, value;
      while ( elem.length && elem[ 0 ] !== document ) {
        // Ignore z-index if position is set to a value where z-index is ignored by the browser
        // This makes behavior of this function consistent across browsers
        // WebKit always returns auto if the element is positioned
        position = elem.css( "position" );
        if ( position === "absolute" || position === "relative" || position === "fixed" ) {
          // IE returns 0 when zIndex is not specified
          // other browsers return a string
          // we ignore the case of nested elements with an explicit value of 0
          // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
          value = parseInt( elem.css( "zIndex" ), 10 );
          if ( !isNaN( value ) && value !== 0 ) {
            return value;
          }
        }
        elem = elem.parent();
      }
    }

    return 0;
  },

  uniqueId: function() {
    return this.each(function() {
      if ( !this.id ) {
        this.id = "ui-id-" + (++uuid);
      }
    });
  },

  removeUniqueId: function() {
    return this.each(function() {
      if ( runiqueId.test( this.id ) ) {
        $( this ).removeAttr( "id" );
      }
    });
  }
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
  var map, mapName, img,
    nodeName = element.nodeName.toLowerCase();
  if ( "area" === nodeName ) {
    map = element.parentNode;
    mapName = map.name;
    if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
      return false;
    }
    img = $( "img[usemap=#" + mapName + "]" )[0];
    return !!img && visible( img );
  }
  return ( /input|select|textarea|button|object/.test( nodeName ) ?
    !element.disabled :
    "a" === nodeName ?
      element.href || isTabIndexNotNaN :
      isTabIndexNotNaN) &&
    // the element and all of its ancestors must be visible
    visible( element );
}

function visible( element ) {
  return $.expr.filters.visible( element ) &&
    !$( element ).parents().andSelf().filter(function() {
      return $.css( this, "visibility" ) === "hidden";
    }).length;
}

$.extend( $.expr[ ":" ], {
  data: $.expr.createPseudo ?
    $.expr.createPseudo(function( dataName ) {
      return function( elem ) {
        return !!$.data( elem, dataName );
      };
    }) :
    // support: jQuery <1.8
    function( elem, i, match ) {
      return !!$.data( elem, match[ 3 ] );
    },

  focusable: function( element ) {
    return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
  },

  tabbable: function( element ) {
    var tabIndex = $.attr( element, "tabindex" ),
      isTabIndexNaN = isNaN( tabIndex );
    return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
  }
});

// support
$(function() {
  var body = document.body,
    div = body.appendChild( div = document.createElement( "div" ) );

  // access offsetHeight before setting the style to prevent a layout bug
  // in IE 9 which causes the element to continue to take up space even
  // after it is removed from the DOM (#8026)
  div.offsetHeight;

  $.extend( div.style, {
    minHeight: "100px",
    height: "auto",
    padding: 0,
    borderWidth: 0
  });

  $.support.minHeight = div.offsetHeight === 100;
  $.support.selectstart = "onselectstart" in div;

  // set display to none to avoid a layout bug in IE
  // http://dev.jquery.com/ticket/4014
  body.removeChild( div ).style.display = "none";
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
  $.each( [ "Width", "Height" ], function( i, name ) {
    var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
      type = name.toLowerCase(),
      orig = {
        innerWidth: $.fn.innerWidth,
        innerHeight: $.fn.innerHeight,
        outerWidth: $.fn.outerWidth,
        outerHeight: $.fn.outerHeight
      };

    function reduce( elem, size, border, margin ) {
      $.each( side, function() {
        size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
        if ( border ) {
          size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
        }
        if ( margin ) {
          size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
        }
      });
      return size;
    }

    $.fn[ "inner" + name ] = function( size ) {
      if ( size === undefined ) {
        return orig[ "inner" + name ].call( this );
      }

      return this.each(function() {
        $( this ).css( type, reduce( this, size ) + "px" );
      });
    };

    $.fn[ "outer" + name] = function( size, margin ) {
      if ( typeof size !== "number" ) {
        return orig[ "outer" + name ].call( this, size );
      }

      return this.each(function() {
        $( this).css( type, reduce( this, size, true, margin ) + "px" );
      });
    };
  });
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
  $.fn.removeData = (function( removeData ) {
    return function( key ) {
      if ( arguments.length ) {
        return removeData.call( this, $.camelCase( key ) );
      } else {
        return removeData.call( this );
      }
    };
  })( $.fn.removeData );
}





// deprecated

(function() {
  var uaMatch = /msie ([\w.]+)/.exec( navigator.userAgent.toLowerCase() ) || [];
  $.ui.ie = uaMatch.length ? true : false;
  $.ui.ie6 = parseFloat( uaMatch[ 1 ], 10 ) === 6;
})();

$.fn.extend({
  disableSelection: function() {
    return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
      ".ui-disableSelection", function( event ) {
        event.preventDefault();
      });
  },

  enableSelection: function() {
    return this.unbind( ".ui-disableSelection" );
  }
});

$.extend( $.ui, {
  // $.ui.plugin is deprecated.  Use the proxy pattern instead.
  plugin: {
    add: function( module, option, set ) {
      var i,
        proto = $.ui[ module ].prototype;
      for ( i in set ) {
        proto.plugins[ i ] = proto.plugins[ i ] || [];
        proto.plugins[ i ].push( [ option, set[ i ] ] );
      }
    },
    call: function( instance, name, args ) {
      var i,
        set = instance.plugins[ name ];
      if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
        return;
      }

      for ( i = 0; i < set.length; i++ ) {
        if ( instance.options[ set[ i ][ 0 ] ] ) {
          set[ i ][ 1 ].apply( instance.element, args );
        }
      }
    }
  },

  contains: $.contains,

  // only used by resizable
  hasScroll: function( el, a ) {

    //If overflow is hidden, the element might have extra content, but the user wants to hide it
    if ( $( el ).css( "overflow" ) === "hidden") {
      return false;
    }

    var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
      has = false;

    if ( el[ scroll ] > 0 ) {
      return true;
    }

    // TODO: determine which cases actually cause this to happen
    // if the element doesn't have the scroll set, see if it's possible to
    // set the scroll
    el[ scroll ] = 1;
    has = ( el[ scroll ] > 0 );
    el[ scroll ] = 0;
    return has;
  },

  // these are odd functions, fix the API or move into individual plugins
  isOverAxis: function( x, reference, size ) {
    //Determines when x coordinate is over "b" element axis
    return ( x > reference ) && ( x < ( reference + size ) );
  },
  isOver: function( y, x, top, left, height, width ) {
    //Determines when x, y coordinates is over "b" element
    return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
  }
});

})( jQuery );
/*!
 * jQuery UI Widget 1.9.2
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
(function( $, undefined ) {

var uuid = 0,
  slice = Array.prototype.slice,
  _cleanData = $.cleanData;
$.cleanData = function( elems ) {
  for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
    try {
      $( elem ).triggerHandler( "remove" );
    // http://bugs.jquery.com/ticket/8235
    } catch( e ) {}
  }
  _cleanData( elems );
};

$.widget = function( name, base, prototype ) {
  var fullName, existingConstructor, constructor, basePrototype,
    namespace = name.split( "." )[ 0 ];

  name = name.split( "." )[ 1 ];
  fullName = namespace + "-" + name;

  if ( !prototype ) {
    prototype = base;
    base = $.Widget;
  }

  // create selector for plugin
  $.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
    return !!$.data( elem, fullName );
  };

  $[ namespace ] = $[ namespace ] || {};
  existingConstructor = $[ namespace ][ name ];
  constructor = $[ namespace ][ name ] = function( options, element ) {
    // allow instantiation without "new" keyword
    if ( !this._createWidget ) {
      return new constructor( options, element );
    }

    // allow instantiation without initializing for simple inheritance
    // must use "new" keyword (the code above always passes args)
    if ( arguments.length ) {
      this._createWidget( options, element );
    }
  };
  // extend with the existing constructor to carry over any static properties
  $.extend( constructor, existingConstructor, {
    version: prototype.version,
    // copy the object used to create the prototype in case we need to
    // redefine the widget later
    _proto: $.extend( {}, prototype ),
    // track widgets that inherit from this widget in case this widget is
    // redefined after a widget inherits from it
    _childConstructors: []
  });

  basePrototype = new base();
  // we need to make the options hash a property directly on the new instance
  // otherwise we'll modify the options hash on the prototype that we're
  // inheriting from
  basePrototype.options = $.widget.extend( {}, basePrototype.options );
  $.each( prototype, function( prop, value ) {
    if ( $.isFunction( value ) ) {
      prototype[ prop ] = (function() {
        var _super = function() {
            return base.prototype[ prop ].apply( this, arguments );
          },
          _superApply = function( args ) {
            return base.prototype[ prop ].apply( this, args );
          };
        return function() {
          var __super = this._super,
            __superApply = this._superApply,
            returnValue;

          this._super = _super;
          this._superApply = _superApply;

          returnValue = value.apply( this, arguments );

          this._super = __super;
          this._superApply = __superApply;

          return returnValue;
        };
      })();
    }
  });
  constructor.prototype = $.widget.extend( basePrototype, {
    // TODO: remove support for widgetEventPrefix
    // always use the name + a colon as the prefix, e.g., draggable:start
    // don't prefix for widgets that aren't DOM-based
    widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
  }, prototype, {
    constructor: constructor,
    namespace: namespace,
    widgetName: name,
    // TODO remove widgetBaseClass, see #8155
    widgetBaseClass: fullName,
    widgetFullName: fullName
  });

  // If this widget is being redefined then we need to find all widgets that
  // are inheriting from it and redefine all of them so that they inherit from
  // the new version of this widget. We're essentially trying to replace one
  // level in the prototype chain.
  if ( existingConstructor ) {
    $.each( existingConstructor._childConstructors, function( i, child ) {
      var childPrototype = child.prototype;

      // redefine the child widget using the same prototype that was
      // originally used, but inherit from the new version of the base
      $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
    });
    // remove the list of existing child constructors from the old constructor
    // so the old child constructors can be garbage collected
    delete existingConstructor._childConstructors;
  } else {
    base._childConstructors.push( constructor );
  }

  $.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
  var input = slice.call( arguments, 1 ),
    inputIndex = 0,
    inputLength = input.length,
    key,
    value;
  for ( ; inputIndex < inputLength; inputIndex++ ) {
    for ( key in input[ inputIndex ] ) {
      value = input[ inputIndex ][ key ];
      if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
        // Clone objects
        if ( $.isPlainObject( value ) ) {
          target[ key ] = $.isPlainObject( target[ key ] ) ?
            $.widget.extend( {}, target[ key ], value ) :
            // Don't extend strings, arrays, etc. with objects
            $.widget.extend( {}, value );
        // Copy everything else by reference
        } else {
          target[ key ] = value;
        }
      }
    }
  }
  return target;
};

$.widget.bridge = function( name, object ) {
  var fullName = object.prototype.widgetFullName || name;
  $.fn[ name ] = function( options ) {
    var isMethodCall = typeof options === "string",
      args = slice.call( arguments, 1 ),
      returnValue = this;

    // allow multiple hashes to be passed on init
    options = !isMethodCall && args.length ?
      $.widget.extend.apply( null, [ options ].concat(args) ) :
      options;

    if ( isMethodCall ) {
      this.each(function() {
        var methodValue,
          instance = $.data( this, fullName );
        if ( !instance ) {
          return $.error( "cannot call methods on " + name + " prior to initialization; " +
            "attempted to call method '" + options + "'" );
        }
        if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
          return $.error( "no such method '" + options + "' for " + name + " widget instance" );
        }
        methodValue = instance[ options ].apply( instance, args );
        if ( methodValue !== instance && methodValue !== undefined ) {
          returnValue = methodValue && methodValue.jquery ?
            returnValue.pushStack( methodValue.get() ) :
            methodValue;
          return false;
        }
      });
    } else {
      this.each(function() {
        var instance = $.data( this, fullName );
        if ( instance ) {
          instance.option( options || {} )._init();
        } else {
          $.data( this, fullName, new object( options, this ) );
        }
      });
    }

    return returnValue;
  };
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
  widgetName: "widget",
  widgetEventPrefix: "",
  defaultElement: "<div>",
  options: {
    disabled: false,

    // callbacks
    create: null
  },
  _createWidget: function( options, element ) {
    element = $( element || this.defaultElement || this )[ 0 ];
    this.element = $( element );
    this.uuid = uuid++;
    this.eventNamespace = "." + this.widgetName + this.uuid;
    this.options = $.widget.extend( {},
      this.options,
      this._getCreateOptions(),
      options );

    this.bindings = $();
    this.hoverable = $();
    this.focusable = $();

    if ( element !== this ) {
      // 1.9 BC for #7810
      // TODO remove dual storage
      $.data( element, this.widgetName, this );
      $.data( element, this.widgetFullName, this );
      this._on( true, this.element, {
        remove: function( event ) {
          if ( event.target === element ) {
            this.destroy();
          }
        }
      });
      this.document = $( element.style ?
        // element within the document
        element.ownerDocument :
        // element is window or document
        element.document || element );
      this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
    }

    this._create();
    this._trigger( "create", null, this._getCreateEventData() );
    this._init();
  },
  _getCreateOptions: $.noop,
  _getCreateEventData: $.noop,
  _create: $.noop,
  _init: $.noop,

  destroy: function() {
    this._destroy();
    // we can probably remove the unbind calls in 2.0
    // all event bindings should go through this._on()
    this.element
      .unbind( this.eventNamespace )
      // 1.9 BC for #7810
      // TODO remove dual storage
      .removeData( this.widgetName )
      .removeData( this.widgetFullName )
      // support: jquery <1.6.3
      // http://bugs.jquery.com/ticket/9413
      .removeData( $.camelCase( this.widgetFullName ) );
    this.widget()
      .unbind( this.eventNamespace )
      .removeAttr( "aria-disabled" )
      .removeClass(
        this.widgetFullName + "-disabled " +
        "ui-state-disabled" );

    // clean up events and states
    this.bindings.unbind( this.eventNamespace );
    this.hoverable.removeClass( "ui-state-hover" );
    this.focusable.removeClass( "ui-state-focus" );
  },
  _destroy: $.noop,

  widget: function() {
    return this.element;
  },

  option: function( key, value ) {
    var options = key,
      parts,
      curOption,
      i;

    if ( arguments.length === 0 ) {
      // don't return a reference to the internal hash
      return $.widget.extend( {}, this.options );
    }

    if ( typeof key === "string" ) {
      // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
      options = {};
      parts = key.split( "." );
      key = parts.shift();
      if ( parts.length ) {
        curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
        for ( i = 0; i < parts.length - 1; i++ ) {
          curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
          curOption = curOption[ parts[ i ] ];
        }
        key = parts.pop();
        if ( value === undefined ) {
          return curOption[ key ] === undefined ? null : curOption[ key ];
        }
        curOption[ key ] = value;
      } else {
        if ( value === undefined ) {
          return this.options[ key ] === undefined ? null : this.options[ key ];
        }
        options[ key ] = value;
      }
    }

    this._setOptions( options );

    return this;
  },
  _setOptions: function( options ) {
    var key;

    for ( key in options ) {
      this._setOption( key, options[ key ] );
    }

    return this;
  },
  _setOption: function( key, value ) {
    this.options[ key ] = value;

    if ( key === "disabled" ) {
      this.widget()
        .toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
        .attr( "aria-disabled", value );
      this.hoverable.removeClass( "ui-state-hover" );
      this.focusable.removeClass( "ui-state-focus" );
    }

    return this;
  },

  enable: function() {
    return this._setOption( "disabled", false );
  },
  disable: function() {
    return this._setOption( "disabled", true );
  },

  _on: function( suppressDisabledCheck, element, handlers ) {
    var delegateElement,
      instance = this;

    // no suppressDisabledCheck flag, shuffle arguments
    if ( typeof suppressDisabledCheck !== "boolean" ) {
      handlers = element;
      element = suppressDisabledCheck;
      suppressDisabledCheck = false;
    }

    // no element argument, shuffle and use this.element
    if ( !handlers ) {
      handlers = element;
      element = this.element;
      delegateElement = this.widget();
    } else {
      // accept selectors, DOM elements
      element = delegateElement = $( element );
      this.bindings = this.bindings.add( element );
    }

    $.each( handlers, function( event, handler ) {
      function handlerProxy() {
        // allow widgets to customize the disabled handling
        // - disabled as an array instead of boolean
        // - disabled class as method for disabling individual parts
        if ( !suppressDisabledCheck &&
            ( instance.options.disabled === true ||
              $( this ).hasClass( "ui-state-disabled" ) ) ) {
          return;
        }
        return ( typeof handler === "string" ? instance[ handler ] : handler )
          .apply( instance, arguments );
      }

      // copy the guid so direct unbinding works
      if ( typeof handler !== "string" ) {
        handlerProxy.guid = handler.guid =
          handler.guid || handlerProxy.guid || $.guid++;
      }

      var match = event.match( /^(\w+)\s*(.*)$/ ),
        eventName = match[1] + instance.eventNamespace,
        selector = match[2];
      if ( selector ) {
        delegateElement.delegate( selector, eventName, handlerProxy );
      } else {
        element.bind( eventName, handlerProxy );
      }
    });
  },

  _off: function( element, eventName ) {
    eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
    element.unbind( eventName ).undelegate( eventName );
  },

  _delay: function( handler, delay ) {
    function handlerProxy() {
      return ( typeof handler === "string" ? instance[ handler ] : handler )
        .apply( instance, arguments );
    }
    var instance = this;
    return setTimeout( handlerProxy, delay || 0 );
  },

  _hoverable: function( element ) {
    this.hoverable = this.hoverable.add( element );
    this._on( element, {
      mouseenter: function( event ) {
        $( event.currentTarget ).addClass( "ui-state-hover" );
      },
      mouseleave: function( event ) {
        $( event.currentTarget ).removeClass( "ui-state-hover" );
      }
    });
  },

  _focusable: function( element ) {
    this.focusable = this.focusable.add( element );
    this._on( element, {
      focusin: function( event ) {
        $( event.currentTarget ).addClass( "ui-state-focus" );
      },
      focusout: function( event ) {
        $( event.currentTarget ).removeClass( "ui-state-focus" );
      }
    });
  },

  _trigger: function( type, event, data ) {
    var prop, orig,
      callback = this.options[ type ];

    data = data || {};
    event = $.Event( event );
    event.type = ( type === this.widgetEventPrefix ?
      type :
      this.widgetEventPrefix + type ).toLowerCase();
    // the original event may come from any element
    // so we need to reset the target on the new event
    event.target = this.element[ 0 ];

    // copy original event properties over to the new event
    orig = event.originalEvent;
    if ( orig ) {
      for ( prop in orig ) {
        if ( !( prop in event ) ) {
          event[ prop ] = orig[ prop ];
        }
      }
    }

    this.element.trigger( event, data );
    return !( $.isFunction( callback ) &&
      callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
      event.isDefaultPrevented() );
  }
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
  $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
    if ( typeof options === "string" ) {
      options = { effect: options };
    }
    var hasOptions,
      effectName = !options ?
        method :
        options === true || typeof options === "number" ?
          defaultEffect :
          options.effect || defaultEffect;
    options = options || {};
    if ( typeof options === "number" ) {
      options = { duration: options };
    }
    hasOptions = !$.isEmptyObject( options );
    options.complete = callback;
    if ( options.delay ) {
      element.delay( options.delay );
    }
    if ( hasOptions && $.effects && ( $.effects.effect[ effectName ] || $.uiBackCompat !== false && $.effects[ effectName ] ) ) {
      element[ method ]( options );
    } else if ( effectName !== method && element[ effectName ] ) {
      element[ effectName ]( options.duration, options.easing, callback );
    } else {
      element.queue(function( next ) {
        $( this )[ method ]();
        if ( callback ) {
          callback.call( element[ 0 ] );
        }
        next();
      });
    }
  };
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {
  $.Widget.prototype._getCreateOptions = function() {
    if($.metadata && $.metadata.get){
      return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
    }
    return null;
  };
}

})( jQuery );
/*!
 * jQuery UI Mouse 1.9.2
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 *
 * Depends:
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function( e ) {
  mouseHandled = false;
});

$.widget("ui.mouse", {
  version: "1.9.2",
  options: {
    cancel: 'input,textarea,button,select,option',
    distance: 1,
    delay: 0
  },
  _mouseInit: function() {
    var that = this;

    this.element
      .bind('mousedown.'+this.widgetName, function(event) {
        return that._mouseDown(event);
      })
      .bind('click.'+this.widgetName, function(event) {
        if (true === $.data(event.target, that.widgetName + '.preventClickEvent')) {
          $.removeData(event.target, that.widgetName + '.preventClickEvent');
          event.stopImmediatePropagation();
          return false;
        }
      });

    this.started = false;
  },

  // TODO: make sure destroying one instance of mouse doesn't mess with
  // other instances of mouse
  _mouseDestroy: function() {
    this.element.unbind('.'+this.widgetName);
    if ( this._mouseMoveDelegate ) {
      $(document)
        .unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
        .unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);
    }
  },

  _mouseDown: function(event) {
    // don't let more than one widget handle mouseStart
    if( mouseHandled ) { return; }

    // we may have missed mouseup (out of window)
    (this._mouseStarted && this._mouseUp(event));

    this._mouseDownEvent = event;

    var that = this,
      btnIsLeft = (event.which === 1),
      // event.target.nodeName works around a bug in IE 8 with
      // disabled inputs (#7620)
      elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
    if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
      return true;
    }

    this.mouseDelayMet = !this.options.delay;
    if (!this.mouseDelayMet) {
      this._mouseDelayTimer = setTimeout(function() {
        that.mouseDelayMet = true;
      }, this.options.delay);
    }

    if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      this._mouseStarted = (this._mouseStart(event) !== false);
      if (!this._mouseStarted) {
        event.preventDefault();
        return true;
      }
    }

    // Click event may never have fired (Gecko & Opera)
    if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
      $.removeData(event.target, this.widgetName + '.preventClickEvent');
    }

    // these delegates are required to keep context
    this._mouseMoveDelegate = function(event) {
      return that._mouseMove(event);
    };
    this._mouseUpDelegate = function(event) {
      return that._mouseUp(event);
    };
    $(document)
      .bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
      .bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

    event.preventDefault();

    mouseHandled = true;
    return true;
  },

  _mouseMove: function(event) {
    // IE mouseup check - mouseup happened when mouse was out of window
    if ($.ui.ie && !(document.documentMode >= 9) && !event.button) {
      return this._mouseUp(event);
    }

    if (this._mouseStarted) {
      this._mouseDrag(event);
      return event.preventDefault();
    }

    if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      this._mouseStarted =
        (this._mouseStart(this._mouseDownEvent, event) !== false);
      (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
    }

    return !this._mouseStarted;
  },

  _mouseUp: function(event) {
    $(document)
      .unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
      .unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

    if (this._mouseStarted) {
      this._mouseStarted = false;

      if (event.target === this._mouseDownEvent.target) {
        $.data(event.target, this.widgetName + '.preventClickEvent', true);
      }

      this._mouseStop(event);
    }

    return false;
  },

  _mouseDistanceMet: function(event) {
    return (Math.max(
        Math.abs(this._mouseDownEvent.pageX - event.pageX),
        Math.abs(this._mouseDownEvent.pageY - event.pageY)
      ) >= this.options.distance
    );
  },

  _mouseDelayMet: function(event) {
    return this.mouseDelayMet;
  },

  // These are placeholder methods, to be overriden by extending plugin
  _mouseStart: function(event) {},
  _mouseDrag: function(event) {},
  _mouseStop: function(event) {},
  _mouseCapture: function(event) { return true; }
});

})(jQuery);
/*!
 * jQuery UI Slider 1.9.2
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/slider/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

// number of pages in a slider
// (how many times can you page up/down to go through the whole range)
var numPages = 5;

$.widget( "ui.slider", $.ui.mouse, {
  version: "1.9.2",
  widgetEventPrefix: "slide",

  options: {
    animate: false,
    distance: 0,
    max: 100,
    min: 0,
    orientation: "horizontal",
    range: false,
        pointer:true, //show pinter
    step: 1,
    value: 0,
    values: null
  },

  _create: function() {
    var i, handleCount,
      o = this.options,
      existingHandles = this.element.find( ".ui-slider-handle" ).addClass( "ui-state-default ui-corner-all" ),
      handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#' title='" +o.value+ "'></a>",
      handles = [];

    this._keySliding = false;
    this._mouseSliding = false;
    this._animateOff = true;
    this._handleIndex = null;
    this._detectOrientation();
    this._mouseInit();

    this.element
      .addClass( "ui-slider" +
        " ui-slider-" + this.orientation +
        " ui-widget" +
        " ui-widget-content" +
        " ui-corner-all" +
        ( o.disabled ? " ui-slider-disabled ui-disabled" : "" ) );

    this.range = $([]);

    if ( o.range ) {
      if ( o.range === true ) {
        if ( !o.values ) {
          o.values = [ this._valueMin(), this._valueMin() ];
        }
        if ( o.values.length && o.values.length !== 2 ) {
          o.values = [ o.values[0], o.values[0] ];
        }
      }

      this.range = $( "<div></div>" )
        .appendTo( this.element )
        .addClass( "ui-slider-range" +
        // note: this isn't the most fittingly semantic framework class for this element,
        // but worked best visually with a variety of themes
        " ui-widget-header" +
        ( ( o.range === "min" || o.range === "max" ) ? " ui-slider-range-" + o.range : "" ) );
    }

    handleCount = ( o.values && o.values.length ) || 1;

    for ( i = existingHandles.length; i < handleCount; i++ ) {
      handles.push( handle );
    }

    this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( this.element ) );

    this.handle = this.handles.eq( 0 );
    
    
    if (o.pointer) {
      this.point = $("<div class='relative'></div>")               
            .width(this.element.width())
            .css("margin-top",this.element[0].offsetHeight-2)
            .addClass("ui-slider-pointer");
        var pointSpan = "";
        var valueMin = this._valueMin();
        var valueMax = this._valueMax();
        for (var i = valueMin; i <= valueMax; i++) {
            var value = i;
            var valPercent = (valueMax !== valueMin) ? (value - valueMin) / (valueMax - valueMin) * 100 : 0;
            pointSpan += "<span class='ui_sliderPoint absolute'step='" + i + "' style='left:" + valPercent + "%;'><em></em>"
            if (o.text) //add text
                pointSpan += "<p class='ui_point_text'>" + o.text[i] + "</p>"; //show pointer text
                pointSpan+="</span>"
        }
        this.point.append($(pointSpan)).appendTo(this.element);
    }
    
    this.handles.filter( "a" )
      .click(function( event ) {
        event.preventDefault();
      })
      .mouseenter(function() {
        if ( !o.disabled ) {
          $( this ).addClass( "ui-state-hover" );
        }
      })
      .mouseleave(function() {
        $( this ).removeClass( "ui-state-hover" );
      })
      .focus(function() {
        if ( !o.disabled ) {
          $( ".ui-slider .ui-state-focus" ).removeClass( "ui-state-focus" );
          $( this ).addClass( "ui-state-focus" );
        } else {
          $( this ).blur();
        }
      })
      .blur(function() {
        $( this ).removeClass( "ui-state-focus" );
      });

    this.handles.each(function( i ) {
      $( this ).data( "ui-slider-handle-index", i );
    });

    this._on( this.handles, {
      keydown: function( event ) {
        var allowed, curVal, newVal, step,
          index = $( event.target ).data( "ui-slider-handle-index" );

        switch ( event.keyCode ) {
          case $.ui.keyCode.HOME:
          case $.ui.keyCode.END:
          case $.ui.keyCode.PAGE_UP:
          case $.ui.keyCode.PAGE_DOWN:
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            event.preventDefault();
            if ( !this._keySliding ) {
              this._keySliding = true;
              $( event.target ).addClass( "ui-state-active" );
              allowed = this._start( event, index );
              if ( allowed === false ) {
                return;
              }
            }
            break;
        }

        step = this.options.step;
        if ( this.options.values && this.options.values.length ) {
          curVal = newVal = this.values( index );
        } else {
          curVal = newVal = this.value();
        }

        switch ( event.keyCode ) {
          case $.ui.keyCode.HOME:
            newVal = this._valueMin();
            break;
          case $.ui.keyCode.END:
            newVal = this._valueMax();
            break;
          case $.ui.keyCode.PAGE_UP:
            newVal = this._trimAlignValue( curVal + ( (this._valueMax() - this._valueMin()) / numPages ) );
            break;
          case $.ui.keyCode.PAGE_DOWN:
            newVal = this._trimAlignValue( curVal - ( (this._valueMax() - this._valueMin()) / numPages ) );
            break;
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
            if ( curVal === this._valueMax() ) {
              return;
            }
            newVal = this._trimAlignValue( curVal + step );
            break;
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            if ( curVal === this._valueMin() ) {
              return;
            }
            newVal = this._trimAlignValue( curVal - step );
            break;
        }

        this._slide( event, index, newVal );
      },
      keyup: function( event ) {
        var index = $( event.target ).data( "ui-slider-handle-index" );

        if ( this._keySliding ) {
          this._keySliding = false;
          this._stop( event, index );
          this._change( event, index );
          $( event.target ).removeClass( "ui-state-active" );
        }
      }
    });

    this._refreshValue();

    this._animateOff = false;
  },

  _destroy: function() {
    this.handles.remove();
    this.range.remove();

    this.element
      .removeClass( "ui-slider" +
        " ui-slider-horizontal" +
        " ui-slider-vertical" +
        " ui-slider-disabled" +
        " ui-widget" +
        " ui-widget-content" +
        " ui-corner-all" );

    this._mouseDestroy();
  },

  _mouseCapture: function( event ) {
    var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
      that = this,
      o = this.options;

    if ( o.disabled ) {
      return false;
    }

    this.elementSize = {
      width: this.element.outerWidth(),
      height: this.element.outerHeight()
    };
    this.elementOffset = this.element.offset();

    position = { x: event.pageX, y: event.pageY };
    normValue = this._normValueFromMouse( position );
    distance = this._valueMax() - this._valueMin() + 1;
    this.handles.each(function( i ) {
      var thisDistance = Math.abs( normValue - that.values(i) );
      if ( distance > thisDistance ) {
        distance = thisDistance;
        closestHandle = $( this );
        index = i;
      }
    });

    // workaround for bug #3736 (if both handles of a range are at 0,
    // the first is always used as the one with least distance,
    // and moving it is obviously prevented by preventing negative ranges)
    if( o.range === true && this.values(1) === o.min ) {
      index += 1;
      closestHandle = $( this.handles[index] );
    }

    allowed = this._start( event, index );
    if ( allowed === false ) {
      return false;
    }
    this._mouseSliding = true;

    this._handleIndex = index;

    closestHandle
      .addClass( "ui-state-active" )
      .focus();

    offset = closestHandle.offset();
    mouseOverHandle = !$( event.target ).parents().andSelf().is( ".ui-slider-handle" );
    this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
      left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
      top: event.pageY - offset.top -
        ( closestHandle.height() / 2 ) -
        ( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
        ( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
        ( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
    };

    if ( !this.handles.hasClass( "ui-state-hover" ) ) {
      this._slide( event, index, normValue );
    }
    this._animateOff = true;
    return true;
  },

  _mouseStart: function() {
    return true;
  },

  _mouseDrag: function( event ) {
    var position = { x: event.pageX, y: event.pageY },
      normValue = this._normValueFromMouse( position );

    this._slide( event, this._handleIndex, normValue );

    return false;
  },

  _mouseStop: function( event ) {
    this.handles.removeClass( "ui-state-active" );
    this._mouseSliding = false;

    this._stop( event, this._handleIndex );
    this._change( event, this._handleIndex );

    this._handleIndex = null;
    this._clickOffset = null;
    this._animateOff = false;

    return false;
  },

  _detectOrientation: function() {
    this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
  },

  _normValueFromMouse: function( position ) {
    var pixelTotal,
      pixelMouse,
      percentMouse,
      valueTotal,
      valueMouse;

    if ( this.orientation === "horizontal" ) {
      pixelTotal = this.elementSize.width;
      pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
    } else {
      pixelTotal = this.elementSize.height;
      pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
    }

    percentMouse = ( pixelMouse / pixelTotal );
    if ( percentMouse > 1 ) {
      percentMouse = 1;
    }
    if ( percentMouse < 0 ) {
      percentMouse = 0;
    }
    if ( this.orientation === "vertical" ) {
      percentMouse = 1 - percentMouse;
    }

    valueTotal = this._valueMax() - this._valueMin();
    valueMouse = this._valueMin() + percentMouse * valueTotal;

    return this._trimAlignValue( valueMouse );
  },

  _start: function( event, index ) {
    var uiHash = {
      handle: this.handles[ index ],
      value: this.value()
    };
    if ( this.options.values && this.options.values.length ) {
      uiHash.value = this.values( index );
      uiHash.values = this.values();
    }
    return this._trigger( "start", event, uiHash );
  },

  _slide: function( event, index, newVal ) {
    var otherVal,
      newValues,
      allowed;

    if ( this.options.values && this.options.values.length ) {
      otherVal = this.values( index ? 0 : 1 );

      if ( ( this.options.values.length === 2 && this.options.range === true ) &&
          ( ( index === 0 && newVal > otherVal) || ( index === 1 && newVal < otherVal ) )
        ) {
        newVal = otherVal;
      }

      if ( newVal !== this.values( index ) ) {
        newValues = this.values();
        newValues[ index ] = newVal;
        // A slide can be canceled by returning false from the slide callback
        allowed = this._trigger( "slide", event, {
          handle: this.handles[ index ],
          value: newVal,
          values: newValues
        } );
        otherVal = this.values( index ? 0 : 1 );
        if ( allowed !== false ) {
          this.values( index, newVal, true );
        }
      }
    } else {
      if ( newVal !== this.value() ) {
        // A slide can be canceled by returning false from the slide callback
        allowed = this._trigger( "slide", event, {
          handle: this.handles[ index ],
          value: newVal
        } );
        if ( allowed !== false ) {
          this.value( newVal );
        }
      }
    }
  },

  _stop: function( event, index ) {
    var uiHash = {
      handle: this.handles[ index ],
      value: this.value()
    };
    if ( this.options.values && this.options.values.length ) {
      uiHash.value = this.values( index );
      uiHash.values = this.values();
    }

    this._trigger( "stop", event, uiHash );
  },

  _change: function( event, index ) {
    if ( !this._keySliding && !this._mouseSliding ) {
      var uiHash = {
        handle: this.handles[ index ],
        value: this.value()
      };
      if ( this.options.values && this.options.values.length ) {
        uiHash.value = this.values( index );
        uiHash.values = this.values();
      }
      uiHash.handle.title = uiHash.value; //update title
      this._trigger( "change", event, uiHash );
    }
  },

  value: function( newValue ) {
    if ( arguments.length ) {
      this.options.value = this._trimAlignValue( newValue );
      this._refreshValue();
      this._change( null, 0 );
      return;
    }

    return this._value();
  },

  values: function( index, newValue ) {
    var vals,
      newValues,
      i;

    if ( arguments.length > 1 ) {
      this.options.values[ index ] = this._trimAlignValue( newValue );
      this._refreshValue();
      this._change( null, index );
      return;
    }

    if ( arguments.length ) {
      if ( $.isArray( arguments[ 0 ] ) ) {
        vals = this.options.values;
        newValues = arguments[ 0 ];
        for ( i = 0; i < vals.length; i += 1 ) {
          vals[ i ] = this._trimAlignValue( newValues[ i ] );
          this._change( null, i );
        }
        this._refreshValue();
      } else {
        if ( this.options.values && this.options.values.length ) {
          return this._values( index );
        } else {
          return this.value();
        }
      }
    } else {
      return this._values();
    }
  },

  _setOption: function( key, value ) {
    var i,
      valsLength = 0;

    if ( $.isArray( this.options.values ) ) {
      valsLength = this.options.values.length;
    }

    $.Widget.prototype._setOption.apply( this, arguments );

    switch ( key ) {
      case "disabled":
        if ( value ) {
          this.handles.filter( ".ui-state-focus" ).blur();
          this.handles.removeClass( "ui-state-hover" );
          this.handles.prop( "disabled", true );
          this.element.addClass( "ui-disabled" );
        } else {
          this.handles.prop( "disabled", false );
          this.element.removeClass( "ui-disabled" );
        }
        break;
      case "orientation":
        this._detectOrientation();
        this.element
          .removeClass( "ui-slider-horizontal ui-slider-vertical" )
          .addClass( "ui-slider-" + this.orientation );
        this._refreshValue();
        break;
      case "value":
        this._animateOff = true;
        this._refreshValue();
        this._change( null, 0 );
        this._animateOff = false;
        break;
      case "values":
        this._animateOff = true;
        this._refreshValue();
        for ( i = 0; i < valsLength; i += 1 ) {
          this._change( null, i );
        }
        this._animateOff = false;
        break;
      case "min":
      case "max":
        this._animateOff = true;
        this._refreshValue();
        this._animateOff = false;
        break;
    }
  },

  //internal value getter
  // _value() returns value trimmed by min and max, aligned by step
  _value: function() {
    var val = this.options.value;
    val = this._trimAlignValue( val );

    return val;
  },

  //internal values getter
  // _values() returns array of values trimmed by min and max, aligned by step
  // _values( index ) returns single value trimmed by min and max, aligned by step
  _values: function( index ) {
    var val,
      vals,
      i;

    if ( arguments.length ) {
      val = this.options.values[ index ];
      val = this._trimAlignValue( val );

      return val;
    } else {
      // .slice() creates a copy of the array
      // this copy gets trimmed by min and max and then returned
      vals = this.options.values.slice();
      for ( i = 0; i < vals.length; i+= 1) {
        vals[ i ] = this._trimAlignValue( vals[ i ] );
      }

      return vals;
    }
  },

  // returns the step-aligned value that val is closest to, between (inclusive) min and max
  _trimAlignValue: function( val ) {
    if ( val <= this._valueMin() ) {
      return this._valueMin();
    }
    if ( val >= this._valueMax() ) {
      return this._valueMax();
    }
    var step = ( this.options.step > 0 ) ? this.options.step : 1,
      valModStep = (val - this._valueMin()) % step,
      alignValue = val - valModStep;

    if ( Math.abs(valModStep) * 2 >= step ) {
      alignValue += ( valModStep > 0 ) ? step : ( -step );
    }

    // Since JavaScript has problems with large floats, round
    // the final value to 5 digits after the decimal point (see #4124)
    return parseFloat( alignValue.toFixed(5) );
  },

  _valueMin: function() {
    return this.options.min;
  },

  _valueMax: function() {
    return this.options.max;
  },

  _refreshValue: function() {
    var lastValPercent, valPercent, value, valueMin, valueMax,
      oRange = this.options.range,
      o = this.options,
      that = this,
      animate = ( !this._animateOff ) ? o.animate : false,
      _set = {};

    if ( this.options.values && this.options.values.length ) {
      this.handles.each(function( i ) {
        valPercent = ( that.values(i) - that._valueMin() ) / ( that._valueMax() - that._valueMin() ) * 100;
        _set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
        $( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
        if (that.options.range === true) {
            
          if ( that.orientation === "horizontal" ) {
            if ( i === 0 ) {
              that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { left: valPercent + "%" }, o.animate );
            }
            if ( i === 1 ) {
              that.range[ animate ? "animate" : "css" ]( { width: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
            }
          } else {
            if ( i === 0 ) {
              that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { bottom: ( valPercent ) + "%" }, o.animate );
            }
            if ( i === 1 ) {
              that.range[ animate ? "animate" : "css" ]( { height: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
            }
          }
        }
        lastValPercent = valPercent;
      });
    } else {
      value = this.value();
      valueMin = this._valueMin();
      valueMax = this._valueMax();
      valPercent = ( valueMax !== valueMin ) ?
          ( value - valueMin ) / ( valueMax - valueMin ) * 100 :
          0;
      _set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
      this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

      if ( oRange === "min" && this.orientation === "horizontal" ) {
        this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { width: valPercent + "%" }, o.animate );
      }
      if ( oRange === "max" && this.orientation === "horizontal" ) {
        this.range[ animate ? "animate" : "css" ]( { width: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
      }
      if ( oRange === "min" && this.orientation === "vertical" ) {
        this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { height: valPercent + "%" }, o.animate );
      }
      if ( oRange === "max" && this.orientation === "vertical" ) {
        this.range[ animate ? "animate" : "css" ]( { height: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
      }
    }
  }

});

}(jQuery));

/*!
 * jQuery UI Draggable 1.9.2
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/draggable/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
  version: "1.9.2",
  widgetEventPrefix: "drag",
  options: {
    addClasses: true,
    appendTo: "parent",
    axis: false,
    connectToSortable: false,
    containment: false,
    cursor: "auto",
    cursorAt: false,
    grid: false,
    handle: false,
    helper: "original",
    iframeFix: false,
    opacity: false,
    refreshPositions: false,
    revert: false,
    revertDuration: 500,
    scope: "default",
    scroll: true,
    scrollSensitivity: 20,
    scrollSpeed: 20,
    snap: false,
    snapMode: "both",
    snapTolerance: 20,
    stack: false,
    zIndex: false
  },
  _create: function() {

    if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
      this.element[0].style.position = 'relative';

    (this.options.addClasses && this.element.addClass("ui-draggable"));
    (this.options.disabled && this.element.addClass("ui-draggable-disabled"));

    this._mouseInit();

  },

  _destroy: function() {
    this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
    this._mouseDestroy();
  },

  _mouseCapture: function(event) {

    var o = this.options;

    // among others, prevent a drag on a resizable-handle
    if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
      return false;

    //Quit if we're not on a valid handle
    this.handle = this._getHandle(event);
    if (!this.handle)
      return false;

    $(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
      $('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
      .css({
        width: this.offsetWidth+"px", height: this.offsetHeight+"px",
        position: "absolute", opacity: "0.001", zIndex: 1000
      })
      .css($(this).offset())
      .appendTo("body");
    });

    return true;

  },

  _mouseStart: function(event) {

    var o = this.options;

    //Create and append the visible helper
    this.helper = this._createHelper(event);

    this.helper.addClass("ui-draggable-dragging");

    //Cache the helper size
    this._cacheHelperProportions();

    //If ddmanager is used for droppables, set the global draggable
    if($.ui.ddmanager)
      $.ui.ddmanager.current = this;

    /*
     * - Position generation -
     * This block generates everything position related - it's the core of draggables.
     */

    //Cache the margins of the original element
    this._cacheMargins();

    //Store the helper's css position
    this.cssPosition = this.helper.css("position");
    this.scrollParent = this.helper.scrollParent();

    //The element's absolute position on the page minus margins
    this.offset = this.positionAbs = this.element.offset();
    this.offset = {
      top: this.offset.top - this.margins.top,
      left: this.offset.left - this.margins.left
    };

    $.extend(this.offset, {
      click: { //Where the click happened, relative to the element
        left: event.pageX - this.offset.left,
        top: event.pageY - this.offset.top
      },
      parent: this._getParentOffset(),
      relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
    });

    //Generate the original position
    this.originalPosition = this.position = this._generatePosition(event);
    this.originalPageX = event.pageX;
    this.originalPageY = event.pageY;

    //Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
    (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

    //Set a containment if given in the options
    if(o.containment)
      this._setContainment();

    //Trigger event + callbacks
    if(this._trigger("start", event) === false) {
      this._clear();
      return false;
    }

    //Recache the helper size
    this._cacheHelperProportions();

    //Prepare the droppable offsets
    if ($.ui.ddmanager && !o.dropBehaviour)
      $.ui.ddmanager.prepareOffsets(this, event);


    this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

    //If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
    if ( $.ui.ddmanager ) $.ui.ddmanager.dragStart(this, event);

    return true;
  },

  _mouseDrag: function(event, noPropagation) {

    //Compute the helpers position
    this.position = this._generatePosition(event);
    this.positionAbs = this._convertPositionTo("absolute");

    //Call plugins and callbacks and use the resulting position if something is returned
    if (!noPropagation) {
      var ui = this._uiHash();
      if(this._trigger('drag', event, ui) === false) {
        this._mouseUp({});
        return false;
      }
      this.position = ui.position;
    }

    if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
    if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
    if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

    return false;
  },

  _mouseStop: function(event) {

    //If we are using droppables, inform the manager about the drop
    var dropped = false;
    if ($.ui.ddmanager && !this.options.dropBehaviour)
      dropped = $.ui.ddmanager.drop(this, event);

    //if a drop comes from outside (a sortable)
    if(this.dropped) {
      dropped = this.dropped;
      this.dropped = false;
    }

    //if the original element is no longer in the DOM don't bother to continue (see #8269)
    var element = this.element[0], elementInDom = false;
    while ( element && (element = element.parentNode) ) {
      if (element == document ) {
        elementInDom = true;
      }
    }
    if ( !elementInDom && this.options.helper === "original" )
      return false;

    if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
      var that = this;
      $(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
        if(that._trigger("stop", event) !== false) {
          that._clear();
        }
      });
    } else {
      if(this._trigger("stop", event) !== false) {
        this._clear();
      }
    }

    return false;
  },

  _mouseUp: function(event) {
    //Remove frame helpers
    $("div.ui-draggable-iframeFix").each(function() {
      this.parentNode.removeChild(this);
    });

    //If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
    if( $.ui.ddmanager ) $.ui.ddmanager.dragStop(this, event);

    return $.ui.mouse.prototype._mouseUp.call(this, event);
  },

  cancel: function() {

    if(this.helper.is(".ui-draggable-dragging")) {
      this._mouseUp({});
    } else {
      this._clear();
    }

    return this;

  },

  _getHandle: function(event) {

    var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
    $(this.options.handle, this.element)
      .find("*")
      .andSelf()
      .each(function() {
        if(this == event.target) handle = true;
      });

    return handle;

  },

  _createHelper: function(event) {

    var o = this.options;
    var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);

    if(!helper.parents('body').length)
      helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

    if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
      helper.css("position", "absolute");

    return helper;

  },

  _adjustOffsetFromHelper: function(obj) {
    if (typeof obj == 'string') {
      obj = obj.split(' ');
    }
    if ($.isArray(obj)) {
      obj = {left: +obj[0], top: +obj[1] || 0};
    }
    if ('left' in obj) {
      this.offset.click.left = obj.left + this.margins.left;
    }
    if ('right' in obj) {
      this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
    }
    if ('top' in obj) {
      this.offset.click.top = obj.top + this.margins.top;
    }
    if ('bottom' in obj) {
      this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
    }
  },

  _getParentOffset: function() {

    //Get the offsetParent and cache its position
    this.offsetParent = this.helper.offsetParent();
    var po = this.offsetParent.offset();

    // This is a special case where we need to modify a offset calculated on start, since the following happened:
    // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
    // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
    //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
    if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
      po.left += this.scrollParent.scrollLeft();
      po.top += this.scrollParent.scrollTop();
    }

    if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
    || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.ui.ie)) //Ugly IE fix
      po = { top: 0, left: 0 };

    return {
      top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
      left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
    };

  },

  _getRelativeOffset: function() {

    if(this.cssPosition == "relative") {
      var p = this.element.position();
      return {
        top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
        left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
      };
    } else {
      return { top: 0, left: 0 };
    }

  },

  _cacheMargins: function() {
    this.margins = {
      left: (parseInt(this.element.css("marginLeft"),10) || 0),
      top: (parseInt(this.element.css("marginTop"),10) || 0),
      right: (parseInt(this.element.css("marginRight"),10) || 0),
      bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
    };
  },

  _cacheHelperProportions: function() {
    this.helperProportions = {
      width: this.helper.outerWidth(),
      height: this.helper.outerHeight()
    };
  },

  _setContainment: function() {

    var o = this.options;
    if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
    if(o.containment == 'document' || o.containment == 'window') this.containment = [
      o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
      o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
      (o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
      (o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
    ];

    if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
      var c = $(o.containment);
      var ce = c[0]; if(!ce) return;
      var co = c.offset();
      var over = ($(ce).css("overflow") != 'hidden');

      this.containment = [
        (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
        (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
        (over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
        (over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
      ];
      this.relative_container = c;

    } else if(o.containment.constructor == Array) {
      this.containment = o.containment;
    }

  },

  _convertPositionTo: function(d, pos) {

    if(!pos) pos = this.position;
    var mod = d == "absolute" ? 1 : -1;
    var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

    return {
      top: (
        pos.top                                 // The absolute mouse position
        + this.offset.relative.top * mod                    // Only for relative positioned nodes: Relative offset from element to offset parent
        + this.offset.parent.top * mod                      // The offsetParent's offset without borders (offset + border)
        - ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
      ),
      left: (
        pos.left                                // The absolute mouse position
        + this.offset.relative.left * mod                   // Only for relative positioned nodes: Relative offset from element to offset parent
        + this.offset.parent.left * mod                     // The offsetParent's offset without borders (offset + border)
        - ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
      )
    };

  },

  _generatePosition: function(event) {

    var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
    var pageX = event.pageX;
    var pageY = event.pageY;

    /*
     * - Position constraining -
     * Constrain the position to a mix of grid, containment.
     */

    if(this.originalPosition) { //If we are not dragging yet, we won't check for options
      var containment;
      if(this.containment) {
      if (this.relative_container){
        var co = this.relative_container.offset();
        containment = [ this.containment[0] + co.left,
          this.containment[1] + co.top,
          this.containment[2] + co.left,
          this.containment[3] + co.top ];
      }
      else {
        containment = this.containment;
      }

        if(event.pageX - this.offset.click.left < containment[0]) pageX = containment[0] + this.offset.click.left;
        if(event.pageY - this.offset.click.top < containment[1]) pageY = containment[1] + this.offset.click.top;
        if(event.pageX - this.offset.click.left > containment[2]) pageX = containment[2] + this.offset.click.left;
        if(event.pageY - this.offset.click.top > containment[3]) pageY = containment[3] + this.offset.click.top;
      }

      if(o.grid) {
        //Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
        var top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
        pageY = containment ? (!(top - this.offset.click.top < containment[1] || top - this.offset.click.top > containment[3]) ? top : (!(top - this.offset.click.top < containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

        var left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
        pageX = containment ? (!(left - this.offset.click.left < containment[0] || left - this.offset.click.left > containment[2]) ? left : (!(left - this.offset.click.left < containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
      }

    }

    return {
      top: (
        pageY                               // The absolute mouse position
        - this.offset.click.top                         // Click offset (relative to the element)
        - this.offset.relative.top                        // Only for relative positioned nodes: Relative offset from element to offset parent
        - this.offset.parent.top                        // The offsetParent's offset without borders (offset + border)
        + ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
      ),
      left: (
        pageX                               // The absolute mouse position
        - this.offset.click.left                        // Click offset (relative to the element)
        - this.offset.relative.left                       // Only for relative positioned nodes: Relative offset from element to offset parent
        - this.offset.parent.left                       // The offsetParent's offset without borders (offset + border)
        + ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
      )
    };

  },

  _clear: function() {
    this.helper.removeClass("ui-draggable-dragging");
    if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
    //if($.ui.ddmanager) $.ui.ddmanager.current = null;
    this.helper = null;
    this.cancelHelperRemoval = false;
  },

  // From now on bulk stuff - mainly helpers

  _trigger: function(type, event, ui) {
    ui = ui || this._uiHash();
    $.ui.plugin.call(this, type, [event, ui]);
    if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
    return $.Widget.prototype._trigger.call(this, type, event, ui);
  },

  plugins: {},

  _uiHash: function(event) {
    return {
      helper: this.helper,
      position: this.position,
      originalPosition: this.originalPosition,
      offset: this.positionAbs
    };
  }

});

$.ui.plugin.add("draggable", "connectToSortable", {
  start: function(event, ui) {

    var inst = $(this).data("draggable"), o = inst.options,
      uiSortable = $.extend({}, ui, { item: inst.element });
    inst.sortables = [];
    $(o.connectToSortable).each(function() {
      var sortable = $.data(this, 'sortable');
      if (sortable && !sortable.options.disabled) {
        inst.sortables.push({
          instance: sortable,
          shouldRevert: sortable.options.revert
        });
        sortable.refreshPositions();  // Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
        sortable._trigger("activate", event, uiSortable);
      }
    });

  },
  stop: function(event, ui) {

    //If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
    var inst = $(this).data("draggable"),
      uiSortable = $.extend({}, ui, { item: inst.element });

    $.each(inst.sortables, function() {
      if(this.instance.isOver) {

        this.instance.isOver = 0;

        inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
        this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

        //The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
        if(this.shouldRevert) this.instance.options.revert = true;

        //Trigger the stop of the sortable
        this.instance._mouseStop(event);

        this.instance.options.helper = this.instance.options._helper;

        //If the helper has been the original item, restore properties in the sortable
        if(inst.options.helper == 'original')
          this.instance.currentItem.css({ top: 'auto', left: 'auto' });

      } else {
        this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
        this.instance._trigger("deactivate", event, uiSortable);
      }

    });

  },
  drag: function(event, ui) {

    var inst = $(this).data("draggable"), that = this;

    var checkPos = function(o) {
      var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
      var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
      var itemHeight = o.height, itemWidth = o.width;
      var itemTop = o.top, itemLeft = o.left;

      return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
    };

    $.each(inst.sortables, function(i) {

      var innermostIntersecting = false;
      var thisSortable = this;
      //Copy over some variables to allow calling the sortable's native _intersectsWith
      this.instance.positionAbs = inst.positionAbs;
      this.instance.helperProportions = inst.helperProportions;
      this.instance.offset.click = inst.offset.click;

      if(this.instance._intersectsWith(this.instance.containerCache)) {
        innermostIntersecting = true;
        $.each(inst.sortables, function () {
          this.instance.positionAbs = inst.positionAbs;
          this.instance.helperProportions = inst.helperProportions;
          this.instance.offset.click = inst.offset.click;
          if  (this != thisSortable
            && this.instance._intersectsWith(this.instance.containerCache)
            && $.ui.contains(thisSortable.instance.element[0], this.instance.element[0]))
            innermostIntersecting = false;
            return innermostIntersecting;
        });
      }


      if(innermostIntersecting) {
        //If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
        if(!this.instance.isOver) {

          this.instance.isOver = 1;
          //Now we fake the start of dragging for the sortable instance,
          //by cloning the list group item, appending it to the sortable and using it as inst.currentItem
          //We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
          this.instance.currentItem = $(that).clone().removeAttr('id').appendTo(this.instance.element).data("sortable-item", true);
          this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
          this.instance.options.helper = function() { return ui.helper[0]; };

          event.target = this.instance.currentItem[0];
          this.instance._mouseCapture(event, true);
          this.instance._mouseStart(event, true, true);

          //Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
          this.instance.offset.click.top = inst.offset.click.top;
          this.instance.offset.click.left = inst.offset.click.left;
          this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
          this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

          inst._trigger("toSortable", event);
          inst.dropped = this.instance.element; //draggable revert needs that
          //hack so receive/update callbacks work (mostly)
          inst.currentItem = inst.element;
          this.instance.fromOutside = inst;

        }

        //Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
        if(this.instance.currentItem) this.instance._mouseDrag(event);

      } else {

        //If it doesn't intersect with the sortable, and it intersected before,
        //we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
        if(this.instance.isOver) {

          this.instance.isOver = 0;
          this.instance.cancelHelperRemoval = true;

          //Prevent reverting on this forced stop
          this.instance.options.revert = false;

          // The out event needs to be triggered independently
          this.instance._trigger('out', event, this.instance._uiHash(this.instance));

          this.instance._mouseStop(event, true);
          this.instance.options.helper = this.instance.options._helper;

          //Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
          this.instance.currentItem.remove();
          if(this.instance.placeholder) this.instance.placeholder.remove();

          inst._trigger("fromSortable", event);
          inst.dropped = false; //draggable revert needs that
        }

      };

    });

  }
});

$.ui.plugin.add("draggable", "cursor", {
  start: function(event, ui) {
    var t = $('body'), o = $(this).data('draggable').options;
    if (t.css("cursor")) o._cursor = t.css("cursor");
    t.css("cursor", o.cursor);
  },
  stop: function(event, ui) {
    var o = $(this).data('draggable').options;
    if (o._cursor) $('body').css("cursor", o._cursor);
  }
});

$.ui.plugin.add("draggable", "opacity", {
  start: function(event, ui) {
    var t = $(ui.helper), o = $(this).data('draggable').options;
    if(t.css("opacity")) o._opacity = t.css("opacity");
    t.css('opacity', o.opacity);
  },
  stop: function(event, ui) {
    var o = $(this).data('draggable').options;
    if(o._opacity) $(ui.helper).css('opacity', o._opacity);
  }
});

$.ui.plugin.add("draggable", "scroll", {
  start: function(event, ui) {
    var i = $(this).data("draggable");
    if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
  },
  drag: function(event, ui) {

    var i = $(this).data("draggable"), o = i.options, scrolled = false;

    if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

      if(!o.axis || o.axis != 'x') {
        if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
          i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
        else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
          i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
      }

      if(!o.axis || o.axis != 'y') {
        if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
          i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
        else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
          i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
      }

    } else {

      if(!o.axis || o.axis != 'x') {
        if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
          scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
        else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
          scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
      }

      if(!o.axis || o.axis != 'y') {
        if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
          scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
        else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
          scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
      }

    }

    if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
      $.ui.ddmanager.prepareOffsets(i, event);

  }
});

$.ui.plugin.add("draggable", "snap", {
  start: function(event, ui) {

    var i = $(this).data("draggable"), o = i.options;
    i.snapElements = [];

    $(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
      var $t = $(this); var $o = $t.offset();
      if(this != i.element[0]) i.snapElements.push({
        item: this,
        width: $t.outerWidth(), height: $t.outerHeight(),
        top: $o.top, left: $o.left
      });
    });

  },
  drag: function(event, ui) {

    var inst = $(this).data("draggable"), o = inst.options;
    var d = o.snapTolerance;

    var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
      y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

    for (var i = inst.snapElements.length - 1; i >= 0; i--){

      var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
        t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

      //Yes, I know, this is insane ;)
      if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
        if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
        inst.snapElements[i].snapping = false;
        continue;
      }

      if(o.snapMode != 'inner') {
        var ts = Math.abs(t - y2) <= d;
        var bs = Math.abs(b - y1) <= d;
        var ls = Math.abs(l - x2) <= d;
        var rs = Math.abs(r - x1) <= d;
        if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
        if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
        if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
        if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
      }

      var first = (ts || bs || ls || rs);

      if(o.snapMode != 'outer') {
        var ts = Math.abs(t - y1) <= d;
        var bs = Math.abs(b - y2) <= d;
        var ls = Math.abs(l - x1) <= d;
        var rs = Math.abs(r - x2) <= d;
        if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
        if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
        if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
        if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
      }

      if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
        (inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
      inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

    };

  }
});

$.ui.plugin.add("draggable", "stack", {
  start: function(event, ui) {

    var o = $(this).data("draggable").options;

    var group = $.makeArray($(o.stack)).sort(function(a,b) {
      return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
    });
    if (!group.length) { return; }

    var min = parseInt(group[0].style.zIndex) || 0;
    $(group).each(function(i) {
      this.style.zIndex = min + i;
    });

    this[0].style.zIndex = min + group.length;

  }
});

$.ui.plugin.add("draggable", "zIndex", {
  start: function(event, ui) {
    var t = $(ui.helper), o = $(this).data("draggable").options;
    if(t.css("zIndex")) o._zIndex = t.css("zIndex");
    t.css('zIndex', o.zIndex);
  },
  stop: function(event, ui) {
    var o = $(this).data("draggable").options;
    if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
  }
});

})(jQuery);
/*!
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery resize event
//
// *Version: 1.1, Last updated: 3/14/2010*
// 
// Project Home - http://benalman.com/projects/jquery-resize-plugin/
// GitHub       - http://github.com/cowboy/jquery-resize/
// Source       - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.js
// (Minified)   - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.min.js (1.0kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// This working example, complete with fully commented code, illustrates a few
// ways in which this plugin can be used.
// 
// resize event - http://benalman.com/code/projects/jquery-resize/examples/resize/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-resize/unit/
// 
// About: Release History
// 
// 1.1 - (3/14/2010) Fixed a minor bug that was causing the event to trigger
//       immediately after bind in some circumstances. Also changed $.fn.data
//       to $.data to improve performance.
// 1.0 - (2/10/2010) Initial release

(function($,window,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // A jQuery object containing all non-window elements to which the resize
  // event is bound.
  var elems = $([]),
    
    // Extend $.resize if it already exists, otherwise create it.
    jq_resize = $.resize = $.extend( $.resize, {} ),
    
    timeout_id,
    
    // Reused strings.
    str_setTimeout = 'setTimeout',
    str_resize = 'resize',
    str_data = str_resize + '-special-event',
    str_delay = 'delay',
    str_throttle = 'throttleWindow';
  
  // Property: jQuery.resize.delay
  // 
  // The numeric interval (in milliseconds) at which the resize event polling
  // loop executes. Defaults to 250.
  
  jq_resize[ str_delay ] = 250;
  
  // Property: jQuery.resize.throttleWindow
  // 
  // Throttle the native window object resize event to fire no more than once
  // every <jQuery.resize.delay> milliseconds. Defaults to true.
  // 
  // Because the window object has its own resize event, it doesn't need to be
  // provided by this plugin, and its execution can be left entirely up to the
  // browser. However, since certain browsers fire the resize event continuously
  // while others do not, enabling this will throttle the window resize event,
  // making event behavior consistent across all elements in all browsers.
  // 
  // While setting this property to false will disable window object resize
  // event throttling, please note that this property must be changed before any
  // window object resize event callbacks are bound.
  
  jq_resize[ str_throttle ] = true;
  
  // Event: resize event
  // 
  // Fired when an element's width or height changes. Because browsers only
  // provide this event for the window element, for other elements a polling
  // loop is initialized, running every <jQuery.resize.delay> milliseconds
  // to see if elements' dimensions have changed. You may bind with either
  // .resize( fn ) or .bind( "resize", fn ), and unbind with .unbind( "resize" ).
  // 
  // Usage:
  // 
  // > jQuery('selector').bind( 'resize', function(e) {
  // >   // element's width or height has changed!
  // >   ...
  // > });
  // 
  // Additional Notes:
  // 
  // * The polling loop is not created until at least one callback is actually
  //   bound to the 'resize' event, and this single polling loop is shared
  //   across all elements.
  // 
  // Double firing issue in jQuery 1.3.2:
  // 
  // While this plugin works in jQuery 1.3.2, if an element's event callbacks
  // are manually triggered via .trigger( 'resize' ) or .resize() those
  // callbacks may double-fire, due to limitations in the jQuery 1.3.2 special
  // events system. This is not an issue when using jQuery 1.4+.
  // 
  // > // While this works in jQuery 1.4+
  // > $(elem).css({ width: new_w, height: new_h }).resize();
  // > 
  // > // In jQuery 1.3.2, you need to do this:
  // > var elem = $(elem);
  // > elem.css({ width: new_w, height: new_h });
  // > elem.data( 'resize-special-event', { width: elem.width(), height: elem.height() } );
  // > elem.resize();
      
  $.event.special[ str_resize ] = {
    
    // Called only when the first 'resize' event callback is bound per element.
    setup: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will bind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var elem = $(this);
      
      // Add this element to the list of internal elements to monitor.
      elems = elems.add( elem );
      
      // Initialize data store on the element.
      $.data( this, str_data, { w: elem.width(), h: elem.height() } );
      
      // If this is the first element added, start the polling loop.
      if ( elems.length === 1 ) {
        loopy();
      }
    },
    
    // Called only when the last 'resize' event callback is unbound per element.
    teardown: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will unbind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var elem = $(this);
      
      // Remove this element from the list of internal elements to monitor.
      elems = elems.not( elem );
      
      // Remove any data stored on the element.
      elem.removeData( str_data );
      
      // If this is the last element removed, stop the polling loop.
      if ( !elems.length ) {
        clearTimeout( timeout_id );
      }
    },
    
    // Called every time a 'resize' event callback is bound per element (new in
    // jQuery 1.4).
    add: function( handleObj ) {
      // Since window has its own native 'resize' event, return false so that
      // jQuery doesn't modify the event object. Unless, of course, we're
      // throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var old_handler;
      
      // The new_handler function is executed every time the event is triggered.
      // This is used to update the internal element data store with the width
      // and height when the event is triggered manually, to avoid double-firing
      // of the event callback. See the "Double firing issue in jQuery 1.3.2"
      // comments above for more information.
      
      function new_handler( e, w, h ) {
        var elem = $(this),
          data = $.data( this, str_data );
        
        // If called from the polling loop, w and h will be passed in as
        // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
        // those values will need to be computed.
        data.w = w !== undefined ? w : elem.width();
        data.h = h !== undefined ? h : elem.height();
        
        old_handler.apply( this, arguments );
      };
      
      // This may seem a little complicated, but it normalizes the special event
      // .add method between jQuery 1.4/1.4.1 and 1.4.2+
      if ( $.isFunction( handleObj ) ) {
        // 1.4, 1.4.1
        old_handler = handleObj;
        return new_handler;
      } else {
        // 1.4.2+
        old_handler = handleObj.handler;
        handleObj.handler = new_handler;
      }
    }
    
  };
  
  function loopy() {
    
    // Start the polling loop, asynchronously.
    timeout_id = window[ str_setTimeout ](function(){
      
      // Iterate over all elements to which the 'resize' event is bound.
      elems.each(function(){
        var elem = $(this),
          width = elem.width(),
          height = elem.height(),
          data = $.data( this, str_data );
        
        // If element size has changed since the last time, update the element
        // data store and trigger the 'resize' event.
        if ( width !== data.w || height !== data.h ) {
          elem.trigger( str_resize, [ data.w = width, data.h = height ] );
        }
        
      });
      
      // Loop.
      loopy();
      
    }, jq_resize[ str_delay ] );
    
  };
  
})(jQuery,this);
