# Plan de Mejora Técnica
## ProGest Smart Analytics

Este documento expone las estrategias técnicas obligatorias que deben adoptarse antes de avanzar al Sprint 3, enfocadas en pagar la deuda técnica acumulada.

### FASE 1: Saneamiento del Entorno (Inmediato)
El objetivo es revivir la capacidad de compilación y ejecución local del frontend.
1. **Purgado de Archivos Bloqueados:** Ejecutar un script agresivo en PowerShell con permisos elevados o a través de un proceso como `rimraf` para destruir permanentemente la carpeta `node_modules` actual, anulando las violaciones de permisos (EPERM).
2. **Downgrade Estratégico:** Editar manualmente el `package.json` para reducir las versiones de `"next": "16.0.10"` a `"14.2.5"` y `"react": "19.2.0"` a `"18.2.0"`.
3. **Instalación Segura:** Reconstruir el lockfile desde cero mediante `npm install`, resolviendo el árbol sin la bandera de `--legacy-peer-deps`.

### FASE 2: Refactorización Arquitectónica de Riesgos (Corto Plazo)
El cálculo sincrónico del riesgo ahogará el rendimiento bajo estrés.
1. **Delegación Asíncrona:** Desacoplar la función `SmartRiskEngineService.update_task_risk_metrics()` de la ruta principal de actualización de tareas. Moverla a un hilo en segundo plano (usando Celery, Redis Queue o `threading` básico nativo de Python).
2. **Sistema de Caché:** Integrar Redis para evitar consultas masivas a `TaskStateHistory` cuando múltiples usuarios carguen el dashboard de reportes de Sprints gigantes.

### FASE 3: Evolución Científica (Mediano Plazo)
El Smart Risk Engine debe transicionar de ser un motor "Determinista" a uno "Probabilístico".
1. **Reemplazo de Reglas Rígidas:** Extraer un CSV masivo de la tabla de telemetría y entrenar un modelo Random Forest o XGBoost con Scikit-Learn.
2. **Microservicio Predictivo:** Mover la lógica de inferencia fuera del monolito Flask hacia un microservicio dedicado de inferencia ML, comunicándose vía gRPC o endpoints REST.

### FASE 4: Saneamiento del Frontend
1. **Remoción de Librerías Muertas:** Eliminar dependencias de peso muerto (`gsap`, `animejs`, `rapier3d-compat`) que no formen parte integral de la plataforma de gestión.
2. **Desacoplamiento del Estado Local:** Asegurarse de que los modales y aperturas de *Sidebars* utilicen estado local de React (`useState`) en vez del store global de Zustand, para liberar la huella de memoria del `uiStore`.
