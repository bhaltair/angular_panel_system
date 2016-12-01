<?php

	// include_once 'db_fns.php';
	// $hanlde = db_connect();

    // header("Content-type:text/html;charset=utf-8");

    // 设置报警级别
    error_reporting(E_ALL ^ E_DEPRECATED);    

    // 拿到页码参数
    $pageNum = !empty($_REQUEST['pageNum']) ? $_REQUEST['pageNum'] : null;
    
    //链接数据库
    $conn = mysql_connect("localhost","root","");
    //选择链接哪个属性库
    mysql_select_db("angular",$conn);
    //支持中文
    mysql_query("SET NAMES 'UTF8'"); 

    $min = ($pageNum - 1) * 5;
    $max = $pageNum * 5;

    //执行SQL语句
    $sql = "SELECT * FROM userlist where P_Id > {$min} and P_Id <= {$max}";
    $data = mysql_query($sql);


    $rows = array();

    while($row = mysql_fetch_assoc($data))
    {
        $rows[] = $row;        
    }

    $result = array(
        "errno" => 0,
        "data" => $rows
    );

    echo json_encode($result);  

?>