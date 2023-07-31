import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import style from './TableCommittee.module.css';
import apiService from '../../../services/api/api';
import TableContainer from '@mui/material/TableContainer';

const TableCommittee = props => {
    const { user_id } = props;
    const [candidatesData, setCandidatesData] = useState([]);
    const columns = [
        { id: 'role', label: 'תפקיד' },
        { id: 'name', label: 'שם' },
        { id: 'rank', label: 'דרגה' },
        { id: 'institution', label: 'מוסד' },
        { id: 'field', label: 'תחום מחקר' },
        { id: 'phone', label: 'טלפון' },
        { id: 'email', label: 'דוא"ל' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.AdminService.getCommitteeCandidate(user_id);
                if (response) {
                    const candidates = response.map(candidate => ({
                        role: candidate.is_chairman ? 'יו"ר' : 'חברה ועדה',
                        name: candidate.full_name,
                        rank: candidate.degree,
                        institution: candidate.institution,
                        field: candidate.research_area,
                        phone: candidate.phone,
                        email: candidate.email,
                    }));
                    setCandidatesData(candidates);
                }
            } catch (error) {}
        };

        fetchData().then(r => {});
    }, [user_id]);

    return (
        <div className={style.TableContainer}>
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
                                        <div className={style.NameHeader}>{column.label}</div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {candidatesData.map((row, index) => (
                                <TableRow key={index}>
                                    {columns.map(column => (
                                        <TableCell key={column.id}>{row[column.id]}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

export default TableCommittee;
