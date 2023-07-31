import style from '../Button.module.css';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DragDrop from '../../DragAndDropWindow/DragDrop';
import React, {useState} from 'react';

function UploadFileButton(props) {
    const {card, stage, setRender, title} = props;

    const [openPopperFile, setOpenPopperFile] = useState(false);

    const handleClickPopper = () => {
        setOpenPopperFile(true);
    };
    return (
        <div className={style.InProcessCardSubCardButton}>
            <IconButton
                className={style.waitRequestApproveBtn}
                onClick={() => {
                    handleClickPopper();
                }}
                variant="contained"
            >
                <AttachFileIcon fontSize="small" sx={{color: 'white', transform: 'rotate(45deg)'}}/>
                <div className={style.approveBtnText}>{title}</div>
            </IconButton>
            <DragDrop
                setOpenPopperFile={setOpenPopperFile}
                openPopperFile={openPopperFile}
                card={card}
                stage={stage}
                setRender={setRender}
            />
        </div>
    );
}

export default UploadFileButton;
