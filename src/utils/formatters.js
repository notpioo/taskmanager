export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

export const formatDeadline = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'Overdue';
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else {
    return `${diffDays} days left`;
  }
};

export const getFileIcon = (contentType) => {
  if (!contentType) return '📄';
  
  if (contentType.includes('pdf')) return '📄';
  if (contentType.includes('image')) return '🖼️';
  if (contentType.includes('video')) return '🎥';
  if (contentType.includes('audio')) return '🎵';
  if (contentType.includes('text')) return '📝';
  if (contentType.includes('zip') || contentType.includes('rar')) return '📦';
  if (contentType.includes('word') || contentType.includes('document')) return '📝';
  if (contentType.includes('excel') || contentType.includes('spreadsheet')) return '📊';
  if (contentType.includes('powerpoint') || contentType.includes('presentation')) return '📋';
  
  return '📄';
};