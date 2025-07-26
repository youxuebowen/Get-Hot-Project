#!/bin/bash

# 获取当前日期
current_date=$(date "+%Y-%m-%d")
# 获取前一天日期（Linux/macOS 通用）
previous_date=$(date -d "yesterday" "+%Y-%m-%d")

# 发送请求
curl -X GET "http://139.224.114.224:18080/api/v1/cve_spider?dateFrom=${previous_date}\&dateTo=${current_date}"

	
