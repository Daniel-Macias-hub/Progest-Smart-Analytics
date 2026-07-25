# Glosario Técnico y de Negocio
## ProGest Smart Analytics

Definiciones de los términos clave utilizados en el desarrollo y en la plataforma.

### Términos de Negocio
- **Smart Risk Engine:** El motor predictivo core de la plataforma. Evalúa heurísticamente si una tarea se va a retrasar.
- **Risk Score / Delay Probability:** Métrica porcentual (0 a 1) que indica qué tan probable es que un entregable falle su fecha límite.
- **Risk Factors:** Arreglo de strings descriptivos ("Due Date Critical", "Developer Overload") que explican en formato legible a un líder por qué el Risk Score es alto.
- **Task State History / Telemetría:** El registro inmutable y cronológico de cada transición o edición crítica que sufre una tarea.
- **Sprint:** Ciclo iterativo de tiempo de un proyecto al que se le atan tareas.
- **Time-in-State:** El tiempo total ininterrumpido que una tarea ha permanecido en una sola columna Kanban.

### Términos Técnicos
- **Zustand:** Librería minimalista de manejo de estado en React. Usada en el proyecto para almacenar la sesión del usuario.
- **Blueprints:** Concepto de Flask para modularizar rutas de una aplicación (equivalente a los Routers de Express).
- **Marshmallow:** Librería de Python para transformar objetos complejos de base de datos a diccionarios JSON nativos (Deserialización/Serialización).
- **Alembic:** Herramienta de migraciones de base de datos que corre en conjunto con SQLAlchemy.
- **CSR (Client-Side Rendering):** Renderización en el navegador. ProGest hace uso intensivo de CSR a través de las directivas `"use client"` en Next.js.
- **Peer Dependency:** Una dependencia en NPM que requiere que el consumidor del paquete instale una versión específica de otra librería. (La causa raíz del bloqueo actual de React 19 vs Radix UI).
