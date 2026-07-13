# Evidencia de Ejecución de Pruebas Automatizadas

## Resumen del Reporte de Pruebas

- **Herramienta de Testing:** Python `unittest` framework.
- **Módulo Validado:** `test_risk_engine.py` (Lógica predictiva y telemetría de transiciones).
- **Base de Datos de Prueba:** SQLite en memoria (`sqlite:///:memory:`).
- **Resultados:**
  - **Pruebas Ejecutadas:** 4
  - **Pruebas Exitosas:** 4
  - **Errores/Fallos:** 0
  - **Tiempo de Ejecución:** 0.109 segundos
  - **Estatus Final:** **OK (PASSED)**

---

## Detalle de las Pruebas Corridas

### 1. `test_calculate_risk_no_due_date`
- **Objetivo:** Validar que una tarea sin fecha límite sea catalogada con riesgo nulo.
- **Resultado:** **Pasa.** Retorna correctamente `no_risk`.

### 2. `test_calculate_risk_due_soon`
- **Objetivo:** Validar que tareas próximas a vencer y sin checklist de control eleven su riesgo.
- **Resultado:** **Pasa.** Retorna riesgo medio/alto de retraso según la cercanía al límite.

### 3. `test_calculate_risk_overdue`
- **Objetivo:** Validar que una tarea con fecha de vencimiento ya expirada y sin completar dispare riesgo alto y probabilidad de 1.0.
- **Resultado:** **Pasa.** Retorna correctamente riesgo `high` y probabilidad de retraso `1.0`.

### 4. `test_log_state_transition`
- **Objetivo:** Validar que los cambios en el estado de una tarea generen registros correctos en la tabla de telemetría e histórico de cambios de estado.
- **Resultado:** **Pasa.** Inserta de forma íntegra las transiciones relacionando la tarea y el miembro.
