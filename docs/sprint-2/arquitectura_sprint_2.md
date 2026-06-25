# ESPECIFICACIÓN DE ARQUITECTURA DE SOFTWARE - SPRINT 2
## ProGest Smart Analytics (Semana 6)

Este documento especifica la arquitectura final, el modelo de datos extendido, los componentes y los flujos operacionales del módulo **Smart Risk Engine** para el sistema **ProGest Smart Analytics**.

***

## 1. DIAGRAMA DE ARQUITECTURA GENERAL

El sistema opera bajo un esquema cliente-servidor físicamente distribuido y desacoplado, diseñado para el despliegue optimizado en la nube.

```mermaid
graph TD
    subgraph Cliente [Capa de Presentación - Vercel]
        FE[Next.js 16 Client App Router]
        Store[Zustand Stores: auth, data, notifications]
    end

    subgraph Servidor [Capa de Negocio - Render Web Service]
        App[Flask Application Core]
        BP[Flask Blueprints / Capa de Controladores]
        SVC[Capa de Servicios: TaskService, SmartRiskEngineService]
        SSE[SSE Notifications Hub]
    end

    subgraph Persistencia [Capa de Datos - Render PG / Supabase]
        DB[(PostgreSQL Database)]
    end

    %% Flujos de Comunicación
    FE <-->|HTTPS / REST API JSON| BP
    FE <--- |Server-Sent Events Stream| SSE
    BP <--> SVC
    SVC <-->|SQLAlchemy ORM| DB
```

***

## 2. DIAGRAMA DE COMPONENTES

Detalle de la descomposición modular de software en cliente y servidor, mostrando cómo interactúan los componentes para soportar la detección de riesgos.

```mermaid
graph LR
    subgraph FrontendComponents [Componentes Frontend Next.js]
        BoardView[Board Page - Kanban]
        ReportsView[Reports Page - Analytics]
        BadgeComponent[AnimatedBadge]
        TaskSvc[taskService.ts]
        Mappers[mappers.ts]
    end

    subgraph BackendComponents [Componentes Backend Flask]
        TasksBP[tasks_bp - Blueprint]
        TaskService[TaskService]
        RiskEngine[SmartRiskEngineService]
        TaskModel[Task Model]
        HistoryModel[TaskStateHistory Model]
    end

    %% Conexiones
    BoardView -->|Usa| BadgeComponent
    BoardView -->|Invoca| TaskSvc
    ReportsView -->|Invoca| TaskSvc
    TaskSvc -->|Deserializa con| Mappers
    TaskSvc <-->|REST API /api/tasks| TasksBP
    
    TasksBP <-->|Llama| TaskService
    TaskService -->|Calcula riesgo con| RiskEngine
    RiskEngine -->|Lee/Escribe| TaskModel
    RiskEngine -->|Escribe transiciones| HistoryModel
```

***

## 3. MODELO ENTIDAD-RELACIÓN (ER) ACTUALIZADO
Esquema lógico de datos que incorpora las tablas y campos necesarios para el motor de riesgos y la telemetría histórica.

```mermaid
erDiagram
    users {
        string id PK
        string email UNIQUE
        string password_hash
        string name
        string role "OWNER, EMPLOYEE, SUPERADMIN"
        string avatar
        string status "active, disabled"
        datetime created_at
    }

    projects {
        string id PK
        string name
        string owner_id FK
        string status
        boolean sprint_enabled
        integer tasks_retention_days
        datetime created_at
    }

    memberships {
        string id PK
        string user_id FK
        string project_id FK
        string role
        string status
        datetime joined_at
    }

    sprints {
        string id PK
        string project_id FK
        string name
        string status "planned, active, closed"
        datetime start_date
        datetime end_date
    }

    tasks {
        string id PK
        string project_id FK
        string sprint_id FK
        string title
        string description
        string status "pending, in_progress, in_review, blocked, done"
        string priority "low, medium, high, urgent"
        string assigned_to FK
        string created_by FK
        datetime due_date
        datetime start_date
        datetime completed_at
        json checklist
        string risk_status "no_risk, low, medium, high"
        float delay_probability
        integer predicted_delay_days
        json risk_factors
        datetime created_at
        datetime updated_at
    }

    task_state_histories {
        string id PK
        string task_id FK "CASCADE"
        string from_state "Nullable"
        string to_state
        datetime changed_at
        string changed_by_id FK "SET NULL"
    }

    %% Relaciones
    users ||--o| projects : "posee (1:1)"
    users ||--o{ memberships : "pertenece"
    projects ||--o{ memberships : "contiene"
    projects ||--o{ tasks : "agrupa"
    projects ||--o{ sprints : "planifica"
    sprints ||--o{ tasks : "contiene"
    users ||--o{ tasks : "tiene asignadas"
    tasks ||--o{ task_state_histories : "registra telemetría"
    users ||--o{ task_state_histories : "cambia estado"
```

