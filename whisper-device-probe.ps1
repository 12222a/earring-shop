$ErrorActionPreference = 'Stop'

$backendExe = Join-Path $env:LOCALAPPDATA 'Programs\Whisper4Windows\whisper-backend.exe'

Get-Process app, whisper-backend -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

$backend = Start-Process -FilePath $backendExe -PassThru
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  try {
    $null = Invoke-RestMethod 'http://127.0.0.1:8000/health'
    $ready = $true
    break
  } catch {
    Start-Sleep -Milliseconds 500
  }
}

if (-not $ready) {
  throw 'Backend did not come up on port 8000'
}

$targets = @(
  @{ id = 0;  name = 'Microsoft Sound Mapper Input' },
  @{ id = 6;  name = 'Primary Sound Capture Driver' },
  @{ id = 25; name = 'HD103 Hands-Free' },
  @{ id = 1;  name = 'HD103 headset' },
  @{ id = 15; name = 'HD103 headset 16k' }
)

$results = @()

# Give the user a brief moment to start speaking before we begin sampling.
Start-Sleep -Seconds 5

foreach ($t in $targets) {
  try {
    $body = @{
      model_size = 'small'
      language = 'zh'
      device = 'auto'
      device_index = $t.id
    } | ConvertTo-Json -Compress

    $start = Invoke-RestMethod -Method Post -Uri 'http://127.0.0.1:8000/start' -ContentType 'application/json' -Body $body
    Start-Sleep -Seconds 3
    $stop = Invoke-RestMethod -Method Post -Uri 'http://127.0.0.1:8000/stop'

    $results += [PSCustomObject]@{
      id = $t.id
      name = $t.name
      start = ($start | ConvertTo-Json -Compress)
      stop = ($stop | ConvertTo-Json -Compress)
    }
  } catch {
    $results += [PSCustomObject]@{
      id = $t.id
      name = $t.name
      start = 'error'
      stop = $_.Exception.Message
    }

    try {
      Invoke-RestMethod -Method Post -Uri 'http://127.0.0.1:8000/cancel' | Out-Null
    } catch {
    }

    if (-not (Get-Process -Id $backend.Id -ErrorAction SilentlyContinue)) {
      $backend = Start-Process -FilePath $backendExe -PassThru
      for ($k = 0; $k -lt 20; $k++) {
        try {
          $null = Invoke-RestMethod 'http://127.0.0.1:8000/health'
          break
        } catch {
          Start-Sleep -Milliseconds 500
        }
      }
    }
  }
}

$results | ConvertTo-Json -Depth 5
