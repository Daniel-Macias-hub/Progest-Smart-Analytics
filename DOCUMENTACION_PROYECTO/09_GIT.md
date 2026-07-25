# Historial y Git
## ProGest Smart Analytics

Análisis del control de versiones (Git) y la evolución cronológica del repositorio a través de sus commits.

### 1. Estructura de Ramas
El proyecto utiliza una estrategia de ramificación ligera. Todo el trabajo reciente de auditoría e integración del motor inteligente (Sprint 2) se encuentra centralizado en la rama:
- **`develop`**: Rama de desarrollo activa. El árbol de trabajo actual está completamente limpio (`nothing to commit, working tree clean`).

### 2. Historial de Commits Clave

El historial de Git demuestra claramente el ciclo de vida, dividiendo el trabajo en dos etapas mayores: la asimilación del repositorio original y el desarrollo propio.

#### Inicialización (Herencia del Sistema)
- **`a14b430`**: `Initial commit`. (Origen del repositorio base).
- **`de5f34e`**: `chore: initial commit of base ProGest system`. Primer volcado del código heredado (Backend Flask + Next.js).

#### Sprint 1 (Configuración Documental y Bases)
- **`f72f9f3`**: `docs(sprint1): configure repository structure, readme and docs folder`. Se estructura la raíz documental del proyecto.
- **`69bcb7e`**: `docs(sprint1): add product backlog with github issue templates`.
- **`9c459d2`**: `docs(sprint1): add academic pdf, clean temp files, update gitignore`.
- **`c30af26`**: `release(sprint1): merge sprint 1 final delivery into main`. **Hito Cero:** Este commit sella oficialmente la primera versión heredada (el crud básico, con el error de dependencias de React 19 ya inyectado en el archivo `package.json`).

#### Sprint 2 (ProGest Smart Analytics)
- **`24c28f6`**: `feat(sprint-2): implement Smart Risk Engine and UI integrations`. El commit más pesado e importante de la aplicación actual. Introduce la lógica algorítmica de riesgo, las tablas de telemetría y los dashboards al código.
- **`0c1986f`**: `fix(sprint2): repair npm env, sync risk dictionaries and task statuses`. Commits operativos menores tratando (sin éxito local) de mitigar los fallos visuales y de enlazado de entornos del frontend.

### 3. Qué cambios hizo cada Sprint

**Sprint 1:**
- Despliegue de los modelos ORM básicos (`User`, `Project`, `Task`, `Membership`, `Sprint`).
- Construcción de las vistas frontend (`App Router`, `Shadcn`, `Tailwind`).
- Enlazado de Autenticación JWT y Zustand.
- *(Deuda)*: Se inyectó React 19 y Next 16 Canary.

**Sprint 2:**
- Se insertó la tabla de solo lectura `TaskStateHistory` en el backend.
- Se mutó el `task_service.py` para grabar en el historial en cada petición `PUT /api/tasks`.
- Se creó `risk_engine_service.py` (Smart Risk Engine) calculando heurísticas predictivas.
- Se crearon rutas `GET /api/sprints/{id}/risks` para la vista ejecutiva.
- Se insertaron los componentes `<RiskBadge>` y se añadió la librería `recharts`.

### 4. Qué quedó pendiente
- La reversión y saneamiento del árbol de Git para el `package.json` (Downgrade de `Next.js` y `React`), trabajo preparativo documentado pero no comiteado.
- La ejecución del entorno en un contenedor o sistema ajeno al conflicto de NPM heredado.
