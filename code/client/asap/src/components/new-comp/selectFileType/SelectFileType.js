import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
export default function SelectSmall() {
    const [val, setVal] = React.useState('');

    const handleChange = event => {
        setVal(event.target.value);
    };

    return (
        <FormControl sx={{ m: 2, minWidth: 304 }} size="small">
            <InputLabel id="demo-select-small">בחר סוג קובץ</InputLabel>
            <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={val}
                label="בחר סוג קובץ"
                onChange={handleChange}
            >
                <MenuItem value={10}>קורות חיים</MenuItem>
                <MenuItem value={20}>מכתב יוזם</MenuItem>
            </Select>
        </FormControl>
    );
}
