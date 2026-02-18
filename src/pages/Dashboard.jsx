import React from 'react';
import './Dashboard.css';
import { BookOpen, Layers, CheckCircle, TrendingUp, AlertCircle, PlayCircle } from 'lucide-react';
import { getDashboardData } from '../data/studyData';

const StatCard = ({ title, value, label, icon, color }) => (
    <div className="stat-card glass" style={{ '--card-accent': color }}>
        <div className="stat-icon-wrapper">
            {React.createElement(icon, { size: 24, className: 'stat-icon' })}
        </div>
        <div className="stat-info">
            <span className="stat-value">{value}</span>
            <h3 className="stat-title">{title}</h3>
            <p className="stat-label">{label}</p>
        </div>
    </div>
);

const getGreetingInfo = (date) => {
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) {
        return {
            title: 'Good Morning',
            quote: 'Small steps this morning build unstoppable momentum.',
        };
    }

    if (hour >= 12 && hour < 17) {
        return {
            title: 'Good Afternoon',
            quote: "Keep your focus sharp. Today's effort becomes tomorrow's confidence.",
        };
    }

    if (hour >= 17 && hour < 21) {
        return {
            title: 'Good Evening',
            quote: 'Great work so far. A focused session now makes tomorrow easier.',
        };
    }

    return {
        title: 'Good Night',
        quote: 'Close the day with one clear win, then recharge for tomorrow.',
    };
};

const Dashboard = () => {
    const now = new Date();
    const greeting = getGreetingInfo(now);
    const { userProfile, stats, statusCards, weeklyStudyChart, masteryChart, recentActivity } = getDashboardData(now);
    const todayLabel = now.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
    const maxStudyMinutes = Math.max(...weeklyStudyChart.map((item) => item.minutes), 1);
    const totalStudyMinutes = weeklyStudyChart.reduce((sum, item) => sum + item.minutes, 0);

    return (
        <div className="dashboard page-container animate-fade-in">
            <header className="page-header greeting-banner glass">
                <div className="greeting-content">
                    <span className="date-chip">{todayLabel}</span>
                    <h1 className="gradient-text">{greeting.title}, {userProfile.name}</h1>
                    <p>Your learning journey continues here. Keep building your momentum.</p>
                </div>
                <blockquote className="motivation-quote">{greeting.quote}</blockquote>
            </header>

            <div className="stats-grid">
                <StatCard
                    title="Total Flashcards"
                    value={stats.totalFlashcards.toLocaleString()}
                    label="Across all decks"
                    icon={Layers}
                    color="#8b5cf6"
                />
                <StatCard
                    title="Questions Answered"
                    value={stats.questionsAnswered.toLocaleString()}
                    label={`${stats.accuracy} average score`}
                    icon={CheckCircle}
                    color="#10b981"
                />
                <StatCard
                    title="Current Streak"
                    value={`${stats.streakDays} Days`}
                    label="Keep it up!"
                    icon={TrendingUp}
                    color="#f59e0b"
                />
                <StatCard
                    title="Pending Reviews"
                    value={stats.pendingReviews}
                    label="Due today"
                    icon={AlertCircle}
                    color="#ef4444"
                />
            </div>

            <section className="section-container">
                <div className="section-header">
                    <h2>Your Status</h2>
                </div>

                <div className="status-grid">
                    {statusCards.map((status) => (
                        <article key={status.id} className="status-card glass">
                            <div className="status-row">
                                <h3>{status.title}</h3>
                                <span className="status-value">{status.value}</span>
                            </div>
                            <p className="status-detail">{status.detail}</p>
                            <div className="status-track">
                                <div
                                    className="status-fill"
                                    style={{ width: `${status.progress}%`, backgroundColor: status.color }}
                                ></div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section-container charts-grid">
                <article className="glass chart-card">
                    <div className="section-header chart-header">
                        <h2>Weekly Study Chart</h2>
                        <span className="chart-meta">{totalStudyMinutes} mins</span>
                    </div>
                    <div className="vertical-chart">
                        {weeklyStudyChart.map((item) => (
                            <div key={item.day} className="vertical-column">
                                <div className="vertical-track">
                                    <div
                                        className="vertical-bar"
                                        style={{
                                            height: `${(item.minutes / maxStudyMinutes) * 100}%`,
                                            backgroundColor: item.color,
                                        }}
                                    ></div>
                                </div>
                                <span className="column-day">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="glass chart-card">
                    <div className="section-header chart-header">
                        <h2>Mastery by Topic</h2>
                        <span className="chart-meta">Progress overview</span>
                    </div>
                    <div className="mastery-list">
                        {masteryChart.map((item) => (
                            <div key={item.topic} className="mastery-item">
                                <div className="mastery-row">
                                    <span>{item.topic}</span>
                                    <span>{item.mastery}%</span>
                                </div>
                                <div className="mastery-track">
                                    <div
                                        className="mastery-fill"
                                        style={{
                                            width: `${item.mastery}%`,
                                            backgroundColor: item.color,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            <section className="section-container">
                <div className="section-header">
                    <h2>Continue Learning</h2>
                    <button className="text-btn">View All</button>
                </div>

                <div className="activity-grid">
                    {recentActivity.map((item) => (
                        <div key={item.id} className="activity-card glass">
                            <div className="activity-icon" style={{ background: item.color }}>
                                <BookOpen size={20} color="white" />
                            </div>
                            <div className="activity-content">
                                <h3>{item.title}</h3>
                                <span className="activity-meta">{item.type} • {item.progress}% Complete</span>
                                <div className="progress-bar-bg">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${item.progress}%`, background: item.color }}
                                    ></div>
                                </div>
                            </div>
                            <button className="play-btn">
                                <PlayCircle size={32} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section-container">
                <div className="glass promo-banner">
                    <div className="promo-content">
                        <h2>Master your next exam</h2>
                        <p>Create a custom study plan based on your weak areas.</p>
                        <button className="primary-btn">Create Study Plan</button>
                    </div>
                    <div className="promo-visual">
                        {/* Visual element here */}
                        <div className="floating-circle c1"></div>
                        <div className="floating-circle c2"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
