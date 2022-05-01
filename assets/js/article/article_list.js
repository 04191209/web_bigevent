$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + 'ss'
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象，将用来请求数据的时候，
    //将请求参数对象提交给服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的ID
        state: '' //文章的发布状态
    }

    initTable()
    initCate()

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);

                    return layer.msg('获取文章列表失败')

                }
                //使用模板引擎渲染页面
                //console.log(res);
                //layer.msg('获取文章列表成功')
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }


    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }

                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                    //console.log(htmlStr);

                //！！！！！需要重新加载页面UI才会跳出可选框（先加载UI，在js）
                $('[name=cate_id]').html(htmlStr)
                    //通过layui重新渲染表单区域的UI结构
                form.render()

            }


        })
    }


    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选项的值
        var cate_id = $('[name=cate_id').val()
        var state = $('[name=cate_state').val()
            //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        //调用laypage.render()方法渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的ID
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            //分页发生切换时候，触发事件jump()
            //1.点击发生切换的时候，触发jump回调
            //2.只要调用了layui.reader()，就会触发jump回调
            jump: function(obj, first) {
                //console.log(obj.curr);
                //把最新的页码值，赋值到q这个查询对象中
                q.pagenum = obj.curr
                    //根据最新的q获取对应的数据列表，并渲染表格

                //initTable()
                //产生死循环   initTable(){render()};  render(){initTable()};
                //解决方法：first  第一种方法触发点击页码切换触发：first=undefined  第二种：first=ture
                //console.log(first);
                if (!first) {
                    initTable()
                }


            }
        })

    }

    //通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '#btn-delete', function() {
        //！！！！！获得html里面的值，值又是来自于后端的（前段-html-后端）
        var id = $(this).attr('data-id')

        //询问用户是否要删除数据
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除数据失败')
                    }
                    //console.log('111');

                    layer.msg('删除文章成功')
                    initTable()

                }
            })

            layer.close(index)
        })

    })
})