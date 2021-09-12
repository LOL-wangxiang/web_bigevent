$(function(){
    //点击去注册标签事件
    $("#link_login").on('click',function(){
        $(".reg-box").show();
        $(".login-box").hide();
    })
    //点击去登录标签事件
    $("#link_reg").on('click',function(){
        $(".reg-box").hide();
        $(".login-box").show();
    })

    //获取layui的form对象
    var form=layui.form;
    //获取layui的layer对象
    var layer=layui.layer;
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ] ,
        repass:function(value){
            var repass=$(".reg-box [name=password]").val();
            if(repass!==value){
                return '再次确认密码必须和密码一致';
            }
        }
    }); 

    //注册表单的提交事件
    $("#form_reg").on('submit',function(e){
        //阻止提交按钮的默认行为
        e.preventDefault();
        var data={username:$("#form_reg [name=username]").val(),password:$("#form_reg [name=password]").val()}
        $.post('/api/reguser',data,function(res){
            if(res.status!=0){
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            $("#link_reg").click();
        })
    })

    //登录表单的提交事件
    $("#form_login").on('submit',function(e){
        //阻止提交默认行为
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method:'POST',
            //获取表单中所有元素的内容
            data:$(this).serialize(),
            success:function(res){
                if(res.status!=0){
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //将返回的token存入本地存储中
                localStorage.setItem('token',res.token)
                //跳转到后台主页
                location.href='/index.html';
            }
        })
    })
})