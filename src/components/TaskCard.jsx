import React, { useState } from 'react';
import { Download, Trash2, Calendar, BookOpen, User, FileText, Eye } from 'lucide-react';
import { formatDate, formatFileSize, getFileIcon } from '../utils/formatters';
import { api } from '../utils/api';
import FilePreviewModal from './FilePreviewModal';

const TaskCard = ({ task, onDelete }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = () => {
    window.open(`/api/files/download/${task.id}`, '_blank');
  };

  const handleDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus "${task.title}"?`)) return;

    try {
      await api.deleteFile(task.id);
      if (onDelete) onDelete(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Gagal menghapus tugas');
    }
  };

  const FileIcon = getFileIcon(task.contentType);

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-200 dark:border-dark-border p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
            <FileIcon className="text-accent" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2">
              {task.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {task.filename}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* Metadata */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <User size={16} className="mr-2 flex-shrink-0" />
          <span className="truncate">{task.uploaderName}</span>
        </div>
        
        {task.subject && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <BookOpen size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{task.subject}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar size={16} className="mr-2 flex-shrink-0" />
          <span>{formatDate(task.uploadDate)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <FileText size={16} className="mr-2 flex-shrink-0" />
          <span>{formatFileSize(task.size)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setShowPreview(true)}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          <Eye size={16} />
          <span>Preview</span>
        </button>
        
        <button
          onClick={handleDownload}
          className="flex items-center justify-center bg-accent hover:bg-accent-hover text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          <Download size={16} />
        </button>
        
        <button
          onClick={handleDelete}
          className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          <Trash2 size={16} />
        </button>
      </div>

const TaskCard = ({ task, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Update to use new download endpoint
      window.open(`/api/files/download/${task.id}`, '_blank');
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Update to use new delete endpoint
      await api.deleteFile(task.id);
      onDelete(task.id);
    } catch (error) {
      console.error('Delete error:', error);
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

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Ukuran: {formatFileSize(task.size)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-border">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200"
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
          
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center space-x-2 bg-accent hover:bg-accent-hover text-white px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            <span>{isDownloading ? 'Download' : 'Download'}</span>
          </button>
        </div>
        
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={16} />
          <span>{isDeleting ? 'Hapus' : 'Hapus'}</span>
        </button>
      </div>

      {/* Preview Modal */}
      <FilePreviewModal
        file={task}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default TaskCard;