# REPORTE DE REVISIÓN TÉCNICA Y AUDITORÍA - SPRINT 2
## Estado de la Base de Código y Lista de Verificación Académica

***

## 1. ARCHIVOS MODIFICADOS Y RESPONSABILIDADES

| Archivo | Ruta | Responsabilidad |
| :--- | :--- | :--- |
| **Nuevo Modelo** | [task_state_history.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/app/models/task_state_history.py) | Define la estructura de base de datos para la telemetría de transiciones de estado de las tareas (`task_state_histories`), registrando el estado anterior, nuevo estado, hora del cambio y usuario responsable. |
| **Modificación de Modelo** | [task.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/app/models/task.py) | Incorpora campos de base de datos del motor de riesgo (`risk_status`, `delay_probability`, `predicted_delay_days`, `risk_factors`) y asocia la relación bidireccional con el historial de estados. |
| **Exportación de Modelos** | [__init__.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/app/models/__init__.py) | Registra y expone el modelo `TaskStateHistory` en el inicializador del paquete `app.models`. |
| **Nuevo Servicio** | [risk_engine_service.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/app/services/risk_engine_service.py) | Implementa `SmartRiskEngineService`, conteniendo el motor heurístico determinista de riesgo (algoritmo basado en proximidad de fecha límite, completitud de checklist, saturación del desarrollador y estancamiento de estados). |
| **Exportación de Servicios** | [__init__.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/app/services/__init__.py) | Registra y expone `SmartRiskEngineService` en el inicializador del paquete `app.services`. |
| **Inyección de Lógica** | [task_service.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/app/services/task_service.py) | Conecta las acciones CRUD y de actualización (`create_task`, `update_task`, `assign_task`, `change_status`) con el motor de riesgo y la grabación del historial de transiciones en base de datos. |
| **Esquema de API** | [task_schema.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/app/schemas/task_schema.py) | Modifica Marshmallow `TaskSchema` para incluir de forma de solo lectura (`dump_only=True`) los atributos de riesgo calculados en las respuestas HTTP JSON. |
| **Inicializador Flask** | [run.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/run.py) | Registra el modelo `TaskStateHistory` en el contexto global de la aplicación para que Flask-Migrate (Alembic) lo reconozca al iniciar. |
| **Nueva Migración** | [5a3c2d1e9f8b_add_risk_engine_fields.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/migrations/versions/5a3c2d1e9f8b_add_risk_engine_fields.py) | Script de base de datos estructurado en Alembic para crear la tabla de historial y agregar columnas con valores por defecto a `tasks`. |
| **Archivo de Pruebas** | [test_risk_engine.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/test_risk_engine.py) | Suite de pruebas unitarias usando base de datos SQLite en memoria para validar las heurísticas matemáticas del motor de riesgo y la telemetría. |
| **Tipados del Frontend** | [types.ts](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-frontend/mock/types.ts) | Agrega campos de tipado opcionales al tipo de datos `Task` local de TypeScript en el frontend. |
| **Tipados de la API** | [api-types.ts](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-frontend/lib/api-types.ts) | Modifica la interfaz `BackendTask` para reflejar con precisión los campos enviados por la API de Flask. |
| **Mapeadores del Frontend** | [mappers.ts](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-frontend/lib/mappers.ts) | Actualiza el mapeador `mapTaskFromBackend` para deserializar las propiedades de riesgo del JSON del backend al modelo local. |

***

## 2. IMPACTO SOBRE EL SISTEMA EXISTENTE

1. **Rendimiento de Base de Datos:**
   * Al agregar el trigger en `TaskService`, cada actualización de estado del Kanban o cambio de fecha límite ejecuta un flush, un cálculo en memoria rápida y un commit adicional. Esto incrementa la consistencia de los datos pero añade ligeros microsegundos a las operaciones de escritura (dentro del límite tolerable).
2. **Consumo de la API REST:**
   * La respuesta JSON del endpoint `/api/tasks` ahora incluye 4 campos extra por cada tarea. Esto incrementa de forma trivial el tamaño del payload de red, sin romper la compatibilidad debido a que el cliente HTTP utiliza mapeadores tolerantes a campos nuevos.
