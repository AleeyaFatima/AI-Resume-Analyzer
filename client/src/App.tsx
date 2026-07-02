import React from 'react';
import { AnalysisProvider } from './context/AnalysisContext';
import DashboardLayout from './components/dashboard/DashboardLayout';

export const App: React.FC = () => {
  return (
    <AnalysisProvider>
      <DashboardLayout />
    </AnalysisProvider>
  );
};

export default App;
