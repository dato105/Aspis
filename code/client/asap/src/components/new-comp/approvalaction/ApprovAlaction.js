import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Icons from './Icons.png';
// import styles from './ApprovAlaction.module.css';

const theme = createTheme({
    components: {
        // Name of the component
        MuiSnackbarContentAction: {
            styleOverrides: {
                // Name of the slot
                root: {
                    color: '#000',
                    backgroundColor: '#FFFFFF',
                },
            },
        },

        MuiSnackbarContent: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: '#000',
                },
            },
        },
    },
});

export default function ApprovAlaction() {
    const [snackPack, setSnackPack] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [messageInfo, setMessageInfo] = React.useState(undefined);

    React.useEffect(() => {
        if (snackPack.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...snackPack[0] });
            setSnackPack(prev => prev.slice(1));
            setOpen(true);
        } else if (snackPack.length && messageInfo && open) {
            // Close an active snack when a new one is added
            setOpen(false);
        }
    }, [snackPack, messageInfo, open]);

    const handleClick = message => () => {
        setSnackPack(prev => [...prev, { message, key: new Date().getTime() }]);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleExited = () => {
        setMessageInfo(undefined);
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Button onClick={handleClick('בקשה הועברה ליו”ר מינויים')}>Show message A</Button>
                <Snackbar
                   
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    key={messageInfo ? messageInfo.key : undefined}
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    TransitionProps={{ onExited: handleExited }}
                    message={messageInfo ? messageInfo.message : undefined}
                    action={
                        <React.Fragment>
                            <img src={Icons} alt="v" />
                        </React.Fragment>
                    }
                />
            </ThemeProvider>
        </div>
    );
}
