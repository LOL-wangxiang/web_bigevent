$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    //获取文章列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                var temphtml = template('tab-template', res)
                $('tbody').html(temphtml)
            }
        })
    }

    //创建一个索引用来存放弹出层所对应的索引
    var indexAdd = null;
    //为添加分类按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        //弹出一个添加文章分类信息的层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#addcate').html()
        });
    })

    //用代理的方式给form-add添加提交事件
    $('body').on('submit', '#form-add', function (e) {
        //阻止默认提交事件
        e.preventDefault();
        //console.log('ok')
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                initArtCateList();
                layer.msg('新增文章分类成功！')
                //根据索引关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })

    //用代理的方式给btn-edit添加点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        //console.log('ok')
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#editcate').html()
        })

        var id = $(this).attr('data-id')
        //根据id发起请求，获取对应分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    //用代理的方式给form-edit添加提交事件
    $('body').on('submit', '#form-edit', function (e) {
        //阻止默认提交事件
        e.preventDefault();
        //console.log('ok')
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章分类失败！')
                }
                initArtCateList();
                layer.msg('修改文章分类成功！')
                //根据索引关闭对应的弹出层
                layer.close(indexEdit);
            }
        })
    })

    //用代理的方式给btn-delete添加点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //根据id发起请求，获取对应分类数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }                    
                    layer.msg('删除文章分类成功！')
                    initArtCateList();
                    layer.close(index);
                }
            })
        });
    })
})