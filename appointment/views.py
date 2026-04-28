from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Appointment
from .serializers import AppointmentSerializer
from doctor.models import DoctorProfile, TimeSlot

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_appointment(request):
    slot_id = request.data.get('slot_id')
    doctor_id = request.data.get('doctor_id')
    try:
        slot = TimeSlot.objects.get(id=slot_id, is_booked=False)
        doctor = DoctorProfile.objects.get(id=doctor_id)
        appointment = Appointment.objects.create(
            patient=request.user, doctor=doctor, slot=slot, status='pending'
        )
        slot.is_booked = True
        slot.save()
        return JsonResponse({'message': 'Appointment booked!', 'appointment_id': appointment.id}, status=201)
    except TimeSlot.DoesNotExist:
        return JsonResponse({'error': 'Slot not available'}, status=404)
    except DoctorProfile.DoesNotExist:
        return JsonResponse({'error': 'Doctor not found'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_appointments(request):
    appointments = Appointment.objects.filter(patient=request.user)
    serializer = AppointmentSerializer(appointments, many=True)
    return JsonResponse({'appointments': serializer.data}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_appointments(request):
    try:
        profile = DoctorProfile.objects.get(user=request.user)
        appointments = Appointment.objects.filter(doctor=profile)
        serializer = AppointmentSerializer(appointments, many=True)
        return JsonResponse({'appointments': serializer.data}, status=200)
    except DoctorProfile.DoesNotExist:
        return JsonResponse({'error': 'Doctor profile not found'}, status=404)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_appointment_status(request, pk):
    try:
        appointment = Appointment.objects.get(id=pk)
        status = request.data.get('status')
        if status not in ['confirmed', 'rejected']:
            return JsonResponse({'error': 'Invalid status'}, status=400)
        appointment.status = status
        appointment.save()
        return JsonResponse({'message': f'Appointment {status}!'}, status=200)
    except Appointment.DoesNotExist:
        return JsonResponse({'error': 'Appointment not found'}, status=404)