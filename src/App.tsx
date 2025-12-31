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
import { GlossaryPage } from './components/GlossaryPage';
import { SampleSizeCalculator } from './components/SampleSizeCalculator';
import { TestDurationCalculator } from './components/TestDurationCalculator';
import { EffectDetectionCalculator } from './components/EffectDetectionCalculator';
import { TestResultsCalculator } from './components/TestResultsCalculator';
import { WinsorizingPage } from './components/WinsorizingPage';

type PageMode =
  | 'nhst'
  | 'landing'
  | 'peeking'
  | 'guardrails'
  | 'imbalanced'
  | 'cuped'
  | 'fwer'
  | 'winsorizing'
  | 'feedback'
  | 'glossary'
  | 'sample-size-calc'
  | 'test-duration-calc'
  | 'effect-detection-calc'
  | 'test-results-calc';

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
      case 'winsorizing':
        return <WinsorizingPage />;
      case 'feedback':
        return <FeedbackPage />;
      case 'glossary':
        return <GlossaryPage />;
      case 'sample-size-calc':
        return <SampleSizeCalculator onBack={() => setCurrentPage('landing')} />;
      case 'test-duration-calc':
        return <TestDurationCalculator onBack={() => setCurrentPage('landing')} />;
      case 'effect-detection-calc':
        return <EffectDetectionCalculator onBack={() => setCurrentPage('landing')} />;
      case 'test-results-calc':
        return <TestResultsCalculator onBack={() => setCurrentPage('landing')} />;
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
      {renderPage()}
    </>
  );
}

export default App;