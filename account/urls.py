from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
     path('get_username/', views.get_username),
     path('profile/', views.patient_profile), 
]