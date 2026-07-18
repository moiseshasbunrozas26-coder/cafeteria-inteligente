$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $root 'src'
$appPath = Join-Path $src 'App.tsx'
$pageSource = Join-Path $root 'UsersPage.tsx'
$cssSource = Join-Path $root 'UsersPage.css'

if (-not (Test-Path $appPath)) {
  throw 'No se encontró src\App.tsx. Ejecuta el instalador desde frontend.'
}

if (-not (Test-Path $pageSource)) {
  throw 'No se encontró UsersPage.tsx junto al instalador.'
}

if (-not (Test-Path $cssSource)) {
  throw 'No se encontró UsersPage.css junto al instalador.'
}

Copy-Item $pageSource (Join-Path $src 'UsersPage.tsx') -Force
Copy-Item $cssSource (Join-Path $src 'UsersPage.css') -Force

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupDirectory = Join-Path $root 'backups'
New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null

$backup = Join-Path $backupDirectory "App.before-users-$stamp.txt"
Copy-Item $appPath $backup -Force

$utf8 = New-Object System.Text.UTF8Encoding($false)
$app = [System.IO.File]::ReadAllText($appPath, $utf8)

$import =
  "import { UsersPage } from './UsersPage';"

if (-not $app.Contains($import)) {
  $anchors = @(
    "import { ReservationsPage } from './ReservationsPage';",
    "import { TablesPage } from './TablesPage';",
    "import { SalesPage } from './SalesPage';"
  )

  $inserted = $false

  foreach ($anchor in $anchors) {
    if ($app.Contains($anchor)) {
      $app = $app.Replace(
        $anchor,
        "$anchor`r`n$import"
      )

      $inserted = $true
      break
    }
  }

  if (-not $inserted) {
    throw 'No se encontró un punto seguro para importar UsersPage.'
  }
}

if (-not $app.Contains('const usersPage = (')) {
  $reservationsIndex =
    $app.IndexOf('  const reservationsPage = (')

  if ($reservationsIndex -lt 0) {
    throw 'No se encontró el bloque reservationsPage.'
  }

  $returnIndex =
    $app.IndexOf(
      '  return (',
      $reservationsIndex
    )

  if ($returnIndex -lt 0) {
    throw 'No se encontró el return posterior a reservationsPage.'
  }

  $pageBlock = @'
  const usersPage = (
    <UsersPage
      accessToken={session.accessToken}
      currentUserId={session.user.id}
      canManage={session.user.role === 'ADMIN'}
    />
  );

'@

  $app =
    $app.Substring(0, $returnIndex) +
    $pageBlock +
    $app.Substring($returnIndex)
}

$routePattern =
  '(?s)\s*<Route\s+path="/usuarios".*?(?=\s*<Route|\s*</Routes>)'

$newRoute = @'

          <Route
            path="/usuarios"
            element={usersPage}
          />
'@

$updated = [regex]::Replace(
  $app,
  $routePattern,
  $newRoute,
  1
)

if ($updated -eq $app) {
  if (-not $app.Contains('element={usersPage}')) {
    throw 'No se pudo reemplazar la ruta /usuarios.'
  }
} else {
  $app = $updated
}

[System.IO.File]::WriteAllText(
  $appPath,
  $app,
  $utf8
)

Write-Host ''
Write-Host 'Módulo Usuarios integrado correctamente.' -ForegroundColor Green
Write-Host 'Respaldo creado en:' -ForegroundColor Yellow
Write-Host $backup
Write-Host ''
Write-Host 'Ahora ejecuta: npm run build' -ForegroundColor Cyan
