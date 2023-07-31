import os
from functools import reduce
from operator import or_

from django.conf import settings
from django.contrib.auth import logout, get_user_model
from django.contrib.sites import requests
from django.core.mail.backends import console
from django.db import transaction
from django.http import HttpResponse, FileResponse, JsonResponse, HttpResponseBadRequest
from django.utils import timezone
from rest_framework import status, generics
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from django.db.models import Q

from .applications.fs_utils import copy_to_application_directory, get_document, delete_file_from_app_dir

from core.applications.utils import create_application_directory
from core.decorators import authorized_roles
from core.email_patterns.emails_patterns import emails_patterns
from core.mail import send_email
from core.models import Version, Profile, Rank, Application, ApplicationStep, Step, Alert, Committee, Document, \
    Recommend, Recommendation, CommitteeCandidate, States, CommitteeType
from core.roles import Role
from core.serializers import VersionSerializer, ProfileSerializer, RankSerializer, ApplicationSerializer, \
    AlertSerializer, ApplicationStepSerializer, CommitteeSerializer, CommitteeCandidateSerializer
from datetime import date, timedelta, datetime
from django.contrib.auth.models import Group


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN, Role.ASAP_DEPT_HEAD, Role.ASAP_APPT_CHAIR, Role.ASAP_DEPT_MEMBER,
                         Role.ASAP_QUALITY_DEPT])
def logout_user(request):
    logout(request)
    return Response(True, status=status.HTTP_200_OK)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN, Role.ASAP_DEPT_HEAD, Role.ASAP_APPT_CHAIR, Role.ASAP_DEPT_MEMBER,
                         Role.ASAP_QUALITY_DEPT])
def get_current_user(request):
    user = request.user
    roles = [row['name'] for row in user.groups.values('name')]

    profile = Profile.objects.get(user=user.id)
    serializer = ProfileSerializer(profile, context={'request': request})
    content = {
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'roles': roles,
        'picture': serializer.data.get('picture_url'),
        'department': serializer.data.get('rank').get('name'),
    }
    return Response(content, status=status.HTTP_200_OK)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN, Role.ASAP_DEPT_HEAD, Role.ASAP_APPT_CHAIR, Role.ASAP_DEPT_MEMBER,
                         Role.ASAP_QUALITY_DEPT])
def get_current_version(request):
    version = Version.objects.get(pk=1)
    serializer = VersionSerializer(version)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN, Role.ASAP_DEPT_HEAD, Role.ASAP_APPT_CHAIR, Role.ASAP_DEPT_MEMBER,
                         Role.ASAP_QUALITY_DEPT])
def get_application(request, application_id):
    application = Application.objects.get(pk=application_id)
    serializer = ApplicationSerializer(application)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authorized_roles(roles=[Role.ASAP_ADMIN, Role.ASAP_DEPT_HEAD, Role.ASAP_APPT_CHAIR, Role.ASAP_DEPT_MEMBER,
                         Role.ASAP_QUALITY_DEPT])
def get_cv(request, application_id):
    return get_document(application_id, 'cv_filename')


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN, Role.ASAP_DEPT_HEAD, Role.ASAP_APPT_CHAIR, Role.ASAP_DEPT_MEMBER,
                         Role.ASAP_QUALITY_DEPT])
def get_letter(request, application_id):
    return get_document(application_id, 'letter_filename')


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def landing_page_applications(request):
    newApplications = ApplicationStep.objects.filter(step_name='DEPT_HEAD_CREATE_NEW_APPLICATION').filter(
        currentStep=True)
    nApplications = Application.objects.filter(steps__in=newApplications)
    nSerializer = ApplicationSerializer(nApplications, many=True)

    openSteps = ['DEPT_HEAD_FEEDBACK', 'ADMIN_FEEDBACK', 'ADMIN_VERIFY_APPLICATION', 'CHAIR_HEAD_FEEDBACK']
    openApplications = ApplicationStep.objects.filter(step_name__in=openSteps).filter(currentStep=True)
    oApplications = Application.objects.filter(steps__in=openApplications)
    oSerializer = ApplicationSerializer(oApplications, many=True)

    closeSteps = ['APPLICATION_CLOSE', 'CHAIR_HEAD_APPROVE_APPLICATION', 'QUALITY_DEPT_UPLOAD_FILES']
    closeApplications = ApplicationStep.objects.filter(step_name__in=closeSteps).filter(currentStep=True)
    cApplications = Application.objects.filter(steps__in=closeApplications)
    cSerializer = ApplicationSerializer(cApplications, many=True)

    application = dict()
    application['new'] = nSerializer.data
    application['open'] = oSerializer.data
    application['close'] = cSerializer.data

    return Response(application, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_admin_applications(request):
    applications = Application.objects.all()
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_DEPT_HEAD])
def get_dept_head_applications(request):
    creator = Profile.objects.get(user=request.user.id)
    department = creator.department
    applications = Application.objects.filter(department=department)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_APPT_CHAIR])
