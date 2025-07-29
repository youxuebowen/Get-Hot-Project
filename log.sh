#!/bin/bash

LOG_FILE="/root/hot-tech-capture/logfile.log"
cve_spider = '/root/hot-tech-capture/cve_spider.log'
description = '/root/hot-tech-capture/description.log'
cvedescription = '/root/hot-tech-capture/cvedescription.log'
# 清空日志（推荐方式）
truncate -s 0 "$LOG_FILE"
truncate -s 0 "$cve_spider"
truncate -s 0 "$description"
truncate -s 0 "$cvedescription"
# 或者删除并重建（可选）
# rm -f "$LOG_FILE" && touch "$LOG_FILE"

# 可选：记录清理操作
echo "[$(date)] Log file cleared." >> "$LOG_FILE"
echo "[$(date)] Log file cleared." >> "$cve_spider"
echo "[$(date)] Log file cleared." >> "$description"
echo "[$(date)] Log file cleared." >> "$cvedescription"
