import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Arrow from './Arrow.png';
import logo from './icon';
import style from './stepDetails.module.css';

export default function StepDetails(props) {
    return (
        <Box sx={{ width: '100%' }} className={style.stepDetailsBox}>
            <Stepper activeStep={props.stages.length} connector={<img src={Arrow} alt="ConnectArrow" />}>
                {props.stages.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={index} {...stepProps}>
                            <StepLabel className={style.labelText} StepIconComponent={logo} {...labelProps}>
                                {label.header}
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
}
