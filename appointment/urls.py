from django.urls import path
from . import views

urlpatterns = [
    path('book/', views.book_appointment),
    path('my/', views.patient_appointments),
    path('doctor/', views.doctor_appointments),
    path('<int:pk>/status/', views.update_appointment_status),
]

