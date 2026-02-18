const createDateWithOffset = (dayOffset, hour, minute = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
};

const isSameCalendarDay = (a, b) =>
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();

const getDayStart = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const getDayEnd = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

const asPercent = (value, total) => (total > 0 ? Math.round((value / total) * 100) : 0);

export const userProfile = {
    name: 'User',
    plan: 'Pro Plan',
    streakDays: 12,
};

export const flashcardDecks = [
    { id: 1, title: 'Javascript Basics', count: 24, category: 'Code', color: '#f59e0b', progress: 78, favorite: true, lastStudiedAt: createDateWithOffset(-1, 20, 15) },
    { id: 2, title: 'React Hooks', count: 12, category: 'Frontend', color: '#6366f1', progress: 85, favorite: true, lastStudiedAt: createDateWithOffset(0, 9, 30) },
    { id: 3, title: 'CSS Grid & Flexbox', count: 18, category: 'Design', color: '#ec4899', progress: 66, favorite: false, lastStudiedAt: createDateWithOffset(-2, 21, 0) },
    { id: 4, title: 'Node.js Backend', count: 32, category: 'Backend', color: '#10b981', progress: 54, favorite: false, lastStudiedAt: createDateWithOffset(-3, 19, 10) },
    { id: 5, title: 'System Design', count: 15, category: 'Architecture', color: '#3b82f6', progress: 73, favorite: false, lastStudiedAt: createDateWithOffset(-4, 22, 40) },
    { id: 6, title: 'SQL Queries', count: 40, category: 'Database', color: '#8b5cf6', progress: 91, favorite: true, lastStudiedAt: createDateWithOffset(-1, 7, 45) },
];

export const examRecords = [
    { id: 1, title: 'React Advanced Patterns', topic: 'React', scheduledAt: createDateWithOffset(0, 14, 0), duration: 45, questions: 25, difficulty: 'Hard', status: 'upcoming', score: null },
    { id: 2, title: 'Node.js Event Loop', topic: 'Node.js', scheduledAt: createDateWithOffset(1, 10, 0), duration: 30, questions: 15, difficulty: 'Medium', status: 'upcoming', score: null },
    { id: 3, title: 'CSS Grid Layout', topic: 'CSS', scheduledAt: createDateWithOffset(-3, 12, 0), duration: 20, questions: 10, difficulty: 'Easy', status: 'completed', score: 85 },
    { id: 4, title: 'JavaScript Promises', topic: 'JavaScript', scheduledAt: createDateWithOffset(-8, 11, 30), duration: 40, questions: 30, difficulty: 'Hard', status: 'missed', score: null },
];

export const reviewQueue = [
    { id: 1, dueAt: createDateWithOffset(0, 9, 0), completed: false },
    { id: 2, dueAt: createDateWithOffset(0, 18, 0), completed: false },
    { id: 3, dueAt: createDateWithOffset(1, 10, 0), completed: false },
    { id: 4, dueAt: createDateWithOffset(-1, 20, 30), completed: true },
    { id: 5, dueAt: createDateWithOffset(0, 21, 0), completed: false },
];

export const learningGoals = {
    completed: 17,
    total: 25,
};

export const studySessions = [
    { id: 1, startedAt: createDateWithOffset(-6, 19, 30), minutes: 45 },
    { id: 2, startedAt: createDateWithOffset(-5, 20, 0), minutes: 58 },
    { id: 3, startedAt: createDateWithOffset(-4, 21, 15), minutes: 36 },
    { id: 4, startedAt: createDateWithOffset(-3, 18, 45), minutes: 72 },
    { id: 5, startedAt: createDateWithOffset(-2, 17, 40), minutes: 64 },
    { id: 6, startedAt: createDateWithOffset(-1, 8, 5), minutes: 53 },
    { id: 7, startedAt: createDateWithOffset(0, 7, 30), minutes: 41 },
];

