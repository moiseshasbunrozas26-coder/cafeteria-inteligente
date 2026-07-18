$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$source = Join-Path $root 'usuarios-backend'
$backendSrc = Join-Path $root 'src'

if (-not (Test-Path (Join-Path $backendSrc 'users\users.controller.ts'))) {
  throw 'No se encontró src\users\users.controller.ts. Ejecuta este instalador desde backend.'
}

if (-not (Test-Path $source)) {
  throw 'No se encontró la carpeta usuarios-backend junto al instalador.'
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $root "backups-text\users-$stamp"
New-Item -ItemType Directory -Path $backup -Force | Out-Null

Copy-Item `
  (Join-Path $backendSrc 'users\users.controller.ts') `
  (Join-Path $backup 'users.controller.txt') `
  -Force

Copy-Item `
  (Join-Path $backendSrc 'users\users.service.ts') `
  (Join-Path $backup 'users.service.txt') `
  -Force

Copy-Item `
  (Join-Path $backendSrc 'users\dto\create-user.dto.ts') `
  (Join-Path $backup 'create-user.dto.txt') `
  -Force

Copy-Item `
  (Join-Path $backendSrc 'auth\auth.controller.ts') `
  (Join-Path $backup 'auth.controller.txt') `
  -Force

Copy-Item `
  (Join-Path $source 'users.controller.ts') `
  (Join-Path $backendSrc 'users\users.controller.ts') `
  -Force

Copy-Item `
  (Join-Path $source 'users.service.ts') `
  (Join-Path $backendSrc 'users\users.service.ts') `
  -Force

Copy-Item `
  (Join-Path $source 'create-user.dto.ts') `
  (Join-Path $backendSrc 'users\dto\create-user.dto.ts') `
  -Force

Copy-Item `
  (Join-Path $source 'auth.controller.ts') `
  (Join-Path $backendSrc 'auth\auth.controller.ts') `
  -Force

Write-Host ''
Write-Host 'Seguridad de Usuarios actualizada correctamente.' -ForegroundColor Green
Write-Host 'Respaldo creado en:' -ForegroundColor Yellow
Write-Host $backup
Write-Host ''
Write-Host 'Ahora ejecuta: npm run build' -ForegroundColor Cyan
