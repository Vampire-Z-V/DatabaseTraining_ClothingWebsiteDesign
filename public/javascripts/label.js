var datas;  //最终提交给后端的数据，包含多个item
var item;   //增加或修改一个标签时，记录item信息
var same_item; //选择同款时，保存同款信息
var rec;  //记录当前状态
var fsms;   //记录每个label的状态机
var pictures;   //记录同款照片

/**********************************  FSM  ***********************************/

function RunFSM(item) {
    //初始化fsm
    var fsm;
    if (rec.fsms_index !== -1) {
        fsm = fsms[rec.fsms_index];
    } else {
        fsm = new Label_FSM(item.type, rec.b_in_items);
        fsms.push(fsm);
    }

    //运行fsm
    var transition = fsm.Transaction(rec.option);
    StateTransitionFunction(transition, item);

    // alert(fsm.GetCurr());
    if (rec.fsms_index !== -1 && !fsm.IsAccept()) {
        fsms.splice(rec.fsms_index, 1);
    }
}

function StateTransitionFunction(transition, item) {
    var steps = transition.split(/,/);

    steps.forEach(function (step) {
        switch (step) {
            case "S0_0->S0_1":
            case "S0_0->S0_2":
            case "S1_0->S1_1":
            case "S1_2->S1_3":
            case "S1_2->S1_4":
                InsertIntoDatas(item);
                break;

            case "S1_0->S1_2":
                var delete_item = {};
                delete_item.group = items[rec.items_index].group;
                delete_item.type = items[rec.items_index].type;
                delete_item.ID = items[rec.items_index].ID;
                delete_item.option = "delete";
                InsertIntoDatas(delete_item);
                break;

            case "S0_1->S0_0":
            case "S1_4->S1_2":
                DeleteFromDatas(item.type, "insert");
                break;

            case "S1_1->S1_0":
                DeleteFromDatas(item.type, "update");
                break;

            case "S1_2->S1_0":
                DeleteFromDatas(item.type, "delete");
                break;

            case "S0_2->S0_0":
            case "S1_3->S1_2":
                DeleteFromDatas(item.type, "sameitem");
                break;

            default:
                break;
        }
    });
}

/**********************************  Record  ***********************************/
function Record() {
    // 判断当前状态的属性
    this.b_can_submit_item = false; //判断是否满足条件把item添加进datas里
    this.b_has_itemname = false;    //判断是否输入了item name
    this.b_in_items = false;        //记录是否在items中存在该类型单品

    // 记录一些判断所需要的条件
    this.total_attrs_cnt = 0;   //记录当前item种类所包含的所有属性个数
    this.now_attrs_cnt = 0;     //记录当前item已经添加了的属性个数
    this.item_temp = {};        //记录初始item副本
    this.$label = $("");        //记录点击编辑的那个标签
    this.fsms_index = -1;       //记录当前标签的状态机的下标，-1为没有
    this.items_index = -1;      //记录当前类型的单品在items中的下标，-1为items里没有
    this.option = "";           //记录当前操作

    // 判断item是否已经打完标签
    this.WhetherCanSubmitItem = function () {
        // 如果item的所有属性都有属性值和item_name不为空，则可以提交
        if (this.now_attrs_cnt === this.total_attrs_cnt && this.b_has_itemname)
            this.b_can_submit_item = true;
        else
            this.b_can_submit_item = false;

        if (this.b_can_submit_item)
            $("#submit-item").attr("disabled", false);
        else
            $("#submit-item").attr("disabled", true);
    };

    // 判断是否可以提交数据给后端
    this.WhetherCanSubmit = function () {
        if (datas.length > 0)
            $("#submit").attr("disabled", false);
        else
            $("#submit").attr("disabled", true);
    };

    // 判断是否输入了item_name
    this.WhetherInputItemName = function (item_name) {
        if (item_name === '') {
            rec.b_has_itemname = false;
        } else {
            rec.b_has_itemname = true;
        }
    }

}

/**********************************  Utility - for data  ***********************************/
// 从datas中删除option为特定值的item
function DeleteFromDatas(item_type, option) {
    var index = SearchIndexFromDatas(item_type, option);
    datas.splice(index, 1);
}

function InsertIntoDatas(item) {
    datas.push(item);
}

/**
 * @return {number}
 */
function SearchIndexFromDatas(item_type, option) {
    for (var i = 0; i < datas.length; i++) {
        if (datas[i].type === item_type && datas[i].option === option) {
            return i;
        }
    }
    return -1;
}

/**
 * @return {number}
 */
