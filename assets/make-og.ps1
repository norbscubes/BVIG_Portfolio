Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 1200, 630
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'AntiAliasGridFit'
$g.Clear([System.Drawing.Color]::FromArgb(5, 8, 13))
$neon = [System.Drawing.Color]::FromArgb(60, 242, 180)
$pen = New-Object System.Drawing.Pen $neon, 4
$pen.StartCap = 'Round'; $pen.EndCap = 'Round'
$ox = 110; $oy = 165
$g.DrawRectangle($pen, $ox + 45, $oy + 45, 210, 210)
$g.DrawRectangle($pen, $ox + 100, $oy + 100, 100, 100)
foreach ($p in 90, 130, 170, 210) {
  $g.DrawLine($pen, $ox + $p, $oy, $ox + $p, $oy + 45)
  $g.DrawLine($pen, $ox + $p, $oy + 255, $ox + $p, $oy + 300)
  $g.DrawLine($pen, $ox, $oy + $p, $ox + 45, $oy + $p)
  $g.DrawLine($pen, $ox + 255, $oy + $p, $ox + 300, $oy + $p)
}
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$fam = New-Object System.Drawing.FontFamily 'Segoe UI'
$path.AddString('Baron Luis B. Vigonte', $fam, 1, 58, (New-Object System.Drawing.PointF 495, 210), [System.Drawing.StringFormat]::GenericDefault)
$g.DrawPath((New-Object System.Drawing.Pen $neon, 2), $path)
$g.DrawString('Associate Engineer, Product Engineering (Mfg.)', (New-Object System.Drawing.Font 'Segoe UI', 21), (New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(214, 227, 236))), 498, 312)
$g.DrawString('> BVIG_ portfolio', (New-Object System.Drawing.Font 'Consolas', 18), (New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 60, 242, 180))), 500, 395)
$bmp.Save("$PSScriptRoot\og-card.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
