# CODA-GARO

Sistema de adopción/reporte de mascotas. Monorepo con `backend` (Node.js + TypeScript + Express) y `frontend` (Angular), usando pnpm workspaces y MySQL en Docker.

## Requisitos previos (Windows)

- **Docker Desktop** instalado y corriendo (incluye Docker Compose, no hay que instalarlo aparte): https://www.docker.com/products/docker-desktop
  - Docker Desktop en Windows requiere **WSL2** activado. Si al instalarlo te pide activarlo, sigue las instrucciones que te da el propio instalador y reinicia cuando lo pida.
  - Abre Docker Desktop al menos una vez y espera a que el ícono de la ballena en la barra de tareas diga que está corriendo, antes de usar cualquier comando `docker`.
- **Node.js** (versión LTS): https://nodejs.org
- **pnpm**, instálalo después de Node.js con:
  ```powershell
  npm install -g pnpm
  ```
- **Git** (si no lo tienes ya): https://git-scm.com

## Primeros pasos (una sola vez)

Todos los comandos se corren en **PowerShell** o en la terminal integrada de VS Code.

1. **Clonar y entrar al proyecto**
   ```powershell
   git clone <url-del-repo>
   cd CODA-GARO
   ```

2. **Configurar variables de entorno**
   ```powershell
   copy backend\.env.example backend\.env
   ```

3. **Levantar la base de datos con Docker**

   Asegúrate de que **Docker Desktop esté abierto y corriendo** (revisa el ícono de la ballena en la barra de tareas), luego:
   ```powershell
   docker compose up -d
   ```
   La primera vez descarga la imagen de MySQL y crea el contenedor `coda-garo-db` con la base ya importada.

4. **Instalar dependencias del monorepo**
   ```powershell
   pnpm install
   ```

## Uso diario

- **Levantar la base de datos** (con Docker Desktop abierto):
  ```powershell
  docker compose up -d
  ```
- **Backend:**
  ```powershell
  pnpm --filter backend run dev
  ```
- **Frontend:**
  ```powershell
  pnpm --filter frontend run start
  ```

## Verificar que todo esté bien

```powershell
docker ps
```
Debe aparecer `coda-garo-db` con estado `Up`.

```powershell
docker logs coda-garo-db
```
Debe mostrar `ready for connections` al final.

## Problemas comunes

| Error | Solución |
|---|---|
| `error during connect... docker daemon is not running` | Abre Docker Desktop y espera a que termine de iniciar (ícono de la ballena estable en la barra de tareas), luego reintenta. |
| `WSL 2 installation is incomplete` | Sigue el enlace que da el propio mensaje de Docker Desktop para actualizar el kernel de WSL2, o corre en PowerShell como administrador: `wsl --update` |
| `Access denied for user` al conectar a MySQL | Revisa que `backend\.env` tenga los mismos valores que `docker-compose.yml`. Si el contenedor ya existía con otras credenciales, recréalo: `docker compose down -v` y luego `docker compose up -d` |
| Puerto 3307 ocupado | Cambia el mapeo de puertos en `docker-compose.yml` y en `backend\.env` (`DB_PORT`) |
| `pnpm : no se reconoce como un comando` | Cierra y vuelve a abrir la terminal después de instalar pnpm, o revisa que Node.js se haya instalado correctamente. |

## Estructura del proyecto

```
CODA-GARO/
├── backend/           # API Node.js + TypeScript + Express
├── frontend/           # App Angular
├── DB/                 # Dump SQL para inicializar la base de datos
├── docker-compose.yml  # Contenedor de MySQL
└── pnpm-workspace.yaml
```