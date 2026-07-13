# Smart Risk Engine (Motor de Riesgo Inteligente)
## ProGest Smart Analytics

Este documento expone las reglas matemáticas y heurísticas que gobiernan el componente principal de analítica predictiva del proyecto, ubicado en `app/services/risk_engine_service.py`.

### 1. Objetivo Principal
El **Smart Risk Engine** abandona la gestión reactiva de tareas (esperar a que algo falle para marcarlo rojo). En su lugar, analiza en tiempo real una serie de variables contextuales cada vez que una tarea sufre una mutación, calculando una `delay_probability` (0.0 a 1.0) y categorizando la salud de la tarea en niveles (`no_risk`, `low`, `medium`, `high`).

### 2. Ciclo de Ejecución (¿Cuándo recalcula?)
El motor no es un Cron Job que corre cada hora. Es un **servicio reactivo (Event-Driven)**:
- Se invoca sincrónicamente a través de `SmartRiskEngineService.update_task_risk_metrics()` justo antes de que el endpoint `PUT /api/tasks/{id}` responda al cliente.
- Esto asegura que si el Project Manager mueve una tarjeta en el tablero de `TODO` a `IN_PROGRESS`, el riesgo visual (`RiskBadge`) parpadeará y cambiará de color instantáneamente si el motor determina que el desarrollador al que se le asignó ya está sobrecargado.

### 3. El Algoritmo Heurístico (Reglas de Predicción)

El algoritmo suma puntajes de penalización a la `delay_probability` (base 0.0) basándose en 4 pilares:

#### Pilar 1: Presión de Tiempo (Due Date Proximity)
Analiza la cercanía entre el instante actual (`utcnow()`) y el `due_date`:
- **Vencida (`overdue`):** Probabilidad salta automáticamente a `1.0` (100%). Riesgo: `high`.
- **< 24 horas restantes:** Penalización de `+0.60` (`due_date_proximity_critical`).
- **< 72 horas restantes:** Penalización de `+0.35` (`due_date_proximity_warning`).
- **< 1 semana restante:** Penalización de `+0.15` (`due_date_proximity_notice`).

#### Pilar 2: Velocidad de Avance (Checklist Velocity)
No basta con que la tarea tenga tiempo; el algoritmo penaliza el falso progreso.
- **Sin items completados (`0.0%`):** Penalización base `+0.10`.
- **Lentitud Crítica (`low_checklist_velocity`):** Si faltan < 48h y hay menos del 50% completado (`+0.25`). Si faltan < 24h y hay menos del 80% completado (`+0.30`).
- **Inacción Crítica (`unstarted_critical_task`):** Si faltan < 24h, la tarea sigue en `pending` (TODO) y ni siquiera se ha marcado avance, se castiga brutalmente con `+0.40`.

#### Pilar 3: Sobrecarga Cognitiva (Developer Overload)
Consulta la tabla `Tasks` para auditar a la persona asignada (`assigned_to`).
- Si el usuario tiene **3 o más tareas activas** en el mismo proyecto al mismo tiempo, se asume un cuello de botella por context switching.
- Penalización: `+0.15` (`developer_overload`).

#### Pilar 4: Estancamiento de Tareas (Status Stagnation)
Hace uso directo de la tabla de telemetría (`TaskStateHistory`).
- Mide el *Time-in-State* calculando los días desde el último registro de historial (`changed_at`).
- Si una tarea lleva **5 o más días** en `in_progress` o `blocked` sin cambiar de columna, se marca como estancada (`status_stagnation`), sumando `+0.20`.
- Si el estado literal es `blocked`, se penaliza extra con `+0.10` y se fuerza el riesgo visual general mínimo a nivel `medium` sin importar el cálculo matemático.

### 4. Categorización y Salida (El Pipeline final)

La probabilidad final (ej. `0.85`) se clasifica para la UI:
- **`>= 0.75` o Vencida:** Estado **CRITICAL (High)**. Días de retraso estimados: Vencimiento actual o `+2` días proyectados.
- **`>= 0.40`:** Estado **WARNING (Medium)**. Retraso estimado: `+1` día.
- **`>= 0.15`:** Estado **NOTICE (Low)**.
- **`< 0.15`:** Estado **SANO (No Risk)**.

El JSON de respuesta que viaja al frontend luce así:
```json
{
  "risk_status": "high",
  "delay_probability": 0.85,
  "predicted_delay_days": 2,
  "risk_factors": {
    "developer_overload": true,
    "due_date_proximity_critical": true,
    "incomplete_checklist": true
  }
}
```

### 5. Integración Frontend (Consumo Visual)
1. El backend expone la ruta analítica agrupadora `/api/sprints/{id}/risks`.
2. La vista gerencial del frontend llama a esta ruta y le pasa la metadata al componente `<PieChart>` de `recharts` para dibujar el pastel de riesgos del proyecto.
3. A nivel de Kanban, el componente `<RiskBadge>` mapea las llaves booleanas del objeto `risk_factors` (ej. `developer_overload`) y dibuja iconos de alerta (⚠️) al lado del título de la tarea en la tarjeta.

### 6. Qué partes faltan implementar o mejorar (Deuda Matemática)
1. **Machine Learning Real:** Actualmente el modelo es determinista (reglas `if/else` hardcodeadas basadas en el criterio del desarrollador). El siguiente paso evolutivo sería inyectar un modelo Scikit-Learn entrenado con el `TaskStateHistory` de 6 meses para que el modelo pondere el peso de las penalizaciones automáticamente.
2. **Dependencias de Tareas (DAGs):** El motor no evalúa aún si el retraso de la *Tarea A* causará un retraso en cascada en la *Tarea B* porque la relación funcional de bloqueo no existe en la base de datos de este Sprint.
