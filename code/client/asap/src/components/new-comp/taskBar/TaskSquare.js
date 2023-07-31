import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import style from './TaskBar.module.css';


export default function TaskSquare(props) {
    return (
        <Card className={style.taskBarCard} sx={{width:125, height: 100}}>
            <CardContent >
                <Typography  className={style.titleColor} variant="h5" component="div">
                    {props.num}
                </Typography>
                <Typography className={style.requestTypeText} variant={"body2"}>
                    {props.name}
                </Typography>
            </CardContent>
        </Card>
    );
}