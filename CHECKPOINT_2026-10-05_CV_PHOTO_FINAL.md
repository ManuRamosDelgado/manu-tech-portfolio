# CHECKPOINT — Portfolio CV + foto final

Fecha: 2026-10-05
Base: origin/main @ 4929549

## Cambios aplicados
- Se conserva íntegramente la versión más reciente del portfolio.
- Se reemplaza `Manu_Ramos_Delgado_CV.pdf` por el PDF real de `OneDrive\00 Entrada\Currículum MANU.pdf`.
- SHA-256 del PDF publicado y del PDF fuente verificados como idénticos.
- Los enlaces de navegación "Currículum" del portfolio principal y páginas de proyecto descargan directamente el PDF.
- Se mantiene `cv.html` como currículum web secundario.
- Se reemplaza `assets/manu-profile.webp` de 320x400 px por una versión 1122x1402 px generada desde la foto original de `OneDrive\00 Entrada\20261004_184549064_iOS.jpg`.
- La conversión a WebP es lossless para no añadir degradación a la fuente JPEG.

## QA
- Foto final: 1122x1402 px.
- PDF publicado: 125026 bytes, hash idéntico al archivo de OneDrive.
- HTTP local:
  - index.html -> 200 text/html
  - Manu_Ramos_Delgado_CV.pdf -> 200 application/pdf
  - assets/manu-profile.webp -> 200 image/webp
- `node --check app-v4.js`: OK.
- `git diff --check`: OK.
- QA visual del bloque Perfil: correcta, foto nítida y layout preservado.

## Regla de continuidad
Este checkpoint parte de la versión remota más reciente. No recuperar ni promover la V4 local antigua sobre esta base. El resto del portfolio queda consolidado sin cambios.
