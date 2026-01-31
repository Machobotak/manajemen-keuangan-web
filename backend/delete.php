<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"),true);

if(!isset($data["id"])){
    echo json_encode(["status"=>"error","message"=>"ID tidak ada"]);
    exit;
}

$file = __DIR__."/data.json";
$transactions = [];

if(file_exists($file)){
    $transactions = json_decode(file_get_contents($file),true);
}

$filtered = array_values(array_filter($transactions,function($item)use($data){
    return $item["id"] !== $data["id"];
}));

file_put_contents($file,json_encode($filtered,JSON_PRETTY_PRINT));

echo json_encode(["status"=>"success"]);