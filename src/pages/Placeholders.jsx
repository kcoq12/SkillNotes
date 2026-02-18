import React from 'react';

const PlaceholderPage = ({ title }) => (
    <div className="page-container animate-fade-in">
        <header className="page-header">
            <h1 className="gradient-text">{title}</h1>
            <p>This feature is coming soon.</p>
        </header>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
            <p>We are building something amazing here.</p>
        </div>
    </div>
);

export const Questions = () => <PlaceholderPage title="Questions" />;
export const Exams = () => <PlaceholderPage title="Exams" />;
export const Flashcards = () => <PlaceholderPage title="Flashcards" />;
export const Profiles = () => <PlaceholderPage title="Profiles" />;
export const Settings = () => <PlaceholderPage title="Settings" />;
