<?php
	include_once 'db_fns.php';

    // 设置报警级别
    error_reporting(E_ALL ^ E_DEPRECATED);    

    // 拿到页码参数
    $userId = !empty($_REQUEST['userId']) ? $_REQUEST['userId'] : null;

    
	$hanlde = db_connect();

    if($hanlde){
        $sql = "SELECT * FROM userlist where P_id = {$userId}";

        //支持中文,必须在查询的语句之前
        mysql_query("SET NAMES 'UTF8'");         
        $data = mysql_query($sql);        

        $results = array();
        while ($row = mysql_fetch_assoc($data)) {
            $results[] = $row;
        }

        $res = array(
            "data" => $results,
            "errno" => 0
        );

        echo json_encode($res);        
    }


    // 关闭连接
    mysql_close();





?>