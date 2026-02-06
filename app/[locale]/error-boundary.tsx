'use client';

import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Actualizar el estado para que el siguiente render muestre la UI alternativa
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Puedes registrar el error en un servicio de informes de errores
    console.error('Error capturado por boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.error) {
      const FallbackComponent = this.props.fallback;
      return (
        <FallbackComponent
          error={this.state.error}
          reset={() => this.setState({ error: null })}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;