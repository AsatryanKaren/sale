import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Result } from 'antd';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  override state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('SaleRadar render failure', error, info);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle="The page hit an unexpected error. Try reloading SaleRadar."
          extra={
            <Button
              type="primary"
              onClick={() => {
                window.location.assign('/discover');
              }}
            >
              Reload
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}
