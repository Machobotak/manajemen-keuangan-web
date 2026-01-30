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

$file = "data.json";
$existingData = [];

if(file_exists($file)){
    $existingData = json_encode(file_get_contents($file),true);
}

$existingData[] = $data;

file_put_contents($file,json_encode($existingData));

echo json_encode([
    "status" => "success",
    "message" => "Data berhasil disimpan",
    "data" => $data
]);