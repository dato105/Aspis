import React, { useState } from 'react';
import { Box, Button, Checkbox, Fade, Popper } from '@mui/material';
import List from '@mui/material/List';
import style from './FilterReq.module.css';
import CheckIcon from '@mui/icons-material/Check';

const FilterReq = props => {
    const { flag, type, stages, subStageTabMap } = props;

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
        setOpen(previousOpen => !previousOpen);
        setSelected([]);
    };

    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'spring-popper' : undefined;

    const [selected, setSelected] = useState([]);

    const handleChange = event => {
        const value = event.target.value;
        if (selected.indexOf(value) !== -1) {
            const newSelected = selected.filter(s => s !== value);
            setSelected(newSelected);
        } else {
            setSelected([...selected, value]);
        }
    };

    const allSelected = event => {
        setSelected(selected.length === stages.length ? [] : stages);
    };

    const listItem = stages.map(option => {
        return (
            <div className={style.checkBox} key={option}>
                <Checkbox value={option} onChange={handleChange} checked={selected.includes(option)} />
                {subStageTabMap()[0].tab === 0 ? (
                    <span className={style.checkBoxOption}>{option}</span>
                ) : (
                    <span className={style.checkBoxOption}>
                        {option}({subStageTabMap().filter(item => item.header === option)[0].count})
                    </span>
                )}
            </div>
        );
    });

    const operationFilter = event => {
        props.filterByTypeReq(selected);
        handleClick(event);
    };
    return (
        <div>
            {flag ? (
                <Button
                    sx={{
                        backgroundColor: open ? '#2c43a8' : '#fff',
                        color: open ? '#fff' : '#000000',
                        ':hover': {
                            backgroundColor: '#2c43a8',
                            color: '#fff',
                        },
                        ':onClick': {
                            backgroundColor: '#fff',
                        },
                    }}
                    aria-describedby={id}
                    type="button"
                    onClick={handleClick}
                >
                    {type} {open ? props.iconOpen : props.iconClose}
                </Button>
            ) : (
                <Button
                    sx={{
                        backgroundColor: '#F6F6FA',
                        color: open ? '#212121' : '#000000',
                        ':hover': {
                            backgroundColor: '#F6F6FA',
                            color: '#212121',
                            fontWeight: '90%',
                        },
                        variant: 'text',
                        size: 'large',
                    }}
                    aria-describedby={id}
                    type="button"
                    onClick={handleClick}
                >
                    {type} {open ? props.iconOpen : props.iconClose}
                </Button>
            )}
            <Popper className={style.popper} placement="bottom-end" id={id} open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps}>
                        <Box
                            className={style.popperBox}
                            sx={{ border: 0.5, borderColor: '#DADADF', width: '150%', bgcolor: '#fff' }}
                        >
                            <div className={style.Header}>
                                <div className={style.Stage}>
                                    {' '}
                                    {selected.length} {'מצבים נבחרו'}
                                </div>
                                <div className={style.All}>
                                    <Button
                                        sx={{
                                            height: '26px',
                                            width: '85px',
                                            color: '#000000',
                                            borderRadius: '20px',
                                            backgroundColor: '#fff',
                                            border: 0.5,
                                            borderColor: '#DADADF',
                                        }}
                                        onClick={allSelected}
                                    >
                                        <CheckIcon fontSize="50px" />
                                        {' סמן הכל '}{' '}
                                    </Button>
                                </div>
                            </div>
                            <List
                                className={style.checkBoxList}
                                sx={{ marginLeft: '10px', width: '100%', maxWidth: 360 }}
                            >
                                <div className={style.checkBoxHeader}>{props.filterBy}</div>
                                {listItem}
                            </List>
                            <div className={style.ButtonAction}>
                                <Button
                                    sx={{
                                        borderRadius: '56px',
                                        borderColor: '#2c43a8',
                                        border: 1,
                                        width: '45%',
                                        height: '33px',
                                    }}
                                    onClick={operationFilter}
                                >
                                    {'החל'}
                                </Button>
                            </div>
                        </Box>
                    </Fade>
                )}
            </Popper>
        </div>
    );
};
export default FilterReq;
