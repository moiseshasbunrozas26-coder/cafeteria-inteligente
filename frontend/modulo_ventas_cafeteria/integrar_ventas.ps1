$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $root 'src'
$appPath = Join-Path $src 'App.tsx'

if (-not (Test-Path $appPath)) {
  throw 'No se encontró src\App.tsx.'
}

Copy-Item (Join-Path $root 'SalesPage.tsx') (Join-Path $src 'SalesPage.tsx') -Force
Copy-Item (Join-Path $root 'SalesPage.css') (Join-Path $src 'SalesPage.css') -Force

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $src "App.before-sales-$stamp.tsx"
Copy-Item $appPath $backup -Force

$utf8 = New-Object System.Text.UTF8Encoding($false)
$app = [System.IO.File]::ReadAllText($appPath, $utf8)

$import = "import { SalesPage } from './SalesPage';"

if (-not $app.Contains($import)) {
  $anchors = @(
    "import { RecipesPage } from './RecipesPage';",
    "import { InventoryPage } from './InventoryPage';",
    "import { ProductsPage } from './ProductsPage';"
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
    throw 'No se encontró un punto seguro para importar SalesPage.'
  }
}

$newBlock = @'
  const salesPage = (
    <SalesPage
      accessToken={session.accessToken}
      onSaleCreated={() => {
        void loadDashboardData();
      }}
    />
  );

  const productsPage = (
'@

$updated = [regex]::Replace(
  $app,
  '(?s)\s*const salesPage\s*=\s*\(.*?\s*const productsPage\s*=\s*\(',
  "`r`n$newBlock",
  1
)

if ($updated -eq $app -and -not $app.Contains('<SalesPage')) {
  throw 'No se pudo encontrar el bloque salesPage.'
}

[System.IO.File]::WriteAllText($appPath, $updated, $utf8)

Write-Host ''
Write-Host 'Módulo Ventas integrado correctamente.' -ForegroundColor Green
Write-Host 'Respaldo:' -ForegroundColor Yellow
Write-Host $backup
Write-Host ''
Write-Host 'Ahora ejecuta: npm run build' -ForegroundColor Cyan
