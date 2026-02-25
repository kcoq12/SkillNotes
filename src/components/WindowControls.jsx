import React from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';
import './WindowControls.css';

const WindowControls = () => {
    const handleMinimize = () => window.electronAPI.minimize();
    const handleMaximize = () => window.electronAPI.maximize();
    const handleClose = () => window.electronAPI.close();

    return (
        <div className="window-controls">
            <button
                type="button"
                className="control-btn minimize"
                onClick={handleMinimize}
                title="Minimize"
            >
                <Minus size={14} />
            </button>
            <button
                type="button"
                className="control-btn maximize"
                onClick={handleMaximize}
                title="Maximize"
            >
                <Square size={12} />
            </button>
            <button
                type="button"
                className="control-btn close"
                onClick={handleClose}
                title="Close"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default WindowControls;
