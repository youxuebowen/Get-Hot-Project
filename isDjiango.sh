#!/bin/bash

# 初始化 conda（必须）
source /root/miniconda3/etc/profile.d/conda.sh
conda activate GetHotProjects

# 检查是否监听中
if ! ss -tulnp | grep :18080 > /dev/null; then
    echo "$(date) - Django runserver is down! Restarting..." >> /root/django_watchdog.log  

    cd /root/hot-tech-capture/ || exit 1

    # 后台运行并禁止重载，日志输出
    nohup python manage.py runserver 0.0.0.0:18080 --noreload >> /root/django_runserver.log 2>&1 &
fi
