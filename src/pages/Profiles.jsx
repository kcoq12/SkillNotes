import React, { useMemo, useState } from 'react';
import { Trophy, Plus, Star, Medal, Sparkles } from 'lucide-react';
import './Profiles.css';
import { useProfile } from '../context/useProfile';
import { getBadgeProgress } from '../context/profileProgress';

const formatEarnedDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

const Profiles = () => {
    const {
        profiles,
        activeProfile,
        switchProfile,
        updateProfile,
        addAchievement,
        addBadge,
        earnBadgeExp,
    } = useProfile();

    const [selectedProfileId, setSelectedProfileId] = useState(activeProfile.id);
    const [editDrafts, setEditDrafts] = useState({});
    const [achievementForm, setAchievementForm] = useState({ title: '', description: '' });
    const [badgeForm, setBadgeForm] = useState({ name: '', description: '' });
    const [xpGain, setXpGain] = useState(50);

    const selectedProfile = useMemo(
        () => profiles.find((profile) => profile.id === selectedProfileId) || activeProfile,
        [profiles, selectedProfileId, activeProfile],
    );

    if (!selectedProfile) {
        return null;
    }

    const editForm = editDrafts[selectedProfile.id] || {
        name: selectedProfile.name,
        plan: selectedProfile.plan,
        accent: selectedProfile.accent,
    };

    const selectedProfileTotalXp = selectedProfile.badges.reduce((sum, badge) => sum + badge.xp, 0);

    const handleSaveProfile = (event) => {
        event.preventDefault();
        updateProfile(selectedProfile.id, editForm);
    };

    const handleEditFormChange = (field, value) => {
        setEditDrafts((prev) => ({
            ...prev,
            [selectedProfile.id]: {
                ...editForm,
                [field]: value,
            },
        }));
    };

    const handleAddAchievement = (event) => {
        event.preventDefault();
        if (!achievementForm.title.trim()) {
            return;
        }

        addAchievement(selectedProfile.id, achievementForm);
        setAchievementForm({ title: '', description: '' });
    };

    const handleAddBadge = (event) => {
        event.preventDefault();
        if (!badgeForm.name.trim()) {
            return;
        }

        addBadge(selectedProfile.id, badgeForm);
        setBadgeForm({ name: '', description: '' });
    };

    return (
        <div className="profiles-page page-container animate-fade-in">
            <header className="page-header">
                <div className="date-chip">Community & Identity</div>
                <h1 className="gradient-text">Profiles</h1>
                <p className="motivation-quote">Manage your academic identity and achievements.</p>
            </header>

            <section className="section-container">
                <h2 className="section-title">All Profiles</h2>
                <div className="profiles-grid">
                    {profiles.map((profile) => {
                        const totalXp = profile.badges.reduce((sum, badge) => sum + badge.xp, 0);
                        return (
                            <article key={profile.id} className={`profile-tile glass ${profile.id === selectedProfile.id ? 'selected' : ''}`}>
                                <div className="profile-tile-head">
                                    <div className="profile-avatar-lg" style={{ '--profile-accent': profile.accent }}>
                                        {profile.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3>{profile.name}</h3>
                                        <p>{profile.plan}</p>
                                    </div>
                                </div>
                                <div className="profile-tile-meta">
                                    <span>{profile.achievements.length} achievements</span>
                                    <span>{totalXp} badge XP</span>
                                </div>
                                <div className="profile-tile-actions">
                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={() => setSelectedProfileId(profile.id)}
                                    >
                                        Manage
                                    </button>
                                    <button
                                        type="button"
                                        className={`primary-btn ${profile.id === activeProfile.id ? 'active' : ''}`}
                                        onClick={() => switchProfile(profile.id)}
                                    >
                                        {profile.id === activeProfile.id ? 'Active' : 'Switch'}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="section-container manager-layout">
                <article className="glass manager-card">
                    <h2 className="section-title">Edit Profile</h2>
                    <form className="stacked-form" onSubmit={handleSaveProfile}>
                        <label>
                            Name
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(event) => handleEditFormChange('name', event.target.value)}
                            />
                        </label>
                        <label>
                            Plan
                            <input
                                type="text"
                                value={editForm.plan}
                                onChange={(event) => handleEditFormChange('plan', event.target.value)}
                            />
                        </label>
                        <label>
                            Accent Color
                            <input
                                type="color"
                                value={editForm.accent}
                                onChange={(event) => handleEditFormChange('accent', event.target.value)}
                            />
                        </label>
                        <button className="primary-btn" type="submit">Save Profile</button>
                    </form>
                </article>

                <article className="glass manager-card">
                    <h2 className="section-title">Achievements</h2>
                    <form className="stacked-form" onSubmit={handleAddAchievement}>
                        <label>
                            Title
                            <input
                                type="text"
                                placeholder="Achievement title"
                                value={achievementForm.title}
                                onChange={(event) => setAchievementForm((prev) => ({ ...prev, title: event.target.value }))}
                            />
                        </label>
                        <label>
                            Description
                            <input
                                type="text"
                                placeholder="What was achieved?"
                                value={achievementForm.description}
                                onChange={(event) => setAchievementForm((prev) => ({ ...prev, description: event.target.value }))}
                            />
                        </label>
                        <button className="primary-btn" type="submit">
                            <Plus size={16} />
                            Add Achievement
                        </button>
                    </form>

                    <div className="achievement-list">
                        {selectedProfile.achievements.map((achievement) => (
                            <div key={achievement.id} className="achievement-item">
                                <div className="achievement-title">
                                    <Trophy size={15} />
                                    <strong>{achievement.title}</strong>
                                </div>
                                {achievement.description && <p>{achievement.description}</p>}
                                <small>{formatEarnedDate(achievement.earnedAt)}</small>
                            </div>
                        ))}
                        {!selectedProfile.achievements.length && (
                            <div className="empty-box">
                                <p>No achievements yet.</p>
                            </div>
                        )}
                    </div>
                </article>
            </section>

            <section className="section-container glass badges-panel">
                <div className="badges-panel-head">
                    <div>
                        <h2 className="section-title">Badges & XP</h2>
                        <p>{selectedProfile.name} has {selectedProfileTotalXp} total badge XP.</p>
                    </div>
                    <label className="xp-control">
                        XP Gain
                        <input
                            type="number"
                            min={5}
                            max={1000}
                            value={xpGain}
                            onChange={(event) => setXpGain(Math.max(5, Number(event.target.value) || 5))}
                        />
                    </label>
                </div>

                <form className="badge-create-form" onSubmit={handleAddBadge}>
                    <input
                        type="text"
                        placeholder="New badge name"
                        value={badgeForm.name}
                        onChange={(event) => setBadgeForm((prev) => ({ ...prev, name: event.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="Badge description"
                        value={badgeForm.description}
                        onChange={(event) => setBadgeForm((prev) => ({ ...prev, description: event.target.value }))}
                    />
                    <button type="submit" className="secondary-btn">
                        <Plus size={16} />
                        Add Badge
                    </button>
                </form>

                <div className="badge-grid">
                    {selectedProfile.badges.map((badge) => {
                        const progress = getBadgeProgress(badge.xp);
                        const maxLevel = progress.maxLevel;

                        return (
                            <article key={badge.id} className={`badge-card ${progress.unlocked ? 'unlocked' : 'locked'}`}>
                                <div className="badge-head">
                                    <div className="badge-title-wrap">
                                        <span className="badge-icon">
                                            {progress.unlocked ? <Medal size={16} /> : <Star size={16} />}
                                        </span>
                                        <div>
                                            <h3>{badge.name}</h3>
                                            <p>{badge.description}</p>
                                        </div>
                                    </div>
                                    <span className="badge-level">
                                        {progress.level > 0 ? `Level ${progress.level}` : 'Locked'}
                                    </span>
                                </div>

                                <div className="badge-progress-row">
                                    <div className="badge-progress-track">
                                        <div
                                            className="badge-progress-fill"
                                            style={{ width: `${progress.progressPercent}%` }}
                                        ></div>
                                    </div>
                                    <span>
                                        {progress.level >= maxLevel
                                            ? `${badge.xp} XP · Max`
                                            : `${badge.xp} / ${progress.nextMilestone} XP`}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="primary-btn"
                                    onClick={() => earnBadgeExp(selectedProfile.id, badge.id, xpGain)}
                                >
                                    <Sparkles size={16} />
                                    Earn {xpGain} XP
                                </button>
                            </article>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Profiles;
