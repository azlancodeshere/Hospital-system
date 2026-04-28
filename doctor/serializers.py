from rest_framework import serializers
from .models import DoctorProfile, TimeSlot

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = [
            'id',
            'date',
            'start_time',
            'end_time',
            'is_booked'
        ]

class DoctorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    slots = TimeSlotSerializer(many=True, read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            'id',
            'username',
            'email',
            'phone',
            'specialization',
            'experience_years',
            'consultation_fee',
            'bio',
            'slots'
        ]