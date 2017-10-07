/**
 * 项目任务 － 查看页弹出dialog
 * @author zhenshuai
 * Date: 2015-02-02
 */
 function projectTaskDetailDialog(options) {
    this.p = {
        url1: "about:blank",
        url2: "about:blank",
        url3: "about:blank",
        openB: false,           //默认打开B
        openC: false,           //默认打开C
        hideBtnB: false,        //隐藏按钮B
        hideBtnC: false,        //隐藏按钮C
        aWidth: 580,            //A的宽度
        bWidth: 240,            //B的宽度
        cWidth: 240,            //C的宽度
        btnRight: 580,          //btn定位计算
        toggleBC: false,        //BC交替显示
        animate: true,          //动画
        offsetRight: 100,         //右侧间距
        zIndex: 1000,
        targetWindow: window.parent.top //跨Iframe展现
    };
    $.extend(this.p, options);
    this.init();
}
projectTaskDetailDialog.prototype.init = function() {
    var p = this.p;
    var t = this;
    //避免同时打开多个
    if (p.targetWindow.$(".projectTask_detailDialog").size() != 0) {
        var aIframe = p.targetWindow.$(".projectTask_detailDialog_a_iframe")[0];
        aIframe.contentWindow.document.write('');
        aIframe.contentWindow.close();
        var bIframe = p.targetWindow.$(".projectTask_detailDialog_b_iframe")[0];
        bIframe.contentWindow.document.write('');
        bIframe.contentWindow.close();
        var cIframe = p.targetWindow.$(".projectTask_detailDialog_c_iframe")[0];
        cIframe.contentWindow.document.write('');
        cIframe.contentWindow.close();
        p.targetWindow.$(".projectTask_detailDialog").remove();
    };
    //分辨率? 1. BC交替显示  2. 右侧间距为0
    if (window.screen.width < 1028) {
        p.toggleBC = true;
        p.offsetRight = 0;
    };

    //动画
    var _animateClass = "";
    if (p.animate == true) {
        _animateClass = " projectTask_transitionAll";
    };

    //dialog层级叠加
    var masks =  p.targetWindow.$('.mask,.shield,.projectTask_detailDialog_box');
    if(masks.size()>0){
        p.zIndex = parseInt(masks.eq(0).css('z-index'));
        p.zIndex = p.zIndex+2;
    }

    var _html = '';
    _html += '<div class="projectTask_detailDialog">';
        _html += '<div class="projectTask_detailDialog_box'+ _animateClass +'" style="z-index:'+ p.zIndex +';">';
            _html += '<div class="projectTask_detailDialog_a'+ _animateClass +'"><iframe class="projectTask_detailDialog_a_iframe" src="'+ p.url1 +'" frameborder="0" scrolling="false" width="580" height="100%"></iframe></div>';
            _html += '<div class="projectTask_detailDialog_b'+ _animateClass +'"><iframe class="projectTask_detailDialog_b_iframe" src="" hsrc="'+ p.url2 +'" frameborder="0" scrolling="false" width="240" height="100%"></iframe></div>';
            _html += '<div class="projectTask_detailDialog_c'+ _animateClass +'"><iframe class="projectTask_detailDialog_c_iframe" src="" hsrc="'+ p.url3 +'" frameborder="0" scrolling="false" width="240" height="100%"></iframe></div>';
            _html += '<div class="maskShadow"></div>';
        _html += '</div>';
        _html += '<div class="projectTask_detailDialogBtn clearfix'+ _animateClass +'" style="z-index:'+ p.zIndex +';">';
            _html += '<a class="projectTask_detailDialogBtn_c"><div class="maskShadow"></div></a>';
            if (p.hideBtnB == false) {
                _html += '<a class="projectTask_detailDialogBtn_b"><div class="maskShadow"></div></a>';
            };
        _html += '</div>';
    _html += '</div>';
    //插入DOM
    p.targetWindow.$("body").prepend(_html);
    //绑定切换按钮事件
    p.targetWindow.$(".projectTask_detailDialog").find(".projectTask_detailDialogBtn_b").click(function(){
        switch(p.openB){
            case false:
                t.openIframeB();
                if (p.toggleBC && p.openC) {
                    t.closeIframeC();
                };
                break;
            case true:
                t.closeIframeB();
                break;
        }
    }).end().find(".projectTask_detailDialogBtn_c").click(function(){
        switch(p.openC){
            case false:
                t.openIframeC();
                if (p.toggleBC && p.openB) {
                    t.closeIframeB();
                };
                break;
            case true:
                t.closeIframeC();
                break;
        }
    });
    if (p.hideBtnC == true) {
        p.targetWindow.$(".projectTask_detailDialogBtn_c").hide();
    }
    //加演示，解决动画卡顿问题
    setTimeout(function(){
        //默认打开iframeA
        p.targetWindow.$(".projectTask_detailDialog_box").css({right: p.offsetRight});
        p.targetWindow.$(".projectTask_detailDialog_a").css({width: p.aWidth});
        p.targetWindow.$(".projectTask_detailDialogBtn").css({right: p.aWidth + p.offsetRight});
        if (p.openB) {
            t.openIframeB();
        };
        if (p.openC) {
            t.openIframeC();
        };
    },100);
};
projectTaskDetailDialog.prototype.openIframeB = function() {
    var p = this.p;
    p.btnRight += p.bWidth;
    var url = p.url2;
    var dataUrl = p.targetWindow.$(".projectTask_detailDialog_b_iframe").data("url");
    if (dataUrl != undefined) {
        url = dataUrl;
    };
    p.targetWindow.$(".projectTask_detailDialog_b_iframe").attr("src", url);
    p.targetWindow.$(".projectTask_detailDialog_b").css({"width": p.bWidth});
    p.targetWindow.$(".projectTask_detailDialogBtn").css({"right": p.btnRight + p.offsetRight});
    p.openB = true;
};
projectTaskDetailDialog.prototype.closeIframeB = function() {
    var p = this.p;
    p.btnRight -= p.bWidth;
    p.targetWindow.$(".projectTask_detailDialog_b").css({"width": 0});
    p.targetWindow.$(".projectTask_detailDialogBtn").css({"right": p.btnRight + p.offsetRight});
    p.openB = false;
};
projectTaskDetailDialog.prototype.openIframeC = function() {
    var p = this.p;
    p.btnRight += p.cWidth;
    var url = p.url3;
    var dataUrl = p.targetWindow.$(".projectTask_detailDialog_c_iframe").data("url");
    if (dataUrl != undefined) {
        url = dataUrl;
    };
    p.targetWindow.$(".projectTask_detailDialog_c_iframe").attr("src", url);
    p.targetWindow.$(".projectTask_detailDialog_c").css({"width": p.cWidth});
    p.targetWindow.$(".projectTask_detailDialogBtn").css({"right": p.btnRight + p.offsetRight});
    p.openC = true;
};
projectTaskDetailDialog.prototype.closeIframeC = function() {
    var p = this.p;
    p.btnRight -= p.cWidth;
    p.targetWindow.$(".projectTask_detailDialog_c").css({"width": 0});
    p.targetWindow.$(".projectTask_detailDialogBtn").css({"right": p.btnRight + p.offsetRight});
    p.openC = false;
};
function projectTaskDetailDialog_reload(url1, url2, url3) {
    var p = {
        targetWindow: window.parent.top
    };
    if (url1 != undefined) {
        if (url1 == true) {
            p.targetWindow.$(".projectTask_detailDialog_a_iframe")[0].contentWindow.location.reload();
        } else {
            p.targetWindow.$(".projectTask_detailDialog_a_iframe")[0].contentWindow.location.href = url1;
        };
    };
    if (url2 != undefined) {
        if (url2 == true) {
            p.targetWindow.$(".projectTask_detailDialog_b_iframe")[0].contentWindow.location.reload();
        } else {
            p.targetWindow.$(".projectTask_detailDialog_b_iframe").data("url", url2);
            p.targetWindow.$(".projectTask_detailDialog_b_iframe")[0].contentWindow.location.href = url2;
        };
    };
    if (url3 != undefined) {
        if (url3 == true) {
            p.targetWindow.$(".projectTask_detailDialog_c_iframe")[0].contentWindow.location.reload();
        } else {
            p.targetWindow.$(".projectTask_detailDialog_c_iframe").data("url", url3);
            p.targetWindow.$(".projectTask_detailDialog_c_iframe")[0].contentWindow.location.href = url3;
        };
    };
}
function projectTaskDetailDialog_close() {
    var p = {
        targetWindow: window.parent.top
    };
    if (p.targetWindow.$(".projectTask_detailDialog").size() == 0) {
        return;
    };
    p.targetWindow.$(".projectTask_detailDialog_box").css({"right": -44});
    p.targetWindow.$(".projectTask_detailDialog_a").css({"width": 0});
    p.targetWindow.$(".projectTask_detailDialog_b").css({"width": 0});
    p.targetWindow.$(".projectTask_detailDialog_c").css({"width": 0});
    p.targetWindow.$(".projectTask_detailDialogBtn").css({"right": -44}, function(){
        //避免iframe内存泄漏,清空iframe的内容
        var aIframe = p.targetWindow.$(".projectTask_detailDialog_a_iframe")[0];
        aIframe.contentWindow.document.write('');
        aIframe.contentWindow.close();
        var bIframe = p.targetWindow.$(".projectTask_detailDialog_b_iframe")[0];
        bIframe.contentWindow.document.write('');
        bIframe.contentWindow.close();
        var cIframe = p.targetWindow.$(".projectTask_detailDialog_c_iframe")[0];
        cIframe.contentWindow.document.write('');
        cIframe.contentWindow.close();
        p.targetWindow.$(".projectTask_detailDialog").remove();
    });
}


