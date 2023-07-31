import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import AddRecommenderButton from '../buttons/addRecommenderButton/AddRecommenderButton';
import style from './TableRecommenders.module.css';
import apiService from '../../../services/api/api';
import { useIntl } from 'react-intl';
import AddRecommendationLetter from '../buttons/addRecomendationLetter/AddRecommendationLetter';
import ApproveRecommender from '../buttons/approveRecommenderButton/ApproveRecommender';
import RejectedButton from '../buttons/rejectedButton/RejectedButton';
import RecommendLetterButton from '../buttons/recommendLetterButton/RecommendLetterButton';
import TableContainer from '@mui/material/TableContainer';

const columns = [
    { id: 'name', label: 'שם ממליץ' },
    { id: 'rank', label: 'דרגה' },
    { id: 'institute', label: 'מוסד' },
    { id: 'familiarity', label: 'רמת היכרות' },
    { id: 'researchField', label: 'תחום מחקר' },
    { id: 'phone', label: 'טלפון' },
    { id: 'email', label: 'דוא"ל' },
    { id: 'action', label: '' },
];

const TableRecommenders = props => {
    const [data, setData] = useState([]);
    const { card } = props;
    const { formatMessage } = useIntl();
    const [render, setRender] = useState(false);

    useEffect(() => {
        apiService.AdminService.getRecommendations(props.userId).then(response => {
            if (response) {
                const mappedData = response.map(item => ({
                    name: item.name,
                    rank: item.rank,
                    institute: item.institute,
                    familiarity: formatMessage({ id: `familiarity.${item.familiarity}` }),
                    researchField: item.researchField,
                    phone: item.phone,
                    email: item.email,
                    state: item.state,
                }));
                setData(mappedData);
                setRender(false);
            }
        });
    }, [render, props.userId, formatMessage]);

    return (
        <Paper>
            <TableContainer sx={{ maxHeight: 320 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell
                                    key={column.id}
                                    sx={{
                                        minWidth: column.minWidth,
                                        borderBottom: 'none',
                                        borderTop: 'none',
                                    }}
                                >
                                    {column.id !== 'action' && <div className={style.NameHeader}>{column.label}</div>}
                                </TableCell>
                            ))}
                            <TableCell
                                key={10}
                                sx={{
                                    minWidth: '100px',
                                    borderBottom: 'none',
                                    borderTop: 'none',
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                }}
                            >
                                <AddRecommenderButton
                                    title={props.title}
                                    setRender={props.setRender}
                                    card={props.card}
                                    stage={props.stage}
                                    userId={props.userId}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map(column => (
                                    <TableCell key={column.id}>{row[column.id]}</TableCell>
                                ))}
                                <TableCell
                                    key={10}
                                    sx={{
                                        minWidth: '100px',
                                        borderBottom: 'none',
                                        borderTop: 'none',
                                        display: 'flex',
                                        flexDirection: 'row-reverse',
                                    }}
                                >
                                    {row['state'] === 'APPROVED' &&
                                        !card.application_state[0].hasOwnProperty('Recommend Letter') && (
                                            <div className={style.subGroupBtnTable}>
                                                <AddRecommendationLetter
                                                    title={'צירוף המלצה'}
                                                    card={props.card}
                                                    stage={props.stage}
                                                    userId={props.userId}
                                                    setRender={props.setRender}
                                                />
                                                <RejectedButton
                                                    title={'סירוב'}
                                                    setRender={props.setRender}
                                                    card={props.card}
                                                    stage={props.stage}
                                                    userId={props.userId}
                                                />
                                            </div>
                                        )}
                                    {row['state'] === 'APPROVAL_RECOMMENDED_BY_A_PROFESSIONAL_COMMITTEE' && (
                                        <ApproveRecommender
                                            title={'אישור ממליץ ע"י ו.מקצועית'}
                                            state={row['state']}
                                            userId={props.userId}
                                            setRender={setRender}
                                        />
                                    )}
                                    {row['state'] === 'REJECTED' && <div className={style.rejectTxt}>סירוב</div>}
                                    {row['state'] === 'NOT_YET_APPROVED_BY_A_PROFESSIONAL_COMMITTEE' && (
                                        <div className={style.txt}>טרם אושר ע"י יו"ר ועדה מקצועית</div>
                                    )}
                                    {row['state'] === 'APPROVED' &&
                                        card.application_state[0].hasOwnProperty('Recommend Letter') && (
                                            <RecommendLetterButton
                                                title={'מכתב המלצה'}
                                                file={card.application_state[0]['Recommend Letter']['url']}
                                            />
                                        )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default TableRecommenders;
