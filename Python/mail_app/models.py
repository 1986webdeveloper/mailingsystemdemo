from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User
from mptt.models import MPTTModel, TreeForeignKey


class Message(MPTTModel):
   subject = models.CharField(max_length = 100,null=True,blank = True)
   message = models.CharField(max_length = 250)
   to_user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='to_user',null=True,blank = True)
   from_user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='from_user',null=True,blank = True)
   created_on = models.DateTimeField(auto_now_add=True,null=True,blank = True)
   has_readed = models.BooleanField(default = False)
   parent = TreeForeignKey('self',on_delete=models.CASCADE,related_name='child_message',blank=True,null=True)
