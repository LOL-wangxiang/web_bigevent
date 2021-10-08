//ajaxPrefilter会在真正执行Ajax前调用ajaxPrefilter中的配置
$.ajaxPrefilter(function(options){
    //拼接接口地址，使接口完整
    options.url='http://api-breakingnews-web.itheima.net'+options.url;
    //判断接口地址中是否包含my，是的话添加headers请求头
    if(options.url.indexOf('/my/')!==-1){
        options.headers={
            Authorization:localStorage.getItem('token') || ''
        };
    }
    //调用complete回调函数，判断请求失败的话直接退回到登录界面
    options.complete=function(res){
        //判断res结果是否请求失败
        if(res.responseJSON.status===1 && res.responseJSON.message==='身份认证失败！'){
            //强制清空本地存储token
            localStorage.removeItem('token');
            //跳转到登录页面
            location.href='/login.html';
        }
    }
})