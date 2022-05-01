$(function() {
    var layer = layui.layer
        // 1获取裁剪区域的dom元素
    var $image = $('#image')

    const options = {
        aspectRatio: 1,
        preview: '.img-preview'
    }

    // 
    $image.cropper(options)

    //2.模拟人工点击上传file
    $('#btnChooseImage').on('click', function() {
            $('#file').click()
        })
        // change事件在自己的图片库中选择图片
    $('#file').on('change', function(e) {
        //e里面为用户选择的文件图片
        //路径： e/target/files(伪数组)/img/.jpng
        console.log(e);
        var fileslist = e.target.files
            //console.log(fileslist);
        if (fileslist.length === 0) {
            return layer.msg('用户没有选择图片')
        }

        //裁剪过程：md文档上有详细写法（不需记得代码
        //1.拿到用户选择的文件
        var file = e.target.files[0]
            //2.将文件转化为路径
        var imgURL = URL.createObjectURL(file)
            //3.重新初始化裁剪区
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    //最终裁剪后的图片存放在$image中,toDataURl转化为数字让后端把数字转化为
    //真实图片转化数字：网址https://www.css-js.com/tools/base64.html


    //为确定按钮，绑定点击上传图片事件
    $('#btnUpload').on('click', function() {
        // 1. 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 2. 调用接口，把头像上传到服务器
            //console.log(dataURL);

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo()
            }
        })
    })
})