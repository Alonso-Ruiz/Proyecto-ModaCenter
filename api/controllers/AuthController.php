<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

function auth_login(): void
{
    $data = read_json();
    required_fields($data, ['correo', 'password', 'rol']);

    $pdo = database();
    $stmt = $pdo->prepare('SELECT * FROM usuarios WHERE correo = ? AND rol = ? AND estado = "Activo" LIMIT 1');
    $stmt->execute([strtolower(trim($data['correo'])), $data['rol']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($data['password'], $user['password_hash'])) {
        json_response(['message' => 'Credenciales invalidas.'], 401);
    }

    json_response([
        'token' => bin2hex(random_bytes(24)),
        'user' => [
            'id' => (int) $user['id'],
            'name' => $user['nombre'],
            'email' => $user['correo'],
            'role' => $user['rol'],
        ],
    ]);
}
