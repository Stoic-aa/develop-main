#!/bin/bash

# 部署脚本
echo "开始部署..."

# 获取当前时间戳
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# ==================== 路径配置 ====================
WEB_ROOT="/usr/share/nginx/html"
# Nginx 缓存策略片段，由 server 块的 `include /etc/nginx/default.d/*.conf;` 引入
NGINX_SNIPPET_SRC="nginx/cache.conf"
NGINX_SNIPPET_DIR="/etc/nginx/default.d"
NGINX_SNIPPET_DEST="$NGINX_SNIPPET_DIR/cache.conf"
NGINX_SNIPPET_BAK="$NGINX_SNIPPET_DIR/cache.conf.bak"

# 备份当前 web 目录
echo "备份当前网站文件..."
sudo cp -r "$WEB_ROOT" "$WEB_ROOT.backup_$TIMESTAMP"

# 清空目标目录
echo "清空目标目录..."
sudo rm -rf "$WEB_ROOT"/*

# 复制所有文件到 web 目录
echo "复制文件到 web 目录..."
sudo cp -r * "$WEB_ROOT"/

# 清理不该对外暴露的工程文件（会被 cp -r * 一并带过去）
echo "清理非站点文件..."
sudo rm -rf "$WEB_ROOT/nginx" \
            "$WEB_ROOT/deploy.sh" \
            "$WEB_ROOT/test.conf" \
            "$WEB_ROOT/index.back"

# 设置正确的文件权限
echo "设置文件权限..."
sudo find "$WEB_ROOT" -type f -name "*.html" -exec chmod 644 {} \;
sudo find "$WEB_ROOT" -type f -name "*.css" -exec chmod 644 {} \;
sudo find "$WEB_ROOT" -type f -name "*.js" -exec chmod 644 {} \;
sudo find "$WEB_ROOT" -type f -name "*.png" -exec chmod 644 {} \;
sudo find "$WEB_ROOT" -type f -name "*.jpg" -exec chmod 644 {} \;
sudo find "$WEB_ROOT" -type f -name "*.jpeg" -exec chmod 644 {} \;
sudo find "$WEB_ROOT" -type f -name "*.gif" -exec chmod 644 {} \;
sudo find "$WEB_ROOT" -type f -name "*.svg" -exec chmod 644 {} \;
sudo find "$WEB_ROOT" -type f -name "*.ico" -exec chmod 644 {} \;

# 设置目录权限
sudo find "$WEB_ROOT" -type d -exec chmod 755 {} \;

# 确保所有文件属于 nginx 用户
sudo chown -R nginx:nginx "$WEB_ROOT"/

# ==================== 同步 Nginx 缓存策略 ====================
if [ -f "$NGINX_SNIPPET_SRC" ]; then
    echo "同步 Nginx 缓存配置..."
    sudo mkdir -p "$NGINX_SNIPPET_DIR"
    if [ -f "$NGINX_SNIPPET_DEST" ]; then
        sudo cp "$NGINX_SNIPPET_DEST" "$NGINX_SNIPPET_BAK"
    fi
    sudo cp "$NGINX_SNIPPET_SRC" "$NGINX_SNIPPET_DEST"
fi

# 验证 Nginx 配置
echo "验证 Nginx 配置..."
if sudo nginx -t; then
    echo "Nginx 配置正确，重启服务..."
    sudo systemctl reload nginx
    # 检查 Nginx 状态
    if sudo systemctl is-active --quiet nginx; then
        echo "部署成功！Nginx 正在运行。"
    else
        echo "Nginx 启动失败，请检查配置。"
        sudo systemctl status nginx
    fi
else
    echo "Nginx 配置错误，已回滚缓存配置，请检查。"
    if [ -f "$NGINX_SNIPPET_BAK" ]; then
        sudo mv "$NGINX_SNIPPET_BAK" "$NGINX_SNIPPET_DEST"
    else
        sudo rm -f "$NGINX_SNIPPET_DEST"
    fi
    exit 1
fi

echo "部署完成！"

# ==================== 校验缓存响应头（仅提示，不影响部署结果） ====================
echo "校验缓存响应头..."
if curl -k -sI "https://127.0.0.1/" 2>/dev/null | grep -qi "cache-control: *no-cache"; then
    echo "缓存策略已生效：Cache-Control: no-cache"
else
    echo "警告：未检测到 Cache-Control: no-cache 响应头。"
    echo "      请确认站点 server 块中是否包含：include /etc/nginx/default.d/*.conf;"
    echo "      排查命令：sudo nginx -T | grep -n 'default.d'"
fi
