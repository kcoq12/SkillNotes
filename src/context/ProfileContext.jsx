import React, { useEffect, useState } from 'react';
import ProfileContext from './profileContextStore';
import { getBadgeProgress } from './profileProgress';

const ACTIVE_PROFILE_STORAGE_KEY = 'skillnotes.active-profile-id.v1';
const PROFILES_STORAGE_KEY = 'skillnotes.profiles.v1';

const defaultBadgeTemplates = [
    { id: 'consistency', name: 'Consistency', description: 'Study on a regular schedule.' },
    { id: 'accuracy', name: 'Accuracy', description: 'Keep your answers correct and precise.' },
    { id: 'focus', name: 'Focus', description: 'Complete uninterrupted study sessions.' },
];

const createBadgeFromTemplate = (template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    xp: 0,
    level: 0,
    unlocked: false,
});

const defaultProfiles = [
    { id: 'p1', name: 'Alex', plan: 'Pro Plan', accent: '#ef4444' },
    { id: 'p2', name: 'Jamie', plan: 'Student Plus', accent: '#3b82f6' },
    { id: 'p3', name: 'Taylor', plan: 'Focus Mode', accent: '#22c55e' },
    { id: 'p4', name: 'Casey', plan: 'Exam Sprint', accent: '#f59e0b' },
].map((profile) => ({
    ...profile,
    achievements: [],
    badges: defaultBadgeTemplates.map(createBadgeFromTemplate),
}));

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readJson = (storageKey) => {
    if (!canUseStorage()) {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const writeJson = (storageKey, value) => {
    if (!canUseStorage()) {
        return;
    }

    try {
        window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
        // Ignore storage failures in restricted environments.
    }
};

const normalizeBadge = (badge, index) => {
    const progress = getBadgeProgress(badge?.xp || 0);

    return {
        id: badge?.id || `badge-${index + 1}`,
        name: badge?.name || `Badge ${index + 1}`,
        description: badge?.description || 'Custom badge',
        xp: progress.xp,
        level: progress.level,
        unlocked: progress.unlocked,
    };
};

const normalizeProfile = (profile, index) => ({
    id: profile?.id || `p-${index + 1}`,
    name: profile?.name || `Profile ${index + 1}`,
    plan: profile?.plan || 'Learner',
    accent: profile?.accent || '#6366f1',
    achievements: Array.isArray(profile?.achievements) ? profile.achievements : [],
    badges: Array.isArray(profile?.badges) && profile.badges.length
        ? profile.badges.map(normalizeBadge)
        : defaultBadgeTemplates.map(createBadgeFromTemplate),
});

const readProfiles = () => {
    const stored = readJson(PROFILES_STORAGE_KEY);
    if (!Array.isArray(stored) || !stored.length) {
        return defaultProfiles;
    }

    return stored.map(normalizeProfile);
};

const readActiveProfileId = () => {
    if (!canUseStorage()) {
        return defaultProfiles[0].id;
    }

    try {
        return window.localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY) || defaultProfiles[0].id;
    } catch {
        return defaultProfiles[0].id;
    }
};

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const DEFAULT_ACTIVE_PROFILE_ID = defaultProfiles[0].id;

export const ProfileProvider = ({ children }) => {
    const [profiles, setProfiles] = useState(readProfiles);
    const [activeProfileId, setActiveProfileId] = useState(readActiveProfileId);
    const resolvedActiveProfileId = profiles.some((profile) => profile.id === activeProfileId)
        ? activeProfileId
        : (profiles[0]?.id || null);

    useEffect(() => {
        writeJson(PROFILES_STORAGE_KEY, profiles);
    }, [profiles]);

    useEffect(() => {
        if (resolvedActiveProfileId) {
            writeJson(ACTIVE_PROFILE_STORAGE_KEY, resolvedActiveProfileId);
        }
    }, [resolvedActiveProfileId]);

    const activeProfile = profiles.find((profile) => profile.id === resolvedActiveProfileId) || profiles[0];

    const switchProfile = (profileId) => {
        if (!profiles.some((profile) => profile.id === profileId)) {
            return;
        }

        setActiveProfileId(profileId);
    };

    const updateProfile = (profileId, updates) => {
        setProfiles((prev) =>
            prev.map((profile) => {
                if (profile.id !== profileId) {
                    return profile;
                }

                return {
                    ...profile,
                    name: typeof updates.name === 'string' && updates.name.trim()
                        ? updates.name.trim()
                        : profile.name,
                    plan: typeof updates.plan === 'string' && updates.plan.trim()
                        ? updates.plan.trim()
                        : profile.plan,
                    accent: typeof updates.accent === 'string' && updates.accent.trim()
                        ? updates.accent.trim()
                        : profile.accent,
                };
            }),
        );
    };

    const addAchievement = (profileId, achievement) => {
        const title = achievement?.title?.trim();
        const description = achievement?.description?.trim() || '';

        if (!title) {
            return;
        }

        setProfiles((prev) =>
            prev.map((profile) => {
                if (profile.id !== profileId) {
                    return profile;
                }

                return {
                    ...profile,
                    achievements: [
                        {
                            id: createId('ach'),
                            title,
                            description,
                            earnedAt: new Date().toISOString(),
                        },
                        ...profile.achievements,
                    ],
                };
            }),
        );
    };

    const addBadge = (profileId, badge) => {
        const name = badge?.name?.trim();
        const description = badge?.description?.trim() || 'Custom badge';

        if (!name) {
            return;
        }

        setProfiles((prev) =>
            prev.map((profile) => {
                if (profile.id !== profileId) {
                    return profile;
                }

                return {
                    ...profile,
                    badges: [
                        ...profile.badges,
                        {
                            id: createId('badge'),
                            name,
                            description,
                            xp: 0,
                            level: 0,
                            unlocked: false,
                        },
                    ],
                };
            }),
        );
    };

    const earnBadgeExp = (profileId, badgeId, amount = 50) => {
        const gain = Math.max(0, Number(amount) || 0);
        if (!gain) {
            return;
        }

        setProfiles((prev) =>
            prev.map((profile) => {
                if (profile.id !== profileId) {
                    return profile;
                }

                return {
                    ...profile,
                    badges: profile.badges.map((badge) => {
                        if (badge.id !== badgeId) {
                            return badge;
                        }

                        const nextXp = badge.xp + gain;
                        const progress = getBadgeProgress(nextXp);

                        return {
                            ...badge,
                            xp: progress.xp,
                            level: progress.level,
                            unlocked: progress.unlocked,
                        };
                    }),
                };
            }),
        );
    };

    const replaceProfiles = (incomingProfiles, incomingActiveProfileId) => {
        if (!Array.isArray(incomingProfiles) || !incomingProfiles.length) {
            return;
        }

        const normalizedProfiles = incomingProfiles.map(normalizeProfile);
        setProfiles(normalizedProfiles);

        const fallbackId = normalizedProfiles[0]?.id || DEFAULT_ACTIVE_PROFILE_ID;
        const resolvedActiveId = normalizedProfiles.some((profile) => profile.id === incomingActiveProfileId)
            ? incomingActiveProfileId
            : fallbackId;

        setActiveProfileId(resolvedActiveId);
    };

    const logout = () => {
        setActiveProfileId(DEFAULT_ACTIVE_PROFILE_ID);
    };

    return (
        <ProfileContext.Provider
            value={{
                profiles,
                activeProfile,
                switchProfile,
                updateProfile,
                addAchievement,
                addBadge,
                earnBadgeExp,
                replaceProfiles,
                logout,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};
