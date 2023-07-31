import React from 'react';
import { Box, Button, Modal } from '@mui/material';
import { styled } from '@mui/material';
import DropIcon from './DropIcon';
import './draganddrop.css';
import SaveIcon from '@mui/icons-material/Save';
import { useIntl } from 'react-intl';
import apiService from '../../../services/api/api';

const ChooseFileButton = styled(Button)({
    border: '1px solid',
    borderRadius: '20px',
    borderColor: '#1155BB',
});

function DragDrop(props) {
    const { card, stage, setOpenPopperFile, openPopperFile, setRender } = props;
    const [dragActive, setDragActive] = React.useState(false);
    const [filesDropped, setFilesDropped] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const inputRef = React.useRef(null);
    const { formatMessage } = useIntl();
    const nextState = 'APPROVED'

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files);
            setFilesDropped(true);
        }
    };

    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setFilesDropped(true);
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const handleClick = () => {
        setOpenPopperFile(false);
    };

    const saveClick = () => {
        apiService.AdminService.uploadFile(file, card.app_id, stage.type)
            .then(response => {
            })
            .catch(error => {
            });
        if (stage.type !== 'Recommend Letter') {
                    apiService.AdminService.updateApplicationStep(stage.nextStepName, card.app_id, 1, card.id).then(
                        response => response.data
                    );
        }
    else{
            apiService.AdminService.updateRecommendationStep(props.userId,nextState).then(
                response => response.data
            );
        }
        setRender(false);
        setOpenPopperFile(false);
    };

    return (
        <div>
            <Modal open={openPopperFile}>
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
                    <div className="cardTitle">
                        <h4>{stage.titleButton}</h4>
                        <div className="DivButtonClose">
                            <Button
                                sx={{
                                    color: 'black',
                                    padding: 0,
                                    '&:hover': {
                                        backgroundColor: 'inherit',
                                        textDecoration: 'none',
                                    },
                                }}
                                onClick={handleClick}
                            >
                                X
                            </Button>
                        </div>
                    </div>
                    <center>
                        <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={e => e.preventDefault()}>
                            <input
                                ref={inputRef}
                                type="file"
                                id="input-file-upload"
                                multiple={true}
                                onChange={handleChange}
                            />
                            <label
                                id="label-file-upload"
                                htmlFor="input-file-upload"
                                className={dragActive ? 'drag-active' : ''}
                            >
                                <div>
                                    <DropIcon />
                                    <br></br>
                                    <p>גרור קובץ לכאן</p>

                                    <p>או</p>
                                    <ChooseFileButton onClick={onButtonClick}>בחר קבצים</ChooseFileButton>
                                </div>
                            </label>
                            {dragActive && (
                                <div
                                    id="drag-file-element"
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                ></div>
                            )}
                        </form>
                        {filesDropped && <p>הקובץ עלה</p>}
                    </center>
                    <div className="divButton">
                        <Button
                            className="Button1"
                            type={'submit'}
                            variant="contained"
                            onClick={saveClick}
                            disabled={!file}
                        >
                            {formatMessage({ id: 'note.save.placeholder' })}
                            <SaveIcon fontSize="small" />
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default DragDrop;
