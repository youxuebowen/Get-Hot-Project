import pandas as pd
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpRequest
from Send_Email.models import HotProjects
# Create your views here.
# 视围
# 所谓的视图 其实就是python函数
# 视围函数有2个要求:
# 1. 视图函数的第一个参数就是接收请求。这个请求其实就是HttpRequest的类对象
# 2. 必须返回一个响应
def send_email(request):
    if request.method == "POST":
        # 接收数据
        name = request.POST.get("name")
        content = request.POST.get("content")
        # 处理数据
        # 检查是否有文件上传
        if 'excel_file' in request.FILES:
            excel_file = request.FILES['excel_file']
            try:
                # 使用 pandas 读取 Excel 文件
                df = pd.read_excel(excel_file)
            except Exception as e:
                # 处理读取 Excel 文件时的异常
                return render(request, "read_excel_error.html" )
        # 发送邮件

        # 发送成功
        # 发送失败
        # 响应

        # 修改发送状态为已发送,从request得到选中的项目id
        HOT_PROJECTS = HotProjects().objects.filter(id=content) # 过滤出未发送的项目
        for project in HOT_PROJECTS:
            project.if_sent = 1 # 修改发送状态为已发送
            project.save()
        return render(request, "send_email.html", {"name": name,  "content": content})
    else:
        return render(request, "send_email.html")
