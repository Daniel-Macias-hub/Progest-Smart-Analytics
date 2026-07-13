# Evidencia de Validación del Entorno

## Datos Recopilados del Entorno

- **Sistema Operativo:** Microsoft Windows 11 Home Single Language
- **Versión de Windows:** Microsoft Windows NT 10.0.26200.0
- **Arquitectura:** AMD64
- **PowerShell:** 5.1.26100.8737
- **Node.js:** v24.18.0
- **Yarn:** 1.22.22
- **NPM:** 11.16.0
- **Python:** Python 3.14.6
- **Git:** git version 2.55.0.windows.2
- **Estado de la Red:** Conectado (Ping exitoso a 8.8.8.8)
- **Variables PATH Detectadas:**
  - Python (`C:\Python314\`)
  - Node.js (`C:\Program Files\nodejs\`)
  - Git (`C:\Program Files\Git\cmd`)
  - npm global (`C:\Users\DanielMacias\AppData\Roaming\npm`)

---

## Espacio en Disco y Sistema de Archivos

| Unidad | Etiqueta | Sistema de Archivos | Tamaño Total | Espacio Libre | Permiso de Escritura |
|--------|----------|---------------------|--------------|---------------|----------------------|
| **C:** | -        | **NTFS**            | 475.96 GB    | 338.22 GB     | **Confirmado (Sí)**  |
| **D:** | DANIEL-4GB| **FAT32**           | 3.61 GB      | 2.30 GB       | **Confirmado (Sí)**  |

---

## Comandos Ejecutados para el Diagnóstico

1. **Obtener OS y Arquitectura:**
   ```powershell
   (Get-WmiObject Win32_OperatingSystem).Caption
   $env:PROCESSOR_ARCHITECTURE
   ```
2. **Obtener Versiones de Binarios:**
   ```powershell
   node -v
   yarn -v
   python -V
   git --version
   ```
3. **Obtener File System y Espacio:**
   ```powershell
   Get-Volume
   ```
4. **Verificar Escritura:**
   ```powershell
   "test" | Out-File "C:\Users\DanielMacias\temp_write_test.txt"
   ```