def get_dept_chair_applications(request):
    verifyApplicationsByAdmin = ApplicationStep.objects.filter(step_name='ADMIN_VERIFY_APPLICATION')
    applications = Application.objects.filter(steps__in=verifyApplicationsByAdmin)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_QUALITY_DEPT])
def get_quality_dept_applications(request):
    verifyApplicationsByDeptChair = ApplicationStep.objects.filter(step_name='CHAIR_HEAD_APPROVE_APPLICATION')
    applications = Application.objects.filter(steps__in=verifyApplicationsByDeptChair)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_DEPT_MEMBER])
def get_member_application(request):
    profile = Profile.objects.get(user_id=request.user.id)
    applications = Application.objects.filter(applicant_id=profile.id).filter(is_done=0)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_DEPT_HEAD])
def get_dept_candidates(request):
    requestor_id = request.user.id
    requestor_dept = Profile.objects.get(user_id=requestor_id)
    candidates = Profile.objects.filter(department=requestor_dept.department_id)

    serializer = ProfileSerializer(candidates, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_DEPT_HEAD])
def submit_dept_head_application(request, application_id):
    delete_loop_length = 4
    try:
        cv = request.FILES['cv']
        letter = request.FILES['letter']
        candidate_id = request.data['candidateId']
        rank_id = request.data['requestedRankId']
        application_state = {
            'candidate_id': candidate_id,
            'rank_id': rank_id,
            'cv_filename': cv.name,
            'letter_filename': letter.name,
        }
        for i in range(delete_loop_length):
            application_state[f'doc{i}'] = None
        application_state['teaching_feedback'] = None

    except Exception:
        return Response("Error", status=status.HTTP_200_OK)

    creator = Profile.objects.get(user=request.user.id)
    department = creator.department
    applicant = Profile.objects.get(user=candidate_id)
    applicant_profile_id = applicant.id
    rank = Rank.objects.get(id=rank_id)

    if Application.objects.filter(applicant=applicant_profile_id).filter(is_done=0).exists():
        return Response(True, status=status.HTTP_200_OK)

    if Application.objects.filter(applicant=applicant_profile_id).filter(is_done=1).exists():
        all_close_app_4_applicant = Application.objects.filter(applicant=applicant_profile_id).filter(is_done=1)
        arg = all_close_app_4_applicant.order_by('-updated_at')[0]  # order: from the newest to the oldest
        last_app_closed = ApplicationStep.objects.filter(application_id=arg.id).filter(step_name="APPLICATION_CLOSE")
        date_close = last_app_closed[0].created_at.date()
        elapsed_date = (date.today() - date_close
                        ).days
        if elapsed_date <= 180:
            return Response("expired_period_time", status=status.HTTP_200_OK)

    try:
        application = Application.objects.get(id=application_id)
        # TODO - update application
    except Application.DoesNotExist:
        application = None

    if application is None:
        application = Application(creator=creator, applicant=applicant, desired_rank=rank,
                                  application_state=application_state, department=department
                                  )
        application.save()
        create_application_directory(application.id)

    ApplicationStep.objects.update_or_create(
        application=application, step_name=Step.STEP_1,
        defaults={'can_update': True, 'can_cancel': True, 'currentStep': True}
    )

    copy_to_application_directory(cv, application.id)
    copy_to_application_directory(letter, application.id)

    addresee = 'devasap08@gmail.com'  # TODO: change email to admin address
    email_headline = 'New Application Created'
    wanted_action = 'application_created'
    degree = creator.degree
    sendEmail(addresee, email_headline, wanted_action, creator, degree)

    addresee = 'devasap08@gmail.com'  # TODO: change email to creator address
    email_headline = 'Application Successfully Created'
    wanted_action = 'application_received'
    degree = applicant.degree
    sendEmail(addresee, email_headline, wanted_action, applicant, degree)

    return Response(False, status=status.HTTP_200_OK)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_DEPT_MEMBER])
