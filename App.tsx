
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './components/AppRouter';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-neutral-light font-sans text-neutral-dark">
        <AppRouter />
      </div>
    </AuthProvider>
  );
};

export default App;
