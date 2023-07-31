import React from 'react';

export const ROLES = {
    ASAP_ADMIN: 'asap-admin',
    ASAP_DEPT_HEAD: 'asap-dept-head',
    ASAP_APPT_CHAIR: 'asap-appt-chair',
    ASAP_DEPT_MEMBER: 'asap-dept-member',
    ASAP_QUALITY_DEPT: 'asap-quality-dept',
};

export const NEW_APPLICATION = 0;
export const CURRENT_APPLICATION_KEY = 'currentApplicationId';
export const OPTIONS = { day: 'numeric', month: 'numeric', year: 'numeric' };

export function openApp(openApps, formatMessage) {
    const openApp = openApps.map((app, index) => ({
        id: app.id,
        application_state: app.application.application_state,
        applicant: `${app.application.applicant.user.first_name} ${app.application.applicant.user.last_name}`,
        desired_rank: `${app.application.desired_rank.name}`,
        is_done: app.application.is_done,
        stage_due_date: new Intl.DateTimeFormat('en-GB', OPTIONS).format(
            new Date(app.application.applicant.stage_due_date)
        ),
        employment_stage: formatMessage({
            id: `employment-stages.${app.application.applicant.employment_stage}`,
        }),
        department: `${app.application.applicant.department.name}`,
        last_update: new Intl.DateTimeFormat('en-GB', OPTIONS).format(new Date(app.application.updated_at)),
        wait_time: Math.round(
            (new Date().getTime() - new Date(app.application.created_at).getTime()) / (24 * 60 * 60 * 1000)
        ),
        created_at: new Intl.DateTimeFormat('en-GB', OPTIONS).format(new Date(app.application.created_at)),
        step_name: app.step_name,
        app_id: app.application.id,
        user_id: app.application.applicant.user.id,
    }));

    return openApp;
}

export const committeeType = ['ועדת מינויים - פתיחת תהליך','ועדת מינויים - אישור חברי ו.מקצועית','ועדת מינויים סופית']

export function closeApp(closeApps, formatMessage) {
    const closeApp = closeApps.map(app => ({
        id: app.id,
        application_state: app.application.application_state,
        applicant: `${app.application.applicant.user.first_name} ${app.application.applicant.user.last_name}`,
        desired_rank: `${app.application.desired_rank.name}`,
        is_done: app.application.is_done,
        stage_due_date: new Intl.DateTimeFormat('en-GB', OPTIONS).format(
            new Date(app.application.applicant.stage_due_date)
        ),
        employment_stage: formatMessage({
            id: `employment-stages.${app.application.applicant.employment_stage}`,
        }),
        department: `${app.application.applicant.department.name}`,
        last_update: new Intl.DateTimeFormat('en-GB', OPTIONS).format(new Date(app.application.updated_at)),
        wait_time: Math.round(
            (new Date().getTime() - new Date(app.application.created_at).getTime()) / (24 * 60 * 60 * 1000)
        ),
        created_at: new Intl.DateTimeFormat('en-GB', OPTIONS).format(new Date(app.application.created_at)),
        step_name: app.step_name,
        app_id: app.application.id,
        user_id: app.application.applicant.user.id,
    }));

    return closeApp;
}

