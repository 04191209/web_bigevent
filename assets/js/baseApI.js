//注意：每次调用$.get  或 $.post $.ajax()时候
//会先嗲欧勇这个函数ajaxPrefilter这个函数
//在这个函数中，可以拿到我们的ajax提供的配置对象
$.ajaxPrefilter(function(options) {

    //简单来说就是直接获取到/api/login或者/api/reguest
    console.log(options.url); //结果为：/api/login

    //在发起真正的ajax前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log(options.url);


    //好处：修改一次全局生效
})