3. **Flujo de Trabajo del Desarrollador (Developer Workload):**
   * El cálculo de saturación consulta la base de datos buscando tareas activas del mismo usuario. Esto añade una consulta `SELECT COUNT` indexada por `assigned_to` y `project_id`, la cual es muy eficiente.

***

## 3. DEPENDENCIAS NUEVAS
No se introdujeron librerías externas adicionales. Toda la lógica del motor de riesgo y las firmas se resolvieron utilizando la biblioteca estándar de Python (`datetime`, `uuid`) y las capacidades nativas de SQLAlchemy, evitando añadir carga al archivo `requirements.txt` o `package.json`.

***

## 4. MIGRACIONES A EJECUTAR
Para aplicar estos cambios en un entorno local o de producción (Render), se debe ejecutar el siguiente comando en la carpeta `project-management-backend`:

```bash
flask db upgrade
```

Esto aplicará secuencialmente el script de migración [5a3c2d1e9f8b_add_risk_engine_fields.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/migrations/versions/5a3c2d1e9f8b_add_risk_engine_fields.py) que:
1. Crea el tipo de dato enum `risk_status` en la base de datos PostgreSQL.
2. Agrega las columnas correspondientes a `tasks` con sus valores por defecto.
3. Crea la tabla `task_state_histories` con sus índices y restricciones de llave foránea.

***

## 5. PRUEBAS PARA VALIDAR EL FUNCIONAMIENTO
Las pruebas unitarias han sido estructuradas en [test_risk_engine.py](file:///d:/ProGest%20Analytics/Sistema-Gestion-de-Proyectos-main/project-management-backend/test_risk_engine.py). Para ejecutarlas se corre:

```bash
python -m unittest test_risk_engine.py
```

Estas pruebas verifican:
1. Cálculo correcto de probabilidad nula si la tarea no tiene fecha límite.
2. Comportamiento en tareas vencidas (probabilidad = 1.0, riesgo alto, cálculo de días de atraso).
3. Penalizaciones por checklists vacíos y proximidad de fecha.
4. Grabación correcta de transiciones de estado en la base de datos.

***

## 6. FUNCIONALIDADES NO IMPLEMENTADAS TODAVÍA (ALCANCE PENDIENTE)
1. **Integración Visual en el Tablero Kanban:**
   * Mostrar el badge de riesgo en las tarjetas visuales de tareas en el frontend.
2. **Dashboard Visual de Alertas de Riesgo:**
   * Crear el panel interactivo en `/app/reports` con gráficos de tendencias de riesgo y cuellos de botella de velocidad.
3. **Alertas en Tiempo Real (SSE):**
   * El backend ya calcula el riesgo, pero aún no dispara un evento a través de SSE a los navegadores del `OWNER` cuando un nivel de riesgo escala a nivel alto.

***

## 7. LISTA DE VERIFICACIÓN ACADÉMICA (SEMANA 6 - PLAN DE TRABAJO DUAL)

| Criterio de Evaluación | Requisito Académico | Estado en el Repositorio | Evidencia en el Código |
| :--- | :--- | :--- | :--- |
| **Instrumentación y Telemetría** | El sistema debe recopilar datos de uso (cambios de estados, tiempos). | **Completo** | Tabla `task_state_histories` y el método `log_state_transition` en `SmartRiskEngineService`. |
| **Definición de Variables** | Estructurar los campos que alimentan y demuestran la hipótesis del experimento. | **Completo** | Campos `risk_status`, `delay_probability` y `predicted_delay_days` añadidos al modelo `Task`. |
| **Algoritmo del Risk Engine** | Algoritmo lógico/heurístico inicial implementado para clasificar riesgos. | **Completo** | Métodos matemáticos y heurísticos dentro de `SmartRiskEngineService`. |
| **Integración e Impacto** | El motor de riesgo debe interactuar con las acciones diarias de gestión de tareas. | **Completo** | Ganchos integrados en `TaskService` en creación, reasignación, edición y drag-and-drop de estados. |
| **Validación del Software** | Existencia de pruebas automatizadas unitarias para validar las reglas del motor. | **Completo** | Suite de pruebas unitarias implementada en `test_risk_engine.py`. |
