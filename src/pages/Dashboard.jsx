import React from 'react';
import './Dashboard.css';
import { BookOpen, Layers, CheckCircle, TrendingUp, AlertCircle, PlayCircle } from 'lucide-react';

const StatCard = ({ title, value, label, icon: Icon, color }) => (
    <div className="stat-card glass" style={{ '--card-accent': color }}>
        <div className="stat-icon-wrapper">
            <Icon size={24} className="stat-icon" />
        </div>
        <div className="stat-info">
            <span className="stat-value">{value}</span>
            <h3 className="stat-title">{title}</h3>
            <p className="stat-label">{label}</p>
        </div>
    </div>
);

const recentActivity = [
    { id: 1, title: 'React Hooks Mastery', type: 'Flashcards', progress: 85, color: '#6366f1' },
    { id: 2, title: 'Advanced CSS Animation', type: 'Quiz', progress: 45, color: '#ec4899' },
    { id: 3, title: 'Node.js Architecture', type: 'Exam', progress: 12, color: '#10b981' },
];

const Dashboard = () => {
    return (
        <div className="dashboard page-container animate-fade-in">
            <header className="page-header">
                <h1 className="gradient-text">Welcome back, User</h1>
                <p>Your learning journey continues here.</p>
            </header>

            <div className="stats-grid">
                <StatCard
                    title="Total Flashcards"
                    value="1,248"
                    label="+24 this week"
                    icon={Layers}
                    color="#8b5cf6"
                />
                <StatCard
                    title="Questions Answered"
                    value="856"
                    label="92% accuracy"
                    icon={CheckCircle}
                    color="#10b981"
                />
                <StatCard
                    title="Current Streak"
                    value="12 Days"
                    label="Keep it up!"
                    icon={TrendingUp}
                    color="#f59e0b"
                />
                <StatCard
                    title="Pending Reviews"
                    value="45"
                    label="Due today"
                    icon={AlertCircle}
                    color="#ef4444"
                />
            </div>

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