export const canCancelStages = [
    'NEW-REQUESTS/APPROVE-ADMIN',
    'NEW-REQUESTS/APPROVE-CHAIRMAN-APPOINTMENTS',
    'NEW-REQUESTS/COMBINATION-TEACHING-FEEDBACK',
    'OPEN-PROCESS/SETTING-DATE-APPOINTMENT-COMMITTEE',
    'OPEN-PROCESS/APPOINTMENT-COMMITTEE-WAITING',
    'OPEN-PROCESS/ENTER-APPOINTMENT-COMMITTEE-DECISION',
    'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/RECEIVING-MATERIAL-CANDIDATE',
    'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/LOCATING-CHAIRMAN-APPOINTMENTS-COMMITTEE',
    'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/ADDITION-MEMBERS-PROFESSIONAL-COMMITTEE',
    'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/SETTING-DATE-APPOINTMENTS-COMMITTEE',
    'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/APPOINTMENT-COMMITTEE-WAITING',
    'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/ATTACHMENT-PROTOCOL-AND-LETTERS-APPOINTMENT',
    'PROFESSIONAL-COMMITTEE/CONTACT-RECOMMENDERS -AND-ATTACHING-LETTERS-RECOMMENDATION',
    'PROFESSIONAL-COMMITTEE/DETERMINE-PROFESSIONAL-COMMITTEE-REPORT-RECOMMENDATIONS',
    'FINAL-APPOINTMENTS-COMMITTEE/SETTING-DATE-FINAL-COMMITTEE',
    'FINAL-APPOINTMENTS-COMMITTEE/APPOINTMENT-COMMITTEE-WAITING',
    'FINAL-APPOINTMENTS-COMMITTEE/ENTER-COMMITTEE-DECISION',
    'REQUEST-CHE/COMPLETING-DOCUMENTS',
    'REQUEST-CHE/ENTER-GENERAL-ASSEMBLY-DECISION',
];

