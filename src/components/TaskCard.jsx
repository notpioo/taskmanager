import React, { useState } from 'react';
import { Download, Trash2, Calendar, BookOpen, User, FileText, Lock, Eye, X } from 'lucide-react';
import { formatDate, formatFileSize, getFileIcon } from '../utils/formatters';
import { api } from '../utils/api';

const TaskCard = ({ task, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleDownload = async (inputPassword = null) => {
    if (task.isPrivate && !inputPassword) {
      setShowPasswordModal(true);
      return;
    }

    setIsDownloading(true);
    setPasswordError('');
    
    try {
      await api.downloadTugas(task.id, task.filename, inputPassword);
      if (task.isPrivate) {
        setShowPasswordModal(false);
        setPassword('');
      }
    } catch (error) {
      console.error('Download error:', error);
      if (task.isPrivate && error.message.includes('Password')) {
        setPasswordError('Password salah. Silakan coba lagi.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      handleDownload(password);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.deleteTugas(task.id);
      onDelete(task.id);
    } catch (error) {
      console.error('Delete error:', error);
      // You could add a toast notification here
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="card hover:scale-[1.02] transition-transform duration-200 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="text-2xl ml-3">
          {getFileIcon(task.contentType)}
        </div>
      </div>

      {/* Meta Information */}
      <div className="space-y-2 mb-4">
        {/* Uploader */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <User size={16} />
          <span>Oleh: {task.uploaderName}</span>
        </div>

        {task.subject && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <BookOpen size={16} />
            <span>{task.subject}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <FileText size={16} />
          <span>{task.filename}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar size={16} />
          <span>Diupload: {formatDate(task.uploadDate)}</span>
        </div>

        {/* Privacy Status */}
        <div className={`flex items-center space-x-2 text-sm ${
          task.isPrivate ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
        }`}>
          {task.isPrivate ? <Lock size={16} /> : <Eye size={16} />}
          <span>{task.isPrivate ? 'Tugas Privat' : 'Tugas Publik'}</span>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Ukuran: {formatFileSize(task.size)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-border">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center space-x-2 btn-primary px-4 py-2 text-sm"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Download</span>
            </>
          )}
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          {isDeleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
              <span className="text-sm">Deleting...</span>
            </>
          ) : (
            <>
              <Trash2 size={16} />
              <span className="text-sm">Hapus</span>
            </>
          )}
        </button>
      </div>

      {/* Privacy Badge */}
      <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
        task.isPrivate
          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      }`}>
        {task.isPrivate ? 'Privat' : 'Publik'}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-surface rounded-lg p-6 w-full max-w-md animate-bounce-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Lock className="text-red-500" size={20} />
                <span>Password Diperlukan</span>
              </h3>
              <button
                onClick={closePasswordModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Tugas ini bersifat privat. Masukkan password untuk mendownload:
            </p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Masukkan password..."
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="flex-1 btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!password.trim() || isDownloading}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;