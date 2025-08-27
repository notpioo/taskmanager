import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, File, User, Lock, Unlock } from 'lucide-react';
import { api } from '../utils/api';

const UploadForm = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    uploaderName: '',
    isPrivate: false,
    password: ''
  });
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
      setUploadStatus({ type: 'error', message: 'Judul tugas harus diisi' });
      return;
    }

    if (!formData.uploaderName.trim()) {
      setUploadStatus({ type: 'error', message: 'Nama uploader harus diisi' });
      return;
    }

    if (formData.isPrivate && !formData.password.trim()) {
      setUploadStatus({ type: 'error', message: 'Password harus diisi untuk tugas privat' });
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
      uploadFormData.append('uploaderName', formData.uploaderName);
      uploadFormData.append('isPrivate', formData.isPrivate);
      if (formData.isPrivate && formData.password) {
        uploadFormData.append('password', formData.password);
      }

      const result = await api.uploadTugas(uploadFormData);
      
      setUploadStatus({ 
        type: 'success', 
        message: 'Tugas berhasil diupload!' 
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        uploaderName: '',
        isPrivate: false,
        password: ''
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'Gagal mengupload tugas' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
          Upload Tugas Baru
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium mb-2">
              File Tugas <span className="text-red-500">*</span>
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
                    Mendukung semua jenis file (PDF, Word, Image, dll.)
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
              Judul Tugas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Masukkan judul tugas..."
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
              placeholder="Deskripsi tugas (opsional)..."
            />
          </div>

          {/* Subject */}
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

          {/* Uploader Name */}
          <div>
            <label htmlFor="uploaderName" className="block text-sm font-medium mb-2">
              Nama Uploader <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="uploaderName"
                name="uploaderName"
                value={formData.uploaderName}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Masukkan nama Anda..."
                required
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleInputChange}
                className="w-4 h-4 text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent dark:focus:ring-accent dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="isPrivate" className="flex items-center space-x-2 text-sm font-medium">
                {formData.isPrivate ? (
                  <Lock className="text-red-500" size={16} />
                ) : (
                  <Unlock className="text-green-500" size={16} />
                )}
                <span>Tugas Privat (Butuh Password untuk Akses)</span>
              </label>
            </div>
            
            {formData.isPrivate && (
              <div className="animate-slide-up">
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password Akses <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Masukkan password untuk tugas ini..."
                    required={formData.isPrivate}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Password ini diperlukan untuk mengakses dan mendownload tugas
                </p>
              </div>
            )}
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
                <span>Upload Tugas</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;