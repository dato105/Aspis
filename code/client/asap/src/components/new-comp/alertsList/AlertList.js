import * as React from 'react';
import style from './AlertList.module.css';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { Box, FormControlLabel, IconButton, Switch } from '@mui/material';
import { DataGrid, heIL } from '@mui/x-data-grid';
import { AcUnit } from '@mui/icons-material';
import FilterReq from '../filterReq/FilterReq';
import DraftsIcon from '@mui/icons-material/Drafts';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import apiService from '../../../services/api/api';

function AlertList() {
    const { formatMessage } = useIntl();
    const [isRead, setIsRead] = useState(false);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [data, setData] = useState([]);
    const [table, setTable] = useState([]);
    const subStageTabMap = [
        {
            tab: 0,
            id: 1,
            header: '',
            stepName: '',
            titleButton: '',
            message: '',
            buttonNeededRepair: false,
            isUpload: false,
            isLast: false,
            count: 0,
        },
    ];
    const countAppInStages = () => {
        return subStageTabMap;
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiService.AdminService.getAlertList();
                if (response && response !== undefined) {
                    const rows = response?.map((alert, index) => ({
                        id: alert.id,
                        alert_type_id: formatMessage({ id: `alert-description.${alert.alert_type_id}` }),
                        insert_time:
                            Math.round(
                                (new Date().getTime() - new Date(alert.insert_time).getTime()) / (24 * 60 * 60 * 1000)
                            ) + ' ימים',
                        is_read: alert.is_read,
                        statusAlert: formatMessage({ id: `alert-Type.${alert.statusAlert}` }),
                        user: `${alert.user.first_name} ${alert.user.last_name}`,
                    }));
                    setTable(rows);
                    setData(rows);
                }
            } catch (error) {}
        }

        fetchData().then(r => {});
    }, [formatMessage]);

    const onMouseEnterRow = event => {
        const id = Number(event.currentTarget.getAttribute('data-id'));
        setHoveredRow(id);
    };

    const onMouseLeaveRow = event => {
        setHoveredRow(null);
    };
    const stages = [
        'בקשות חדשות',
        'פתיחת תהליך',
        'הקמת ועדה מקצועית',
        'ועדה מקצועית',
        'ועדת מנויים סופית',
        'בקשות למל"ג',
    ];

    const handleClick = row => {
        const updatedData = data.map(dataRow =>
            dataRow.id === row.id ? { ...dataRow, is_read: !row.is_read } : dataRow
        );
        setData(updatedData);
        const updatedTable = table.map(dataRow =>
            dataRow.id === row.id ? { ...dataRow, is_read: !row.is_read } : dataRow
        );
        if (isRead) setTable(updatedTable.filter(row => row.is_read === true));
        else setTable(updatedTable);
        apiService.AdminService.updateIsRead(row.id).then(response => response.data);
    };

    const columns = [
        {
            field: 'alert_type_id',
            width: 300,
            sortable: false,
            headerClassName: 'super-app-theme--header',
            renderHeader: () => (
                <FilterReq
                    filterBy={'סנן לפי סטטוס בקשה'}
                    subStageTabMap={countAppInStages}
                    stages={stages}
                    type={'סוג התראה'}
                    flag={true}
                    filterByTypeReq={filterByTypeReq}
                    iconClose={<KeyboardArrowUpIcon />}
                    iconOpen={<KeyboardArrowDownIcon />}
                />
            ),
        },
        { field: 'user', headerName: 'מועמד', headerClassName: 'super-app-theme--header' },
        { field: 'insert_time', headerName: 'מתי', headerClassName: 'super-app-theme--header' },
        {
            field: 'action',
            headerName: '',
            width: 150,
            sortable: false,
            disableColumnMenu: true,
            renderCell: params => {
                const row = params.row;
                if (hoveredRow === params.id) {
                    return (
                        <Box>
                            {isRead ? (
                                <div>
                                    {'סמן כלא נקרא'}
                                    <IconButton
                                        onClick={() => {
                                            handleClick(row);
                                        }}
                                    >
                                        <DraftsIcon color="primary" />
                                    </IconButton>
                                </div>
                            ) : (
                                <div>
                                    <IconButton>
                                        <Visibility color="primary" />
                                    </IconButton>
                                    {row.is_read ? (
                                        <IconButton
                                            onClick={() => {
                                                handleClick(row);
                                            }}
                                        >
                                            <DraftsIcon color="primary" />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            onClick={() => {
                                                handleClick(row);
                                            }}
                                        >
                                            <EmailIcon color="primary" />
                                        </IconButton>
                                    )}
                                </div>
                            )}
                        </Box>
                    );
                } else return null;
            },
        },
    ];

    function filterByTypeReq(typeReq) {
        setTable(data.filter(item => typeReq.includes(item.statusAlert)));
    }

    function sortRead() {
        if (!isRead) {
            setTable(data.filter(row => row.is_read === true));
            setIsRead(true);
        } else {
            setTable(data);
            setIsRead(false);
        }
    }

    return (
        <div className={style.Wrap}>
            <div className={style.Header}>
                <div className={style.Title}>
                    <p className={style.Name}>{formatMessage({ id: 'alert.title.placeholder' })}</p>
                    <p className={style.CountAlert}>{table.length}</p>
                </div>
                <div className={style.Switch}>
                    <FormControlLabel control={<Switch onChange={sortRead} />} label="הצג התראות שנקראו" />
                </div>
            </div>
            <DataGrid
                rows={table}
                columns={columns}
                disableColumnMenu
                hideFooterPagination
                hideFooterSelectedRowCount
                localeText={heIL.components.MuiDataGrid.defaultProps.localeText}
                sx={{
                    maxHeight: 385,
                    border: 0,
                    '& .super-app-theme--header': {
                        display: 'block',
                    },
                    '& .MuiDataGrid-iconSeparator': {
                        display: 'none',
                    },
                }}
                components={{
                    ColumnMenuIcon: AcUnit,
                }}
                componentsProps={{
                    row: {
                        onMouseEnter: onMouseEnterRow,
                        onMouseLeave: onMouseLeaveRow,
                    },
                }}
            />
        </div>
    );
}

export default AlertList;
