# Guía de Operación Rápida - ProGest Smart Analytics

Esta guía te explica de forma muy simple cómo correr el sistema localmente, cómo desplegarlo a producción y cómo empezar a generar datos reales de uso para recolectar evidencias.

---

## 🚀 PASO 1: Cómo Correr el Sistema Localmente

Debido al bug del sistema de archivos en Windows (FAT32/exFAT), recuerda que el frontend **siempre debe ejecutarse desde la unidad C:**.

### A. Levantar el Backend (Servidor Flask)
1. Abre una terminal de **PowerShell**.
2. Navega a la carpeta del backend en la unidad C::
   ```powershell
   cd "C:\Users\DanielMacias\Progest-Smart-Analytics\project-management-backend"
   ```
3. Activa el entorno virtual e inicia el servidor:
   ```powershell
   $env:PYTHONIOENCODING="utf-8"
   .\venv\Scripts\python.exe run.py
   ```
   *El backend estará listo en `http://127.0.0.1:5000`.*

### B. Levantar el Frontend (Servidor Next.js)
1. Abre una **segunda terminal** de PowerShell.
2. Navega a la carpeta del frontend en la unidad C::
   ```powershell
   cd "C:\Users\DanielMacias\Progest-Smart-Analytics\project-management-frontend"
   ```
3. Inicia el servidor de desarrollo con Yarn:
   ```powershell
   yarn dev
   ```
   *El frontend estará listo en `http://localhost:3000`.*

---

## ☁️ PASO 2: Despliegue en la Nube (Producción)

Para subir el proyecto a producción de forma gratuita y robusta, utilizaremos tres plataformas integradas:

### 1. Base de Datos: PostgreSQL (Supabase o Render)
- **Opción recomendada: Supabase (Gratuito).**
  1. Entra a [supabase.com](https://supabase.com) y crea un proyecto.
  2. Ve a *Project Settings -> Database* y copia la **Connection String** (URI de la base de datos).
  3. Tendrá un formato similar a: `postgresql://postgres:[password]@db.supabase.co:5432/postgres`

### 2. Backend: Flask (Render)
- **Servicio: Render (Web Service Gratuito).**
  1. Entra a [render.com](https://render.com) y conecta tu cuenta de GitHub.
  2. Crea un **New Web Service** y apunta a tu repositorio `Progest-Smart-Analytics`.
  3. Define las configuraciones:
     - **Root Directory:** `project-management-backend`
     - **Runtime:** `Python 3`
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `gunicorn wsgi:app`
  4. En la pestaña **Environment**, agrega las variables de entorno:
     - `DATABASE_URL` = *(Tu connection string de PostgreSQL de Supabase)*
     - `SECRET_KEY` = *(Cualquier cadena segura aleatoria)*
     - `JWT_SECRET_KEY` = *(Cualquier cadena segura aleatoria)*
     - `FRONTEND_URL` = *(La URL de Vercel una vez creada en el paso 3)*

### 3. Frontend: Next.js (Vercel)
- **Servicio: Vercel (Gratuito).**
  1. Entra a [vercel.com](https://vercel.com) y crea un proyecto importando tu repositorio.
  2. Configura los parámetros:
     - **Root Directory:** `project-management-frontend`
     - **Framework Preset:** `Next.js`
  3. En variables de entorno, agrega:
     - `NEXT_PUBLIC_API_URL` = *(La URL que te asigne Render para tu backend, ej: `https://progest-api.onrender.com`)*
  4. Presiona **Deploy**.

---

## 📈 PASO 3: Generación de Datos de Uso Reales (Simulación de Semanas)

Para que el **Smart Risk Engine** proyecte analíticas reales, debemos interactuar con el sistema simulando el ciclo de vida de un proyecto:

1. **Crear la Estructura Base:**
   - Regístrate como **Owner** y crea un Proyecto.
   - Crea un **Sprint** de 14 días.
   - Invita a 1 o 2 correos ficticios como colaboradores.
2. **Cargar el Tablero Kanban:**
   - Crea al menos **10 tareas** con diferentes niveles de prioridad (Alta, Media, Baja).
   - Asígnales fechas de entrega (`due_date`): algunas para mañana, otras para la próxima semana, y deja 2 o 3 **sin fecha**.
3. **Simular el Flujo de Trabajo:**
   - Mueve tareas de `pending` a `in_progress`.
   - Agrega checklists dentro de las tareas críticas. El Risk Engine bajará la probabilidad de retraso si ve checklists con tareas completadas.
4. **Provocar Casos de Riesgo:**
   - Deja pasar la fecha de entrega de una tarea activa para simular un **retraso (`overdue`)**. El Risk Badge se tornará rojo automáticamente.
   - Pasa tareas a `in_review` para que el gestor las valide.

---

## 📸 PASO 4: Recolección de Evidencias

Para armar tu portafolio de evidencias técnica:

1. **Respuestas de la API:**
   - Abre la pestaña de herramientas del desarrollador en el navegador (`F12`), ve a la pestaña **Network (Red)** y observa las respuestas JSON que entrega `/api/tasks` o `/api/tasks/stats`. Toma capturas de los payloads.
2. **Consultas SQL en Vivo:**
   - Puedes abrir la base de datos local `instance/app.db` con cualquier herramienta visual (como **DB Browser for SQLite**) y ejecutar consultas para extraer el histórico de transiciones de telemetría:
     ```sql
     SELECT * FROM task_state_histories;
     ```
3. **Evidencia del Dashboard:**
   - Toma capturas del panel de reportes de ProGest donde se visualizan las gráficas de Recharts con la probabilidad de retraso generada por tus tareas.
