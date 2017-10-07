var CallerResponder = new Class({
  debug : false,
  context : new Object(),
  error : function(request, settings, e) {
    if (request.status == 500) {
      var jsonError = jQuery.parseJSON(request.responseText);
    }
    if (this.debug) {
      alert("ajax error: " + request.responseText);
      alert(e);
    }
  },
  complete : function(res, status) {
    if (this.debug) {
      alert("ajax complete");
    }
  },
  beforeSend : function(xml) {
    if (this.debug) {
      alert("ajax beforeSend:" + xml);
    }
  }
});

var RemoteJsonService = new Class({
  jsonGateway : "/json/",
  async : true,
  ajaxCall : function(args, bsMethod) {
    var callbackOption = null;
    if (args.length >= 1) {
      var tmpArg_2 = args[args.length - 1];
      if (typeof (tmpArg_2.success) != "undefined"
          && $.isFunction(tmpArg_2.success)) {
        callbackOption = tmpArg_2;
        Array.prototype.splice.apply(args, [ args.length - 1, 1 ]);
      }
    }
    var newArgs = new Array();
    for ( var i = 0; i < args.length; i++) {
      newArgs[i] = args[i];
      // If this param object is invalid, hault this ajax
      if ($._isInValid(newArgs[i]))
        return null;
    }
    var data = new Object();
    data.managerMethod = bsMethod;
    data.service = this.serviceName;
    data.arguments = $.toJSON(newArgs);

    var result = null;
    if (callbackOption && callbackOption.success) {
      this.async = true;
      callbackOption = $.extend(new CallerResponder(), callbackOption);
    } else {
      this.async = false;
      callbackOption = new CallerResponder();
      callbackOption.success = function(jsonObj) {
        if (typeof jsonObj === 'string')
          result = $.parseJSON(jsonObj); 
        else
          result = jsonObj;
      }
    }

    jQuery.ajax({
      type : "POST",
      url : this.jsonGateway,
      data : data,
      dataType : "json",
      async : this.async,
      success : callbackOption.success,
      error : callbackOption.error,
      complete : callbackOption.complete
    });
    return result;
  }
});