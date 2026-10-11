$conns = Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -ge 3000 -and $_.LocalPort -le 3020 }
foreach ($c in $conns) {
  $p = Get-Process -Id $c.OwningProcess -ErrorAction SilentlyContinue
  Write-Output ("port {0} -> PID {1} ({2})" -f $c.LocalPort, $c.OwningProcess, $p.ProcessName)
}