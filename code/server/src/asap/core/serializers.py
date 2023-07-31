from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from .models import Version, Profile, Rank, Department, Application, Committee, \
    CommitteeCandidate, Recommend, Recommendation, Document, Alert, ApplicationStep


class VersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Version
        fields = ['major', 'minor', 'patch']


class RankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rank
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']


class DepartmentSerializer(serializers.ModelSerializer):
    department_head = UserSerializer(read_only=True)

    class Meta:
        model = Department
        fields = ['department_head', 'name']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    rank = RankSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    picture_url = SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'user', 'rank', 'department', 'joined_date',
                  'degree', 'picture_url', 'stage_due_date', 'employment_stage']

    def get_picture_url(self, obj):
        if obj.picture:
            base_url = self.context['request'].build_absolute_uri('/')
            picture_url = obj.picture.url
            absolute_url = base_url + 'api' + picture_url
            return absolute_url
        else:
            return None


class ApplicationSerializer(serializers.ModelSerializer):
    creator = ProfileSerializer(read_only=True)
    applicant = ProfileSerializer(read_only=True)
    desired_rank = RankSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'creator', 'applicant', 'application_state', 'department', 'desired_rank',
                  'created_at', 'updated_at', 'is_done', 'state_Application']


class ApplicationStepSerializer(serializers.ModelSerializer):
    application = ApplicationSerializer(read_only=True)

    class Meta:
        model = ApplicationStep
        fields = '__all__'


class RecommendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommend
        fields = '__all__'


class CommitteeCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommitteeCandidate
        fields = '__all__'


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

        def get_file_url(self, obj):
            if obj.file:
                return self.context['request'].build_absolute_uri(obj.file.url)
            else:
                return None


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = '__all__'


class AlertSerializer(serializers.ModelSerializer):
    user = UserSerializer(source='user_id')

    class Meta:
        model = Alert
        fields = ['user', 'alert_type_id', 'is_read', 'statusAlert', 'insert_time', 'id']


class CommitteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Committee
        fields = '__all__'
