from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer
import json
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            user = serializer.save()
            return JsonResponse({
                'message': f'{user.role.capitalize()} registered successfully!',
                'role': user.role
            }, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'role': user.role,
                'username': user.username
            })
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_username(request):
    user = request.user
    return Response({'username': user.username})



@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def patient_profile(request):
    user = request.user
    if request.method == 'GET':
        return Response({
            'username': user.username,
            'email': user.email,
            'phone': user.phone or '',
            'gender': user.gender or '',
            'role': user.role,
        })
    if request.method == 'PUT':
        user.phone = request.data.get('phone', user.phone)
        user.gender = request.data.get('gender', user.gender)
        user.email = request.data.get('email', user.email)
        user.save()
        return Response({'message': 'Profile updated successfully!'})