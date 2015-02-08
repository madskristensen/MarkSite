[cmdletbinding()]
param()

Write-Host "Running tests..." -ForegroundColor Cyan -NoNewline

$assemblies = Get-ChildItem ".\output\bin\*.dll"
$folder = Get-ChildItem ".\src\" -Filter pages | where {$_.Attributes -eq 'Directory'}

foreach($assembly in $assemblies){
    [Reflection.Assembly]::LoadFile($assembly) | Out-Null
}

$parser = New-Object PageParser $folder.FullName
$page = $parser.Parse()

if (!$parser.IsValid){
    Write-Host "Fail" -ForegroundColor Red
    
    foreach($validationMessage in $parser.ValidationMessages){
        [string[]]$params =  $validationMessage.Split("|")
        $message = $params[0].Trim()
        $filename = $params[1].Trim().Replace("\", "/")

        Write-Host "$message in $filename" -ForegroundColor White -BackgroundColor Red

        if (Get-Command Add-AppveyorTest -errorAction SilentlyContinue)
        {
            Add-AppveyorTest $message -Outcome Failed -FileName $filename
            $Host.SetShouldExit(1)
        }
    }
}
else {
    Write-Host "OK" -ForegroundColor Green
}