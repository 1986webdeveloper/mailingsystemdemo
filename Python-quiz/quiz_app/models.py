from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from django.dispatch import receiver

class Quiz(models.Model):
    name = models.CharField(max_length=1000)
    description = models.CharField(max_length=70)
    created_date = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return self.name

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    name = models.CharField(max_length=1000)
    slug = models.SlugField()
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def save(self, *args, **kwargs):
        value = self.name
        self.slug = slugify(value)
        super().save(*args, **kwargs)

    def answer_choice_to_string(self, question_id):
        return Answer.objects.get(question_id = question_id).text

    def __str__(self):
        return self.name

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name="choices",on_delete=models.CASCADE)
    choice = models.CharField("Choice", max_length=50)

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=1000)

    def __str__(self):
        return self.text

class Userquizreletion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)

class UsersAnswer(models.Model):
    quiz_taker = models.ForeignKey(Userquizreletion, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE, null=True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='profile',on_delete=models.CASCADE)
    email_verified = models.BooleanField(default = False)
