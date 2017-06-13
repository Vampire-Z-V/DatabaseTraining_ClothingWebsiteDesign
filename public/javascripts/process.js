var i = 0;
var temp = {
    'i': i,
    "items": [
        {
            "ID": "1",
            "type": "上衣",
            "labels": [
                "黑",
                "潮流",
                "立领",
                "长袖",
                "常规"
            ]
        }
    ]
};
var datas;
var item;
var submit_item;
var attr_cnt;
$(function () {
    scroll_top("");
    datas = [];


})

$("#add-label").click(function () {
    change_panel(function () {
        $("#process-panel").animate({
            scrollTop: '0px'
        });
    });
});
$("#submit").click(function(){
    alert(JSON.stringify(datas));
});

$(".panel-show").delegate('.collapse-panel-body', 'click', function () {

    if ($(this).hasClass("panel-body-open")) {
        $(this).removeClass("panel-body-open");
    }
    else {
        $(this).addClass("panel-body-open");
    }

    var TD = $(this).parent();
    var TR = TD.parent();
    var TABLE = TR.parent().parent();
    var DIV_HEADING = TABLE.parent();
    var DIV_TAG = DIV_HEADING.parent();
    var DIV_BODY = DIV_TAG.children(".panel-collapse");
    DIV_BODY.animate({
        height: "toggle"
    }, 120);

});

$(".panel-show").delegate('a.remove', 'click', function () {

    var TD = $(this).parent();
    var TR = TD.parent();
    var TABLE = TR.parent().parent();
    var DIV_HEADING = TABLE.parent();
    var DIV_TAG = DIV_HEADING.parent();

    DIV_TAG.animate({
        height: "0px"
    }, 140, function () {
        DIV_TAG.remove();
    });
});

$(".attr-panel").delegate('#return-groups', 'click', function () {
    $(".attr-panel").empty();
    $(".subpanel").animate({
        opacity: "toggle"
    });
});

$(".attr-panel").delegate('.panel-body input[type=checkbox], .panel-body input[type=radio]', 'click', function () {
    // 记录所选的attribute value和所对应的attribute name, 并判断是删除还是插入
    var attr_name = $(this).attr("name");
    var attr_value = $("label[for=" + $(this).attr("id") + "]").children("span").text();
    var insert = $(this).is(":checked");

    // 查找item中的属性数组是否存在属性名为attr_name的属性，如果存在则记录下标。
    // 如果item中的attributes中的attr_values非空，则进行计数
    var exist = false;
    var index = 0;
    var cnt = 0;
    for (var i = 0; i < item.attributes.length; i++) {
        if (item.attributes[i].attr_name === attr_name) {
            exist = true;
            index = i;
            cnt++;
            continue;
        }
        if (item.attributes[i].attr_values.length !== 0) {
            cnt++;
        }
    }


    if (insert) {
        // 如果属性存在，则把属性值插入（单选框先删除原来的属性值）
        // 如果属性不存在，则新建属性，并计数加一
        if (exist) {
            if ($(this).attr("type") === "radio") {
                item.attributes[index].attr_values = [];
            }
            item.attributes[index].attr_values.push(attr_value);
        } else {
            var attr = {
                "attr_name": attr_name,
                "attr_values": [attr_value]
            };
            item.attributes.push(attr);
            cnt++;

        }
    } else {
        // 删除属性值，如果attr_values为空，则计数减一
        item.attributes[index].attr_values.splice(
            item.attributes[index].attr_values.indexOf(attr_value), 1
        );
        if (item.attributes[index].attr_values.length === 0)
            cnt--;
    }

    // 如果item的所有属性都有属性值，则可以提交
    if (cnt === attr_cnt)
        submit_item = true;
    else
        submit_item = false;

    if (submit_item)
        $("#submit-item").attr("disabled", false);
    else
        $("#submit-item").attr("disabled", true);
    console.log(JSON.stringify(item));
});

$(".attr-panel").delegate('#submit-item', 'click', function () {
    datas.push(item);
    console.log(JSON.stringify(datas));
    can_submit();

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
                change_panel(function () { scroll_top("slow") });
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

$("a .label").click(function () {
    // 记录item属于的group,type，把提交设为不可提交
    item = {
        "group": $(this).attr("father"),
        "type": this.innerText,
        "attributes": []
    };

    submit_item = false;

    // 查找类型为type的所有属性标签，并记录属性个数，之后用来设置是否可提交
    var attrs;
    for (var i = 0; i < groups.length; i++) {
        if (groups[i].group === item.group) {
            for (var j = 0; j < groups[i].types.length; j++)
                if (groups[i].types[j].type === item.type) {
                    attrs = groups[i].types[j].attributes;
                    attr_cnt = attrs.length;
                    break;
                }
            break;
        }
    }

    $.ajax({
        url: '/attributepage',
        type: 'post',
        data: JSON.stringify({
            "group": item.group,
            "type": item.type,
            "attributes": attrs
        }),
        contentType: 'application/json',
        dataType: 'html',
        success: function (data, status) {
            if (status == 'success') {
                $(".subpanel").animate({
                    opacity: "toggle"
                });

                $(".attr-panel").html(data).hide();
                $(".attr-panel").fadeIn();
            }
        },
        error: function (data, status) {
            if (status == 'error') {
                console.log(status);
            }
        }
    });
});

$("#return-tags").click(function () {
    change_panel(function () { scroll_top("slow") });
});



function add_label(data) {
    var item = $(data);
    $("#add-label").before(item);
    // item.fadeIn(1000);
    // $("#add-label").fadeIn(800);
    // i++;
    scroll_top("slow");
}

function change_panel(func) {
    $(".panel-show").animate({
        height: "toggle",
        opacity: "toggle"
    }, func);
}

function scroll_top(speed) {
    $("#process-panel").animate({
        scrollTop: $("#success-label-panel-border").height() + 'px'
    }, speed);
}

function can_submit() {
    if (datas.length > 0)
        $("#submit").attr("disabled", false);
    else
        $("#submit").attr("disabled", true);
}