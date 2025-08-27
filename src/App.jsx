import React, { useState } from 'react';
import Header from './components/Header';
import UploadForm from './components/UploadForm';
import TaskList from './components/TaskList';

function App() {
  const [currentView, setCurrentView] = useState('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of task list
    setRefreshTrigger(prev => prev + 1);
    // Switch to list view to show the uploaded task
    setCurrentView('list');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'upload' ? (
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        ) : (
          <TaskList refreshTrigger={refreshTrigger} />
        )}
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
  );
}

export default App;