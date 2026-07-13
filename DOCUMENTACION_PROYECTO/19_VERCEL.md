# Despliegue en Vercel (Frontend)
## ProGest Smart Analytics

Instrucciones específicas para el despliegue de la interfaz de usuario.

### 1. Pre-requisitos de Compilación (CRÍTICO)
No intentes desplegar en Vercel el estado actual de la rama heredada. Vercel fallará rotundamente durante el log de `Running build command` debido al conflicto de resoluciones (`React 19` vs `Radix-UI`).
**Obligatorio antes de desplegar:** Purgar el `package.json`, reducir las versiones a `React 18.2.0` y `Next 14.2.5` y pushear a Github. No utilices flags de `--legacy-peer-deps` en Vercel.

### 2. Configuración del Proyecto en Vercel
1. Importa el repositorio desde GitHub.
2. **Root Directory:** Es imperativo editar este campo. Defínelo como `project-management-frontend`. Si lo dejas en blanco, Vercel buscará el archivo `package.json` en la raíz del monorepositorio y fallará.
3. **Framework Preset:** Vercel auto-detectará "Next.js". Déjalo por defecto.
4. **Build Command:** Déjalo por defecto (`next build`).
5. **Output Directory:** Déjalo por defecto (`.next`).

### 3. Ajustes de Rendimiento y Edge Caching
- **Imágenes:** Next.js optimiza imágenes al vuelo. Asegúrate de que las URLs externas (si se permite a los usuarios cargar avatars de sitios de terceros) estén registradas en el `remotePatterns` del archivo `next.config.mjs` para evitar rechazos de seguridad del CDN de Vercel.
- **Exportación en Excel:** El componente `exceljs` es extremadamente pesado. Al estar importado dinámicamente (`const ExcelJS = (await import('exceljs')).default`), Vercel lo empaquetará en un chunk separado. No debes alterar este import.
