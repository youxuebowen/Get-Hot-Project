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

class HotProjects(models.Model):
    # github项目名/文章标题
    name = models.CharField(max_length=100)
    #github项目的readme内容/文章的完整内容
    content = models.TextField()
    #content的精简内容
    description = models.TextField()
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