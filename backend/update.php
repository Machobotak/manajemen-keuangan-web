<?php
header("Content-Type: application/json");

$data =  json_decode(file_get_contents("php://input"),true);

if(!isset($data["id"])){
    echo json_encode(["status"=>"error"]);
    exit;
}

$file = __DIR__."/data.json";
$transactions = json_decode(file_get_contents($file),true);

foreach ($transactions as &$item){
    if($item["id"]===$data["id"]){
        $item["date"] = $data["date"];
        $item["desc"] = $data["desc"];
        $item["amount"] = $data["amount"];
        $item["type"] = $data["type"];
    }
}

file_put_contents($file,json_encode($transactions,JSON_PRETTY_PRINT));
echo json_encode(["status"=>"success"]);