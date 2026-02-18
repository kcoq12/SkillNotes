import React from 'react';
import './Exams.css';
import { Calendar, Clock, Award, FileText } from 'lucide-react';
import { examRecords, formatExamDateLabel } from '../data/studyData';

const ExamCard = ({ title, dateLabel, duration, questions, difficulty, status, score }) => {
    const getStatusColor = (s) => {
        switch (s) {
            case 'upcoming': return '#3b82f6';
            case 'completed': return '#10b981';
            case 'missed': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="exam-card glass">
            <div className={`exam-status-indicator ${status}`} style={{ background: getStatusColor(status) }}></div>
            <div className="exam-content">
                <h3 className="exam-title">{title}</h3>
                <div className="exam-meta">
                    <span className="meta-item">
                        <Calendar size={14} /> {dateLabel}
                    </span>
                    <span className="meta-item">
                        <Clock size={14} /> {duration} min
                    </span>
                    <span className="meta-item">
                        <FileText size={14} /> {questions} Qs
                    </span>
                    <span className="meta-item">
                        <Award size={14} /> {difficulty}
                    </span>
                </div>
            </div>
            <div className="exam-action">
                {status === 'upcoming' ? (
                    <button className="start-btn">Start</button>
                ) : (
                    <span className="score-badge">
                        {status === 'completed' ? `${score}%` : 'Missed'}
                    </span>
                )}
            </div>
        </div>
    );
};

const Exams = () => {
    const now = new Date();
    const upcomingExams = examRecords
        .filter((exam) => exam.status === 'upcoming')
        .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    const historyExams = examRecords
        .filter((exam) => exam.status !== 'upcoming')
        .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));

    const takenExams = historyExams.length;
    const passedExams = historyExams.filter((exam) => exam.status === 'completed' && exam.score >= 70).length;
    const failedExams = takenExams - passedExams;
    const completedExams = historyExams.filter((exam) => exam.status === 'completed');
    const averageScore = completedExams.length
        ? Math.round(completedExams.reduce((sum, exam) => sum + exam.score, 0) / completedExams.length)
        : 0;

    return (
        <div className="exams-page page-container animate-fade-in">
            <header className="page-header">
                <h1 className="gradient-text">Exams & Quizzes</h1>
                <p>Test your knowledge under pressure.</p>
            </header>

            <div className="exams-layout">
                <div className="main-col">
                    <section className="upcoming-section">
                        <h2 className="section-title">Upcoming</h2>
                        <div className="exams-list">
                            {upcomingExams.map((exam) => (
                                <ExamCard
                                    key={exam.id}
                                    title={exam.title}
                                    dateLabel={formatExamDateLabel(exam.scheduledAt, now)}
                                    duration={exam.duration}
                                    questions={exam.questions}
                                    difficulty={exam.difficulty}
                                    status={exam.status}
                                    score={exam.score}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="history-section">
                        <h2 className="section-title">History</h2>
                        <div className="exams-list">
                            {historyExams.map((exam) => (
                                <ExamCard
                                    key={exam.id}
                                    title={exam.title}
                                    dateLabel={formatExamDateLabel(exam.scheduledAt, now)}
                                    duration={exam.duration}
                                    questions={exam.questions}
                                    difficulty={exam.difficulty}
                                    status={exam.status}
                                    score={exam.score}
                                />
                            ))}
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
                                <span className="val">{takenExams}</span>
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
                        <h3>Quick Quiz</h3>
                        <p>Generate a random 10-question quiz based on your weak areas.</p>
                        <button className="secondary-btn">Generate Now</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Exams;
