import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import WindowControls from './WindowControls';
import './Layout.css';

const Layout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <div className="layout-top-bar">
                    <div className="drag-region-top"></div>
                    <WindowControls />
                </div>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
