<?php

	function db_connect(){
		// try catth
		try {
			$result = mysql_connect('localhost','root','');
			// 选择数据库
			mysql_select_db('angular');
		} catch (Exception $e){
			echo $e -> message;
			exit;
		}

		if(!$result){
			return false;
		}else{
			return $result;
		}

	};

	function login($username,$password){
		$handle = db_connect();
		if(!$handle){
			echo 'error';
			return 0;
		}
		$query = "select * from userlist where name = '$username' and password = sha1('$password')";
		mysql_query("SET NAMES 'UTF8'"); 		
		$result = mysql_query($query);
		if(!$result){
			trigger_error('Invalid query: ' . mysql_error()." in ".$query);
			return 0;
		}
		if(mysql_num_rows($result)>0){
			return 1;
		}else{
			return 0;
		}
	}

?>