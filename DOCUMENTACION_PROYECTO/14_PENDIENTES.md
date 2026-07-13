# Backlog de Tareas Pendientes
## ProGest Smart Analytics

Lista consolidada de tickets técnicos que deben atacarse basados en la auditoría del proyecto.

### Bloqueantes (Prioridad 0)
- [ ] Ejecutar script de limpieza de entorno en SO Windows para destrabar `EPERM` en `node_modules`.
- [ ] Editar `package.json` para reducir versión de `React` (18.2.0) y `Next.js` (14.2.5).
- [ ] Eliminar lockfiles antiguos y re-ejecutar `npm install` limpio.
- [ ] Confirmar levantamiento de entorno local mediante `npm run dev`.

### Mantenimiento (Prioridad 1)
- [ ] Mapear diccionarios `TaskStatus` de UI (`TODO`, `IN_PROGRESS`) con enums de SQLAlchemy.
- [ ] Depurar `package.json` eliminando `@dimforge/rapier3d-compat` y librerías `gsap` no usadas.
- [ ] En backend: Configurar script pre-arranque que asegure la variable de entorno `PYTHONIOENCODING=utf-8` para evitar cuelgues del servidor.

### Mejoras Arquitectónicas (Prioridad 2)
- [ ] Modificar `risk_engine_service.py` para separar el recálculo en un `Background Task`.
- [ ] Implementar un manejador global de errores en el Axios Client (`api.ts`) para capturar códigos `401 Unauthorized` y forzar logout de Zustand.
- [ ] Retirar del `next.config.mjs` los flags `ignoreBuildErrors: true` y solventar la deuda técnica real de tipado Typescript.
