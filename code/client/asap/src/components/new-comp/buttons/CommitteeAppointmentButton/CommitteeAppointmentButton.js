import style from "../../../page-admin/newRequest/NewRequest.module.css";
import Button from "@mui/material/Button";
import React, {useState} from "react";
import apiService from "../../../../services/api/api";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Manager, Popper } from 'react-popper';
import style1 from "./CommitteeAppointmentButton.module.css"
import {canCancelStages} from "../../../../constants";


const CommitteeAppointmentButton = (props) => {
    const { title, setRender, card, stage} = props;
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const popperStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
        zIndex: 1,
    };

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleApprove = () => {
        if (selectedDate && selectedTime) {
            let can_cancel = 0;
            if (canCancelStages.includes(card.step_name)) can_cancel = 1;

                apiService.AdminService.updateApplicationStep(stage.nextStepName, card.app_id, can_cancel, card.id).then(
                    (response) => response.data
                );

            setIsOpen(!isOpen);
            setRender(false);
            const formattedDate = selectedDate.toISOString().split('T')[0];
            apiService.AdminService.createCommittee(formattedDate,selectedTime ,'APPOINTMENTS_COMMITTEE').then((response) =>
                response.data
            );
        }
    };

    return (
        <div className={style.InProcessCardSubCardButton}>
            <Button className={style.waitRequestApproveBtn} onClick={handleClick} variant="contained" disableElevation>
                <CalendarMonthOutlinedIcon color={'inherit'} />
                <div className={style.approveBtnText}>{title}</div>
            </Button>
            <Manager>
                {isOpen && (
                    <Popper placement="bottom" modifiers={{ computeStyle: { gpuAcceleration: false } }}>
                        {({ ref, style, placement }) => (
                            <div ref={ref} style={{ ...style, ...popperStyle }} data-placement={placement}>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    inline
                                />
                                <div style={{ display: 'flex', marginTop: '1rem' }}>
                                    <input
                                        type="time"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        style={{ flex: '1 0 auto', marginRight: '1rem', width: 'auto' }}
                                    />
                                    <Button className={style1.approveBtn} onClick={handleApprove}>
                                        אישור
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Popper>
                )}
            </Manager>
        </div>
    );
};

export default CommitteeAppointmentButton;