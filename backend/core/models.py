from django.db import models
from django.contrib.auth.models import User

class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    lifetime_words = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.user.username

class Word(models.Model):
    word = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.word

class Statistic(models.Model):
    total_words = models.PositiveBigIntegerField(default=0)
    total_time = models.PositiveBigIntegerField(default=0)

    def __str__(self):
        return f"Total Words Typed: {self.total_words} | Total Time Typed: {self.total_time}s"