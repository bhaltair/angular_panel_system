<?php

    // 设置报警级别
    error_reporting(E_ALL ^ E_DEPRECATED);    

	include_once 'db_fns.php';


	if(!isset($_REQUEST['username']) || (!isset($_REQUEST['password']))){
		echo 'You must enter your username and password to proceed';
		exit;
	}

	$username = $_REQUEST['username'];
	$password = $_REQUEST['password'];


	if (login($username,$password)){

        session_start();
        $_SESSION['username'] = $username;
        $_SESSION['password'] = $password;

        $opt = array('errno' => 0, 'data' => array('username' => $username));

        echo json_encode($opt);       

	}else{
        $opt = array('errno' => 1, 'data' => array('username' => $username));

        echo json_encode($opt); 
        
		// echo 'The password you entered is incorrect';
		exit;
	}

?>