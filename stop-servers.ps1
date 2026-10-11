$conns = Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -ge 3000 -and $_.LocalPort -le 3020 }
$pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($procId in $pids) {
  $p = Get-Process -Id $procId -ErrorAction SilentlyContinue
  if ($p -and $p.ProcessName -eq 'node') {
    Stop-Process -Id $procId -Force
    Write-Output "arrêté PID $procId"
  }
}
Start-Sleep -Seconds 1
$rest = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -ge 3000 -and $_.LocalPort -le 3020 }
if ($rest) { Write-Output "ENCORE PRESENTS:"; $rest | ForEach-Object { Write-Output $_.LocalPort } } else { Write-Output "tous les ports 3000-3020 sont libres" }