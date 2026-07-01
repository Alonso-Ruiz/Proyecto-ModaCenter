<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

function user_row(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'nombre' => $row['nombre'],
        'correo' => $row['correo'],
        'telefono' => $row['telefono'],
        'rol' => $row['rol'],
        'estado' => $row['estado'],
        'ventas_mes' => (float) $row['ventas_mes'],
    ];
}

function users_index(): void
{
    $stmt = database()->query(
        'SELECT usuarios.*,
                COALESCE(SUM(CASE
                  WHEN ventas.estado = "Completado"
                   AND YEAR(ventas.fecha) = YEAR(CURDATE())
                   AND MONTH(ventas.fecha) = MONTH(CURDATE())
                  THEN ventas.total ELSE 0 END), 0) AS ventas_mes
         FROM usuarios
         LEFT JOIN ventas ON ventas.vendedor_id = usuarios.id
         GROUP BY usuarios.id
         ORDER BY usuarios.id DESC'
    );
    json_response(array_map('user_row', $stmt->fetchAll()));
}

function users_store(): void
{
    $data = read_json();
    required_fields($data, ['nombre', 'correo', 'telefono', 'password', 'rol', 'estado']);

    if (!filter_var($data['correo'], FILTER_VALIDATE_EMAIL)) {
        json_response(['message' => 'Ingresa un correo valido.'], 422);
    }

    if (strlen($data['password']) < 8) {
        json_response(['message' => 'La contrasena debe tener minimo 8 caracteres.'], 422);
    }

    $pdo = database();
    $stmt = $pdo->prepare(
        'INSERT INTO usuarios (nombre, correo, telefono, password_hash, rol, estado, ventas_mes)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    try {
        $stmt->execute([
            trim($data['nombre']),
            strtolower(trim($data['correo'])),
            trim($data['telefono']),
            password_hash($data['password'], PASSWORD_DEFAULT),
            $data['rol'],
            $data['estado'],
            (float) ($data['ventas_mes'] ?? 0),
        ]);
    } catch (PDOException $error) {
        if ($error->getCode() === '23000') {
            json_response(['message' => 'Este correo ya esta registrado.'], 409);
        }
        throw $error;
    }

    users_show((int) $pdo->lastInsertId());
}

function users_show(int $id): void
{
    $stmt = database()->prepare(
        'SELECT usuarios.*,
                COALESCE(SUM(CASE
                  WHEN ventas.estado = "Completado"
                   AND YEAR(ventas.fecha) = YEAR(CURDATE())
                   AND MONTH(ventas.fecha) = MONTH(CURDATE())
                  THEN ventas.total ELSE 0 END), 0) AS ventas_mes
         FROM usuarios
         LEFT JOIN ventas ON ventas.vendedor_id = usuarios.id
         WHERE usuarios.id = ?
         GROUP BY usuarios.id'
    );
    $stmt->execute([$id]);
    $user = $stmt->fetch();

    if (!$user) {
        json_response(['message' => 'Usuario no encontrado.'], 404);
    }

    json_response(user_row($user));
}

function users_update(int $id): void
{
    $data = read_json();
    required_fields($data, ['nombre', 'correo', 'telefono', 'rol', 'estado']);

    if (!filter_var($data['correo'], FILTER_VALIDATE_EMAIL)) {
        json_response(['message' => 'Ingresa un correo valido.'], 422);
    }

    $fields = 'nombre = ?, correo = ?, telefono = ?, rol = ?, estado = ?, ventas_mes = ?';
    $values = [
        trim($data['nombre']),
        strtolower(trim($data['correo'])),
        trim($data['telefono']),
        $data['rol'],
        $data['estado'],
        (float) ($data['ventas_mes'] ?? 0),
    ];

    if (!empty($data['password'])) {
        if (strlen($data['password']) < 8) {
            json_response(['message' => 'La contrasena debe tener minimo 8 caracteres.'], 422);
        }
        $fields .= ', password_hash = ?';
        $values[] = password_hash($data['password'], PASSWORD_DEFAULT);
    }

    $values[] = $id;

    try {
        $stmt = database()->prepare("UPDATE usuarios SET {$fields} WHERE id = ?");
        $stmt->execute($values);
    } catch (PDOException $error) {
        if ($error->getCode() === '23000') {
            json_response(['message' => 'Este correo ya esta registrado.'], 409);
        }
        throw $error;
    }

    users_show($id);
}

function users_destroy(int $id): void
{
    $stmt = database()->prepare('DELETE FROM usuarios WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['message' => 'Usuario eliminado correctamente.']);
}
