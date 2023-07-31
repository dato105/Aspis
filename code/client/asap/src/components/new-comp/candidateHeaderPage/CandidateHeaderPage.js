import React from 'react';
import style from './CandidateHeaderPage.module.css';
import { Avatar } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

const CandidateHeaderPage = props => {
    return (
        <div className={style.WrapperHeader}>
            <div className={style.AvatarAndName}>
                <Avatar sx={{ width: 56, height: 56 }} alt={props.name} src={props.image} />
                <div className={style.RankAndName}>
                    <ListItemText primary={<h2 className={style.Name}>{props.name}</h2>} secondary={props.rank} />
                </div>
            </div>
            <div>
                <ListItemText sx={{ paddingTop: '15px' }} primary={'שלב'} secondary={props.stageRequest} />
            </div>
            <div>
                <ListItemText sx={{ paddingTop: '15px' }} primary={'סטטוס'} secondary={props.statusRequest} />
            </div>
        </div>
    );
};

export default CandidateHeaderPage;
