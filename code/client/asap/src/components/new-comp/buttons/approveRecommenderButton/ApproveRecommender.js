import React from "react";
import apiService from "../../../../services/api/api";
import style from "../Button.module.css";
import IconButton from "@mui/material/IconButton";



function ApproveRecommender(props) {

    const { setRender,userId , title} = props;
    const nextState = 'APPROVED'

    const handleClick = () => {
             apiService.AdminService.updateRecommendationStep(userId,nextState).then(
                 response => response.data
             );
        setRender(true)
    }

    return (
        <div className={style.InProcessCardSubCardButton}>
            <IconButton
                className={style.tableRowBtn}
                onClick={() => {
                    handleClick();
                }}

            >
                <div className={style.tableRowText}>{title}</div>
            </IconButton>
        </div>
    );
}

export default ApproveRecommender;