def submit_dept_member_application(request, application_id):
    delete_loop_length = 4
    try:
        cv = request.FILES['cv']
        letter = request.FILES['letter']
        candidate_id = request.data['candidateId']
        rank_id = request.data['requestedRankId']
        application_state = {
            'candidate_id': candidate_id,
            'rank_id': rank_id,
            'cv_filename': cv.name,
            'letter_filename': letter.name,
        }
        for i in range(delete_loop_length):
            application_state[f'doc{i}'] = None
        application_state['teaching_feedback'] = None
    except Exception:
        return Response(True, status=status.HTTP_200_OK)

    creator = Profile.objects.get(user=request.user.id)
    department = creator.department
    applicant = Profile.objects.get(user=candidate_id)
    rank = Rank.objects.get(id=rank_id)

    if Application.objects.filter(applicant=applicant).filter(is_done=1).exists():
        all_close_app_4_applicant = Application.objects.filter(applicant=applicant).filter(is_done=1)
        arg = all_close_app_4_applicant.order_by('-updated_at')[0]  # order: from the newest to the oldest
        last_app_closed = ApplicationStep.objects.filter(application_id=arg.id).filter(step_name="APPLICATION_CLOSE")
        date_close = last_app_closed[0].created_at.date()
        elapsed_date = (date.today() - date_close
                        ).days
        if elapsed_date <= 180:
            return Response("expired_period_time", status=status.HTTP_200_OK)

    try:
        application = Application.objects.get(id=application_id)
        # TODO - update application
    except Application.DoesNotExist:
        application = None

    if application is None:
        application = Application(creator=creator, applicant=applicant, desired_rank=rank,
                                  application_state=application_state, department=department
                                  )
        application.save()
        create_application_directory(application.id)

    ApplicationStep.objects.update_or_create(
        application=application, step_name=Step.STEP_1,
        defaults={'can_update': True, 'can_cancel': True, 'currentStep': True}
    )

    copy_to_application_directory(cv, application.id)
    copy_to_application_directory(letter, application.id)

    addresee = 'devasap08@gmail.com'  # TODO: change email to admin address
    email_headline = 'New Application Created'
    wanted_action = 'application_created'
    degree = creator.degree
    sendEmail(addresee, email_headline, wanted_action, creator, degree)

    addresee = 'devasap08@gmail.com'  # TODO: change email to creator address
    email_headline = 'Application Successfully Created'
    wanted_action = 'application_received'
    degree = applicant.degree
    sendEmail(addresee, email_headline, wanted_action, applicant, degree)

    return Response(application.id, status=status.HTTP_200_OK)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_QUALITY_DEPT])
