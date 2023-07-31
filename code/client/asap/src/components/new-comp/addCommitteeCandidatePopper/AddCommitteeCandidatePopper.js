import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Modal, TextField } from '@mui/material';
import style from './AddCommitteeCandidatePopper.module.css';
import { useIntl } from 'react-intl';
import SaveIcon from '@mui/icons-material/Save';
import icon from '../../icons/proffesionalCommitteeCandidate.png';
import apiService from '../../../services/api/api';
import { canCancelStages } from '../../../constants';

function AddCommitteeCandidatePopper(props) {
    const { formatMessage } = useIntl();
    const { setOpen, open, card, stage, setRender, setCountCommitteeCand } = props;
    const [isDisabled, setIsDisabled] = useState(true);
    const [isDisabledFields1, setIsDisabledFields1] = useState(false);
    const [isDisabledFields2] = useState(false);
    const [committeeCandidate1Details, setCommitteeCandidate1Details] = useState({
        fullName: '',
        institution: '',
        researchArea: '',
        degree: '',
        phone: '',
        email: '',
        isSaved: false,
    });
    const [committeeCandidate2Details, setCommitteeCandidate2Details] = useState({
        fullName: '',
        institution: '',
        researchArea: '',
        degree: '',
        phone: '',
        email: '',
        isSaved: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.AdminService.getCommitteeCandidate(card.user_id);
                if (response) {
                    if (response?.length > 0) {
                        const committeeCandidate1 = response[0];
                        setCommitteeCandidate1Details(prevState => ({
                            ...prevState,
                            fullName: committeeCandidate1['full_name'],
                            institution: committeeCandidate1['institution'],
                            degree: committeeCandidate1['degree'],
                            researchArea: committeeCandidate1['research_area'],
                            phone: committeeCandidate1['phone'],
                            email: committeeCandidate1['email'],
                            isSaved: true,
                        }));
                        setIsDisabledFields1(true);
                        setCountCommitteeCand(1);
                    }
                }
            } catch (error) {}
        };
        fetchData().then(r => {});
        setRender(false);
    }, [card.user_id, setCountCommitteeCand, open, setRender]);

    const checkFieldsNotEmpty = () => {
        let isAnyFieldEmpty1 = Object.values(committeeCandidate1Details).some(value => value === '');
        let isAnyFieldEmpty2 = Object.values(committeeCandidate2Details).some(value => value === '');

        if (!committeeCandidate1Details.isSaved) {
            if (!isAnyFieldEmpty1) {
                setIsDisabled(isAnyFieldEmpty1);
                return;
            }
        } else if (!isAnyFieldEmpty2) {
            setIsDisabled(isAnyFieldEmpty2);
        }
    };

    const saveClick = () => {
        if (!committeeCandidate1Details.isSaved)
            apiService.AdminService.saveCommitteeCandidate(committeeCandidate1Details, card.user_id)
                .then(response => {
                    setCommitteeCandidate1Details(prevState => ({
                        ...prevState,
                        isSaved: true,
                    }));
                    setRender(true);
                })
                .catch(error => {});
        else
            apiService.AdminService.saveCommitteeCandidate(committeeCandidate2Details, card.user_id)
                .then(response => {
                    let can_cancel = 0;
                    if (canCancelStages.includes(card.step_name)) can_cancel = 1;
                    apiService.AdminService.updateApplicationStep(
                        stage.nextStepName,
                        card.app_id,
                        can_cancel,
                        card.id
                    ).then(response => response.data);
                    setRender(false);
                })
                .catch(error => {});
        setOpen(false);
    };

    const handleChange = (num, event) => {
        const { name, value } = event.target;
        if (num === 1)
            setCommitteeCandidate1Details(prevDetails => ({
                ...prevDetails,
                [name]: value,
            }));
        else
            setCommitteeCandidate2Details(prevDetails => ({
                ...prevDetails,
                [name]: value,
            }));
        checkFieldsNotEmpty();
    };

    const handleSubmit = event => {
        event.preventDefault();
    };

    return (
        <div>
            <Modal open={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        backgroundColor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div className={style.header}>הוספת חברי ועדה מקצועית</div>
                            </div>
                            <div>
                                <Button
                                    sx={{
                                        color: '#212121',
                                        width: '0px',
                                        height: '0px',
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            boxShadow: 'none',
                                        },
                                    }}
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    X
                                </Button>
                            </div>
                        </div>
                        <div className={style.subHeader}>
                            <img className={style.icon} src={icon} alt={'ועדה'} />
                            חבר ועדה ראשון
                        </div>
                        <div className={style.container}>
                            <TextField
                                className={style.textField}
                                label="שם מלא"
                                name="fullName"
                                value={committeeCandidate1Details.fullName}
                                onChange={event => handleChange(1, event)}
                                margin="normal"
                                disabled={isDisabledFields1}
                            />
                            <TextField
                                className={style.textField}
                                label="מוסד"
                                name="institution"
                                value={committeeCandidate1Details.institution}
                                onChange={event => handleChange(1, event)}
                                margin="normal"
                                disabled={isDisabledFields1}
                            />
                        </div>
                        <div className={style.container}>
                            <TextField
                                className={style.textField}
                                label="דרגה"
                                name="degree"
                                select
                                value={committeeCandidate1Details.degree}
                                onChange={event => handleChange(1, event)}
                                margin="normal"
                                disabled={isDisabledFields1}
                            >
                                <MenuItem value="מרצה">מרצה</MenuItem>
                                <MenuItem value="דוקטור">דוקטור</MenuItem>
                                <MenuItem value="פרופסור">פרופסור</MenuItem>
                                <MenuItem value="מרצה מן המניין">מרצה מן המניין</MenuItem>
                                <MenuItem value="מרצה בכיר">מרצה בכיר</MenuItem>
                            </TextField>

                            <TextField
                                className={style.textField}
                                label="תחום מחקר"
                                name="researchArea"
                                value={committeeCandidate1Details.researchArea}
                                onChange={event => handleChange(1, event)}
                                margin="normal"
                                disabled={isDisabledFields1}
                            />
                        </div>
                        <div className={style.container}>
                            <TextField
                                className={style.textField}
                                label="טלפון"
                                name="phone"
                                value={committeeCandidate1Details.phone}
                                onChange={event => handleChange(1, event)}
                                margin="normal"
                                disabled={isDisabledFields1}
                            />
                            <TextField
                                className={style.textField}
                                label="דואר אלקטרוני"
                                name="email"
                                value={committeeCandidate1Details.email}
                                onChange={event => handleChange(1, event)}
                                margin="normal"
                                disabled={isDisabledFields1}
                            />
                        </div>
                        <div className={style.subHeader}>
                            <img className={style.icon} src={icon} alt={'ועדה'} />
                            חבר ועדה שני
                        </div>
                        <div className={style.container}>
                            <TextField
                                className={style.textField}
                                label="שם מלא"
                                name="fullName"
                                value={committeeCandidate2Details.fullName}
                                onChange={event => handleChange(2, event)}
                                margin="normal"
                                disabled={isDisabledFields2}
                            />
                            <TextField
                                className={style.textField}
                                label="מוסד"
                                name="institution"
                                value={committeeCandidate2Details.institution}
                                onChange={event => handleChange(2, event)}
                                margin="normal"
                                disabled={isDisabledFields2}
                            />
                        </div>
                        <div className={style.container}>
                            <TextField
                                className={style.textField}
                                label="דרגה"
                                name="degree"
                                select
                                value={committeeCandidate2Details.degree}
                                onChange={event => handleChange(2, event)}
                                margin="normal"
                                disabled={isDisabledFields2}
                            >
                                <MenuItem value="מרצה">מרצה</MenuItem>
                                <MenuItem value="פרופסור חבר">פרופסור חבר</MenuItem>
                                <MenuItem value="פרופ' מן המניין">פרופ' מן המניין</MenuItem>
                                <MenuItem value="מרצה בכיר">מרצה בכיר</MenuItem>
                            </TextField>

                            <TextField
                                className={style.textField}
                                label="תחום מחקר"
                                name="researchArea"
                                value={committeeCandidate2Details.researchArea}
                                onChange={event => handleChange(2, event)}
                                margin="normal"
                                disabled={isDisabledFields2}
                            />
                        </div>
                        <div className={style.container}>
                            <TextField
                                className={style.textField}
                                label="טלפון"
                                name="phone"
                                value={committeeCandidate2Details.phone}
                                onChange={event => handleChange(2, event)}
                                margin="normal"
                                disabled={isDisabledFields2}
                            />
                            <TextField
                                className={style.textField}
                                label="דואר אלקטרוני"
                                name="email"
                                value={committeeCandidate2Details.email}
                                onChange={event => handleChange(2, event)}
                                margin="normal"
                                disabled={isDisabledFields2}
                            />
                        </div>
                        <div className="divButton">
                            <Button
                                className="Button1"
                                type={'submit'}
                                variant="contained"
                                onClick={saveClick}
                                disabled={isDisabled}
                            >
                                {formatMessage({ id: 'note.save.placeholder' })}
                                <SaveIcon fontSize="small" />
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}

export default AddCommitteeCandidatePopper;
