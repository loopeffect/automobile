import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-4xl">⚠️</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-sm">
            An unexpected error occurred. Please refresh the page or go back to the homepage.
          </p>
          {this.props.showDetails && this.state.error && (
            <pre className="mt-3 text-xs text-red-500 bg-red-50 rounded-xl p-3 text-left max-w-lg overflow-auto">
              {this.state.error.message}
            </pre>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            Refresh Page
          </button>
          <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
            Go Home
          </a>
        </div>
      </div>
    );
  }
}
