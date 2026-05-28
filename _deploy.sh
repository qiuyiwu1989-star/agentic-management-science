#!/bin/bash
# 智能体管理学 · 一键部署脚本
# 用法：bash _deploy.sh
# 注：macOS openrsync 不支持 --chmod，改为 rsync 后 SSH 修复目录权限

SERVER="ubuntu@43.159.171.3"
SSH_OPTS="-o StrictHostKeyChecking=no"
EXCLUDE="--exclude='.git' --exclude='*.py' --exclude='.claude' --exclude='article'"

echo "▶ 推送 GitHub..."
git push

echo "▶ 部署到 /ams/ ..."
rsync -az -e "ssh $SSH_OPTS" $EXCLUDE . $SERVER:/var/www/html/ams/
ssh $SSH_OPTS $SERVER "find /var/www/html/ams -type d -exec chmod 755 {} \;"

echo "▶ 部署到 /management/ ..."
rsync -az -e "ssh $SSH_OPTS" $EXCLUDE . $SERVER:/var/www/html/management/
ssh $SSH_OPTS $SERVER "find /var/www/html/management -type d -exec chmod 755 {} \;"

echo "✅ 部署完成 — https://qiuyiwu.com/ams/"
