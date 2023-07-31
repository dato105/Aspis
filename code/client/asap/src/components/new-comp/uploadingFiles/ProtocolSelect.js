import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ProtocoleSelect(props) {
    const [selectedType, setSelectedType] = React.useState('');

    const handleChange = event => {
        setSelectedType(event.target.value);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small">סוג קובץ</InputLabel>
            <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={selectedType}
                label="סוג קובץ"
                onChange={handleChange}
            >
                {props.types.map((type, index) => {
                    return (
                        <MenuItem key={index} value={type}>
                            {type}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}
