$(function(){
    getUserInfo();
    //实现退出功能
    var layer=layui.layer;
    $('.btnLogout').on('click',function(){
        layer.confirm('确定要退出吗？', {icon: 3, title:'提示'}, function(index){
            //退回到登录页面
            //清空本地存储token
            localStorage.removeItem('token');
            //跳转到登录页面
            location.href='/login.html';
            //layui提供的关闭弹出框的方法       
            layer.close(index);
          });
    })
})

//获取用户信息
function getUserInfo(){
    $.ajax({
        url:'/my/userinfo',
        method:'GET',
        /*headers:{Authorization:localStorage.getItem('token') || ''},*/
        success:function(res){
            if(res.status!==0){
                /*//清空本地存储token
                localStorage.removeItem('token');
                //跳转到登录页面
                location.href='/login.html';*/
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data);
        }
    })
}

//渲染用户头像
function renderAvatar(user){
    //获取用户名
    var name = user.nickname || user.username;
    //渲染用户名
    $('#welcome').html('欢迎&nbsp&nbsp'+name);
    //渲染图片头像
    if(user.user_pic!==null){
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide();
    }else{
        //渲染文本头像
        $('.layui-nav-img').hide();
        $('.text-avatar').html(name[0].toUpperCase()).show();
    }
}