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
$gold = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(217, 164, 65)), 2
for ($i = 0; $i -lt 4; $i++) { $g.DrawEllipse($gold, $ox + 52 + $i * 9, $oy + 230, 5, 5) }
$cfont = New-Object System.Drawing.Font 'Consolas', 13, ([System.Drawing.FontStyle]::Bold)
$g.DrawString('BVIG', $cfont, (New-Object System.Drawing.SolidBrush $neon), $ox + 128, $oy + 140)
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$fam = New-Object System.Drawing.FontFamily 'Segoe UI'
$path.AddString('Baron Luis', $fam, 1, 54, (New-Object System.Drawing.PointF 445, 190), [System.Drawing.StringFormat]::GenericDefault)
$path.AddString('B. Vigonte', $fam, 1, 54, (New-Object System.Drawing.PointF 445, 255), [System.Drawing.StringFormat]::GenericDefault)
$g.DrawPath((New-Object System.Drawing.Pen $neon, 2), $path)
$g.DrawString("Associate Engineer,`nProduct Engineering (Mfg.)", (New-Object System.Drawing.Font 'Segoe UI', 17), (New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(214, 227, 236))), 448, 345)
$g.DrawString('> BVIG_ portfolio', (New-Object System.Drawing.Font 'Consolas', 16), (New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 60, 242, 180))), 450, 425)
$ascii = @'
#%%%%% %%%#%
%%%%%%%%%@%%%%%@@%%
@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@%%%%%%%@@@@@@@@@@
@@@@##*+++++*%*%@@@@@@@@
@@@*+++=====+*###@@@@@@@
@%##*#**=====+*++***@@@
%##%%##%*+=+#%%%#+++%*+
+**+++==+++=======+**=+
*+===+++===++=--=+++=
++++*+++====+===+*=
*+==+**====+====+
*++=========+++
*****++++++==++:
+*+++======-:.::
..::---*=-:.......-=:..
::.::::::-+++:.:---:::::.......
-::.::::--:::...:::::...............
---:::::---::.....:::::::::......:.....
:--:::::--=-::....::::::::......::......:.
::--:::::-:--::..:::::::::....::.........::.
---:::::::::-:.:::::.::::...::::......:...::.
'@ -split "`r?`n"
$px = 850; $py = 95; $pw = 310; $ph = 440
$g.FillRectangle((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(10, 16, 22))), $px, $py, $pw, $ph)
$g.DrawRectangle((New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(110, 60, 242, 180)), 1), $px, $py, $pw, $ph)
$g.DrawLine((New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 60, 242, 180)), 1), $px, $py + 26, $px + $pw, $py + 26)
$dot = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(150, 60, 242, 180)), 1
foreach ($k in 0, 1, 2) { $g.DrawEllipse($dot, $px + 10 + $k * 13, $py + 9, 7, 7) }
$g.DrawString('~/baron/portrait.txt', (New-Object System.Drawing.Font 'Consolas', 9), (New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(150, 60, 242, 180))), $px + 54, $py + 6)
$afont = New-Object System.Drawing.Font 'Consolas', 8.6
$abrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(185, 255, 240))
$fmt = New-Object System.Drawing.StringFormat
$fmt.Alignment = 'Center'
$y = $py + 40
foreach ($line in $ascii) { $g.DrawString($line, $afont, $abrush, ($px + $pw / 2), $y, $fmt); $y += 15 }
$g.DrawString('> "Turning ideas into systems."', (New-Object System.Drawing.Font 'Consolas', 10, ([System.Drawing.FontStyle]::Italic)), (New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(195, 209, 220))), ($px + $pw / 2), ($py + $ph - 30), $fmt)
$bmp.Save("$PSScriptRoot\og-card.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
