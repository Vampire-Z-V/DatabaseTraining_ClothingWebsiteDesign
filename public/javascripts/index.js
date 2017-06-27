// JavaScript Document
$(document).ready(function () {
    $('.message a').click(function () {
        $('.msg').empty();
        $('form').animate({
            height: "toggle",
            opacity: "toggle"
        }, "slow", function () {
            $('#not-pass-confirm').css("display", "none");
            $('input').val('');
            $('label').removeClass('active highlight');
            reset_input('.form input');
        });
    });

    $('#register-href').click(function () {
        $('.form-header h1').hide().html("Register");
        $('.form-header h1').fadeIn("slow");
    });

    $('#login-href').click(function () {
        $('.form-header h1').hide().html("Login");
        $('.form-header h1').fadeIn("slow");
    });

    $('#create').click(function () {
        var username = $('#r-username').val();
        var usertype = $('#r-usertype').val();
        var password = $('#r-password').val();
        var confirm = $('#r-confirm').val();

        if (username != '') {
            reset_input('#r-username');
            if (password != '' && password === confirm) {
                $('#not-pass-confirm').css("display", "none");
                reset_input('#r-password');
                reset_input('#r-confirm');
                $.ajax({
                    url: '/register',
                    type: 'post',
                    data: {
                        "uname": username,
                        "utype": usertype,
                        "upwd": password
                    },

                    success: function (data, status) {
                        if (status === 'success') {
                            location.href = '/index';
                        }
                    },

                    error: function (data, status) {
                        $('.msg').html(data.responseText);
                        $('.msg-content').hide();
                        $('.msg-content').fadeIn(200);
                    }
                });
            } else {
                $('#not-pass-confirm').fadeIn("slow");
                alert_input('#r-password');
                alert_input('#r-confirm');
            }
        } else {
            alert_input('#r-username');
        }
    });

    $('#login').click(function () {
        var username = $("#l-username").val();
        var password = $("#l-password").val();
        var data = {
            "uname": username,
            "upwd": password
        };
        reset_input('#l-username');
        reset_input('#l-password');
        $.ajax({
            url: '/login',
            type: 'post',
            data: data,
            success: function (data, status) {
                if (status == 'success') {
                    if (data == '服装设计师')
                        location.href = '/designer';
                    else if (data === '销售管理员')
                        location.href = '/stocks';
                    else
                        location.href = '/home';
                }
            },
            error: function (data, status) {
                $('.msg').html(data.responseText);
                $('.msg-content').hide();
                $('.msg-content').fadeIn(200);
                if (data.status === 404) {
                    alert_input('#l-username');
                } else if (data.status === 405) {
                    alert_input('#l-password');
                }
            }
        });
    });

    $('.form').find('input').on('keyup blur focus click', function (e) {

        var $this = $(this),
            label = $this.prev('label');

        if (e.type === 'keyup' || e.type === 'click') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.addClass('active highlight');
            }
        } else if (e.type === 'blur') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.removeClass('highlight');
            }
        } else if (e.type === 'focus') {
            if ($this.val() === '') {
                label.removeClass('highlight');
            }
            else if ($this.val() !== '') {
                label.addClass('highlight');
            }
        }
    });

});

function alert_input(obj){
    $(obj).css("border", "1px solid red");
}

function reset_input(obj){
    $(obj).css("border", "1px solid #d1d5da");
}