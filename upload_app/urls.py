from django.urls import path
from . import views

app_name = 'upload_app'

urlpatterns = [
    # path(路由，视图名)
    path('apps/v1/upload_excel', views.upload_excel, name='upload_excel'),
    path('apps/v1/index', views.index, name='index'),
    # path('apps/v1/query_hot_projects', views.query_hot_projects, name='query_hot_projects'),
    # path('apps/v1/get_github', views.get_github, name='get_github'),
    # path('apps/v1/run_article_functions', views.run_article_functions, name='run_article_functions'),
    path('apps/v1/get_article_descriptions', views.get_article_descriptions, name='get_article_descriptions'),
    path('api/v1/cve_email_send', views.cve_email_send, name='cve_email_send'),
    path('apps/v1/cve_info_list', views.cve_info_list, name='cve_info_list'),
    path('api/v1/cve_num_list', views.cve_num_list, name='cve_num_list'),
    path('api/v1/github_url', views.github_url, name='github_url'),
    path('api/v1/save_github_readme', views.save_github_readme, name='save_github_readme'),
    # path('upload/', views.upload_excel, name='upload'),
    path('api/v1/get_article_url', views.get_article_url, name='get_article_url'),



    # 前端页面
    path('api/v1/content-table/', views.content_table_api, name='content-table-api'),
    path('api/v1/fail/', views.fail, name='fail'),
    path('api/v1/success/', views.success, name='success'),
    path('api/v1/update-chosen/', views.update_chosen_api, name='update_chosen_api'),
    path('api/v1/get-chosen-content/', views.get_chosen_content_api, name='get_chosen_content_api'),
    # path('api/v1/cve_info_list', views.cve_info_list, name='cve_info_list'),
]