var datas;  //最终提交给后端的数据，包含多个item
var item;   //增加或修改一个标签时，记录item信息
var state;  //记录当前状态

function State() {
    // 判断当前状态的属性
    this.b_can_submit_item = false; //判断是否满足条件把item添加进datas里
    this.b_has_itemname = false;    //判断是否输入了item name
    this.b_in_datas = false;    //判断此item是否为未上传数据库的item

    // 记录一些判断所需要的条件
    this.total_attrs_cnt = 0;   //记录当前item种类所包含的所有属性个数
    this.now_attrs_cnt = 0;     //记录当前item已经添加了的属性个数
    this.item_temp = {};        //记录初始item副本
    this.$label = $("");        //记录点击编辑的那个标签

    this.CloneItem = function (curr_item) {
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

    // 判断item是否已经打完标签
    this.WhetherCanSubmitItem = function () {
        // 如果item的所有属性都有属性值和item_name不为空，则可以提交
        if (this.now_attrs_cnt === this.total_attrs_cnt && this.b_has_itemname/* && !this.isSameItem(this.item_temp, item)*/)
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

    // 判断两个item是否相同
    this.isSameItem = function (old_item, new_item) {
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
}

$(function () {
    scroll_top("");
    datas = [];
    state = new State();

    var $panel = $("div.typelist-panel");
    for (var i = 0; i < items.length; i++) {
        var $span = $panel.find("span[name=" + items[i].type + "]");
        $span.removeClass("addAttributes");
        $span.addClass("unclickable");
        $span.undelegate();
    }
});

$("#add-label").click(function () {
    change_panel(function () {
        $("#process-panel").animate({
            scrollTop: '0px'
        });
    });
});

// 最终提交数据给后端操作数据库
$("#submit").click(function () {
    // console.log(JSON.stringify(items));
    // alert(JSON.stringify(datas));
    $.ajax({
        url: '/label',
        type: 'post',
        data: JSON.stringify(datas),
        contentType: 'application/json',
        success: function (data, status) {
            if (status == 'success') {

            }
        },
        error: function (data, status) {
            if (status == 'error') {
                console.log(status);
            }
        }
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

// 删除标签
$(".panel-show").delegate('span.remove', 'click', function () {
    var $td = $(this).parent();
    var $tr = $td.parent();
    var title = $tr.find("span.tag").text();
    var str = title.split(/:/);

    item = {};
    state.b_in_datas = true;
    var isModify = false;
    for (var i = 0; i < items.length; i++) {
        if (items[i].group === str[0] && items[i].type === str[1]) {
            state.b_in_datas = false;
            if (items[i].hasOwnProperty("modify"))
                isModify = true;
            alert(JSON.stringify(items[i]));
            item.group = items[i].group;
            item.type = items[i].type;
            item.ID = items[i].ID;
            item.option = "delete";
            break;
        }
    }

    var $div_panel = $(this).parents('div.panel');
    $div_panel.animate({
        height: "0px"
    }, 140, function () {
        $div_panel.remove();
        if (state.b_in_datas || isModify) {
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].group === str[0] && datas[i].type === str[1]) {
                    datas.splice(i, 1);
                    break;
                }
            }
        }
        if (!state.b_in_datas) {
            //     var result = find_ids_and_attrs(item.group, item.type, item.item_name);
            //     item.group_id = result.group_id;
            //     item.type_id = result.type_id;
            //
            //     var render_data = {
            //         "item_name": item.item_name,
            //         "group": item.group,
            //         "type": item.type,
            //         "attributes": result.attrs
            //     };
            //
            //     render_attributes(render_data, function (data, status) {
            //         if (status == 'success') {
            //             $(".attr-panel").html(data).hide();
            //             initial_attributes(item.attributes, item.option);
            //             $(".attr-panel").html("");
            //         }
            //     });
            //     initial_attributes(item.attributes, item.option);
            datas.push(item);
        }
        var $panel = $("div.typelist-panel");
        var $span = $panel.find("span[name=" + item.type + "]");
        $span.addClass("addAttributes");
        $span.removeClass("unclickable");
        state.WhetherCanSubmit();
    });
});

// 从开始打标签页面返回选择种类页面
$(".attr-panel").delegate('#return-groups', 'click', function () {
    $(".attr-panel").empty();
    $(".subpanel").animate({
        opacity: "toggle"
    });
});

// 检测是否输入了item name
$(".attr-panel").delegate('input[id=item-name]', 'keyup blur focus click', function () {
    if ($(this).val() !== '') {
        state.b_has_itemname = true;
        item.item_name = $(this).val();
    }
    else
        state.b_has_itemname = false;

    state.WhetherCanSubmitItem();
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
                state.now_attrs_cnt++;
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
            state.now_attrs_cnt++;
        }
    } else {
        // 删除属性值，如果attr_values为空，则计数减一
        item.attributes[index].attr_values.splice(
            item.attributes[index].attr_values.indexOf(attr_value), 1
        );
        item.attributes[index].attrv_ids.splice(
            item.attributes[index].attrv_ids.indexOf(attrv_id), 1
        );
        if (item.attributes[index].attr_values.length === 0) {
            state.now_attrs_cnt--;
        }
    }
    state.WhetherCanSubmitItem();
});

// 向datas添加item，并产生一个新的标签
$(".attr-panel").delegate('#submit-item', 'click', function () {
    state.item_temp.modify = true;
    if (state.isSameItem(state.item_temp, item)) {
        delete item.option;
        delete state.item_temp.modify;
    }

    // 如果item已经在datas里，但是相对于数据库的数据没有修改，则把它从datas删除
    // 如果item不在datas里，并且相对于数据库的数据做出了修改，则添加进datas
    // 如果item已经在datas里，并且相对于数据库的数据做出了修改，不需要添加或删除，因为item为此数据引用，datas已发生改变
    if (state.b_in_datas && !state.item_temp.hasOwnProperty("modify")) {
        var i = 0;
        for (; i < datas.length; i++) {
            if (datas[i].group === item.group && datas[i].type === item.type)
                break;
        }
        datas.splice(i, 1);
    } else if (!state.b_in_datas && state.item_temp.modify) {
        datas.push(item);
    }
    var $panel = $("div.typelist-panel");
    var $span = $panel.find("span[name=" + item.type + "]");
    $span.removeClass("addAttributes");
    $span.addClass("unclickable");
    $span.undelegate();
    state.$label.remove();
    state.WhetherCanSubmit();

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
    var $td = $(this).parent();
    var $tr = $td.parent();
    var title = $tr.find("span.tag").text();
    var str = title.split(/:/);

    state.$label = $tr.parents("div.panel-heading").parent();

    // 先在items数组里找，如果没找到就在datas数组里找，
    // 如果找到了，记录item temp，并判断是否已经修改过，如果修改过，就到datas里面找
    state.b_in_datas = true;
    state.item_temp = {};
    for (var i = 0; i < items.length; i++) {
        if (items[i].group === str[0] && items[i].type === str[1]) {
            state.item_temp = items[i];
            if (items[i].hasOwnProperty("modify"))
                break;

            state.b_in_datas = false;
            item = state.CloneItem(items[i]);
            item.option = "update";
            break;
        }
    }

    if (state.b_in_datas) {
        for (var i = 0; i < datas.length; i++) {
            if (datas[i].group === str[0] && datas[i].type === str[1]) {
                item = datas[i];
                break;
            }
        }
    }

    var result = find_ids_and_attrs(item.group, item.type, item.item_name);
    if (!state.b_in_datas) {
        item.group_id = result.group_id;
        item.type_id = result.type_id;
    }

    var render_data = {
        "item_name": item.item_name,
        "group": item.group,
        "type": item.type,
        "attributes": result.attrs
    };

    render_attributes(render_data, function (data, status) {
        if (status == 'success') {
            $(".groups-panel").hide();

            $(".panel-show").animate({
                opacity: "toggle"
            }, 200, function () {
                $(".attr-panel").html(data);
                initial_attributes(item.attributes, item.option);
                $("#return-groups").attr("id", "return-label");
            });
            $(".attr-panel").fadeIn(600);
        }
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

// 初始化item和查找相关属性
function find_ids_and_attrs(group, type, item_name) {
    state.b_can_submit_item = false;
    if (item_name === "")
        state.b_has_itemname = false;
    else
        state.b_has_itemname = true;

    // 查找类型为type的所有属性标签，并记录属性个数，之后用来设置是否可提交
    var result = {
        group_id: "",
        type_id: "",
        attrs: []
    };

    state.now_attrs_cnt = 0;
    for (var i = 0; i < groups.length; i++) {
        if (groups[i].group === group) {
            result.group_id = groups[i].group_id;
            for (var j = 0; j < groups[i].types.length; j++) {
                if (groups[i].types[j].type === type) {
                    result.type_id = groups[i].types[j].type_id;
                    result.attrs = groups[i].types[j].attributes;
                    state.total_attrs_cnt = result.attrs.length;
                    break;
                }
            }
            break;
        }
    }
    return result;
}

// 获取每个标签的属性名和属性对应的id，编辑标签时把已存在的标签先自动打好
function initial_attributes(attrs, option) {
    var $attr_panel = $('.attr-panel');

    attrs.forEach(function (attribute) {
        var $attribute = $attr_panel.find('div[name=' + attribute.attr_name + ']');
        attribute.attrn_id = $attribute.attr('id');
        attribute.attrv_ids = [];
        attribute.attr_values.forEach(function (attr_value) {
            var $span = $attribute.find('span[attr_value=' + attr_value + ']');
            if (option === "update") {
                var $input = $span.parent().prev();
                $input.attr("checked", true);
            }

            attribute.attrv_ids.push($span.attr('attrv-id'));
        });
    });
    state.now_attrs_cnt = item.attributes.length;
}

// 进入增加标签属性页面
function intoAddAttributes(obj) {
    // 记录item属于的group,type，把提交设为不可提交
    item = {
        "item_name": "",
        "group": $(obj).attr("father"),
        "group_id": "",
        "type": obj.innerText,
        "type_id": "",
        "attributes": [],
        "option": "insert"
    };

    state.item_temp = {};
    state.b_in_datas = false;
    state.$label = $("");

    // 判断该新增标签是否为先删除原有的标签（数据库中的数据）再重新打
    for (var i = 0; i < items.length; i++) {
        if (items[i].group === item.group && items[i].type === item.type) {
            state.item_temp = items[i];
            item.ID = items[i].ID;
            item.option = "update";
            state.b_in_datas = true;
            break;
        }
    }

    // 如果是先删再增，则先把原先记录在datas里的该标签（操作为delete）删除
    if (state.b_in_datas) {
        for (var i = 0; i < datas.length; i++) {
            if (datas[i].group === item.group && datas[i].type === item.type) {
                datas.splice(i, 1);
                state.b_in_datas = false;
                break;
            }
        }
    }

    var result = find_ids_and_attrs(item.group, item.type, item.item_name);
    item.group_id = result.group_id;
    item.type_id = result.type_id;

    var render_data = {
        "item_name": item.item_name,
        "group": item.group,
        "type": item.type,
        "attributes": result.attrs
    };

    render_attributes(render_data, function (data, status) {
        if (status == 'success') {
            $(".subpanel").animate({
                opacity: "toggle"
            }, 100);

            $(".attr-panel").html(data).hide();
            $(".attr-panel").fadeIn();
        }
    });
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