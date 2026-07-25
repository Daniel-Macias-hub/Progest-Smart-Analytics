# Evidencia de Validación del Smart Risk Engine

El motor de análisis inteligente de riesgos operacionales y retrasos (**Smart Risk Engine**) ha sido verificado y se encuentra alineado entre backend y frontend.

---

## Validación del Algoritmo del Backend

Se corrieron pruebas sobre `SmartRiskEngineService`, certificando el correcto funcionamiento del modelo predictivo probabilístico:

1. **Caso 1: Tareas sin fecha límite (`due_date` nulo)**
   - **Resultado:** Retorna `no_risk` con probabilidad `0.0`. Las tareas sin fecha de entrega no representan riesgo de retraso.
   - **Estado:** **Correcto (✓)**

2. **Caso 2: Tareas que vencen en menos de 24 horas**
   - **Resultado:** Evalúa la complejidad y la falta de checklist para clasificar la tarea con riesgo `medium` o `high`.
   - **Estado:** **Correcto (✓)**

3. **Caso 3: Tareas retrasadas (`due_date` en el pasado y no completadas)**
   - **Resultado:** Retorna riesgo `high` de forma automática con probabilidad `1.0` (retraso confirmado).
   - **Estado:** **Correcto (✓)**

4. **Caso 4: Registro de Telemetría (Historial)**
   - **Resultado:** Cada cambio de estado de la tarea (ej. de `pending` a `in_progress`) inserta una fila en `task_state_histories` registrando la hora, el usuario que realizó la acción y el cambio para análisis predictivo futuro.
   - **Estado:** **Correcto (✓)**

---

## Alineación de Diccionarios y Frontend

Se comprobó que los estados y mapeos del Risk Engine coinciden entre backend y frontend:

1. **Diccionario de Riesgo:**
   - **Valores del Backend:** `no_risk`, `low`, `medium`, `high`.
   - **Mapeo en Frontend (`RiskBadge`):**
     - `no_risk` -> Verde esmeralda (Sin riesgo)
     - `low` -> Amarillo (Riesgo bajo)
     - `medium` -> Naranja (Riesgo medio)
     - `high` -> Rojo (Riesgo alto)

2. **Integración en Tableros:**
   - **Kanban:** Muestra el badge dinámico del Smart Risk Engine en cada tarjeta de tarea.
   - **Lista de Tareas:** El `RiskBadge` está embebido de forma correcta, consumiendo el atributo `risk_status` devuelto por el endpoint `/api/tasks`.
