from django.db import models
from django.contrib.auth.hashers import make_password
# Create your models here.


class UserTable(models.Model):
    account = models.CharField(max_length=50, unique=True, verbose_name='账号')
    password = models.CharField(max_length=128, verbose_name='密码')
    is_admin = models.BooleanField(default=False, verbose_name='是否是管理员')
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    last_login = models.DateTimeField(null=True, blank=True, verbose_name='最后登录时间')
    is_active = models.BooleanField(default=True, verbose_name='是否激活')

    class Meta:
        db_table = 'user_table'
        verbose_name = '用户表'
        verbose_name_plural = '用户表'
        ordering = ['-create_time']

    def save(self, *args, **kwargs):
        # 保存时自动对密码进行哈希处理
        if not self.password.startswith('pbkdf2_sha256$'):
            self.password = make_password(self.password)  # 哈希密码
        super().save(*args, **kwargs)

    def __str__(self):
        return self.account
class HotProjects(models.Model):
    # github项目名/文章标题
    name = models.CharField(max_length=100)
    #github项目的readme内容/文章的完整内容
    content = models.TextField()
    #content的精简内容
    # description = models.TextField()
    description = models.TextField(null=True, blank=True)  # 允许 NULL 和空字符串
    #  github项目的原始url/文章的原始url
    url = models.URLField()
    # 给github项目 / 文章打标签
    tag = models.TextField()
    # 1表示github，2表示文章
    type = models.IntegerField()
    #  0表示未发送过，1表示发送过。默认0
    if_sent = models.IntegerField(0)
    # 0表示未被选择，1表示被选择。默认0
    if_chosen = models.IntegerField(0)
    # 数据创建时间
    created_time = models.DateTimeField(auto_now_add=True)
    # 数据更新时间
    updated_time = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'HotProjects'
class CveSpider(models.Model):
    # 漏洞查询的表，用于存储漏洞信息
    id = models.AutoField(primary_key=True)
    cve_id = models.CharField(max_length=255)
    description = models.TextField()
    description_cn = models.TextField()
    url = models.CharField(max_length=255)
    if_sent = models.IntegerField()
    if_chosen = models.IntegerField()
    published_time = models.CharField(max_length=255)
    created_time = models.DateTimeField(null=True, auto_now_add=True)
    updated_time = models.DateTimeField(null=True, auto_now=True)

    class Meta:
        db_table = 'cve_spider'