import React, { useMemo, useState } from 'react';
import './Dashboard.css';
import { BookOpen, Layers, CheckCircle, TrendingUp, AlertCircle, PlayCircle, Sparkles } from 'lucide-react';
import { getDashboardData } from '../data/studyData';
import { useProfile } from '../context/useProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { trackGrowthEvent } from '../data/growthEvents';

const StatCard = ({ title, value, label, icon, color }) => (
    <div className="stat-card glass" style={{ '--card-accent': color }}>
        <div className="stat-card-inner">
            <div className="stat-icon-wrapper">
                {React.createElement(icon, { size: 28, className: 'stat-icon' })}
            </div>
            <div className="stat-info">
                <span className="stat-value">{value}</span>
                <h3 className="stat-title">{title}</h3>
                <p className="stat-label">{label}</p>
            </div>
        </div>
        <div className="stat-card-glow" />
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
    const { activeProfile } = useProfile();
    const { stats, statusCards, weeklyStudyChart, masteryChart, recentActivity } = getDashboardData(now);
    const navigate = useNavigate();
    const location = useLocation();

    const pendingChallenge = useMemo(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('challenge') !== '1') return null;
        return {
            setId: Number(params.get('setId')),
            target: Number(params.get('target')),
            from: params.get('from') || 'A friend',
            setName: params.get('setName') || 'Study Set'
        };
    }, [location.search]);
    const [planItems, setPlanItems] = useState([]);
    const todayLabel = now.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
    const maxStudyMinutes = Math.max(...weeklyStudyChart.map((item) => item.minutes), 1);
    const totalStudyMinutes = weeklyStudyChart.reduce((sum, item) => sum + item.minutes, 0);
    const generatedAt = useMemo(
        () => (planItems.length
            ? new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
            : ''),
        [planItems.length],
    );

    const handleOpenActivity = (item) => {
        if (item.type.toLowerCase().includes('exam')) {
            navigate('/exams');
            return;
        }

        navigate('/flashcards');
    };

    const handleGeneratePlan = () => {
        const weakestTopics = [...masteryChart]
            .sort((a, b) => a.mastery - b.mastery)
            .slice(0, 3);

        const generated = weakestTopics.map((topic, index) => ({
            id: `${topic.topic}-${index}`,
            title: `Improve ${topic.topic}`,
            step: `Study ${topic.topic} for ${30 + index * 15} min and complete a quick review.`,
        }));

        setPlanItems(generated);
    };

    return (
        <div className="dashboard page-container animate-fade-in">
            <header className="page-header greeting-banner glass">
                <div className="greeting-content">
                    <span className="date-chip">{todayLabel}</span>
                    <h1 className="gradient-text">{greeting.title}, {activeProfile.name}</h1>
                    <p>Your learning journey continues here. Keep building your momentum.</p>
                </div>
                <blockquote className="motivation-quote">{greeting.quote}</blockquote>
            </header>

            {pendingChallenge && (
                <section className="section-container glass challenge-alert animate-float">
                    <div className="challenge-alert-content">
                        <div className="alert-icon">
                            <Sparkles size={24} />
                        </div>
                        <div className="alert-text">
                            <h3>Challenge from {pendingChallenge.from}</h3>
                            <p>They want to see if you can beat <strong>{pendingChallenge.target}%</strong> on the {pendingChallenge.setName} exam.</p>
                        </div>
                    </div>
                    <button className="primary-btn" onClick={() => {
                        trackGrowthEvent('challenge_accepted', {
                            setId: pendingChallenge.setId,
                            from: pendingChallenge.from
                        });
                        navigate(`/exams${location.search}`);
                    }}>
                        Accept Challenge
                    </button>
                </section>
            )}

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
                    <button className="text-btn" type="button" onClick={() => navigate('/flashcards')}>View All</button>
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
                            <button className="play-btn" type="button" onClick={() => handleOpenActivity(item)}>
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
                        <button className="primary-btn" type="button" onClick={handleGeneratePlan}>Create Study Plan</button>
                        {planItems.length > 0 && (
                            <div className="plan-preview">
                                <span className="plan-meta">Updated at {generatedAt}</span>
                                {planItems.map((planItem) => (
                                    <div key={planItem.id} className="plan-item">
                                        <strong>{planItem.title}</strong>
                                        <p>{planItem.step}</p>
                                    </div>
                                ))}
                            </div>
                        )}
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
