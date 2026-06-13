import logo from '../../assets/logo.png';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "The Broadoak Schools" }: LoadingSpinnerProps) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <img 
          src={logo} 
          alt="The Broadoak Schools Logo" 
          className="loading-logo pulse-animation"
        />
        <div className="loading-text">{message}</div>
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};