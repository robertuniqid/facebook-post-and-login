var FacebookHelper = {

    login : function(callback) {
        FB.login(function(response) {
            if (response.authResponse) {
                access_token = response.authResponse.accessToken;
                FB.api('/me', function(response) {
                    callback.call({visitor_information : response,
                                   access_token        : access_token});
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        },
        {scope: 'publish_stream,read_stream'});
    },

    getFacebookPosts : function(user_id, count) {
        count = (typeof count == "undefined") ? 5 : count;

        FB.api('/' + user_id + '/posts',
            {
                limit  : count,
                fields : ['created_time', 'application', 'message', 'shares', 'likes', 'comments']
            },
        function(response) {
            console.log(response);
        }, {scope: 'publish_stream,read_stream'});
    },

    uploadPhoto : function(description, image_url) {
        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/photos', 'post', {
                    message     : description,
                    url         : image_url,
                    access_token: response.authResponse.accessToken
                }, function (response) {
                    if (!response || response.error) {
                        alert('Error occured:' + response);
                    } else {
                        alert('Post ID: ' + response.id);
                    }
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        },{scope: 'publish_stream,read_stream'});
    },

    postToWall : function(user_id, message, callback) {
        if(typeof user_id == "undefined")
            user_id = 'me';

        var options = {
            message : message
        };

        FB.api('/' + user_id + '/feed',
                'post',
                options,
                function(response) {
                    if (!response || response.error) {
                        console.log(response.error);
                    } else {
                        callback.call({'post_information' : response});
                    }
                });
    },

    deletePostById : function(post_id) {
        FB.api(postId, 'delete', function(response) {
            if (!response || response.error) {
                alert('Error occured');
            } else {
                alert('Post was deleted');
            }
        });
    }
}