# Evidencia de Validación del Backend (Flask)

## Entorno del Backend de Flask

- **Intérprete Python:** Python 3.14.6 (Ejecutándose en entorno virtual `.venv`).
- **Variables de Entorno necesarias:** `PYTHONIOENCODING="utf-8"` (Indispensable para evitar excepciones de codificación UTF-8 en stdout de Windows).
- **Base de Datos configurada:** SQLite local (`sqlite:///instance/app.db`) al no tener configurado el string de conexión de PostgreSQL `DATABASE_URL` a nivel de variables del sistema.
- **Servidor Flask:** Inicializado y escuchando correctamente en `http://127.0.0.1:5000`.

---

## Estructura de la Aplicación

Se verificó el correcto mapeo y carga de componentes a través de `wsgi.py` y `run.py`:

1. **Blueprints de Rutas Activos (10):**
   - `auth` (Registro, login, logout, password recovery)
   - `projects` (Creación, configuración de sprints)
   - `invites` (Invitaciones de colaboración)
   - `members` (Gestión de miembros y roles)
   - `tasks` (Tareas, estados, asignaciones)
   - `sprints` (Hitos del proyecto)
   - `notifications` (Centro de notificaciones y streams)
   - `comments` (Comentarios en tareas)
   - `admin` (Consola de administración multitenant)
   - `team_chat` (Chat de colaboración en tiempo real)

2. **Modelos de Base de Datos Vinculados (11):**
   - `User`, `Project`, `Membership`, `Task`, `Sprint`, `Invite`, `Notification`, `Comment`, `AuditLog`, `TeamMessage`, `TaskStateHistory`.

3. **Servicios Core Implementados:**
   - `taskService`, `authService`, `projectService`, `memberService`, `risk_engine_service` (Smart Risk Engine).
