/**
* @author zs
*/
jQuery.fn.projectList = function () {
    var _id = $(this).selector;
    $(_id + " .btn_ico").click(function () {
        var tbody_index = $(this).parents("tbody").index() - 1;//第几个tbody
        var click_class = $(this).parents("tr").attr("class");//当前点击的class
        var tr_index = $(this).parents("tr").index();//当前tr的index
        var tr_lv = $(this).parents("tr").attr("lv");//当前tr的lv层级
        var next_tr = getNextTr(1);
        var nextOne_tr_style;//下一层级当前显示状态

        function getNextTr(n) {
            return $(_id + " tbody:eq(" + tbody_index + ") tr:eq(" + (tr_index + n) + ")")[0];
        }
        if (next_tr) {//下个tr是否存在
            nextOne_tr_style = $(getNextTr(1)).css("display");
            cellToggle(1);
        }
        function cellToggle(n) {//隐藏显示function
            if (n) {
                next_tr = getNextTr(n);
            }
            if (next_tr) {
                var lv = $(next_tr).attr("lv") ? parseInt($(next_tr).attr("lv")) : 0;
                if (lv > tr_lv) {//判断是否层级低,隐藏所有低层级
                    if (nextOne_tr_style == "none") {
                        if (lv == parseInt(tr_lv) + 1) {//判断显示下一层级
                            $(next_tr).fadeIn("fast");
                        }
                    } else {
                        $(next_tr).fadeOut("fast");
                    }
                    cellToggle(n + 1);//查找下个tr
                }
            }

        }

    });
}