# PRODUCT BACKLOG & PLANTILLAS DE ISSUES (GITHUB)

Este documento contiene el Product Backlog formal del proyecto **ProGest Smart Analytics**. Cada historia de usuario está estructurada como una plantilla lista para ser copiada y pegada como un **GitHub Issue** individual, sirviendo de evidencia metodológica para la dimensión **THE JOB**.

---

## HU-01: Telemetría e Instrumentación de Tareas (Base de Datos)

* **Título del Issue:** `feat(db): HU-01 - Instrumentación y telemetría de rendimiento de tareas`
* **Etiquetas:** `user-story`, `sprint-2`, `database`, `priority: high`
* **Descripción:**
  ```text
  ### Narrativa de la Historia de Usuario
  * **COMO:** Investigador del Proyecto Integrador
  * **QUIERO:** Registrar la telemetría operativa detallada de las tareas (fecha de creación, inicio, fin, plazos y cambios de prioridad) en PostgreSQL
  * **PARA:** Recolectar datos empíricos de desviación temporal (horas de retraso) que permitan contrastar la hipótesis de investigación.
  
  ### Criterios de Aceptación
  - **Dado** que un líder crea, inicia o completa una tarea, **cuando** el sistema procese el evento, **entonces** se debe registrar una entrada en la tabla `task_risk_telemetry` con las marcas de tiempo exactas.
  - **Dado** el flujo de control, **cuando** el sistema esté en el Sprint 2, **entonces** el campo `experimental_group_active` debe guardarse como `FALSE` (modo recolección silenciosa/línea base).
  
  ### Checklist de Tareas Técnicas
  - [ ] Diseñar el modelo SQLAlchemy para la tabla `task_risk_telemetry`.
  - [ ] Crear y ejecutar la migración de base de datos en PostgreSQL.
  - [ ] Implementar hooks/signals en el backend para capturar eventos de tareas (creación, edición, eliminación).
  - [ ] Escribir pruebas unitarias para validar la inserción correcta de marcas de tiempo de telemetría.
  ```

---

## HU-02: Motor de Cálculo de Riesgo Heurístico (Backend)

* **Título del Issue:** `feat(backend): HU-02 - Algoritmo heurístico del Smart Risk Engine`
* **Etiquetas:** `user-story`, `sprint-2`, `backend`, `priority: high`
* **Descripción:**
  ```text
  ### Narrativa de la Historia de Usuario
  * **COMO:** Líder de proyecto
  * **QUIERO:** Que el sistema calcule dinámicamente un score y un nivel de riesgo para cada tarea activa usando reglas de negocio
  * **PARA:** Identificar proactivamente cuáles tareas presentan probabilidad de demora.
  
  ### Criterios de Aceptación
  - **Dado** una tarea con fecha límite próxima y poco avance en su checklist, **cuando** el motor procese sus datos, **entonces** debe asignar un `risk_score` de 0 a 100 y mapearlo a su correspondiente `risk_level` (Bajo, Medio, Alto, Crítico).
  - **Dado** que una tarea se marca como "Blocked" (Bloqueada), **cuando** se recalcule el riesgo, **entonces** se le debe aplicar un recargo de +20 puntos en su score de riesgo.
  
  ### Checklist de Tareas Técnicas
  - [ ] Implementar la función de cálculo matemático de riesgo temporal ($RS_{time}$) y de checklist ($RS_{checklist}$).
  - [ ] Desarrollar los modificadores de score por estado de tarea (Blocked, In Review, Pending).
  - [ ] Crear el endpoint `GET /api/tasks/<id>/risk` para exponer los datos de riesgo calculados.
  - [ ] Validar con pruebas unitarias las heurísticas del motor bajo múltiples escenarios límite.
  ```

---

## HU-03: Semaforización Visual del Riesgo (Frontend)

* **Título del Issue:** `feat(frontend): HU-03 - Indicadores visuales de riesgo en el Kanban`
* **Etiquetas:** `user-story`, `sprint-3`, `frontend`, `priority: high`
* **Descripción:**
  ```text
  ### Narrativa de la Historia de Usuario
  * **COMO:** Líder de proyecto
  * **QUIERO:** Visualizar badges de colores según el nivel de riesgo en las tarjetas del Kanban y la lista de tareas
  * **PARA:** Priorizar de un vistazo el seguimiento de las tareas más críticas.
  
  ### Criterios de Aceptación
  - **Dado** que el motor asigna un nivel de riesgo, **cuando** se renderice la tarjeta en el frontend, **entonces** debe mostrar un indicador visual de color (Verde para Bajo, Amarillo para Medio, Naranja para Alto, Rojo para Crítico).
  - **Dado** una tarea en estado "Done" (Completada), **cuando** se muestre en la interfaz, **entonces** no debe presentar ningún semáforo de riesgo (o mostrarse en verde neutro).
  
  ### Checklist de Tareas Técnicas
  - [ ] Crear el componente visual React/Next.js `RiskBadge` utilizando Tailwind CSS.
  - [ ] Consumir los datos de riesgo del backend e integrarlos en el estado global de Zustand del frontend.
  - [ ] Modificar las tarjetas del Tablero Kanban base para pintar el badge de riesgo dinámico.
  - [ ] Integrar el badge de riesgo en la vista detallada de la tarea.
  ```

