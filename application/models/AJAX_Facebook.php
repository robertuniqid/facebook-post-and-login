<?php

class AJAX_Facebook {

  public static function saveInformation() {
    Database::getInstance()->insert('facebook_posts', array(
      'post_id'       =>  $_POST['post_id'],
      'user_id'       =>  $_POST['user_id'],
      'access_token'  =>  $_POST['access_token'],
      'time'          =>  time()
    ));

    return array(
      'status'  =>  'ok'
    );
  }

}