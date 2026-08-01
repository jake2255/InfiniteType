from django.shortcuts import render
from .serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
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
        lifetime_words = user.account.lifetime_words
        
        return Response({
            'token': token.key,
            'username': username,
            'lifetime_words': lifetime_words,
        }, status=200)

class LifetimeWordCountView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        words_typed = request.data.get('words_typed', 0)

        try:
            words_typed = int(words_typed)
        except:
            return Response({"error": "invalid word count value"}, status=400)

        account = request.user.account
        account.lifetime_words += words_typed
        account.save()

        return Response({'lifetime_words': account.lifetime_words}, status=200)
    