# Estrategia de Despliegue General (CI/CD)
## ProGest Smart Analytics

Este documento expone la estrategia de infraestructura recomendada para montar el proyecto en entornos de producción (Staging / Prod).

### 1. Desacoplamiento de Servicios
El proyecto es un monorepositorio con dos carpetas raíz funcionales: `project-management-frontend` y `project-management-backend`.
Dado que emplean motores de ejecución enteramente diferentes (Node.js/Next vs Python/Flask), la mejor práctica de DevOps es **desplegar cada carpeta como una entidad aislada en servicios especializados (Serverless y PaaS)**, en lugar de intentar orquestarlos ambos en una única máquina virtual con Docker-Compose (lo cual requeriría mantenimiento de OS e IaaS).

### 2. Stack de Infraestructura Propuesto
- **Frontend (Node.js):** [Vercel](19_VERCEL.md) - Líder absoluto para hosting de Next.js, con soporte nativo de Serverless Functions (para las API routes de exportación si se requiriese) y CDN global.
- **Backend (Python WSGI):** [Render](20_RENDER.md) - Plataforma PaaS ideal para contenedores Python efímeros, facilitando el despliegue automático por hooks de Git sin necesidad de manejar Kubernetes o servidores EC2.
- **Base de Datos (PostgreSQL):** [Supabase](21_SUPABASE.md) - Proveedor de base de datos gestionada (DBaaS) que expone una conexión Postgres tradicional (DSN) totalmente compatible con SQLAlchemy.

### 3. Variables de Entorno y Secretos
Para que este ecosistema se comunique, el pipeline requiere la inyección de los siguientes secretos en los paneles de control de cada proveedor:

**En Render (Backend):**
- `DATABASE_URL`: String de conexión PostgreSQL proveniente de Supabase.
- `JWT_SECRET_KEY`: Llave criptográfica fuerte de 256-bits.
- `FRONTEND_URL`: URL de producción provista por Vercel (necesario para el CORS).

**En Vercel (Frontend):**
- `NEXT_PUBLIC_API_URL`: URL expuesta por Render (Ej. `https://progest-api.onrender.com/api`).

### 4. Ciclo de Vida del CI/CD
1. Desarrollador hace *Merge Pull Request* a la rama `main` o `develop` en GitHub.
2. Vercel detecta cambios en `/project-management-frontend` e inicia la fase de compilación de Next.js. (Nota: Esto fallará actualmente por el conflicto del package.json hasta que se implemente el Plan de Mejora).
3. Render detecta cambios en `/project-management-backend` e instala `requirements.txt`.
4. El backend invoca a Supabase, realizando las migraciones pendientes automáticamente usando un script post-build (`flask db upgrade`).
