$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts"
foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        # Replace 'from "package@version"' with 'from "package"'
        # Regex explanation:
        # from\s+                 : matches 'from ' with whitespace
        # "                       : matches opening quote
        # ([^"]+)                 : (Group 1) matches package name characters (anything except quote)
        # @\d+\.\d+\.\d+          : matches @version
        # "                       : matches closing quote
        
        # We need to handle cases like: pattern inside 'from "..."'
        # The specific pattern seen is: from "pkg@ver"
        
        $newContent = $content -replace 'from "([^"]+)@\d+\.\d+(\.\d+)?"', 'from "$1"'
        
        # Also fix the } from "..." case which is covered by the above regex since it doesn't care what comes before 'from'
        
        if ($content -ne $newContent) {
            Set-Content $file.FullName $newContent -NoNewline
            Write-Host "Fixed $($file.Name)"
        }
    } catch {
        Write-Error "Failed to process $($file.Name): $_"
    }
}
