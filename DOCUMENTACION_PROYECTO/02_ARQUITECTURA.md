# Arquitectura del Sistema
## ProGest Smart Analytics

Este proyecto sigue una arquitectura **Cliente-Servidor (Client-Server Architecture)** tradicional con una clara separación de responsabilidades, acoplada a través de un contrato de API RESTful en formato JSON.

### 1. Vista de Alto Nivel (High-Level Architecture)

```mermaid
graph TD
    Client[Cliente Web / Browser]
    
    subgraph Frontend [Capa de Presentación - Next.js]
        UI[UI Components / Pages]
        State[Zustand Global State]
        Hooks[Custom Hooks]
        APIClient[Axios API Client]
        
        UI <--> State
        UI <--> Hooks
        Hooks <--> APIClient
    end
    
    subgraph Backend [Capa de Lógica y Negocio - Flask]
        Router[API Blueprints / Routes]
        Auth[JWT Middleware]
        Services[Business Logic Services]
        RiskEngine[Smart Risk Engine]
        DBModels[SQLAlchemy Models]
        
        Router --> Auth
        Auth --> Services
        Services <--> RiskEngine
        Services <--> DBModels
    end
    
    subgraph BaseDatos [Capa de Persistencia]
        PostgreSQL[(PostgreSQL Relacional)]
    end

    Client <-->|HTTPS / DOM Events| UI
    APIClient <-->|REST / JSON| Router
    DBModels <-->|ORM / SQL Queries| PostgreSQL
```

### 2. Capa de Presentación (Frontend)
El frontend está construido sobre **Next.js 16 (App Router)** utilizando **React 19**. Sin embargo, la aplicación se comporta principalmente como una SPA (Single Page Application) montada sobre la infraestructura de Next.js.
- **Renderizado:** Emplea de manera extensiva Client-Side Rendering (CSR) con directivas `"use client"` en casi todos los componentes interactivos.
- **Gestión de Estado (Zustand):** Se rechaza el uso de Context API en favor de tiendas atómicas de Zustand (ej. `useAuthStore`, `useDataStore`). Esto evita re-renderizados masivos en componentes hermanos.
- **Routing:** Utiliza el sistema de carpetas de Next.js (`/app/app/dashboard/page.tsx`).
- **Diseño UI:** Basado en **Radix UI** primitives y estilizado con **Tailwind CSS**. Se hace uso intensivo de composición y micro-componentes reutilizables.

### 3. Capa de Lógica de Negocio (Backend)
El backend está construido con **Python 3.x** utilizando **Flask**. La arquitectura de esta capa sigue el patrón **Service-Oriented Architecture (SOA)** a pequeña escala (patrón Controlador-Servicio).
- **Rutas (Controladores):** Los `blueprints` (ej. `task_routes.py`, `project_routes.py`) actúan únicamente como capas de transporte. Reciben la petición HTTP, parsean el JSON, invocan a la capa de servicios y retornan una respuesta HTTP serializada.
- **Servicios:** Contienen la lógica dura de la aplicación (`task_service.py`, `risk_engine_service.py`). Aquí se validan reglas de negocio, se emiten notificaciones y se dispara la telemetría.
- **Middlewares:** La validación de tokens JWT se realiza a través de decoradores `@jwt_required` inyectados en las rutas que lo ameritan.

### 4. Flujo de Datos y Telemetría

Una de las piezas arquitectónicas más importantes introducidas en ProGest es el **Flujo de Telemetría**.

```mermaid
sequenceDiagram
    participant F as Frontend (UI)
    participant R as Route (Flask)
    participant S as TaskService
    participant RE as RiskEngine
    participant DB as PostgreSQL

    F->>R: PUT /api/tasks/{id} (Cambio de estado)
    R->>S: update_task_service(id, data)
    S->>DB: Actualiza campos de Task
    S->>DB: Crea registro en TaskStateHistory (Snapshot)
    S->>RE: evaluate_task_risk(task_id)
    RE->>DB: Consulta TaskStateHistory de la Tarea
    RE-->>RE: Calcula Heurísticas (Retrasos, Reasignaciones)
    RE->>DB: Actualiza risk_score y risk_factors
    S-->>R: Retorna Task actualizado
    R-->>F: JSON {task, risk_score, risk_factors}
    F-->>F: Actualiza Zustand State y renderiza RiskBadge
```

### 5. Capa de Persistencia (Base de Datos)
La base de datos elegida es **PostgreSQL**.
La aplicación se comunica con la base de datos de manera exclusiva a través del ORM (Object-Relational Mapping) **Flask-SQLAlchemy**.
Las migraciones de esquemas (cambios en tablas, creación de campos nuevos) son gestionadas por **Alembic** vía **Flask-Migrate**.

### 6. Relaciones Clave del Negocio
- Un Usuario (`User`) puede pertenecer a múltiples Proyectos (`Project`) mediante la tabla intermedia `Membership`.
- Un Proyecto posee múltiples Tareas (`Task`) y múltiples Ciclos Iterativos (`Sprint`).
- Las Tareas están ligadas a un `Sprint`.
- Cada Tarea tiene un historial de cambios (`TaskStateHistory`) el cual es la materia prima para el cálculo del motor de riesgo.
