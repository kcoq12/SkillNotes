const GROWTH_EVENTS_STORAGE_KEY = 'skillnotes.growth-events.v1';
const MAX_EVENT_LOG_ITEMS = 100;

const DEFAULT_SNAPSHOT = {
    counters: {},
    events: [],
};

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readSnapshot = () => {
    if (!canUseStorage()) {
        return DEFAULT_SNAPSHOT;
    }

    try {
        const raw = window.localStorage.getItem(GROWTH_EVENTS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;

        if (!parsed || typeof parsed !== 'object') {
            return DEFAULT_SNAPSHOT;
        }

        const counters = parsed.counters && typeof parsed.counters === 'object' ? parsed.counters : {};
        const events = Array.isArray(parsed.events) ? parsed.events.slice(0, MAX_EVENT_LOG_ITEMS) : [];

        return {
            counters,
            events,
        };
    } catch {
        return DEFAULT_SNAPSHOT;
    }
};

const writeSnapshot = (snapshot) => {
    if (!canUseStorage()) {
        return;
    }

    try {
        window.localStorage.setItem(GROWTH_EVENTS_STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
        // Ignore storage failures in restricted environments.
    }
};

export const trackGrowthEvent = (name, payload = {}) => {
    if (!name) {
        return readSnapshot();
    }

    const snapshot = readSnapshot();
    const nextCounters = {
        ...snapshot.counters,
        [name]: (snapshot.counters[name] || 0) + 1,
    };

    if (typeof window !== 'undefined') {
        console.log(`[Growth Event] ${name}`, payload);
    }

    const nextEvents = [
        {
            id: `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name,
            payload,
            createdAt: new Date().toISOString(),
        },
        ...snapshot.events,
    ].slice(0, MAX_EVENT_LOG_ITEMS);

    const nextSnapshot = {
        counters: nextCounters,
        events: nextEvents,
    };

    writeSnapshot(nextSnapshot);
    return nextSnapshot;
};

export const getGrowthMetrics = () => {
    const snapshot = readSnapshot();

    return {
        shareClicked: snapshot.counters.share_clicked || 0,
        challengeOpened: snapshot.counters.challenge_opened || 0,
        challengeAccepted: snapshot.counters.challenge_accepted || 0,
    };
};
