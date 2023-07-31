import React, { useState } from 'react';
import { Button, Modal, Box, TextField } from '@mui/material';
import { useIntl } from 'react-intl';
import style from './RequirementForRepaerINote.module.css';
import SaveIcon from '@mui/icons-material/Save';
import apiService from '../../../services/api/api';

function RequirementForRepaerINote(props) {
    const [dataNote, SetDataNote] = useState({ body: '' });
    const { formatMessage } = useIntl();
    const { setOpenNote, openNote, appID, stage } = props;

    const handleChange = prop => event => SetDataNote({ ...dataNote, [prop]: event.target.value });
    const handleClick = () => {
        setOpenNote(false);
    };

    const onClick = () => {
        apiService.AdminService.setCandidateNote(dataNote.body, appID, stage.type).then(response => response.data);
        SetDataNote({ body: '' });
        setOpenNote(false);
    };

    return (
        <Modal open={openNote}>
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
                <div className={style.cardTitle}>
                    <h4>{formatMessage({ id: 'note.title.placeholder' })}</h4>
                    <div className={style.DivButtonClose}>
                        <Button className={style.CloseButton} onClick={handleClick}>
                            X
                        </Button>
                    </div>
                </div>
                <div>
                    <p className={style.TextP}>{formatMessage({ id: 'note.body.placeholder' })}</p>
                    <TextField
                        className={style.TextFieldBody}
                        multiline
                        rows={3}
                        type={'text'}
                        value={dataNote.body}
                        onChange={handleChange('body')}
                    />
                </div>
                <div className={style.divButton}>
                    <Button className={style.Button1} type={'submit'} variant="contained" onClick={onClick}>
                        {formatMessage({ id: 'note.save.placeholder' })}
                        <SaveIcon fontSize="small" />
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default RequirementForRepaerINote;
