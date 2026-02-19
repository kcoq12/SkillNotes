import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    HelpCircle,
    FileText,
    Layers,
    User,
    Settings,
    BrainCircuit,
    ChevronDown
} from 'lucide-react';
import './Sidebar.css';
import { useProfile } from '../context/useProfile';

const Sidebar = () => {
    const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);
    const { profiles, activeProfile, switchProfile } = useProfile();

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
                {isProfileSwitcherOpen && (
                    <div className="profile-switcher glass">
                        <div className="profile-switcher-head">
                            <span>Who&apos;s studying?</span>
                        </div>
                        <div className="profile-grid">
                            {profiles.map((profile) => (
                                <button
                                    key={profile.id}
                                    type="button"
                                    className={`profile-card ${profile.id === activeProfile.id ? 'active' : ''}`}
                                    onClick={() => {
                                        switchProfile(profile.id);
                                        setIsProfileSwitcherOpen(false);
                                    }}
                                >
                                    <div className="profile-avatar" style={{ '--profile-accent': profile.accent }}>
                                        {profile.name.charAt(0)}
                                    </div>
                                    <span>{profile.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    className="user-mini-profile"
                    onClick={() => setIsProfileSwitcherOpen((prev) => !prev)}
                >
                    <div className="avatar" style={{ '--profile-accent': activeProfile.accent }}>
                        {activeProfile.name.charAt(0)}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{activeProfile.name}</span>
                        <span className="user-status">{activeProfile.plan}</span>
                    </div>
                    <ChevronDown size={14} className={`profile-toggle-icon ${isProfileSwitcherOpen ? 'open' : ''}`} />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
