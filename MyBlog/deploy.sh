#!/bin/bash

# 部署脚本
echo "开始部署..."

# 获取当前时间戳
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# ==================== 配置 ====================
WEB_ROOT="/usr/share/nginx/html"
SITE_DOMAIN="www.mylog.world"          # 用于部署后自检缓存响应头

# 仓库中的 Nginx 配置文件 | 服务器目标路径（同步前备份，nginx -t 失败则回滚）
NGINX_CONFIG_MAP=(
    "nginx/cache.conf|/etc/nginx/default.d/cache.conf"
    "nginx/blog.conf|/etc/nginx/conf.d/blog.conf"
)
NGINX_BACKUP_SUFFIX=".deploy.bak"

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

# ==================== 同步 Nginx 配置 ====================
echo "同步 Nginx 配置..."
for item in "${NGINX_CONFIG_MAP[@]}"; do
    src="${item%%|*}"
    dest="${item##*|}"
    if [ ! -f "$src" ]; then
        echo "  跳过（仓库中不存在）: $src"
        continue
    fi
    echo "  $src -> $dest"
    sudo mkdir -p "$(dirname "$dest")"
    sudo rm -f "${dest}${NGINX_BACKUP_SUFFIX}"
    if [ -f "$dest" ]; then
        sudo cp "$dest" "${dest}${NGINX_BACKUP_SUFFIX}"
    fi
    sudo cp "$src" "$dest"
done

# 验证 Nginx 配置
echo "验证 Nginx 配置..."
if sudo nginx -t; then
    echo "Nginx 配置正确，重启服务..."
    sudo systemctl reload nginx
    if sudo systemctl is-active --quiet nginx; then
        echo "部署成功！Nginx 正在运行。"
        for item in "${NGINX_CONFIG_MAP[@]}"; do
            sudo rm -f "${item##*|}${NGINX_BACKUP_SUFFIX}"
        done
    else
        echo "Nginx 启动失败，请检查配置。"
        sudo systemctl status nginx
    fi
else
    echo "Nginx 配置错误，回滚本次同步的配置："
    for item in "${NGINX_CONFIG_MAP[@]}"; do
        dest="${item##*|}"
        if [ -f "${dest}${NGINX_BACKUP_SUFFIX}" ]; then
            sudo mv "${dest}${NGINX_BACKUP_SUFFIX}" "$dest"
            echo "  已还原 $dest"
        else
            sudo rm -f "$dest"
            echo "  已移除 $dest"
        fi
    done
    exit 1
fi

echo "部署完成！"

# ==================== 校验缓存响应头（仅提示，不影响部署结果） ====================
# 用真实域名 + --resolve 指向本机，保证携带正确的 SNI / Host，命中站点 server 块。
# --noproxy 避免系统代理干扰；reload 是新 worker 逐步接管的过程，
# 刚 reload 完旧 worker 仍可能按旧配置服务，因此这里带重试，避免误报。
CURL_RESOLVE="$SITE_DOMAIN:443:127.0.0.1"

fetch_cache_header() {
    curl --noproxy '*' -k -s -o /dev/null -D - "$1" --resolve "$CURL_RESOLVE" 2>/dev/null \
        | grep -i "^cache-control" | tr -d '\r'
}

echo "校验缓存响应头（$SITE_DOMAIN）..."
cache_header=""
for attempt in 1 2 3 4 5 6; do
    cache_header=$(fetch_cache_header "https://$SITE_DOMAIN/")
    [ -n "$cache_header" ] && break
    sleep 0.5
done

if [ -n "$cache_header" ]; then
    echo "  /                  -> $cache_header"
    for asset in "/js/articles-data.js" "/css/style.css"; do
        echo "  $asset -> $(fetch_cache_header "https://$SITE_DOMAIN$asset")"
    done
    echo "缓存策略已生效。"
else
    echo "警告：重试后仍未检测到 Cache-Control，请手动确认："
    echo "      curl -k -sI \"https://$SITE_DOMAIN/\" --resolve \"$CURL_RESOLVE\""
    echo "      并确认 server 块包含：include /etc/nginx/default.d/*.conf;"
    echo "      排查命令：sudo nginx -T | grep -n 'default.d'"
fi