function SearchIndexFromItems(item_type) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].type === item_type) {
            return i;
        }
    }
    return -1;
}

/**
 * @return {number}
 */
function SearchIndexFromFSMs(item_type) {
    for (var i = 0; i < fsms.length; i++) {
        if (fsms[i].GetType() === item_type) {
            return i;
        }
    }
    return -1;
}

// 查找item的group_id，type_id和所有相关属性
function FindIDsAndAttrsFromGroups(group, type) {
    var result = {
        group_id: "",
        type_id: "",
        attrs: []
    };

    for (var i = 0; i < groups.length; i++) {
        if (groups[i].group === group) {
            result.group_id = groups[i].group_id;
            for (var j = 0; j < groups[i].types.length; j++) {
                if (groups[i].types[j].type === type) {
                    result.type_id = groups[i].types[j].type_id;
                    result.attrs = groups[i].types[j].attributes;
                    break;
                }
            }
            break;
        }
    }

    return result;
}

// 初始化rec的一部分
function InitAttributesPageState(item_name, attrs_cnt) {
    rec.b_can_submit_item = false;
    rec.now_attrs_cnt = 0;
    rec.total_attrs_cnt = attrs_cnt;
    rec.WhetherInputItemName(item_name);
}

// 克隆所需要的item的属性
function CloneItem(curr_item) {
    var temp = {};
    if (curr_item.hasOwnProperty("ID"))
        temp.ID = curr_item.ID;
    temp.item_name = curr_item.item_name;
    temp.group = curr_item.group;
    temp.type = curr_item.type;
    temp.attributes = [];
    for (var i = 0; i < curr_item.attributes.length; i++) {
        var attr_values = curr_item.attributes[i].attr_values.slice(0);
        temp.attributes.push({
            attr_name: curr_item.attributes[i].attr_name,
            attr_values: attr_values
        });
    }
    return temp;
}

// 判断两个item是否相同
/**
 * @return {boolean}
 */
function IsSameItem(old_item, new_item) {
    if (JSON.stringify(old_item) !== JSON.stringify({}) && old_item.item_name === new_item.item_name && old_item.attributes.length === new_item.attributes.length) {
        for (var i = 0; i < new_item.attributes.length; i++) {
            var k = 0;
            for (; k < old_item.attributes.length; k++) {
                if (old_item.attributes[k].attr_name === new_item.attributes[i].attr_name)
                    break;
            }
            if (k === old_item.attributes.length)
                return false;

            for (var j = 0; j < new_item.attributes[i].attr_values.length; j++) {
                if (old_item.attributes[k].attr_values.indexOf(new_item.attributes[i].attr_values[j]) === -1)
                    return false;
            }
        }
        return true;
    }
    return false;
};

/**
 * @return {boolean}
 */
function InitPictures(item_type) {
    pictures = [];
    for (var i = 0; i < done_pictures.length; i++) {
        for (var j = 0; j < done_pictures[i].items.length; j++) {
            if (done_pictures[i].items[j].type === item_type) {
                pictures.push({
                    "path": done_pictures[i].path,
                    "itemID": done_pictures[i].items[j].ID
                });
                break;
            }
        }
    }
    return pictures.length !== 0;
}

/**********************************  Utility - for view  ***********************************/
// 在展示标签页面新加一个标签
function add_label(data) {
    var $item = $(data);
    $("#add-label").before($item);
    scroll_top("slow");
}

// 转换页面动作
function change_panel(func) {
    $(".panel-show").animate({
        height: "toggle",
        opacity: "toggle"
    }, func);
}

// 回到底部
function scroll_top(speed) {
    $("#process-panel").animate({
        scrollTop: $("#success-label-panel-border").height() + 'px'
    }, speed);
}

// 获取每个标签的属性名和属性对应的id，编辑标签时把已存在的标签先自动打好
function initial_attributes(attrs) {
    var $attr_panel = $('.attr-panel');

    attrs.forEach(function (attribute) {
        var $attribute = $attr_panel.find('div[name=' + attribute.attr_name + ']');
        attribute.attrn_id = $attribute.attr('id');
        attribute.attrv_ids = [];
        attribute.attr_values.forEach(function (attr_value) {
            var $span = $attribute.find('span[attr_value=' + attr_value + ']');
            var $input = $span.parent().prev();
            $input.attr("checked", true);

            attribute.attrv_ids.push($span.attr('attrv-id'));
        });
        $attribute.removeClass("panel-info");
        $attribute.addClass("panel-success");
    });
    rec.now_attrs_cnt = item.attributes.length;
}

