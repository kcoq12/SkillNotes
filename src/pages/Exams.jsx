import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PlayCircle, Trophy, CheckCircle2, XCircle, FileText, ChevronRight, Share2, Sparkles } from 'lucide-react';
import './Exams.css';
import { loadExamAttempts, loadQuestionBank, saveExamAttempts } from '../data/questionBank';
import { getGrowthMetrics, trackGrowthEvent } from '../data/growthEvents';
import { useProfile } from '../context/useProfile';
import { useLocation } from 'react-router-dom';

const normalizeText = (value) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const isCorrectAnswer = (expected, received) => {
    const normalizedExpected = normalizeText(expected);
    const normalizedReceived = normalizeText(received);

    if (!normalizedReceived) {
        return false;
    }

    if (normalizedExpected === normalizedReceived) {
        return true;
    }

    return normalizedReceived.length >= 8
        && (normalizedExpected.includes(normalizedReceived) || normalizedReceived.includes(normalizedExpected));
};

const formatAttemptDate = (isoDate) =>
    new Date(isoDate).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });

const copyTextToClipboard = async (value) => {
    const text = String(value || '');

    if (!text) {
        return false;
    }

    if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';

    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);

    return copied;
};

const Exams = () => {
    const { activeProfile } = useProfile();
    const location = useLocation();
    const initialBank = loadQuestionBank();
    const [questionSets] = useState(initialBank.sets);
    const [questions] = useState(initialBank.questions);

    const [attempts, setAttempts] = useState(() => loadExamAttempts());
    const [activeExam, setActiveExam] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answersByQuestionId, setAnswersByQuestionId] = useState({});
    const [draftAnswer, setDraftAnswer] = useState('');
    const [lastAttempt, setLastAttempt] = useState(null);
    const [shareStatus, setShareStatus] = useState('');
    const [growthMetrics, setGrowthMetrics] = useState(() => getGrowthMetrics());
    const trackedChallengeKeyRef = useRef('');

    useEffect(() => {
        saveExamAttempts(attempts);
    }, [attempts]);

    const setCards = useMemo(
        () =>
            questionSets.map((set) => ({
                ...set,
                questionCount: questions.filter((question) => question.setId === set.id).length,
            })),
        [questionSets, questions],
    );

    const challengeContext = useMemo(() => {
        const params = new URLSearchParams(location.search);

        if (params.get('challenge') !== '1') {
            return null;
        }

        const setId = Number(params.get('setId'));
        const target = Number(params.get('target'));
        const challenger = (params.get('from') || 'A friend').slice(0, 36);
        const set = questionSets.find((item) => item.id === setId);

        return {
            key: `${setId}-${target}-${challenger}`,
            setId,
            target: Number.isFinite(target) ? Math.max(0, Math.min(100, target)) : 0,
            challenger,
            setName: set?.name || null,
        };
    }, [location.search, questionSets]);

    useEffect(() => {
        if (!challengeContext || challengeContext.key === trackedChallengeKeyRef.current) {
            return;
        }

        trackedChallengeKeyRef.current = challengeContext.key;
        trackGrowthEvent('challenge_opened', {
            setId: challengeContext.setId,
            target: challengeContext.target,
            setFound: Boolean(challengeContext.setName),
        });
        setGrowthMetrics(getGrowthMetrics());
    }, [challengeContext]);

    const activeQuestion = useMemo(() => {
        if (!activeExam) {
            return null;
        }

        const questionId = activeExam.questionIds[currentIndex];
        return questions.find((question) => question.id === questionId) || null;
    }, [activeExam, currentIndex, questions]);

    const testsTaken = attempts.length;
    const passedExams = attempts.filter((attempt) => attempt.score >= 70).length;
    const failedExams = testsTaken - passedExams;
    const averageScore = testsTaken
        ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / testsTaken)
        : 0;

    const startExam = (setId) => {
        const selectedSet = questionSets.find((set) => set.id === setId);
        if (!selectedSet) {
            return;
        }

        const examQuestions = questions
            .filter((question) => question.setId === setId)
            .map((question) => question.id);

        if (!examQuestions.length) {
            return;
        }

        setActiveExam({
            setId,
            setName: selectedSet.name,
            questionIds: examQuestions,
            startedAt: new Date().toISOString(),
        });
        setCurrentIndex(0);
        setAnswersByQuestionId({});
        setDraftAnswer('');
        setLastAttempt(null);
        setShareStatus('');
    };

    const handleShareChallenge = async (attempt) => {
        if (!attempt?.setId) {
            return;
        }

        const challengeTarget = Math.max(60, Math.min(100, attempt.score));
        const params = new URLSearchParams({
            challenge: '1',
            setId: String(attempt.setId),
            target: String(challengeTarget),
            from: activeProfile.name,
            setName: attempt.setName,
        });
        const challengeUrl = `${window.location.origin}${window.location.pathname}#/dashboard?${params.toString()}`;

        const shareMessage = [
            `I scored ${attempt.score}% on "${attempt.setName}" in SkillNotes.`,
            `Can you beat my ${challengeTarget}% challenge?`,
            challengeUrl,
        ].join(' ');

        trackGrowthEvent('share_clicked', {
            setId: attempt.setId,
            score: attempt.score,
            target: challengeTarget,
        });

        try {
            const copied = await copyTextToClipboard(shareMessage);
            if (!copied) {
                throw new Error('copy-failed');
            }
            setShareStatus('Challenge link copied. Share it with your study group.');
        } catch {
            setShareStatus('Could not copy automatically. Please copy from browser location instead.');
        }

        setGrowthMetrics(getGrowthMetrics());
    };

    const persistCurrentAnswer = () => {
        if (!activeQuestion) {
            return answersByQuestionId;
        }

        const currentAnswer = draftAnswer.trim();
        const updated = {
            ...answersByQuestionId,
            [activeQuestion.id]: currentAnswer,
        };

        setAnswersByQuestionId(updated);
        return updated;
    };

    const moveToQuestion = (nextIndex, updatedAnswers) => {
        if (!activeExam) {
            return;
        }

        const nextQuestionId = activeExam.questionIds[nextIndex];
        setCurrentIndex(nextIndex);
        setDraftAnswer(updatedAnswers[nextQuestionId] || '');
    };

    const finishExam = (updatedAnswers) => {
        if (!activeExam) {
            return;
        }

        const examQuestions = activeExam.questionIds
            .map((questionId) => questions.find((question) => question.id === questionId))
            .filter(Boolean);

        const details = examQuestions.map((question) => {
            const received = updatedAnswers[question.id] || '';
            const correct = isCorrectAnswer(question.answer, received);
            return {
                id: question.id,
                prompt: question.prompt,
                expected: question.answer,
                received,
                correct,
            };
        });

        const correctCount = details.filter((item) => item.correct).length;
        const totalQuestions = details.length;
        const score = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;

        const attempt = {
            id: Date.now(),
            setId: activeExam.setId,
            setName: activeExam.setName,
            score,
            correctCount,
            totalQuestions,
            completedAt: new Date().toISOString(),
        };

        setAttempts((prev) => [attempt, ...prev]);
        setLastAttempt({ ...attempt, details });
        setActiveExam(null);
        setCurrentIndex(0);
        setAnswersByQuestionId({});
        setDraftAnswer('');
    };

    const handleNext = () => {
        if (!activeExam || !activeQuestion) {
            return;
        }

        const updatedAnswers = persistCurrentAnswer();
        const isLastQuestion = currentIndex >= activeExam.questionIds.length - 1;

        if (isLastQuestion) {
            finishExam(updatedAnswers);
            return;
        }

        moveToQuestion(currentIndex + 1, updatedAnswers);
    };

    const handlePrevious = () => {
        if (!activeExam || currentIndex <= 0) {
            return;
        }

        const updatedAnswers = persistCurrentAnswer();
        moveToQuestion(currentIndex - 1, updatedAnswers);
    };

    return (
        <div className="exams-page page-container animate-fade-in">
            <header className="page-header">
                <div className="date-chip">Assessment Hub</div>
                <h1 className="gradient-text">Exams & Quizzes</h1>
                <p className="motivation-quote">Put your knowledge to the ultimate test.</p>
            </header>

            <div className="exams-layout">
                <div className="main-col">
                    {!activeExam && challengeContext && challengeContext.setName && (
                        <section className="section-container glass challenge-banner">
                            <div className="challenge-copy">
                                <p className="challenge-kicker">Challenge Received</p>
                                <h2>{challengeContext.challenger} challenged you on {challengeContext.setName}</h2>
                                <p>Target score: {challengeContext.target}%</p>
                            </div>
                            <button className="start-btn" type="button" onClick={() => {
                                trackGrowthEvent('challenge_accepted', {
                                    setId: challengeContext.setId,
                                    from: challengeContext.challenger
                                });
                                startExam(challengeContext.setId);
                            }}>
                                <Sparkles size={16} />
                                Accept Challenge
                            </button>
                        </section>
                    )}

                    {!activeExam && (
                        <section className="section-container">
                            <h2 className="section-title">Question Sets</h2>
                            <div className="set-grid">
                                {setCards.map((set) => (
                                    <article key={set.id} className="set-card glass">
                                        <div className="set-card-top">
                                            <h3>{set.name}</h3>
                                            <span>{set.questionCount} questions</span>
                                        </div>
                                        <p>{set.description}</p>
                                        <button
                                            className="start-btn"
                                            type="button"
                                            onClick={() => startExam(set.id)}
                                            disabled={!set.questionCount}
                                        >
                                            <PlayCircle size={16} />
                                            {set.questionCount ? 'Take Exam' : 'No Questions'}
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeExam && activeQuestion && (
                        <section className="section-container glass exam-runner">
                            <div className="runner-head">
                                <div>
                                    <h2>{activeExam.setName}</h2>
                                    <p>
                                        Question {currentIndex + 1} of {activeExam.questionIds.length}
                                    </p>
                                </div>
                                <span className="progress-pill">
                                    {Math.round(((currentIndex + 1) / activeExam.questionIds.length) * 100)}%
                                </span>
                            </div>

                            <div className="runner-question">
                                <h3>{activeQuestion.prompt}</h3>
                                <textarea
                                    rows={5}
                                    placeholder="Write your answer..."
                                    value={draftAnswer}
                                    onChange={(event) => setDraftAnswer(event.target.value)}
                                />
                            </div>

                            <div className="runner-actions">
                                <button type="button" className="secondary-btn" onClick={handlePrevious} disabled={currentIndex === 0}>
                                    Previous
                                </button>
                                <button type="button" className="start-btn" onClick={handleNext}>
                                    {currentIndex >= activeExam.questionIds.length - 1 ? 'Finish Exam' : (
                                        <>
                                            Next
                                            <ChevronRight size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </section>
                    )}

                    {lastAttempt && (
                        <section className="section-container glass exam-result">
                            <div className="result-head">
                                <h2>{lastAttempt.setName} Result</h2>
                                <div className="result-actions">
                                    <span className="result-score">{lastAttempt.score}%</span>
                                    <button type="button" className="share-btn" onClick={() => handleShareChallenge(lastAttempt)}>
                                        <Share2 size={14} />
                                        Share Challenge
                                    </button>
                                </div>
                            </div>
                            <p>
                                You got {lastAttempt.correctCount} out of {lastAttempt.totalQuestions} correct.
                            </p>
                            {shareStatus && <p className="share-status">{shareStatus}</p>}
                            <div className="result-list">
                                {lastAttempt.details.map((detail) => (
                                    <div key={detail.id} className="result-item">
                                        <div className="result-prompt">
                                            {detail.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                            <span>{detail.prompt}</span>
                                        </div>
                                        {!detail.correct && (
                                            <p className="result-answer">
                                                Correct answer: {detail.expected}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="section-container">
                        <h2 className="section-title">Recent Attempts</h2>
                        <div className="attempts-list">
                            {attempts.map((attempt) => (
                                <article key={attempt.id} className="attempt-card glass">
                                    <div>
                                        <h3>{attempt.setName}</h3>
                                        <p>{formatAttemptDate(attempt.completedAt)}</p>
                                    </div>
                                    <div className="attempt-score">
                                        <span>{attempt.score}%</span>
                                        <small>{attempt.correctCount}/{attempt.totalQuestions}</small>
                                    </div>
                                </article>
                            ))}
                            {!attempts.length && (
                                <div className="glass empty-attempts">
                                    <p>No attempts yet. Start an exam from a question set.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <aside className="sidebar-col glass">
                    <div className="performance-summary">
                        <h3>Performance</h3>
                        <div className="chart-placeholder">
                            <div
                                className="circle-chart"
                                style={{
                                    background: `conic-gradient(var(--accent-color) ${averageScore}%, rgba(255, 255, 255, 0.1) 0)`,
                                }}
                            >
                                <div className="inner-circle">
                                    <span className="score-big">{averageScore}%</span>
                                    <span className="score-label">Average</span>
                                </div>
                            </div>
                        </div>
                        <div className="stats-rows">
                            <div className="stat-row">
                                <span className="label">Tests Taken</span>
                                <span className="val">{testsTaken}</span>
                            </div>
                            <div className="stat-row">
                                <span className="label">Passed</span>
                                <span className="val success">{passedExams}</span>
                            </div>
                            <div className="stat-row">
                                <span className="label">Failed</span>
                                <span className="val danger">{failedExams}</span>
                            </div>
                        </div>
                    </div>

                    <div className="quick-start">
                        <h3>How It Works</h3>
                        <p>
                            Create question sets in the Questions tab, then come here to run a timed-style
                            practice exam from any set.
                        </p>
                        <div className="quick-icon-row">
                            <FileText size={16} />
                            <span>{questionSets.length} sets available</span>
                        </div>
                        <div className="quick-icon-row">
                            <Trophy size={16} />
                            <span>{attempts.length} attempts recorded</span>
                        </div>
                    </div>

                    <div className="quick-start">
                        <h3>Challenge Loop</h3>
                        <p>Track how often exam results are shared and challenge links are opened.</p>
                        <div className="quick-icon-row">
                            <Share2 size={16} />
                            <span>{growthMetrics.shareClicked} share clicks</span>
                        </div>
                        <div className="quick-icon-row">
                            <Sparkles size={16} />
                            <span>{growthMetrics.challengeAccepted} challenge accepts</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Exams;
