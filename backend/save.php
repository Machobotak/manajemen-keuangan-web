<?php

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"),true);

if(!$data){
    echo json_encode([
        "status" => "error",
        "message" => "Data tidak diterima"
    ]);
    exit;
}

$file = __DIR__."/data.json";

$transactions =[];

if(file_exists($file)){
    $transactions = json_decode(file_get_contents($file),true);
}

$newTransactions = [
    "id"=>uniqid(),
    "date"=> $data["date"],
    "desc"=> $data["desc"],
    "amount"=>$data["amount"],
    "type"=>$data["type"]
];

$transactions [] = $newTransactions;


file_put_contents(
    $file,
    json_encode($transactions,JSON_PRETTY_PRINT));

echo json_encode([
    "status" => "success",
    "message" => "Data berhasil disimpan",
    "data" => $newTransactions
]);