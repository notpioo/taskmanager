import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import UploadForm from './components/UploadForm';
import TaskList from './components/TaskList';
import Gallery from './components/Gallery';
import Profile from './components/Profile';

function App() {
  const [currentView, setCurrentView] = useState('profile'); // Start with profile for login
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = (category) => {
    // Trigger refresh of appropriate list
    setRefreshTrigger(prev => prev + 1);
    // Switch to appropriate view based on upload category
    setCurrentView(category === 'galeri' ? 'galeri' : 'list');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'upload':
        return <UploadForm onUploadSuccess={handleUploadSuccess} />;
      case 'list':
        return <TaskList refreshTrigger={refreshTrigger} />;
      case 'galeri':
        return <Gallery key={refreshTrigger} />;
      case 'profile':
        return <Profile />;
      default:
        return <Profile />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p className="text-sm">
                © 2025 Tugas Manager. Built with React & MongoDB.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;