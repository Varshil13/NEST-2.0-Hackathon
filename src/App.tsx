import { useState } from 'react';
import { LandingPage } from './screens/LandingPage';
import { AEIntakeForm } from './screens/AEIntakeForm';
import { CaseCreated } from './screens/CaseCreated';
import { PatientFollowUp } from './screens/PatientFollowUp';
import { HCPFollowUp } from './screens/HCPFollowUp';
import { PVDashboard } from './screens/PVDashboard';

type Screen = 'landing' | 'demo' | 'ae-intake' | 'case-created' | 'patient-followup' | 'hcp-followup' | 'dashboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [screenData, setScreenData] = useState<unknown>(null);

  const navigate = (screen: Screen, data?: unknown) => {
    setCurrentScreen(screen);
    if (data) {
      setScreenData(data);
    }
  };

  const goBack = () => {
    setCurrentScreen('landing');
  };

  if (currentScreen === 'landing') {
    return <LandingPage onNavigate={navigate} />;
  }

  if (currentScreen === 'demo' || currentScreen === 'ae-intake') {
    return <AEIntakeForm onNavigate={navigate} onBack={goBack} />;
  }

  if (currentScreen === 'case-created' && screenData) {
    return <CaseCreated caseData={screenData as any} onNavigate={navigate} />;
  }

  if (currentScreen === 'patient-followup' && screenData) {
    return <PatientFollowUp caseData={screenData as any} onNavigate={navigate} />;
  }

  if (currentScreen === 'hcp-followup') {
    return <HCPFollowUp onNavigate={navigate} />;
  }

  if (currentScreen === 'dashboard') {
    return <PVDashboard onNavigate={navigate} />;
  }

  return <LandingPage onNavigate={navigate} />;
}

export default App;