// 进入增加标签属性页面
function intoAddAttributes(obj) {
    //初始化item
    item = {
        "item_name": "",
        "group": $(obj).attr("father"),
        "group_id": "",
        "type": obj.innerText,
        "type_id": "",
        "attributes": [],
        "option": "insert"
    };
    var result = FindIDsAndAttrsFromGroups(item.group, item.type);
    item.group_id = result.group_id;
    item.type_id = result.type_id;

    //初始化rec
    rec.item_temp = {};
    rec.b_in_items = false;
    rec.items_index = SearchIndexFromItems(item.type);
    rec.$label = $("");
    rec.option = "insert";
    rec.fsms_index = SearchIndexFromFSMs(item.type);
    InitAttributesPageState(item.item_name, result.attrs.length);
    if (rec.items_index !== -1) {
        rec.item_temp = items[rec.items_index];
        rec.b_in_items = true;
    }

    //初始化照片墙
    var has_sameitem = InitPictures(item.type);

    //加载打标签页面
    var render_data = {
        "item_name": item.item_name,
        "group": item.group,
        "type": item.type,
        "attributes": result.attrs,
        "has_sameitem": has_sameitem
    };

    render_attributes(render_data, function (data, status) {
        if (status === 'success') {
            $(".subpanel").animate({
                opacity: "toggle"
            }, 100);

            $(".attr-panel").html(data).hide();
            $(".attr-panel").fadeIn();
        }
    });
}

// 把已打标签的type设置为不可点击
function DisableType(item_type) {
    var $panel = $("div.typelist-panel");
    var $span = $panel.find("span[name=" + item_type + "]");
    $span.removeClass("addAttributes");
    $span.addClass("unclickable");
    $span.undelegate();
}
// 删除标签后，把标签的type设置为可点击
function EnableType(item_type) {
    var $panel = $("div.typelist-panel");
    var $span = $panel.find("span[name=" + item_type + "]");
    $span.addClass("addAttributes");
    $span.removeClass("unclickable");
}

// 渲染attributes.ejs模板
function render_attributes(render_data, success_func) {
    $.ajax({
        url: '/attributepage',
        type: 'post',
        data: JSON.stringify(render_data),
        contentType: 'application/json',
        dataType: 'html',
        success: function (data, status) {
            success_func(data, status);
        },
        error: function (data, status) {
            if (status == 'error') {
                console.log(status);
            }
        }
    });
}

/***************************************************************************************************/
$(function () {
    scroll_top("");
    datas = [];
    rec = new Record();
    fsms = [];

    for (var i = 0; i < items.length; i++) {
        DisableType(items[i].type);
    }
});

/**********************************  Basic action  ***********************************/
// 点击添加标签按钮 转换页面
$("#add-label").click(function () {
    change_panel(function () {
        $("#process-panel").animate({
            scrollTop: '0px'
        });
    });
});

// 折叠标签
$(".panel-show").delegate('.collapse-panel-body', 'click', function () {
    if ($(this).hasClass("panel-body-open")) {
        $(this).removeClass("panel-body-open");
    }
    else {
        $(this).addClass("panel-body-open");
    }

    var $div_panel = $(this).parents('div.panel');
    var $div_body = $div_panel.children(".panel-collapse");
    $div_body.animate({
        height: "toggle"
    }, 120);
});

// 从开始打标签页面返回选择种类页面
$(".attr-panel").delegate('#return-groups', 'click', function () {
    $(".attr-panel").empty();
    $(".subpanel").animate({
        opacity: "toggle"
    });
});

// 从选择种类页面返回展示标签页面
$("#return-tags").click(function () {
    change_panel(function () {
        scroll_top("slow")
    });
});

// 从编辑标签页面返回展示标签页面
$(".attr-panel").delegate('#return-label', 'click', function () {
    $(".attr-panel").empty();
    $(".attr-panel").hide();

    $(".panel-show").animate({
        opacity: "toggle"
    }, 400, function () {
        $(".groups-panel").show();
    });
});

/**********************************  Important action  ***********************************/
// 删除标签
$(".panel-show").delegate('span.remove', 'click', function () {
    //获取单品类型
    var $td = $(this).parent();
    var $tr = $td.parent();
    var title = $tr.find("span.tag").text();
    var item_type = title.split(/:/)[1];

    //初始化rec
    rec.$label = $(this).parents('div.panel');
    rec.option = "delete";
    rec.b_in_items = false;
    rec.fsms_index = SearchIndexFromFSMs(item_type);
    rec.items_index = SearchIndexFromItems(item_type);
    if (rec.items_index !== -1) {
        rec.b_in_items = true;
    }

    //初始化item
    item = {
        "type": item_type
    };

    RunFSM(item);

    rec.$label.animate({
        height: "0px"
    }, 140, function () {
        EnableType(item_type);

        rec.$label.remove();
        rec.WhetherCanSubmit();
    });
});

