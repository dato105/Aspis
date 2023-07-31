import React from 'react';
import Version from './Version';
import style from './Footer.module.css';

const Footer = () => {
    return (
        <div className={style.footerContainer}>
            <div className={style.version}>
                <Version />
            </div>
        </div>
    );
};
export default Footer;
