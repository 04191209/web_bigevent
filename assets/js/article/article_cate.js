$(function() {
    var layer = layui.layer
        // 作用快速填充表单内容，数据来源于ajax中的res
    var form = layui.form

    //1.获取文章分类列表
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    console.log('获取文章分类失败');


                }
                //console.log('获取文章分类成功');
                //console.log(res);

                // !!!!!模板引擎的核心（内置方法：template）
                //key1:模板  key2:data
                var htmlStr = template('tpl-table', res)
                var tbody2 = document.querySelector('tbody')
                    //console.log(tbody2);

                //$('#tbody2').html(htmlStr)
                // 上面html为jQuery的方法，出bug了：多出了tbody标签
                //  下面的innerHtml为js原生方法
                tbody2.innerHTML = htmlStr

            }
        })
    }

    var indexAdd = null
        // 为添加类别点击事件(上面是template模板，下面是自己定义模板)
    $('#btnAddCate').on('click', function() {
        //console.log('111');

        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式，为form-add表单绑定submit事件
    //(form-add为模板里面的代码，页面还没加载，只能通告代理)
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                // 快速获取数据，前提是与ajax与name同名
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('添加失败')
                        console.log(res);

                    }
                    initArtCateList()
                    layer.msg('添加成功')
                    layer.close(indexAdd)

                }
            })
        })
        // 代理必须找其模板所在位置的父元素

    //编辑类型功能
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function(e) {
        //console.log('edit');
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章类型',
            content: $('#dialog-edit').html()

        })

        // 获取指定编辑的某个id，进行内容的获取。添加data-id
        var id = $(this).attr('data-id')
            //发起请求获取对应分类的数据
        $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    //console.log(res);
                    // 快速填充连接器：lay-filter
                    form.val('form-edit', res.data)
                }
            })
            //通过代理方式，为修改分类的表单绑定submit事件
        $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('修改类型失败')
                    }
                    layer.msg('修改分类成功')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })

    })

    // 删除指定分类
    $('tbody').on('click', '.btn-delete', function() {
        // 1.拿到删除哪行的td的id(attr获取属性)
        var id = $(this).attr('data-id')
            // layer内置对象：提示用户是否删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' },
            function(index) {
                //do something
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除失败')
                        }
                        layer.msg('删除成功')
                        layer.close(index)
                        initArtCateList()
                    }
                })

                layer.closeIindex
            })
    })
})