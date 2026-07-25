# Arquitectura de Base de Datos
## ProGest Smart Analytics

Este documento detalla la capa de persistencia relacional implementada en PostgreSQL y mapeada a través de SQLAlchemy.

### 1. Modelo Entidad-Relación (ER Diagram)

A continuación se detalla la estructura principal de tablas y sus relaciones.

```mermaid
erDiagram
    USERS {
        string id PK "uuid4"
        string email UK "Indexed"
        string password_hash
        string name
        enum role "OWNER, EMPLOYEE, SUPERADMIN"
        string avatar
    }

    PROJECTS {
        string id PK "uuid4"
        string name
        text description
        string owner_id FK "Users(id)"
        datetime created_at
    }

    MEMBERSHIPS {
        string id PK "uuid4"
        string user_id FK "Users(id)"
        string project_id FK "Projects(id)"
        enum role "ADMIN, MEMBER, VIEWER"
    }

    SPRINTS {
        string id PK "uuid4"
        string project_id FK "Projects(id)"
        string name
        datetime start_date
        datetime end_date
        enum status "PLANNING, ACTIVE, COMPLETED"
    }

    TASKS {
        string id PK "uuid4"
        string project_id FK "Projects(id)"
        string sprint_id FK "Sprints(id)"
        string assigned_to FK "Users(id)"
        string created_by FK "Users(id)"
        string title
        string status "TODO, IN_PROGRESS, IN_REVIEW, DONE"
        string priority "LOW, MEDIUM, HIGH, URGENT"
        string risk_status "LOW, MEDIUM, HIGH, CRITICAL"
        float delay_probability
        int predicted_delay_days
        json risk_factors
    }

    TASK_STATE_HISTORY {
        string id PK "uuid4"
        string task_id FK "Tasks(id)"
        string from_state
        string to_state
        datetime changed_at
        string changed_by_id FK "Users(id)"
    }

    COMMENTS {
        string id PK "uuid4"
        string task_id FK "Tasks(id)"
        string user_id FK "Users(id)"
        text content
    }

    USERS ||--o{ PROJECTS : "owns"
    USERS ||--o{ MEMBERSHIPS : "has"
    PROJECTS ||--o{ MEMBERSHIPS : "contains"
    PROJECTS ||--o{ SPRINTS : "divided_in"
    PROJECTS ||--o{ TASKS : "contains"
    SPRINTS ||--o{ TASKS : "contains"
    USERS ||--o{ TASKS : "assigned_to/created_by"
    TASKS ||--o{ TASK_STATE_HISTORY : "tracked_in"
    TASKS ||--o{ COMMENTS : "has"
    USERS ||--o{ COMMENTS : "writes"
```

### 2. Análisis de Tablas Principales

#### `tasks`
El núcleo transaccional. Además de los campos estándar (título, descripción, fechas), incorpora las columnas predictivas añadidas en el Sprint 2:
- `risk_status`: Nivel de riesgo calculado (ENUM semántico).
- `delay_probability`: Porcentaje (0.0 a 1.0) de probabilidad de fracaso.
- `predicted_delay_days`: Entero estimativo de desviación cronológica.
- `risk_factors`: Columna JSON que almacena un array de strings (las razones matemáticas del riesgo, ej. "Exceso de reasignaciones").

#### `task_state_history` (Telemetría)
La tabla más importante para el Smart Risk Engine.
Es de solo inserción (Append-only). Nunca se edita un registro aquí.
- Graba cada transición en la máquina de estados de la tarea (ej. de `TODO` a `IN_PROGRESS`).
- `changed_at` provee un timestamp absoluto, permitiendo calcular métricas como el *Time-in-State* (Tiempo estancado en una columna).

#### `memberships`
Tabla intermedia (Join Table) que resuelve la relación muchos a muchos entre `users` y `projects`, añadiendo el atributo de `role`. Es vital para los middlewares de autorización.

### 3. Índices y Rendimiento
Para evitar *Table Scans* durante consultas críticas, SQLAlchemy tiene configurados `index=True` explícitamente en:
- `User.email` (Login rápido).
- `Task.project_id`, `Task.sprint_id`, `Task.assigned_to` (Consultas de tableros).
- `TaskStateHistory.task_id` (Cálculo rápido del Risk Engine).

### 4. Migraciones
El proyecto utiliza Alembic. Esto significa que los comandos DDL (`CREATE TABLE`, `ALTER TABLE`) no se ejecutan directamente en la BD, sino que Alembic lee las diferencias entre los Modelos (código Python) y el Schema actual de Postgres, generando archivos de revisión en `migrations/versions/`.