def submit_quality_dept_application(request, application_id):
    length = int(request.data['length'])
    application = Application.objects.get(id=application_id)
    application_state = application.application_state
    ApplicationStep.objects.filter(application_id=application_id).update(currentStep=False)
    if application_state['teaching_feedback'] is not None:
        delete_file_from_app_dir(application_state['teaching_feedback'], application.id)
    teaching_feedback = request.FILES['teaching-feedback']
    application_state['teaching_feedback'] = teaching_feedback.name
    now = datetime.now()
    dt_string = now.strftime("%Y-%m-%d %H:%M:%S")
    application_state['edited_time'] = dt_string
    delete_loop_length = 4
    for i in range(delete_loop_length):
        if application_state[f'doc{i}'] is not None:
            delete_file_from_app_dir(application_state[f'doc{i}'], application.id)
        application_state[f'doc{i}'] = None
    for i in range(length):
        doc = request.FILES[f'doc{i}']
        application_state[f'doc{i}'] = doc.name
        copy_to_application_directory(doc, application.id)
    copy_to_application_directory(teaching_feedback, application.id)
    ApplicationStep.objects.update_or_create(
        application=application, step_name=Step.STEP_7,
        defaults={'can_update': False, 'can_cancel': False, 'currentStep': True}
    )
    Application.objects.filter(id=application_id).update(application_state=application_state)
    return Response(Step.STEP_7, status=status.HTTP_200_OK)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def submit_admin_application(request, application_id):
    try:
        submit = request.data['submission']
        cv_comments = request.data['cvComments']
        letter_comments = request.data['letterComments']
        application = Application.objects.get(id=application_id)
        application_state = application.application_state
        application_state['cv_comments'] = cv_comments
        application_state['letter_comments'] = letter_comments
        ApplicationStep.objects.filter(application_id=application_id).update(currentStep=False)
    except Exception:
        return Response(True, status=status.HTTP_200_OK)

    if submit == 'submit':
        Application.objects.filter(id=application_id).update(application_state=application_state)

        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_4,
            defaults={'can_update': True, 'can_cancel': True, 'currentStep': True}
        )

        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_1,
            defaults={'can_update': False, 'can_cancel': False, 'currentStep': False}
        )

        addresee = 'devasap08@gmail.com'  # TODO:change to dph & lecturer mails
        email_headline = 'Application Approved By Admin'
        wanted_action = 'admin_approve'
        sendEmail(addresee, email_headline, wanted_action)

        return Response(Step.STEP_4, status=status.HTTP_200_OK)

    elif submit == 'feedback':
        application = Application.objects.get(id=application_id)
        Application.objects.filter(id=application_id).update(application_state=application_state)
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_3,
            defaults={'can_update': False, 'can_cancel': True, 'currentStep': True}
        )
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_1,
            defaults={'can_update': True, 'can_cancel': True, 'currentStep': False}
        )

        addresee = 'devasap08@gmail.com'  # TODO:change to dph address
        email_headline = 'New Feedback From Admin'
        wanted_action = 'admin_feedback'
        sendEmail(addresee, email_headline, wanted_action)

        return Response(Step.STEP_3, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
def inquiries_table(request):
    admin_id = request.user.id

    requests_table = [
        {
            'admin_reaching': admin_id,
            'candidate': 1,
            'requestedRank': "Manager",
            'submissionDate': "25-11-2021",
            'stageNumber': 3,
            'stageName': "interview",
        }
    ]

    return Response(requests_table, status=status.HTTP_200_OK)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
def get_remaining_days(request, candidate_id):
    profile = Profile.objects.get(user_id=candidate_id)
    new_date = get_new_date(profile.joined_date)
    return Response(new_date, status=status.HTTP_200_OK)


def get_new_date(joined_date):
    elapsed_date = (date.today() - joined_date).days
    STAGE_ONE = 365
    STAGE_TWO = 1460
    STAGE_THREE = 2555
    dictionary = dict()
    if elapsed_date <= STAGE_ONE:
        # TODO change the hebrew here !
        dictionary['finish_date'] = date.today() + timedelta(days=STAGE_ONE - elapsed_date)
        dictionary['stage'] = "א'"
    elif STAGE_ONE < elapsed_date < STAGE_TWO:
        dictionary['finish_date'] = date.today() + timedelta(days=STAGE_TWO - elapsed_date)
        dictionary['stage'] = "ב'"
    else:
        dictionary['finish_date'] = date.today() + timedelta(days=STAGE_THREE - elapsed_date)
        dictionary['stage'] = "ג'"

    return dictionary


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_DEPT_HEAD])
def handle_dept_head_application(request, application_id):
    try:
        action = request.data['requiredAction']
        cv_comments = request.data['cvComments']
        letter_comments = request.data['letterComments']
        application = Application.objects.get(id=application_id)
        application_state = application.application_state
        application_state['cv_comments'] = cv_comments
        application_state['letter_comments'] = letter_comments
        dictionary = dict()
    except Exception:
        return Response(True, status=status.HTTP_200_OK)

    try:
        cv = request.FILES['cv']
        delete_file_from_app_dir(application_state['cv_filename'], application.id)
        application_state['cv_filename'] = cv.name
        copy_to_application_directory(cv, application.id)
    except Exception:
        pass  # no cv file uploaded
    try:
        letter = request.FILES['letter']
        delete_file_from_app_dir(application_state['letter_filename'], application.id)
        application_state['letter_filename'] = letter.name
        copy_to_application_directory(letter, application.id)
    except Exception:
        pass  # no letter file uploaded

    ApplicationStep.objects.filter(application_id=application_id).update(currentStep=False)
    Application.objects.filter(id=application_id).update(
        application_state=application_state)  # TODO: check if needed
    application.save()

    dictionary['cv_name'] = application_state['cv_filename']
    dictionary['letter_name'] = application_state['letter_filename']

    if action == 'submit':
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_1,
            defaults={'can_update': True, 'can_cancel': False, 'currentStep': True}
        )

        dictionary['step'] = Step.STEP_1
        addresee = 'devasap08@gmail.com'  # TODO:change to admin & lecturer mails
        email_headline = 'Your Department-Head Has Approved The Application'
        wanted_action = 'dph_approve'
        sendEmail(addresee, email_headline, wanted_action)

        return Response(dictionary, status=status.HTTP_200_OK)

    elif action == 'feedback':
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_2,
            defaults={'can_update': True, 'can_cancel': True, 'currentStep': True}
        )

        dictionary['step'] = Step.STEP_2
        addresee = 'devasap08@gmail.com'  # TODO:change to admin & lecturer mails
        email_headline = 'You Got Feedback On Your Application'
        wanted_action = 'dph_feedback'
        sendEmail(addresee, email_headline, wanted_action)

        return Response(dictionary, status=status.HTTP_200_OK)
    elif action == 'close':
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_0,
            defaults={'can_update': False, 'can_cancel': False, 'currentStep': True}
        )
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_1,
            defaults={'can_update': False, 'can_cancel': False, 'currentStep': False}
        )
        Application.objects.update_or_create(
            id=application_id, is_done=0,
            defaults={'is_done': 1}
        )

        dictionary['step'] = Step.STEP_0
        addresee = 'devasap08@gmail.com'  # TODO:change to admin & lecturer mails
        email_headline = 'Your Application Denied'
        wanted_action = 'dph_deny'
        reviewer_name = Profile.objects.get(user=request.user.id)
        degree = reviewer_name.degree
        sendEmail(addresee, email_headline, wanted_action, reviewer_name, degree)

        return Response(dictionary, status=status.HTTP_200_OK)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_APPT_CHAIR])
