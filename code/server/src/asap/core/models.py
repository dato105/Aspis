from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db import models
import datetime


class Version(models.Model):
    id = models.AutoField(primary_key=True)
    major = models.IntegerField(MinValueValidator(0))
    minor = models.IntegerField(MinValueValidator(0))
    patch = models.IntegerField(MinValueValidator(1))
    created_at = models.DateTimeField(auto_now_add=True)


class Department(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(max_length=50)
    department_head = models.ForeignKey(
        User,
        default=None,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='department_head'
    )

    def __str__(self):
        return self.name


class Rank(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(max_length=50)

    def __str__(self):
        return self.name


class Degree(models.TextChoices):
    prof = "פרופ'"
    mr = "מר."
    mis = "גב'"
    doc = 'ד"ר'


class AlertType(models.TextChoices):
    ALERT_0_ADMIN = 'THE_CHAIRMAN_OF_APPOINTMENTS_APPROVED_THE_OPENING_OF_A_PROCESS'
    ALERT_1_ADMIN = 'THE_CHAIRMAN_OF_APPOINTMENTS_REJECTED_THE_OPENING_OF_A_PROCESS'
    ALERT_2_ADMIN = 'ATTACHED_TEACHING_FEEDBACK'
    ALERT_3_ADMIN = 'CANDIDATE_ATTACHED_REQUIRED_MATERIAL'
    ALERT_4_ADMIN = 'CANDIDATES_FOR_A_PROFESSIONAL_COMMITTEE_HAVE_BEEN ADDED'


class CommitteeType(models.TextChoices):
    COMMITTEE_0 = 'APPOINTMENTS_COMMITTEE'
    COMMITTEE_1 = 'PROFESSIONAL_COMMITTEE'


class Committee(models.Model):
    id = models.AutoField(primary_key=True)
    date_establish = models.DateField("Date", default=datetime.date.today)
    committee_date = models.DateTimeField(auto_now=False)
    type = models.TextField(default=None, max_length=50, choices=CommitteeType.choices)


class EmploymentStages(models.TextChoices):
    STAGE_0 = 'A'
    STAGE_1 = 'B'
    STAGE_2 = 'C'


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, blank=True, related_name='user')
    rank = models.ForeignKey(Rank, default=None, null=True,
                             blank=True, on_delete=models.CASCADE, related_name='p_rank')
    department = models.ForeignKey(Department, default=None, null=True, blank=True, on_delete=models.CASCADE,
                                   related_name='department')
    joined_date = models.DateField("Date", default=datetime.date.today)
    degree = models.TextField(
        default=None, max_length=50, choices=Degree.choices)
    picture = models.ImageField(upload_to="images/", default=None)
    stage_due_date = models.DateTimeField(auto_now=False, default=None)
    employment_stage = models.TextField(max_length=70, choices=EmploymentStages.choices, default=None)

    def __str__(self):
        return self.user.get_full_name()


class StateApplication(models.TextChoices):
    STATE_0 = 'ACTIVE'
    STATE_1 = "DELAYED"
    STATE_2 = 'REJECTED'
    STATE_3 = 'OLD'


class Application(models.Model):
    id = models.AutoField(primary_key=True)
    creator = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name='creator')
    applicant = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name='applicant')
    desired_rank = models.ForeignKey(
        Rank, on_delete=models.CASCADE, related_name='desired_rank')
    application_state = models.JSONField(max_length=10000, default=None)
    is_done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    state_Application = models.TextField(max_length=80, choices=StateApplication.choices, default=None)
    committee_ID = models.ForeignKey(Committee, default=None, null=True, blank=True, on_delete=models.CASCADE,
                                     related_name='committee_ID')


