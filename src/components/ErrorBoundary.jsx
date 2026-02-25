import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '4rem 2rem',
                    color: '#f8fafc',
                    background: '#050811',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Inter, sans-serif',
                    textAlign: 'center'
                }}>
                    <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Something went wrong.</h1>
                    <p style={{ color: '#94a3b8', maxWidth: '600px', marginBottom: '2rem' }}>
                        The neural link encountered an unexpected anomaly.
                        Please review the diagnostics below or refresh the mission.
                    </p>
                    <details className="glass" style={{
                        whiteSpace: 'pre-wrap',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        maxWidth: '800px',
                        width: '100%',
                        textAlign: 'left',
                        marginBottom: '2rem',
                        fontSize: '0.9rem',
                        color: '#fca5a5'
                    }}>
                        <summary style={{ cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 'bold', color: '#ef4444' }}>Diagnostic Report</summary>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '1rem 2rem',
                            borderRadius: '14px',
                            background: '#6366f1',
                            color: 'white',
                            fontWeight: '700',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                        }}
                    >
                        Re-initialize System
                    </button>
                </div >
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
