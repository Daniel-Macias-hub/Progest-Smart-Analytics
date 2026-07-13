# Análisis de Dependencias
## ProGest Smart Analytics

Este documento clasifica exhaustivamente el ecosistema de paquetes de terceros (NPM y PyPI) sobre el que se asienta el proyecto.

### 1. Backend (Python / PyPI) - `requirements.txt`

El ecosistema Python del backend está sumamente limpio, con versiones fijadas de forma determinista y sin dependencias fantasma.

#### Obligatorias (Core Funcional)
- `Flask==3.0.0`: Framework principal.
- `Flask-CORS==4.0.0`: Permite peticiones desde el `localhost` de Next.js.
- `Flask-JWT-Extended==4.6.0`: Motor criptográfico de sesiones.
- `Flask-SQLAlchemy==3.1.1` & `psycopg2-binary==2.9.11`: ORM y Driver para PostgreSQL.
- `Flask-Migrate==4.0.5`: Manejador de control de versiones de BD.
- `marshmallow==3.20.1`: Deserializador seguro de JSON.
- `python-dotenv==1.0.0`: Lector de `.env`.
- `bcrypt==4.1.2`: Hashing seguro (salting de passwords).
- `python-dateutil==2.8.2`: Parsing avanzado de fechas, usado en el telemetría temporal.

#### Infraestructura / Despliegue
- `gunicorn==22.0.0`: Servidor WSGI de producción (indispensable para montar la app en plataformas como Render).

#### Desarrollo y Pruebas (No utilizadas en Producción)
- `pytest==7.4.3` / `pytest-flask==1.3.0`: Unit testing.
- `black==23.12.1` / `flake8==7.0.0`: Linters y formatters.

---

### 2. Frontend (Node.js / NPM) - `package.json`

El archivo `package.json` del frontend heredado contiene severas discrepancias arquitectónicas que desencadenaron un colapso del sistema (NPM Error: `ELSPROBLEMS`, `UNMET DEPENDENCY`).

#### Dependencias Obligatorias (Críticas pero Rotas)
El problema principal radica en las librerías Core, cuyas versiones son experimentales y provocan incompatibilidades con el ecosistema circundante:
- `next: "16.0.10"` (Versión Canary inestable. **Debe cambiarse a 14.x**).
- `react: "19.2.0"` (Versión Release Candidate. Rompe el ecosistema Radix. **Debe cambiarse a 18.2.0**).
- `react-dom: "19.2.0"` (**Debe cambiarse a 18.2.0**).

#### Dependencias Funcionales Obligatorias (Sanas)
- `zustand`: Manejo de estado.
- `axios`: Cliente HTTP asíncrono.
- `tailwindcss` / `postcss` / `autoprefixer`: Motor CSS utilitario.
- `lucide-react`: Iconografía base.
- `date-fns`: Cálculo de fechas para la UI del sprint.
- `@dnd-kit/core`: Motor base de Drag and Drop para el Kanban.

#### Dependencias Visuales y Analíticas (Pesadas pero necesarias)
Agregadas para satisfacer los requerimientos analíticos del Sprint 2 y los visuales del Marketing:
- `recharts`: Renderizador de gráficas SVG (Pie Charts de riesgo).
- `exceljs` / `file-saver`: Exportación nativa a Excel sin tocar el backend.
- `framer-motion`: Animación de layout fluido.

#### Familia de Componentes UI (Incompatibles con React 19)
Toda la suite de primitives de interfaz `@radix-ui/react-*` (`accordion`, `dialog`, `dropdown-menu`, `popover`, `slot`, `tabs`, `tooltip`) y sus derivados visuales como `cmdk` e `input-otp`. Todas estas exigen en su `peerDependencies` versiones `^16.8 || ^17.0 || ^18.0`. Al detectar `19.2.0`, causan un árbol roto de dependencias.

#### Dependencias Innecesarias / Fantasmas (Para Limpiar)
Añadidas históricamente o en fase experimental y que el código ya no emplea productivamente:
- `gsap` / `animejs`: Se introdujeron para animaciones que ahora cubre parcial o totalmente `framer-motion`. Pueden ser purgables para reducir bundle size.
- `@dimforge/rapier3d-compat` y `@react-three/rapier`: Marcadas por NPM como `extraneous` (motor de físicas 3D innecesario para un gestor de proyectos).
- Librerías FontAwesome mezcladas. El proyecto estandarizó el uso en `lucide-react`, pero en el `package.json` aún figuran `@fortawesome/react-fontawesome` y paquetes core relacionados marcando `UNMET DEPENDENCY`.

### Conclusión de Dependencias
Mientras el backend es sólido y determinista, el `package.json` del frontend se encuentra en un estado crítico heredado del Sprint 1, siendo una mezcla de librerías experimentales del futuro (Next 16, React 19), UI basada en el presente (Radix con React 18) y basura histórica abandonada (Motores 3D y GSAP). Esto bloquea permanentemente la ejecución de `npm install` limpio y los hooks de compilación de Vercel.
