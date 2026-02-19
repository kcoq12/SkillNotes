const QUESTION_BANK_STORAGE_KEY = 'skillnotes.question-bank.v1';
const EXAM_ATTEMPTS_STORAGE_KEY = 'skillnotes.exam-attempts.v1';

export const defaultQuestionSets = [
    { id: 1, name: 'React Basics', description: 'Core React concepts and hooks' },
    { id: 2, name: 'JavaScript Logic', description: 'Functions, scopes, and async thinking' },
];

export const defaultQuestions = [
    {
        id: 1,
        setId: 1,
        prompt: 'What problem does `useEffect` solve in React?',
        answer: 'It handles side effects after render like fetches, subscriptions, and DOM updates.',
        difficulty: 'Medium',
    },
    {
        id: 2,
        setId: 2,
        prompt: 'What is a closure in JavaScript?',
        answer: 'A closure is a function that keeps access to variables from its outer scope.',
        difficulty: 'Easy',
    },
];

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readJson = (key) => {
    if (!canUseStorage()) {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const writeJson = (key, value) => {
    if (!canUseStorage()) {
        return;
    }

    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore persistence failures in restricted storage environments.
    }
};

export const loadQuestionBank = () => {
    const stored = readJson(QUESTION_BANK_STORAGE_KEY);
    const sets = Array.isArray(stored?.sets) ? stored.sets : defaultQuestionSets;
    const questions = Array.isArray(stored?.questions) ? stored.questions : defaultQuestions;

    if (!sets.length) {
        return { sets: defaultQuestionSets, questions: defaultQuestions };
    }

    return { sets, questions };
};

export const saveQuestionBank = ({ sets, questions }) => {
    writeJson(QUESTION_BANK_STORAGE_KEY, { sets, questions });
};

export const loadExamAttempts = () => {
    const stored = readJson(EXAM_ATTEMPTS_STORAGE_KEY);
    return Array.isArray(stored) ? stored : [];
};

export const saveExamAttempts = (attempts) => {
    writeJson(EXAM_ATTEMPTS_STORAGE_KEY, attempts);
};