export const formatExamDateLabel = (isoDate, now = new Date()) => {
    const examDate = new Date(isoDate);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const timeLabel = examDate.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
    });

    if (isSameCalendarDay(examDate, now)) {
        return `Today, ${timeLabel}`;
    }

    if (isSameCalendarDay(examDate, tomorrow)) {
        return `Tomorrow, ${timeLabel}`;
    }

    return examDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const getRecentDecks = (now = new Date()) => {
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    return flashcardDecks.filter((deck) => new Date(deck.lastStudiedAt) >= oneWeekAgo);
};

const getWeeklyStudyChart = (now) => {
    const chart = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
        const day = new Date(now);
        day.setDate(now.getDate() - offset);

        const minutes = studySessions
            .filter((session) => isSameCalendarDay(new Date(session.startedAt), day))
            .reduce((sum, session) => sum + session.minutes, 0);

        chart.push({
            day: day.toLocaleDateString(undefined, { weekday: 'short' }),
            minutes,
            color: '#6366f1',
        });
    }

    return chart;
};

const getRecentActivity = () => {
    const deckEvents = flashcardDecks.map((deck) => ({
        id: `deck-${deck.id}`,
        title: deck.title,
        type: 'Flashcards',
        progress: deck.progress,
        color: deck.color,
        date: deck.lastStudiedAt,
    }));

    const examEvents = examRecords.map((exam) => ({
        id: `exam-${exam.id}`,
        title: exam.title,
        type: 'Exam',
        progress: exam.status === 'completed' ? exam.score : exam.status === 'upcoming' ? 15 : 0,
        color: exam.status === 'completed' ? '#10b981' : exam.status === 'upcoming' ? '#3b82f6' : '#ef4444',
        date: exam.scheduledAt,
    }));

    return [...deckEvents, ...examEvents]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
};

export const getDashboardData = (now = new Date()) => {
    const totalFlashcards = flashcardDecks.reduce((sum, deck) => sum + deck.count, 0);
    const completedExams = examRecords.filter((exam) => exam.status === 'completed');
    const avgExamScore = completedExams.length
        ? Math.round(completedExams.reduce((sum, exam) => sum + exam.score, 0) / completedExams.length)
        : 0;
    const questionsAnswered = examRecords
        .filter((exam) => exam.status !== 'upcoming')
        .reduce((sum, exam) => sum + exam.questions, 0);

    const pendingReviews = reviewQueue.filter((review) => {
        const due = new Date(review.dueAt);
        return !review.completed && due >= getDayStart(now) && due <= getDayEnd(now);
    }).length;

    const weeklyStudyChart = getWeeklyStudyChart(now);
    const totalWeekMinutes = weeklyStudyChart.reduce((sum, item) => sum + item.minutes, 0);
    const focusProgress = Math.min(asPercent(totalWeekMinutes, 360), 100);
    const taskCompletion = asPercent(learningGoals.completed, learningGoals.total);

    const masteryChart = flashcardDecks.map((deck) => ({
        topic: deck.category,
        mastery: deck.progress,
        color: deck.color,
    }));

    const statusCards = [
        {
            id: 1,
            title: 'Focus Status',
            value: focusProgress >= 75 ? 'On Track' : 'Needs Focus',
            detail: `${totalWeekMinutes} minutes studied this week`,
            progress: focusProgress,
            color: '#22c55e',
        },
        {
            id: 2,
            title: 'Task Completion',
            value: `${taskCompletion}%`,
            detail: `${learningGoals.completed} of ${learningGoals.total} tasks done`,
            progress: taskCompletion,
            color: '#f59e0b',
        },
        {
            id: 3,
            title: 'Exam Readiness',
            value: `${avgExamScore}%`,
            detail: `${completedExams.length} completed exam${completedExams.length === 1 ? '' : 's'}`,
            progress: avgExamScore,
            color: '#60a5fa',
        },
    ];

    return {
        userProfile,
        stats: {
            totalFlashcards,
            questionsAnswered,
            accuracy: `${avgExamScore}%`,
            streakDays: userProfile.streakDays,
            pendingReviews,
        },
        statusCards,
        weeklyStudyChart,
        masteryChart,
        recentActivity: getRecentActivity(),
    };
};
