/*
 * jQuery Ajax Paging Grid Plugin @requires jQuery v1.3 or later, jquery.json,
 * jquery.jsongateway @author Andy
 */
(function($) {

  var _managerNames = [], _defaultPageSize = 20;
  /**
   * $.fn.ajaxgrid() provides a mechanism for generating ajax paging grid, no
   * more script or code, very convenient.
   */
  $.fn.ajaxgridbar = function(options) {
    var settings = {
      size : _defaultPageSize,
      async : true,
      page : 1,
      page_btn : "_page_btn",
      page_id : "_page_id",
      afpPageId : "_afpPage",
      afpPagesId : "_afpPages",
      afpTotalId : "_afpTotal",
      afpSizeId : "_afpSize",
      afpFirstId : "_afpFirst",
      afpPreviousId : "_afpPrevious",
      afpNextId : "_afpNext",
      afpLastId : "_afpLast",
      activeClass : "alink",
      deactiveClass : "blink",
      btnCallback : null
    };
    options = $.extend(settings, options);
    this.attrObj("config", options);
    var bn = options.managerName;
    if (!_managerNames.contains(bn)) {
      $("head").append(
          "<script src='" + _ctxPath + "/ajax.do?managerName=" + bn
              + "' type='text/javascript'></script>");
      _managerNames.push(bn);
    }
  };

  /**
   * $.fn.ajaxgridbar() provides a mechanism for loading data of ajax paging
   * grid, no more script or code, very convenient.
   */
  $.fn.ajaxgridbarLoad = function(param, page, size) {
    var tbl = this, config = this.attrObj("config"), bn = config.managerName, bm = config.managerMethod, callbk = config.callback;
    if (!size)
      size = config.size;
    if (!page)
      page = config.page;
    var callerResponder = new CallerResponder();
    callerResponder.success = function(fpi) {
      /*
       * if (fpi.pages < 2) $("#" + config.page_btn).disable(); else $("#" +
       * config.page_btn).enable();
       */
      $("#" + config.page_id).val(fpi.page);
      $("#" + config.page_id).unbind();
      $("#" + config.page_id).keydown(function() {
        var code = event.keyCode;
        if (code == "13") {
          goPage();
        }
      });
      $("#" + config.page_btn).unbind();
      $("#" + config.page_btn).click(function() {
        goPage();
      });
      function goPage() {
        var varPage = $("#" + config.page_id).val(), varPages = fpi.pages;
        if (parseInt(varPage) < 1)
          $("#" + config.page_id).val(1);
        if (parseInt(varPage) > parseInt(varPages))
          $("#" + config.page_id).val(varPages);
        tbl.ajaxgridbarLoad(param, $("#" + config.page_id).val(), size);
      }
      $("#" + config.afpPageId).each(function() {
        var t = $(this), tn = this.tagName.toLowerCase();
        if ("input" == tn)
          t.val(fpi.page);
        else
          t.text(fpi.page);
      });
      $("#" + config.afpPagesId).each(function() {
        var t = $(this), tn = this.tagName.toLowerCase();
        if ("input" == tn)
          t.val(fpi.pages);
        else
          t.text(fpi.pages);
      });
      $("#" + config.afpTotalId).each(function() {
        var t = $(this), tn = this.tagName.toLowerCase();
        if ("input" == tn)
          t.val(fpi.total);
        else
          t.text(fpi.total);
      });
      $("#" + config.afpSizeId).each(function() {
        var t = $(this), tn = this.tagName.toLowerCase();
        if ("input" == tn) {
          t.val(fpi.size);
          t.blur(function() {
            var _s = t.val();
            try {
              _s = parseInt(_s, 10);
              if (_s <= 0)
                _s = _defaultPageSize;
            } catch (e) {
              _s = _defaultPageSize;
            }
            t.val(_s);
            size = _s;
          });
        } else if ("select" == tn) {
          t.val(fpi.size);
          t.change(function() {
            size = t.val();
            goPage();
          });
        } else
          t.text(fpi.size);
      });
      var l1 = $("#" + config.afpFirstId), l2 = $("#" + config.afpPreviousId), l3 = $("#"
          + config.afpNextId), l4 = $("#" + config.afpLastId);
      l1.unbind();
      l2.unbind();
      l3.unbind();
      l4.unbind();
      if (fpi.page > 1) {
        l1.click(function() {
          tbl.ajaxgridbarLoad(param, 1, size);
        });
        l1.removeClass(config.deactiveClass);
        l1.addClass(config.activeClass);
      } else {
        l1.removeClass(config.activeClass);
        l1.addClass(config.deactiveClass);
      }
      if (fpi.page > 1) {
        $("#" + config.afpPreviousId).click(function() {
          tbl.ajaxgridbarLoad(param, (fpi.page - 1), size);
        });
        l2.removeClass(config.deactiveClass);
        l2.addClass(config.activeClass);
      } else {
        l2.removeClass(config.activeClass);
        l2.addClass(config.deactiveClass);
      }
      if (fpi.page < fpi.pages) {
        $("#" + config.afpNextId).click(function() {
          tbl.ajaxgridbarLoad(param, fpi.page + 1, size);
        });
        l3.removeClass(config.deactiveClass);
        l3.addClass(config.activeClass);
      } else {
        l3.removeClass(config.activeClass);
        l3.addClass(config.deactiveClass);
      }
      if (fpi.page < fpi.pages) {
        $("#" + config.afpLastId).click(function() {
          tbl.ajaxgridbarLoad(param, fpi.pages, size);
        });
        l4.removeClass(config.deactiveClass);
        l4.addClass(config.activeClass);
      } else {
        l4.removeClass(config.activeClass);
        l4.addClass(config.deactiveClass);
      }

      if (callbk)
        callbk(fpi);
    };
    if (config.complete)
      callerResponder.complete = config.complete;
    if (config.errorHandler)
      callerResponder.errorHandler = config.errorHandler;
    var fi = {
      page : page,
      size : size
    };
    if (param)
      eval("var _bs = new " + bn + "();_bs.async=" + config.async + ";_bs."
          + bm + "(fi,param,callerResponder);");
    else
      eval("var _bs = new " + bn + "();_bs.async=" + config.async + ";_bs."
          + bm + "(fi,callerResponder);");
  };
})(jQuery);