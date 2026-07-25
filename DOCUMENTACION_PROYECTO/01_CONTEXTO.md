# Contexto Histórico y Desarrollo
## ProGest Smart Analytics

Este documento establece el marco de referencia bajo el cual se desarrolló y se encuentra actualmente el proyecto, rastreando su origen y su evolución a lo largo del ciclo de vida de desarrollo.

### 1. El Origen: Repositorio Base
El proyecto actual es un "fork evolutivo" (una continuación directa sobre la misma base de código) del repositorio original:
`https://github.com/Leonard-ssj/Sistema-Gestion-de-Proyectos`

El repositorio original fue construido como el entregable final del **Sprint 1**. En él, se establecieron los cimientos del sistema:
- **Infraestructura Backend:** Un servidor monolítico en Python usando Flask y SQLAlchemy para la interacción con PostgreSQL.
- **Infraestructura Frontend:** Una aplicación React sobre Next.js (utilizando el App Router) enfocada en la creación de vistas y consumo de APIs de un entorno REST.
- **Autenticación:** Implementación de JSON Web Tokens (JWT) gestionados a través de Zustand y almacenados en LocalStorage/Cookies.
- **Negocio Core:** La capacidad de crear usuarios, agruparlos en proyectos (mediante el modelo `Membership`), estructurar el tiempo en Sprints, y crear/asignar tareas básicas.

### 2. El Problema Base
A pesar de contar con un sistema funcional de gestión, el repositorio original era puramente reactivo y transaccional (un sistema CRUD). Carecía de valor analítico. Las métricas eran inexistentes y no había forma de medir el desempeño o los bloqueos del equipo, lo cual es inaceptable en entornos empresariales de alta madurez ágil.

### 3. La Evolución: ProGest Smart Analytics (Sprint 2)
Para el **Sprint 2**, el alcance técnico y de negocio pivotó drásticamente de "aplicación de gestión" a "aplicación analítica y predictiva", dando nacimiento a **ProGest Smart Analytics**.

Se mantuvo el 100% de la arquitectura fundacional heredada, pero se le inyectó una capa de inteligencia:
- **Telemetría Transaccional:** Se intervino la lógica de actualización de tareas en el backend para generar snapshots (`TaskStateHistory`) cada vez que una tarea cambiaba de estado o de asignado.
- **Evaluación Científica:** Se implementó un motor matemático (`Smart Risk Engine`) para calcular probabilidades de riesgo basadas en heurísticas extraídas del comportamiento de la telemetría.
- **UI Reactiva Avanzada:** Se diseñaron vistas de consumo analítico pesado, obligando al frontend a manejar grandes volúmenes de datos mediante bibliotecas de gráficos especializadas y exportación de datos pesados.

### 4. Ciclo de Vida (Sprints)

#### Sprint 1: Fundaciones CRUD
- **Objetivo:** Establecer la base de datos, el enrutamiento, la seguridad y la interfaz gráfica base.
- **Resultado:** Repositorio original. Completado y funcional a nivel de backend y UI.
- **Deuda Técnica Adquirida:** Configuración de dependencias frontend usando ecosistemas experimentales (Next 16 y React 19).

#### Sprint 2: Smart Risk Engine
- **Objetivo:** Transformar el CRUD en una herramienta predictiva con telemetría en tiempo real y dashboard analítico.
- **Resultado:** Código desarrollado exitosamente y probado. Integración de lógicas complejas de backend y frontend finalizadas.
- **Estado Técnico de Cierre:** Backend funcional. Frontend bloqueado por la explosión de la deuda técnica adquirida en el Sprint 1 (incompatibilidad de dependencias de React 19 con las nuevas librerías gráficas, corrompiendo la carpeta `node_modules`).

### 5. Resumen de Propiedad del Código
- **Heredado del Repo Base:** Estructuras de carpetas, configuraciones de webpack/next, modelos de DB iniciales (`User`, `Project`, `Task`, `Sprint`, `Comment`, `Invite`), configuración de Tailwind, Layouts básicos y Autenticación.
- **Construido en ProGest:** Modelo `TaskStateHistory`, `risk_engine_service.py`, `app/reports/page.tsx`, `components/ui/risk-badge.tsx`, heurísticas, endpoints analíticos de Sprints y modificaciones en los servicios de actualización de tareas para invocar la recolección de telemetría.
