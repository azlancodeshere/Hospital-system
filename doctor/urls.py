from django.urls import path
from . import views

urlpatterns = [
    path('', views.doctor_list),
    path('<int:pk>/', views.doctor_detail),
    path('profile/update/', views.doctor_profile_update),
    path('slots/add/', views.add_slot),
    path('<int:pk>/slots/', views.doctor_slots),
]