import React, { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Check, X, Layers } from 'lucide-react';
import './Questions.css';

const initialSets = [
    { id: 1, name: 'React Basics', description: 'Core React concepts and hooks' },
    { id: 2, name: 'JavaScript Logic', description: 'Functions, scopes, and async thinking' },
];

const initialQuestions = [
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

const newQuestionTemplate = {
    setId: 1,
    prompt: '',
    answer: '',
    difficulty: 'Easy',
};

const Questions = () => {
    const [questionSets, setQuestionSets] = useState(initialSets);
    const [questions, setQuestions] = useState(initialQuestions);
    const [selectedSet, setSelectedSet] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [newSetName, setNewSetName] = useState('');
    const [newSetDescription, setNewSetDescription] = useState('');
    const [newQuestion, setNewQuestion] = useState(newQuestionTemplate);

    const [editingId, setEditingId] = useState(null);
    const [editDraft, setEditDraft] = useState(newQuestionTemplate);

    const selectedSetId = selectedSet === 'all' ? 'all' : Number(selectedSet);

    const filteredQuestions = useMemo(() => {
        const lowerSearch = searchTerm.trim().toLowerCase();

        return questions.filter((question) => {
            const matchesSet = selectedSetId === 'all' || question.setId === selectedSetId;
            const matchesSearch = !lowerSearch
                || question.prompt.toLowerCase().includes(lowerSearch)
                || question.answer.toLowerCase().includes(lowerSearch);

            return matchesSet && matchesSearch;
        });
    }, [questions, searchTerm, selectedSetId]);

    const getSetName = (setId) => questionSets.find((set) => set.id === setId)?.name || 'Uncategorized';

    const handleCreateSet = (event) => {
        event.preventDefault();
        const name = newSetName.trim();
        const description = newSetDescription.trim();

        if (!name) {
            return;
        }

        const nextId = questionSets.length ? Math.max(...questionSets.map((set) => set.id)) + 1 : 1;
        const createdSet = {
            id: nextId,
            name,
            description: description || 'No description yet',
        };

        setQuestionSets((prev) => [...prev, createdSet]);
        setNewSetName('');
        setNewSetDescription('');
        setNewQuestion((prev) => ({ ...prev, setId: createdSet.id }));
    };

    const handleAddQuestion = (event) => {
        event.preventDefault();
        const prompt = newQuestion.prompt.trim();
        const answer = newQuestion.answer.trim();

        if (!prompt || !answer || !newQuestion.setId) {
            return;
        }

        const nextId = questions.length ? Math.max(...questions.map((question) => question.id)) + 1 : 1;
        setQuestions((prev) => [
            ...prev,
            {
                id: nextId,
                setId: Number(newQuestion.setId),
                prompt,
                answer,
                difficulty: newQuestion.difficulty,
            },
        ]);

        setNewQuestion((prev) => ({
            ...prev,
            prompt: '',
            answer: '',
        }));
    };

    const handleDeleteQuestion = (id) => {
        setQuestions((prev) => prev.filter((question) => question.id !== id));

        if (editingId === id) {
            setEditingId(null);
        }
    };

    const handleStartEdit = (question) => {
        setEditingId(question.id);
        setEditDraft({
            setId: question.setId,
            prompt: question.prompt,
            answer: question.answer,
            difficulty: question.difficulty,
        });
    };

    const handleSaveEdit = (questionId) => {
        const prompt = editDraft.prompt.trim();
        const answer = editDraft.answer.trim();

        if (!prompt || !answer || !editDraft.setId) {
            return;
        }

        setQuestions((prev) =>
            prev.map((question) =>
                question.id === questionId
                    ? {
                        ...question,
                        setId: Number(editDraft.setId),
                        prompt,
                        answer,
                        difficulty: editDraft.difficulty,
                    }
                    : question));

        setEditingId(null);
    };

    return (
        <div className="questions-page page-container animate-fade-in">
            <header className="page-header">
                <h1 className="gradient-text">Questions</h1>
                <p>Add, edit, delete questions, and organize them into sets.</p>
            </header>

            <section className="section-container questions-grid-top">
                <article className="glass panel-card">
                    <div className="panel-header">
                        <h2>Create Question Set</h2>
                    </div>
                    <form className="stacked-form" onSubmit={handleCreateSet}>
                        <input
                            type="text"
                            placeholder="Set name (e.g., Biology Midterm)"
                            value={newSetName}
                            onChange={(event) => setNewSetName(event.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Short description"
                            value={newSetDescription}
                            onChange={(event) => setNewSetDescription(event.target.value)}
                        />
                        <button className="primary-btn" type="submit">
                            <Plus size={18} />
                            <span>Create Set</span>
                        </button>
                    </form>
                </article>

                <article className="glass panel-card">
                    <div className="panel-header">
                        <h2>Question Sets</h2>
                        <span className="count-chip">{questionSets.length}</span>
                    </div>
                    <div className="sets-list">
                        {questionSets.map((set) => (
                            <div className="set-item" key={set.id}>
                                <div>
                                    <h3>{set.name}</h3>
                                    <p>{set.description}</p>
                                </div>
                                <span className="set-questions-count">
                                    {questions.filter((question) => question.setId === set.id).length} questions
                                </span>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            <section className="section-container glass panel-card">
                <div className="panel-header">
                    <h2>Add Question</h2>
                </div>

                <form className="question-form" onSubmit={handleAddQuestion}>
                    <div className="row-fields">
                        <label>
                            Set
                            <select
                                value={newQuestion.setId}
                                onChange={(event) =>
                                    setNewQuestion((prev) => ({ ...prev, setId: Number(event.target.value) }))}
                            >
                                {questionSets.map((set) => (
                                    <option key={set.id} value={set.id}>
                                        {set.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Difficulty
                            <select
                                value={newQuestion.difficulty}
                                onChange={(event) =>
                                    setNewQuestion((prev) => ({ ...prev, difficulty: event.target.value }))}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </label>
                    </div>

                    <label>
                        Question
                        <textarea
                            rows={2}
                            placeholder="Write the question prompt..."
                            value={newQuestion.prompt}
                            onChange={(event) =>
                                setNewQuestion((prev) => ({ ...prev, prompt: event.target.value }))}
                        />
                    </label>

                    <label>
                        Answer
                        <textarea
                            rows={3}
                            placeholder="Write the answer..."
                            value={newQuestion.answer}
                            onChange={(event) =>
                                setNewQuestion((prev) => ({ ...prev, answer: event.target.value }))}
                        />
                    </label>

                    <button className="primary-btn" type="submit">
                        <Plus size={18} />
                        <span>Add Question</span>
                    </button>
                </form>
            </section>

            <section className="section-container">
                <div className="questions-controls glass">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    <div className="filter-select">
                        <Layers size={18} />
                        <select value={selectedSet} onChange={(event) => setSelectedSet(event.target.value)}>
                            <option value="all">All Sets</option>
                            {questionSets.map((set) => (
                                <option key={set.id} value={set.id}>
                                    {set.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section className="section-container question-list">
                {filteredQuestions.map((question) => {
                    const isEditing = editingId === question.id;

                    return (
                        <article key={question.id} className="glass question-card">
                            {isEditing ? (
                                <div className="edit-area">
                                    <div className="row-fields">
                                        <label>
                                            Set
                                            <select
                                                value={editDraft.setId}
                                                onChange={(event) =>
                                                    setEditDraft((prev) => ({ ...prev, setId: Number(event.target.value) }))}
                                            >
                                                {questionSets.map((set) => (
                                                    <option key={set.id} value={set.id}>
                                                        {set.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            Difficulty
                                            <select
                                                value={editDraft.difficulty}
                                                onChange={(event) =>
                                                    setEditDraft((prev) => ({ ...prev, difficulty: event.target.value }))}
                                            >
                                                <option value="Easy">Easy</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hard">Hard</option>
                                            </select>
                                        </label>
                                    </div>
                                    <label>
                                        Question
                                        <textarea
                                            rows={2}
                                            value={editDraft.prompt}
                                            onChange={(event) =>
                                                setEditDraft((prev) => ({ ...prev, prompt: event.target.value }))}
                                        />
                                    </label>
                                    <label>
                                        Answer
                                        <textarea
                                            rows={3}
                                            value={editDraft.answer}
                                            onChange={(event) =>
                                                setEditDraft((prev) => ({ ...prev, answer: event.target.value }))}
                                        />
                                    </label>
                                    <div className="card-actions">
                                        <button className="action-btn save" onClick={() => handleSaveEdit(question.id)} type="button">
                                            <Check size={16} />
                                            Save
                                        </button>
                                        <button className="action-btn cancel" onClick={() => setEditingId(null)} type="button">
                                            <X size={16} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="question-meta">
                                        <span className="set-badge">{getSetName(question.setId)}</span>
                                        <span className="difficulty-badge">{question.difficulty}</span>
                                    </div>
                                    <h3>{question.prompt}</h3>
                                    <p>{question.answer}</p>
                                    <div className="card-actions">
                                        <button className="action-btn edit" onClick={() => handleStartEdit(question)} type="button">
                                            <Pencil size={16} />
                                            Edit
                                        </button>
                                        <button className="action-btn delete" onClick={() => handleDeleteQuestion(question.id)} type="button">
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </article>
                    );
                })}

                {filteredQuestions.length === 0 && (
                    <div className="glass empty-state">
                        <p>No questions match your current filter.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Questions;
