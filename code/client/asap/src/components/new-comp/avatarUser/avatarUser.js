import  React, {useState} from 'react';
import style from "../avatarUser/avatarUser.module.css";
import {Button, Popper, Fade,Box,Avatar} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from "../../../services/auth/hooks/useAuth";
import {useAsapContext} from "../../../services/state/AsapContextProvider";
import ListItemText from "@mui/material/ListItemText";


function AvatarUser(){
    const [isShown, setIsShown] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { logout } = useAuth();
    const { asapUser } = useAsapContext();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setIsShown((previousOpen) => !previousOpen);
    };

    return (
        <div >
           <Button >
               <Avatar alt={asapUser?.first_name} src={asapUser?.picture} onClick={handleClick} />
           </Button>
            <Popper id = {1} open={isShown} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Box className={style.Box} sx={{ p: 1, bgcolor: 'background.paper' }}>
                                <div className={style.ImgDiv}>
                                    <Avatar alt={asapUser?.first_name} src={asapUser?.picture} />
                                    <ListItemText
                                        primary={asapUser?.first_name + " " + asapUser?.last_name}
                                        secondary={
                                            <React.Fragment>
                                                <div className={style.Role}>{asapUser?.department}</div>
                                            </React.Fragment>
                                        }
                                    />
                                </div>
                                    {"התנתקות"}
                                    <Button className={style.LogoutIcon} onClick={logout} ><LogoutIcon /></Button>

                        </Box>
                    </Fade>
                )}
            </Popper>
        </div>
    );
};
export default AvatarUser;