def handle_appt_chair_application(request, application_id):
    try:
        action = request.data['requiredAction']
        cv_comments = request.data['cvComments']
        letter_comments = request.data['letterComments']
        application = Application.objects.get(id=application_id)
        application_state = application.application_state
        application_state['cv_comments'] = cv_comments
        application_state['letter_comments'] = letter_comments
        ApplicationStep.objects.filter(application_id=application_id).update(currentStep=False)
        Application.objects.filter(id=application_id).update(
            application_state=application_state)  # TODO: check if needed
    except Exception:
        return Response(True, status=status.HTTP_200_OK)

    if action == 'submit':
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_5,
            defaults={'can_update': False, 'can_cancel': False, 'currentStep': False}
        )

        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_6,
            defaults={'can_update': False, 'can_cancel': False, 'currentStep': True}
        )
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_1,
            defaults={'can_update': False, 'can_cancel': False, 'currentStep': False}
        )
        Application.objects.update_or_create(
            id=application_id, is_done=0,
            defaults={'is_done': 1}
        )

        addresee = 'devasap08@gmail.com'  # TODO:change to admin & dph & lecturer mails
        email_headline = 'Application Approved By Apartment Chair'
        wanted_action = 'chair_approve'
        sendEmail(addresee, email_headline, wanted_action)

        return Response(Step.STEP_6, status=status.HTTP_200_OK)

    elif action == 'feedback':
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_5,
            defaults={'can_update': True, 'can_cancel': True, 'currentStep': True}
        )

        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_4,
            defaults={'can_update': True, 'can_cancel': True, 'currentStep': False}
        )

        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_1,
            defaults={'can_update': True, 'can_cancel': True, 'currentStep': False}
        )

        addresee = 'devasap08@gmail.com'  # TODO:change to admin address
        email_headline = 'New Feedback From Apartment Chair'
        wanted_action = 'chair_feedback'
        sendEmail(addresee, email_headline, wanted_action)

        return Response(Step.STEP_5, status=status.HTTP_200_OK)

    elif action == 'close':
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_6,
            defaults={'can_update': False, 'can_cancel': False, 'currentStep': False}
        )
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_1,
            defaults={'can_update': False, 'can_cancel': False, 'currentStep': False}
        )
        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_5,
            defaults={'can_update': False, 'can_cancel': False, 'currentStep': False}
        )

        ApplicationStep.objects.update_or_create(
            application=application, step_name=Step.STEP_0,
            defaults={'can_update': False, 'can_cancel': False, 'currentStep': True}
        )
        Application.objects.update_or_create(
            id=application_id, is_done=0,
            defaults={'is_done': 1}
        )

        addresee = 'devasap08@gmail.com'  # TODO:change to admin & dph & lecturer mails
        email_headline = 'Application Denied By Apartment Chair'
        wanted_action = 'chair_deny'
        sendEmail(addresee, email_headline, wanted_action)

        return Response(Step.STEP_0, status=status.HTTP_200_OK)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_DEPT_MEMBER])
def handle_dept_member_application(request, application_id):
    try:
        cv_comments = request.data['cvComments']
        letter_comments = request.data['letterComments']
        application = Application.objects.get(id=application_id)
        application_state = application.application_state
        application_state['cv_comments'] = cv_comments
        application_state['letter_comments'] = letter_comments
        dictionary = dict()
    except Exception:
        return Response(True, status=status.HTTP_200_OK)

    try:
        cv = request.FILES['cv']
        delete_file_from_app_dir(application_state['cv_filename'], application.id)
        application_state['cv_filename'] = cv.name
        copy_to_application_directory(cv, application.id)
    except Exception:
        pass  # no cv file uploaded
    try:
        letter = request.FILES['letter']
        delete_file_from_app_dir(application_state['letter_filename'], application.id)
        application_state['letter_filename'] = letter.name
        copy_to_application_directory(letter, application.id)
    except Exception:
        pass  # no letter file uploaded

    # Application.objects.filter(id=application_id).update(application_state=application_state)  # TODO: check if needed
    ApplicationStep.objects.filter(application_id=application_id).update(currentStep=False)
    ApplicationStep.objects.update_or_create(
        application=application, step_name=Step.STEP_2,
        defaults={'can_update': False, 'can_cancel': False, 'currentStep': False}
    )
    ApplicationStep.objects.update_or_create(
        application=application, step_name=Step.STEP_1,
        defaults={'can_update': True, 'can_cancel': False, 'currentStep': True}
    )

    application.save()

    dictionary['step'] = Step.STEP_1
    dictionary['cv_name'] = application_state['cv_filename']
    dictionary['letter_name'] = application_state['letter_filename']
    addresee = 'devasap08@gmail.com'  # TODO:change to dph mail
    email_headline = 'Lecturer Has Edited An Application'
    wanted_action = 'member_edit'
    candidate = Profile.objects.get(id=application.applicant_id)
    degree = candidate.degree
    sendEmail(addresee, email_headline, wanted_action, candidate, degree)

    return Response(dictionary, status=status.HTTP_200_OK)


