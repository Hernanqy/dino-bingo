param(
  [int]$Port = 8080
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try {
  $listener.Start()
}
catch {
  Write-Host ""
  Write-Host "No se pudo iniciar el servidor." -ForegroundColor Red
  Write-Host "Abrí PowerShell como administrador y ejecutá nuevamente:" -ForegroundColor Yellow
  Write-Host ".\server.ps1" -ForegroundColor Cyan
  exit
}

Write-Host ""
Write-Host "Bingo Prehistórico funcionando en:" -ForegroundColor Green
Write-Host "http://localhost:$Port" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presioná Ctrl + C para detenerlo." -ForegroundColor DarkGray

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".png"  = "image/png"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
    $requestPath = $context.Request.Url.AbsolutePath.TrimStart("/")

    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $requestPath = "index.html"
    }

    $requestPath = $requestPath.Replace("/", "\")
    $filePath = Join-Path $root $requestPath

    if (Test-Path $filePath -PathType Leaf) {
      $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
      $contentType = $mimeTypes[$extension]

      if (-not $contentType) {
        $contentType = "application/octet-stream"
      }

      $bytes = [System.IO.File]::ReadAllBytes($filePath)

      $context.Response.StatusCode = 200
      $context.Response.ContentType = $contentType
      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    else {
      $message = [System.Text.Encoding]::UTF8.GetBytes("Archivo no encontrado")

      $context.Response.StatusCode = 404
      $context.Response.ContentType = "text/plain; charset=utf-8"
      $context.Response.ContentLength64 = $message.Length
      $context.Response.OutputStream.Write($message, 0, $message.Length)
    }

    $context.Response.OutputStream.Close()
  }
  catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
  }
}
