<?php

header("Content-Type: application/json");

require_once "../config/database.php";

$method = $_SERVER['REQUEST_METHOD'];

/* ---------- CREATE TASK ---------- */
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


/* ---------- GET TASKS ---------- */
if ($method === "GET") {

    $page = $_GET['page'] ?? 1;
    $limit = $_GET['limit'] ?? 10;
    $status = $_GET['status'] ?? null;
    $user_id = $_GET['user_id'] ?? null;

    $offset = ($page - 1) * $limit;

    $sql = "SELECT * FROM tasks WHERE deleted_at IS NULL";

    $params = [];

    if ($status) {
        $sql .= " AND status = :status";
        $params[':status'] = $status;
    }

    if ($user_id) {
        $sql .= " AND user_id = :user_id";
        $params[':user_id'] = $user_id;
    }

    $sql .= " LIMIT :limit OFFSET :offset";

    $stmt = $pdo->prepare($sql);

    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    $stmt->bindValue(":limit", (int)$limit, PDO::PARAM_INT);
    $stmt->bindValue(":offset", (int)$offset, PDO::PARAM_INT);

    $stmt->execute();

    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "page" => (int)$page,
        "limit" => (int)$limit,
        "data" => $tasks
    ]);
}


/* ---------- UPDATE TASK ---------- */
if ($method === "PUT") {

    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'] ?? null;
    $title = $data['title'] ?? null;
    $description = $data['description'] ?? null;
    $status = $data['status'] ?? null;

    if (!$id) {
        echo json_encode([
            "success" => false,
            "message" => "Task ID is required"
        ]);
        exit;
    }

    $sql = "UPDATE tasks
            SET title = :title,
                description = :description,
                status = :status,
                updated_at = NOW()
            WHERE id = :id";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":id" => $id,
        ":title" => $title,
        ":description" => $description,
        ":status" => $status
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Task updated successfully"
    ]);
}


/* ---------- SOFT DELETE TASK ---------- */
if ($method === "DELETE") {

    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode([
            "success" => false,
            "message" => "Task ID is required"
        ]);
        exit;
    }

    $sql = "UPDATE tasks
            SET deleted_at = NOW()
            WHERE id = :id";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":id" => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Task deleted successfully"
    ]);
}