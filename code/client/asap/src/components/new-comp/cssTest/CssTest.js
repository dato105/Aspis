import React from 'react';
import style from './CssTest.module.css'
import Button from "@mui/material/Button";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import style2 from "../InProcessCard/InProcessCard.module.css";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";

function CssTest(){

        return (
            <div className={style.waitRequestCard}>
                <div className={style.candidateName}>דן אריאלי</div>
                <Button  className={style.candidateBagBtn}>
                    <BusinessCenterOutlinedIcon className={style2.candidateBag}/>
                    תיק מועמד
                    <ArrowBackIosOutlinedIcon className={style2.arrowCandidateBag}/>
                </Button>
                <Button  className={style.candidateBagBtn2}>
                    <BusinessCenterOutlinedIcon className={style2.candidateBag}/>
                    תיק מועמד
                    <ArrowBackIosOutlinedIcon className={style2.arrowCandidateBag}/>
                </Button>

            </div>
        );

}

export default CssTest;