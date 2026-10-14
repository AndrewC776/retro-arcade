#!/bin/sh
cd "$(dirname "$0")"
PORT=${1:-8000}
echo "复古街机厅已启动: http://localhost:$PORT  (Ctrl+C 退出)"
(sleep 1; xdg-open http://localhost:$PORT 2>/dev/null || open http://localhost:$PORT 2>/dev/null) &
python3 -m http.server $PORT 2>/dev/null || python -m http.server $PORT
