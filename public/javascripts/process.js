var i = 0;

$("#add-label").click(function () {
    // $("#process-panel").hide();

    // $(".panel-show").animate({
    //     height: "toggle",
    //     opacity: "toggle"
    // });
    // $("#process-panel").animate({
    //     scrollTop: $("#success-label-panel-border").height() + 'px'
    // });
    add_label("");
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


function create_label() {
    return '<div class="panel panel-success">' +

        '<div class="panel-heading">' +
        '<table width="100%">' +
        '<tr>' +
        '<td class="td-title" width="90%">' +
        '<a class="collapse-panel-body" href="#">' +
        '<div style="width: inherit;">' +
        '<div class="icon-arrow"></div>' +
        '<span class="tag"> 标签' + i + '</span>' +
        '</div>' +
        '</a>' +
        '</td>' +

        '<td class="td-edit" style="text-align: center">' +
        '<span class="glyphicon glyphicon-edit icon-cross" style="margin-top: 2px"></span>' +
        '</td>' +

        '<td class="td-remove" style="text-align: center">' +
        '<a class="remove" href="#">' +
        '<span class="glyphicon glyphicon-trash icon-cross" style="margin-top: 2px"></span>' +
        '</a>' +
        '</td>' +
        '</tr>' +
        '</table>' +

        '</div>' +
        '<div class="panel-collapse">' +
        '<div class="panel-body">' +
        'test ' + i +
        '</div>' +
        '</div>' +
        '</div>';
}

function add_label(data) {
    var item = $(create_label());
    $("#add-label").hide().before(item);
    item.fadeIn(1000);
    $("#add-label").fadeIn(800);
    i++;

    $("#process-panel").animate({
        scrollTop: $("#success-label-panel-border").height() + 'px'
    }, "slow");
}
// $("a").click(function () {
//     $(".panel-show").animate({
//         height: "toggle",
//         opacity: "toggle"
//     });
//     $("#process-panel").animate({
//         scrollTop: $("#success-label-panel-border").height() + 'px'
//     });
// });
