//ajaxPrefilter会在真正执行Ajax前调用ajaxPrefilter中的配置
$.ajaxPrefilter(function(options){
    options.url='http://api-breakingnews-web.itheima.net'+options.url;
})