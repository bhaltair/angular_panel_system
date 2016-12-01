<?php


    // 设置报警级别
    error_reporting(E_ALL ^ E_DEPRECATED);   

    //链接数据库
    $conn = mysql_connect("localhost","root","");
    //选择链接哪个属性库
    mysql_select_db("angular",$conn);
    //支持中文
    mysql_query("SET NAMES 'UTF8'");  



    $content = !empty($_REQUEST['content']) ? $_REQUEST['content'] : null;
    $date = !empty($_REQUEST['date']) ? $_REQUEST['date'] : null;
    $title = !empty($_REQUEST['title']) ? $_REQUEST['title'] : null;
    $writer = !empty($_REQUEST['writer']) ? $_REQUEST['writer'] : null;

    //查询一共多少行 

    // 存储用户信息
    $sql="INSERT INTO news VALUES ('','{$content}','{$writer}','{$date}','{$title}')";

    $res = array(
        "data" => array(),
        "errno" => 0
    );

    $resError = array(
        "data" => array(),
        "errno" => 1
    );    

    //执行sql语句，返回的值影响的条目个数
    $result = mysql_query($sql);

    //结果
    if($result == 1){
        // echo "恭喜，数据已经成功保存";
        echo json_encode($res);
    }else{
        // echo "抱歉，错误。请联系管理员。";
        echo json_encode($resError);
    }    

    mysql_close($conn);

?>