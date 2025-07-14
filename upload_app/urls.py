from django.urls import path
from . import views

app_name = 'upload_app'

urlpatterns = [
    path('', views.upload_excel, name='upload'),
]