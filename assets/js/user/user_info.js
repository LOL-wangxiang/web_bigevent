$(function(){
    var form=layui.form;
    var layer=layui.layer;
    form.verify({
        nickname: function(val){
            if(val.length>6){
                return '昵称长度必须在1~6个字符之间';
              }
        }
    });

    initUserInfo();

    //初始化用户的基本信息
    function initUserInfo(){
        $.ajax({
            url:'/my/userinfo',
            method:'GET',
            success:function(res){
                if(res.status!==0){
                    return layer.msg('获取用户信息失败');
                }
                //给表单赋值
                form.val("formdata",res.data);
            }
        })
    }

    //提交修改事件
    $('.layui-form').on('submit',function(e){
        //阻止表达的默认提交行为
        e.preventDefault();
        //调用更新用户的基本信息的接口
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            //data:$('.layui-form').serialize(),
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('修改用户信息失败！');
                }
                //console.log(res);
                //若更新成功，则调用index的js中的方法，重新刷新主页图像和昵称
                window.parent.getUserInfo();
                layer.msg('修改用户信息成功！');
            }
        })
    })

    //重置事件
    $('#btnreset').on('click',function(e){
        //阻止默认重置事件
        e.preventDefault();
        //调用初始化用户信息的方法来重置表单
        initUserInfo();
    })
})