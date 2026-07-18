$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $root 'src'
$schemaPath = Join-Path $root 'prisma\schema.prisma'
$appModulePath = Join-Path $src 'app.module.ts'
$moduleSource = Join-Path $root 'src-reservations'

if (-not (Test-Path $schemaPath)) {
  throw 'No se encontró prisma\schema.prisma. Ejecuta este instalador desde backend.'
}

if (-not (Test-Path $appModulePath)) {
  throw 'No se encontró src\app.module.ts.'
}

if (-not (Test-Path $moduleSource)) {
  throw 'No se encontró la carpeta src-reservations junto al instalador.'
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupDirectory = Join-Path $root "backups\reservations-$stamp"
New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null

Copy-Item $schemaPath (Join-Path $backupDirectory 'schema.prisma') -Force
Copy-Item $appModulePath (Join-Path $backupDirectory 'app.module.ts') -Force

$destination = Join-Path $src 'reservations'
New-Item -ItemType Directory -Path $destination -Force | Out-Null
Copy-Item (Join-Path $moduleSource '*') $destination -Recurse -Force

$utf8 = New-Object System.Text.UTF8Encoding($false)

$schema = [System.IO.File]::ReadAllText($schemaPath, $utf8)

if (-not $schema.Contains('enum ReservationStatus')) {
  $enumBlock = @'
enum ReservationStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}

'@

  $tableEnumMarker = 'enum TableStatus'

  $markerIndex = $schema.IndexOf($tableEnumMarker)

  if ($markerIndex -lt 0) {
    throw 'No se encontró enum TableStatus en schema.prisma.'
  }

  $schema = $schema.Insert(
    $markerIndex,
    $enumBlock
  )
}

if (-not $schema.Contains('reservations Reservation[]')) {
  $schema = [regex]::Replace(
    $schema,
    '(?m)^(\s*sales\s+Sale\[\]\s*)$',
    "`$1`r`n  reservations Reservation[]",
    1
  )

  if (-not $schema.Contains('reservations Reservation[]')) {
    throw 'No se pudo agregar la relación reservations a CafeTable.'
  }
}

if (-not $schema.Contains('model Reservation')) {
  $reservationModel = @'

model Reservation {
  id              Int               @id @default(autoincrement())
  customerName    String
  customerPhone   String
  customerEmail   String?
  people          Int
  reservationAt   DateTime
  durationMinutes Int               @default(90)
  status          ReservationStatus @default(PENDING)
  notes           String?
  tableId         Int
  table           CafeTable         @relation(fields: [tableId], references: [id])
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  @@index([tableId, reservationAt])
  @@index([reservationAt, status])
}
'@

  $schema = $schema.TrimEnd() +
    "`r`n" +
    $reservationModel +
    "`r`n"
}

[System.IO.File]::WriteAllText(
  $schemaPath,
  $schema,
  $utf8
)

$app = [System.IO.File]::ReadAllText(
  $appModulePath,
  $utf8
)

$importLine =
  "import { ReservationsModule } from './reservations/reservations.module.js';"

if (-not $app.Contains($importLine)) {
  $anchor =
    "import { TablesModule } from './tables/tables.module.js';"

  if (-not $app.Contains($anchor)) {
    throw 'No se encontró el import de TablesModule.'
  }

  $app = $app.Replace(
    $anchor,
    "$anchor`r`n$importLine"
  )
}

if (-not [regex]::IsMatch(
  $app,
  '(?m)^\s*ReservationsModule,\s*$'
)) {
  $importsAnchor = '    TablesModule,'

  if (-not $app.Contains($importsAnchor)) {
    throw 'No se encontró TablesModule dentro de imports.'
  }

  $app = $app.Replace(
    $importsAnchor,
    "$importsAnchor`r`n    ReservationsModule,"
  )
}

[System.IO.File]::WriteAllText(
  $appModulePath,
  $app,
  $utf8
)

Write-Host ''
Write-Host 'Backend de Reservas integrado correctamente.' -ForegroundColor Green
Write-Host 'Respaldo creado en:' -ForegroundColor Yellow
Write-Host $backupDirectory
Write-Host ''
Write-Host 'Siguientes comandos:' -ForegroundColor Cyan
Write-Host 'npx prisma format'
Write-Host 'npx prisma migrate dev --name add_reservations'
Write-Host 'npm run build'
