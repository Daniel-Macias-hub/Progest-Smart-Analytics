# Configuración de Base de Datos (Supabase)
## ProGest Smart Analytics

Este proyecto utiliza Supabase puramente como un servicio de base de datos relacional (PostgreSQL como Servicio), no utilizando las facilidades de BaaS (Backend as a Service) como Supabase Auth o Supabase Functions.

### 1. ¿Por qué Supabase?
- Provee instancias PostgreSQL de alta disponibilidad y capa gratuita generosa.
- Soporta pooling de conexiones nativo a través de PgBouncer (`Supavisor`), vital para aplicaciones serverless o servicios escalables como Flask en Render.
- Evita el uso de AWS RDS, reduciendo significativamente la sobrecarga de DevOps.

### 2. Cadena de Conexión (Connection String)
Para que SQLAlchemy (el ORM de Flask) se comunique, requiere un DSN (Data Source Name) inyectado mediante la variable `DATABASE_URL` en el archivo `.env`.

**Estructura esperada:**
```
postgresql://<user>:<password>@<host>:5432/<dbname>
```
*(Es importante notar que el driver `psycopg2-binary` usado en Flask requiere el prefijo `postgresql://` o `postgresql+psycopg2://`, mientras que Supabase a veces provee `postgres://`. Si hay errores de dialecto, cambia el protocolo de `postgres` a `postgresql`).*

### 3. Connection Pooling
Dado que el Backend de Render puede escalar a múltiples workers (Gunicorn) y eventualmente el Frontend Vercel (Serverless) podría conectarse a la BD en un futuro lejano para analíticas directas:
- Nunca uses el puerto `5432` directo (Conexión directa).
- Usa siempre el puerto `6543` (Conexión Pooling) ofrecido por Supabase, añadiendo los parámetros `?pgbouncer=true` a la URL, para evitar ahogar el límite de conexiones concurrentes de la base de datos.

### 4. Migraciones CI/CD
Supabase no tiene conocimiento del esquema. Cuando montes el proyecto:
1. Crea un proyecto vacío en Supabase.
2. Extrae las claves y ponlas en tu `.env`.
3. Desde la consola donde viva el Backend, corre las migraciones de Alembic: `flask db upgrade`.
4. Las tablas (incluidas la vital `task_state_history`) se crearán automáticamente. No ejecutes scripts de DDL manuales en el editor SQL de Supabase.
