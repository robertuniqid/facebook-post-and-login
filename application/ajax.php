<?php

require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'models/Database.php');

class Ajax
{
	const AJAX_METHOD_RETURN_GLUE_JSON			=	"JSON";
	const AJAX_METHOD_RETURN_GLUE_XML			  =	"XML";
	const AJAX_METHOD_RETURN_GLUE_HTML			=	"HTML";
	const AJAX_METHOD_NOT_FOUND_EXCEPTION		=	"Remote Method Not Found.";
	const AJAX_METHOD_INVALID_RETURN_TYPE		=	"The returned value from ajax node must be an array";
	const AJAX_INVALID_GLUE_VALUE_EXCEPTION		=	"Invalid Response Glue Value.";
	
	protected $_instancePrefix					=	'AJAX_';
	protected $_glue							=	self::AJAX_METHOD_RETURN_GLUE_XML;
	protected $_allowedResponses				= 	array(
                              self::AJAX_METHOD_RETURN_GLUE_JSON,
                              self::AJAX_METHOD_RETURN_GLUE_XML,
                              self::AJAX_METHOD_RETURN_GLUE_HTML
													);
	
	protected $_globalMethods					=	array();
	private	$__node								=	null;
	private $__method							=	null;
	
	public function __construct()
	{
		foreach( get_class_methods(__CLASS__) as $method)
		{
			$this->_globalMethods[]	=	$method;
		}
		
		$split			=	explode(".", $_REQUEST['am']);
		$this->__node	=	$this->_instancePrefix	.	ucfirst($split[0]);
		$this->__method	=	$split[1];
		
		if( isset( $_REQUEST['glue'] ) )
		{
			if(!in_array($_REQUEST['glue'], $this->_allowedResponses))
			{
				$this->__Abort(self::AJAX_INVALID_GLUE_VALUE_EXCEPTION);
			}
			else
			{
				$this->_glue = $_REQUEST['glue'];
			}
		}
	}
	
	public function index()
	{
		try{
			require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'models/'.$this->__node . '.php');
		}catch (InvalidControllerNodeException $ex){
			echo $e->getMEssage();
		}

		if(method_exists($this->__node, $this->__method))
		{
			$output = call_user_func( $this->__node . '::' . $this->__method );
			if(!is_array($output))
			{
				$this->__Abort(self::AJAX_METHOD_INVALID_RETURN_TYPE);
			}
			else
			{
				echo $this->__out($output);
			}
		}
		else
		{
				$this->__Abort(self::AJAX_METHOD_NOT_FOUND_EXCEPTION);
		}
	}
	
	private function __Abort($errMessage)
	{
		throw new Exception($errMessage);
	}
	
	private function __xml($array)
	{
		$xml 	= 	new SimpleXMLElement('<root/>');
					array_walk_recursive($array, array ($xml, 'addChild'));
		$out	=	$xml->asXML();
	
		return $out;
	}
	
	private function __out($parameter)
	{
		switch($this->_glue)
		{
			case self::AJAX_METHOD_RETURN_GLUE_JSON :
				header('Content-Type: application/json');
				$parameter 	=  json_encode($parameter);
				break;
	
			case self::AJAX_METHOD_RETURN_GLUE_XML :
				header('Content-type: text/xml');
				$parameter	=	$this->__xml($parameter);
				break;
	
			case self::AJAX_METHOD_RETURN_GLUE_HTML :
	
				$parameter = $parameter[0];
	
				break;
	
			default:
				header('Content-type: text/xml');
				$parameter	=	$this->__xml($parameter);
				break;
		}
		return $parameter;
	}
}

$controller = new Ajax();
$controller->index();