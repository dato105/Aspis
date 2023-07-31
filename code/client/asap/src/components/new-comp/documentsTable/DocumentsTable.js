import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Box, IconButton } from '@mui/material';

function createData(id, docName, date) {
    return { id, docName, date };
}

const rows = [createData(1, 'מסמך הצגה', '16/05/22'), createData(2, 'מאמר אש', '02/05/22')];

function DocumentsTable() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Box
                                sx={{
                                    width: '94px',
                                    height: '30px',
                                    backgroundColor: '#F3F6FE',
                                }}
                            >
                                <center>שם מסמך</center>
                            </Box>
                        </TableCell>
                        <TableCell align="left">
                            <Box
                                sx={{
                                    width: '94px',
                                    height: '30px',
                                    backgroundColor: '#F3F6FE',
                                }}
                            >
                                <center>מתאריך</center>
                            </Box>
                        </TableCell>

                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <svg
                                    width="18"
                                    height="19"
                                    viewBox="0 0 18 19"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M9.06319 18.6894C13.6656 18.6894 17.3965 14.5439 17.3965 9.43016C17.3965 4.31641 13.6656 0.170898 9.06319 0.170898C4.46082 0.170898 0.729858 4.31641 0.729858 9.43016C0.729858 14.5439 4.46082 18.6894 9.06319 18.6894ZM12.8899 7.07876C13.1018 6.77602 13.0527 6.33972 12.7802 6.10425C12.5078 5.86879 12.1151 5.92332 11.9032 6.22606L8.56402 10.9963C8.48977 11.1024 8.3501 11.1161 8.2602 11.0262L6.14797 8.91401C5.8914 8.65744 5.49622 8.68055 5.26531 8.96563C5.03439 9.25071 5.05519 9.6898 5.31176 9.94637L7.424 12.0586C8.05327 12.6879 9.03094 12.5915 9.55071 11.849L12.8899 7.07876Z"
                                        fill="#0FD3AD"
                                    />
                                </svg>{' '}
                                &nbsp;
                                {row.docName}
                            </TableCell>
                            <TableCell align="left">&nbsp;&nbsp;&nbsp;{row.date} </TableCell>

                            <TableCell align="right">
                                החלפת קובץ &nbsp;&nbsp;&nbsp;
                                <IconButton>
                                    <svg
                                        width="19"
                                        height="14"
                                        viewBox="0 0 19 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M17.4265 5.5296C18.3929 6.54633 18.3929 8.09104 17.4265 9.10777C15.7967 10.8226 12.9975 13.152 9.81795 13.152C6.63836 13.152 3.8392 10.8226 2.20937 9.10777C1.24303 8.09104 1.24303 6.54633 2.20937 5.5296C3.8392 3.8148 6.63836 1.48535 9.81795 1.48535C12.9975 1.48535 15.7967 3.8148 17.4265 5.5296Z"
                                            stroke="#212121"
                                            stroke-width="1.5"
                                        />
                                        <path
                                            d="M12.318 7.31868C12.318 8.6994 11.1987 9.81868 9.81795 9.81868C8.43724 9.81868 7.31795 8.6994 7.31795 7.31868C7.31795 5.93797 8.43724 4.81868 9.81795 4.81868C11.1987 4.81868 12.318 5.93797 12.318 7.31868Z"
                                            stroke="#212121"
                                            stroke-width="1.5"
                                        />
                                    </svg>
                                </IconButton>
                                &nbsp;&nbsp;&nbsp;
                                <IconButton>
                                    <svg
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3.16667 5.98535V14.3187C3.16667 16.1596 4.65905 17.652 6.5 17.652H11.5C13.3409 17.652 14.8333 16.1596 14.8333 14.3187V5.98535M10.6667 8.48535V13.4854M7.33333 8.48535L7.33333 13.4854M12.3333 3.48535L11.1614 1.72752C10.8523 1.26385 10.3319 0.985352 9.77469 0.985352H8.22531C7.66805 0.985352 7.14767 1.26385 6.83856 1.72752L5.66667 3.48535M12.3333 3.48535H5.66667M12.3333 3.48535H16.5M5.66667 3.48535H1.5"
                                            stroke="#212121"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default DocumentsTable;
