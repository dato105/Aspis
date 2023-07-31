# Generated by Django 4.2 on 2023-05-28 08:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0015_remove_application_department_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='department',
            name='department_head',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE,
                                    related_name='department_head', to=settings.AUTH_USER_MODEL),
        ),
    ]
