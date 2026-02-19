import React, { useMemo, useState } from 'react';
import { Search, RotateCcw, Layers } from 'lucide-react';
import './Flashcards.css';
import { loadQuestionBank } from '../data/questionBank';

const resolveCorrectAnswer = (question) => {
    if (question.type === 'multiple_choice') {
        if (typeof question.correctOptionText === 'string' && question.correctOptionText.trim()) {
            return question.correctOptionText.trim();
        }

        if (
            Array.isArray(question.options)
            && Number.isInteger(question.correctOptionIndex)
            && question.options[question.correctOptionIndex]
        ) {
            return String(question.options[question.correctOptionIndex]).trim();
        }

        if (typeof question.correctAnswer === 'string' && question.correctAnswer.trim()) {
            return question.correctAnswer.trim();
        }
    }

    if (typeof question.answer === 'string' && question.answer.trim()) {
        return question.answer.trim();
    }

    if (typeof question.correctAnswer === 'string' && question.correctAnswer.trim()) {
        return question.correctAnswer.trim();
    }

    return 'No answer provided yet.';
};

const Flashcards = () => {
    const initialBank = useMemo(() => loadQuestionBank(), []);
    const [questionSets] = useState(initialBank.sets);
    const [questions] = useState(initialBank.questions);
    const [selectedSet, setSelectedSet] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [revealedById, setRevealedById] = useState({});

    const getSetName = (setId) => questionSets.find((set) => set.id === setId)?.name || 'Uncategorized';

    const lowerSearch = searchTerm.trim().toLowerCase();
    const selectedSetId = selectedSet === 'all' ? 'all' : Number(selectedSet);

    const filteredCards = questions.filter((question) => {
        const matchesSet = selectedSetId === 'all' || question.setId === selectedSetId;
        const matchesSearch = !lowerSearch
            || question.prompt.toLowerCase().includes(lowerSearch)
            || resolveCorrectAnswer(question).toLowerCase().includes(lowerSearch)
            || getSetName(question.setId).toLowerCase().includes(lowerSearch);

        return matchesSet && matchesSearch;
    });

    const toggleReveal = (questionId) => {
        setRevealedById((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
    };

    const hideAllAnswers = () => {
        setRevealedById({});
    };

    return (
        <div className="flashcards-page page-container animate-fade-in">
            <header className="page-header">
                <div className="header-content">
                    <div>
                        <h1 className="gradient-text">Flashcards</h1>
                        <p>Flip each card to see only the correct answer.</p>
                    </div>
                    <button className="secondary-btn" type="button" onClick={hideAllAnswers}>
                        <RotateCcw size={18} />
                        <span>Hide All Answers</span>
                    </button>
                </div>

                <div className="controls-bar glass">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search flashcards..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    <div className="set-filter">
                        <Layers size={16} />
                        <select value={selectedSet} onChange={(event) => setSelectedSet(event.target.value)}>
                            <option value="all">All Question Sets</option>
                            {questionSets.map((set) => (
                                <option key={set.id} value={set.id}>
                                    {set.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            <section className="cards-grid">
                {filteredCards.map((question) => {
                    const revealed = Boolean(revealedById[question.id]);
                    const answerText = resolveCorrectAnswer(question);

                    return (
                        <article key={question.id} className={`flashcard glass ${revealed ? 'revealed' : ''}`}>
                            <div className="card-meta">
                                <span className="set-pill">{getSetName(question.setId)}</span>
                                <span className="difficulty-pill">{question.difficulty || 'Unrated'}</span>
                            </div>

                            {!revealed ? (
                                <div className="card-front">
                                    <h3>Question</h3>
                                    <p>{question.prompt}</p>
                                </div>
                            ) : (
                                <div className="card-back">
                                    <h3>Correct Answer</h3>
                                    <p>{answerText}</p>
                                </div>
                            )}

                            <button
                                className="toggle-answer-btn"
                                type="button"
                                onClick={() => toggleReveal(question.id)}
                            >
                                {revealed ? 'Hide Answer' : 'Show Correct Answer'}
                            </button>
                        </article>
                    );
                })}
            </section>

            {filteredCards.length === 0 && (
                <div className="glass empty-state">
                    <p>No flashcards match your current filter.</p>
                </div>
            )}
        </div>
    );
};

export default Flashcards;
