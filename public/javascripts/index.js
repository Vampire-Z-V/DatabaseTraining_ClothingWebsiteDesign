// JavaScript Document
$(document).ready(function () {
    $('.message a').click(function () {
        $('form').animate({
            height: "toggle",
            opacity: "toggle"
        }, "slow", function () {
            $('#not-pass-confirm').css("display", "none");
            $('input').val('');
            $('label').removeClass('active highlight');
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
            $('#r-username').css("border", "1px solid #d1d5da");
            if (password != '' && password === confirm) {
                $('#not-pass-confirm').css("display", "none");
                $('#r-password').css("border", "1px solid #d1d5da");
                $('#r-confirm').css("border", "1px solid #d1d5da");
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
                            location.href = 'index';
                        }
                    },

                    error: function (data, status) {
                        if (status === 'error') {

                        }
                    }
                });
            } else {
                $('#not-pass-confirm').fadeIn("slow");
                $('#r-password').css("border", "1px solid red");
                $('#r-confirm').css("border", "1px solid red");
            }
        } else {
            $('#r-username').css("border", "1px solid red");
        }
    });

    $('#login').click(function () {
        var username = $("#l-username").val();
        var password = $("#l-password").val();
        var data = {
            "uname": username,
            "upwd": password
        };
        $.ajax({
            url: '/login',
            type: 'post',
            data: data,
            success: function (data, status) {
                if (status == 'success') {
                    if (data == '服装设计师')
                        location.href = 'designer';
                    else
                        location.href = 'home';
                }
            },
            error: function (data, status) {
                if (status == 'error') {
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