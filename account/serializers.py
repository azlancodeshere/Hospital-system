from rest_framework import serializers
from django.contrib.auth import get_user_model
from doctor.models import DoctorProfile

class UserSerializer(serializers.ModelSerializer):
  
    specialization = serializers.CharField(required=False, allow_blank=True, write_only=True)
    experience_years = serializers.IntegerField(required=False, default=0, write_only=True)
    consultation_fee = serializers.DecimalField(required=False, default=0, max_digits=8, decimal_places=2, write_only=True)
    password2 = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "username",
            "email",
            "password",
            "password2",
            "role",
            "phone",
            "gender",
            "specialization",
            "experience_years",
            "consultation_fee",
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        specialization = validated_data.pop('specialization', '')
        experience_years = validated_data.pop('experience_years', 0)
        consultation_fee = validated_data.pop('consultation_fee', 0)
        validated_data.pop('password2', None)

        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'patient'),
            phone=validated_data.get('phone', ''),
            gender=validated_data.get('gender', ''),
        )

        if user.role == 'doctor':
            DoctorProfile.objects.create(
                user=user,
                specialization=specialization,
                experience_years=experience_years,
                consultation_fee=consultation_fee,
            )

        return user