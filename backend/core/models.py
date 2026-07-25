from django.db import models
from django.contrib.auth.models import User

class GlobalStats(models.Model):
    total_words = models.PositiveBigIntegerField(default=0)

    def __str__(self):
        return f"Global Total Words: {self.total_words}"

class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    lifetime_words = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.user.username