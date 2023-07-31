import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '../buttons/IconButton';
import style from './candidateinprogresslist.module.css';
import apiService from '../../../services/api/api';
import { useEffect, useState } from 'react';
import { ASAP_ADMIN_CANDIDATE_PAGE } from '../../../services/routing/routes';
import { useNavigate } from 'react-router-dom';

export default function AlignItemsList(props) {
    const [candidateList, setCandidateList] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiService.AdminService.getListCandidates();
                if (response && response !== undefined) {
                    setCandidateList(response);
                }
            } catch (error) {}
        }

        fetchData().then(r => {});
    }, []);

    const listItem = candidateList?.map(candidate => {
        return (
            <ListItem key={candidate.id} alignItems="flex-start" className={style.allCard}>
                <div className={style.textAndAvatar}>
                    <ListItemAvatar>
                        <Avatar alt={candidate.name} src={candidate.picture} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={candidate.name}
                        secondary={<React.Fragment>{candidate.department}</React.Fragment>}
                    />
                </div>
                <div className={style.Button}>
                    <IconButton
                        title="לתיק מועמד"
                        image={props.image}
                        click={() => {
                            navigate(`/${ASAP_ADMIN_CANDIDATE_PAGE}/${candidate.id}`);
                        }}
                    />
                </div>
            </ListItem>
        );
    });
    return (
        <div className={style.Wrap}>
            <div className={style.Title}>
                <p className={style.Name}>{'מועמדים בתהליך'}</p>
                <p className={style.CountCandidates}>{candidateList.length}</p>
            </div>
            <List
                sx={{
                    maxHeight: 330,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '0.2em',
                    },
                    '&::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.1)',
                        outline: '1px solid slategrey',
                    },
                }}
            >
                {listItem}
            </List>
        </div>
    );
}
