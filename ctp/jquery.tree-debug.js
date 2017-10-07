(function($) {
  var zt = $.fn.zTree, tools = zt._z.tools, consts = zt.consts, view = zt._z.view, data = zt._z.data, event = zt._z.event;
      _view = {
        addNodes : function(setting, parentNode, newNodes, isSilent) {
          if (setting.data.keep.leaf && parentNode && !parentNode.isParent) {
            return;
          }

          if (!tools.isArray(newNodes)) {
            newNodes = [ newNodes ];
          }
          if (setting.data.simpleData.enable) {
            newNodes = data.transformTozTreeFormat(setting, newNodes);
          }
          if (parentNode) {
            var target_switchObj = $("#" + parentNode.tId + consts.id.SWITCH), target_icoObj = $("#"
                + parentNode.tId + consts.id.ICON), target_ulObj = $("#"
                + parentNode.tId + consts.id.UL);

            if (!parentNode.open) {
              view.replaceSwitchClass(parentNode, target_switchObj,
                  consts.folder.CLOSE);
              view.replaceIcoClass(parentNode, target_icoObj,
                  consts.folder.CLOSE);
              parentNode.open = false;
              target_ulObj.css({
                "display" : "none"
              });
            }

            data.addNodesData(setting, parentNode, newNodes);
            view.createNodes(setting, parentNode.level + 1, newNodes,
                parentNode);
            if (!isSilent) {
              view.expandCollapseParentNode(setting, parentNode, true);
            }
          } else {
            data.addNodesData(setting, data.getRoot(setting), newNodes);
            view.createNodes(setting, 0, newNodes, null);
          }
          for ( var i = 0; i < newNodes.length; i++) {
            newNodes[i].data[setting.data.simpleData.pIdKey] = newNodes[i][setting.data.simpleData.pIdKey];
          }
        },
        asyncNode : function(setting, node, isSilent, callback) {
          var i, l;
          if (node && !node.isParent) {
            tools.apply(callback);
            return false;
          } else if (node && node.isAjaxing) {
            return false;
          } else if (tools.apply(setting.callback.beforeAsync, [
              setting.treeId, node ], true) == false) {
            tools.apply(callback);
            return false;
          }
          if (node) {
            node.isAjaxing = true;
            var icoObj = $("#" + node.tId + consts.id.ICON);
            icoObj.attr({
              "style" : "",
              "class" : "button ico_loading"
            });
          }

          var isJson = (setting.async.contentType == "application/json"), tmpParam = isJson ? "{"
              : "", jTemp = "";
          for (i = 0, l = setting.async.autoParam.length; node && i < l; i++) {
            var pKey = setting.async.autoParam[i].split("="), spKey = pKey;
            if (pKey.length > 1) {
              spKey = pKey[1];
              pKey = pKey[0];
            }
            if (isJson) {
              jTemp = (typeof node[pKey] == "string") ? '"' : '';
              tmpParam += '"' + spKey
                  + ('":' + jTemp + node[pKey]).replace(/'/g, '\\\'') + jTemp
                  + ',';
            } else {
              tmpParam += spKey + ("=" + node[pKey]).replace(/&/g, '%26') + "&";
            }
          }
          if (tools.isArray(setting.async.otherParam)) {
            for (i = 0, l = setting.async.otherParam.length; i < l; i += 2) {
              if (isJson) {
                jTemp = (typeof setting.async.otherParam[i + 1] == "string") ? '"'
                    : '';
                tmpParam += '"'
                    + setting.async.otherParam[i]
                    + ('":' + jTemp + setting.async.otherParam[i + 1]).replace(
                        /'/g, '\\\'') + jTemp + ",";
              } else {
                tmpParam += setting.async.otherParam[i]
                    + ("=" + setting.async.otherParam[i + 1]).replace(/&/g,
                        '%26') + "&";
              }
            }
          } else {
            for ( var p in setting.async.otherParam) {
              if (isJson) {
                jTemp = (typeof setting.async.otherParam[p] == "string") ? '"'
                    : '';
                tmpParam += '"'
                    + p
                    + ('":' + jTemp + setting.async.otherParam[p]).replace(
                        /'/g, '\\\'') + jTemp + ",";
              } else {
                tmpParam += p
                    + ("=" + setting.async.otherParam[p]).replace(/&/g, '%26')
                    + "&";
              }
            }
          }
          if (tmpParam.length > 1)
            tmpParam = tmpParam.substring(0, tmpParam.length - 1);
          if (isJson)
            tmpParam += "}";
          var managerName = setting.managerName, managerMethod = setting.managerMethod;
          if (managerName && !setting._managerLoaded) {
            $("head").append(
                "<script src='" + _ctxPath + "/ajax.do?managerName="
                    + managerName + "' type='text/javascript'></script>");
            setting._managerLoaded = true;
          }

          if (managerName && managerMethod && window[managerName]) {
            var _bs = new window[managerName]();
            _bs[managerMethod]($.parseJSON(tmpParam), {
              success : function(msg) {
                var newNodes = [];
                try {
                  if (!msg || msg.length == 0) {
                    newNodes = [];
                  } else if (typeof msg == "string") {
                    newNodes = eval("(" + msg + ")");
                  } else {
                    newNodes = msg;
                  }
                } catch (err) {
                }

                if (node) {
                  node.isAjaxing = null;
                  node.zAsync = true;
                }
                view.setNodeLineIcos(setting, node);
                if (newNodes && newNodes != "") {
                  newNodes = tools.apply(setting.async.dataFilter, [
                      setting.treeId, node, newNodes ], newNodes);
                  view.addNodes(setting, node, !!newNodes ? tools
                      .clone(newNodes) : [], !!isSilent);
                } else {
                  view.addNodes(setting, node, [], !!isSilent);
                }
                setting.treeObj.trigger(consts.event.ASYNC_SUCCESS, [
                    setting.treeId, node, msg ]);
                tools.apply(callback);
              },
              error : function(request, textStatus, errorThrown) {
                if (node)
                  node.isAjaxing = null;
                view.setNodeLineIcos(setting, node);
                setting.treeObj.trigger(consts.event.ASYNC_ERROR, [
                    setting.treeId, node, request, textStatus, errorThrown ]);
              }
            });
          }

          return true;
        },
        appendNodes: function(setting, level, nodes, parentNode, initFlag, openFlag) {
          if (!nodes) return [];
          var html = [],
          childKey = setting.data.key.children,
          nameKey = setting.data.key.name,
          titleKey = data.getTitleKey(setting);
          for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i],
            tmpPNode = (parentNode) ? parentNode: data.getRoot(setting),
            tmpPChild = tmpPNode[childKey],
            isFirstNode = ((tmpPChild.length == nodes.length) && (i == 0)),
            isLastNode = (i == (nodes.length - 1));
            if (initFlag) {
              data.initNode(setting, level, node, parentNode, isFirstNode, isLastNode, openFlag);
              data.addNodeCache(setting, node);
            }

            var childHtml = [];
            if (node[childKey] && node[childKey].length > 0) {
              //make child html first, because checkType
              childHtml = view.appendNodes(setting, level + 1, node[childKey], node, initFlag, openFlag && node.open);
            }
            if (openFlag) {
              var url = view.makeNodeUrl(setting, node),
              fontcss = view.makeNodeFontCss(setting, node),
              fontStyle = [];
              for (var f in fontcss) {
                fontStyle.push(f, ":", fontcss[f], ";");
              }
              html.push("<li id='", node.tId, "' class='level", node.level,"' tabindex='0' hidefocus='true' treenode>",
                "<span id='", node.tId, consts.id.SWITCH,
                "' title='' class='", view.makeNodeLineClass(setting, node), "' treeNode", consts.id.SWITCH,"></span>");
              data.getBeforeA(setting, node, html);
              html.push("<a id='", node.tId, consts.id.A, "' class='level", node.level,"' treeNode", consts.id.A," onclick=\"", (node.click || ''),
                "\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",view.makeNodeTarget(node),"' style='", fontStyle.join(''),
                "'");
              if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle) && node[titleKey] && node[titleKey].indexOf("title") == -1) {html.push("title='", node[titleKey].replace(/'/g,"&#39;").replace(/</g,'&lt;').replace(/>/g,'&gt;'),"'");}
              html.push(">");
              data.getInnerBeforeA(setting, node, html);
              var name = setting.view.nameIsHTML ? node[nameKey] : node[nameKey].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
              html.push("<span id='", node.tId, consts.id.ICON,
                "' title='' treeNode", consts.id.ICON," class='", view.makeNodeIcoClass(setting, node), "' style='", view.makeNodeIcoStyle(setting, node), "'></span><span id='", node.tId, consts.id.SPAN,
                "'>",name,"</span>");
              data.getInnerAfterA(setting, node, html);
              html.push("</a>");
              data.getAfterA(setting, node, html);
              if (node.isParent && node.open) {
                view.makeUlHtml(setting, node, html, childHtml.join(''));
              }
              html.push("</li>");
              data.addCreatedNode(setting, node);
            }
          }
          return html;
        }
      },
      _data = {
        fixPIdKeyValue : function(setting, node) {
          if (setting.data.simpleData.enable) {
            node.data[setting.data.simpleData.pIdKey] = node[setting.data.simpleData.pIdKey] = node.parentTId ? node
                .getParentNode()[setting.data.simpleData.idKey]
                : setting.data.simpleData.rootPId;
          }
        },
        transformTozTreeFormat : function(setting, sNodes) {
          var i, l, key = setting.data.simpleData.idKey, parentKey = setting.data.simpleData.pIdKey, childKey = setting.data.key.children;
          if (!key || key == "" || !sNodes)
            return [];

          if (!tools.isArray(sNodes))
            sNodes = [ sNodes ];

          var d = [], nm = setting.data.key.name, titleKey = data.getTitleKey(setting);
          for ( var i = 0; i < sNodes.length; i++) {
            var no = {};
            no[key] = sNodes[i][key];
            no[parentKey] = sNodes[i][parentKey];
            if (setting.render)
              no[nm] = setting.render(sNodes[i][nm], sNodes[i]);
            else
              no[nm] = sNodes[i][nm];
            if(titleKey && titleKey != "") {
              no[titleKey] = sNodes[i][titleKey];
            }
            no.data = sNodes[i];
            var _iconSkin = sNodes[i]["iconSkin"];
            if(_iconSkin){
              no.iconSkin = _iconSkin;
            }
            if (setting.nodeHandler)
              setting.nodeHandler(no);
            d.push(no);
          }
          sNodes = d;
          var r = [];
          var tmpMap = [];
          for (i = 0, l = sNodes.length; i < l; i++) {
            tmpMap[sNodes[i][key]] = sNodes[i];
          }
          for (i = 0, l = sNodes.length; i < l; i++) {
            if (tmpMap[sNodes[i][parentKey]]
                && sNodes[i][key] != sNodes[i][parentKey]) {
              if (!tmpMap[sNodes[i][parentKey]][childKey])
                tmpMap[sNodes[i][parentKey]][childKey] = [];
              tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
            } else {
              r.push(sNodes[i]);
            }
          }
          return r;
        }
      }, _z = {
        view : _view,
        data : _data
      };
  $.extend(true, $.fn.zTree._z, _z);

  $.fn.tree = function(options) {
    var settings = {};
    options = $.extend(settings, options);

    var opts = {
      async : {
        enable : false,
        autoParam : [ "id" ],
        contentType : "application/json"
      },
      edit : {
        enable : false,
        showRemoveBtn : false,
        showRenameBtn : false
      },
      callback : {},
      check : {},
      data : {
        simpleData : {
          enable : true,
          idKey : "id",
          pIdKey : "pId",
          rootPId : 0
        },
        key : {
          name : "name"
        }
      },
      view : {
        selectedMulti : false
      }
    }, oe = opts.edit, oc = opts.callback, od = opts.data, ods = od.simpleData, odk = od.key;

    if (options.onClick)
      oc.onClick = options.onClick;
    if (options.onDblClick)
      oc.onDblClick = options.onDblClick;
    if (options.beforeDrag)
      oc.beforeDrag = options.beforeDrag;
    if (options.beforeDrop)
      oc.beforeDrop = options.beforeDrop;
    if (options.onAsyncSuccess)
      oc.onAsyncSuccess = options.onAsyncSuccess;
    if (options.onAsyncError)
      oc.onAsyncError = options.onAsyncError;
    if (options.idKey)
      ods.idKey = options.idKey;
    if (options.pIdKey)
      ods.pIdKey = options.pIdKey;
    if (options.rootPId)
      ods.rootPId = options.rootPId;
    if (options.nameKey)
      odk.name = options.nameKey;
    if (options.enableEdit)
      oe.enable = true;
    if (options.enableRename)
      oe.showRenameBtn = true;
    if (options.enableRemove)
      oe.showRemoveBtn = true;
    if (options.enableCheck)
      opts.check.enable = true;
    if (options.managerName) {
      opts.async.enable = true;
      opts.async.autoParam = [ ods.idKey ];
      if (options.asyncParam)
        opts.async.otherParam = options.asyncParam;
    }
    if(options.addHoverDom){
      opts.view.addHoverDom =  options.addHoverDom
    }
    if(options.removeHoverDom){
      opts.view.removeHoverDom =  options.removeHoverDom
    }
	if(options.dblClickExpand){
      opts.view.dblClickExpand =  options.dblClickExpand
    }
    if (options.render) {// set nameIsHTML to true while render customized
      opts.view.nameIsHTML = true;
      opts.render = options.render;
    }
    if (options.nodeHandler) {
      opts.nodeHandler = options.nodeHandler;
    }
    if (options.managerName) {
      opts.managerName = options.managerName;
    }
    if (options.managerMethod) {
      opts.managerMethod = options.managerMethod;
    }
    if (options.title) {
      odk.title = options.title;
    }

    // update the name value of data while renamed
    oc.onRename = function(evt, tid, tNode) {
      tNode.data[odk.name] = tNode[odk.name];
    };

    var t = this[0], id = t.id, d = [];
    //t.className = "ztree";
	$(this).replaceWith("<ul id='"+id+"' class='ztree'></ul>");
	t = $('#'+id)
    if ($._autofill) {
      var $af = $._autofill, $afg = $af.filllists;
      if ($afg && $afg[id])
        d = $afg[id];
    }
    $.fn.zTree.init(t, opts, d);
  };

  $.fn.treeObj = function() {
    var id = this[0].id;
    return $.fn.zTree.getZTreeObj(id);
  };
})(jQuery);
