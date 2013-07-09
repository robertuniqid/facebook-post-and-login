var LayoutHelper = {

    starSystemItems   : 10,
    starSystemDefault : 0,

    Init : function()
    {
        $('.close').live('click', function(event){
            event.preventDefault();

            if($(this).hasAttr('data-close-parent-class')) {
                var main_div = $(this).parents('.' + $(this).attr('data-close-parent-class'));

                var remove_type = 'fadeOut';

                if(main_div.hasAttr('remove_type')) {
                    remove_type = main_div.attr('remove_type');
                }

                if(remove_type == 'fadeOut')
                    main_div.fadeOut('fast', function(){});
                else if(remove_type == 'slideUp')
                    main_div.slideUp('slow', function(){});
                else
                    main_div.fadeOut('fast', function(){});

            }
            if($(this).hasAttr('trigger_action')){
                if($(this).attr('trigger_action') != '') {
                    if($(this).attr('trigger_action').substr(-1) != ')'  &&
                        $(this).attr('trigger_action').substr(-1) != ';') {
                        eval($(this).attr('trigger_action') + '()');
                    } else {
                        eval($(this).attr('trigger_action'));
                    }
                }
            }
        });
    },

    FetchToolTip : function(text) {
        return '<a class="simple_tooltip">' +
                    '<img alt="?" src="assets/images/small_green_question_mark.png"/>' +
                    '<span>' + text + '</span>' +
                '</a>';
    },

    EncodeUrl : function(url){
        if(typeof(url)=='number')
            return url;

        if (url.indexOf("?")>0)
        {
            var encodedParams = "?";
            var parts = url.split("?");
            var params = parts[1].split("&");
            for(i = 0; i < params.length; i++)
            {
                if (i > 0)
                {
                    encodedParams += "&";
                }
                if (params[i].indexOf("=")>0) //Avoid null values
                {
                    p = params[i].split("=");
                    encodedParams += (p[0] + "=" + escape(encodeURI(p[1])));
                }
                else
                {
                    encodedParams += params[i];
                }
            }
            url = parts[0] + encodedParams;
        }

        return url;
    },

    NiceNotification : function(message, type, prepend_to, container_id, on_close){
        if(typeof type == 'undefined')
            type = 'info';

        if(typeof container_id == 'undefined')
            container_id = '#confirmBox';

        if(container_id.charAt(0) != '#')
            container_id = '#' + container_id;

        if(typeof prepend_to != 'undefined')
            $(container_id).remove();

        if(typeof on_close == "undefined")
            on_close = '';



        if($(container_id).length > 0) {
            var visible = $(container_id).is(':visible');

            $(container_id).removeClass('yt-alert-success yt-alert-info yt-alert-warn yt-alert-error');

            $(container_id).addClass('yt-alert-' + type);

            if(visible){
                $(container_id + " > .yt-alert-content > .yt-alert-message").html(message);
            } else {
                $(container_id + " > .yt-alert-content > .yt-alert-message").html(message);
                $(container_id).fadeIn('slow');
            }
        } else {
            var html =
                '<div id="'+container_id.substr(1)+'" ' +
                     'remove_type="slideUp" class="yt-alert yt-alert-default yt-alert-'+ type +'" ' +
                     'style="display:none;"' +
                    '>'
                    + '<div class="yt-alert-icon">'
                    +      '<img alt="Alert icon" class="icon master-sprite" src="http://s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif">'
                    + '</div>'
                    + '<div class="yt-alert-buttons">'
                    + '<button role="button" ' +
                              'data-close-parent-class="yt-alert" ' +
                              'onclick=";return false;" ' +
                              'trigger_action="' + on_close + '"' +
                              'class="close yt-uix-close yt-uix-button yt-uix-button-close" type="button">'
                    + '<span class="yt-uix-button-content">Close </span>'
                    + '</button>'
                    + '</div>'
                    + '<div role="alert" class="yt-alert-content">'
                    + '<span class="yt-alert-vertical-trick"></span>'
                    + '<div class="yt-alert-message">'
                    +  message
                    + '</div>'
                    + '</div>'
                    + '</div>';
            if(typeof(prepend_to) != 'object')
                $(prepend_to).prepend(html);
            else
                prepend_to.prepend(html);

            $(container_id).slideDown('slow');
        }
    }

};

