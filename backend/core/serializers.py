from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, data):
        new_user = User.objects.create_user(**data)
        Account.objects.create(user=new_user)
        return new_user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']