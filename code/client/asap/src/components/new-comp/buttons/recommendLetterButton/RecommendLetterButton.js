import React from "react";
import apiService from "../../../../services/api/api";
import style from "../../tableRecommenders/TableRecommenders.module.css";
import IconButton from "@mui/material/IconButton";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

function RecommendLetterButton(props) {

    const {  title, file} = props;

    const handleClick = async () => {
        try {
            const response = await apiService.AdminService.downloadFile(file);

            const downloadUrl = window.URL.createObjectURL(response.data);

            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = response.headers['content-disposition'].split('=')[1];
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error while downloading file:', error);
        }

    }

    return (

            <IconButton
                className={style.subGroupBtnTable}
                onClick={() => {
                    handleClick();
                }}
            >
               < ArticleOutlinedIcon className={style.letterIcon}/>
                <div className={style.txt}>{title}</div>
            </IconButton>

    );
}

export default RecommendLetterButton;