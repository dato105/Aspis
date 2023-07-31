# Generated by Django 3.2.9 on 2022-06-14 12:36

import datetime
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('application_state', models.JSONField(default=None, max_length=10000)),
                ('is_done', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.TextField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Rank',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.TextField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Version',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('major', models.IntegerField(verbose_name=django.core.validators.MinValueValidator(0))),
                ('minor', models.IntegerField(verbose_name=django.core.validators.MinValueValidator(0))),
                ('patch', models.IntegerField(verbose_name=django.core.validators.MinValueValidator(1))),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('joined_date', models.DateField(default=datetime.date.today, verbose_name='Date')),
                ('degree', models.TextField(choices=[("פרופ'", 'Prof'), ('מר.', 'Mr'), ("גב'", 'Mis'), ('ד"ר', 'Doc')], default=None, max_length=50)),
                ('department', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='department', to='core.department')),
                ('rank', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='rank', to='core.rank')),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ApplicationStep',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('step_name', models.TextField(choices=[('APPLICATION_CLOSE', 'Step 0'), ('DEPT_HEAD_CREATE_NEW_APPLICATION', 'Step 1'), ('DEPT_HEAD_FEEDBACK', 'Step 2'), ('ADMIN_FEEDBACK', 'Step 3'), ('ADMIN_VERIFY_APPLICATION', 'Step 4'), ('CHAIR_HEAD_FEEDBACK', 'Step 5'), ('CHAIR_HEAD_APPROVE_APPLICATION', 'Step 6'), ('QUALITY_DEPT_UPLOAD_FILES', 'Step 7')], max_length=70)),
                ('currentStep', models.BooleanField(default=False)),
                ('can_update', models.BooleanField(default=False)),
                ('can_cancel', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('application', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='steps', to='core.application')),
            ],
        ),
        migrations.AddField(
            model_name='application',
            name='applicant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applicant', to='core.profile'),
        ),
        migrations.AddField(
            model_name='application',
            name='creator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='creator', to='core.profile'),
        ),
        migrations.AddField(
            model_name='application',
            name='department',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='department_id', to='core.department'),
        ),
        migrations.AddField(
            model_name='application',
            name='desired_rank',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='desired_rank', to='core.rank'),
        ),
    ]
