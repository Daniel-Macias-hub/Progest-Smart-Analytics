# Auditoría Técnica
## ProGest Smart Analytics

Este documento expone los hallazgos tras someter el código a una auditoría estática y dinámica.

### 1. Errores Críticos (Blockers)
- **Resolución Imposible de Dependencias (NPM):** El `package.json` declara `react@19.2.0` (Release Candidate) y `next@16.0.10` (Canary), mientras que todo el ecosistema de componentes UI (Shadcn/Radix-UI, CMDK, Input-OTP) exige dependencias pares `^18.2.0`. Esto provoca un árbol irresoluble (código de error `ELSPROBLEMS`) que impide la ejecución natural de `npm install`.
- **Corrupción de Entorno Local:** A causa de las instalaciones abortadas, la carpeta `node_modules\.bin` no se completó, impidiendo el arranque del frontend local al faltar el ejecutable de `next`. Los archivos bloqueados causan un error de permisos (`EPERM`) al intentar borrar la carpeta.

### 2. Errores Importantes
- **Codificación en Backend Windows:** El backend arranca con `python run.py`, el cual lanza logs con caracteres especiales (✔, ✗). Si la consola de Windows no tiene `PYTHONIOENCODING=utf-8`, la aplicación crashea instantáneamente con `UnicodeEncodeError`.

### 3. Advertencias (Warnings)
- Next.js ha sido configurado en `next.config.mjs` con `ignoreBuildErrors: true` (ESLint) y `ignoreBuildErrors: true` (TypeScript). Esta práctica oculta fallos reales de tipado y permite despliegues engañosos (falsos positivos de estabilidad).

### 4. Código Muerto y Archivos Innecesarios
- Las dependencias `@dimforge/rapier3d-compat` (motor de físicas) están declaradas y presentes en la construcción sin integrarse sustancialmente con el negocio del sistema. Son residuos de los requerimientos de la landing page que engordan absurdamente el bundle de JavaScript.
- En el backend, las clases base o plantillas por defecto creadas durante el scaffolding (si las hubiere) no han sido removidas de los directorios de tests.

### 5. Problemas de Arquitectura
- **Inconsistencia de Tipos Bidireccional:** El backend retorna `snake_case` (ej. `risk_status`), el frontend debe consumirlo y mapearlo. Sin embargo, los diccionarios de estado de la tarea divergen en tipado, lo que requirió la escritura de adaptadores (`mappers.ts`) en el Sprint 2 para evitar errores de renderizado.
- **Lógica de Autenticación Ligada al Estado Visual:** El enrutador condicional (Private Layout) depende de la hidratación de Zustand. Si Zustand no hidrata lo suficientemente rápido desde el local storage en Next.js, los usuarios ven parpadeos (FOUC) o redirigen erróneamente.

### 6. Problemas de Rendimiento y Escalabilidad
- El Smart Risk Engine se calcula de forma síncrona dentro del request HTTP `PUT /api/tasks/{id}`. Si la tabla `TaskStateHistory` llega a tener millones de filas, consultar el historial antes de retornar la respuesta penalizará severamente la latencia del API.

### 7. Problemas Metodológicos y Científicos (Risk Engine)
- **Heurísticas Deterministas:** El peso matemático de las variables del Risk Engine (ej. `+0.15` por sobrecarga) es estático y definido a juicio del desarrollador. Desde el punto de vista científico, estos pesos deberían variar iterativamente usando aprendizaje automático en base al éxito o fracaso real pasado del equipo.
- **Ignorancia de Grafos (DAGs):** El motor no toma en cuenta dependencias bloqueantes (Tarea A bloquea Tarea B). Considera cada tarea en un silo aislado.
