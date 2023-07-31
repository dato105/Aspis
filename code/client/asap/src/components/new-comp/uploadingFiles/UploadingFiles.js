import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { data, types } from './UploadingFilesData';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelIcon from '@mui/icons-material/Cancel';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ProtocoleSelect from './ProtocolSelect';
import ProgressBar from './ProgressBar';

export default function UploadingFilesFixed() {
    const [files, setFiles] = React.useState(data);
    const [fileTypes, setFileTypes] = React.useState(types);

    return (
        <Box sx={{ flexGrow: 1, maxWidth: 1000 }}>
            <Grid item xs={12} md={6}>
                <List dense>
                    {files.map(item => {
                        return (
                            <ListItem
                                key={item.id}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        disabled={item.status === 2}
                                        onClick={event => {
                                            console.log('sending delete request to api for item ' + item.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                {' '}
                                {item.status === 0 ? <CheckCircleRoundedIcon color="success" /> : null}
                                {item.status === 1 ? <CancelIcon color="error" /> : null}
                                {item.status === 2 ? <ChangeCircleIcon color="warning" /> : null} &nbsp;
                                <InsertDriveFileOutlinedIcon /> &nbsp; &nbsp;
                                {item.status === 0 ? (
                                    <ListItemText primary={item.fileName} secondary={fileTypes[item.type]} />
                                ) : null}
                                {item.status === 1 ? <ListItemText primary={item.fileName} /> : null}
                                {item.status === 2 ? (
                                    <ListItemText primary={item.fileName} secondary={<ProgressBar />} />
                                ) : null}
                                {item.status === 2 ? <ProtocoleSelect types={fileTypes} /> : null}
                            </ListItem>
                        );
                    })}
                </List>
            </Grid>
        </Box>
    );
}
