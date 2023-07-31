import React from 'react';
import { useIntl } from 'react-intl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useApplications from '../../hooks/useApplications';

const Selection = ({ id, labelId, labelI18nKey, options = [], optionsValueSetter, optionLabelSetter }) => {
    const { formatMessage } = useIntl();
    const { currentApplicationId, currentApplicationState, updateAsapAppointments } = useApplications();

    const onSelection = event => {
        const updatedApplicationState = { ...currentApplicationState, [id]: event.target.value };
        updateAsapAppointments({ [currentApplicationId]: updatedApplicationState });
    };
    const value = (options.length > 0 && currentApplicationState && currentApplicationState[id]) || '';
    const label = formatMessage({ id: labelI18nKey });

    return (
        <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select id={id} name={id} labelId={labelId} onChange={onSelection} value={value} label={label} required>
                {options.map((option, index) => (
                    <MenuItem key={index} value={optionsValueSetter(option)}>
                        {optionLabelSetter(option)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default Selection;
