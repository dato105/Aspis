import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import style from './TableCandidateFiles.module.css';
import apiService from '../../../services/api/api';
import { OPTIONS } from '../../../constants';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import IconButton from '@mui/material/IconButton';
import he from '../../../services/i18n/locales/he.json';
import FilterFilesCandidateTableBtn from '../buttons/filterFilesCandidateTableBtn/FilterFilesCandidateTableBtn';
import AddFileCandidateTable from '../buttons/addFileCandidateTable/AddFileCandidateTable';
import icon1 from '../../icons/Vector 42 (Stroke).png';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Checkbox } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

const columns = [
    { id: 'fileName', label: 'שם מסמך' },
    { id: 'uploadWith', label: 'הועלה ע"י' },
    { id: 'date', label: 'בתאריך' },
];

const TableCandidateFiles = props => {
    const { userId } = props;
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [render, setRender] = useState(true);
    const [selected, setSelected] = useState([]);

    const allSelected = event => {
        const extractedObject = Object.entries(data).map(([key1, value], index) => value);

        setSelected(selected.length === Object.keys(data).length ? [] : extractedObject);
    };

    const handleChange = value => {
        if (selected.indexOf(value) !== -1) {
            const newSelected = selected.filter(s => s !== value);
            setSelected(newSelected);
        } else {
            setSelected([...selected, value]);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.AdminService.getCandidateDetails(userId);
                if (response) {
                    const application_state = response.application.application_state[0];
                    if (application_state && application_state.hasOwnProperty('CV&Initiative Letter')) {
                        const { 'CV&Initiative Letter': cvAndInitiativeLetter, ...rest } = application_state;
                        const { CV, 'Initiative Letter': initiativeLetter } = cvAndInitiativeLetter;

                        const updatedApplicationState = {
                            ...rest,
                            CV,
                            'Initiative Letter': initiativeLetter,
                        };

                        setData(updatedApplicationState);
                        setFilterData(updatedApplicationState);
                    } else {
                        setData(application_state);
                        setFilterData(application_state);
                    }
                }
            } catch (error) {}
        };

        fetchData().then(r => {});
        setRender(true);
    }, [userId, render]);

    const handleClick = async fileUrl => {
        try {
            const response = await apiService.AdminService.downloadFile(fileUrl);
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
    };

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
                                    <div className={style.NameHeader}>{column.label}</div>
                                </TableCell>
                            ))}
                            <TableCell
                                key={5}
                                sx={{
                                    minWidth: '100px',
                                    borderBottom: 'none',
                                    borderTop: 'none',
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                    gap: '20px',
                                }}
                            >
                                <Checkbox onChange={allSelected} />
                                <FileDownloadOutlinedIcon color={'primary'} className={style.downloadIcon} />
                                <img src={icon1} alt={'vector24'} className={style.icon1} />
                                <AddFileCandidateTable
                                    title={'צירוף קובץ'}
                                    setRender={props.setRender}
                                    card={props.card}
                                    stage={props.stage}
                                    userId={props.userId}
                                />
                                <FilterFilesCandidateTableBtn
                                    title={'סנן מסמכים'}
                                    setFilterData={setFilterData}
                                    data={data}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(filterData).map(([key1, value], index) => {
                            return (
                                <TableRow key={index} sx={{ borderBottom: 1, borderColor: '#DADADF' }}>
                                    {columns.map((column, index) => {
                                        if (column.id === 'fileName') {
                                            return (
                                                <TableCell sx={{ borderBottom: 'none' }} key={index}>
                                                    <IconButton
                                                        className={style.subGroupBtnTable}
                                                        onClick={() => {
                                                            handleClick(value['url']);
                                                        }}
                                                        sx={{
                                                            '&:hover': {
                                                                bgcolor: 'transparent',
                                                            },
                                                        }}
                                                    >
                                                        <ArticleOutlinedIcon className={style.letterIcon} />
                                                        <div className={style.txt}>{he['file_type'][key1]}</div>
                                                    </IconButton>
                                                </TableCell>
                                            );
                                        } else if (column.id === 'date')
                                            return (
                                                <TableCell key={column.id} sx={{ borderBottom: 'none' }}>
                                                    {new Intl.DateTimeFormat('en-GB', OPTIONS).format(
                                                        new Date(value[column.id])
                                                    )}
                                                </TableCell>
                                            );
                                        else
                                            return (
                                                <TableCell sx={{ borderBottom: 'none' }} key={column.id}>
                                                    {value[column.id]}
                                                </TableCell>
                                            );
                                    })}
                                    <TableCell
                                        key={10}
                                        sx={{
                                            minWidth: '100px',
                                            borderBottom: 'none',
                                            display: 'flex',
                                            flexDirection: 'row-reverse',
                                        }}
                                    >
                                        <Checkbox
                                            value={value}
                                            onChange={() => handleChange(value)}
                                            checked={selected.includes(value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default TableCandidateFiles;
