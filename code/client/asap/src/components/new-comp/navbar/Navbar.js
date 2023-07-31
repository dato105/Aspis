import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AvatarUser from "../avatarUser/avatarUser";
import style from "../navbar/Navbar.module.css"
import {useAsapContext} from "../../../services/state/AsapContextProvider";

const theme = createTheme({
    palette: {
        primary: {
            main: '#042352',
        },
        secondary: {
            main: '#EDC63B',
        },
    },
});

function Navbar() {
    const { asapUser } = useAsapContext();
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="fixed">
                <Container maxWidth="l" >
                    <Toolbar disableGutters  sx={{ height: 50 }}>
                        <SchoolOutlinedIcon />
                        <Box sx={{ flexGrow: 1 }} />
                        <div className={style.Box}>
                           <div className={style.ImgAndName}>
                               <AvatarUser/>
                         <p className={style.Name} >{asapUser?.first_name} {asapUser?.last_name}</p>
                           </div>
                            <div className={style.Badge}>
                                &emsp;
                                <Badge
                                color="secondary"
                                variant="dot"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <NotificationsOutlinedIcon />
                            </Badge></div></div>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
}
export default Navbar;
