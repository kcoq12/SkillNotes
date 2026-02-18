import React from 'react';
import './Exams.css';
import { Calendar, Clock, Award, ChevronRight, FileText, AlertTriangle } from 'lucide-react';

const ExamCard = ({ title, date, duration, questions, difficulty, status }) => {
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
                        <Calendar size={14} /> {date}
                    </span>
                    <span className="meta-item">
                        <Clock size={14} /> {duration} min
                    </span>
                    <span className="meta-item">
                        <FileText size={14} /> {questions} Qs
                    </span>
                </div>
            </div>
            <div className="exam-action">
                {status === 'upcoming' ? (
                    <button className="start-btn">Start</button>
                ) : (
                    <span className="score-badge">
                        {status === 'completed' ? '85%' : 'Missed'}
                    </span>
                )}
            </div>
        </div>
    );
};

const Exams = () => {
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
                            <ExamCard
                                title="React Advanced Patterns"
                                date="Today, 2:00 PM"
                                duration={45}
                                questions={25}
                                level="Hard"
                                status="upcoming"
                            />
                            <ExamCard
                                title="Node.js Event Loop"
                                date="Tomorrow, 10:00 AM"
                                duration={30}
                                questions={15}
                                level="Medium"
                                status="upcoming"
                            />
                        </div>
                    </section>

                    <section className="history-section">
                        <h2 className="section-title">History</h2>
                        <div className="exams-list">
                            <ExamCard
                                title="CSS Grid Layout"
                                date="Feb 15, 2026"
                                duration={20}
                                questions={10}
                                level="Easy"
                                status="completed"
                            />
                            <ExamCard
                                title="JavaScript Promises"
                                date="Feb 10, 2026"
                                duration={40}
                                questions={30}
                                level="Hard"
                                status="missed"
                            />
                        </div>
                    </section>
                </div>

                <aside className="sidebar-col glass">
                    <div className="performance-summary">
                        <h3>Performance</h3>
                        <div className="chart-placeholder">
                            <div className="circle-chart">
                                <div className="inner-circle">
                                    <span className="score-big">78%</span>
                                    <span className="score-label">Average</span>
                                </div>
                            </div>
                        </div>
                        <div className="stats-rows">
                            <div className="stat-row">
                                <span className="label">Tests Taken</span>
                                <span className="val">12</span>
                            </div>
                            <div className="stat-row">
                                <span className="label">Passed</span>
                                <span className="val success">10</span>
                            </div>
                            <div className="stat-row">
                                <span className="label">Failed</span>
                                <span className="val danger">2</span>
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
