import * as React from 'react';
import Button from '@mui/material/Button';
import style from './iconButton.module.css';

function IconButton(props) {
    return (
        <div>
            <Button sx={{ borderRadius: '20px' }} variant="text" dir="ltr" onClick={props.click}>
                <div className={style.Title}>{props.title}</div>
                {props.image}
            </Button>
        </div>
    );
}

export default IconButton;
