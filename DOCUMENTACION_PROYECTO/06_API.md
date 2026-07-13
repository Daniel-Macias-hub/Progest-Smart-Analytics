# Especificación de la API (Endpoints)
## ProGest Smart Analytics

Este documento enumera los contratos de comunicación (Endpoints) expuestos por los blueprints de Flask para que el frontend Next.js los consuma.

### Arquitectura Base de la API
- **Prefijo Global:** Todas las rutas están prefijadas con `/api`.
- **Formato de Transporte:** `application/json`.
- **Autenticación:** La mayoría de los endpoints exigen un header `Authorization: Bearer <JWT_TOKEN>`.

---

### Módulo: Autenticación (`/api/auth`)

#### `POST /api/auth/register`
- **Objetivo:** Crear un nuevo usuario en la plataforma.
- **Entrada (JSON):** `email`, `password`, `name`, opcionales: `job_title`, `department`.
- **Salida (201):** `{ "message": "Usuario registrado exitosamente" }`
- **Errores:** `400` (Email ya existe, validación fallida).

#### `POST /api/auth/login`
- **Objetivo:** Autenticar usuario y obtener JWT.
- **Entrada (JSON):** `email`, `password`.
- **Salida (200):** `{ "access_token": "ey...", "user": { "id": "...", "name": "..." } }`
- **Errores:** `401` (Credenciales inválidas).

#### `GET /api/auth/me`
- **Objetivo:** Obtener el perfil del usuario actualmente autenticado (usado para hidratar Zustand al recargar la página).
- **Entrada:** N/A (Solo Bearer Token).
- **Salida (200):** Objeto `UserSchema` completo.

---

### Módulo: Proyectos (`/api/projects`)

#### `GET /api/projects`
- **Objetivo:** Listar proyectos donde el usuario es miembro o creador.
- **Salida (200):** Array de `ProjectSchema`.

#### `POST /api/projects`
- **Objetivo:** Crear un nuevo espacio de trabajo.
- **Entrada (JSON):** `name`, `description`.
- **Salida (201):** `ProjectSchema`.

#### `GET /api/projects/<project_id>/sprints`
- **Objetivo:** Obtener todos los ciclos iterativos de un proyecto.

---

### Módulo: Tareas y Sprints (`/api/sprints`, `/api/tasks`)

#### `GET /api/sprints/<sprint_id>/tasks`
- **Objetivo:** Cargar el tablero Kanban de un sprint específico.
- **Salida (200):** Array de `TaskSchema`. Incluye `risk_score` y `risk_factors` ya calculados.

#### `POST /api/tasks`
- **Objetivo:** Crear una tarea.
- **Entrada (JSON):** `title`, `description`, `project_id`, `sprint_id` (opcional), `status`, `assigned_to` (opcional).
- **Salida (201):** `TaskSchema`.
- **Trigger Oculto:** Genera el primer registro en `TaskStateHistory` marcado como inicialización.

#### `PUT /api/tasks/<task_id>`
- **Objetivo:** Actualizar una tarea (Mover de columna Kanban, reasignar, cambiar descripción).
- **Entrada (JSON):** Campos parciales a actualizar (ej. `{ "status": "DONE" }`).
- **Salida (200):** `TaskSchema`.
- **Trigger Oculto:** Dispara la inyección de `TaskStateHistory` y llama inmediatamente a `evaluate_task_risk()` para recalcular el riesgo antes de retornar la respuesta, asegurando que el cliente siempre tenga el score fresco.

---

### Módulo: Analítica Predictiva (`/api/sprints`)

#### `GET /api/sprints/<sprint_id>/risks`
- **Objetivo:** Alimentar el **Dashboard de Riesgo Gerencial** y las gráficas de `recharts`.
- **Entrada:** N/A.
- **Salida (200 JSON Example):**
```json
{
  "sprint_id": "uuid",
  "total_tasks": 45,
  "risk_distribution": {
    "LOW": 20,
    "MEDIUM": 15,
    "HIGH": 8,
    "CRITICAL": 2
  },
  "critical_tasks": [
    {
      "id": "uuid",
      "title": "Migración de Auth",
      "delay_probability": 0.85,
      "factors": ["Exceso de reasignaciones", "Estancamiento en revisión"]
    }
  ],
  "global_health_score": 72.5
}
```
- **Lógica Oculta:** Este endpoint agrega los datos de todas las tareas del sprint. No recalcula el riesgo de cada tarea uno por uno (eso sería costoso o generaría timeouts), sino que consulta los campos `risk_status` ya cacheados en las filas de las tareas, los cuales fueron calculados reactivamente durante los `PUT /api/tasks`.
