import React, { useState } from 'react';
import { Button, TextField, MenuItem, Modal, Box } from '@mui/material';
import style from '../Button.module.css';
import IconButton from '@mui/material/IconButton';
import recommendationImg from '../../../icons/recommendation.png';
import SaveIcon from '@mui/icons-material/Save';
import { useIntl } from 'react-intl';
import './AddRecommenderButton.module.css';
import apiService from '../../../../services/api/api';
import icon from '../../../icons/proffesionalCommitteeCandidate.png';

const AddRecommenderButton = props => {
    const [open, setOpen] = useState(false);
    const { formatMessage } = useIntl();
    const [recommenderDetails, setRecommenderDetails] = useState({
        fullName: '',
        institution: '',
        researchArea: '',
        rank: '',
        phone: '',
        email: '',
        country: '',
        familiarity: '',
    });

    const handleClick = event => {
        setOpen(true);
    };

    const handleChange = event => {
        const { name, value } = event.target;
        setRecommenderDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = event => {
        event.preventDefault();
    };
    const saveRecommender = () => {
        apiService.AdminService.saveRecommender(recommenderDetails, props.userId)
            .then(data => {
                setRecommenderDetails({
                    fullName: '',
                    institution: '',
                    researchArea: '',
                    rank: '',
                    phone: '',
                    email: '',
                    country: '',
                    familiarity: '',
                });
            })
            .catch(error => {});
        setOpen(false);
    };

    return (
        <div>
            <div className={style.InProcessCardSubCardButton}>
                <IconButton className={style.waitRequestApproveBtn} variant="contained" onClick={handleClick}>
                    <img src={recommendationImg} alt={'ממליץ'} />
                    <div className={style.approveBtnText}>{props.title}</div>
                </IconButton>
            </div>
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
                            <div style={{ display: 'flex', marginRight: '20px' }}>
                                <img src={icon} alt={'ממליץ'} />
                                <div className={'Header'} variant="h6">
                                    הוספת ממליץ
                                </div>
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
                        <div className="Container">
                            <TextField
                                label="שם מלא"
                                name="fullName"
                                value={recommenderDetails.fullName}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ width: '50%' }}
                            />
                            <TextField
                                label="מוסד"
                                name="institution"
                                value={recommenderDetails.institution}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ width: '50%' }}
                            />
                        </div>
                        <div className="Container">
                            <TextField
                                select
                                label="דרגה"
                                name="rank"
                                value={recommenderDetails.rank}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ width: '50%' }}
                            >
                                <MenuItem value="מרצה">מרצה</MenuItem>
                                <MenuItem value="פרופסור חבר">פרופסור חבר</MenuItem>
                                <MenuItem value="פרופ' מן המניין">פרופ' מן המניין</MenuItem>
                                <MenuItem value="מרצה בכיר">מרצה בכיר</MenuItem>
                            </TextField>

                            <TextField
                                label="תחום מחקר"
                                name="researchArea"
                                value={recommenderDetails.researchArea}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ width: '50%' }}
                            />
                        </div>
                        <div className="Container">
                            <TextField
                                label="טלפון"
                                name="phone"
                                value={recommenderDetails.phone}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ width: '50%' }}
                            />
                            <TextField
                                label="דואר אלקטרוני"
                                name="email"
                                value={recommenderDetails.email}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ width: '50%' }}
                            />
                        </div>
                        <div className="Container">
                            <TextField
                                select
                                label="היכרות"
                                name="familiarity"
                                value={recommenderDetails.familiarity}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ width: '50%' }}
                            >
                                <MenuItem value="PROFESSIONAL">מקצועית</MenuItem>
                                <MenuItem value="PERSONAL">אישית</MenuItem>
                            </TextField>
                            <TextField
                                label="מדינה"
                                name="country"
                                value={recommenderDetails.country}
                                onChange={handleChange}
                                sx={{ width: '50%' }}
                                margin="normal"
                            ></TextField>
                        </div>
                        <div className="divButton">
                            <Button className="Button1" type={'submit'} variant="contained" onClick={saveRecommender}>
                                {formatMessage({ id: 'note.save.placeholder' })}
                                <SaveIcon fontSize="small" />
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default AddRecommenderButton;
