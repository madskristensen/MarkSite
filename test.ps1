[cmdletbinding()]
param(
    [switch]$ExitOnError
)

$assemblies = Get-ChildItem ".\src\MarkSite.Core\bin\Release\*.dll"
$folder = Get-ChildItem ".\src\MarkSite.Web\" -Filter pages | where {$_.Attributes -eq 'Directory'}

foreach($assembly in $assemblies){
    [Reflection.Assembly]::LoadFile($assembly) | Out-Null
}

echo $folder.FullName

$parser = New-Object MarkSite.Core.Parser

try{
    $page = $parser.Parse($folder.FullName)
}
catch{
    $_.Exception.InnerException.Message | Write-Host -ForegroundColor Red

    if ($ExitOnError){
        $host.SetShouldExit(1) | Out-Null
        "Test failed" | Write-Error
    }
}