class ProfileList(generics.ListCreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class RankList(generics.ListCreateAPIView):
    queryset = Rank.objects.all()
    serializer_class = RankSerializer


class RankDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rank.objects.all()
    serializer_class = RankSerializer


def sendEmail(mail_addresses, wanted_headline, action_type, name_to_replace=None, degree=None):
    message = emails_patterns[action_type]
    if name_to_replace is not None:
        message = message.replace("%name", str(name_to_replace))
    if degree is not None:
        message = message.replace("%degree", str(degree))
    send_email(settings.SENDGRID_SENDER, mail_addresses,
               wanted_headline,
               message)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_alert_list(request):
    alerts = Alert.objects.all()
    serializer = AlertSerializer(alerts, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_admin_applications_with_step(request):
    applications = ApplicationStep.objects.all()
    serializer = ApplicationStepSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def update_is_read(request, row_id):
    row = Alert.objects.get(pk=row_id)
    row.is_read = not row.is_read
    row.save()

    return Response({'message': 'is_read value updated successfully'})


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def set_candidate_note(request):
    note = request.data.get('note')
    app_id = request.data.get('app_id')
    type_of_file = request.data.get('type')
    row = Application.objects.get(pk=app_id)
    application_state = row.application_state[0]

    if type_of_file in application_state and isinstance(application_state[type_of_file], dict) \
            and 'notes' in application_state[type_of_file]:
        application_state[type_of_file]['notes'].append(note)
    else:
        if type_of_file not in application_state:
            application_state[type_of_file] = {}
        if 'notes' not in application_state[type_of_file]:
            application_state[type_of_file]['notes'] = []
        application_state[type_of_file]['notes'].append(note)
    row.save()

    return Response({'message': 'application_state added note successfully'})


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_candidates(request):
    applications = Application.objects.all()
    profiles = [app.applicant for app in applications]
    data = []
    for profile in profiles:
        profile_data = {
            'id': profile.user.id,
            'name': profile.user.first_name + " " + profile.user.last_name,
            'rank': profile.rank.name if profile.rank else None,
            'department': profile.department.name if profile.department else None,
            'picture': "/api" + profile.picture.url if profile.picture else None,
        }
        data.append(profile_data)
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_count_of_application(request):
    countAllApplication = ApplicationStep.objects.values('application').distinct().count()
    countNewRequests = ApplicationStep.objects.filter(step_name__contains='NEW-REQUESTS/', currentStep=True).count()
    countOpenProcess = ApplicationStep.objects.filter(step_name__contains='OPEN-PROCESS/', currentStep=True).count()
    countEstablishment = ApplicationStep.objects.filter(
        step_name__contains='ESTABLISHMENT-PROFESSIONAL-COMMITTEE/', currentStep=True).count()
    countProfessionalCommittee = ApplicationStep.objects.filter(step_name__startswith='PROFESSIONAL-COMMITTEE/',
                                                                currentStep=True).count()
    countFinalAppointmentsCommittee = ApplicationStep.objects.filter(
        step_name__contains='FINAL-APPOINTMENTS-COMMITTEE/', currentStep=True).count()
    countRequestCHE = ApplicationStep.objects.filter(step_name__contains='REQUEST-CHE', currentStep=True).count()
    nearest_committee = Committee.objects.filter(committee_date__gte=timezone.now()).order_by('committee_date').first()
    nearest_committee_date = nearest_committee.committee_date.strftime('%d/%m/%Y') if nearest_committee else None
    countApplicationByType = {
        'Home': '',
        'newRequests': countNewRequests,
        'openProcess': countOpenProcess,
        'establishmentProfessionalCommittee': countEstablishment,
        'professionalCommittee': countProfessionalCommittee,
        'finalAppointmentsCommittee': countFinalAppointmentsCommittee,
        'RequestCHE': countRequestCHE,
        "allApplication": countAllApplication,
        "nearestCommittee": nearest_committee_date,
    }

    return Response(countApplicationByType, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_applications_by_step(request):
    step_name = request.GET.getlist('step_name', '')
    open_stage = request.GET.getlist('open_stage[]', [])[0].split(',')
    close_stage = request.GET.getlist('close_stage[]', [])[0].split(',')

    applicationSteps = ApplicationStep.objects.filter(step_name__contains=step_name[0])

    open_query = reduce(or_, [Q(step_name__icontains=stage) for stage in open_stage])
    openApplications = applicationSteps.filter(open_query, currentStep=True)

    oSerializer = ApplicationStepSerializer(openApplications, many=True, context={'request': request})
    close_query = reduce(or_, [Q(step_name__icontains=stage) for stage in close_stage])
    closeApplications = applicationSteps.filter(close_query, currentStep=True)

    cSerializer = ApplicationStepSerializer(closeApplications, many=True, context={'request': request})

    application = dict()
    application['open'] = oSerializer.data
    application['close'] = cSerializer.data

    return Response(application, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_candidate_details(request, user_id):
    profile = Profile.objects.get(user_id=user_id)
    applicationStep = ApplicationStep.objects.filter(application__applicant=profile, currentStep=True).first()
    if applicationStep:
        application = ApplicationStepSerializer(applicationStep, context={'request': request})

        return Response(application.data)
    else:
        return Response({'application': None})


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def update_application_step(request):
    step_name = request.data.get('step_name')
    app_id = request.data.get('app_id')
    can_cancel = request.data.get('can_cancel')
    app_step_id = request.data.get('app_step_id')

    try:
        new_row = ApplicationStep.objects.get(application_id=app_id, step_name=step_name, can_cancel=can_cancel,
                                              currentStep=1)

    except ApplicationStep.DoesNotExist:
        last_row = ApplicationStep.objects.get(pk=app_step_id)
        last_row.currentStep = 0
        last_row.save()
        new_row = ApplicationStep(step_name=step_name, currentStep=1, can_update=1, can_cancel=can_cancel,
                                  application_id=app_id)
        new_row.save()
        return Response({'message': 'application step value updated successfully'})
    else:
        return Response({'error': 'ApplicationStep instance already exists'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def create_committee(request):
    committee_date = request.data.get('date')
    committee_time = request.data.get('time')
    committee_type = request.data.get('type')
    committee_date = datetime.strptime(committee_date, '%Y-%m-%d').date()
    committee_time = datetime.strptime(committee_time, '%H:%M').time()
    committee_datetime = datetime.combine(committee_date, committee_time)

    committee = Committee(committee_date=committee_datetime, type=committee_type)
    committee.save()

    return Response({'message': 'Committee created successfully'})


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def upload_file(request):
    file = request.FILES.get('file')
    app_id = request.POST.get('appID')
    type_of_file = request.POST.get('type')
    application = Application.objects.get(id=app_id)
    user_data = ProfileSerializer(application.applicant, context={'request': request}).data
    user_instance = Profile.objects.get(id=user_data['id'])
    document = Document(file=file, user_id=user_instance)
    document.save()
    row = Application.objects.get(pk=app_id)

    user = request.user
    first_name = user.first_name
    last_name = user.last_name
    upload_with = f"{first_name} {last_name}"
    current_date = datetime.now().isoformat()

    data = {
        "url": document.file.url.replace(settings.MEDIA_URL, ''),
        "uploadWith": upload_with,
        "date": current_date
    }
    if type_of_file == 'CV' or type_of_file == 'Initiative Letter':
        row.application_state[0]['CV&Initiative Letter'][type_of_file] = data
    else:
        row.application_state[0][type_of_file] = data

    row.save()

    return HttpResponse('File uploaded successfully.')


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_applications(request):
    current_steps = ApplicationStep.objects.filter(currentStep=True)
    step_serializer = ApplicationStepSerializer(current_steps, many=True, context={'request': request})
    return Response(step_serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def download_file(request):
    file_path = request.data.get('file_url')
    if not file_path:
        return HttpResponse(status=400, content="Missing 'file_url' parameter")

    try:
        file_path = str(file_path)
        file_path = os.path.join(settings.MEDIA_ROOT, file_path)
    except Exception as e:
        return HttpResponse(status=400, content=f"Invalid 'file_url' parameter: {e}")

    if not os.path.exists(file_path):
        return HttpResponse(status=404)

    with open(file_path, 'rb') as f:
        file_data = f.read()

    file_name = os.path.basename(file_path)
    if file_name.endswith('.docx'):
        content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    elif file_name.endswith('.pdf'):
        content_type = 'application/pdf'
    else:
        content_type = 'application/octet-stream'  # default content type if file type is unknown

    response = HttpResponse(file_data, content_type=content_type)
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'
    response['Content-Type'] = content_type

    return response


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def remind_to_chairman(request):
    user_id = request.data.get('user_id')
    email_headline = 'תזכורת הקמת וועדה מקצועית'
    wanted_action = 'remind_to_chairman'

    try:
        candidate = Profile.objects.get(user=user_id)
        degree = candidate.degree

        group = Group.objects.get(name='asap-appt-chair')

        mail_addresses = []
        for user in group.user_set.all():
            mail_addresses.append(user.email)

        if mail_addresses:
            for mail_address in mail_addresses:
                sendEmail(mail_address, email_headline, wanted_action, candidate, degree)
            return Response({'message': 'email sent successfully'})
        else:
            return Response({'message': 'No email addresses found for the group'})
    except Profile.DoesNotExist:
        return Response({'message': 'Candidate profile not found'})
    except Group.DoesNotExist:
        return Response({'message': 'Group not found'})


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def save_committee_candidate(request):
    committee_candidate_details = request.data.get('committeeCandidateDetails')
    user_id = request.data.get('userId')

    try:
        candidate = Profile.objects.get(user_id=user_id)
        app = Application.objects.get(applicant_id=candidate.id)
        committee_id = app.committee_ID_id
    except Application.DoesNotExist as e:
        error_message = f"Invalid 'user_id' parameter: {e}"
        return HttpResponseBadRequest(content=error_message)

    if committee_id is None:
        with transaction.atomic():
            committee = Committee.objects.create(committee_date=datetime.now(), type=CommitteeType.COMMITTEE_1)
            committee_id = committee.id
            app.committee_ID_id = committee_id
            app.save()

    committee_candidate = CommitteeCandidate.objects.create(
        committee_id_id=committee_id,
        full_name=committee_candidate_details['fullName'],
        institution=committee_candidate_details['institution'],
        degree=committee_candidate_details['degree'],
        research_area=committee_candidate_details['researchArea'],
        phone=committee_candidate_details['phone'],
        email=committee_candidate_details['email'],
        is_chairman=False
    )
    committee_candidate.save()
    return HttpResponse(status=200, content='Committee candidate saved successfully')


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def save_recommender(request):
    recommender_details = request.data
    user_id = recommender_details['userId']
    recommender_details = recommender_details['recommenderDetails']
    rank_name = recommender_details['rank']
    custom_user = get_user_model()
    user = custom_user.objects.get(id=user_id)

    rank = Rank.objects.get(name=rank_name)

    new_recommend = Recommend(
        name=recommender_details['fullName'],
        phone=recommender_details['phone'],
        email=recommender_details['email'],
        institute=recommender_details['institution'],
        field_of_study=recommender_details['researchArea'],
        rank=rank,
        country=recommender_details['country'],
    )
    new_recommend.save()

    new_recommendation = Recommendation(
        recommend_id=new_recommend,
        user_id=user,
        familiarity_level=recommender_details['familiarity'],
    )
    new_recommendation.save()

    return Response({'message': 'Recommender details saved successfully'})


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_committee_candidate(request):
    user_id = request.data.get('userId')
    try:
        candidate = Profile.objects.get(user_id=user_id)
        app = Application.objects.get(applicant_id=candidate.id)
        committee_id = app.committee_ID_id
        committee_candidates = CommitteeCandidate.objects.filter(committee_id=committee_id)
        serialized_candidates = CommitteeCandidateSerializer(committee_candidates, many=True)
        return Response(serialized_candidates.data)
    except CommitteeCandidate.DoesNotExist as e:
        return HttpResponse(status=400, content=f"Do not found any candidates: {e}")


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_recommendations(request):
    user_id = request.data.get('user_id')
    recommendations = Recommendation.objects.filter(user_id=user_id)
    data = []
    for recommendation in recommendations:
        recommend = recommendation.recommend_id
        data.append({
            'name': recommend.name,
            'rank': recommend.rank.name,
            'institute': recommend.institute,
            'familiarity': recommendation.familiarity_level,
            'researchField': recommend.field_of_study,
            'phone': recommend.phone,
            'email': recommend.email,
            'state': recommendation.state
        })
    return Response(data)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def update_recommendation_step(request):
    user_id = request.data.get('user_id')
    next_state = request.data.get('next_state')
    recommendations = Recommendation.objects.filter(user_id=user_id)
    if recommendations.exists():
        recommendation = recommendations.first()
        recommendation.state = next_state
        recommendation.save()

        return JsonResponse({'message': 'Recommendation state updated successfully.'})
    else:
        return JsonResponse({'error': 'No recommendation found for the given user_id.'})


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_application_steps(request):
    user_id = request.data.get('user_id')
    try:
        profile = Profile.objects.get(user_id=user_id)
        applications = Application.objects.filter(applicant=profile)
        steps = ApplicationStep.objects.filter(application__in=applications)

        serialized_steps = [
            {
                'id': step.id,
                'step_name': step.step_name,
                'created_at': step.created_at,
                'updated_at': step.updated_at,
                'currentStep': step.currentStep,
            }
            for step in steps
        ]

        return Response(serialized_steps, status=status.HTTP_200_OK)

    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authorized_roles(roles=[Role.ASAP_ADMIN])
def get_committees_dates(request):
    steps = request.data.get('steps')
    step_dates = [datetime.strptime(step['date'], "%d/%m/%Y").date() for step in steps]

    committees = Committee.objects.filter(date_establish__in=step_dates).order_by('committee_date')
    # Serialize the committees data as needed
    serialized_committees = []

    for committee in committees:
        # Serialize committee data using your serializer or custom logic
        serialized_committees.append({
            'id': committee.id,
            'date_establish': committee.date_establish,
            'committee_date': committee.committee_date,
            'type': committee.type
        })

    return Response(serialized_committees)
