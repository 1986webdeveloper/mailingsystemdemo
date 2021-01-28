from django.db import models
from django.contrib.auth.models import User,Group

class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='profile',on_delete=models.CASCADE)
    email_verified = models.BooleanField(default = False)
