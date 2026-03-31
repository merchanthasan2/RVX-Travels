$port = 3000
$rootPath = "\\tnas\Storage\Vibe Code\Royal Visa Xpert"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server started successfully!"
Write-Host "Serving from: $rootPath"
Write-Host "Open your browser and navigate to: http://localhost:$port/"
Write-Host "Press Ctrl+C to stop the server"
Write-Host ""

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".json" = "application/json"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        
        # Clean the path and join with root
        $relativePath = $path.TrimStart('/')
        $filePath = Join-Path $rootPath $relativePath
        
        Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] Request: $path"
        
        if (Test-Path $filePath -PathType Leaf) {
            try {
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = $mimeTypes[$extension]
                if ($null -eq $contentType) { $contentType = "application/octet-stream" }
                
                $response.ContentType = $contentType
                $response.StatusCode = 200
                
                # Read file content
                $fileStream = [System.IO.File]::OpenRead($filePath)
                $fileStream.CopyTo($response.OutputStream)
                $fileStream.Close()
                
                Write-Host "  -> 200 OK ($contentType)"
            }
            catch {
                $response.StatusCode = 500
                Write-Host "  -> 500 Error: $_" -ForegroundColor Red
            }
        }
        else {
            $response.StatusCode = 404
            $response.ContentType = "text/html"
            $errorHtml = "<h1>404 - Not Found</h1><p>File not found: $path</p>"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorHtml)
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            Write-Host "  -> 404 Not Found" -ForegroundColor Yellow
        }
        
        $response.Close()
    }
    catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}
