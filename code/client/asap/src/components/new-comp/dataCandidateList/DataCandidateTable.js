import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Checkbox } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import { useState } from 'react';

function createData(id, name, uploaded, date) {
    return { id, name, uploaded, date };
}

const rows = [
    createData(1, 'קורות חיים בפורמט מל"ג', 'דן אריאלי', '16/05/22'),
    createData(2, 'מכתב יוזם', 'דן אריאלי', '02/05/22'),
];

export default function DataCandidateTable() {
    const [checked, setChecked] = useState([false, false, false, false]);
    const [lastChange, setLastChange] = useState(true);

    function handleCheckOne(id) {
        let newChecked = [...checked];
        newChecked[id - 1] = !newChecked[id - 1];
        setChecked(newChecked);
    }
    function handleCheckAll() {
        setLastChange(!lastChange);
        let newChecked = [...checked];
        for (let i = 0; i < newChecked.length; i++) {
            newChecked[i] = lastChange;
        }
        setChecked(newChecked);
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Box
                                sx={{
                                    width: '60px',
                                    backgroundColor: '#F3F6FE',
                                }}
                            >
                                שם מסמך{' '}
                            </Box>
                        </TableCell>
                        <TableCell align="left">
                            <Box
                                sx={{
                                    width: '60px',
                                    backgroundColor: '#F3F6FE',
                                }}
                            >
                                הועלה ע"י
                            </Box>
                        </TableCell>
                        <TableCell align="right">
                            <Box
                                sx={{
                                    width: '60px',
                                    backgroundColor: '#F3F6FE',
                                }}
                            >
                                בתאריך
                            </Box>
                        </TableCell>
                        <TableCell align="right">
                            {' '}
                            <Button disabled={false} variant="outlined" startIcon={<FilterAltOutlinedIcon />}>
                                סנן מסמכים
                            </Button>{' '}
                        </TableCell>
                        <TableCell align="left">
                            <Button variant="outlined" startIcon={<AttachFileOutlinedIcon color="primary" />}>
                                צירוף קבצים
                            </Button>
                        </TableCell>
                        <TableCell align="right">
                            <IconButton>
                                <SendOutlinedIcon color="primary" />
                            </IconButton>
                        </TableCell>
                        <TableCell align="right">
                            <IconButton>
                                <DownloadIcon color="primary" />
                            </IconButton>
                        </TableCell>
                        <TableCell align="right">
                            <Checkbox
                                checked={checked[0] && checked[1]}
                                indeterminate={checked[0] !== checked[1]}
                                onChange={() => handleCheckAll()}
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <ArticleOutlinedIcon color="primary" /> {row.name}
                            </TableCell>
                            <TableCell align="left">{row.uploaded} </TableCell>
                            <TableCell align="right">{row.date}</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">
                                <Checkbox
                                    key={row.id}
                                    checked={checked[row.id - 1]}
                                    onChange={() => handleCheckOne(row.id)}
                                />{' '}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
