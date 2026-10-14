@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 复古街机厅已启动: http://localhost:8000  (关闭此窗口即退出)
start "" http://localhost:8000
python -m http.server 8000 || py -m http.server 8000
pause
