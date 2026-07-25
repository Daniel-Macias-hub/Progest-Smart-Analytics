# Preguntas Frecuentes (FAQ)
## ProGest Smart Analytics

Documento de inducción rápida (Onboarding) para nuevos ingenieros.

### P: ¿Por qué el backend lanza un `UnicodeEncodeError` cuando lo corro en Windows?
**R:** El archivo `run.py` o los logs internos tienen iconos como "✔". La consola por defecto en Windows no soporta codificación utf-8 global. Para solucionarlo, siempre arranca el servidor así:
```powershell
$env:PYTHONIOENCODING="utf-8"; python run.py
```

### P: Intenté instalar el frontend con `npm install` y se colgó el comando o dio `ELSPROBLEMS`.
**R:** El repositorio original introdujo React 19 y versiones inestables de Next, causando que la librería Radix-UI rechace la instalación. Hasta que no se parchee el `package.json`, la única forma de instalar para pruebas forzosas es usando:
```bash
npm install --legacy-peer-deps
```
*(Nota: Esto dejará el entorno frágil, lo ideal es aplicar el Plan de Mejora).*

### P: ¿Dónde se calculan los gráficos que se ven en el dashboard?
**R:** La vista del frontend (`app/reports/page.tsx`) utiliza la librería `recharts`. Sin embargo, el frontend **NO** calcula matemáticamente los riesgos. Llama al endpoint `/api/sprints/{id}/risks`, recibe el JSON agregado, y simplemente inyecta esos datos a los componentes `<PieChart>`.

### P: ¿Cómo evitan llamadas N+1 al consultar los proyectos y sus tareas?
**R:** En los archivos de SQLAlchemy (ej. `models/project.py`), las relaciones (`db.relationship`) están configuradas o bien con cargas perezosas optimizadas (`lazy='select'`) o haciendo uso del método `.options(joinedload(...))` en los servicios cuando se requiere un grafo de objetos pesado en una sola consulta.

### P: Hice un cambio en `models/task.py`, ¿cómo aplico el cambio en la base de datos?
**R:** No uses comandos SQL manuales. Como usamos Flask-Migrate (Alembic), debes:
1. Activar tu entorno virtual.
2. Ejecutar `flask db migrate -m "Añadida nueva columna"`.
3. Ejecutar `flask db upgrade` para inyectar el DDL en PostgreSQL.
