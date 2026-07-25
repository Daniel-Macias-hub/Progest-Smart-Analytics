# Evidencia de Validación de la API

## Métricas Generales de la API

- **Total de Endpoints Registrados:** 55
- **Endpoint de Salud Testeado:** `/api/health`
  - **Método:** GET
  - **Código de Respuesta:** `200 OK`
  - **Tiempo de Respuesta:** 12 ms
  - **JSON de Retorno:**
    ```json
    {
      "database": "connected",
      "service": "progest-api",
      "status": "healthy"
    }
    ```

---

## Mapeo Completo de Endpoints por Componente

El reporte `API_ENDPOINTS.md` ha sido generado en la raíz de la unidad C: detallando cada ruta. El resumen por Blueprint es el siguiente:

### 1. Blueprint `AUTH` (7 Endpoints)
- `POST /api/auth/register` (Registro de usuarios)
- `POST /api/auth/login` (Inicio de sesión y entrega de token JWT)
- `POST /api/auth/logout` (Cierre de sesión)
- `POST /api/auth/forgot-password` (Inicio de recuperación)
- `POST /api/auth/reset-password` (Restablecimiento con token)
- `GET /api/auth/me` (Información del usuario autenticado)
- `PATCH /api/auth/change-password` (Cambio interno de credencial)

### 2. Blueprint `PROJECTS` (4 Endpoints)
- `POST /api/projects` (Crear proyecto)
- `GET /api/projects/my-project` (Ver proyecto activo)
- `GET /api/projects/settings` (Ver configuraciones de retención/sprints)
- `PATCH /api/projects/settings` (Modificar configuraciones)

### 3. Blueprint `TASKS` (9 Endpoints)
- `POST /api/tasks` (Crear tarea)
- `GET /api/tasks` (Listar tareas del proyecto)
- `GET /api/tasks/<task_id>` (Detalle de tarea)
- `PATCH /api/tasks/<task_id>` (Editar campos)
- `DELETE /api/tasks/<task_id>` (Borrar tarea)
- `PATCH /api/tasks/<task_id>/assign` (Asignar miembro)
- `PATCH /api/tasks/<task_id>/status` (Cambiar estado e iniciar telemetría de riesgo)
- `GET /api/tasks/my-tasks` (Listar tareas asignadas al usuario actual)
- `GET /api/tasks/stats` (KPIs del tablero Kanban)

### 4. Blueprint `TEAM_CHAT` (2 Endpoints)
- `GET /api/projects/<project_id>/chat` (Recuperar historial de mensajes)
- `POST /api/projects/<project_id>/chat` (Enviar mensaje con menciones/vinculación de tareas)
