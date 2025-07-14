from django.urls import path
from Send_Email.views import send_email
urlpatterns = [
    path("send_email/", send_email),
]