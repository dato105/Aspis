from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

from core import views

urlpatterns = [
    path('auth/obtain-token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh-token/', TokenRefreshView.as_view(), name='token_refresh'),

    path('users/logout/', views.logout_user),
    path('users/get-current-user/', views.get_current_user),
    path('users/profiles/<int:pk>/', views.ProfileDetail.as_view()),
    path('users/profiles/', views.ProfileList.as_view()),
    path('users/profiles/getProfile/<int:candidate_id>', views.get_remaining_days),

    # path('version/get-current-version/<>/', views.get_current_version),

    path('administration/alert/alert-list/', views.get_alert_list),
    path('administration/candidates/', views.get_candidates),
    path('administration/get-count-for-all-type-application/', views.get_count_of_application),
    path('administration/update-is-read/<int:row_id>/', views.update_is_read),
    path('administration/get-applications-by-step/', views.get_applications_by_step),
    path('administration/update-application-step/', views.update_application_step),
    path('administration/upload-file/', views.upload_file),
    path('administration/set-candidate-note/', views.set_candidate_note),
    path('administration/get-all-applications/', views.get_applications),
    path('administration/download-file/', views.download_file),
    path('administration/create-committee/', views.create_committee),
    path('administration/get-candidate-details/<int:user_id>/', views.get_candidate_details),
    path('administration/save-committee-candidate/', views.save_committee_candidate),
    path('administration/save-recommender/', views.save_recommender),
    path('administration/get-committee-candidate/', views.get_committee_candidate),
    path('administration/remind-to-chairman/', views.remind_to_chairman),
    path('administration/get-recommendations/', views.get_recommendations),
    path('administration/update-recommendation-step/', views.update_recommendation_step),
    path('administration/get-application-steps/', views.get_application_steps),
    path('administration/get-committees-dates/', views.get_committees_dates),


    path('application/member/', views.get_member_application),

    path('applications/dept-head/', views.get_dept_head_applications),
    path('applications/dept-chair/', views.get_dept_chair_applications),
    path('applications/admin/landing-page', views.landing_page_applications),
    path('applications/admin/', views.get_admin_applications),
    path('applications/quality-dept/', views.get_quality_dept_applications),

    path('applications/<int:application_id>/', views.get_application),
    path('applications/cv/<int:application_id>/', views.get_cv),
    path('applications/letter/<int:application_id>/', views.get_letter),

    path('applications/candidates/', views.get_dept_candidates),
    path('applications/ranks/<int:pk>/', views.RankDetail.as_view()),

    path('applications/ranks/', views.RankList.as_view()),
    path('applications/submit-dept-head-application/<int:application_id>/', views.submit_dept_head_application),
    path('applications/submit-dept-member-application/<int:application_id>/', views.submit_dept_member_application),
    path('applications/submit-admin-application/<int:application_id>/', views.submit_admin_application),
    path('applications/submit-quality-dept-application/<int:application_id>/', views.submit_quality_dept_application),
    path('applications/handle-appt-chair-application/<int:application_id>/', views.handle_appt_chair_application),
    path('applications/handle-dept-head-application/<int:application_id>/', views.handle_dept_head_application),
    path('applications/handle-dept-member-application/<int:application_id>/', views.handle_dept_member_application),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