***

## 4. DIAGRAMA DEL FLUJO DE CÁLCULO DE RIESGO
Muestra el recorrido completo del dato: desde que ocurre una acción en la UI hasta la actualización proactiva de indicadores visuales.

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as Desarrollador / Owner
    participant FE as Frontend Next.js (Kanban / Editor)
    participant API as API REST Flask (/api/tasks)
    participant TS as TaskService (Backend)
    participant RE as SmartRiskEngineService
    participant DB as Base de Datos (PostgreSQL)

    Usuario->>FE: Modifica tarea (Ej. arrastra a 'Blocked' o cambia due_date)
    FE->>API: PATCH /api/tasks/<id> (status, due_date) con Bearer Token
    API->>TS: update_task() / change_status()
    TS->>DB: Guarda datos básicos e historia de estados (TaskStateHistory)
    Note over TS,RE: Dispara el análisis preventivo
    TS->>RE: update_task_risk_metrics(task_id)
    RE->>DB: Query: workload del asignado y tiempo en estado
    DB-->>RE: Respuestas del query
    RE->>RE: Ejecuta heurísticas del motor
    RE->>DB: Actualiza campos: risk_status, delay_probability, predicted_days
    TS-->>API: Retorna el objeto Task actualizado (con métricas de riesgo)
    API-->>FE: HTTP 200 OK con JSON de la tarea mapeada
    FE->>FE: Actualiza Zustand 'dataStore'
    FE->>Usuario: Re-renderiza Kanban: Muestra badge de riesgo (AnimatedBadge)
```

***

## 5. DECISIONES DE DISEÑO Y ESTRATEGIA DE DESPLIEGUE

### 5.1 Decisiones de Diseño Arquitectónico
1. **Heurísticas Deterministas vs. Inteligencia Artificial (ML):**
   * Para la fase inicial, se optó por un motor de reglas heurísticas paramétricas. Esto reduce la complejidad computacional en el servidor, elimina la necesidad de datasets masivos iniciales (falsos positivos iniciales) y asegura un comportamiento determinista fácil de auditar por el profesor.
2. **Cálculo síncrono controlado (Flush & Recalculate):**
   * Para evitar la complejidad de colas de tareas asíncronas de Python (como Celery/Redis) que incrementarían los costos de infraestructura, el motor corre dentro del ciclo de vida de la petición de Flask tras persistir los cambios (`db.session.flush()`). Las consultas están altamente optimizadas mediante índices en la base de datos para no sobrecargar el hilo.
3. **Desacoplamiento de Negocio (Service Layer):**
   * La lógica del motor de riesgo se mantiene completamente separada de las rutas HTTP (`app/routes`) y reside exclusivamente en `SmartRiskEngineService`, permitiendo realizar pruebas unitarias automatizadas rápidas sobre SQLite sin levantar el servidor HTTP.

### 5.2 Estrategia de Despliegue en la Nube
El monorepo está estructurado de manera que las dos aplicaciones principales puedan construirse y distribuirse de forma independiente:

* **Frontend (Capa de Presentación):**
  * **Plataforma:** **Vercel**.
  * **Ventajas:** Soporte nativo para Next.js App Router, optimización automática de imágenes y scripts, distribución global en la red Edge y facilidades para variables de entorno de producción.
  * **Integración:** GitHub webhook que despliega automáticamente cada commit fusionado en la rama `main`.

* **Backend (Capa de Negocio):**
  * **Plataforma:** **Render (Web Service)**.
  * **Configuración:** Entorno nativo de Python (`render.yaml`). El comando de construcción instala los requerimientos (`pip install -r requirements.txt`) y levanta el servidor usando Gunicorn con threads dinámicos (`render-start.sh`).

* **Base de Datos (Capa de Datos):**
  * **Plataforma:** **Render PostgreSQL** (o **Supabase PostgreSQL** en caso de requerir escalabilidad y control de respaldos superior).
  * **Conectividad:** SQLAlchemy ORM utiliza la variable de entorno `DATABASE_URL` provista de forma segura por el servidor de despliegue. Las migraciones incrementales se aplican durante el despliegue automático del backend llamando a `flask db upgrade` en el script de arranque.
