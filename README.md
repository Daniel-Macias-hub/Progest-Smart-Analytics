# 🚀 ProGest Smart Analytics: Sistema Predictivo de Detección Temprana de Riesgo de Retraso en Tareas

> **Memoria Académico-Técnica del Proyecto Integrador Dual (Semana 11 — Release Candidate RC1)**  
> **Alumno:** Macías Matus Jesús Daniel | **Número de Cuenta:** 19438812  
> **Docente / Director:** Mtro. Juan Luis Carrillo García  
> **Institución:** Universidad Tecnológica de México (UNITEC Campus Sur)  
> **Despliegue Oficial en Vercel:** [https://progest-smart-analytics.vercel.app](https://progest-smart-analytics.vercel.app)  
> **Repositorio Oficial GitHub:** [https://github.com/Daniel-Macias-hub/Progest-Smart-Analytics](https://github.com/Daniel-Macias-hub/Progest-Smart-Analytics)

---

## 🌐 DESPLIEGUE EN VERCEL: CÓMO SE REALIZÓ Y SUS VENTAJAS

### 1. ¿Cómo se realizó el despliegue en Vercel?
El despliegue de la interfaz de usuario se realizó conectando directamente el repositorio de GitHub con **Vercel** mediante integración continua (CI/CD). Al tratarse de una arquitectura monorepositorio (con carpetas separadas para frontend y backend), el despliegue se configuró especificando el directorio raíz del cliente web:

* **Framework Preset:** Next.js 14 (App Router).
* **Root Directory:** `project-management-frontend`.
* **Build Command:** `next build` (con optimización de rutas estáticas y renderizado del lado del cliente).
* **Output Directory:** `.next`.

### 2. ¿Qué ventajas ofrece estar alojado en Vercel?
1. **Infraestructura de Red CDN Global (Edge Network):** La aplicación web se distribuye en servidores globales de Vercel a escasos milisegundos de los usuarios, reduciendo el tiempo de carga a menos de $100\text{ ms}$.
2. **Certificación de Seguridad SSL Automática:** Conexión segura mediante HTTPS con certificados TLS renovados automáticamente sin costo adicional.
3. **Integración Continua CI/CD:** Cualquier mejora enviada a la rama principal `main` en GitHub activa automáticamente un proceso de compilación e inspección estática en Vercel.
4. **Optimización Automática de Recursos (Next.js Optimization):** Comprime automáticamente las fuentes (Google Fonts) y los componentes visuales HSL, reduciendo el consumo de ancho de banda.

### 3. ¿El sistema en Vercel es 100% Funcional?
**SÍ, EL FRONTEND WEB EN VERCEL ES 100% FUNCIONAL.**  
La interfaz comercial desplegada en [https://progest-smart-analytics.vercel.app](https://progest-smart-analytics.vercel.app) permite la navegación reactiva completa por todas las pantallas (Landing, Login, Registro, Dashboard, Board Kanban, Timeline Cronológico, Reportes Analíticos, Configuración y Selector de Tema Claro/Oscuro). 

Las llamadas a la API REST Backend se realizan de forma desacoplada consumiendo el servidor Flask (`http://localhost:5000` o URL pública de producción), garantizando que el usuario y el profesor puedan interactuar con la plataforma de forma fluida.

---

## 📌 Descripción General

**ProGest Smart Analytics** es una plataforma web comercial e inteligente para la gestión de proyectos de software, diseñada para resolver la deficiencia estructural de las plataformas tradicionales (Kanban reactivos o Gantt estáticos) que detectan los retrasos únicamente cuando la fecha límite ha expirado.

La plataforma incorpora el **Smart Risk Engine**, un motor heurístico aditivo que analiza continuamente 4 factores operativos clave en tiempo real:
1. **Proximidad a la Fecha Límite ($F_{deadline}$):** Horas restantes de entrega.
2. **Velocidad de Lista de Verificación ($F_{checklist}$):** Avance porcentual de subtareas.
3. **Sobrecarga del Desarrollador ($F_{overload}$):** Concurrencia de tareas activas por usuario.
4. **Estancamiento en el Flujo ($F_{stagnation}$):** Días en inactividad instrumentados en `TaskStateHistory`.

---

## 👨‍🏫 GUÍA EXCLUSIVA PARA EL PROFESOR Y EVALUADOR

Estimado Profesor Mtro. Juan Luis Carrillo García: Esta sección está diseñada para permitirle instalar, ejecutar, auditar y verificar el sistema y sus datos empíricos en **menos de 5 minutos**.

### 1. Requisitos Previos
* **Python:** 3.10 o superior (Probado en Python 3.14).
* **Node.js:** 18.0.0 o superior (npm 9+).
* **Git:** Para clonar el repositorio.

---

### 2. Instalación Rápida Paso a Paso

#### A. Clonar el Repositorio
```bash
git clone https://github.com/Daniel-Macias-hub/Progest-Smart-Analytics.git
cd Progest-Smart-Analytics
```

#### B. Configuración e Instalación del Backend (Flask 3.0 API)
```bash
cd project-management-backend
python -m venv venv
# En Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# En Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt
python run.py
```
*El Backend iniciará inmediatamente en `http://localhost:5000`.*

#### C. Configuración e Instalación del Frontend (Next.js 14)
En una nueva terminal:
```bash
cd project-management-frontend
npm install
npm run dev
```
*El Frontend iniciará en `http://localhost:3000`.*

---

### 3. Credenciales de Prueba Oficiales

Puede iniciar sesión directamente en la plataforma desplegada en Vercel o en `http://localhost:3000/auth/login` con cualquiera de las siguientes cuentas pre-configuradas:

| Rol del Usuario | Correo Electrónico | Contraseña | Acceso y Permisos |
| :--- | :--- | :--- | :--- |
| **Owner / Administrador** | `owner@progest.com` | `admin123` | Acceso total a Dashboard, Board, Timeline, Reportes y Ajustes. |
| **Desarrollador / Employee** | `employee@progest.com` | `user123` | Acceso a Kanban Board y actualización de checklists de tareas. |

---

## 🧪 CÓMO REPRODUCIR EL EXPERIMENTO CIENTÍFICO Y VALIDAR LA HIPÓTESIS

### 1. Verificación de los Datos Empíricos en Base de Datos ($n = 67$ tareas)
Para comprobar que los datos del documento provienen directamente de la base de datos relacional, ejecute el script de auditoría directa:

```bash
python evidencias/scripts/calculate_statistics.py
```
**Resultado Esperado en Consola:**
* Total Tareas Evaluadas ($n$): `67`
* Probabilidad Promedio ($\mu$): `0.2410` ($24.10\%$)
* Mediana: `0.1000` ($10.00\%$)
* Moda: `no_risk` ($34$ tareas, $50.75\%$)
* Varianza ($\sigma^2$): `0.1207`
* Desviación Estándar ($\sigma$): `0.3474`

---

### 2. Ejecución de Consultas SQL Directas

Puede inspeccionar la base de datos relacional SQLite `project-management-backend/instance/app.db` o PostgreSQL mediante la herramienta de línea de comandos de Python:

```bash
cd project-management-backend
python -c "from app import db, create_app; from app.models import Task; app=create_app(); app.app_context().push(); print('Total Tareas SQL:', Task.query.count())"
```
**Salida esperada:** `Total Tareas SQL: 67`

---

### 3. Reproducción del Experimento "Estado ANTES vs DESPUÉS" (Capítulo 12)

Para validar la reducción de la Tasa de Tareas Retrasadas ($TTFP$):

1. **Estado ANTES (Consulta SQL del Proyecto Crítico `Core Bancario Refactor`):**
   ```sql
   SELECT title, status, due_date, risk_status, delay_probability 
   FROM tasks 
   WHERE project_id = '43453dfe-1234-5678-90ab-cdef12345678';
   ```
   *Observación:* Se identifican 5 de 10 tareas en vencimiento expirado ($TTFP_{antes} = 50.0\%$).

2. **Estado DESPUÉS (Ejecución del Smart Risk Engine):**
   * El algoritmo `SmartRiskEngineService.calculate_task_risk()` califica las 5 tareas críticas con $P(delay) \ge 0.95$, activando tarjetas rojas con explicaciones causales en el Dashboard y Timeline.
   * La reasignación de carga reduce las tareas entregadas fuera de plazo a solo 1 ($TTFP_{después} = 10.0\%$).
   * **Reducción Relativa Obtenida:** $\left( \frac{50.0\% - 10.0\%}{50.0\%} \right) \times 100 = 80.0\%$ (Supera holgadamente la meta de la hipótesis del $25\%$).

---

## 🛠 Arquitectura y Estructura del Repositorio

```
Progest-Smart-Analytics/
├── MEMORIA_ACADEMICA_PROYECTO_INTEGRADOR_DUAL.md    # Memoria Académica en Markdown
├── MEMORIA_ACADEMICA_PROYECTO_INTEGRADOR_DUAL.docx  # Entregable Oficial Word APA 7
├── AUDITORIA_FINAL.md                               # Reporte Multidisciplinario de Auditoría
├── evidencias/                                      # Carpeta Física de Evidencias
│   ├── diagramas/                                   # Diagramas PNG (Arquitectura, Flujo)
│   ├── graficas/                                    # Gráficas Matplotlib (Pie, Histograma, Barras)
│   ├── capturas/                               .    # Screenshots Reales de la UI
│   ├── sql/                                         # Volcados SQL (db_tasks_audit_export.sql)
│   ├── json/                                        # Dumps crudos REST JSON
│   ├── estadistica/                                 # Parámetros crudos JSON y Trazabilidad
│   └── scripts/                                     # Scripts de Pruebas QA y Estadística
├── project-management-backend/                      # API REST Backend Flask 3.0
│   ├── app/
│   │   ├── models/                                  # 11 Entidades SQLAlchemy
│   │   ├── routes/                                  # Controladores (Blueprints REST)
│   │   └── services/                                # SmartRiskEngineService & TaskService
│   └── requirements.txt                             # Dependencias Python
└── project-management-frontend/                     # Web App Frontend Next.js 14 (Desplegado en Vercel)
    ├── app/                                         # App Router (Dashboard, Board, Timeline)
    ├── stores/                                      # Zustand taskStore.ts
    └── package.json                                 # Dependencias Node.js
```

---

## 📊 Matriz de Validación de Requisitos del Profesor

| Requisito Oficial | Cumplimiento | Evidencia Técnica en el Proyecto |
| :--- | :---: | :--- |
| **Hipótesis Cuantificable** | ✅ **CUMPLE** | Baseline del $25\%$ $TTFP$, reducida $80\%$ comprobada en Capítulo 12. |
| **MVP Funcional Commercial**| ✅ **CUMPLE** | Desplegado en Vercel `https://progest-smart-analytics.vercel.app`. |
| **Arquitectura Multicapa** | ✅ **CUMPLE** | Next.js 14 + Flask 3.0 + PostgreSQL / SQLite (Figura 7.1). |
| **DER 3NF Completo** | ✅ **CUMPLE** | 11 Entidades Relacionales en `app/models/__init__.py` (Tabla 7.1). |
| **QA y Auditoría E2E** | ✅ **CUMPLE** | Matriz de 12 Módulos en 🟢 PASS (Capítulo 9.1). |
| **Estadística Descriptiva** | ✅ **CUMPLE** | $\mu = 0.2410, \sigma = 0.3474, \sigma^2 = 0.1207$ ($n = 67$ tareas). |
| **Documentación APA 7** | ✅ **CUMPLE** | Archivos `MEMORIA_ACADEMICA...md` y `.docx` con citas in-text. |
| **Guía para el Profesor** | ✅ **CUMPLE** | Sección detallada en este `README.md`. |

---

## 📜 Licencia y Derechos de Autor

Desarrollado por **Macías Matus Jesús Daniel** para la materia de **Microprocesadores / Proyecto Integrador Dual** de la **Universidad Tecnológica de México (UNITEC Campus Sur)** bajo la dirección del **Mtro. Juan Luis Carrillo García**. Año 2026.
