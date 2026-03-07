<?php

header("Content-Type: application/json");

require_once "../config/database.php";

// get request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = $data['user_id'] ?? null;
    $title = $data['title'] ?? null;
    $description = $data['description'] ?? null;

    if (!$user_id || !$title) {
        echo json_encode([
            "success" => false,
            "message" => "User ID and title are required"
        ]);
        exit;
    }

    $sql = "INSERT INTO tasks (user_id, title, description) 
            VALUES (:user_id, :title, :description)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":user_id" => $user_id,
        ":title" => $title,
        ":description" => $description
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Task created successfully"
    ]);
}