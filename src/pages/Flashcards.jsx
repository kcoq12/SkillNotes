import React, { useMemo, useState } from 'react';
import './Flashcards.css';
import { Plus, Search, MoreHorizontal, Play, Edit3 } from 'lucide-react';
import { flashcardDecks, getRecentDecks } from '../data/studyData';

const FlashcardDeck = ({ title, count, category, color, progress }) => {
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
                        style={{ width: `${progress}%`, backgroundColor: color }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

const Flashcards = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const decks = useMemo(() => {
        const lowerSearch = searchTerm.trim().toLowerCase();
        const tabFiltered = (() => {
            if (activeTab === 'favorites') {
                return flashcardDecks.filter((deck) => deck.favorite);
            }

            if (activeTab === 'recent') {
                return getRecentDecks();
            }

            return flashcardDecks;
        })();

        if (!lowerSearch) {
            return tabFiltered;
        }

        return tabFiltered.filter((deck) =>
            `${deck.title} ${deck.category}`.toLowerCase().includes(lowerSearch));
    }, [activeTab, searchTerm]);

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
                        <input
                            type="text"
                            placeholder="Search decks..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
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
