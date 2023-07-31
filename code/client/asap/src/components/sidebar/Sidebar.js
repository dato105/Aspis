import React from 'react';
import useRouting from '../../services/routing/hooks/useRouting';
import { Link } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import style from './Sidebar.module.css';

const Sidebar = () => {
    const { routesMetadataForRole } = useRouting();

    const links = routesMetadataForRole.filter(route => route.isDisplayed).map(({ id, path, i18nKey }) => (
        <Link to={path} key={id} className={style.link}>
            <SidebarItem i18nId={i18nKey} />
        </Link>
    ));

    return <div className={style.sidebarContainer}>{links}</div>;
};

export default Sidebar;
