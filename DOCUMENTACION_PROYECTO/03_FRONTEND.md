# Análisis del Frontend
## ProGest Smart Analytics

Este documento expone las entrañas de la capa de presentación.

### 1. Stack Tecnológico Base
- **Core:** Next.js 16 (App Router) + React 19.
- **Styling:** Tailwind CSS + PostCSS.
- **UI Primitives:** Radix UI (Shadcn UI).
- **Estado Global:** Zustand.
- **Formularios & Validación:** React Hook Form + Zod.
- **Gráficos & 3D:** Recharts, Three.js.
- **Animaciones:** Framer Motion, GSAP, Anime.js.
- **Data Export:** ExcelJS.

### 2. Estructura de Directorios

La carpeta `project-management-frontend` sigue un patrón modular:
- `/app`: Define el enrutamiento y los Layouts. Al usar App Router, las carpetas dictan las URLs (`/app/dashboard`, `/app/tasks`).
- `/components`: Aloja todos los componentes de la vista. Se subdivide en:
  - `/ui`: Componentes puros, tontos (dumb components) reutilizables (Botones, Inputs, Badges). Muchos autogenerados por Shadcn.
  - `/marketing`: Componentes visuales pesados (Shapes 3D, grids interactivos) exclusivos de las landings.
  - `/chat`, `/layout`, etc.: Agrupaciones lógicas de dominio.
- `/lib`: Utilidades, helpers, constantes (`constants.ts`), tipos compartidos y adaptadores de API.
- `/stores`: Definición de los estados globales de Zustand (`authStore.ts`, `uiStore.ts`, `dataStore.ts`).
- `/services`: Clientes asíncronos que envuelven Axios para comunicarse con el Backend (ej. `taskService.ts`).
- `/hooks`: Custom hooks de React genéricos (ej. `use-mobile.ts`, `use-toast.ts`).

### 3. Routing y Layouts
La aplicación está dividida en dos grandes mundos:
1. **Rutas Públicas (Marketing/Landing):** Manejan la cara de venta del software. Renderizan las animaciones 3D, los carruseles (Embla) y efectos GSAP.
2. **Rutas Privadas (`/app/*`):** Envueltas por un `PrivateLayout` (ubicado en `components/layout/private-layout.tsx`). Este layout asegura que el usuario posea un JWT válido almacenado en el `authStore` antes de permitir la visualización. Si el usuario no está autenticado, el guardia lo redirige al login.

### 4. Gestión de Estado Global (Zustand)
Se utiliza Zustand como reemplazo total de Redux o Context.
- `authStore`: Mantiene la sesión actual, el JWT y el perfil del usuario firmado.
- `dataStore`: (Presumiblemente) Cachea información pesada de Proyectos y Sprints para evitar request innecesarios al navegar entre vistas.
- `uiStore`: Controla el estado visual efímero (sidebar abierto/cerrado, modales globales).

Al utilizar Zustand, las mutaciones se hacen de forma directa (`useAuthStore.getState().login(data)`) lo cual permite actualizar el estado incluso fuera del ciclo de vida de React (ej. desde intercepters de Axios).

### 5. Integración con el Backend (Mappers y API)
- El cliente base de la API está en `lib/api.ts`.
- Debido a las diferencias de nomenclatura (Backend en `snake_case` y Frontend en `camelCase`), la carpeta `/lib/mappers.ts` actúa como una capa de traducción bidireccional. Esto previene que la deuda técnica de un lado infecte al otro.

### 6. Componentes Clave de Negocio

#### Dashboard y Gráficas (Recharts)
La ruta de reportes y analíticas (`app/app/reports/page.tsx`) carga vistas gerenciales intensivas usando `recharts` para renderizar el nivel de riesgo global del sprint activo. 

#### Smart Risk Engine en el Frontend
El cálculo del riesgo se realiza en el backend, el frontend es un consumidor "tonto" del resultado. 
El componente más emblemático de esta feature es el `<RiskBadge>` (`components/ui/risk-badge.tsx`). Este componente lee la propiedad `risk_score` y `risk_factors` (calculada por el backend) y dinámicamente asigna colores (Verde = Sano, Ámbar = Peligro, Rojo = Crítico), dibujando íconos de alerta cuando hay exceso de reasignaciones o tiempos muertos prolongados.

#### Tablero Kanban y Listas de Tareas
Las vistas core se nutren del `taskService`. Cuando una tarjeta se mueve en el tablero Kanban (cambio de estado), el frontend realiza un `PUT /api/tasks/{id}`. Como el backend recalcula el riesgo en este instante, la respuesta del backend trae el nuevo score, y el frontend actualiza la UI reactivamente mostrando si este movimiento arruinó la proyección del proyecto.

#### Generación de Reportes (ExcelJS)
Para no saturar el servidor con renderizado de archivos de exportación, el frontend posee un import dinámico (`await import('exceljs')`). Cuando un líder presiona "Exportar", el frontend recolecta la data cruda, la formatea usando ExcelJS en memoria del navegador del cliente y dispara la descarga del `.xlsx`.

### 7. Librerías de Animación
El proyecto posee un fuerte enfoque estético, justificando el peso de estas dependencias:
- **Framer Motion:** Animaciones estructurales, transiciones de página, layout transitions (drag and drop fluido).
- **GSAP & Anime.js:** Empleadas exclusivamente para micro-interacciones muy precisas (morphing de SVGs en logos, loaders complejos, texto que se dibuja).
- **Three.js:** Empleado en el componente de Marketing (`three-d-shape.tsx`) para la rotación 3D de un elemento en el canvas.
