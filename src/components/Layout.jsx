import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <div className="drag-region-top"></div>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
