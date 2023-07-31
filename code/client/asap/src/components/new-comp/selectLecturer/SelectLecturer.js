import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectLecturer() {
    const [chooseLacturer, setChooseLacturer] = React.useState('');

    const handleChange = event => {
        setChooseLacturer(event.target.value);
    };

    return (
        <FormControl sx={{ m: 2, minWidth: 216 }} size="small">
            <InputLabel id="demo-select-small">בחר מרצה</InputLabel>
            <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={chooseLacturer}
                label="בחר מרצה"
                onChange={handleChange}
            >
                <MenuItem value={'יורי דוסטויבסקי'}>יורי דוסטויבסקי</MenuItem>
                <MenuItem value={'נירית ארבל גבעתי'}>נירית ארבל גבעתי</MenuItem>
                <MenuItem value={'אמיר חורי'}>אמיר חור'י</MenuItem>
                <MenuItem value={'סילביה אבו אעקלה'}>סילביה אבו אעקלה</MenuItem>
            </Select>
        </FormControl>
    );
}
