// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRefresh = (): void => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-6">
              We've encountered an unexpected error. Please try refreshing the page or return to the home page.
            </p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={this.handleRefresh}
                className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md"
              >
                Refresh Page
              </button>
              <Link to="/" className="block text-teal-600 hover:text-teal-800">
                Return to Home
              </Link>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-gray-100 rounded-md overflow-auto">
                <h2 className="text-lg font-semibold mb-2">Error Details</h2>
                <p className="text-red-600 mb-2">{this.state.error?.toString()}</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {this.state.errorInfo?.componentStack}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;