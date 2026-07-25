# Despliegue en Render (Backend)
## ProGest Smart Analytics

Instrucciones específicas para el alojamiento del servidor Python/Flask.

### 1. Por qué Render
Render.com provee "Web Services" nativos para Python. A diferencia de Heroku, sus instancias efímeras levantan directamente basándose en el `requirements.txt` sin configuraciones complejas de buildpacks (o utilizando Docker si se prefiere).

### 2. Configuración del Web Service
1. Conecta tu cuenta de Github en Render y crea un "New Web Service".
2. **Root Directory:** Igual que en Vercel, debes definir explícitamente `project-management-backend`.
3. **Environment:** Selecciona `Python 3`.
4. **Build Command:** 
   ```bash
   pip install -r requirements.txt
   ```
5. **Start Command:** Es vital utilizar Gunicorn en lugar del servidor de desarrollo de Werkzeug (nunca uses `python run.py` en producción).
   ```bash
   gunicorn run:app --workers 4 --bind 0.0.0.0:$PORT
   ```
   *(Nota: `run:app` se refiere al archivo `run.py` y a la variable de instancia de Flask creada en él. El puerto dinámico es inyectado por Render).*

### 3. Tareas en Segundo Plano (Cron Jobs y Celery)
Actualmente, el *Smart Risk Engine* corre síncronamente. Si a futuro (Fase 2 del Plan de Mejora) se extrae a un sistema de colas asíncrono, deberás instanciar en Render un servicio tipo "Background Worker" aparte del Web Service principal, para que consuma las tareas (ej. proceso de Celery).

### 4. Cors y Seguridad
El backend tiene la librería `Flask-CORS`. Debes asegurar inyectar en Render las Environment Variables para que Flask acepte los headers `OPTIONS` preflight provenientes exclusivamente de la URL productiva proporcionada por Vercel, rechazando llamadas desde dominios extraños.
