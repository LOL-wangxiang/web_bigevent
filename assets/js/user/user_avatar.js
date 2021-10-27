$(function () {
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //为上传按钮绑定点击事件触发点击文件上传的效果
    $('#btnChangeImage').on('click', function () {
        $('#file').click();
    })

    //为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        //获取选择的文件列表
        var fileList = e.target.files
        if (fileList.length === 0) {
            return layer.msg('请选择图片');
        }

        //选择获取的第一个文件
        var file = e.target.files[0];
        //根据选择的文件创建一个URL地址
        var imageurl = URL.createObjectURL(file);
        //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imageurl)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //为确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        //1.获取裁剪区域的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        //2.将获取到的图片上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新头像失败！')
                }
                layer.msg('更新头像成功！')
                //3.重新渲染页面
                window.parent.getUserInfo();
            }
        })
    })
})