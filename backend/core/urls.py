from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register_user'),
    path('login/', AccountLoginView.as_view(), name='account_login'),
    path('get_words/', GetRandomWordsView.as_view(), name='get_words'),
    path('update_count/', LifetimeWordCountView.as_view(), name='update_count'),
]