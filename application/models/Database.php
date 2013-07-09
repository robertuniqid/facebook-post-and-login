<?php

class Database {

  private static $_instance = null;

  protected $_host      = 'localhost';
  protected $_user      = 'root';
  protected $_password  = '';
  protected $_db_name   = 'mydb';

  public static function getInstance() {
    if(is_null(self::$_instance))
      self::$_instance = new self();

    return self::$_instance;
  }

  public function query($sql) {
    if (!$link = mysql_connect($this->_host, $this->_user, $this->_password)) {
      echo 'Could not connect to mysql';
      exit;
    }

    if (!mysql_select_db($this->_db_name, $link)) {
      echo 'Could not select database';
      exit;
    }

    return mysql_query($sql);
  }

  /**
   * @param $array
   * @param string $wrapper
   * @return array
   */
  private function _wrapMyArray($array , $wrapper = '"') {
    $new_array = array();
    foreach($array as $k=>$element){
      if(!is_array($element)){
        $new_array[$k] = $wrapper . $element . $wrapper;
      }
    }
    return $new_array;

  }

  /**
   * @param $glue
   * @param $separator
   * @param $array
   * @return string
   */
  private function _arrayImplode( $glue, $separator, $array ) {
    if ( ! is_array( $array ) ) return $array;
    $string = array();
    foreach ( $array as $key => $val ) {
      if ( is_array( $val ) )
        $val = implode( ',', $val );
      $string[] = "{$key}{$glue}{$val}";

    }
    return implode( $separator, $string );
  }

  /**
   * @param $db_name
   * @param $data
   * @return bool
   */
  public function insert($db_name , $data){
    if(is_array($data) && !empty($data)){

      $data = array_map('mysql_real_escape_string', $data);

      $keys = array_keys($data);

      $sql = 'INSERT INTO '.$db_name.' ('
        .implode("," , $this->_wrapMyArray($keys , '`'))
        .') VALUES ('
        .implode("," , $this->_wrapMyArray($data))
        .')';
      $this->query($sql);
      return true;
    }
    return false;
  }

  /**
   * @param $db_name
   * @param array $data
   * @param array $where
   * @return bool
   */
  public function update($db_name , $data = array() , $where = array()) {
    if(is_array($data) && !empty($data)){
      $data = array_map('mysql_real_escape_string', $data);
      $data = $this->_wrapMyArray($data);

      $sql = 'UPDATE '.$db_name.' SET ';
      $sql .= $this->_arrayImplode("=" , "," , $data);

      if(!empty($where)){
        $sql .= ' WHERE ';
        if(is_array($where)){
          $where = $this->_wrapMyArray($where);
          $sql  .= $this->_arrayImplode("=" , "AND" , $where);
        }else{
          $sql  .= $where;
        }
      }

      $this->query($sql);
      return true;
    }
    return false;
  }

  /**
   * @param $db_name
   * @param array $where
   */
  public function delete($db_name , $where = array()){
    $sql = 'DELETE FROM '.$db_name.' ';

    if(!empty($where)){
      $sql .= ' WHERE ';
      if(is_array($where)){
        $where = $this->_wrapMyArray($where);
        $sql  .= $this->_arrayImplode("=" , "AND" , $where);
      }else{
        $sql  .= $where;
      }
    }

    $this->query($sql);
  }

}