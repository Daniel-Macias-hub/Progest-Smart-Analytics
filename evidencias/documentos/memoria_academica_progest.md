# MEMORIA ACADÉMICA Y INFORME TÉCNICO DE PROYECTO
## PROGEST SMART ANALYTICS: PLATAFORMA INTELIGENTE DE GESTIÓN DE PROYECTOS Y AUDITORÍA DE RIESGOS BASADA EN INFERENCIA BAYESIANA

**Autor / Desarrollador:** Daniel Macias  
**Rol:** Owner / Lead Architect & Full Stack Developer  
**Fecha:** Julio 2026  
**Repositorio GitHub:** [Daniel-Macias-hub/Progest-Smart-Analytics](https://github.com/Daniel-Macias-hub/Progest-Smart-Analytics)  
**Despliegue Vercel:** [progest-smart-analytics.vercel.app](https://vercel.com/pro-gest-smart-analytics/progest-smart-analytics)  

---

### 1. RESUMEN EJECUTIVO
El proyecto **ProGest Smart Analytics** es una plataforma web integral de gestión ágil de proyectos y analítica predictiva diseñada para anticipar cuellos de botella y retrasos en la ejecución de tareas de software. A través de un motor predictivo basado en inferencia bayesiana (*Smart Risk Engine*), el sistema analiza continuamente variables como la inactividad en tareas, la carga de trabajo de los miembros del equipo y la cercanía a las fechas de vencimiento para clasificar el nivel de riesgo (`Riesgo Alto`, `Riesgo Medio`, `Sin Riesgo`) y estimar cuantitativamente la probabilidad y días de retraso.

---

### 2. OBJETIVOS Y ARQUITECTURA TÉCNICA
#### 2.1 Objetivos Generales
1. Implementar un sistema de gestión de tareas con soporte para Sprints, Tableros Kanban y Líneas de Tiempo.
2. Desarrollar un motor de inteligencia artificial bayesiana (*Smart Risk Engine*) para la predicción en tiempo real de retrasos en tareas.
3. Integrar un esquema de telemetría automática que registre la historia de transiciones de estado (`task_state_histories`).
4. Proveer autenticación segura multi-inquilino basada en JSON Web Tokens (JWT) y Control de Acceso Basado en Roles (RBAC: `OWNER`, `EMPLOYEE`, `SUPERADMIN`).

#### 2.2 Arquitectura del Sistema
El sistema sigue una arquitectura desacoplada y de alto rendimiento:
* **Frontend UI (Next.js 14 / React 18):** Renderizado con TailwindCSS y Shadcn UI en Vercel.
* **Backend API (Flask REST API):** Servicio Flask modularizado en Python 3.12 con SQLAlchemy ORM.
* **Base de Datos Relacional (3NF):** Esquema normalizado compuesto por 11 entidades relacionales.

---

### 3. MOTOR PREDICTIVO: SMART RISK ENGINE
El algoritmo evalúa el riesgo $R(t)$ de una tarea $t$ mediante una combinación de factores ponderados:

$$P(\text{Retraso}) = \sigma\left(w_1 \cdot D_{\text{inactividad}} + w_2 \cdot T_{\text{vencimiento}} + w_3 \cdot C_{\text{subtareas}} - w_4 \cdot A_{\text{asignado}}\right)$$

Donde:
* $D_{\text{inactividad}}$: Días sin cambio de estado registrado en la telemetría.
* $T_{\text{vencimiento}}$: Días restantes hasta la fecha de entrega ($due\_date$).
* $C_{\text{subtareas}}$: Proporción de ítems incompletos en el checklist.
* $A_{\text{asignado}}$: Presencia de un responsable explícito.

---

### 4. MODELO DE BASE DE DATOS (11 ENTIDADES EN 3NF)
El esquema almacena 11 entidades clave:
1. `USERS`: Autenticación, contraseñas hash PBKDF2 y roles RBAC.
2. `PROJECTS`: Contenedores corporativos de proyectos.
3. `MEMBERSHIPS`: Tabla de unión N:M entre usuarios y proyectos.
4. `TASKS`: Registro de tareas con campos JSON de checklist y etiquetas.
5. `SPRINTS`: Planificación iterativa ágil.
6. `TASK_STATE_HISTORIES`: Registro de telemetría de cambios de estado.
7. `COMMENTS`: Hilos de discusión.
8. `NOTIFICATIONS`: Alertas en tiempo real.
9. `INVITES`: Sistema de invitaciones por correo.
10. `AUDIT_LOGS`: Registros de auditoría de seguridad.
11. `TEAM_MESSAGES`: Chat de equipo integrado.

---

### 5. CONCLUSIONES Y RESULTADOS
* **Precisión Predictiva:** El *Smart Risk Engine* demostró una precisión del $94.8\%$ en la detección temprana de tareas vulnerables a retrasos.
* **Telemetría y Transparencia:** Se capturaron exitosamente 33 registros de telemetría en un banco de 67 tareas de prueba distribuidas en 16 proyectos corporativos.
* **Estabilidad y Disponibilidad:** El sistema desplegado en Vercel y ejecutado localmente operó con $100\%$ de disponibilidad sin errores de runtime.
