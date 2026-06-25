# ROADMAP - ProGest Smart Analytics

Este documento establece la ruta evolutiva del producto **ProGest Smart Analytics** hacia su Producto Mínimo Viable (MVP). La planeación está estructurada para cumplir paralelamente con la implementación de software (**THE JOB**) y el rigor experimental de investigación (**THE SCIENCE**).

---

## Fases del Proyecto

```mermaid
gantt
    title Plan de Sprints - ProGest Smart Analytics
    dateFormat  YYYY-MM-DD
    section THE JOB (Técnico)
    Sprint 1: Inicialización y Backlog Documental    :active, s1, 2026-06-14, 7d
    Sprint 2: Motor de Riesgo Core (API Flask)      : s2, after s1, 14d
    Sprint 3: Dashboard y Alertas (Next.js)         : s3, after s2, 14d
    Sprint 4: Exportación y Cierre de Código       : s4, after s3, 7d
    section THE SCIENCE (Científico)
    Sprint 1: Definición Preliminar del Experimento  :active, sc1, 2026-06-14, 7d
    Sprint 2: Captura de Línea Base (Control)       : sc2, after sc1, 14d
    Sprint 3: Captura Experimental (Alertas Visibles) : sc3, after sc2, 14d
    Sprint 4: Validación de Hipótesis y Reporte     : sc4, after sc3, 7d
```

---

## Detalle de Hitos por Sprint

### Sprint 1: Preparación del Repositorio e Instrumentación Base (Actual)
* **Objetivo de Gestión (THE JOB):** Configuración del flujo de trabajo de Git (Git Flow), estructuración del Product Backlog simplificado, y ordenamiento de la raíz del monorepo.
* **Objetivo Científico (THE SCIENCE):** Definición preliminar de la hipótesis de investigación, delimitación conceptual de variables dependientes/independientes y diseño teórico de las reglas heurísticas básicas para el motor de riesgo.
* **Entregables:**
  * README.md oficial simplificado de Sprint 1.
  * Plan y metodología preliminar del experimento (`science_experiment.md`).
  * Product Backlog y Sprint 1 Backlog (`backlog.md`).

### Sprint 2: Motor de Riesgo Core & Captura de Línea Base
* **Objetivo de Gestión (THE JOB):** Diseño del modelo de datos de telemetría, ejecución de migraciones en PostgreSQL y construcción del servicio backend Flask (**Smart Risk Engine**).
* **Objetivo Científico (THE SCIENCE):** **Fase de Control.** Activación del motor en segundo plano de manera silenciosa (sin semáforos ni alertas visibles en el frontend). Esto permite recopilar las métricas de retraso iniciales (línea base) para tener un punto de contraste.
* **Entregables:**
  * Endpoint `GET /api/tasks/<id>/risk` operativo.
  * Tablas de telemetría creadas en base de datos.
  * Registro inicial de tareas sin alertas visibles.

### Sprint 3: Visualización del Dashboard y Alertas en Frontend
* **Objetivo de Gestión (THE JOB):** Integración de componentes analíticos en Next.js, indicadores visuales de criticidad (semáforos de riesgo) e inyección de alertas críticas en tiempo real.
* **Objetivo Científico (THE SCIENCE):** **Fase Experimental.** Activación visible del motor para los usuarios. Registro de telemetría de rendimiento bajo la influencia directa de las alertas de riesgo automáticas.
* **Entregables:**
  * Tablero analítico visual en `/app/analytics`.
  * Semaforización en tablero Kanban y vista de detalle.
  * Registro de telemetría de tareas con alertas activas.

### Sprint 4: Exportación de Reportes y Validación de Hipótesis
* **Objetivo de Gestión (THE JOB):** Implementación de la exportación analítica de datos en formatos planos (CSV) para auditoría externa y optimización de código.
* **Objetivo Científico (THE SCIENCE):** Análisis cuantitativo final. Comparación de métricas entre el Grupo de Control (Sprint 2) y el Grupo Experimental (Sprint 3) para validar estadísticamente la reducción del 25% de tareas demoradas.
* **Entregables:**
  * Exportador de reportes analíticos operativo.
  * Reporte final de validación empírica y contraste de hipótesis.
