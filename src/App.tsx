import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from './components/LandingPage';
import { PeekingPage } from './components/PeekingPage';
import { GuardrailsPage } from './components/GuardrailsPage';
import { ImbalancedFlightsPage } from './components/ImbalancedFlightsPage';
import { CUPEDPage } from './components/CUPEDPage';
import { FeedbackForm } from './components/FeedbackForm';
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
import { NormalisationPage } from './components/NormalisationPage';
import { GAListener } from './components/GAListener';


function App() {
  return (
    <>
      <Navigation />
      <Breadcrumb /> 
      <GAListener /> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/nhst" element={<NHSTPage />} />
        <Route path="/peeking" element={<PeekingPage />} />
        <Route path="/guardrails" element={<GuardrailsPage />} />
        <Route path="/imbalanced" element={<ImbalancedFlightsPage />} />
        <Route path="/cuped" element={<CUPEDPage />} />
        <Route path="/fwer" element={<FWERPage />} />
        <Route path="/winsorizing" element={<WinsorizingPage />} />
        <Route path="/normalisation" element={<NormalisationPage />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/sample-size-calc" element={<SampleSizeCalculator />} />
        <Route path="/test-duration-calc" element={<TestDurationCalculator />} />
        <Route path="/effect-detection-calc" element={<EffectDetectionCalculator />} />
        <Route path="/test-results-calc" element={<TestResultsCalculator />} />
        {/* fallback to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
