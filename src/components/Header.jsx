import React from 'react';
import { Moon, Sun, Upload, List, Image, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ currentView, setCurrentView }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent-hover rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
              Tugas Manager
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('upload')}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                currentView === 'upload'
                  ? 'bg-accent text-white'
                  : !isAuthenticated
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'nav-link'
              }`}
            >
              <Upload size={18} />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setCurrentView('list')}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                currentView === 'list'
                  ? 'bg-accent text-white'
                  : !isAuthenticated
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'nav-link'
              }`}
            >
              <List size={18} />
              <span>Daftar Tugas</span>
            </button>
            <button
              onClick={() => setCurrentView('galeri')}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                currentView === 'galeri'
                  ? 'bg-accent text-white'
                  : !isAuthenticated
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'nav-link'
              }`}
            >
              <Image size={18} />
              <span>Galeri</span>
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                currentView === 'profile'
                  ? 'bg-accent text-white'
                  : 'nav-link'
              }`}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
          </nav>

          {/* User Info */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Halo, <span className="font-semibold text-accent">{user.name}</span>
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-dark-surface dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => setCurrentView('upload')}
              disabled={!isAuthenticated}
              className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                currentView === 'upload'
                  ? 'bg-accent text-white'
                  : !isAuthenticated
                  ? 'bg-gray-100 dark:bg-dark-surface text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300'
              }`}
            >
              <Upload size={16} />
              <span className="text-sm">Upload</span>
            </button>
            <button
              onClick={() => setCurrentView('list')}
              disabled={!isAuthenticated}
              className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                currentView === 'list'
                  ? 'bg-accent text-white'
                  : !isAuthenticated
                  ? 'bg-gray-100 dark:bg-dark-surface text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300'
              }`}
            >
              <List size={16} />
              <span className="text-sm">Tugas</span>
            </button>
            <button
              onClick={() => setCurrentView('galeri')}
              disabled={!isAuthenticated}
              className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                currentView === 'galeri'
                  ? 'bg-accent text-white'
                  : !isAuthenticated
                  ? 'bg-gray-100 dark:bg-dark-surface text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300'
              }`}
            >
              <Image size={16} />
              <span className="text-sm">Galeri</span>
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                currentView === 'profile'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300'
              }`}
            >
              <User size={16} />
              <span className="text-sm">Profile</span>
            </button>
          </div>
          {isAuthenticated && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Halo, <span className="font-semibold text-accent">{user.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;