class Step(models.TextChoices):
    STEP_0 = 'NEW-REQUESTS/APPROVE-ADMIN'
    STEP_1 = 'NEW-REQUESTS/APPROVE-CHAIRMAN-APPOINTMENTS'
    STEP_2 = 'NEW-REQUESTS/COMBINATION-TEACHING-FEEDBACK'
    STEP_3 = 'OPEN-PROCESS/SETTING-DATE-APPOINTMENT-COMMITTEE'
    STEP_4 = 'OPEN-PROCESS/APPOINTMENT-COMMITTEE-WAITING'
    STEP_5 = 'OPEN-PROCESS/ENTER-APPOINTMENT-COMMITTEE-DECISION'
    STEP_6 = 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/RECEIVING-MATERIAL-CANDIDATE'
    STEP_7 = 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/LOCATING-CHAIRMAN-APPOINTMENTS-COMMITTEE'
    STEP_8 = 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/ADDITION-MEMBERS-PROFESSIONAL-COMMITTEE'
    STEP_9 = 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/SETTING-DATE-APPOINTMENTS-COMMITTEE'
    STEP_10 = 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/APPOINTMENT-COMMITTEE-WAITING'
    STEP_11 = 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/ATTACHMENT-PROTOCOL-AND-LETTERS-APPOINTMENT'
    STEP_12 = 'PROFESSIONAL-COMMITTEE/CONTACT-RECOMMENDERS -AND-ATTACHING-LETTERS-RECOMMENDATION'
    STEP_13 = 'PROFESSIONAL-COMMITTEE/DETERMINE-PROFESSIONAL-COMMITTEE-REPORT-RECOMMENDATIONS'
    STEP_14 = 'FINAL-APPOINTMENTS-COMMITTEE/SETTING-DATE-FINAL-COMMITTEE'
    STEP_15 = 'FINAL-APPOINTMENTS-COMMITTEE/APPOINTMENT-COMMITTEE-WAITING'
    STEP_16 = 'FINAL-APPOINTMENTS-COMMITTEE/ENTER-COMMITTEE-DECISION'
    STEP_17 = 'REQUEST-CHE/COMPLETING-DOCUMENTS'
    STEP_18 = 'REQUEST-CHE/ENTER-GENERAL-ASSEMBLY-DECISION'
    STEP_19 = 'FINISH'


class ApplicationStep(models.Model):
    id = models.AutoField(primary_key=True)
    application = models.ForeignKey(
        Application, default=None, on_delete=models.CASCADE, related_name='steps')
    step_name = models.TextField(max_length=100, choices=Step.choices)
    currentStep = models.BooleanField(default=False)
    can_update = models.BooleanField(default=False)
    can_cancel = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Recommend(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(max_length=100, default=None)
    phone = models.TextField(max_length=50)
    email = models.TextField(max_length=50)
    rank = models.ForeignKey(
        Rank, on_delete=models.CASCADE, related_name='r_rank')
    institute = models.TextField(max_length=50)
    field_of_study = models.TextField(max_length=50)
    country = models.TextField(max_length=50, default=None)


class CommitteeCandidate(models.Model):
    committee_id = models.ForeignKey(
        Committee, on_delete=models.CASCADE, related_name='committee_id')
    full_name = models.TextField(max_length=100, default=None)
    institution = models.TextField(max_length=100, default=None)
    degree = degree = models.TextField(
        default=None, max_length=50, choices=Degree.choices)
    research_area = models.TextField(max_length=100, default=None)
    phone = models.TextField(max_length=100, default=None)
    email = models.TextField(max_length=100, default=None)
    is_chairman = models.BooleanField(default=False)


class Document(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name='dl_user_id')
    file = models.FileField(upload_to="Files/")


class FamiliarityLevel(models.TextChoices):
    LEVEL_0 = 'PROFESSIONAL'
    LEVEL_1 = 'PERSONAL'


class States(models.TextChoices):
    STATE_0 = 'APPROVAL_RECOMMENDED_BY_A_PROFESSIONAL_COMMITTEE'
    STATE_1 = 'NOT_YET_APPROVED_BY_A_PROFESSIONAL_COMMITTEE'
    STATE_2 = 'APPROVED'
    STATE_3 = 'REJECTED'


class Recommendation(models.Model):
    recommend_id = models.ForeignKey(
        Recommend, on_delete=models.CASCADE, related_name='recommend_id')
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='rl_user_id')
    state = models.TextField(max_length=50, choices=States.choices,
                             default='NOT_YET_APPROVED_BY_A_PROFESSIONAL_COMMITTEE')
    familiarity_level = models.TextField(max_length=20, choices=FamiliarityLevel.choices)


class AlertStatus(models.TextChoices):
    STATUES_0 = 'new requests'
    STATUES_1 = 'opening a process'
    STATUES_2 = 'establishment of a professional committee'
    STATUES_3 = 'professional committee'
    STATUES_4 = 'final appointments committee'
    STATUES_5 = 'requests for the CHE'


class Alert(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True, related_name='user_id')
    alert_type_id = models.TextField(default=None, max_length=65, choices=AlertType.choices)
    insert_time = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    statusAlert = models.TextField(default=None, max_length=65, choices=AlertStatus.choices)
