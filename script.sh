#!/bin/bash
# 这个无所谓，直接curl就行）
source /root/miniconda3/etc/profile.d/conda.sh
conda activate GetHotProjects
# 进入项目目录
cd hot-tech-capture
# 调用接口（示例：GET 请求）
curl -X GET http://139.224.114.224:18080/api/v1/save_github_readme	

