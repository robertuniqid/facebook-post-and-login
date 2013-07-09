var ApplicationHelper = {

    _stepsContainer : null,
    PostId : 0,
    UserInformation : {},

    init : function() {
        ApplicationHelper._stepsContainer = $('html > body > section.wrapper > section.step_containers');

        ApplicationHelper._stepsContainer.find('> section.step.login')
                                         .slideDown('slow')
                                         .find('.login_with_facebook').bind('click',function(event){

            ApplicationHelper._stepsContainer.find('> section.step.login > section.loader_container').slideDown('fast');
            FacebookHelper.login(ApplicationHelper._afterFacebookLogin);
        });

    },

    _afterFacebookLogin : function() {
        var information = this.visitor_information;

        information['access_token'] = this.access_token;

        ApplicationHelper.UserInformation = information;

        ApplicationHelper._stepsContainer.find('> section.step.login').slideUp('slow');
        ApplicationHelper._stepsContainer.find('> section.step.content').slideDown('slow', function(e){
            var container = $(this);

            container.find('.post_to_facebook').bind('click', function(event){
                ApplicationHelper._stepsContainer.find('> section.step.content > section.loader_container').slideDown('fast');

                var value = container.find('form textarea').val();

                FacebookHelper.postToWall('me', value, ApplicationHelper._afterFacebookWallPost);
            });
        });
    },

    _afterFacebookWallPost : function() {
        var information = this.post_information;

        ApplicationHelper.PostId = information.id;

        ApplicationHelper._stepsContainer.find('> section.step.content').slideUp('slow');
        ApplicationHelper._stepsContainer.find('> section.step.success_facebook').slideDown('slow', function(e){
            ApplicationHelper.SavePostInformation(ApplicationHelper.UserInformation.id, ApplicationHelper.PostId, ApplicationHelper.UserInformation.access_token);
        });
    },

    SavePostInformation : function(user_id, post_id, access_token) {
        try {
            var AjaxClient = new AjaxFramework.Client();
            AjaxClient.setAjaxMethod('Facebook.saveInformation');
            AjaxClient.setData({
                user_id         :   user_id,
                post_id         :   post_id,
                access_token    :   access_token
            });
            AjaxClient.setRequestMethod('POST');
            AjaxClient.setResponseGlue('JSON');
            AjaxClient.setOkCallBack(ApplicationHelper.ajaxSavePostInformationOk);
            AjaxClient.setErrorCallBack(ApplicationHelper.ajaxError);
            AjaxClient.Run();
        } catch (ex) {
            console.log(ex);
        }
    },

    ajaxSavePostInformationOk:function (data) {
        if (data.status == "ok") {
            ApplicationHelper._stepsContainer.find('> section.step.success_facebook').slideUp('slow');
            ApplicationHelper._stepsContainer.find('> section.step.success_storage').slideDown('slow');
        }
    },

    ajaxError : function(){

    }
};