# Generated by Django 3.1.5 on 2021-01-27 10:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz_app', '0006_auto_20210127_0849'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userquizreletion',
            old_name='timestamp',
            new_name='created_on',
        ),
        migrations.RemoveField(
            model_name='userquizreletion',
            name='completed',
        ),
        migrations.RemoveField(
            model_name='userquizreletion',
            name='correct_answers',
        ),
    ]