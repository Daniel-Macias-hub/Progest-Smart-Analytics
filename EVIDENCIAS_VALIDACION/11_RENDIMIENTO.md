# Evidencia de Rendimiento del Sistema

## Tiempos de Carga e Instalación

| Operación / Módulo | Comando Ejecutado | Tiempo de Respuesta | Resultado / Observación |
|--------------------|-------------------|---------------------|--------------------------|
| **Instalación de Dependencias** | `yarn install` | **46.63 segundos** | Descarga rápida gracias al caché de Yarn en disco NTFS |
| **Compilación de Producción** | `yarn build` | **19.96 segundos** | Next.js 14.2.5 compilando 43 páginas |
| **Arranque de Desarrollo** | `yarn dev` | **1.75 segundos** | Iniciado listo para recibir peticiones |
| **Arranque de Backend** | `python run.py` | **~1.00 segundo** | Carga de Flask y conexión a DB |
| **Latencia de Health Check** | `GET /api/health`| **12 milisegundos** | Respuesta rápida de salud de DB |

---

## Consumo de Recursos en Reposo (Entorno Local)

- **Uso de Memoria RAM (Frontend dev server):** ~120 MB en reposo.
- **Uso de Memoria RAM (Backend Flask):** ~45 MB en reposo.
- **Uso de CPU (Ambos servicios en reposo):** < 1.5% promedio.
