import React, { useRef, useState } from 'react';
import { Button, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FormattedMessage } from 'react-intl';
import useApplications from '../../hooks/useApplications';
import style from './FileSelection.module.css';

const FileSelection = ({ id, exampleLink, title, withTitle }) => {
    const { currentApplicationId, currentApplicationState, asapAppointments, updateAsapAppointments } =
        useApplications();

    const [isFilePicked, setFilePicked] = useState(false);
    const inputFile = useRef();

    const applyFile = event => {
        const file = event.target.files[event.target.files.length - 1];
        const updatedApplicationState = { ...currentApplicationState, [id]: file };
        updateAsapAppointments({ [currentApplicationId]: updatedApplicationState });
        setFilePicked(true);
    };

    const uploadFileHandler = () => inputFile.current.click();

    const removeFileHandler = () => {
        updateAsapAppointments({ [id]: null });
        updateAsapAppointments({ [currentApplicationId]: { ...currentApplicationState, [id]: null } });
        setFilePicked(false);
    };

    return (
        <div className={style.fileSelectionContainer}>
            {withTitle && (
                <div className={style.labelContainer}>
                    <label>{title}:</label>
                    {exampleLink && (
                        <Link href={exampleLink} target="_blank" rel="noreferrer" className={style.example}>
                            <FormattedMessage id={'appointment.example'} />
                        </Link>
                    )}
                </div>
            )}
            <Button onClick={uploadFileHandler} variant="contained">
                <input type="file" hidden onChange={applyFile} id={id} ref={inputFile} />
                <div>
                    <FormattedMessage id={'appointment.file-selection'} />
                </div>
            </Button>
            {isFilePicked && (
                <div className={style.selectedFileContainer}>
                    <div className={style.selectedFile}>
                        <label>{asapAppointments[currentApplicationId][id]?.name}</label>
                        <CloseIcon onClick={removeFileHandler} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileSelection;
