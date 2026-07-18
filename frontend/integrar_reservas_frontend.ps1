$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $root 'src'
$appPath = Join-Path $src 'App.tsx'
$pageSource = Join-Path $root 'ReservationsPage.tsx'
$cssSource = Join-Path $root 'ReservationsPage.css'

if (-not (Test-Path $appPath)) {
  throw 'No se encontró src\App.tsx. Ejecuta el instalador desde frontend.'
}

if (-not (Test-Path $pageSource)) {
  throw 'No se encontró ReservationsPage.tsx junto al instalador.'
}

if (-not (Test-Path $cssSource)) {
  throw 'No se encontró ReservationsPage.css junto al instalador.'
}

Copy-Item $pageSource (Join-Path $src 'ReservationsPage.tsx') -Force
Copy-Item $cssSource (Join-Path $src 'ReservationsPage.css') -Force

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupDirectory = Join-Path $root 'backups'
New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null

$backup = Join-Path $backupDirectory "App.before-reservations-$stamp.txt"
Copy-Item $appPath $backup -Force

$utf8 = New-Object System.Text.UTF8Encoding($false)
$app = [System.IO.File]::ReadAllText($appPath, $utf8)

$import =
  "import { ReservationsPage } from './ReservationsPage';"

if (-not $app.Contains($import)) {
  $anchors = @(
    "import { TablesPage } from './TablesPage';",
    "import { SalesPage } from './SalesPage';",
    "import { RecipesPage } from './RecipesPage';"
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
    throw 'No se encontró un punto seguro para importar ReservationsPage.'
  }
}

if (-not $app.Contains('const reservationsPage = (')) {
  $tablesIndex =
    $app.IndexOf('  const tablesPage = (')

  if ($tablesIndex -lt 0) {
    throw 'No se encontró el bloque tablesPage.'
  }

  $returnIndex =
    $app.IndexOf(
      '  return (',
      $tablesIndex
    )

  if ($returnIndex -lt 0) {
    throw 'No se encontró el return posterior a tablesPage.'
  }

  $pageBlock = @'
  const reservationsPage = (
    <ReservationsPage
      accessToken={session.accessToken}
      canManage={
        session.user.role === 'ADMIN' ||
        session.user.role === 'STAFF'
      }
      onReservationsChanged={() => {
        void loadDashboardData();
      }}
    />
  );

'@

  $app =
    $app.Substring(0, $returnIndex) +
    $pageBlock +
    $app.Substring($returnIndex)
}

$routePattern =
  '(?s)\s*<Route\s+path="/reservas".*?(?=\s*<Route|\s*</Routes>)'

$newRoute = @'

          <Route
            path="/reservas"
            element={reservationsPage}
          />
'@

$updated = [regex]::Replace(
  $app,
  $routePattern,
  $newRoute,
  1
)

if ($updated -eq $app) {
  if (-not $app.Contains('element={reservationsPage}')) {
    throw 'No se pudo reemplazar la ruta /reservas.'
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
Write-Host 'Módulo Reservas integrado correctamente.' -ForegroundColor Green
Write-Host 'Respaldo creado en:' -ForegroundColor Yellow
Write-Host $backup
Write-Host ''
Write-Host 'Ahora ejecuta: npm run build' -ForegroundColor Cyan