$.fn.hasAttr = function(name) {
    return this.attr(name) !== undefined;
};

$.fn._star_system = function(type) {

    if(typeof type == 'undefined')
        type = 'normal';

    this.each(function(){
        if($(this).hasAttr('active_stars'))
            var active_stars = $(this).attr('active_stars');
        else
            var active_stars = LayoutHelper.starSystemDefault;

        $(this).find('a.star').remove();

        for(var i = 1; i <= LayoutHelper.starSystemItems ; i++) {
            if(i <= active_stars) {
                if(type == 'sparking') {
                    $(this).append('<a class="star active" style="display: none;"></a>');
                    $(this).find('.star').eq(i - 1).delay(i * 200).show('fast');
                } else {
                    $(this).append('<a class="star active" style="display: none;"></a>');
                    $(this).find('.star').eq(i - 1).delay(i * 100).show('fast');
                }
            } else if(i - active_stars <= 0.5 && i - active_stars < 1) {
                var number = 50;

                if(type == 'sparking') {
                    $(this).append('<a class="star active_' + number + '" style="display: none;"></a>');
                    $(this).find('.star').eq(i - 1).delay(i * 200).show('fast');
                } else {
                    $(this).append('<a class="star active_' + number + '" style="display: none;"></a>');
                    $(this).find('.star').eq(i - 1).delay(i * 100).show('fast');
                }
            } else {
                if(type == 'sparking') {
                    $(this).append('<a class="star" style="display: none;"></a>');
                    $(this).find('.star').eq(i - 1).delay(i * 200).show('fast');
                } else {
                    $(this).append('<a class="star" style="display: none;"></a>');
                    $(this).find('.star').eq(i - 1).delay(i * 100).show('fast');
                }
            }

        }
    });

    return true;
};

$.fn._show_ajax_loader = function() {
    var html = '<section class="ajax_loader main_content" style="display: none;">' +
        '<p>Pagina se incarca, va rugam asteptati ... </p>' +
        '<img src="assets/images/ajax-loader.gif"/>' +
        '</section>';

    this.find('section.main_content').slideUp('fast');

    this.append(html);

    this.find('section.ajax_loader').slideDown('fast');

    return true;
};

$.fn._show_ajax_loader_retry = function() {
    var html = '<section class="ajax_loader main_content" style="display: none;">' +
        '<p style="color:red;">O eroare a aparut in timpul incarcarii paginii</p>' +
        '<p>Incercam sa incarcam pagina din nou, va rugam asteptati ... </p>' +
        '<img src="assets/images/ajax-loader.gif"/>' +
        '</section>';

    var object = this;

    object.find('section.main_content').slideUp('fast', function(){
        $('section.main_content').remove();

        object.append(html);

        object.find('section.ajax_loader').slideDown('fast');
    });



    return true;
};

$.fn._tinymce = function() {
    $(this).tinymce({
        // Location of TinyMCE script
        script_url : base_url + 'assets/scripts/tiny_mce/tiny_mce.js',

        // General options
        theme : "advanced",
        plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",

        // Theme options
        theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
        theme_advanced_buttons2 : "search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        theme_advanced_statusbar_location : "bottom",
        theme_advanced_resizing : true,

        // Example content CSS (should be your site CSS)
        content_css : "css/content.css",

        // Drop lists for link/image/media/template dialogs
        template_external_list_url : "lists/template_list.js",
        external_link_list_url : "lists/link_list.js",
        external_image_list_url : "lists/image_list.js",
        media_external_list_url : "lists/media_list.js"
    });

    return true;
};
