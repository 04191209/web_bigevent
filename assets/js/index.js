$(function() {
    //console.log(localStorage.getItem('token') || '')

    getUserInfo()
    var layer = layui.layer


    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录？', {
                    icon: 3,
                    title: '提示',
                },
                function(index) {

                    //退出的两步走：1.清除token  2.跳转到登录页面
                    localStorage.removeItem('token')
                    location.href = './login.html'

                    //layer自带关闭confirm框
                    layer.close(index)
                })
            //console.log('ok')


    })
})

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //header 就是请求配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        //         //Autnorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsInVzZXJuYW1lIjoiMTIzIiwicGFzc3dvcmQiOiIiLCJuaWNrbmFtZSI6IiIsImVtYWlsIjoiIiwidXNlcl9waWMiOiIiLCJpYXQiOjE2NTA4MTI5ODQsImV4cCI6MTY1MDg0ODk4NH0.aiCzuz30cgXjCky3a1_MYaPmaEHaWtqJiR5j2nvdJQA'

        // },
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 盗用readerAvatar渲染用户头像
            readerAvatar(res.data)

        },
        //无论ajax成功还是失败，都运行complete
        //!!!!解决通过输入url的index.html进入没有权限的首页
        // complete: function(res) {
        //     //console.log('111');
        //     console.log(res); //res可以看stutes是否拿到服务器响应的数据
        //     if (res.responseJSON.status === 1) {
        //        // console.log('11');

        //         //1.强制清空token
        //         localStorage.removeItem('token')
        //             //2.强制跳转
        //         location.href = './login.html'
        //     }

        // }
    })
}

//渲染用户头像(替换文字为真是名字)
function readerAvatar(user) {
    //1.获取用户名称
    var name = user.nickname || user.username
        //2 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        //3 按需渲染头像
    if (user.user_pic !== null) {
        // attr设置值
        $('.layui-nav-img').attr('src', user.user_pic).show

    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
            //转化为大写
        console.log(name);

        var first = name[0].toUpperCase()
        console.log(first);

        $('.text-avater').html(first).show()

    }
}