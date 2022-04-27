$(function() {
    var form = layui.form

    // 只是内部判断密码，并没有发ajax
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须为6-12位,且不能为空'],

        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一直'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '新密码与确认输入的密码不一样'
            } else {

            }
        }
    })

    //重置密码发起ajax请求
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败')
                }
                return layui.layer.msg('修改密码成功')
                    // 刷新user_pwd.html的iframe的小窗口
                $('.layui-form')[0].reset()
                    //[0]转化为原生的dom元素,含有reset重置表单

            }
        })

    })


})