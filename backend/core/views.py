from django.shortcuts import render
from .serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate
import random

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

class GetRandomWordsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        word_ids = list(Word.objects.values_list('id', flat=True))

        sample_size = min(len(word_ids), 25)
        if sample_size == 0:
            return Response({'words': []}, status=200)

        random_ids = random.sample(word_ids, sample_size)
        random_words = list(Word.objects.filter(id__in=random_ids).values_list('word', flat=True))
        random.shuffle(random_words)
            
        return Response({'words': random_words}, status=200)

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

class GlobalLeaderboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        top_accounts = Account.objects.select_related('user').order_by('-lifetime_words')[:5]
        leaderboard_data = []
        
        for rank, account in enumerate(top_accounts, start=1):
            leaderboard_data.append({
                'rank': rank,
                'username': account.user.username,
                'lifetime_words': account.lifetime_words,
            })

        return Response({'leaderboard_data': leaderboard_data}, status=200)