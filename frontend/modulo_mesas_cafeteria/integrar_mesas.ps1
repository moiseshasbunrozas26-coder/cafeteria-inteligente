$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $root 'src'
$appPath = Join-Path $src 'App.tsx'
$pageSource = Join-Path $root 'TablesPage.tsx'
$cssSource = Join-Path $root 'TablesPage.css'

if (-not (Test-Path $appPath)) {
  throw 'No se encontró src\App.tsx. Ejecuta este instalador desde frontend.'
}

if (-not (Test-Path $pageSource)) {
  throw 'No se encontró TablesPage.tsx junto al instalador.'
}

if (-not (Test-Path $cssSource)) {
  throw 'No se encontró TablesPage.css junto al instalador.'
}

Copy-Item $pageSource (Join-Path $src 'TablesPage.tsx') -Force
Copy-Item $cssSource (Join-Path $src 'TablesPage.css') -Force

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $src "App.before-tables-$stamp.tsx"
Copy-Item $appPath $backup -Force

$utf8 = New-Object System.Text.UTF8Encoding($false)
$app = [System.IO.File]::ReadAllText($appPath, $utf8)

$import = "import { TablesPage } from './TablesPage';"

if (-not $app.Contains($import)) {
  $anchors = @(
    "import { SalesPage } from './SalesPage';",
    "import { RecipesPage } from './RecipesPage';",
    "import { InventoryPage } from './InventoryPage';"
  )

  $inserted = $false

  foreach ($anchor in $anchors) {
    if ($app.Contains($anchor)) {
      $app = $app.Replace($anchor, "$anchor`r`n$import")
      $inserted = $true
      break
    }
  }

  if (-not $inserted) {
    throw 'No se encontró un punto seguro para importar TablesPage.'
  }
}

$newBlock = @'
  const tablesPage = (
    <TablesPage
      accessToken={session.accessToken}
      canCreateDelete={session.user.role === 'ADMIN'}
      canUpdate={
        session.user.role === 'ADMIN' ||
        session.user.role === 'STAFF'
      }
      onTablesChanged={() => {
        void loadDashboardData();
      }}
    />
  );

  const reservationsPage = (
'@

$updated = [regex]::Replace(
  $app,
  '(?s)\s*const tablesPage\s*=\s*\(.*?\s*const reservationsPage\s*=\s*\(',
  "`r`n$newBlock",
  1
)

if ($updated -eq $app -and -not $app.Contains('<TablesPage')) {
  throw 'No se pudo encontrar el bloque tablesPage.'
}

[System.IO.File]::WriteAllText($appPath, $updated, $utf8)

Write-Host ''
Write-Host 'Módulo Mesas integrado correctamente.' -ForegroundColor Green
Write-Host 'Respaldo:' -ForegroundColor Yellow
Write-Host $backup
Write-Host ''
Write-Host 'Ahora ejecuta: npm run build' -ForegroundColor Cyan
