# Generated by Django 3.1.5 on 2021-01-27 11:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz_app', '0007_auto_20210127_1028'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quiz',
            name='questions_count',
        ),
    ]