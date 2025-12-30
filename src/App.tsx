import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { PeekingPage } from './components/PeekingPage';
import { GuardrailsPage } from './components/GuardrailsPage';
import { ImbalancedFlightsPage } from './components/ImbalancedFlightsPage';
import { CUPEDPage } from './components/CUPEDPage';
import { FeedbackPage } from './components/FeedbackPage';
import { Navigation } from './components/Navigation';
import { FWERPage } from './components/FWERPage';
import NHSTPage from './components/NHSTPage';
import { Breadcrumb } from './components/Breadcrumb';
import { BottomNavigation } from './components/BottomNavigation';
import { GlossaryPage } from './components/GlossaryPage';

type PageMode =
  | 'nhst'
  | 'landing'
  | 'peeking'
  | 'guardrails'
  | 'imbalanced'
  | 'cuped'
  | 'fwer'
  | 'feedback'
  | 'glossary';

function App() {
  const [currentPage, setCurrentPage] = useState<PageMode>('landing');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageMode);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'nhst':
        return <NHSTPage />;
      case 'landing':
        return (
          <LandingPage
            onGetStarted={(mode) => {
              setCurrentPage(mode as PageMode);
            }}
          />
        );
      case 'peeking':
        return <PeekingPage />;
      case 'guardrails':
        return <GuardrailsPage />;
      case 'imbalanced':
        return <ImbalancedFlightsPage />;
      case 'cuped':
        return <CUPEDPage />;
      case 'fwer':
        return <FWERPage />;
      case 'feedback':
        return <FeedbackPage />;
      case 'glossary':
        return <GlossaryPage />;
      default:
        return <NHSTPage />;
    }
  };

  return (
    <>
      {currentPage !== 'landing' && (
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      <Breadcrumb currentPage={currentPage} />
      <div className="pb-16 lg:pb-0">
        {renderPage()}
      </div>
      <BottomNavigation currentPage={currentPage} onNavigate={handleNavigate} />
    </>
  );
}

export default App;