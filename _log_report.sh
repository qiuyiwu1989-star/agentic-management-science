#!/bin/bash
# 每日访问日志快报
# 用法：bash _log_report.sh

SERVER="ubuntu@43.159.171.3"
TODAY=$(date +%d/%b/%Y)

echo "=== 智能体管理学 · 日访问快报 · $TODAY ==="
ssh -o StrictHostKeyChecking=no $SERVER "
echo '--- PV/UV ---'
awk '\$7 ~ /^\/ams/ && \$4 ~ /$(date +%d\\\/%b\\\//%Y)/' /var/log/nginx/access.log | wc -l
awk '\$7 ~ /^\/ams/ && \$4 ~ /$(date +%d\\\/%b\\\//%Y)/ && \$9==\"200\" {print \$1}' /var/log/nginx/access.log | sort -u | wc -l

echo '--- 人类 vs Bot ---'
awk '\$7 ~ /^\/ams/ && \$9==\"200\"' /var/log/nginx/access.log | awk '{ua=tolower(\$0); if(ua~/bot|crawler|spider|wget|curl|python|java/) print \"bot\"; else print \"human\"}' | sort | uniq -c

echo '--- Top 10 页面 ---'
awk '\$7 ~ /^\/ams/ && \$9==\"200\" {print \$7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

echo '--- 错误 ---'
awk '\$7 ~ /^\/ams/ && (\$9==\"404\" || \$9==\"403\") {print \$9, \$7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10
"
