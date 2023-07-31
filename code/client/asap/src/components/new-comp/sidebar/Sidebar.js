import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAsapContext } from '../../../services/state/AsapContextProvider';
import useRouting from '../../../services/routing/hooks/useRouting';

const drawerWidth = 240;

export default function PermanentDrawerLeft() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { asapCountApplication } = useAsapContext();
    const { routesMetadataForRole } = useRouting();

    function goToPath(path) {
        navigate(`${path}`);
    }

    const links = routesMetadataForRole
        .filter(route => route.isDisplayed)
        .map(({ id, path, i18nKey, value }) => (
            <ListItem key={id} disablePadding>
                <ListItemButton
                    selected={pathname === `${path}`}
                    onClick={() => {
                        goToPath(path);
                    }}
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: '#2c43a8',
                            color: '#fff',
                        },
                        '&.Mui-selected:hover': {
                            backgroundColor: '#2c43a8',
                            color: '#fff',
                        },
                        ':hover': {
                            backgroundColor: '#2c43a8',
                            color: '#fff',
                        },
                        borderRadius: 2,
                        marginRight: 1,
                    }}
                >
                    <ListItemText primary={<FormattedMessage id={i18nKey} />} />
                    {asapCountApplication?.[value]}
                </ListItemButton>
            </ListItem>
        ));

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    },
                    zIndex: 0,
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <List sx={{ marginTop: 5 }}>{links}</List>
            </Drawer>
        </Box>
    );
}
