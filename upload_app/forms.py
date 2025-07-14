from django import forms

class ExcelUploadForm(forms.Form):
    excel_file = forms.FileField(
        label='选择Excel文件',
        help_text='请上传包含用户名、邮箱和校验码的Excel文件',
        widget=forms.FileInput(attrs={'accept': '.xlsx,.xls'})
    )