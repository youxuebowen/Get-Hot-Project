from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse
from functools import wraps

# 需要修改路径


def admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        # 检查用户是否已登录
        if not request.session.get('is_login', False):
            return redirect(f'{reverse("upload_app:login")}?message=用户身份过期，请重新登陆')
        
        # 检查用户是否为管理员
        if not request.session.get('is_admin', False):
            return JsonResponse({'error': '权限不足，需要管理员权限'}, status=403)
        
        return view_func(request, *args, **kwargs)
    return _wrapped_view


def login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        # 检查用户是否已登录
        if not request.session.get('is_login', False):
            return redirect(f'{reverse("upload_app:login")}?message=用户身份过期，请重新登陆')
        
        return view_func(request, *args, **kwargs)
    return _wrapped_view