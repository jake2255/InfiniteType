from django.shortcuts import render
from .serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "successfully registered user"}, status=201) 
               
        return Response(serializer.errors, status=400)
    
class AccountLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if not user:
            return Response({"error": "failed to login"}, status=401) 
            
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'username': username
        }, status=200)