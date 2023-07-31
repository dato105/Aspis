import React from 'react';
import BaseLayoutRoutes from './BaseLayoutRoutes';
import style from './BaseLayout.module.css';
import PermanentDrawerLeft from "../components/new-comp/sidebar/Sidebar";
import Navbar from "../components/new-comp/navbar/Navbar";

const BaseLayout = () => {
    return (
        <div className={style.baseLayoutContainer}>
            <div className={style.headerContainer}>
                <Navbar/>
            </div>
            <div className={style.sidebarContainer}>
                <PermanentDrawerLeft/>
            </div>
            <div className={style.baseLayoutContent}>
                <main>
                    <BaseLayoutRoutes />
                </main>
            </div>
        </div>
    );
};

export default BaseLayout;
