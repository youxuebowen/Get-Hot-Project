from django import forms
from .models import UserTable
from django.contrib.auth.hashers import check_password
class ExcelUploadForm(forms.Form):
    excel_file = forms.FileField(
        label='选择Excel文件',
        help_text='请上传包含用户名、邮箱和校验码的Excel文件',
        widget=forms.FileInput(attrs={'accept': '.xlsx,.xls'})
    )


class LoginForm(forms.Form):
    account = forms.CharField(
        label='账号',
        max_length=50,
        widget=forms.TextInput(attrs={'class': 'login-input', 'placeholder': '请输入用户名'})
    )
    password = forms.CharField(
        label='密码',
        widget=forms.PasswordInput(attrs={'class': 'login-input', 'placeholder': '请输入密码'})
    )
    def clean(self):
        cleaned_data = super().clean()
        account = cleaned_data.get('account')
        password = cleaned_data.get('password')

        if account and password:
            try:
                user = UserTable.objects.get(account=account)
                if not check_password(password, user.password):
                    raise forms.ValidationError('密码不正确')
                if not user.is_active:
                    raise forms.ValidationError('账号已禁用')
                cleaned_data['user'] = user
            except UserTable.DoesNotExist:
                raise forms.ValidationError('账号不存在')

        return cleaned_data