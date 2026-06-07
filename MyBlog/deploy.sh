#!/bin/bash

# 部署脚本
echo "开始部署..."

# 获取当前时间戳
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 备份当前 web 目录
echo "备份当前网站文件..."
sudo cp -r /usr/share/nginx/html /usr/share/nginx/html.backup_$TIMESTAMP

# 清空目标目录
echo "清空目标目录..."
sudo rm -rf /usr/share/nginx/html/*

# 复制所有文件到 web 目录
echo "复制文件到 web 目录..."
sudo cp -r * /usr/share/nginx/html/

# 设置正确的文件权限
echo "设置文件权限..."
sudo find /usr/share/nginx/html -type f -name "*.html" -exec chmod 644 {} \;
sudo find /usr/share/nginx/html -type f -name "*.css" -exec chmod 644 {} \;
sudo find /usr/share/nginx/html -type f -name "*.js" -exec chmod 644 {} \;
sudo find /usr/share/nginx/html -type f -name "*.png" -exec chmod 644 {} \;
sudo find /usr/share/nginx/html -type f -name "*.jpg" -exec chmod 644 {} \;
sudo find /usr/share/nginx/html -type f -name "*.jpeg" -exec chmod 644 {} \;
sudo find /usr/share/nginx/html -type f -name "*.gif" -exec chmod 644 {} \;
sudo find /usr/share/nginx/html -type f -name "*.svg" -exec chmod 644 {} \;
sudo find /usr/share/nginx/html -type f -name "*.ico" -exec chmod 644 {} \;

# 设置目录权限
sudo find /usr/share/nginx/html -type d -exec chmod 755 {} \;

# 确保所有文件属于 nginx 用户
sudo chown -R nginx:nginx /usr/share/nginx/html/

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
    echo "Nginx 配置错误，请检查配置文件。"
    exit 1
fi

echo "部署完成！"