# Evidencia de Validación de la Base de Datos

## Conexión y Estado General

- **Conexión a Base de Datos:** **Exitosa** (Confirmado por el endpoint `/api/health` -> `'database': 'connected'`).
- **Control de Versiones (Alembic):** Inicializado y al día.
- **Versión de Migración (HEAD):** `5a3c2d1e9f8b` (Confirmado por `flask db current`).

---

## Esquema y Tablas Creadas (SQLite `instance/app.db`)

Se recreó el esquema local utilizando los modelos declarados de SQLAlchemy, garantizando la total integridad de columnas en SQLite:

| Tabla | Columnas Críticas Verificadas | Propósito |
|-------|-------------------------------|-----------|
| **`users`** | `id`, `email`, `password_hash`, `role`, `preferred_theme` | Registro y autenticación de usuarios |
| **`projects`** | `id`, `name`, `timezone`, `tasks_retention_days`, `sprint_enabled` | Datos del proyecto y configuraciones de retención |
| **`memberships`**| `id`, `project_id`, `user_id`, `role`, `chat_enabled` | Relación de miembros con proyectos y permisos |
| **`tasks`** | `id`, `project_id`, `title`, `status`, `risk_status`, `predicted_delay_days` | Tareas de Kanban con métricas de riesgo |
| **`task_state_histories`** | `id`, `task_id`, `from_state`, `to_state`, `changed_at` | Registro de telemetría e histórico de cambios de estado |
| **`sprints`** | `id`, `project_id`, `name`, `start_date`, `end_date`, `color` | Hitos de tiempo de trabajo |
| **`team_messages`** | `id`, `project_id`, `user_id`, `content`, `task_id` | Mensajería de chat interna vinculada a tareas |
| **`invites`** | `id`, `email`, `project_id`, `token`, `status` | Invitaciones enviadas para unirse a proyectos |
| **`notifications`**| `id`, `user_id`, `title`, `content`, `is_read` | Alertas del sistema para los miembros |
| **`comments`** | `id`, `task_id`, `user_id`, `content` | Notas añadidas en el detalle de las tareas |
| **`audit_logs`** | `id`, `user_id`, `action`, `details`, `created_at` | Registro general de auditoría de seguridad |

---

## Verificación de Columnas del Sprint 2

Se ejecutó `PRAGMA table_info(projects)` obteniendo los siguientes campos clave que faltaban en versiones antiguas:
- `tasks_retention_days` (INTEGER, Not Null) -> **Presente**
- `sprint_enabled` (BOOLEAN, Not Null) -> **Presente**
- `sprint_length_days` (INTEGER, Not Null) -> **Presente**
- `state` (VARCHAR, Nullable) -> **Presente**