// 检测是否输入了item name
$(".attr-panel").delegate('input[id=item-name]', 'keyup blur focus click', function () {
    var item_name = $(this).val();
    item.item_name = item_name;

    rec.WhetherInputItemName(item_name);
    rec.WhetherCanSubmitItem();
});

// 对item进行打标签，当把item所有属性都打上标签后，并输入了item name，才能提交
$(".attr-panel").delegate('.panel-body input[type=checkbox], .panel-body input[type=radio]', 'click', function () {
    // 记录所选的attribute value和所对应的attribute name, 并判断是删除还是插入
    var $attribute = $(this).parents('div.attribute');
    var attr_name = $attribute.attr('name');
    var attrn_id = $attribute.attr('id');

    var $label = $("label[for=" + $(this).attr("id") + "]");

    var attr_value = $label.children("span").text();
    var attrv_id = $label.children("span").attr("attrv-id");
    var insert = $(this).is(":checked");

    // 查找item中的属性数组是否存在属性名为attr_name的属性，如果存在则记录下标。
    // 如果item中的attributes中的attr_values为空，说明之前把其中内容删掉，现在添加，计数加一
    var exist = false;
    var index = 0;
    for (var i = 0; i < item.attributes.length; i++) {
        if (item.attributes[i].attr_name === attr_name) {
            exist = true;
            index = i;
            if (item.attributes[i].attr_values.length === 0)
                rec.now_attrs_cnt++;
            break;
        }
    }

    if (insert) {
        // 如果属性存在，则把属性值插入（单选框先删除原来的属性值）
        // 如果属性不存在，则新建属性，并计数加一
        if (exist) {
            if ($(this).attr("type") === "radio") {
                item.attributes[index].attr_values = [];
                item.attributes[index].attrv_ids = [];
            }
            item.attributes[index].attr_values.push(attr_value);
            item.attributes[index].attrv_ids.push(attrv_id);
        } else {
            var attr = {
                "attr_name": attr_name,
                "attrn_id": attrn_id,
                "attr_values": [attr_value],
                "attrv_ids": [attrv_id]
            };
            item.attributes.push(attr);
            rec.now_attrs_cnt++;
        }
        $attribute.removeClass("panel-info");
        $attribute.addClass("panel-success");
    } else {
        // 删除属性值，如果attr_values为空，则计数减一
        item.attributes[index].attr_values.splice(
            item.attributes[index].attr_values.indexOf(attr_value), 1
        );
        item.attributes[index].attrv_ids.splice(
            item.attributes[index].attrv_ids.indexOf(attrv_id), 1
        );
        if (item.attributes[index].attr_values.length === 0) {
            rec.now_attrs_cnt--;
            $attribute.removeClass("panel-success");
            $attribute.addClass("panel-info");
        }
    }
    rec.WhetherCanSubmitItem();
});

// 向datas添加item，并产生一个新的标签
$(".attr-panel").delegate('#submit-item', 'click', function () {
    // 判断新的item是否和原来数据库的一样
    if (IsSameItem(rec.item_temp, item)) {
        // alert("same");
        rec.option += ":same";
        delete item.option;
    } else if (rec.item_temp.hasOwnProperty("type")) {
        // alert("different");
        rec.option += ":different";
    }

    RunFSM(item);
    DisableType(item.type);

    rec.$label.remove();
    rec.WhetherCanSubmit();

    $.ajax({
        url: '/newlabel',
        type: 'post',
        data: JSON.stringify({
            'items': [item]
        }),
        contentType: 'application/json',
        dataType: 'html',
        success: function (data, status) {
            if (status == 'success') {
                $(".attr-panel").empty();
                $(".subpanel").animate({
                    opacity: "toggle"
                });
                change_panel(function () {
                    scroll_top("slow")
                });
                add_label(data);
            }
        },
        error: function (data, status) {
            if (status == 'error') {
                console.log(status);
            }
        }
    });
});

// 选择item种类，获取该种类的所有属性，进入打标签页面
$(".typelist-panel").delegate('span.addAttributes', 'click', function () {
    intoAddAttributes(this);
});

