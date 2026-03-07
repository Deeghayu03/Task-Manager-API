<?php

$host = "localhost";
$db_name = "task_manager";
$username = "root";
$password = "root123";

try {

    $pdo = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch(PDOException $exception) {

    echo "Connection error: " . $exception->getMessage();
}