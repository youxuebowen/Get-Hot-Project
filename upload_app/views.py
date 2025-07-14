

# Create your views here.
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import ExcelUploadForm
from .models import User
from openpyxl import load_workbook
from io import BytesIO


def upload_excel(request):
    if request.method == 'POST':
        form = ExcelUploadForm(request.POST, request.FILES)
        if form.is_valid():
            excel_file = request.FILES['excel_file']

            try:
                # 读取Excel文件
                wb = load_workbook(filename=BytesIO(excel_file.read()))
                sheet = wb.active

                # 检查表头
                headers = [cell.value for cell in sheet[1]]
                expected_headers = ['用户名', '邮箱', '校验码']
                if headers != expected_headers:
                    messages.error(request, f'Excel格式不正确，请确保表头为：{", ".join(expected_headers)}')
                    return redirect('upload')

                # 处理数据
                success_count = 0
                for row in sheet.iter_rows(min_row=2, values_only=True):
                    username, email, verification_code = row

                    # 创建用户记录
                    User.objects.create(
                        username=username,
                        email=email,
                        verification_code=verification_code
                    )
                    success_count += 1

                messages.success(request, f'成功导入{success_count}条用户数据！')
                return redirect('upload')

            except Exception as e:
                messages.error(request, f'处理Excel文件时出错: {str(e)}')
    else:
        form = ExcelUploadForm()

    return render(request, 'upload_app/upload.html', {'form': form})