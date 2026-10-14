import { ErrorBoundary, getErrorMessage } from "react-error-boundary";

const ErrorFallback = ({ error }) => {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>Please make a bug report.</p>
      <pre style={{ color: "red" }}>{getErrorMessage(error)}</pre>
    </div>
  );
};

export default ErrorFallback;
