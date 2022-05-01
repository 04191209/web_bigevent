$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()
    initEditor()
        //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                //调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id').html(htmlStr)
                    //console.log(htmlStr);

                //一定要记得调用form.render()重新渲染UI结构
                form.render()
            }
        })
    }

    //1.裁剪图片功能实现
    var $image = $('#image')

    //2.裁剪选项
    var options = {
        aspectRation: 400 / 280,
        preview: '.img-preview'
    }

    //3.初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    //监听coverFile的change事件，获取用户选择的图片
    $('#coverFile').on('change', function(e) {
        //获取文件列表数据
        var files = e.target.files
        console.log(files);

        //判断用户是否选择了图片
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0])
            //为裁剪区域重新设置图片
        $image
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options)
    })


    // 定义文章的发布状态
    var art_state = '已发布'

    // 为存为草稿按钮，绑定点击事件（转化为草稿状态）
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定submit提交事件（ajax规定data只能为FormData类型）
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 1.基于form表单，快速创建一个FormData对象  

        //$(this)[0]创建一个原生的Dom元素，快速获得表单值，没有的值手动追加
        var fd = new FormData($(this)[0])

        // 2.手动追加,将fd中的status存到fd中
        fd.append('state', art_state)

        //循环查看下：fd的key和value
        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // })

        //4.将封面裁剪后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 200
            })
            .toBlob(function(blob) {
                // 5.将文件对象，存储到fd中
                fd.append('cover_img', blob)
                    //6.发起ajax数据请求
                publishArticle(fd)
            })

    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如何向服务器的是FormData 格式
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')

                }
                layer.msg('发布文章成功')
                location.href = '../article/article_list.html'

            }
        })
    }

})