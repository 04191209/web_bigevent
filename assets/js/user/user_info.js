$(function() {
    var form = layui.form


    form.verify({
        // ay-verify="required|nickname"与html页面交互
        nickname: function(value) {
            if (value.length > 7) {
                return '昵称长度必须1-6个字符之间'
            }
        }
    })

    initUserInfo()
        //初始化用户的基本信息（赋值给html文本框）
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                //console.log(res);
                //调用 form.val()快速为表单赋值
                form.val('formUserInfo', res.data)

            }
        })
    }

    //重置表单的数据
    $('#btnReset').on('click', function(e) {
        //阻止表单的默认重置
        e.preventDefault();
        //上面一句话实现了重置
        initUserInfo()

    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        //阻止表单的默认提交事件
        e.preventDefault()
            //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户失败')
                }
                layer.msg('更新用户信息成功')
                    //调用父页面index.js,
                    //重新渲染用户信息和头像getUserInfo函数

                //!!!!如何同iframe中调用其父盒子，
                //window代表子元素所在父元素的窗口
                window.parent.getUserInfo()
            }

        })
    })


})