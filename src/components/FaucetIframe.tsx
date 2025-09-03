import React, { useState, useEffect } from 'react';

interface FaucetIframeProps {
  username: string;
  address: string;
  onAccept: () => Promise<{ success: boolean; error?: string }>;
  onDecline: () => void;
}

const FaucetIframe: React.FC<FaucetIframeProps> = ({
  onAccept,
  onDecline
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Listen for messages from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'faucet-error') {
        setError(event.data.message || 'Failed to process welcome bonus');
        setIsLoading(false);
      } else if (event.data.type === 'faucet-success') {
        setSuccess(true);
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleAccept = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    
    const result = await onAccept();
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to process welcome bonus');
    }
    
    setIsLoading(false);
  };

  const handleDecline = () => {
    if (isLoading) return;
    onDecline();
  };

  return (
    <div className="faucet-container">
      <h3 className="faucet-title">
        Welcome Bonus!
      </h3>
      
      <p className="faucet-description">
        Congratulations! Claim your starter tokens and premium membership.
      </p>
      
      <p className="faucet-benefit-note">
        ✨ Bonus: With membership, transaction fees are waived – verify this after your first transaction
      </p>
      
      <div className="faucet-amount">
        10 PAS
      </div>
      
      <p className="faucet-question">
        Ready to activate your account benefits?
      </p>

      {error && (
        <div className="faucet-error">
          {error}
        </div>
      )}

      <div className="faucet-buttons">
        <button
          onClick={handleDecline}
          disabled={isLoading}
          className="faucet-button faucet-button-decline"
        >
          Maybe Later
        </button>
        
        <button
          onClick={handleAccept}
          disabled={isLoading || success}
          className={`faucet-button faucet-button-accept ${success ? 'success' : ''}`}
        >
          {success ? '✅ Activated!' : isLoading ? 'Processing...' : 'Claim Benefits'}
        </button>
      </div>
    </div>
  );
};

export default FaucetIframe; 