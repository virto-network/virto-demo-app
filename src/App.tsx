import { useState } from 'react';
import type { User } from '@/types/auth.types';

// Declare custom virto elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'virto-connect': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        server?: string;
        'provider-url'?: string;
        style?: React.CSSProperties;
      };
      'virto-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        label?: string;
        variant?: string;
        disabled?: boolean;
        loading?: boolean;
        onClick?: (event: React.MouseEvent<HTMLElement>) => void;
      };
      'virto-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        type?: string;
        placeholder?: string;
        value?: string;
        disabled?: boolean;
        label?: string;
        onInput?: (event: any) => void;
      };
    }
  }
}
import HeroSection from '@/components/sections/HeroSection';
import TabNavigation from '@/components/TabNavigation';
import CompetitiveSection from '@/components/sections/CompetitiveSection';
import DevelopersSection from '@/components/sections/DevelopersSection';
import FooterSection from '@/components/sections/FooterSection';
import DemoTab from '@/components/sections/DemoTab';
import DeveloperTab from '@/components/sections/DeveloperTab';
import TransactionAlertContainer from '@/components/TransactionAlertContainer';
import { useTransactionListener } from '@/hooks/useTransactionListener';
import './App.css';



function App() {
  const [activeTab, setActiveTab] = useState('demo');
  
  // Initialize transaction listener
  useTransactionListener();
  
  const handleAuthSuccess = (user: User) => {
    console.log('Authentication successful:', user);
  };

  const handleAuthError = (error: string) => {
    console.error('Authentication error:', error);
  };

  return (
    <div className="app">
        <div className="container">
        <HeroSection
          onDemoClick={() => { 
            setActiveTab('demo');
            const connectButton = document.getElementById('connect-button');
            if (connectButton) {
              connectButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          onDeveloperClick={() => {
            window.open('https://ailens-organization.gitbook.io/virto-connect', '_blank');
          }}
        />

        <div className="content-section" id="content-section">
          <TabNavigation activeTab={activeTab as 'demo' | 'developer'} onTabChange={(tab) => setActiveTab(tab)} />

          {activeTab === 'demo' && (
            <DemoTab onAuthSuccess={handleAuthSuccess} onAuthError={handleAuthError} />
          )}

          {activeTab === 'developer' && (
            <DeveloperTab />
          )}
        </div>

        <CompetitiveSection />

        <DevelopersSection />

        <FooterSection />

        {/* @ts-ignore */}
        <virto-connect
          id="previewVirtoConnect"
          server="https://demo.virto.one/api"
          provider-url="wss://testnet.kreivo.kippu.rocks"
          style={{ display: 'none' }}
        />

        <TransactionAlertContainer />
      </div>
    </div>
  );
}

export default App; 