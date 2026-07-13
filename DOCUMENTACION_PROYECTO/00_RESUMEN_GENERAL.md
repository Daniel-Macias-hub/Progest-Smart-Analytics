# Resumen General del Proyecto
## ProGest Smart Analytics

### ¿Qué es este proyecto?
**ProGest Smart Analytics** es una plataforma de software SaaS (Software as a Service) integral y *Full Stack* diseñada para la gestión avanzada de proyectos ágiles. Combina las funcionalidades tradicionales de un gestor de tareas (como tableros Kanban, backlogs y asignación de Sprints) con un componente altamente sofisticado de telemetría y predicción denominado **Smart Risk Engine**.

### ¿Cuál es su propósito?
El propósito fundamental del sistema es ir más allá del simple seguimiento de tareas, proporcionando a los líderes técnicos, project managers y equipos de desarrollo una herramienta capaz de **cuantificar y predecir el riesgo de fracaso o retraso** de una tarea en tiempo real. Esto permite la toma de decisiones proactiva basada en métricas empíricas en lugar de intuiciones.

### ¿Qué problema resuelve?
En la gestión de software convencional, los proyectos fallan frecuentemente debido a problemas invisibles o sistémicos: tareas que se reasignan demasiadas veces, cuellos de botella no detectados en fases de revisión, o dependencias bloqueantes que pasan desapercibidas hasta la fecha de entrega. ProGest Smart Analytics resuelve el problema de la **"ceguera de riesgo"**, identificando patrones de comportamiento anómalos (heurísticas) y alertando al equipo antes de que un sprint colapse.

### ¿Qué diferencia existe entre el sistema original y ProGest Smart Analytics?
El sistema original (`Sistema Gestión de Proyectos`) era un MVP (Minimum Viable Product) y un CRUD tradicional que permitía crear proyectos, asignar usuarios y mover tarjetas en un tablero. 
**ProGest Smart Analytics** transforma ese sistema básico en una plataforma inteligente introduciendo:
1. Recolección de historial de estados (Telemetría de ciclo de vida).
2. Procesamiento de riesgos mediante heurísticas algorítmicas (Smart Risk Engine).
3. Componentes visuales avanzados e indicadores de color/severidad dinámicos.

### ¿Qué partes pertenecen al repositorio original?
- La estructura base del monorepositorio (separación `project-management-frontend` y `project-management-backend`).
- La configuración subyacente del ecosistema (Flask 3.x, PostgreSQL, Next.js 16 Canary, React 19).
- El sistema base de autenticación JWT, usuarios y membresías.
- La suite de componentes primitivos de Interfaz de Usuario (Radix UI / Shadcn UI).

### ¿Qué partes fueron desarrolladas posteriormente?
- El motor algorítmico predictivo (`risk_engine_service.py`).
- El seguimiento histórico de tareas (`TaskStateHistory` model).
- Las API Routes analíticas (`/api/sprints/<id>/risks`).
- Los componentes visuales inteligentes (`RiskBadge`, `Dashboard de Riesgo`).
- El sistema de telemetría que inyecta datos en los endpoints de actualización de tareas.

### ¿Qué características nuevas se agregaron?
1. **Heurísticas de Riesgo:** Detección de "Cuellos de botella", "Exceso de Reasignación", "Dependencias Circulares", etc.
2. **Dashboard Ejecutivo:** Gráficas de distribución de riesgo en tiempo real generadas con `recharts`.
3. **Reportería:** Exportación de analíticas a Excel vía importaciones dinámicas (`exceljs`).
4. **Métricas en vivo:** Decoración de tarjetas Kanban y listas de tareas con badges de riesgo codificados por colores y nivel de severidad.

### ¿Cuál es el estado actual del proyecto?
El desarrollo conceptual y de código fuente está finalizado hasta su segunda fase. Sin embargo, **el proyecto se encuentra actualmente bloqueado a nivel de entorno de ejecución en el frontend**. Un conflicto severo de versiones heredadas en el árbol de dependencias (`React 19` vs dependencias que exigen `React 18`) ha corrompido el sistema de paquetes, impidiendo el arranque local de la interfaz gráfica a menos que se fuerce una resolución de dependencias (*legacy peer deps*). El backend y la base de datos se encuentran sanos.

### ¿Qué Sprint corresponde al estado actual?
El proyecto se encuentra al finalizar el **Sprint 2** ("Implementación de Smart Risk Engine y Telemetría").
