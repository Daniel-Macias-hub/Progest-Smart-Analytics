# DISEÑO EXPERIMENTAL E INSTRUMENTACIÓN CIENTÍFICA

Este documento define la metodología científica y el diseño de la instrumentación para validar la hipótesis de investigación del proyecto **ProGest Smart Analytics** en cumplimiento con la dimensión académica **THE SCIENCE**.

---

## 1. Definición Científica de la Hipótesis

### Hipótesis de Investigación ($H_1$)
> "La implementación de un módulo de detección temprana de riesgo reducirá en al menos un 25% la cantidad de tareas entregadas fuera de plazo en comparación con la gestión tradicional sin alertas automáticas."

### Hipótesis Nula ($H_0$)
> "La implementación del módulo de detección temprana de riesgo no produce una reducción significativa (o produce una reducción menor al 25%) en la cantidad de tareas entregadas fuera de plazo en comparación con la gestión tradicional."

---

## 2. Diseño de Variables e Indicadores

Para el análisis empírico, se definen las siguientes variables:

### Variable Independiente (VI)
* **Definición:** Presencia del sistema de alertas analíticas del Smart Risk Engine (Semaforización y Notificaciones).
* **Niveles de la Variable:**
  * **Ausente (Línea Base / Control):** El motor calcula el riesgo y lo almacena silenciosamente, pero los usuarios no ven alertas.
  * **Presente (Experimental):** Las alertas son completamente visibles en la interfaz de usuario (colores, alertas críticas y dashboard activo).

### Variables Dependientes (VD)
1. **Tasa de Retraso de Tareas ($R_{delay}$):**
   $$R_{delay} = \frac{N_{delayed}}{N_{total}} \times 100\%$$
   *Donde $N_{delayed}$ es el número de tareas cuyo fin es mayor a la fecha de vencimiento.*
2. **Horas de Retraso Promedio ($H_{delay}$):**
   $$H_{delay} = \max(0, T_{completed} - T_{due\_date})$$
   *Medido en horas de desviación temporal.*

### Variables de Control (Covariables)
* Prioridad original de la tarea (Bajo, Medio, Alto, Urgente).
* Complejidad (número de subtareas en la checklist).
* Carga de trabajo del empleado asignado.

---

## 3. Matriz Heurística del Smart Risk Engine

Dado que en la primera versión no se utilizará Machine Learning, se implementará un motor heurístico de lógica determinista. El **Risk Score ($RS$)** se calculará de 0 a 100 mediante la siguiente fórmula:

$$RS = w_t \cdot RS_{time} + w_c \cdot RS_{checklist} + RS_{state\_modifier}$$

Donde los pesos son $w_t = 0.60$ y $w_c = 0.40$.

### Componente Temporal ($RS_{time}$)
Calcula el riesgo según la proximidad de la fecha límite ($T_{remaining} = T_{due\_date} - T_{current}$):

| Tiempo Restante ($T_{remaining}$) | Score Temporal ($RS_{time}$) |
|-----------------------------------|------------------------------|
| $T_{remaining} \le 0$ (Vencida) | 100 |
| $0 < T_{remaining} \le 24$ horas | 100 |
| $24 < T_{remaining} \le 72$ horas | 70 |
| $72 < T_{remaining} \le 168$ horas (1 semana) | 40 |
| $T_{remaining} > 168$ horas | 10 |

### Componente de Checklist ($RS_{checklist}$)
Compara la proporción del tiempo transcurrido de la tarea ($Time\%$) frente al avance real de la checklist ($Checklist\%$):

* $$Time\% = \frac{T_{current} - T_{created}}{T_{due\_date} - T_{created}}$$
* $$Checklist\% = \frac{\text{Subtareas Completadas}}{\text{Subtareas Totales}}$$
* Si $Time\% > Checklist\%$ (Desviación / Retraso en avance):
  $$RS_{checklist} = (Time\% - Checklist\%) \times 100$$
* Si $Time\% \le Checklist\%$ (Avance a tiempo o adelantado):
  $$RS_{checklist} = 0$$

### Modificadores por Estado ($RS_{state\_modifier}$)
Se aplican ajustes según el estado operativo de la tarea:
* **Estado = Blocked (Bloqueado):** $+20$ puntos al score total.
* **Estado = In Review (En Revisión):** $-10$ puntos al score total.
* **Estado = Pending (Pendiente) y $Time\% > 0.5$ (sin iniciar a mitad de plazo):** $+15$ puntos al score total.
* **Estado = Done (Terminado):** Fuerza el $RS = 0$.

### Rangos de Severidad ($Risk Level$)
El score final se mapea a los niveles de criticidad:

* **Bajo:** $RS < 30$ (Visual: Verde)
* **Medio:** $30 \le RS < 60$ (Visual: Amarillo)
* **Alto:** $60 \le RS < 80$ (Visual: Naranja)
* **Crítico:** $RS \ge 80$ (Visual: Rojo)

---

## 4. Instrumentación Técnica en PostgreSQL

Para la recolección empírica, crearemos una tabla de telemetría en PostgreSQL. Esto aísla los datos del experimento y evita degradar el rendimiento de la tabla de producción de tareas.

### Tabla: `task_risk_telemetry`

```sql
CREATE TABLE task_risk_telemetry (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    priority VARCHAR(20) NOT NULL,
    risk_score INTEGER NOT NULL DEFAULT 0,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'Bajo',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    delay_hours DOUBLE PRECISION DEFAULT 0.0,
    alert_generated BOOLEAN NOT NULL DEFAULT FALSE,
    alert_date TIMESTAMP WITH TIME ZONE,
    
    -- Indica si la alerta fue mostrada al usuario final (Grupo Experimental) o no (Línea Base)
    experimental_group_active BOOLEAN NOT NULL DEFAULT FALSE
);

-- Índices para optimización de consultas estadísticas
CREATE INDEX idx_telemetry_project ON task_risk_telemetry(project_id);
CREATE INDEX idx_telemetry_group ON task_risk_telemetry(experimental_group_active);
CREATE INDEX idx_telemetry_delay ON task_risk_telemetry(delay_hours) WHERE delay_hours > 0;
```

---

## 5. Plan de Validación Estadística

Al finalizar el periodo de recolección de datos (Sprint 4), se procederá a contrastar la hipótesis usando los siguientes análisis:

1. **Comparación de Proporciones (Tasa de Retraso):**
   Se comparará la proporción de tareas retrasadas en el Grupo de Control ($p_c$) y el Grupo Experimental ($p_e$) mediante una prueba de hipótesis de dos proporciones (Z-test):
   $$Z = \frac{\hat{p}_c - \hat{p}_e}{\sqrt{\hat{p}(1-\hat{p})(\frac{1}{n_c} + \frac{1}{n_e})}}$$
   *Se buscará un nivel de significancia estadístico $\alpha = 0.05$ (confianza del 95%) para rechazar la hipótesis nula.*

2. **Cálculo del Porcentaje de Reducción Efectiva:**
   Para validar la meta del 25% de reducción:
   $$\Delta\% = \frac{R_{delay\_control} - R_{delay\_experimental}}{R_{delay\_control}} \times 100\%$$
   *La hipótesis se considera validada si $\Delta\% \ge 25\%$ con significancia estadística.*
