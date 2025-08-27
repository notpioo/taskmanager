import React, { useState } from 'react';
import { User, LogOut, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.name || !formData.password) {
      setError('Nama dan password harus diisi');
      setIsLoading(false);
      return;
    }

    try {
      const result = isLogin 
        ? await login(formData.name, formData.password)
        : await register(formData.name, formData.password);

      if (!result.success) {
        setError(result.error);
      } else {
        setFormData({ name: '', password: '' });
      }
    } catch (error) {
      setError('Terjadi kesalahan, silakan coba lagi');
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-200 dark:border-dark-border">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-accent to-accent-hover rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Selamat datang!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Login sebagai <span className="font-semibold text-accent">{user.name}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Informasi Akun
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Nama:</strong> {user.name}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-200 dark:border-dark-border">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-accent to-accent-hover rounded-full mx-auto mb-4 flex items-center justify-center">
            {isLogin ? <LogIn size={32} className="text-white" /> : <UserPlus size={32} className="text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? 'Login' : 'Daftar Akun'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nama
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              placeholder="Masukkan nama Anda"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memproses...' : (isLogin ? 'Login' : 'Daftar')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ name: '', password: '' });
            }}
            className="text-accent hover:text-accent-hover text-sm font-medium"
          >
            {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Login di sini'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;