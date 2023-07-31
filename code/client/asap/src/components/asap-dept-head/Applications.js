import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
    DataGrid,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    heIL,
} from '@mui/x-data-grid';
import apiService from '../../services/api/api';
import useApplications from '../../hooks/useApplications';
import rootStyle from '../../style/Asap.module.css';

const Applications = () => {
    const { formatMessage } = useIntl();
    const { toApplications, columns } = useApplications();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        apiService.ApplicationService.getDeptHeadApplications().then(response => {
            setApplications(toApplications(response));
        });
    }, [toApplications]);

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
                    csvOptions={{
                        fileName: formatMessage({ id: 'toolbar.export.title-file' }),
                        utf8WithBom: true,
                    }}
                />
            </GridToolbarContainer>
        );
    };

    return (
        <div className={rootStyle.appointmentsContainer}>
            <label>{formatMessage({ id: 'applications.title' })}</label>
            <div className={rootStyle.appointmentsTableContainer}>
                <DataGrid
                    rows={applications}
                    columns={columns}
                    autoPageSize
                    localeText={heIL.components.MuiDataGrid.defaultProps.localeText}
                    components={{ Toolbar: CustomToolbar }}
                />
            </div>
        </div>
    );
};

export default Applications;