// 编辑标签
$(".panel-show").delegate('span.edit', 'click', function () {
    //找到标签的group和type
    var $td = $(this).parent();
    var $tr = $td.parent();
    var title = $tr.find("span.tag").text();
    var item_type = title.split(/:/)[1];

    //初始化state
    rec.item_temp = {};
    rec.b_in_items = false;
    rec.items_index = SearchIndexFromItems(item_type);
    rec.$label = $tr.parents("div.panel-heading").parent();
    rec.option = "update";
    rec.fsms_index = SearchIndexFromFSMs(item_type);

    if (rec.items_index !== -1) {
        rec.item_temp = items[rec.items_index];
        rec.b_in_items = true;
    }

    //初始化item
    if (rec.fsms_index !== -1) {
        var datas_index;
        var curr_state = fsms[rec.fsms_index].GetCurr();
        if (curr_state === "S1_1") {
            datas_index = SearchIndexFromDatas(item_type, "update");
            item = datas[datas_index];
        } else if (curr_state === "S1_0") {
            item = CloneItem(items[rec.items_index]);
            item.option = "update";
        } else {
            datas_index = SearchIndexFromDatas(item_type, "insert");
            item = datas[datas_index];
        }
    } else {
        item = CloneItem(items[rec.items_index]);
        item.option = "update";
    }
    var result = FindIDsAndAttrsFromGroups(item.group, item.type);
    item.group_id = result.group_id;
    item.type_id = result.type_id;


    //初始化state
    InitAttributesPageState(item.item_name, result.attrs.length);

    //初始化照片墙
    var has_sameitem = InitPictures(item_type);

    //渲染打标签页面
    var render_data = {
        "item_name": item.item_name,
        "group": item.group,
        "type": item.type,
        "attributes": result.attrs,
        "has_sameitem": has_sameitem
    };

    render_attributes(render_data, function (data, status) {
        if (status == 'success') {
            $(".groups-panel").hide();

            $(".panel-show").animate({
                opacity: "toggle"
            }, 200, function () {
                $(".attr-panel").html(data);
                initial_attributes(item.attributes);
                $("#return-groups").attr("id", "return-label");
            });
            $(".attr-panel").fadeIn(600);
        }
    });
});

// 选择同款
$(".attr-panel").delegate('#same-type', 'click', function () {
    var str = $(".attr-panel").find("h3").text();
    var item_type = str.split(/:\s+/)[1];

    //初始化same_item
    same_item = {
        "option": "sameitem",
        "type": item_type,
        "ID": ""
    }

    //渲染照片墙
    $.ajax({
        url: '/same_item_photos',
        type: 'post',
        data: JSON.stringify({
            "pictures": pictures
        }),
        contentType: 'application/json',
        dataType: 'html',
        success: function (data, status) {
            $("#modal-container").css("width", "1000px");
            $("#modal-container").find(".modal-body").html(data);
            var $submit = $("#modal-container").find(".submit");
            $submit.addClass("submit-same-item");
            $submit.attr("disabled", true);
        },
        error: function (data, status) {
            if (status == 'error') {
                console.log(status);
            }
        }
    });
});

//选同款照片获取其id
$("#modal-container").delegate('#choose-same-item input', 'click', function () {
    $("#modal-container").find(".submit").attr("disabled", false);
    same_item.ID = $(this).attr("id");
});

//提交选择同款
$("#modal-container").delegate('.submit-same-item', 'click', function () {
    rec.option = "sameitem";
    RunFSM(same_item);

    rec.$label.remove();
    rec.WhetherCanSubmit();
    DisableType(same_item.type);

    $.ajax({
        url: '/same_item',
        type: 'post',
        data: JSON.stringify(same_item),
        contentType: 'application/json',
        dataType: 'html',
        success: function (data, status) {
            if (status == 'success') {
                $("#modal-container").find(".modal-body").empty();
                $(".attr-panel").empty();
                $(".subpanel").animate({
                    opacity: "toggle"
                });
                change_panel(function () {
                    scroll_top("slow")
                });
                add_label(data);
            }
        },
        error: function (data, status) {
            if (status == 'error') {
                console.log(status);
            }
        }
    });
});

// 最终提交数据给后端操作数据库
$("#submit").click(function () {
    // console.log(JSON.stringify(items));
    // alert(fsms.length);
    alert(JSON.stringify(datas));
    $.ajax({
        url: '/label',
        type: 'post',
        data: JSON.stringify(datas),
        contentType: 'application/json',
        success: function (data, status) {
            if (status == 'success') {
                window.location.href=document.referrer;
            }
        },
        error: function (data, status) {
            if (status == 'error') {
                console.log(status);
            }
        }
    });
});

