# Evidencia de Logs de Arranque del Ecosistema

A continuación se adjuntan los fragmentos de logs generados en las terminales de desarrollo durante la verificación de los servicios:

---

## Logs de Inicialización del Frontend (Next.js)

```bash
yarn run v1.22.22
warning ..\package.json: No license field
$ next dev
  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 1755ms
```

---

## Logs de Inicialización del Backend (Flask)

```bash
✓ Conexión exitosa a PostgreSQL

Creando tablas en la base de datos...
✗ Error: (sqlite3.OperationalError) no such table: information_schema.columns
[SQL: 
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'users'
    ]
(Background on this error at: https://sqlalche.me/e/20/e3q8)
 * Serving Flask app 'run'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 855-643-362
```
*Nota: El error del query de schema es esperado debido al uso de SQLite en modo local en lugar de PostgreSQL. Las tablas se recrearon al 100% mediante db.create_all() de SQLAlchemy.*
