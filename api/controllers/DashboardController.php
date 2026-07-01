<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

function dashboard_metrics(): void
{
    $pdo = database();

    $todaySales = (float) $pdo->query(
        'SELECT COALESCE(SUM(total), 0) FROM ventas WHERE fecha = CURDATE() AND estado = "Completado"'
    )->fetchColumn();

    $monthProfit = (float) $pdo->query(
        'SELECT COALESCE(SUM((venta_detalles.precio_unitario - productos.precio_costo) * venta_detalles.cantidad), 0)
         FROM venta_detalles
         INNER JOIN ventas ON ventas.id = venta_detalles.venta_id
         INNER JOIN productos ON productos.id = venta_detalles.producto_id
         WHERE ventas.estado = "Completado"
           AND YEAR(ventas.fecha) = YEAR(CURDATE())
           AND MONTH(ventas.fecha) = MONTH(CURDATE())'
    )->fetchColumn();

    $activeProducts = (int) $pdo->query('SELECT COUNT(*) FROM productos WHERE stock > 0')->fetchColumn();
    $stockAlerts = (int) $pdo->query('SELECT COUNT(*) FROM productos WHERE stock <= stock_minimo')->fetchColumn();

    $periodStmt = $pdo->query(
        'SELECT fecha, COALESCE(SUM(total), 0) AS total
         FROM ventas
         WHERE estado = "Completado" AND fecha >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         GROUP BY fecha
         ORDER BY fecha ASC'
    );

    $categoryStmt = $pdo->query(
        'SELECT productos.categoria AS label, COALESCE(SUM(venta_detalles.subtotal), 0) AS total
         FROM venta_detalles
         INNER JOIN ventas ON ventas.id = venta_detalles.venta_id
         INNER JOIN productos ON productos.id = venta_detalles.producto_id
         WHERE ventas.estado = "Completado"
         GROUP BY productos.categoria
         ORDER BY total DESC'
    );

    $bestStmt = $pdo->query(
        'SELECT productos.nombre AS label, COALESCE(SUM(venta_detalles.cantidad), 0) AS total
         FROM venta_detalles
         INNER JOIN ventas ON ventas.id = venta_detalles.venta_id
         INNER JOIN productos ON productos.id = venta_detalles.producto_id
         WHERE ventas.estado = "Completado"
         GROUP BY productos.id, productos.nombre
         ORDER BY total DESC
         LIMIT 5'
    );

    json_response([
        'summary' => [
            'todaySales' => $todaySales,
            'monthProfit' => $monthProfit,
            'activeProducts' => $activeProducts,
            'stockAlerts' => $stockAlerts,
        ],
        'salesByDate' => $periodStmt->fetchAll(),
        'salesByCategory' => $categoryStmt->fetchAll(),
        'bestProducts' => $bestStmt->fetchAll(),
    ]);
}
