# Análisis del Backend
## ProGest Smart Analytics

Este documento detalla la estructura y el funcionamiento del cerebro de la aplicación.

### 1. Stack Tecnológico Base
- **Core:** Python 3.1x.
- **Framework:** Flask 3.
- **ORM & Base de Datos:** SQLAlchemy + Flask-Migrate (Alembic) + PostgreSQL.
- **Autenticación:** Flask-JWT-Extended.
- **Serialización/Validación:** Marshmallow (a través de schemas).
- **CORS:** Flask-CORS.
- **Entorno:** python-dotenv.

### 2. Arquitectura de Directorios

El backend (`project-management-backend/app`) está orquestado bajo el patrón **Controller-Service-Model**:

- `/app/models/`: Clases de SQLAlchemy que mapean exactamente las tablas de PostgreSQL (`User`, `Project`, `Task`, `TaskStateHistory`, etc.). No contienen lógica de negocio.
- `/app/schemas/`: Clases de Marshmallow. Actúan como el "contrato" de la API. Convierten los objetos SQLAlchemy a diccionarios JSON serializables, ocultando campos sensibles (ej. contraseñas) y validando datos de entrada (`load/dump`).
- `/app/routes/`: Los "Controladores" (Blueprints de Flask). Agrupan endpoints lógicamente (`task_routes.py`, `auth_routes.py`). Su única responsabilidad es recibir HTTP, invocar al servicio y retornar HTTP.
- `/app/services/`: El verdadero corazón del backend. Contiene toda la **Lógica de Negocio**. Aquí es donde ocurren las reglas condicionales, los recálculos del Risk Engine y las inyecciones de base de datos.
- `/app/utils/`: Funciones transversales de ayuda, instrumentación, formateadores o lógicas de logging.
- `run.py`: Punto de entrada de la aplicación, donde se inicializa la app de Flask (`create_app()`), se configuran los middlewares y se arranca el servidor WSGI de desarrollo.

### 3. Flujo de Solicitud Típico (Request Lifecycle)

1. El Cliente envía una petición HTTP `POST /api/tasks`.
2. El Middleware de Flask (CORS) evalúa los headers.
3. El Decorador `@jwt_required()` verifica la validez del token en los headers (Autenticación).
4. El Blueprint en `routes/task_routes.py` captura el payload.
5. El Payload se pasa al esquema `TaskSchema` para validarlo (Validación).
6. El Blueprint llama a `task_service.create_task(data)`.
7. `task_service` verifica si el usuario tiene permisos en ese proyecto (Autorización / Permisos).
8. Se ejecuta un `db.session.add(new_task)` y un `db.session.commit()`.
9. Se llama al recolector de telemetría para registrar la creación.
10. El blueprint retorna `schema.dump(task)` con un código HTTP `201`.

### 4. Servicios Principales (Capa de Negocio)

#### Auth Service & Permisos
- Gestiona el registro (hash de contraseñas con Werkzeug) y login (emisión de tokens JWT con claims personalizados del user ID).
- La validación de permisos es granular: no se puede alterar un Proyecto o Tarea si el `user_id` no está listado en la tabla `Membership` con el rol adecuado.

#### Project & Sprint Service
- Mantiene la relación One-to-Many entre proyectos y ciclos de tiempo (Sprints).
- Gestiona la asignación masiva y el cálculo de fechas de los Sprints.

#### Task Service (El núcleo transaccional)
El servicio de tareas sufrió una profunda mutación en el Sprint 2 para acomodar el comportamiento predictivo.
- **Mutación Intervenida:** Cualquier actualización en una tarea (especialmente cambios en el campo `status` o `assigned_to`) intercepta el flujo estándar.
- En lugar de simplemente hacer un UPDATE en la tabla, el servicio primero graba el estado anterior y el nuevo estado insertando un registro inmutable en la tabla de **Telemetría** (`TaskStateHistory`), dejando un sello de tiempo exacto.

#### Smart Risk Engine (Servicio Predictivo)
Ubicado en `risk_engine_service.py`, este es el diferenciador principal del producto (Fase analizada a profundidad en su propio documento).
- Se dispara automáticamente como un hook o post-procesador después de cada mutación importante en `task_service`.
- Analiza la metadata recopilada en `TaskStateHistory` de forma asíncrona o sincrónica rápida, alterando los campos `risk_score` y `risk_factors` del modelo `Task`.

### 5. Base de Datos y Migraciones
- Se utiliza `Flask-Migrate`. Cada vez que un modelo en `/models` cambia, se ejecuta `flask db migrate` para generar el script de Alembic en la carpeta `migrations/versions`, asegurando un historial de versiones seguro y desplegable de la estructura SQL.
- A nivel ORM, el backend emplea `lazy='joined'` o `lazy='select'` estratégicamente para evitar problemas de N+1 queries al cargar relaciones pesadas (ej. un proyecto que debe retornar todas sus tareas y usuarios miembros).

### 6. Logs e Instrumentación
- El servidor hace uso del módulo `logging` estándar de Python (configurado para salir en la consola local).
- Existen logs críticos de inicialización en `run.py` (los cuales históricamente causaron el `UnicodeEncodeError` en Windows debido a caracteres ✔ y ✗, evidenciando que el entorno de desarrollo carece de validación para `cp1252`).
