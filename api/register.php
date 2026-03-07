<?php

header("Content-Type: application/json");

require_once "../config/database.php";

// get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$name || !$email || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);
    exit;
}

// hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// insert user
$sql = "INSERT INTO users (name, email, password) VALUES (:name, :email, :password)";
$stmt = $pdo->prepare($sql);

$stmt->execute([
    ":name" => $name,
    ":email" => $email,
    ":password" => $hashed_password
]);

echo json_encode([
    "success" => true,
    "message" => "User registered successfully"
]);