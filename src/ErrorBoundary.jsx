import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[9999] min-h-screen bg-red-50 flex flex-col items-center justify-center p-8 text-red-900 font-mono overflow-auto">
                    <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-2xl border-4 border-red-200">
                        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-red-600">
                            <span>💥</span>
                            Application Runtime Error
                        </h1>

                        <div className="bg-red-50 border border-red-100 p-6 rounded-xl mb-6 overflow-auto max-h-[60vh]">
                            <h2 className="font-bold text-xl mb-4 border-b border-red-200 pb-2">Error Message:</h2>
                            <p className="font-bold text-lg text-red-800 mb-6 bg-white p-4 rounded border border-red-100">
                                {this.state.error && this.state.error.toString()}
                            </p>

                            <h2 className="font-bold text-lg mb-2">Stack Trace:</h2>
                            <pre className="text-xs bg-zinc-900 text-green-400 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.href = '/';
                                }}
                                className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-500/20"
                            >
                                🔄 Clear Cache & Restart
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-white text-red-600 border-2 border-red-100 px-8 py-4 rounded-xl font-bold hover:bg-red-50 transition"
                            >
                                Simple Reload
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
