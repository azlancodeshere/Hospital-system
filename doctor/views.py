from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import DoctorProfile, TimeSlot
from .serializers import DoctorSerializer, TimeSlotSerializer
import json

# List all doctors
def doctor_list(request):
    if request.method == 'GET':
        doctors = DoctorProfile.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)
    return JsonResponse({'error': 'Method not allowed'}, status=405)


# Single doctor detail
def doctor_detail(request, pk):
    if request.method == 'GET':
        try:
            doctor = DoctorProfile.objects.get(pk=pk)
            serializer = DoctorSerializer(doctor)
            return JsonResponse(serializer.data, status=200)
        except DoctorProfile.DoesNotExist:
            return JsonResponse({'error': 'Doctor not found'}, status=404)


# Doctor updates own profile
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def doctor_profile_update(request):
    try:
        profile = DoctorProfile.objects.get(user=request.user)
        serializer = DoctorSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Profile updated!'}, status=200)
        return JsonResponse(serializer.errors, status=400)
    except DoctorProfile.DoesNotExist:
        return JsonResponse({'error': 'Profile not found'}, status=404)


# Doctor adds time slot
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_slot(request):
    try:
        profile = DoctorProfile.objects.get(user=request.user)
        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(doctor=profile)
            return JsonResponse({'message': 'Slot added!'}, status=201)
        return JsonResponse(serializer.errors, status=400)
    except DoctorProfile.DoesNotExist:
        return JsonResponse({'error': 'Doctor profile not found'}, status=404)


# Get all available slots of a doctor
def doctor_slots(request, pk):
    if request.method == 'GET':
        try:
            doctor = DoctorProfile.objects.get(pk=pk)
            slots = TimeSlot.objects.filter(doctor=doctor, is_booked=False)
            serializer = TimeSlotSerializer(slots, many=True)
            return JsonResponse({'slots': serializer.data}, status=200)
        except DoctorProfile.DoesNotExist:
            return JsonResponse({'error': 'Doctor not found'}, status=404)