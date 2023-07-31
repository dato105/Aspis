import React from 'react';
import style from "./FileUploadSign.module.css"
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
function FileUploadSign(props) {
    const {text} = props;
        return (
            <div className={style.box} >
                <ArticleOutlinedIcon className={style.icon}/>
                <div className={style.text}>{text}</div>
            </div>
        );
    }


export default FileUploadSign;