import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, File, BookOpen, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const UploadForm = ({ onUploadSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    category: 'tugas' // 'tugas' or 'galeri'
  });
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoryChange = (category) => {
    setFormData({
      ...formData,
      category
    });
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setUploadStatus({ type: 'error', message: 'Pilih file terlebih dahulu' });
      return;
    }

    if (!formData.title.trim()) {
      setUploadStatus({ type: 'error', message: `Judul ${formData.category} harus diisi` });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('subject', formData.subject);
      uploadFormData.append('uploaderName', user.name);
      uploadFormData.append('userId', user.userId);
      uploadFormData.append('category', formData.category);

      const result = await api.uploadTugas(uploadFormData);
      
      setUploadStatus({ 
        type: 'success', 
        message: `${formData.category === 'galeri' ? 'Media' : 'Tugas'} berhasil diupload!` 
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        category: 'tugas'
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(formData.category);
      }

    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: error.message || `Gagal mengupload ${formData.category}` 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
          Upload {formData.category === 'galeri' ? 'Media ke Galeri' : 'Tugas Baru'}
        </h2>

        {/* Category Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">
            Kategori Upload
          </label>
          <div className="flex space-x-2 bg-gray-100 dark:bg-dark-surface p-1 rounded-lg">
            <button
              type="button"
              onClick={() => handleCategoryChange('tugas')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                formData.category === 'tugas'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <BookOpen size={18} />
              <span>Tugas</span>
            </button>
            <button
              type="button"
              onClick={() => handleCategoryChange('galeri')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                formData.category === 'galeri'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Image size={18} />
              <span>Galeri</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium mb-2">
              File {formData.category === 'galeri' ? 'Media' : 'Tugas'} <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                isDragging
                  ? 'border-accent bg-accent bg-opacity-5'
                  : file
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-dark-border hover:border-accent'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-between bg-white dark:bg-dark-surface p-3 rounded-lg border border-gray-200 dark:border-dark-border">
                  <div className="flex items-center space-x-3">
                    <File className="text-accent" size={20} />
                    <div className="text-left">
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drag & drop file di sini atau{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-accent hover:underline"
                    >
                      pilih file
                    </button>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.category === 'galeri' 
                      ? 'Mendukung gambar, video, dan media lainnya'
                      : 'Mendukung semua jenis file (PDF, Word, Image, dll.)'
                    }
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
              accept="*/*"
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Judul {formData.category === 'galeri' ? 'Media' : 'Tugas'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field"
              placeholder={`Masukkan judul ${formData.category}...`}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="input-field resize-none"
              placeholder={`Deskripsi ${formData.category} (opsional)...`}
            />
          </div>

          {/* Subject - Only for tugas */}
          {formData.category === 'tugas' && (
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Mata Pelajaran
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Contoh: Matematika, Bahasa Indonesia, dll."
              />
            </div>
          )}

          {/* User Info Display */}
          <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Diupload oleh:</strong> <span className="text-accent font-semibold">{user.name}</span>
            </div>
          </div>

          {/* Status Message */}
          {uploadStatus && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg animate-slide-up ${
              uploadStatus.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              {uploadStatus.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="text-sm font-medium">{uploadStatus.message}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full btn-primary flex items-center justify-center space-x-2 ${
              isUploading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Mengupload...</span>
              </>
            ) : (
              <>
                <Upload size={18} />
                <span>Upload {formData.category === 'galeri' ? 'ke Galeri' : 'Tugas'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;