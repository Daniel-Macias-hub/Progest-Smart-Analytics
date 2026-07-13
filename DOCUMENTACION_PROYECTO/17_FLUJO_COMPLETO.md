# Flujo Transaccional Completo
## ProGest Smart Analytics

Este documento traza un flujo de caso de uso real (el movimiento de una tarjeta en el Kanban) y detalla exactamente qué ocurre en cada capa del sistema. Esto permite a los desarrolladores comprender la end-to-end (E2E) pipeline.

### Escenario: El Project Manager mueve una tarea de "TODO" a "IN_PROGRESS".

#### 1. Capa de Interfaz Gráfica (Next.js / Radix)
- El usuario arrastra el elemento visual (Drag & Drop gestionado por `@dnd-kit/core`).
- El evento `onDragEnd` dispara una mutación en el estado local de la vista.
- El componente invoca al servicio frontend: `taskService.updateTask(taskId, { status: "IN_PROGRESS" })`.

#### 2. Capa de Red y API Client (Axios)
- El interceptor de Axios inyecta silenciosamente el JWT Bearer Token (almacenado en Zustand) en los headers de la petición HTTP.
- Se envía el payload JSON mediante un método `PUT` hacia `/api/tasks/{taskId}`.

#### 3. Capa de Transporte Backend (Flask Route)
- El servidor Gunicorn/Flask recibe el hit en el blueprint `task_routes.py`.
- El decorador `@jwt_required()` intercepta la petición, desencripta el token, valida su firma y extrae el `current_user_id`.
- Se instancia el esquema de entrada (`TaskSchema(partial=True)`) para validar que el string enviado ("IN_PROGRESS") es parte del diccionario aceptado y no inyección de código.

#### 4. Capa de Lógica de Negocio (Task Service)
- La ruta invoca `task_service.update_task_service(...)`.
- El servicio hace una query a Postgres (`Task.query.get(id)`) para cargar el objeto actual.
- **Autorización:** Comprueba la tabla `Membership` para verificar si el usuario tiene permiso en ese `project_id`.

#### 5. Telemetría y Audición (TaskStateHistory)
- Antes de mutar el objeto original, el servicio detecta que el campo `status` es diferente al original (`TODO` != `IN_PROGRESS`).
- Invoca la inyección en telemetría: Crea una instancia de `TaskStateHistory` grabando `from_state="TODO"`, `to_state="IN_PROGRESS"`, `changed_at=now()` y graba la transacción (`db.session.add`).

#### 6. Smart Risk Engine (Heurística)
- Tras mutar la tarea pero antes de responder, se invoca `SmartRiskEngineService.update_task_risk_metrics()`.
- El motor carga la tarea, busca el último historial (acaba de ser inyectado hace milisegundos).
- Evalúa si el usuario asignado tiene exceso de tareas (developer overload).
- Actualiza los campos predictivos en el objeto tarea (`task.delay_probability = 0.25`).
- Se dispara el `db.session.commit()` final, impactando todas las tablas en una sola transacción SQL segura (ACID).

#### 7. Retorno al Frontend y Reactividad
- Flask retorna el objeto Tarea completo serializado como JSON (incluyendo su nuevo `risk_status` y `delay_probability`).
- Axios recibe el HTTP `200`. El store (o estado local del board) se actualiza con el nuevo objeto.
- React desencadena un re-render. El componente `<RiskBadge>` lee que el `delay_probability` ahora es `0.25` y cambia instantáneamente su ícono verde por uno ámbar de precaución.
