# Evidencia de Validación del Frontend (Estructura y Dependencias)

## Archivos y Carpetas de Configuración Core

- **package.json:** **Presente** (Especifica dependencias estables: Next.js 14.2.5, React 18.3.1).
- **yarn.lock:** **Presente** (Generado tras `yarn install` exitoso en NTFS).
- **package-lock.json:** **Ausente** (Esperado; el ecosistema está configurado y optimizado para Yarn).
- **tsconfig.json:** **Presente** (Configurado para TypeScript).
- **next.config.mjs:** **Presente** (Define la configuración del servidor Next.js).
- **components.json:** **Presente** (Estructura de componentes shadcn/ui).

---

## Verificación Física en `node_modules`

Se comprobó la existencia y disponibilidad de los siguientes módulos clave en disco:

| Dependencia | Ruta en Disco | Estado | Tipo / Uso |
|-------------|---------------|--------|------------|
| **Next.js** | `node_modules/next` | **True** | Framework core |
| **React** | `node_modules/react` | **True** | Librería core |
| **React-DOM**| `node_modules/react-dom`| **True** | Renderizador core |
| **Radix UI**| `node_modules/@radix-ui`| **True** | Primitivas de UI (shadcn) |
| **Zustand** | `node_modules/zustand` | **True** | Gestor de estado local |
| **Tailwind**| `node_modules/tailwindcss`| **True** | Estilos CSS |
| **Recharts**| `node_modules/recharts`| **True** | Gráficas e indicadores |
| **Lucide Icons**| `node_modules/lucide-react`| **True** | Set de iconos vectoriales |
| **Framer Motion**| `node_modules/framer-motion`| **True**| Motor de animaciones |
| **TypeScript**| `node_modules/typescript`| **True**| Compilador de tipado estático |
| **ESLint**  | `node_modules/eslint` | **True** | Analizador de sintaxis y reglas |
| **PostCSS** | `node_modules/postcss` | **True** | Procesador de estilos |

---

## Verificación de Ejecutables (`node_modules/.bin`)

Se verificó el enlazado de scripts de desarrollo:
- `node_modules/.bin/next.cmd` -> **Existe** (Permite correr `yarn dev` y `yarn build`).
- `node_modules/.bin/tsc.cmd` -> **Existe** (Validador de TypeScript).
- `node_modules/.bin/eslint.cmd` -> **Existe** (Linter).
