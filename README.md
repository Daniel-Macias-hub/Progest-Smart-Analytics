# ProGest Smart Analytics

**"Análisis Inteligente ProGest: Sistema Inteligente de Detección Temprana de Riesgo de Retraso en Tareas para la Gestión de Proyectos"**

*Proyecto Integrador Dual - Ingeniería en Sistemas Computacionales (Sprint 1)*

---

## Contexto Académico

Este proyecto corresponde a la extensión inteligente del sistema de gestión de proyectos ProGest, desarrollado bajo la metodología de **Proyecto Integrador Dual** y evaluado bajo dos dimensiones críticas:

### 1. Dimensión Científica (THE SCIENCE)
* **El Problema:** Los líderes de proyecto identifican demasiado tarde las tareas que terminarán retrasadas, impidiendo tomar acciones correctivas a tiempo y afectando la tasa de cumplimiento del equipo.
* **La Hipótesis:** 
  > *"La implementación de un módulo de detección temprana de riesgo reducirá en al menos un 25% la cantidad de tareas entregadas fuera de plazo en comparación con la gestión tradicional sin alertas automáticas."*
* **El MVP Propuesto:** Para validar esta hipótesis, se desarrollará un módulo llamado **Smart Risk Engine** (motor heurístico basado en reglas de negocio), un **Dashboard Analítico** en tiempo real, **Alertas visuales de riesgo**, un esquema de **Instrumentación y Métricas** de telemetría operativa en base de datos, y herramientas de **Exportación de Resultados**.

### 2. Dimensión Técnica (THE JOB)
* **Arquitectura Base:** Monorepo con desacoplamiento entre Backend (API REST en Flask) y Frontend (Web App en Next.js), con PostgreSQL como base de datos central.
* **Estado Tecnológico Heredado (Sistema Base ProGest):**
  * **Frontend:** Next.js, React, Tailwind CSS, Zustand.
  * **Backend:** Flask, SQLAlchemy ORM, Flask-JWT-Extended (operativos para el sistema de gestión base).
  * **Base de Datos:** PostgreSQL (esquema transaccional previo de usuarios, roles, proyectos, tareas y auditorías).
  * **Testing:** Pruebas E2E implementadas en Playwright y colección de endpoints en Postman.

---

## Estructura del Repositorio

La organización del repositorio está diseñada para soportar de manera aislada el código base y la documentación del proyecto integrador:

```text
Progest-Smart-Analytics/
├── docs/                            # Documentación de entregas de Sprint
│   └── sprint-1/                    # Documento académico PDF y evidencias de Sprint 1
├── project-management-backend/      # Backend base en Flask (Python)
├── project-management-frontend/     # Frontend base en Next.js (TypeScript)
├── playwright-tests/                # Pruebas automatizadas de integración E2E
├── postman/                         # Colección de pruebas de la API REST
└── .trae/                           # Carpeta central de documentación técnica del proyecto
```

---

## Estrategia de Git

El control de versiones se gestiona mediante una adaptación del flujo de trabajo Git Flow para mantener la trazabilidad de los entregables académicos:

### 1. Modelo de Ramas
* **`main`:** Contiene la versión de entrega estable aprobada al cierre de cada Sprint (actualmente sincronizada para la entrega de Sprint 1).
* **`develop`:** Rama de integración de características de desarrollo activo.
* **`feature/`:** Ramas temporales para el desarrollo de tareas individuales del backlog (ej. `feature/sprint-1-setup`).

### 2. Convención de Commits (Conventional Commits)
Se requiere que cada cambio en el historial aplique el siguiente formato:
`tipo(alcance): descripción breve en minúsculas`
* `feat`: Nuevas características del motor.
* `fix`: Correcciones de errores del sistema.
* `docs`: Cambios en archivos de documentación y planeación.
* `chore`: Tareas de mantenimiento y configuración general del monorepo.

---

## Estado Actual del Proyecto (Cierre del Sprint 1)

En el presente Sprint 1, el proyecto ha concluido la fase de **planeación de gestión y diseño de investigación científica**. El estado actual reporta los siguientes avances:
* **Estructura del Monorepo:** Repositorio oficial de GitHub configurado y sincronizado localmente con una historia de Git limpia y enlazada.
* **Planificación Ágil:** Definición conceptual del Product Backlog completo y estructuración de las tareas técnicas para el desarrollo del MVP.
* **Marco Científico:** Definición preliminar de la hipótesis de investigación, variables independientes y dependientes, métricas de rendimiento y diseño preliminar del experimento.
* **Código de Software:** Se mantiene intacta la base de código heredada de **ProGest**, sirviendo como punto de partida estable para la construcción del nuevo motor a partir del Sprint 2.
