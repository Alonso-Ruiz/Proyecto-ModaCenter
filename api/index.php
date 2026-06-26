<?php

require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ProductController.php';
require_once __DIR__ . '/controllers/UserController.php';

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api#', '', $path);
$segments = array_values(array_filter(explode('/', trim($path, '/'))));
$resource = $segments[0] ?? '';
$id = isset($segments[1]) ? (int) $segments[1] : null;

try {
    if ($resource === 'auth' && ($segments[1] ?? '') === 'login' && $method === 'POST') {
        auth_login();
    }

    if ($resource === 'productos') {
        if ($method === 'GET' && !$id) products_index();
        if ($method === 'POST') products_store();
        if ($method === 'GET' && $id) products_show($id);
        if ($method === 'PUT' && $id) products_update($id);
        if ($method === 'DELETE' && $id) products_destroy($id);
    }

    if ($resource === 'usuarios') {
        if ($method === 'GET' && !$id) users_index();
        if ($method === 'POST') users_store();
        if ($method === 'GET' && $id) users_show($id);
        if ($method === 'PUT' && $id) users_update($id);
        if ($method === 'DELETE' && $id) users_destroy($id);
    }

    json_response(['message' => 'Ruta no encontrada.'], 404);
} catch (PDOException $error) {
    json_response(['message' => 'Error de base de datos: ' . $error->getMessage()], 500);
} catch (Throwable $error) {
    json_response(['message' => 'Error del servidor: ' . $error->getMessage()], 500);
}
