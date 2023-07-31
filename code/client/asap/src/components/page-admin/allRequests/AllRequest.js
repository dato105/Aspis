import React, { useState, useEffect } from 'react';
import { InputAdornment, Tab, Tabs, Button, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import style from './AllRequset.module.css';
import { DataGrid, heIL } from '@mui/x-data-grid';
import Excel from '../../icons/Microsoft_Office_Excel.png';
import FilterReq from '../../new-comp/filterReq/FilterReq';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import apiService from '../../../services/api/api';
import { useIntl } from 'react-intl';
import { CSVLink } from 'react-csv';
import bagImg from '../../icons/bag.png';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { OPTIONS } from '../../../constants';
import { ASAP_ADMIN_CANDIDATE_PAGE } from '../../../services/routing/routes';
import { useNavigate } from 'react-router-dom';

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
const AllRequest = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [data, setData] = useState([]);
    const [table, setTable] = useState([]);
    const [tableSearch, setTableSearch] = useState([]);
    const { formatMessage } = useIntl();
    const [hoveredRow, setHoveredRow] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        async function fetchData() {
            try {
                const response = await apiService.AdminService.getAllApplications();
                if (response) {
                    const d = response.map((app, index) => ({
                        id: app.application.applicant.user.id,
                        name: `${app.application.applicant.user.first_name} ${app.application.applicant.user.last_name}`,
                        state: app.application.state_Application,
                        stageRequest: formatMessage({
                            id: `status-application.${app.step_name}`,
                        }),
                        statusRequest: formatMessage({
                            id: `appointment-steps.${app.step_name}`,
                        }),
                        openRequset:
                            'לפני ' +
                            Math.round(
                                (new Date().getTime() - new Date(app.application.created_at).getTime()) /
                                    (24 * 60 * 60 * 1000)
                            ) +
                            ' ימים',
                        stage: formatMessage({
                            id: `employment-stages.${app.application.applicant.employment_stage}`,
                        }),
                        dateFinishStage: new Intl.DateTimeFormat('en-GB', OPTIONS).format(
                            new Date(app.application.applicant.stage_due_date)
                        ),
                        rankRequested: `${app.application.desired_rank.name}`,
                        department: `${app.application.applicant.department.name}`,
                    }));

                    setData(d);
                    setTable(d.filter(row => row.state === 'ACTIVE'));
                    setTableSearch(d);
                }
            } catch (error) {}
        }

        fetchData().then(r => {});
    }, [formatMessage]);

    const tabData = [
        { label: 'בקשות פעילות', state: 'ACTIVE' },
        { label: 'בקשות משהות', state: 'DELAYED' },
        { label: 'בקשות שנדחו', state: 'REJECTED' },
        { label: 'בקשות ישנות', state: 'OLD' },
    ];

    const columns = [
        {
            id: 1,
            flex: 1,
            field: 'name',
            headerName: 'שם מועמד',
            align: 'center',
            headerAlign: 'center',
        },
        {
            id: 2,
            field: 'stageRequest',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            sortable: false,
            renderHeader: () => (
                <FilterReq
                    filterBy={'סנן לפי שלב בקשה'}
                    subStageTabMap={countAppInStages}
                    stages={arrayStage('stageRequest')}
                    type={'שלב בקשה'}
                    flag={true}
                    filterByTypeReq={typeReq => setTable(data.filter(item => typeReq.includes(item.stageRequest)))}
                    iconClose={<KeyboardArrowUpIcon />}
                    iconOpen={<KeyboardArrowDownIcon />}
                />
            ),
        },
        {
            field: 'statusRequest',
            headerAlign: 'center',
            flex: 1.2,
            align: 'center',
            sortable: false,
            id: 3,
            renderHeader: () => (
                <FilterReq
                    filterBy={'סנן לפי סטאטוס בקשה'}
                    subStageTabMap={countAppInStages}
                    stages={arrayStage('statusRequest')}
                    type={'סטאטוס בקשה'}
                    flag={true}
                    filterByTypeReq={typeReq => setTable(data.filter(item => typeReq.includes(item.statusRequest)))}
                    iconClose={<KeyboardArrowUpIcon />}
                    iconOpen={<KeyboardArrowDownIcon />}
                />
            ),
        },
        { field: 'openRequset', headerAlign: 'center', flex: 1, id: 4, align: 'center', headerName: 'פתיחת בקשה' },
        {
            id: 5,
            field: 'stage',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            renderHeader: () => (
                <FilterReq
                    filterBy={'סנן לפי שלב'}
                    subStageTabMap={countAppInStages}
                    stages={arrayStage('stage')}
                    type={'שלב'}
                    flag={true}
                    filterByTypeReq={typeReq => setTable(data.filter(item => typeReq.includes(item.stage)))}
                    iconClose={<KeyboardArrowUpIcon />}
                    iconOpen={<KeyboardArrowDownIcon />}
                />
            ),
        },
        {
            field: 'dateFinishStage',
            flex: 1,
            align: 'center',
            id: 6,
            headerAlign: 'center',
            headerName: 'תאריך סיום שלב',
        },
        {
            field: 'rankRequested',
            flex: 1.2,
            id: 7,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            renderHeader: () => (
                <FilterReq
                    filterBy={'סנן לפי דרגה מבוקשת'}
                    subStageTabMap={countAppInStages}
                    stages={arrayStage('rankRequested')}
                    type={'דרגה מבוקשת'}
                    flag={true}
                    filterByTypeReq={typeReq => setTable(data.filter(item => typeReq.includes(item.rankRequested)))}
                    iconClose={<KeyboardArrowUpIcon />}
                    iconOpen={<KeyboardArrowDownIcon />}
                />
            ),
        },
        {
            field: 'department',
            sortable: false,
            flex: 1,
            id: 8,
            headerAlign: 'center',
            align: 'center',
            renderHeader: () => (
                <FilterReq
                    filterBy={'סנן לפי שם מחלקה'}
                    subStageTabMap={countAppInStages}
                    stages={arrayStage('department')}
                    type={'מחלקה'}
                    flag={true}
                    filterByTypeReq={typeReq => setTable(data.filter(item => typeReq.includes(item.department)))}
                    iconClose={<KeyboardArrowUpIcon />}
                    iconOpen={<KeyboardArrowDownIcon />}
                />
            ),
        },
        {
            field: '',
            sortable: false,
            id: 9,
            headerAlign: 'center',
            align: 'center',
            renderHeader: () => (
                <CSVLink data={data.map(({ id, state, ...rest }) => ({ ...rest }))} filename={'my-data.csv'}>
                    <Button>
                        <img src={Excel} alt="Excel" />
                    </Button>
                </CSVLink>
            ),
            renderCell: params => {
                const ImgBag = () => {
                    return <img className={style.Img} src={bagImg} alt="תיק" />;
                };
                if (hoveredRow === params.id) {
                    const handleClick = () => {
                        navigate(`/${ASAP_ADMIN_CANDIDATE_PAGE}/${params.id}`);
                    };
                    return (
                        <div>
                            <IconButton onClick={handleClick}>
                                <ImgBag />
                                <ArrowBackIosIcon color="primary" fontSize="small" />
                            </IconButton>
                        </div>
                    );
                }
            },
        },
    ];

    const handleSearchTermChange = event => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        if (searchTerm.trim() === '') {
            setTable(tableSearch);
        }
        const filteredRows = tableSearch.filter(row => {
            const rowValues = Object.values(row).join(' ').toLowerCase();
            return rowValues.includes(searchTerm.toLowerCase());
        });
        setTable(filteredRows);
    };

    const handleTabChange = (event, newValue) => {
        let filtered = data;
        if (newValue === 0) {
            filtered = data.filter(row => row.state === 'ACTIVE');
        } else if (newValue === 1) {
            filtered = data.filter(row => row.state === 'DELAYED');
        } else if (newValue === 2) {
            filtered = data.filter(row => row.state === 'REJECTED');
        } else if (newValue === 3) {
            filtered = data.filter(row => row.state === 'OLD');
        }
        setTable(filtered);
        setTabValue(newValue);
        setTableSearch(filtered);
    };

    const arrayStage = filterby => {
        const existing = [];
        data.forEach(app => {
            const stepName = app[filterby];
            if (!existing.includes(stepName)) {
                existing.push(stepName);
            }
        });
        return existing;
    };

    const onMouseEnterRow = event => {
        const id = Number(event.currentTarget.getAttribute('data-id'));
        setHoveredRow(id);
    };

    const onMouseLeaveRow = event => {
        setHoveredRow(null);
    };

    return (
        <div>
            <h1 className={style.h1}>כל הבקשות</h1>
            <div className={style.WrapperAppTabs}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    {tabData.map(({ label, state }, index) => (
                        <Tab
                            key={index}
                            label={
                                <div className={style.TabWrapper}>
                                    <div className={style.Label}> {label} </div>
                                    <div className={tabValue === index ? style.BoxActivate : style.BoxNotActivate}>
                                        <div>{data.filter(row => row.state === state).length}</div>
                                    </div>
                                </div>
                            }
                            sx={{
                                '&.Mui-selected': {
                                    color: 'black',
                                },
                            }}
                        />
                    ))}
                </Tabs>
                <TextField
                    placeholder="חיפוש"
                    type="text"
                    variant="outlined"
                    size="small"
                    onChange={handleSearchTermChange}
                    value={searchTerm}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start" onClick={() => {}}>
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <div className={style.WrapperTable}>
                <DataGrid
                    rows={table}
                    columns={columns}
                    disableColumnMenu
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    disableSelectionOnClick
                    disableColumnFilter
                    localeText={heIL.components.MuiDataGrid.defaultProps.localeText}
                    sx={{
                        border: 0,
                        '& .MuiDataGrid-iconSeparator': {
                            display: 'none',
                        },
                        '& .MuiDataGrid-cell': {
                            border: 'none',
                        },
                    }}
                    componentsProps={{
                        row: {
                            onMouseEnter: onMouseEnterRow,
                            onMouseLeave: onMouseLeaveRow,
                        },
                    }}
                />
            </div>
        </div>
    );
};
export default AllRequest;