export const typesOfFiles = [
    {
        header: 'CV',
        count: 0,
    },
    {
        header: 'Recommend Letter',
        count: 0,
    },
    {
        header: 'Teaching Feedback',
        count: 0,
    },
    {
        header: 'Protocol',
        count: 0,
    },
    {
        header: 'Article',
        count: 0,
    },
    {
        header: 'Initiative Letter',
        count: 0,
    },
    {
        header: 'Professional Committee protocol',
        count: 0,
    },
];
export const STAGES_ADMIN = [
    {
        'NEW-REQUESTS': [
            {
                tab: 1,
                id: 1,
                header: 'אישור אדמין',
                stepName: 'NEW-REQUESTS/APPROVE-ADMIN',
                message: 'בקשה הועברה ליו"ר מינויים',
                buttonNeededRepair: true,
                isUpload: true,
                isLast: true,
                count: 0,
                subComponent: 'NewRequestFilesBtn',
                buttonClick: 'ButtonApprove',
                buttonClickAddRecommend: false,
                titleButton: 'אישור העברה ליו"ר מינויים',
                type: 'CV&Initiative Letter',
                nextStepName: 'NEW-REQUESTS/APPROVE-CHAIRMAN-APPOINTMENTS',
            },
            {
                tab: 2,
                id: 2,
                header: 'אישור יו"ר מינויים',
                stepName: 'NEW-REQUESTS/APPROVE-CHAIRMAN-APPOINTMENTS',
                isLast: false,
                count: 0,
                nextStepName: 'NEW-REQUESTS/COMBINATION-TEACHING-FEEDBACK',
            },
            {
                tab: 2,
                id: 3,
                header: 'צירוף משובי הוראה',
                stepName: 'NEW-REQUESTS/COMBINATION-TEACHING-FEEDBACK',
                isLast: true,
                count: 0,
                nextStepName: 'OPEN-PROCESS/SETTING-DATE-APPOINTMENT-COMMITTEE',
            },
        ],
    },
    {
        'OPEN-PROCESS': [
            {
                tab: 1,
                id: 1,
                header: 'קביעת ועדת מינויים',
                stepName: 'OPEN-PROCESS/SETTING-DATE-APPOINTMENT-COMMITTEE',
                message: 'אישור העברה ליו"ר מינויים',
                buttonNeededRepair: false,
                isUpload: false,
                isLast: false,
                count: 0,
                subComponent: <></>,
                buttonClick: 'CommitteeAppointmentButton',
                buttonClickAddRecommend: false,
                titleButton: 'קביעת ועדה',
                nextStepName: 'OPEN-PROCESS/APPOINTMENT-COMMITTEE-WAITING',
            },
            {
                tab: 2,
                id: 3,
                header: 'ממתינות לועדת מינויים',
                stepName: 'OPEN-PROCESS/APPOINTMENT-COMMITTEE-WAITING',
                isLast: true,
                count: 0,
                nextStepName: 'OPEN-PROCESS/ENTER-APPOINTMENT-COMMITTEE-DECISION',
            },
            {
                tab: 1,
                id: 2,
                header: 'הזנת החלטת ועדה',
                stepName: 'OPEN-PROCESS/ENTER-APPOINTMENT-COMMITTEE-DECISION',
                isLast: true,
                count: 0,
                subComponent: <></>,
                buttonClick: 'UploadFile',
                buttonClickAddRecommend: false,
                titleButton: 'צירוף פרוטוקול',
                message: 'פרוטוקול צורף',
                type: 'Protocol of the Appointments Committee - opening a process',
                nextStepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/RECEIVING-MATERIAL-CANDIDATE',
            },
        ],
    },
    {
        'ESTABLISHMENT-PROFESSIONAL-COMMITTEE': [
            {
                tab: 2,
                id: 2,
                header: 'קבלת חומר מהמועמד',
                stepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/RECEIVING-MATERIAL-CANDIDATE',
                isLast: false,
                count: 0,
                nextStepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/LOCATING-CHAIRMAN-APPOINTMENTS-COMMITTEE',
            },
            {
                tab: 1,
                id: 1,
                header: 'איתור יו"ר ועדה מקצועית',
                stepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/LOCATING-CHAIRMAN-APPOINTMENTS-COMMITTEE',
                buttonNeededRepair: false,
                titleButton: 'תזכורת ליו"ר מינויים',
                isUpload: false,
                isLast: false,
                count: 0,
                subComponent: <></>,
                buttonClick: 'ReminderChairmanButton',
                buttonClickAddRecommend: false,
                nextStepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/ADDITION-MEMBERS-PROFESSIONAL-COMMITTEE',
            },
            {
                tab: 1,
                id: 1,
                header: 'צירוף חברי ועדה מקצועית',
                stepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/ADDITION-MEMBERS-PROFESSIONAL-COMMITTEE',
                buttonNeededRepair: false,
                titleButton: 'הוספת חברי ועדה',
                isUpload: false,
                isLast: false,
                count: 0,
                subComponent: 'CandidateCommitteeLinearProgress',
                buttonClick: 'AddCommitteeCandidateButton',
                buttonClickAddRecommend: false,
                nextStepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/SETTING-DATE-APPOINTMENTS-COMMITTEE',
            },
            {
                tab: 1,
                id: 1,
                header: 'קביעת תאריך לועדת מינויים',
                stepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/SETTING-DATE-APPOINTMENTS-COMMITTEE',
                buttonNeededRepair: false,
                titleButton: 'קביעת ועדה',
                isUpload: false,
                isLast: false,
                count: 0,
                subComponent: <></>,
                buttonClick: 'CommitteeAppointmentButton',
                buttonClickAddRecommend: false,
                nextStepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/APPOINTMENT-COMMITTEE-WAITING',
            },
            {
                tab: 2,
                id: 2,
                header: 'המתנה לועדת מינויים',
                stepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/APPOINTMENT-COMMITTEE-WAITING',
                isLast: false,
                count: 0,
                nextStepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/ATTACHMENT-PROTOCOL-AND-LETTERS-APPOINTMENT',
            },
            {
                tab: 1,
                id: 1,
                header: 'הזנת החלטת ועדה',
                stepName: 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE/ATTACHMENT-PROTOCOL-AND-LETTERS-APPOINTMENT',
                buttonNeededRepair: false,
                titleButton: 'צירוף פרוטוקול',
                isUpload: false,
                isLast: true,
                count: 0,
                subComponent: <></>,
                buttonClick: 'UploadFile',
                buttonClickAddRecommend: false,
                type: 'Professional Committee protocol',
                nextStepName: 'PROFESSIONAL-COMMITTEE/CONTACT-RECOMMENDERS -AND-ATTACHING-LETTERS-RECOMMENDATION',
            },
        ],
    },
    {
        'PROFESSIONAL-COMMITTEE': [
            {
                tab: 1,
                id: 1,
                header: 'יצירת קשר עם ממליצים וצירוף מכתבי המלצה',
                stepName: 'PROFESSIONAL-COMMITTEE/CONTACT-RECOMMENDERS -AND-ATTACHING-LETTERS-RECOMMENDATION',
                buttonNeededRepair: false,
                titleButton: 'לרשימת הממליצים',
                isUpload: false,
                isLast: true,
                count: 0,
                subComponent: <></>,
                buttonClick: 'ListRecommendations',
                buttonClickAddRecommend: true,
                type: '',
                nextStepName: 'PROFESSIONAL-COMMITTEE/DETERMINE-PROFESSIONAL-COMMITTEE-REPORT-RECOMMENDATIONS',
            },
            {
                tab: 2,
                id: 2,
                header: 'קבלת דו"ח ועדה מקצועית והמלצות',
                stepName: 'PROFESSIONAL-COMMITTEE/DETERMINE-PROFESSIONAL-COMMITTEE-REPORT-RECOMMENDATIONS',
                isLast: false,
                count: 0,
                nextStepName: 'FINAL-APPOINTMENTS-COMMITTEE/SETTING-DATE-FINAL-COMMITTEE',
            },
        ],
    },
    {
        'FINAL-APPOINTMENTS-COMMITTEE': [
            {
                tab: 1,
                id: 1,
                header: 'קביעת ועדה סופית',
                stepName: 'FINAL-APPOINTMENTS-COMMITTEE/SETTING-DATE-FINAL-COMMITTEE',
                buttonNeededRepair: false,
                titleButton: 'קביעת ועדה',
                isUpload: false,
                isLast: true,
                count: 0,
                subComponent: <></>,
                buttonClick: 'CommitteeAppointmentButton',
                buttonClickAddRecommend: false,
                nextStepName: 'FINAL-APPOINTMENTS-COMMITTEE/APPOINTMENT-COMMITTEE-WAITING',
            },
            {
                tab: 2,
                id: 2,
                header: 'המתנה לועדת מינויים',
                stepName: 'FINAL-APPOINTMENTS-COMMITTEE/APPOINTMENT-COMMITTEE-WAITING',
                isLast: false,
                count: 0,
                nextStepName: 'FINAL-APPOINTMENTS-COMMITTEE/ENTER-COMMITTEE-DECISION',
            },
            {
                tab: 1,
                id: 3,
                header: 'הזנת החלטת ועדה',
                stepName: 'FINAL-APPOINTMENTS-COMMITTEE/ENTER-COMMITTEE-DECISION',
                isLast: true,
                count: 0,
                subComponent: <></>,
                buttonClick: 'UploadFile',
                type: 'Protocol of the Final Appointments Committee',
                titleButton: 'צירוף קובצים',
                buttonClickAddRecommend: false,
                nextStepName: 'REQUEST-CHE/COMPLETING-DOCUMENTS',
            },
        ],
    },
    {
        'REQUEST-CHE': [
            {
                header: 'השלמת מסמכים',
                tab: 1,
                id: 1,
                titleButton: 'צירוף קובצים',
                message: 'קבצים צורפו',
                buttonNeededRepair: false,
                isUpload: false,
                count: 0,
                stepName: 'REQUEST-CHE/COMPLETING-DOCUMENTS',
                subComponent: <></>,
                buttonClick: 'UploadFile',
                type: 'file Complete to CHE',
                buttonClickAddRecommend: false,
                nextStepName: 'REQUEST-CHE/ENTER-GENERAL-ASSEMBLY-DECISION',
            },
            {
                header: 'הזנת החלטת מל”ג',
                tab: 1,
                id: 2,
                titleButton: 'צירוף פרוטוקול',
                message: 'פרוטוקול צורף',
                buttonNeededRepair: false,
                isUpload: false,
                count: 0,
                stepName: 'REQUEST-CHE/ENTER-GENERAL-ASSEMBLY-DECISION',
                subComponent: <></>,
                buttonClick: 'UploadFile',
                buttonClickAddRecommend: false,
                type: 'Protocol CHE',
                nextStepName: 'FINISH',
            },
        ],
    },
];
