import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, FileX, SortAsc, SortDesc } from 'lucide-react';
import { api } from '../utils/api';
import TaskCard from './TaskCard';

const TaskList = ({ refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterSubject, setFilterSubject] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await api.getTugas();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  useEffect(() => {
    let filtered = tasks.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.uploaderName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = !filterSubject || task.subject === filterSubject;
      
      return matchesSearch && matchesSubject;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'subject':
          aValue = (a.subject || '').toLowerCase();
          bValue = (b.subject || '').toLowerCase();
          break;
        case 'uploaderName':
          aValue = (a.uploaderName || '').toLowerCase();
          bValue = (b.uploaderName || '').toLowerCase();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        default: // uploadDate
          aValue = new Date(a.uploadDate);
          bValue = new Date(b.uploadDate);
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, sortBy, sortOrder, filterSubject]);

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const uniqueSubjects = [...new Set(tasks.map(task => task.subject).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0 bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
          Daftar Tugas ({filteredTasks.length})
        </h2>
        <button
          onClick={loadTasks}
          className="btn-secondary flex items-center space-x-2 self-start sm:self-auto"
        >
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari tugas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Subject Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="">Semua Mata Pelajaran</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field flex-1"
            >
              <option value="uploadDate">Tanggal Upload</option>
              <option value="title">Judul</option>
              <option value="subject">Mata Pelajaran</option>
              <option value="uploaderName">Nama Uploader</option>
              <option value="size">Ukuran File</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn-secondary px-3"
            >
              {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <FileX size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {tasks.length === 0 ? 'Belum Ada Tugas' : 'Tidak Ditemukan'}
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            {tasks.length === 0 
              ? 'Upload tugas pertama Anda untuk memulai'
              : 'Coba ubah kriteria pencarian atau filter'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleTaskDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;