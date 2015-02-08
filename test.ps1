[cmdletbinding()]
param(
    [switch]$ExitOnError
)

$assemblies = Get-ChildItem ".\src\output\bin\*.dll"
$folder = Get-ChildItem ".\src\MarkSite.Web\" -Filter pages | where {$_.Attributes -eq 'Directory'}

foreach($assembly in $assemblies){
    [Reflection.Assembly]::LoadFile($assembly) | Out-Null
}

$parser = New-Object PageParser

Write-Host "Running tests..." -ForegroundColor Cyan -NoNewline

try{
    $page = $parser.Parse($folder.FullName)
    Write-Host "OK" -ForegroundColor Green
}
catch{
    Write-Host "Fail" -ForegroundColor Red
    Write-Host $_.Exception.InnerException.Message -ForegroundColor Red

    if ($ExitOnError){
        $host.SetShouldExit(1) | Out-Null
    }
}