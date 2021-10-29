$(function () {
    var layer = layui.layer;
    var form = layui.form;
    //创建一个存放文章分类ID的参数
    var cateID = '';

    //接收本地存储的文章ID
    var id = localStorage.getItem('ID');
    //移除本地存储的文章ID
    localStorage.removeItem('ID');

    //判断id是否有值，即是否是通过文章列表的编辑按钮点击进入的
    if (id !== null) {
        $('#art-header').html('修改文章');
        //获取到文章详情并给表单赋值
        searchArticle(id);
    }

    initCate();


    // 初始化富文本编辑器(富文本脚本自带的方法)
    initEditor()

    //获取文章分类
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return
                }
                var cateStr = template('temp-cate', res);
                $('[name=cate_id]').html(cateStr);
                //将获取到的文章分类的ID传给下拉框，使其选中该列，只能放在此处才能生效
                $('[name=cate_id]').val(cateID)
                //重新渲染分类选项
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //给选择封面按钮绑定文件选择器的点击事件
    $('#btnChooseimg').on('click', function () {
        $('#imgfile').click();
    })

    //给隐藏的文件选择器绑定change事件
    $('#imgfile').on('change', function (e) {
        //获取选择的文件列表
        var files = e.target.files;
        //判断是否选择了文件
        if (files.length === 0) {
            return
        }

        //根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`        
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //设置发布文章的初始状态是“已发布”
    var state = '已发布';

    //当点击存为草稿的时候将状态修改“草稿”状态
    $('#btn2').on('click', function () {
        state = '草稿';
    })

    //给表单绑定提交事件
    $('#formpub').on('submit', function (e) {
        //阻止表单默认提交事件
        e.preventDefault();
        //j将表单的数据转化成FormData格式的数据
        var fd = new FormData($(this)[0]);
        //将状态添加到FormData数据中
        fd.append('state', state);
        //将裁剪后的图片，输出为blob文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，将文件也添加到FormData数据中
                console.log(blob)
                fd.append('cover_img', blob);
                //发起ajax请求，提交文章
                //如果id不为空就执行修改，否则就提交
                if (id !== null) {
                    fd.append('Id',id);
                    updateArticleById(fd);
                } else {
                    publickArticle(fd);
                }
            })
    })

    //发布文章的方法
    function publickArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果发送FormData格式的数据，必须加以下两个配置
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                //发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

    //根据文章ID查询文章的方法
    function searchArticle(id) {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败！')
                }
                //给表单内容赋值
                form.val('formpub', {
                    'title': res.data.title,
                    'content': res.data.content
                });
                //把文章分类的ID存到变量中
                cateID = res.data.cate_id;
                //暂时不清楚怎么把图片赋值到表单中使其显示，故该功能没做
            }
        })
    }

    //根据文章ID更新文章信息
    function updateArticleById(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功！')
                //发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})