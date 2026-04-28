from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.username', read_only=True)
    slot_date = serializers.CharField(source='slot.date', read_only=True)
    slot_time = serializers.CharField(source='slot.start_time', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient_name',
            'doctor_name',
            'slot_date',
            'slot_time',
            'status',
            'created_at'
        ]