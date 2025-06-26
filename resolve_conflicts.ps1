# PowerShell script to resolve all merge conflicts by keeping HEAD version

# Get all files with merge conflicts
$files = Get-ChildItem -Recurse -Include *.jsx,*.js,*.css,*.json,*.html | Where-Object { 
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    $content -and ($content -match '<<<<<<< HEAD')
}

Write-Host "Found $($files.Count) files with merge conflicts"

foreach ($file in $files) {
    Write-Host "Resolving conflicts in: $($file.FullName)"
    
    try {
        $content = Get-Content $file.FullName -Raw
        
        # Remove merge conflict markers and keep HEAD version
        $resolved = $content -replace '(?s)<<<<<<< HEAD\r?\n(.*?)\r?\n=======\r?\n.*?\r?\n>>>>>>> origin/main', '$1'
        
        # Write back the resolved content
        Set-Content $file.FullName $resolved -NoNewline
        
        Write-Host "  ✓ Resolved conflicts in $($file.Name)"
    }
    catch {
        Write-Host "  ✗ Error resolving $($file.Name): $($_.Exception.Message)"
    }
}

Write-Host "\nConflict resolution complete!"
Write-Host "You can now run: git add . && git commit -m 'Resolve merge conflicts - keep HEAD version'"