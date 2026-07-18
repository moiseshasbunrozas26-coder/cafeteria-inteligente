$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $root 'src'
$appPath = Join-Path $src 'App.tsx'

if (-not (Test-Path $appPath)) {
    throw "No se encontró src\App.tsx. Ejecuta este instalador desde la carpeta frontend."
}

Copy-Item (Join-Path $root 'RecipesPage.tsx') (Join-Path $src 'RecipesPage.tsx') -Force
Copy-Item (Join-Path $root 'RecipesPage.css') (Join-Path $src 'RecipesPage.css') -Force

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $src "App.before-recipes-$timestamp.tsx"
Copy-Item $appPath $backup -Force

$utf8 = New-Object System.Text.UTF8Encoding($false)
$app = [System.IO.File]::ReadAllText($appPath, $utf8)

$import = "import { RecipesPage } from './RecipesPage';"
if (-not $app.Contains($import)) {
    $anchor = "import { InventoryPage } from './InventoryPage';"
    if (-not $app.Contains($anchor)) {
        $anchor = "import { IngredientsPage } from './IngredientsPage';"
    }
    if (-not $app.Contains($anchor)) {
        throw 'No se encontró un import seguro para insertar RecipesPage.'
    }
    $app = $app.Replace($anchor, "$anchor`r`n$import")
}

if (-not $app.Contains("path: '/recetas'")) {
    $anchor = @"
  {
    label: 'Ingredientes',
    path: '/ingredientes',
    icon: '🥛',
  },
"@
    $insert = @"
  {
    label: 'Recetas',
    path: '/recetas',
    icon: '📋',
  },
$anchor
"@
    if (-not $app.Contains($anchor)) {
        throw 'No se encontró el elemento de menú Ingredientes.'
    }
    $app = $app.Replace($anchor, $insert)
}

if (-not $app.Contains('const recipesPage = (')) {
    $anchor = '  const ingredientsPage = ('
    $insert = @"
  const recipesPage = (
    <RecipesPage
      accessToken={session.accessToken}
      canManage={session.user.role === 'ADMIN'}
    />
  );

$anchor
"@
    if (-not $app.Contains($anchor)) {
        throw 'No se encontró ingredientsPage.'
    }
    $app = $app.Replace($anchor, $insert)
}

if (-not $app.Contains('path="/recetas"')) {
    $pattern = '(?s)(\s*<Route\s+path="/ingredientes"\s+element=\{ingredientsPage\}\s*/>)'
    $route = @"

          <Route
            path="/recetas"
            element={recipesPage}
          />
"@
    $updated = [regex]::Replace($app, $pattern, "$route`$1", 1)
    if ($updated -eq $app) {
        throw 'No se encontró la ruta de Ingredientes.'
    }
    $app = $updated
}

[System.IO.File]::WriteAllText($appPath, $app, $utf8)

Write-Host ''
Write-Host 'Módulo Recetas integrado correctamente.' -ForegroundColor Green
Write-Host "Respaldo: $backup" -ForegroundColor Yellow
Write-Host 'Ahora ejecuta: npm run build' -ForegroundColor Cyan
