$root = $PSScriptRoot
$port = 8788
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$port/"

$mime = @{
    ".html" = "text/html; charset=utf-8"; ".css" = "text/css; charset=utf-8"
    ".js" = "text/javascript; charset=utf-8"; ".mjs" = "text/javascript; charset=utf-8"
    ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"; ".png" = "image/png"
    ".svg" = "image/svg+xml"; ".json" = "application/json"; ".pdf" = "application/pdf"
    ".ico" = "image/x-icon"; ".woff2" = "font/woff2"
}

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $root ($path -replace "/", "\")
    try {
        if ((Test-Path $file -PathType Leaf) -and ([IO.Path]::GetFullPath($file)).StartsWith($root)) {
            $bytes = [IO.File]::ReadAllBytes($file)
            $ext = [IO.Path]::GetExtension($file).ToLower()
            if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $ctx.Response.StatusCode = 404
        }
    } catch { $ctx.Response.StatusCode = 500 }
    $ctx.Response.OutputStream.Close()
}
