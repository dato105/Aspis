import React from 'react';
import Logo from './Logo.js';
import Logout from '../auth/Logout';
import HeaderUser from './HeaderUser';
import style from './Header.module.css';

const Header = () => {
    return (
        <div className={style.headerContainer}>
            <Logo />
            <HeaderUser />
            <Logout />
        </div>
    );
};

export default Header;
