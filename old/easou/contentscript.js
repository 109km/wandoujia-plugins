$(window).load(function(){
    var wanDouJiaExt = {
        init: function(){
            wanDouJiaExt.modifyDetailPage();
            //wanDouJiaExt.autoChangeDownload();
            wanDouJiaExt.modifySpecialPage();
            wanDouJiaExt.checkPage();
        },
        modifyDetailPage:function(){

            $('.mp_playmedia').hide();

            if( document.getElementById('if_index') == null){
                return false;
            }

            var iframe = document.getElementById('if_index').contentDocument;

            // modify css
            $('.listen,.mp3,.pt,.new_song_tit,.btn_play,.new_songer',iframe).hide();
            $('.new_songer',iframe).last().next().hide();
            $("#360iframe").height(1000);

            $("#content",iframe).css({
                "width":"760px",
                "overflow":"hidden"
            });
            $("#main",iframe).css({
                "margin-right":"10px",
                "width":"510px",
                "overflow":"hidden"
            });
            $('.song_border',iframe).css({
                "width":"508px"
            });
            $("#sider",iframe).css({
                "width":"240px",
                "overflow":"hidden"
            });
            $(".sider_t_box",iframe).css({
                "width":"230px",
                "margin-left":"0px",
                "overflow":"hidden"
            });
            $(".sider_con",iframe).css({
                "width":"230px",
                "margin-left":"0px",
                "overflow":"hidden"
            });
            $(".hotword a",iframe).css({
                "padding-right":"15px"
            });
            $(".music_tit ul li",iframe).css({
                "display":"block",
                "width":"55px",
                "overflow":"hidden",
                "margin":"0px",
                "padding":"0px"
            });
            $(".zt_con ul li dl dd",iframe).css({
                "width":"130px"
            });
            $(".zt_con ul li dl",iframe).css({
                "width":"138px"
            });

            // 分类页面
            if($("#nav_content",iframe).length > 0 ){
                $("#subject_result",iframe).css({
                    "width":"556px"
                });
                $(".bt_bg2",iframe).css({
                    "width":"550px"
                });
                $("#main",iframe).css({
                    "margin-right":"0px",
                    "width":"554px",
                    "overflow":"hidden",
                    "padding":"0px"
                });
            }

            // 搜索页面
            if($('.content_box',iframe).length > 0 ){
                $('.content_box',iframe).width(737);
                $('#main',iframe).width(737);
                $('#main ul',iframe).width(730);
                $('.song_txt ul li p.wd550',iframe).width(520);
            }



            // build links
            var items = $('.down',iframe);
            if(items.length <= 0){
                return false;
            }
            items.each(function(){
                var self = $(this),
                    attr_onclick ,
                    params,
                    song_tlt,
                    param_str,
                    new_href,
                    rid,
                    esid,
                    name;

                if (self == null || $(this).attr('onclick') == null ){
                    return false;
                }

                // change the onclick code as a string
                attr_onclick = $(this).attr('onclick').toString();
                param_str = attr_onclick.slice(attr_onclick.indexOf("('"),attr_onclick.length-2);
                params = param_str.split(',');
                rid = params[0].slice(2,params[0].length-1);
                esid = params[1].slice(1,params[1].length-1);
                name = params[2].slice(1,params[2].length-3);
                song_tlt = self.parent().parent().find('p a').first();
                // get params via ajax
                $.getJSON("/ai.e?rid="+rid+"&amp;esid="+esid,
                    function(g){
                        $.each(g,function(n,p){
                            new_href = decodeURIComponent(p.url) +
                                "#name=" + name + "&content-type=" + encodeURIComponent("audio/mp3");
                            self.removeAttr('onclick').attr("rel","download").attr("href",new_href);
                            song_tlt.removeAttr('onclick').attr("rel","download").attr("href",new_href);
                        });
                    }
                );


            });

            // trigger play btn
            $('.mp_play_box','.mp_playmedia').click(function(){
                wanDouJiaExt.autoChangeDownload();
            });

        },
        modifySpecialPage:function(){
            if( document.getElementById('if_index') == null){
                return false;
            }

            var parent_iframe = document.getElementById('if_index').contentDocument;

            if( parent_iframe.getElementById('album_result_detail') == null){
                return false;
            }
            var child_iframe = parent_iframe.getElementById('album_result_detail').contentDocument;
            $('#360iframe').css('height','auto');
            $('#content',parent_iframe).css("overflow","visible");
            $('.scrool_box',parent_iframe).width(761);
            $('.scrool_box ul',parent_iframe).width(711);
            $('.scrool_box ul li',parent_iframe).css("margin-left","10px");
            $('.content_box',child_iframe).css({
                "width":"715px",
                "padding-left":"0px",
                "margin":"0 auto",
                "border-bottom":"1px solid #ccc"
            });
            $('.bt_bg4',child_iframe).hide();
            $('.songer_Introduction_txt',child_iframe).width(530);

            $("#main",child_iframe).width(735);
            
            $('.listen,.mp3,.pt,.new_song_tit,.btn_play,.new_songer',child_iframe).hide();

            var items = $('.down',child_iframe);
            if(items.length <= 0){
                return false;
            }
            items.each(function(){
                var self = $(this),
                    attr_onclick ,
                    params,
                    song_tlt,
                    param_str,
                    new_href,
                    rid,
                    esid,
                    name;

                if (self == null || $(this).attr('onclick') == null ){
                    return false;
                }

                // change the onclick code as a string
                attr_onclick = $(this).attr('onclick').toString();
                param_str = attr_onclick.slice(attr_onclick.indexOf("('"),attr_onclick.length-2);
                params = param_str.split(',');
                rid = params[0].slice(2,params[0].length-1);
                esid = params[1].slice(1,params[1].length-1);
                name = params[2].slice(1,params[2].length-3);
                song_tlt = self.parent().parent().find('p a').first();
                // get params via ajax
                $.getJSON("/ai.e?rid="+rid+"&amp;esid="+esid,
                    function(g){
                        $.each(g,function(n,p){
                            new_href = decodeURIComponent(wanDouJiaExt.request_url(p.url)['src']) +
                                "#name=" + name + "&content-type=" + encodeURIComponent("audio/mp3");

                            self.removeAttr('onclick').attr("rel","download").attr("href",new_href);
                            song_tlt.removeAttr('onclick').attr("rel","download").attr("href",new_href);
                        });
                    }
                );


            });

        },
        current_song_name:null,
        // change the play plugin's download link
        autoChangeDownload:function(){
            var song_name = $.trim($('.song','.mp_playmedia').text()),
                 singer_name = $.trim($('.singer','.mp_playmedia').text()),
                 auto_list = $('.mp_playlist','#asaimsg'),
                 uid,esid
                 ,new_href;

            if(singer_name == ''){
                return false;
            }

            auto_list.find('li').each(function(){
                var list_song_name = $.trim($(this).find('span a').first().text());

                if(song_name == list_song_name){
                    wanDouJiaExt.current_song_name = song_name;
                    uid = $(this).find('span input').attr('uid');
                }
            });

            $('input','#conent').each(function(){
                if($(this).attr('songid') == uid){
                    esid = $(this).attr('esid');
                }
            });

            $.ajax({
                url: "/su.e?id=" + uid + "&esid=" + esid,
                cache: true,
                dataType: "json",
                asyn: true,
                success: function(f) {
                    if (!f || f.FLAG != "1111") {
                        if (wanDouJiaExt.MP.log) {
                            alert("调试:取得歌曲地址失败")
                        }
                        return
                    }
                    var url = f.URL || "";
                    new_href = decodeURIComponent(wanDouJiaExt.request_url(url)['src']) +
                        "#name=" + encodeURIComponent(wanDouJiaExt.current_song_name)
                        + "&content-type=" + encodeURIComponent("video/mp3");
                    $('.mp_playmedia .play_down a').attr("rel","download").attr("href",new_href).removeAttr('onclick');
                },
                error: function(f) {
                    alert("下载资源错误!")
                }
            });
        },
        // get params from a url
        request_url:function (url){
            var url = url,
                request = new Object(),
                strs;
            if (url.indexOf("?") != -1) {
                var str = url.substr(url.indexOf("?")+1,url.length-url.indexOf("?"));
                strs = str.split("&");
                for(var i = 0; i < strs.length; i ++) {
                    request[strs[i].split("=")[0]] = strs[i].split("=")[1];
                }
            }
            return request;
        },
        checkPage:function(){
            setInterval(function(){
                if( document.getElementById('if_index') == null){
                    return false;
                }
                var iframe = document.getElementById('if_index').contentDocument;

                if($("#content",iframe).length > 0 && $("#content",iframe).width() !=760){
                    wanDouJiaExt.modifyDetailPage();
                }
                if($(".content_box",iframe).length > 0 && $("#content",iframe).width() !=737){
                    wanDouJiaExt.modifyDetailPage();
                }

                if( iframe.getElementById('album_result_detail') != null){
                    wanDouJiaExt.modifySpecialPage();
                }

            },1000);
        }
    };

    wanDouJiaExt.init();

});
