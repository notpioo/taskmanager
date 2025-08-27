import React, { useState, useEffect } from 'react';
import { Image, Download, Trash2, Calendar, User, Eye } from 'lucide-react';
import { formatFileSize, formatDate } from '../utils/formatters';
import { api } from '../utils/api';
import FilePreviewModal from './FilePreviewModal';

const Gallery = () => {
  const [galeriItems, setGaleriItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    try {
      const data = await api.getGaleri();
      setGaleriItems(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError('Gagal memuat galeri');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (item) => {
    window.open(`/api/files/download/${item.id}`, '_blank');
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Yakin ingin menghapus "${item.title}"?`)) return;

    try {
      await api.deleteFile(item.id);
      setGaleriItems(prev => prev.filter(g => g.id !== item.id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Gagal menghapus item');
    }
  };

  const isImageFile = (contentType) => {
    return contentType && contentType.startsWith('image/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat galeri...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg inline-block">
          {error}
        </div>
      </div>
    );
  }

  if (galeriItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Image size={64} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Galeri Kosong
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Belum ada item di galeri. Silakan upload gambar terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Galeri
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Koleksi gambar dan media yang telah diupload
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {galeriItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Image Preview */}
            {isImageFile(item.contentType) ? (
              <div className="aspect-square bg-gray-100 dark:bg-dark-bg relative overflow-hidden">
                <img
                  src={`/api/files/view/${item.id}`}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-bg dark:to-gray-800 flex items-center justify-center">
                <Image size={48} className="text-gray-400" />
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}

              <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <User size={14} />
                  <span>{item.uploaderName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{formatDate(item.uploadDate)}</span>
                </div>
                <div>
                  <span>{formatFileSize(item.size)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowPreview(true);
                  }}
                  className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                >
                  <Eye size={14} />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleDownload(item)}
                  className="flex items-center justify-center bg-accent hover:bg-accent-hover text-white py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors duration-200"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <FilePreviewModal
        file={selectedItem}
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};

export default Gallery;