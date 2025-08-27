import React from 'react';
import { X, Download, Eye, FileText, Image, File, Music, Video } from 'lucide-react';

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  if (!isOpen || !file) return null;

  // Get file type icon and determine if it's previewable
  const getFileInfo = (contentType, filename) => {
    const type = contentType?.toLowerCase() || '';
    const extension = filename?.split('.').pop()?.toLowerCase() || '';

    if (type.startsWith('image/')) {
      return { icon: Image, type: 'image', previewable: true };
    }
    if (type === 'application/pdf') {
      return { icon: FileText, type: 'pdf', previewable: true };
    }
    if (type.startsWith('text/') || ['txt', 'md', 'json', 'csv', 'xml', 'html', 'css', 'js'].includes(extension)) {
      return { icon: FileText, type: 'text', previewable: true };
    }
    if (type.startsWith('audio/')) {
      return { icon: Music, type: 'audio', previewable: true };
    }
    if (type.startsWith('video/')) {
      return { icon: Video, type: 'video', previewable: true };
    }
    
    return { icon: File, type: 'other', previewable: false };
  };

  const fileInfo = getFileInfo(file.contentType, file.filename);
  const FileIcon = fileInfo.icon;
  const viewUrl = `/api/files/view/${file.id}`;
  const downloadUrl = `/api/files/download/${file.id}`;

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPreview = () => {
    if (!fileInfo.previewable) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FileIcon className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-center">
            File ini tidak bisa di-preview.<br />
            Silakan download untuk membuka file.
          </p>
        </div>
      );
    }

    switch (fileInfo.type) {
      case 'image':
        return (
          <div className="relative">
            <img
              src={viewUrl}
              alt={file.filename}
              className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="hidden flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Image className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Gagal memuat gambar</p>
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="w-full h-96">
            <iframe
              src={viewUrl}
              className="w-full h-full rounded-lg border"
              title={file.filename}
            />
          </div>
        );

      case 'text':
        return (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
            <iframe
              src={viewUrl}
              className="w-full h-80 bg-white dark:bg-gray-900 rounded border-none"
              title={file.filename}
            />
          </div>
        );

      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <Music className="w-16 h-16 text-blue-500 mb-4" />
            <audio controls className="w-full max-w-md">
              <source src={viewUrl} type={file.contentType} />
              Browser Anda tidak mendukung audio player.
            </audio>
          </div>
        );

      case 'video':
        return (
          <div className="flex justify-center">
            <video controls className="max-w-full max-h-96 rounded-lg">
              <source src={viewUrl} type={file.contentType} />
              Browser Anda tidak mendukung video player.
            </video>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FileIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">File tidak dapat di-preview</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-surface rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center space-x-3">
            <FileIcon className="w-6 h-6 text-accent" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {file.title || file.filename}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {file.filename}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Preview Button */}
            {fileInfo.previewable && (
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-accent transition-colors"
                title="Buka di tab baru"
              >
                <Eye size={20} />
              </a>
            )}
            
            {/* Download Button */}
            <a
              href={downloadUrl}
              className="p-2 text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-accent transition-colors"
              title="Download file"
            >
              <Download size={20} />
            </a>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* File Info */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-dark-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Uploader:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {file.uploaderName}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Ukuran:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {formatFileSize(file.size)}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Upload:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {formatDate(file.uploadDate)}
              </span>
            </div>
          </div>
          
          {file.description && (
            <div className="mt-3">
              <span className="text-gray-600 dark:text-gray-400">Deskripsi:</span>
              <p className="mt-1 text-gray-900 dark:text-white">{file.description}</p>
            </div>
          )}
          
          {file.subject && (
            <div className="mt-2">
              <span className="text-gray-600 dark:text-gray-400">Mata Pelajaran:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {file.subject}
              </span>
            </div>
          )}
        </div>

        {/* Preview Content */}
        <div className="p-6">
          {renderPreview()}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-dark-border flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Tutup
          </button>
          <a
            href={downloadUrl}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;