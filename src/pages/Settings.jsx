import React, { useRef, useState } from 'react';
import {
    Bell,
    Download,
    Upload,
    Info,
    LogOut,
    Shield,
    FileText,
    Sun,
    Moon,
    Laptop,
} from 'lucide-react';
import './Settings.css';
import { useSettings } from '../context/useSettings';
import { useProfile } from '../context/useProfile';
import {
    loadExamAttempts,
    loadQuestionBank,
    saveExamAttempts,
    saveQuestionBank,
} from '../data/questionBank';

const getThemeOptions = () => ([
    { id: 'light', label: 'Light Mode', icon: Sun, description: 'Always use the light theme.' },
    { id: 'dark', label: 'Dark Mode', icon: Moon, description: 'Always use the dark theme.' },
    { id: 'system', label: 'System Mode', icon: Laptop, description: 'Follow your system appearance.' },
]);

const Settings = () => {
    const { settings, resolvedTheme, setThemeMode, setNotificationsEnabled, importSettings } = useSettings();
    const { profiles, activeProfile, replaceProfiles, logout } = useProfile();

    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('info');
    const fileInputRef = useRef(null);

    const setStatus = (message, type = 'info') => {
        setStatusMessage(message);
        setStatusType(type);
    };

    const exportData = () => {
        const payload = {
            version: 1,
            exportedAt: new Date().toISOString(),
            profiles,
            activeProfileId: activeProfile?.id,
            questionBank: loadQuestionBank(),
            examAttempts: loadExamAttempts(),
            settings,
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const stamp = new Date().toISOString().slice(0, 10);

        link.href = url;
        link.download = `skillnotes-backup-${stamp}.json`;
        link.click();

        URL.revokeObjectURL(url);
        setStatus('Export completed. Backup file downloaded.', 'success');
    };

    const openImportPicker = () => {
        fileInputRef.current?.click();
    };

    const importData = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        try {
            const raw = await file.text();
            const parsed = JSON.parse(raw);

            if (Array.isArray(parsed?.profiles) && parsed.profiles.length) {
                replaceProfiles(parsed.profiles, parsed.activeProfileId);
            }

            if (parsed?.questionBank && Array.isArray(parsed.questionBank.sets) && Array.isArray(parsed.questionBank.questions)) {
                saveQuestionBank(parsed.questionBank);
            }

            if (Array.isArray(parsed?.examAttempts)) {
                saveExamAttempts(parsed.examAttempts);
            }

            if (parsed?.settings && typeof parsed.settings === 'object') {
                importSettings(parsed.settings);
            }

            setStatus('Import successful. Your settings and data have been restored.', 'success');
        } catch {
            setStatus('Import failed. Please choose a valid SkillNotes backup file.', 'error');
        }

        event.target.value = '';
    };

    const handleLogout = () => {
        logout();
        setStatus('Logged out. Switched back to the default profile.', 'success');
    };

    return (
        <div className="settings-page page-container animate-fade-in">
            <header className="page-header">
                <h1 className="gradient-text">Settings</h1>
                <p>Manage app preferences, data, legal pages, and account controls.</p>
            </header>

            {statusMessage && (
                <div className={`status-banner ${statusType}`}>
                    <span>{statusMessage}</span>
                </div>
            )}

            <section className="section-container settings-grid">
                <article className="glass settings-card">
                    <h2><Info size={18} /> About</h2>
                    <p>SkillNotes helps you study with question sets, flashcards, exams, achievements, and badge progression.</p>
                    <p><strong>Version:</strong> 0.0.0</p>
                    <p><strong>Active Theme:</strong> {resolvedTheme}</p>
                </article>

                <article className="glass settings-card">
                    <h2><Bell size={18} /> Notifications</h2>
                    <p>Enable study reminders and progress notifications.</p>
                    <button
                        type="button"
                        className={`toggle-btn ${settings.notificationsEnabled ? 'enabled' : ''}`}
                        onClick={() => setNotificationsEnabled(!settings.notificationsEnabled)}
                    >
                        {settings.notificationsEnabled ? 'On' : 'Off'}
                    </button>
                </article>
            </section>

            <section className="section-container glass settings-card">
                <h2>Theme Mode</h2>
                <div className="theme-options">
                    {getThemeOptions().map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            className={`theme-option ${settings.themeMode === option.id ? 'active' : ''}`}
                            onClick={() => setThemeMode(option.id)}
                        >
                            <option.icon size={18} />
                            <div>
                                <strong>{option.label}</strong>
                                <span>{option.description}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className="section-container settings-grid">
                <article className="glass settings-card">
                    <h2><Download size={18} /> Export</h2>
                    <p>Export profiles, questions, attempts, and settings as a backup file.</p>
                    <button type="button" className="primary-btn" onClick={exportData}>Export Data</button>
                </article>

                <article className="glass settings-card">
                    <h2><Upload size={18} /> Import</h2>
                    <p>Restore settings and study data from a previous backup file.</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json"
                        onChange={importData}
                        className="hidden-file"
                    />
                    <button type="button" className="primary-btn" onClick={openImportPicker}>Import Data</button>
                </article>
            </section>

            <section className="section-container settings-grid">
                <article className="glass settings-card legal-card">
                    <h2><FileText size={18} /> Terms and Conditions</h2>
                    <ul>
                        <li>Use SkillNotes for lawful educational purposes only.</li>
                        <li>You are responsible for the accuracy of imported/exported data.</li>
                        <li>Do not upload sensitive personal data you do not want stored locally.</li>
                    </ul>
                </article>

                <article className="glass settings-card legal-card">
                    <h2><Shield size={18} /> Privacy Policy</h2>
                    <ul>
                        <li>Your data is stored locally on your device by default.</li>
                        <li>No remote telemetry is sent by these local features.</li>
                        <li>You can remove local data by clearing app/browser storage.</li>
                    </ul>
                </article>
            </section>

            <section className="section-container glass settings-card logout-card">
                <h2><LogOut size={18} /> Logout</h2>
                <p>Log out from the current profile session and return to the default profile.</p>
                <button type="button" className="danger-btn" onClick={handleLogout}>Logout</button>
            </section>
        </div>
    );
};

export default Settings;
