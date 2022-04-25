//注意：每次调用$.get  或 $.post $.ajax()时候
//发任何ajax都会，先这个函数ajaxPrefilter这个函数
//在这个函数中，可以拿到我们的ajax提供的配置对象url/complete
$.ajaxPrefilter(function(options) {

    //简单来说就是直接获取到/api/login或者/api/reguest
    //console.log(options.url); //结果为：/api/login

    //1.在发起真正的ajax前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        //console.log(options.url);
        //好处：修改一次全局生效

    //2.统一有权限解控
    //options.url.indexOf('/my/')  只有my开头的url才用判断权限
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //3.全局统一挂载 complete回调函数
    options.complete = function(res) {

        //console.log('111');
        //console.log(res); //res可以看stutes是否拿到服务器响应的数据
        if (res.responseJSON.status === 1) {
            // console.log('11');

            //1.强制清空token
            localStorage.removeItem('token')
                //2.强制跳转
            location.href = './login.html'


        }
    }
})