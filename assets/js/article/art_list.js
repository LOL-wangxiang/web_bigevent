$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        var date = new Date(data);
        var y = date.getFullYear();
        var m = padZero(date.getMonth() + 1);
        var d = padZero(date.getDate());

        var hh = padZero(date.getHours());
        var mm = padZero(date.getMinutes());
        var ss = padZero(date.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    //定义一个补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    //创建一个q对象，用来存储用于查询列表所需的各种参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 2,//每页显示多少条数据
        cate_id: '',//文章分类的 Id
        state: ''//文章的状态,可选值有：已发布、草稿
    }

    initTable();
    initCate();

    //获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //调用模板引擎给创建查询出来的数据列表

                var htmlstr = template('temp-tb', res)
                $('tbody').html(htmlstr);

                //调用分页方法
                initPage(res.total);
            }
        })
    }

    //获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                //用模板引擎创建分类下拉框
                var catestr = template('temp-cate', res)
                $('[name=cate_id]').html(catestr)
                //通过layui提供的方法，重新渲染一下网页
                form.render();
            }
        })
    }

    //为筛选表单绑定提交事件
    $('#from-search').on('submit', function (e) {
        //阻止默认提交事件
        e.preventDefault();

        //为分类和状态复制
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();

        //重新获取列表数据
        initTable();
    })

    //分页方法
    function initPage(total) {
        //使用layui的分页方法在页面上渲染一个分页
        laypage.render({
            elem: 'pageBox', //放置分页的容器ID
            count: total, //数据总数
            curr: q.pagenum,//设置起始页
            limit: q.pagesize,//设置初始的分页条数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//设定分页的排版样式
            limits:[2, 3, 5, 10, 20],//设置每页条数的选择项

            //1.当页面首次被加载会调用jump方法
            //2.当点击分页切换的时候也会调用分页切换的方法
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                q.pagenum = obj.curr; //obj.curr可以获取分页中当前的页码值
                q.pagesize = obj.limit; //obj.limit可以得到每页显示的条数

                //如果不是首次加载，即当使用切换分页或设置每页显示数时则重新加载列表
                if (!first) {
                    initTable();
                }
            }
        });
    }

    //用代理的方式给删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function () {
        //获取到文章ID
        var id = $(this).attr('data-id')

        //获取当前页面存在的删除按钮的个数
        var len = $('#btn-delete').length;

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/delete/'+id,
                method:'GET',
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')

                    //根据删除按钮的个数判断当前页面是否还有数据
                    //如果没有数据，且当前页数不是第一页，那么就将页数-1
                    if(len===1){
                        q.pagenum = q.pagenum===1?1:q.pagenum-1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    })

    //用代理的方式给编辑按钮绑定点击事件
    $('tbody').on('click','#btn-update',function(){
        //获取到文章ID
        var id =  $(this).attr('data-id')
        //将ID存储到本地
        localStorage.setItem('ID',id);
        //跳转到发表文章的页面
        location.href='/article/art_pub.html';
    })
})