# Generated by Django 5.2.4 on 2025-07-22 06:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='supplier',
        ),
    ]
