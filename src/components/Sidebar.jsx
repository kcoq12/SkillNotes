import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    HelpCircle,
    FileText,
    Layers,
    User,
    Settings,
    BrainCircuit
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/questions', label: 'Questions', icon: HelpCircle },
        { path: '/exams', label: 'Exams', icon: FileText },
        { path: '/flashcards', label: 'Flashcards', icon: Layers },
        { path: '/profiles', label: 'Profiles', icon: User },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="sidebar glass">
            <div className="sidebar-header drag-region">
                <div className="logo">
                    <BrainCircuit className="logo-icon" size={28} />
                    <span className="logo-text gradient-text">SkillNotes</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? 'active' : ''}`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon size={20} className="nav-icon" />
                                        <span className="nav-label">{item.label}</span>
                                        {isActive && <div className="active-indicator" />}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="user-mini-profile">
                    <div className="avatar">
                        <User size={16} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">User</span>
                        <span className="user-status">Pro Plan</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
