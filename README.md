# Proyecto ModaCenter

Este proyecto consta de una aplicación web frontend (desarrollada con React y Vite) y una API backend (desarrollada en PHP).

## Requisitos previos

1. **Node.js** (versión 18 o superior recomendada)
2. **PHP** (versión 7.3 o superior)
3. **MySQL** (u otro servidor compatible con MariaDB)

---

## Configuración y ejecución

### 1. Base de datos

1. Abre tu gestor de base de datos MySQL (por ejemplo, phpMyAdmin, MySQL Workbench o la línea de comandos).
2. Importa el archivo de base de datos ubicado en:
   `database/modacenter.sql`
   *(Esto creará la base de datos `modacenter`, las tablas necesarias y registrará los usuarios de prueba).*

### 2. Iniciar el servidor backend (API PHP)

El frontend está configurado para redirigir las solicitudes a `/api` hacia `http://127.0.0.1:8000`. Debes iniciar el servidor integrado de PHP en ese puerto:

En una terminal en la raíz del proyecto, ejecuta:
```bash
php -S 127.0.0.1:8000 api/router.php
```

### 3. Iniciar el servidor frontend (React + Vite)

En otra terminal en la raíz del proyecto, instala las dependencias (si no lo has hecho) e inicia el servidor de desarrollo de Vite:

```bash
npm install
npm run dev
```

Abre tu navegador en la URL que te indique la consola (usualmente `http://localhost:5173`).

---

## Credenciales de Acceso

Puedes iniciar sesión de dos formas:

### A. Credenciales del Backend (Base de datos real)
Si el servidor PHP y MySQL están activos y configurados correctamente, puedes usar:
* **Administrador:**
  * **Correo:** `admin@modacenter.pe`
  * **Contraseña:** `12345678`
  * **Rol:** Administrador
* **Vendedor:**
  * **Correo:** `javier@gmail.com`
  * **Contraseña:** *(la contraseña establecida al registrar al vendedor)*
  * **Rol:** Vendedor

### B. Modo de Desarrollo / Fallback Local
Si el servidor backend de PHP no está ejecutándose o la base de datos no está disponible, el sistema detectará el error de conexión y **usará de forma automática el fallback de desarrollo** definido en `src/services/authService.js`. Puedes iniciar sesión con las siguientes credenciales simuladas:
* **Administrador local:**
  * **Correo:** `admin@modacenter.pe`
  * **Contraseña:** `12345678`
  * **Rol:** Administrador
* **Vendedor local:**
  * **Correo:** `vendedor@modacenter.pe`
  * **Contraseña:** `12345678`
  * **Rol:** Vendedor
