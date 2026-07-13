# Comparación con Repositorio Base
## ProGest Smart Analytics

Este documento responde de forma directa a la comparativa técnica entre el proyecto original (Sprint 1) y el ecosistema actual ProGest Smart Analytics (Sprint 2).

**URL del Proyecto Base:**
`https://github.com/Leonard-ssj/Sistema-Gestion-de-Proyectos`

### 1. ¿Qué se heredó intacto? (Lo que permanece igual)
La estructura monolítica de la solución se heredó tal cual. ProGest Smart Analytics corre sobre las mismas costuras tecnológicas que el original:
- El ruteo de **Next.js App Router**.
- Los componentes autogenerados primitivos de **Shadcn / Radix UI** (Ubicados en `frontend/components/ui`).
- Los esquemas de ORM originales en el backend (Las tablas `User`, `Project`, `Task`, `Sprint`, `Membership`, `Invite`, `Comment`).
- El sistema de autenticación de Flask usando JWT.
- **El error crítico de dependencias:** Se comprobó (mediante descarga del `package.json` original) que la inserción de `React 19.2.0` (Release Candidate) y `Next 16.0.10` (Canary) fue realizada por el autor original, por lo que el problema de resolución de paquetes NPM es una herencia pura, no un daño causado durante el Sprint 2.

### 2. ¿Qué se eliminó?
- **Métricas Falsas / Dummy Data:** Cualquier lógica en el frontend del repositorio original que simulaba reportes o progreso fue eliminada a favor de datos reales provenientes de la nueva API analítica (`/api/sprints/{id}/risks`).

### 3. ¿Qué se modificó profundamente?
El Sprint 2 intervino quirúrgicamente áreas muy específicas del backend para no romper el CRUD existente, pero cambiar su comportamiento interno:
- **`app/models/task.py`:** Se alteró el modelo de base de datos de la Tarea, inyectando cuatro nuevas columnas predictivas: `risk_status`, `delay_probability`, `predicted_delay_days`, y la columna JSON `risk_factors`.
- **`app/services/task_service.py`:** Se modificó el método responsable de actualizar las tareas (`update_task_service`). Se le inyectó una llamada asíncrona oculta que registra en telemetría cada cambio y recalcula la heurística justo antes de hacer `commit` a la base de datos.
- **`app/schemas/task_schema.py`:** Se modificó para exponer los nuevos campos JSON de riesgo al frontend.
- **Frontend Kanban:** Se modificó la renderización del componente base de la tarjeta para que muestre el `<RiskBadge>`.

### 4. ¿Qué se agregó (Netamente nuevo)?
La propiedad intelectual del Sprint 2 reside en estas inserciones completamente originales:
- **El Smart Risk Engine (`risk_engine_service.py`):** Un archivo con más de 200 líneas de código matemático y heurístico para calcular riesgo en tiempo real basado en fechas, reasignaciones y bloqueos.
- **Telemetría (`TaskStateHistory`):** Un modelo de SQLAlchemy y tabla nueva para guardar cada transición de la máquina de estados.
- **Vista de Dashboard (`app/app/reports/page.tsx`):** Un nuevo módulo que consume las librerías `recharts` para mostrar el resumen ejecutivo visual de los riesgos a los líderes.
- **Sistema de Exportación (`exceljs`):** La capacidad de generar descargas de reportes crudos analíticos directamente desde el navegador.
