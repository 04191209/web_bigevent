$(function() {
    //点击去注册的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //登录注册预处理
    var form = layui.form
    var layer = layui.layer
        //从layui获取form对象layui相当于$
        //form.verify()函数是layui的html有详细的使用说明,相当于封住好了方法
        //通过form.verify()函数自定义校验规则，配合html里面的lay-verify，使用
    form.verify({
        //自定义一个叫做pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须到6到12位，且不能出现空格'],
        //校验两次输入密码一致规则
        repwd: function(value) {
            //通过新参拿到确认密码框的内容
            //还需要拿到密码框的内容
            //.reg-box为父元素，[name=password]用来匹配确切的子元素
            var repassword = $('.reg-box [name=password]').val()
            if (value !== repassword) {
                return '两次输入密码不一样'
            }

            //然后进行一次等于的判断
            //如果判断失败，则return 一个提示消息即可

        }
    })


    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {

        //data太长了，裁剪出来符号用{}
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
            //http://ajax.frontend.itheima.net/api/reguser
        e.preventDefault();
        //username: $('#form_reg 这里有空格[name=username]').val()
        $.post('/api/reguser', data,
            function(res) {

                if (res.status !== 0) {
                    //return console.log(res.massage + '1');
                    return layer.msg(res.message)

                }
                //console.log('注册成功');
                layer.msg('注册成功，请登录')
                    //模拟人的点击行为
                $('#link_login').click()

                //注册成功直接跳转到登录页面
                //方法：
                //第一步：获取dom  
                //第二次：自动触发事件（var click = document.createEvent("click" click.init--  element.dispatchEvent(click)) ）
                //方法二：$('click_login').click()
            })
    })

    //url的拼接

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        var data2 = { username: $('#form_login [name=username]').val(), password: $('#form_login [name=password]').val() }
            //console.log(data2);

        //$.post('http://api-breakingnews-web.itheima.net/api/login', data2,
        $.post('/api/login', data2,
            function(res) {
                if (res.status !== 0) {
                    //return console.log('登录错误');
                    return layer.msg(res.message)


                }
                //console.log('登录成功');
                layer.msg('登录成功')

                //tocke为管理员才拥有的值
                localStorage.setItem('token', res.token); //a1 111111新的后端管理员不知道密码
                //管理员的token：Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI


                //跳转到后台主页
                location.href = '/index.html'

            })
    })


})