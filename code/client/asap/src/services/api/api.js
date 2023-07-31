import Axios from 'axios';
import { removeFromLocalStorage, STORAGE_ASAP_AUTH_STATE } from '../storage/storage';

const $axios = Axios.create({
    baseURL: '/api/',
    headers: { 'Content-Type': 'application/json' },
});

const getOnBeforeRequestHandler = () => config => config;

const onRequestErrorHandler = () => error => Promise.reject(error);

const getOnResponseHandler = () => response => response;

const onResponseErrorHandler = () => error => {
    if (error.response && error.response.status === 401) {
        removeFromLocalStorage(STORAGE_ASAP_AUTH_STATE);
    }

    throw error;
};

$axios.interceptors.request.use(getOnBeforeRequestHandler(), onRequestErrorHandler());
$axios.interceptors.response.use(getOnResponseHandler(), onResponseErrorHandler());

const authHeader = () => {
    const state = JSON.parse(localStorage.getItem(STORAGE_ASAP_AUTH_STATE));
    return state?.token ? { Authorization: 'Bearer ' + state.token } : {};
};

class AuthService {
    static login(username, password) {
        return $axios.post('auth/obtain-token/', { username, password }).then(response => response.data);
    }

    static logout() {
        return $axios.post('users/logout/', null, { headers: authHeader() }).then(response => response.data);
    }

    static getCurrentUser() {
        return $axios.post('users/get-current-user/', null, { headers: authHeader() }).then(response => response.data);
    }
}

class VersionService {
    static getCurrentVersion() {
        return $axios
            .post('version/get-current-version/', null, { headers: authHeader() })
            .then(response => response.data);
    }
}

class ApplicationService {
    static getAdminLandingPageApplications() {
        return $axios.get('applications/admin/landing-page', { headers: authHeader() }).then(response => response.data);
    }

    static getAdminApplications() {
        return $axios.get('applications/admin/', { headers: authHeader() }).then(response => response.data);
    }

    static getDeptHeadApplications() {
        return $axios.get('applications/dept-head/', { headers: authHeader() }).then(response => response.data);
    }

    static getDeptChairApplications() {
        return $axios.get('applications/dept-chair/', { headers: authHeader() }).then(response => response.data);
    }

    static getMemberApplication() {
        return $axios.get(`application/member/`, { headers: authHeader() }).then(response => response.data);
    }

    static getQualityDeptApplications() {
        return $axios.get(`applications/quality-dept/`, { headers: authHeader() }).then(response => response.data);
    }

    static getApplication(applicationId) {
        return $axios.get(`applications/${applicationId}/`, { headers: authHeader() }).then(response => response.data);
    }

    static getDeptCandidates() {
        return $axios.get('applications/candidates/', { headers: authHeader() }).then(response => response.data);
    }

    static getRanks() {
        return $axios.get('applications/ranks/', { headers: authHeader() }).then(response => response.data);
    }

    static _getFile(applicationId, fileId) {
        return $axios
            .get(`applications/${fileId}/${applicationId}/`, { headers: authHeader(), responseType: 'blob' })
            .then(response => response.data);
    }

    static getCv(applicationId) {
        return ApplicationService._getFile(applicationId, 'cv');
    }

    static getLetter(applicationId) {
        return ApplicationService._getFile(applicationId, 'letter');
    }

    static submitDeptHeadAppointment(applicationId, applicationData) {
        const formData = new FormData();
        if (!(applicationId === undefined || applicationData === null)) {
            Object.entries(applicationData).forEach(([key, value]) => formData.append(key, value));
        }
        return $axios
            .post(`applications/submit-dept-head-application/${applicationId}/`, formData, {
                headers: Object.assign({ 'Content-Type': 'multipart/form-data' }, authHeader()),
            })
            .then(response => response.data);
    }

    static submitQualityDeptAppointment(applicationId, applicationData, length) {
        const formData = new FormData();
        if (!(applicationId === undefined || applicationData === null)) {
            Object.entries(applicationData).forEach(([key, value]) => formData.append(key, value));
            formData.append('length', length);
        }
        return $axios
            .post(`applications/submit-quality-dept-application/${applicationId}/`, formData, {
                headers: Object.assign({ 'Content-Type': 'multipart/form-data' }, authHeader()),
            })
            .then(response => response.data);
    }

    static submitDeptMemberAppointment(applicationId, applicationData) {
        const formData = new FormData();
        Object.entries(applicationData).forEach(([key, value]) => formData.append(key, value));

        return $axios
            .post(`applications/submit-dept-member-application/${applicationId}/`, formData, {
                headers: Object.assign({ 'Content-Type': 'multipart/form-data' }, authHeader()),
            })
            .then(response => response.data);
    }

    static submitAdminAppointment(applicationId, applicationData, submission) {
        return $axios
            .post(
                `applications/submit-admin-application/${applicationId}/`,
                { ...applicationData, submission },
                { headers: authHeader() }
            )
            .then(response => response.data);
    }

    static handleApptChairAppointment(applicationId, applicationData, requiredAction) {
        return $axios
            .post(
                `applications/handle-appt-chair-application/${applicationId}/`,
                { ...applicationData, requiredAction },
                { headers: authHeader() }
            )
            .then(response => response.data);
    }

    static closeAdminAppointment(applicationId) {
        return $axios
            .get(`applications/close-admin-application/${applicationId}`, { headers: authHeader() })
            .then(response => response.data);
    }

    static get_remaining_days(candidateId) {
        return $axios
            .post(`users/profiles/getProfile/${candidateId}`, { candidateId }, { headers: authHeader() })
            .then(response => response.data);
    }

