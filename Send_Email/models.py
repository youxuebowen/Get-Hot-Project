from django.apps import AppConfig
from django.db import models

# Create your models here.
"""
我们的模型类 需要继承自 models.Model
系统会自动为我们添加一个主键 -- id
字段
字段名=model.类型(选项)

字段名其实就是数据表的字段名
字段名不要使用 python,mysql等关键字
"""

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
    tags = models.TextField()
    # 1表示github，2表示文章
    type = models.IntegerField()
    #  0表示未发送过，1表示发送过。默认0
    if_sent = models.IntegerField(0)
    # 数据创建时间
    create_time = models.DateTimeField(auto_now_add=True)
    # 数据更新时间
    update_time = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = '热点表'

