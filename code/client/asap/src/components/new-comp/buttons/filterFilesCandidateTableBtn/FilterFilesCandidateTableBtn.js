import React, { useState } from 'react';
import style from '../Button.module.css';
import IconButton from '@mui/material/IconButton';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Box, Button, Checkbox, Fade, Popper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import List from '@mui/material/List';
import { typesOfFiles } from '../../../../constants';
import he from '../../../../services/i18n/locales/he.json';

function FilterFilesCandidateTableBtn(props) {
    const { setFilterData, data, title } = props;
    const [selected, setSelected] = useState([]);
    const [typesOfFile] = useState(typesOfFiles);

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
        setOpen(previousOpen => !previousOpen);
        setSelected([]);
    };

    const countFilesByType = () => {
        const updatedTypeCounts = typesOfFile.map(item => {
            const headerString = item.header;

            const count = Object.keys(data).reduce((totalCount, key) => {
                if (key.includes(headerString)) {
                    return totalCount + 1;
                }
                return totalCount;
            }, 0);

            return {
                ...item,
                count: count,
            };
        });
        return updatedTypeCounts;
    };

    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'spring-popper' : undefined;

    const handleChange = event => {
        const value = event.target.value;
        if (selected.indexOf(value) !== -1) {
            const newSelected = selected.filter(s => s !== value);
            setSelected(newSelected);
        } else {
            setSelected([...selected, value]);
        }
    };

    const allSelected = () => {
        setSelected(
            selected.length === typesOfFile.map(item => item.header).length ? [] : typesOfFile.map(item => item.header)
        );
    };

    const listItem = typesOfFile
        .map(item => item.header)
        .map(option => {
            return (
                <div className={style.checkBox} key={option}>
                    <Checkbox value={option} onChange={handleChange} checked={selected.includes(option)} />
                    <span className={style.checkBoxOption}>
                        {he['file_type_filter'][option]}(
                        {countFilesByType().filter(item => item.header === option)[0].count})
                    </span>
                </div>
            );
        });

    function filterByFileType(typeReq) {
        const filteredItems = Object.fromEntries(
            Object.entries(data).filter(([key]) => typeReq.some(type => key.includes(type)))
        );

        setFilterData(filteredItems);
    }

    const operationFilter = event => {
        filterByFileType(selected);
        handleClick(event);
    };

    return (
        <div className={style.InProcessCardSubCardButton}>
            <div style={{ position: 'relative' }}>
                <IconButton className={style.tableRowBtn} onClick={handleClick}>
                    <FilterAltOutlinedIcon color={'primary'} />
                    <div className={style.tableRowText}>{title}</div>
                </IconButton>
                <Popper
                    className={style.popper}
                    placement="bottom-end"
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    transition
                >
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
                                    <div className={style.checkBoxHeader}>{'שלום'}</div>
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
        </div>
    );
}

export default FilterFilesCandidateTableBtn;