import style from '../Button.module.css';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DragDrop from '../../DragAndDropWindow/DragDrop';
import React, {useState} from 'react';

function AddFileCandidateTable(props) {
    const {card, stage, setRender, title,userId} = props;
    const updatedStage = { ...stage };
    //TODO add all types anf filter them by client choose
    updatedStage['type'] = 'Recommend Letter'
    updatedStage['titleButton'] = 'העלאת קבצים נוספים למועמד'


    const [openPopperFile, setOpenPopperFile] = useState(false);

    const handleClickPopper = () => {
        setOpenPopperFile(true);
    };
    return (
        <div className={style.InProcessCardSubCardButton}>
            <IconButton
                className={style.tableRowBtn}
                onClick={() => {
                    handleClickPopper();
                }}
                style={{ marginTop: "5px" }}
            >
                <AttachFileIcon fontSize="small" sx={{ transform: 'rotate(45deg)'}} color={'primary'} />
                <div className={style.tableRowText}>{title}</div>
            </IconButton>
            <DragDrop
                setOpenPopperFile={setOpenPopperFile}
                openPopperFile={openPopperFile}
                card={card}
                stage={updatedStage}
                setRender={setRender}
                userId={userId}
            />
        </div>
    );
}

export default AddFileCandidateTable;


