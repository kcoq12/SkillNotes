import React, { useState } from 'react';
import './Flashcards.css';
import { Plus, Search, MoreHorizontal, Play, Edit3, Trash2 } from 'lucide-react';

const FlashcardDeck = ({ title, count, category, color }) => {
    return (
        <div className="deck-card glass">
            <div className="deck-header">
                <span className="deck-category" style={{ backgroundColor: `${color}20`, color: color }}>
                    {category}
                </span>
                <button className="icon-btn">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="deck-content">
                <h3>{title}</h3>
                <p>{count} cards</p>
            </div>

            <div className="deck-actions">
                <button className="action-btn play" style={{ '--btn-color': color }}>
                    <Play size={18} />
                    Study
                </button>
                <button className="action-btn edit">
                    <Edit3 size={18} />
                </button>
            </div>

            <div className="deck-progress">
                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{ width: `${Math.random() * 100}%`, backgroundColor: color }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

const Flashcards = () => {
    const [activeTab, setActiveTab] = useState('all');

    const decks = [
        { id: 1, title: 'Javascript Basics', count: 24, category: 'Code', color: '#f59e0b' },
        { id: 2, title: 'React Hooks', count: 12, category: 'Frontend', color: '#6366f1' },
        { id: 3, title: 'CSS Grid & Flexbox', count: 18, category: 'Design', color: '#ec4899' },
        { id: 4, title: 'Node.js Backend', count: 32, category: 'Backend', color: '#10b981' },
        { id: 5, title: 'System Design', count: 15, category: 'Architecture', color: '#3b82f6' },
        { id: 6, title: 'SQL Queries', count: 40, category: 'Database', color: '#8b5cf6' },
    ];

    return (
        <div className="flashcards-page page-container animate-fade-in">
            <header className="page-header">
                <div className="header-content">
                    <div>
                        <h1 className="gradient-text">Flashcards</h1>
                        <p>Master your knowledge with spaced repetition.</p>
                    </div>
                    <button className="primary-btn">
                        <Plus size={20} />
                        <span>New Deck</span>
                    </button>
                </div>

                <div className="controls-bar glass">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search decks..." />
                    </div>

                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Decks
                        </button>
                        <button
                            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
                            onClick={() => setActiveTab('favorites')}
                        >
                            Favorites
                        </button>
                        <button
                            className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
                            onClick={() => setActiveTab('recent')}
                        >
                            Recently Studied
                        </button>
                    </div>
                </div>
            </header>

            <div className="decks-grid">
                {decks.map((deck) => (
                    <FlashcardDeck key={deck.id} {...deck} />
                ))}

                {/* Add New Deck Card */}
                <div className="deck-card add-new glass dashed">
                    <div className="add-content">
                        <div className="add-icon">
                            <Plus size={32} />
                        </div>
                        <h3>Create New Deck</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flashcards;
