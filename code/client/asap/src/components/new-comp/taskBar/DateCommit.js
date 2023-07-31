import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CardHeader from '@mui/material/CardHeader';
import style from './TaskBar.module.css';




export default function DateCommit(props) {
    return (
        <Card className={style.taskBarCard} sx={{ width: 200, height: 100}}>
            <CardHeader
               avatar={
                        <DateRangeIcon color={"primary"}/>
                }
                title={ <Typography className={style.titleColor}  color="text.primary" variant={"body1"} component={"div"} >
                    תאריך ועדה קרובה
                </Typography>}
            />
           <CardContent>
               <Typography  variant="h7" component="div">
                   {props.date}
               </Typography>
           </CardContent>
        </Card>
    );
}