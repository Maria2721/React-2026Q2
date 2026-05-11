import { Component, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Something went wrong
          </h2>
          <button
            onClick={this.handleReset}
            className="px-5 py-2 rounded-xl font-medium text-white transition bg-linear-to-r from-blue-500 to-indigo-500 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.95]"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
