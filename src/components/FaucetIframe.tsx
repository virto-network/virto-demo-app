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
    <div style={{
      margin: 0,
      padding: '1.5rem',
      fontFamily: "'Outfit', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
      textAlign: 'center',
      boxSizing: 'border-box',
      background: 'white',
      flex: 1
    }}>
      <h3 style={{
        color: '#333',
        margin: '0 0 1rem 0',
        fontSize: 'clamp(1.25rem, 4vw, 1.5rem)'
      }}>
        Welcome Bonus!
      </h3>
      
      <p style={{
        color: '#666',
        margin: '0 0 1.5rem 0',
        lineHeight: 1.5,
        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
        maxWidth: '100%'
      }}>
        Congratulations! You can receive free tokens to start using the platform and a membership to avoid paying transaction fees.
      </p>
      
      <div style={{
        color: '#22c55e',
        fontSize: 'clamp(1.5rem, 6vw, 2rem)',
        fontWeight: 'bold',
        margin: '0 0 1.5rem 0'
      }}>
        100 PAS
      </div>
      
      <p style={{
        fontWeight: 500,
        margin: '0 0 1rem 0',
        color: '#666',
        fontSize: 'clamp(0.875rem, 3vw, 1rem)'
      }}>
        Would you like to accept this welcome bonus?
      </p>

      {error && (
        <div style={{
          color: '#dc2626',
          margin: '1rem 0',
          padding: '0.5rem',
          background: '#fee2e2',
          borderRadius: '4px',
          fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
          animation: 'shake 0.5s ease-in-out',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginTop: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%'
      }}>
        <button
          onClick={handleDecline}
          disabled={isLoading}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            borderRadius: '6px',
            fontFamily: 'inherit',
            fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            background: '#f3f4f6',
            color: '#374151',
            opacity: isLoading ? 0.7 : 1,
            minWidth: '100px',
            flex: '0 1 auto'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = '#f3f4f6';
            }
          }}
        >
          No, Thanks
        </button>
        
        <button
          onClick={handleAccept}
          disabled={isLoading || success}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            borderRadius: '6px',
            fontFamily: 'inherit',
            fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
            cursor: isLoading || success ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            background: success ? '#059669' : '#22c55e',
            color: 'white',
            opacity: isLoading ? 0.7 : 1,
            minWidth: '120px',
            flex: '0 1 auto'
          }}
          onMouseEnter={(e) => {
            if (!isLoading && !success) {
              e.currentTarget.style.background = '#16a34a';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && !success) {
              e.currentTarget.style.background = '#22c55e';
            }
          }}
        >
          {success ? 'Success!' : isLoading ? 'Processing...' : 'Yes, Accept $100'}
        </button>
      </div>

      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
        `}
      </style>
    </div>
  );
};

export default FaucetIframe; 