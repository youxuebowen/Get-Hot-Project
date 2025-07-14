from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=100, verbose_name="用户名")
    email = models.EmailField(verbose_name="邮箱")
    verification_code = models.CharField(max_length=100, verbose_name="校验码")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = '用户表'
        verbose_name = "用户"
        verbose_name_plural = "用户"

    def __str__(self):
        return self.username