    static handleDeptHeadAppointment(applicationId, applicationData, requiredAction) {
        const formData = new FormData();
        Object.entries(applicationData).forEach(([key, value]) => formData.append(key, value));
        formData.append('requiredAction', requiredAction);
        return $axios
            .post(`applications/handle-dept-head-application/${applicationId}/`, formData, {
                headers: Object.assign({ 'Content-Type': 'multipart/form-data' }, authHeader()),
            })
            .then(response => response.data);
    }

    static handleDeptMemberAppointment(applicationId, applicationData) {
        const formData = new FormData();
        Object.entries(applicationData).forEach(([key, value]) => formData.append(key, value));
        return $axios
            .post(`applications/handle-dept-member-application/${applicationId}/`, formData, {
                headers: Object.assign({ 'Content-Type': 'multipart/form-data' }, authHeader()),
            })
            .then(response => response.data);
    }
}

class AdminService {
    static getAlertList() {
        return $axios
            .get('administration/alert/alert-list/', { headers: authHeader() })
            .then(response => response.data);
    }

    static updateIsRead(row_id) {
        return $axios
            .get(`administration/update-is-read/${row_id}/`, { headers: authHeader() })
            .then(response => response.data);
    }

    static setCandidateNote(note, app_id, type) {
        return $axios
            .post(
                'administration/set-candidate-note/',
                {
                    note: note,
                    app_id: app_id,
                    type: type,
                },
                {
                    headers: authHeader(),
                }
            )
            .then(response => response.data);
    }

    static getListCandidates() {
        return $axios.get(`administration/candidates/`, { headers: authHeader() }).then(response => response.data);
    }

    static getCountOfAllApplication() {
        return $axios
            .get(`administration/get-count-for-all-type-application/`, { headers: authHeader() })
            .then(response => response.data);
    }

    static getAllApplications() {
        return $axios
            .get(`administration/get-all-applications/`, { headers: authHeader() })
            .then(response => response.data);
    }

    static getApplicationsByStep(step_name, open_stage, close_stage) {
        return $axios
            .get(
                `administration/get-applications-by-step/?step_name=${step_name}&open_stage[]=${open_stage}&close_stage[]=${close_stage}`,
                { headers: authHeader() }
            )
            .then(response => response.data);
    }

    static downloadFile(file_url) {
        return $axios
            .post(
                'administration/download-file/',
                {
                    file_url: file_url,
                },
                {
                    headers: authHeader(),
                    responseType: 'blob', // set the response type to blob to download files
                }
            )
            .then(response => response);
    }

    static updateApplicationStep(step_name, app_id, can_cancel, app_step_id) {
        return $axios
            .post(
                'administration/update-application-step/',
                {
                    step_name: step_name,
                    app_id: app_id,
                    can_cancel: can_cancel,
                    app_step_id: app_step_id,
                },
                {
                    headers: authHeader(),
                }
            )
            .then(response => response.data);
    }

    static createCommittee(date, time, type) {
        return $axios
            .post(
                'administration/create-committee/',
                {
                    date: date,
                    time: time,
                    type: type,
                },
                {
                    headers: authHeader(),
                }
            )
            .then(response => response.data);
    }

    static uploadFile(file, appID, type) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('appID', appID);
        formData.append('type', type);

        const config = {
            headers: {
                ...authHeader(),
                'Content-Type': 'multipart/form-data',
            },
        };

        return $axios.post('administration/upload-file/', formData, config).then(response => response.data);
    }

    static getCandidateDetails(user_id) {
        return $axios
            .get(`administration/get-candidate-details/${user_id}/`, { headers: authHeader() })
            .then(response => response.data);
    }

    static saveCommitteeCandidate(committeeCandidateDetails, userId) {
        return $axios
            .post(
                'administration/save-committee-candidate/',
                {
                    committeeCandidateDetails: committeeCandidateDetails,
                    userId: userId,
                },
                {
                    headers: authHeader(),
                }
            )
            .then(response => response.data);
    }

    static saveRecommender(recommenderDetails, userId) {
        return $axios
            .post(
                `administration/save-recommender/`,
                {
                    recommenderDetails: recommenderDetails,
                    userId: userId,
                },
                { headers: authHeader() }
            )
            .then(response => response.data);
    }

    static getCommitteeCandidate(userId) {
        return $axios
            .post(`administration/get-committee-candidate/`, { userId: userId }, { headers: authHeader() })
            .then(response => response.data);
    }

    static remindToChairman(user_id) {
        return $axios
            .post(`administration/remind-to-chairman/`, { user_id }, { headers: authHeader() })
            .then(response => response.data);
    }

    static getRecommendations(user_id) {
        return $axios
            .post(`administration/get-recommendations/`, { user_id }, { headers: authHeader() })
            .then(response => response.data);
    }

    static updateRecommendationStep(user_id, next_state) {
        return $axios
            .post(`administration/update-recommendation-step/`, { user_id, next_state }, { headers: authHeader() })
            .then(response => response.data);
    }

    static getApplicationSteps(user_id) {
        return $axios
            .post(`administration/get-application-steps/`, { user_id }, { headers: authHeader() })
            .then(response => response.data);
    }

    static getCommitteesDates(steps) {
        return $axios
            .post(`administration/get-committees-dates/`, { steps }, { headers: authHeader() })
            .then(response => response.data);
    }


}

const apiService = { AuthService, ApplicationService, VersionService, AdminService };

export default apiService;
