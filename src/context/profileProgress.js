export const BADGE_LEVEL_MILESTONES = [120, 320, 620, 1020];

export const getBadgeProgress = (xpValue = 0) => {
    const xp = Math.max(0, Number(xpValue) || 0);
    const maxLevel = BADGE_LEVEL_MILESTONES.length;
    const level = BADGE_LEVEL_MILESTONES.filter((milestone) => xp >= milestone).length;
    const unlocked = level > 0;

    if (level >= maxLevel) {
        return {
            xp,
            level,
            unlocked,
            maxLevel,
            nextMilestone: null,
            progressPercent: 100,
        };
    }

    const currentLevelStart = level === 0 ? 0 : BADGE_LEVEL_MILESTONES[level - 1];
    const nextMilestone = BADGE_LEVEL_MILESTONES[level];
    const step = nextMilestone - currentLevelStart;
    const progressPercent = step > 0
        ? Math.min(100, Math.max(0, ((xp - currentLevelStart) / step) * 100))
        : 0;

    return {
        xp,
        level,
        unlocked,
        maxLevel,
        nextMilestone,
        progressPercent,
    };
};