---

## HU-04: Dashboard Analítico de Riesgo

* **Título del Issue:** `feat(frontend): HU-04 - Tablero analítico y métricas de desempeño`
* **Etiquetas:** `user-story`, `sprint-3`, `frontend`, `priority: medium`
* **Descripción:**
  ```text
  ### Narrativa de la Historia de Usuario
  * **COMO:** Gerente / Líder de proyecto
  * **QUIERO:** Visualizar un panel con gráficos interactivos sobre la distribución y las tendencias de riesgo del equipo
  * **PARA:** Tomar decisiones sobre balanceo de cargas de trabajo y mitigación de retrasos globales.
  
  ### Criterios de Aceptación
  - **Dado** la vista analítica `/app/analytics`, **cuando** cargue la página, **entonces** debe mostrar un gráfico de barras con la distribución de riesgo por miembro y la tasa general de tareas retrasadas.
  - **Dado** que hay filtros por proyecto activos, **cuando** se seleccionen, **entonces** los gráficos deben actualizar sus métricas de inmediato.
  
  ### Checklist de Tareas Técnicas
  - [ ] Crear la página de Next.js `/app/analytics` bajo ruta protegida.
  - [ ] Integrar componentes de gráficos interactivos (ej. Recharts o Chart.js).
  - [ ] Implementar endpoints en el backend Flask para agrupar métricas analíticas.
  - [ ] Validar el correcto redibujado de gráficos al aplicar filtros de fecha y de proyectos.
  ```

---

## HU-05: Sistema de Alertas Activas de Riesgo Crítico

* **Título del Issue:** `feat(notifications): HU-05 - Alertas in-app para tareas en riesgo crítico`
* **Etiquetas:** `user-story`, `sprint-3`, `backend`, `frontend`, `priority: medium`
* **Descripción:**
  ```text
  ### Narrativa de la Historia de Usuario
  * **COMO:** Empleado asignado a una tarea
  * **QUIERO:** Recibir una notificación en tiempo real cuando el riesgo de mi tarea suba a nivel Alto o Crítico
  * **PARA:** Coordinar apoyo inmediato con mi líder de proyecto antes de que venza el plazo.
  
  ### Criterios de Aceptación
  - **Dado** que el motor de riesgos eleva una tarea a nivel "Crítico", **cuando** ocurrirá el cambio, **entonces** se debe disparar una notificación in-app dirigida al empleado asignado y al líder del proyecto.
  - **Dado** el contador de notificaciones de la UI, **cuando** la notificación se genere, **entonces** el contador de elementos no leídos debe incrementarse en tiempo real.
  
  ### Checklist de Tareas Técnicas
  - [ ] Crear el servicio de triggers de notificaciones de riesgo en el backend Flask.
  - [ ] Conectar las alertas del backend con el sistema de mensajería in-app existente en el frontend.
  - [ ] Añadir a la vista de notificaciones del empleado la tarjeta con el detalle de la alerta crítica.
  ```

---

## HU-06: Exportador de Datos para Auditoría (CSV/PDF)

* **Título del Issue:** `feat(analytics): HU-06 - Exportación de telemetría e informes científicos`
* **Etiquetas:** `user-story`, `sprint-4`, `backend`, `priority: low`
* **Descripción:**
  ```text
  ### Narrativa de la Historia de Usuario
  * **COMO:** Auditor Académico / Evaluador de Proyecto
  * **QUIERO:** Exportar la telemetría recolectada en formato CSV
  * **PARA:** Realizar análisis estadísticos externos y auditorías metodológicas independientes.
  
  ### Criterios de Aceptación
  - **Dado** que el usuario hace clic en "Exportar CSV" en la UI analítica, **cuando** el sistema responda, **entonces** se debe descargar un archivo plano estructurado conteniendo la telemetría operativa de la tabla `task_risk_telemetry`.
  
  ### Checklist de Tareas Técnicas
  - [ ] Crear el endpoint en el backend para generar y transmitir archivos CSV dinámicos a partir de PostgreSQL.
  - [ ] Agregar el botón de descarga "Exportar Datos de Rendimiento" en el Dashboard del frontend.
  - [ ] Validar que el archivo CSV exportado contenga las columnas de telemetría de forma limpia y codificada en UTF-8.
  ```
