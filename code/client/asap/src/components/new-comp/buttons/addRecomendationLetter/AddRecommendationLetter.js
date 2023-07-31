import style from '../Button.module.css';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DragDrop from '../../DragAndDropWindow/DragDrop';
import React, {useState} from 'react';

function AddRecommendationLetter(props) {
    const {card, stage, setRender, title,userId} = props;
    const updatedStage = { ...stage };
    updatedStage['type'] = 'Recommend Letter'

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

            >
                <AttachFileIcon fontSize="small" sx={{color: '1155BB', transform: 'rotate(45deg)'}}/>
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

export default AddRecommendationLetter;
