$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $root 'src'
$appPath = Join-Path $src 'App.tsx'
$pageSource = Join-Path $root 'DashboardPage.tsx'
$cssSource = Join-Path $root 'DashboardPage.css'

if (-not (Test-Path $appPath)) {
  throw 'No se encontró src\App.tsx. Ejecuta el instalador desde frontend.'
}

if (-not (Test-Path $pageSource)) {
  throw 'No se encontró DashboardPage.tsx junto al instalador.'
}

if (-not (Test-Path $cssSource)) {
  throw 'No se encontró DashboardPage.css junto al instalador.'
}

Copy-Item $pageSource (Join-Path $src 'DashboardPage.tsx') -Force
Copy-Item $cssSource (Join-Path $src 'DashboardPage.css') -Force

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupDirectory = Join-Path $root 'backups'
New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null

$backup = Join-Path $backupDirectory "App.before-dashboard-$stamp.txt"
Copy-Item $appPath $backup -Force

$utf8 = New-Object System.Text.UTF8Encoding($false)
$app = [System.IO.File]::ReadAllText($appPath, $utf8)

$import =
  "import { DashboardPage } from './DashboardPage';"

if (-not $app.Contains($import)) {
  $anchors = @(
    "import { UsersPage } from './UsersPage';",
    "import { ReservationsPage } from './ReservationsPage';",
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
    throw 'No se encontró un punto seguro para importar DashboardPage.'
  }
}

# Remove the old dashboard useMemo calculation.
$summaryPattern =
  '(?s)\s*const dashboardSummary\s*=\s*useMemo\(\(\)\s*=>\s*\{.*?\},\s*\[dashboardData\]\s*\);\s*'

$app = [regex]::Replace(
  $app,
  $summaryPattern,
  "`r`n",
  1
)

# Remove old derived dashboard variables between roleLabel and dashboardPage.
$derivedPattern =
  '(?s)(\s*const roleLabel\s*=.*?;\s*)(?:const principalIngredient\s*=.*?const recentSales\s*=.*?;\s*)(?=const dashboardPage\s*=)'

$app = [regex]::Replace(
  $app,
  $derivedPattern,
  "`$1`r`n  ",
  1
)

$newDashboardBlock = @'
  const dashboardPage = (
    <DashboardPage
      accessToken={session.accessToken}
      firstName={firstName}
      products={dashboardData.products}
      ingredients={dashboardData.ingredients}
      tables={dashboardData.tables}
      sales={dashboardData.sales}
      loading={loading}
      error={dashboardError}
      onRefresh={() => {
        void loadDashboardData();
      }}
      onNewSale={() => {
        navigate('/ventas');
      }}
      onGoToSales={() => {
        navigate('/ventas');
      }}
      onGoToInventory={() => {
        navigate('/inventario');
      }}
      onGoToTables={() => {
        navigate('/mesas');
      }}
      onGoToReservations={() => {
        navigate('/reservas');
      }}
    />
  );

'@

$startMarker = '  const dashboardPage = ('
$endMarker = '  const salesPage = ('

$startIndex = $app.IndexOf($startMarker)

if ($startIndex -lt 0) {
  throw 'No se encontró el inicio del dashboardPage actual.'
}

$endIndex = $app.IndexOf(
  $endMarker,
  $startIndex
)

if ($endIndex -lt 0) {
  throw 'No se encontró el bloque salesPage posterior.'
}

$app =
  $app.Substring(0, $startIndex) +
  $newDashboardBlock +
  $app.Substring($endIndex)

# Export old helpers/constants if they remain, avoiding noUnusedLocals.
$declarations = @(
  'const tableStatusLabels',
  'const tableStatusClasses',
  'const saleStatusLabels',
  'function formatCurrency',
  'function getGreeting'
)

foreach ($declaration in $declarations) {
  if (
    $app.Contains($declaration) -and
    -not $app.Contains("export $declaration")
  ) {
    $app = $app.Replace(
      $declaration,
      "export $declaration"
    )
  }
}

# Remove useMemo from React imports when it is no longer called.
if (-not $app.Contains('useMemo(')) {
  $app = [regex]::Replace(
    $app,
    '(?m)^\s*useMemo,\r?\n',
    '',
    1
  )
}

[System.IO.File]::WriteAllText(
  $appPath,
  $app,
  $utf8
)

Write-Host ''
Write-Host 'Dashboard inteligente integrado correctamente.' -ForegroundColor Green
Write-Host 'Respaldo creado en:' -ForegroundColor Yellow
Write-Host $backup
Write-Host ''
Write-Host 'Ahora ejecuta: npm run build' -ForegroundColor Cyan
